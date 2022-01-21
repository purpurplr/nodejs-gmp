import 'express-async-errors';

const mockErrorLogger = jest.fn((error: Error | undefined, req: Request, res: Response, next: NextFunction) => {
  next();
});

jest.doMock('../decorators/error-logger-factory', () => ({
  errorLoggerFactory<T>(parentConstructor: Type<T>, propertyKey: string): ErrorRequestHandler {
    return mockErrorLogger;
  },
}));

import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import supertest from 'supertest';
import { randomUUID } from 'crypto';

import { StatusCodes } from 'http-status-codes';
import { app } from '../server';
import { Type } from '../interfaces/utility-types';
import { checkJwtToken } from '../utils/check-jwt-token.middleware';
import { requestLoggerMiddleware } from '../utils/request-logger.middleware';
import { defaultErrorHandler } from '../utils/default-error-handler';
import { RolesService } from './roles.service';
import { skipMiddleware } from '../testing/utils/skip-middleware';
import { Role } from './roles.model';
import { RoleDraftDTO } from './roles.interfaces';

jest.mock('jsonwebtoken');
jest.mock('sequelize');

jest.mock('./roles.service');

jest.mock('../utils/check-jwt-token.middleware');
jest.mock('../utils/request-logger.middleware');
jest.mock('../utils/default-error-handler');

const middlewareToSkip = [checkJwtToken, requestLoggerMiddleware, defaultErrorHandler];

const MOCK_BASE_ROUTE = '/roles';
const MOCK_ID: string = randomUUID();
const MOCK_NOT_UUID = '2';
const MOCK_ID_ROUTE = `${MOCK_BASE_ROUTE}/${MOCK_ID}`;

const [mockRolesService] = jest.mocked(RolesService).mock.instances;

const mockRole = {
  name: 'mockname',
  permissions: ['READ', 'WRITE'],
} as Role;
export const mockRoleDto: RoleDraftDTO = { ...mockRole };

const mockError = new Error('mock-error');

describe('Testing roles controllers', () => {
  beforeAll(() => {
    middlewareToSkip.forEach((middleware) => skipMiddleware(middleware));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should check jwt token before proceeding', async () => {
      await supertest(app).get(MOCK_BASE_ROUTE);
      expect(checkJwtToken).toHaveBeenCalled();
    });

    it('should log request with middleware', async () => {
      await supertest(app).get(MOCK_BASE_ROUTE);
      expect(requestLoggerMiddleware).toHaveBeenCalled();
    });

    it('should respond with OK', async () => {
      const response = await supertest(app).get(`${MOCK_BASE_ROUTE}/`);
      expect(response.statusCode).toBe(StatusCodes.OK);
    });

    it('should use roles service to query data', async () => {
      await supertest(app).get(MOCK_BASE_ROUTE);
      expect(mockRolesService.getAll).toHaveBeenCalled();
    });

    it('should respond with the value returned by the roles service', async () => {
      jest.mocked(mockRolesService.getAll).mockReturnValue(Promise.resolve([mockRole]));
      const response = await supertest(app).get(`${MOCK_BASE_ROUTE}/`);
      expect(response.body).toEqual([mockRole]);
    });

    it('should move to the error logging middleware if service thrown an error', async () => {
      jest.mocked(mockRolesService.getAll).mockImplementation(() => Promise.reject(mockError));
      await supertest(app).get(MOCK_BASE_ROUTE);
      expect(mockErrorLogger).toHaveBeenCalledWith(mockError, expect.anything(), expect.anything(), expect.anything());
    });

    it('should respond with NOT_FOUND if service thrown an error', async () => {
      jest.mocked(mockRolesService.getAll).mockImplementation(() => Promise.reject(mockError));
      const response = await supertest(app).get(`${MOCK_BASE_ROUTE}/`);
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    });
  });

  describe('getRoleById', () => {
    it('should check jwt token before proceeding', async () => {
      await supertest(app).get(MOCK_ID_ROUTE);
      expect(checkJwtToken).toHaveBeenCalled();
    });

    it('should log request with middleware', async () => {
      await supertest(app).get(MOCK_ID_ROUTE);
      expect(requestLoggerMiddleware).toHaveBeenCalled();
    });

    it('should respond with BAD_REQUEST status when called with invalid id param', async () => {
      const response = await supertest(app).get(`${MOCK_BASE_ROUTE}/${MOCK_NOT_UUID}`);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should use roles service to query data', async () => {
      await supertest(app).get(MOCK_ID_ROUTE);
      expect(mockRolesService.findByPk).toHaveBeenCalledWith(MOCK_ID);
    });

    it('should respond with the value returned by the roles service', async () => {
      jest.mocked(mockRolesService.findByPk).mockReturnValue(Promise.resolve(mockRole));
      const response = await supertest(app).get(MOCK_ID_ROUTE);
      expect(response.body).toEqual(mockRole);
    });

    it('should respond with NOT_FOUND if the roles service could not find the roles', async () => {
      jest.mocked(mockRolesService.findByPk).mockReturnValue(Promise.resolve(null));
      const response = await supertest(app).get(MOCK_ID_ROUTE);
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    });

    it('should not get to the roles service when id param is invalid', async () => {
      await supertest(app).get(`${MOCK_BASE_ROUTE}/${MOCK_NOT_UUID}`);
      expect(mockRolesService.findByPk).not.toHaveBeenCalled();
    });

    it('should move to the error logging middleware if service thrown an error', async () => {
      jest.mocked(mockRolesService.findByPk).mockImplementation(() => Promise.reject(mockError));
      await supertest(app).get(MOCK_ID_ROUTE);
      expect(mockErrorLogger).toHaveBeenCalledWith(mockError, expect.anything(), expect.anything(), expect.anything());
    });

    it('should respond with NOT_FOUND if service thrown an error', async () => {
      jest.mocked(mockRolesService.findByPk).mockImplementation(() => Promise.reject(mockError));
      const response = await supertest(app).get(MOCK_ID_ROUTE);
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    });
  });

  describe('createRoles', () => {
    it('should check jwt token before proceeding', async () => {
      await supertest(app).post(MOCK_BASE_ROUTE);
      expect(checkJwtToken).toHaveBeenCalled();
    });

    it('should log request with middleware', async () => {
      await supertest(app).post(MOCK_BASE_ROUTE);
      expect(requestLoggerMiddleware).toHaveBeenCalled();
    });

    it('should respond with BAD_REQUEST status when called with an invalid body', async () => {
      const response = await supertest(app).post(MOCK_BASE_ROUTE).send({ kek: 'lol' });
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should respond with BAD_REQUEST status when called with no body', async () => {
      const response = await supertest(app).post(MOCK_BASE_ROUTE);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should pass request body to the roles service', async () => {
      await supertest(app).post(MOCK_BASE_ROUTE).send(mockRoleDto);
      expect(mockRolesService.create).toHaveBeenCalledWith(mockRoleDto);
    });

    it('should respond with the value returned by the roles service', async () => {
      jest.mocked(mockRolesService.create).mockReturnValue(Promise.resolve(mockRole));
      const response = await supertest(app).post(MOCK_BASE_ROUTE).send(mockRoleDto);
      expect(response.body).toEqual(mockRole);
    });

    it('should not get to the roles service when request body is invalid', async () => {
      await supertest(app).post(MOCK_BASE_ROUTE);
      expect(mockRolesService.create).not.toHaveBeenCalled();
    });

    it('should move to the error logging middleware if service thrown an error', async () => {
      jest.mocked(mockRolesService.create).mockImplementation(() => Promise.reject(mockError));
      await supertest(app).post(MOCK_BASE_ROUTE).send(mockRoleDto);
      expect(mockErrorLogger).toHaveBeenCalledWith(mockError, expect.anything(), expect.anything(), expect.anything());
    });

    it('should respond with NOT_FOUND if the roles service could not create the roles', async () => {
      jest.mocked(mockRolesService.create).mockImplementation(() => Promise.reject(mockError));
      const response = await supertest(app).post(MOCK_BASE_ROUTE).send(mockRoleDto);
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    });
  });

  describe('patchRole', () => {
    it('should check jwt token before proceeding', async () => {
      await supertest(app).patch(MOCK_ID_ROUTE);
      expect(checkJwtToken).toHaveBeenCalled();
    });

    it('should log request with middleware', async () => {
      await supertest(app).patch(MOCK_ID_ROUTE);
      expect(requestLoggerMiddleware).toHaveBeenCalled();
    });

    it('should respond with BAD_REQUEST status when called with an invalid id', async () => {
      const response = await supertest(app).patch(`${MOCK_BASE_ROUTE}/${MOCK_NOT_UUID}`).send(mockRoleDto);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should respond with BAD_REQUEST status when called with an invalid body', async () => {
      const response = await supertest(app).patch(MOCK_ID_ROUTE).send({ kek: 'lol' });
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should pass request body to the roles service', async () => {
      await supertest(app).patch(MOCK_ID_ROUTE).send(mockRoleDto);
      expect(mockRolesService.patch).toHaveBeenCalledWith(MOCK_ID, mockRoleDto);
    });

    it('should respond with the value returned by the roles service', async () => {
      jest.mocked(mockRolesService.patch).mockReturnValue(Promise.resolve(mockRole));
      const response = await supertest(app).patch(MOCK_ID_ROUTE).send(mockRoleDto);
      expect(response.body).toEqual(mockRole);
    });

    it('should move to the error logging middleware if service thrown an error', async () => {
      jest.mocked(mockRolesService.patch).mockImplementation(() => Promise.reject(mockError));
      await supertest(app).patch(MOCK_ID_ROUTE).send(mockRoleDto);
      expect(mockErrorLogger).toHaveBeenCalledWith(mockError, expect.anything(), expect.anything(), expect.anything());
    });

    it('should respond with NOT_FOUND if the roles service could not create the roles', async () => {
      jest.mocked(mockRolesService.patch).mockImplementation(() => Promise.reject(mockError));
      const response = await supertest(app).patch(MOCK_ID_ROUTE).send(mockRoleDto);
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    });
  });

  describe('hardDelete', () => {
    it('should check jwt token before proceeding', async () => {
      await supertest(app).delete(MOCK_ID_ROUTE);
      expect(checkJwtToken).toHaveBeenCalled();
    });

    it('should log request with middleware', async () => {
      await supertest(app).delete(MOCK_ID_ROUTE);
      expect(requestLoggerMiddleware).toHaveBeenCalled();
    });

    it('should respond with BAD_REQUEST status when called with an invalid id', async () => {
      const response = await supertest(app).delete(`${MOCK_BASE_ROUTE}/${MOCK_NOT_UUID}`).send(mockRoleDto);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should pass parameters to the roles service', async () => {
      jest.mocked(mockRolesService.findByPk).mockReturnValue(Promise.resolve(mockRole));
      await supertest(app).delete(MOCK_ID_ROUTE).send(mockRoleDto);
      expect(mockRolesService.findByPk).toHaveBeenCalledWith(MOCK_ID);
      expect(mockRolesService.delete).toHaveBeenCalledWith(MOCK_ID);
    });

    it('should respond with OK if roles were successfully deleted', async () => {
      jest.mocked(mockRolesService.findByPk).mockReturnValue(Promise.resolve(mockRole));
      const response = await supertest(app).delete(MOCK_ID_ROUTE).send(mockRoleDto);
      expect(response.statusCode).toEqual(StatusCodes.OK);
    });

    it('should not get to the roles service when request id is invalid', async () => {
      await supertest(app).delete(`${MOCK_BASE_ROUTE}/${MOCK_NOT_UUID}`);
      expect(mockRolesService.delete).not.toHaveBeenCalled();
    });

    it('should move to the error logging middleware if service thrown an error', async () => {
      jest.mocked(mockRolesService.findByPk).mockImplementation(() => Promise.reject(mockError));
      await supertest(app).delete(MOCK_ID_ROUTE);
      expect(mockErrorLogger).toHaveBeenCalledWith(mockError, expect.anything(), expect.anything(), expect.anything());
    });

    it('should respond with NOT_FOUND if the roles service could not create the roles', async () => {
      jest.mocked(mockRolesService.findByPk).mockImplementation(() => Promise.reject(mockError));
      const response = await supertest(app).delete(MOCK_ID_ROUTE);
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    });
  });

  describe('assignRoleToUsers', () => {
    const ASSIGN_ROLE_ROUTE = `${MOCK_ID_ROUTE}/assign`;
    const INVALID_ASSIGN_ROLE_ROUTE = `${MOCK_BASE_ROUTE}/${MOCK_NOT_UUID}/assign`;
    const mockPayload = { userIds: [MOCK_ID] };

    it('should check jwt token before proceeding', async () => {
      await supertest(app).post(ASSIGN_ROLE_ROUTE).send(mockPayload);
      expect(checkJwtToken).toHaveBeenCalled();
    });

    it('should log request with middleware', async () => {
      await supertest(app).post(ASSIGN_ROLE_ROUTE).send(mockPayload);
      expect(requestLoggerMiddleware).toHaveBeenCalled();
    });

    it('should respond with BAD_REQUEST status when called with an invalid id', async () => {
      const response = await supertest(app).post(INVALID_ASSIGN_ROLE_ROUTE).send([{}]);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should pass parameters to the roles service', async () => {
      await supertest(app).post(ASSIGN_ROLE_ROUTE).send(mockPayload);
      expect(mockRolesService.assignRoleToUsers).toHaveBeenCalledWith(MOCK_ID, mockPayload.userIds);
    });

    it('should respond with OK if roles were successfully assigned', async () => {
      const response = await supertest(app).post(ASSIGN_ROLE_ROUTE).send(mockPayload);
      expect(response.statusCode).toEqual(StatusCodes.OK);
    });

    it('should not get to the roles service when request id is invalid', async () => {
      await supertest(app).post(INVALID_ASSIGN_ROLE_ROUTE);
      expect(mockRolesService.assignRoleToUsers).not.toHaveBeenCalled();
    });

    it('should move to the error logging middleware if service thrown an error', async () => {
      jest.mocked(mockRolesService.assignRoleToUsers).mockImplementation(() => Promise.reject(mockError));
      await supertest(app).post(ASSIGN_ROLE_ROUTE).send(mockPayload);
      expect(mockErrorLogger).toHaveBeenCalledWith(mockError, expect.anything(), expect.anything(), expect.anything());
    });

    it('should respond with NOT_FOUND if the roles service could not assign the roles', async () => {
      jest.mocked(mockRolesService.findByPk).mockImplementation(() => Promise.reject(mockError));
      const response = await supertest(app).post(ASSIGN_ROLE_ROUTE).send(mockPayload);
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    });
  });
});
