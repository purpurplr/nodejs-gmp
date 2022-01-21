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
import { UsersService } from './users.service';
import { skipMiddleware } from '../testing/utils/skip-middleware';
import { User } from './users.model';
import { UserDraftDTO } from './users.interfaces';

jest.mock('jsonwebtoken');
jest.mock('sequelize');

jest.mock('./users.service');

jest.mock('../utils/check-jwt-token.middleware');
jest.mock('../utils/request-logger.middleware');
jest.mock('../utils/default-error-handler');

const middlewareToSkip = [checkJwtToken, requestLoggerMiddleware, defaultErrorHandler];

const MOCK_BASE_ROUTE = '/users';
const MOCK_ID: string = randomUUID();
const MOCK_NOT_UUID = '2';
const MOCK_ID_ROUTE = `${MOCK_BASE_ROUTE}/${MOCK_ID}`;

const [mockUsersService] = jest.mocked(UsersService).mock.instances;

const mockUser = {
  id: 'mockid',
  login: 'mocklogin',
  password: 'mockpassword43',
  age: 43,
} as User;

export const mockUserDraftDto: UserDraftDTO = {
  login: 'mocklogin',
  password: 'mockpassword43',
  age: 43,
};

const mockError = new Error('mock-error');

describe('Testing user controllers', () => {
  beforeAll(() => {
    middlewareToSkip.forEach((middleware) => skipMiddleware(middleware));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should check jwt token before proceeding', async () => {
      await supertest(app).get(`${MOCK_BASE_ROUTE}/`);
      expect(checkJwtToken).toHaveBeenCalled();
    });

    it('should log request with middleware', async () => {
      await supertest(app).get(`${MOCK_BASE_ROUTE}/`);
      expect(requestLoggerMiddleware).toHaveBeenCalled();
    });

    it('should respond with BAD_REQUEST status when called with invalid limit query param', async () => {
      const response = await supertest(app).get(`${MOCK_BASE_ROUTE}/`).query({ limit: -2 });
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should respond with BAD_REQUEST status when called with invalid login query param', async () => {
      const response = await supertest(app).get(`${MOCK_BASE_ROUTE}/`).query({ login: '$%^' });
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should respond with OK when called with no query params', async () => {
      const response = await supertest(app).get(`${MOCK_BASE_ROUTE}/`);
      expect(response.statusCode).toBe(StatusCodes.OK);
    });

    it('should use user service to query data', async () => {
      const params = { login: 'mocklogin', limit: 43 };
      await supertest(app).get(`${MOCK_BASE_ROUTE}/`).query(params);
      expect(mockUsersService.getAll).toHaveBeenCalledWith(params.login, params.limit);
    });

    it('should not get to the user service when query is invalid', async () => {
      const params = { login: '$%^', limit: '-2' };
      await supertest(app).get(`${MOCK_BASE_ROUTE}/`).query(params);
      expect(mockUsersService.getAll).not.toHaveBeenCalled();
    });

    it('should respond with the value returned by the user service', async () => {
      const params = { login: 'mocklogin', limit: 43 };
      jest.mocked(mockUsersService.getAll).mockReturnValue(Promise.resolve([mockUser]));
      const response = await supertest(app).get(`${MOCK_BASE_ROUTE}/`).query(params);
      expect(response.body).toEqual([mockUser]);
    });

    it('should move to the error logging middleware if service thrown an error', async () => {
      jest.mocked(mockUsersService.getAll).mockImplementation(() => Promise.reject(mockError));
      await supertest(app).get(`${MOCK_BASE_ROUTE}/`);
      expect(mockErrorLogger).toHaveBeenCalledWith(mockError, expect.anything(), expect.anything(), expect.anything());
    });

    it('should respond with NOT_FOUND if service thrown an error', async () => {
      jest.mocked(mockUsersService.getAll).mockImplementation(() => Promise.reject(mockError));
      const response = await supertest(app).get(`${MOCK_BASE_ROUTE}/`);
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    });
  });

  describe('getUserById', () => {
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

    it('should use user service to query data', async () => {
      await supertest(app).get(MOCK_ID_ROUTE);
      expect(mockUsersService.findByPk).toHaveBeenCalledWith(MOCK_ID);
    });

    it('should respond with the value returned by the user service', async () => {
      jest.mocked(mockUsersService.findByPk).mockReturnValue(Promise.resolve(mockUser));
      const response = await supertest(app).get(MOCK_ID_ROUTE);
      expect(response.body).toEqual(mockUser);
    });

    it('should respond with NOT_FOUND if the user service could not find the user', async () => {
      jest.mocked(mockUsersService.findByPk).mockReturnValue(Promise.resolve(null));
      const response = await supertest(app).get(MOCK_ID_ROUTE);
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    });

    it('should not get to the user service when id param is invalid', async () => {
      await supertest(app).get(`${MOCK_BASE_ROUTE}/${MOCK_NOT_UUID}`);
      expect(mockUsersService.findByPk).not.toHaveBeenCalled();
    });

    it('should move to the error logging middleware if service thrown an error', async () => {
      jest.mocked(mockUsersService.findByPk).mockImplementation(() => Promise.reject(mockError));
      await supertest(app).get(MOCK_ID_ROUTE);
      expect(mockErrorLogger).toHaveBeenCalledWith(mockError, expect.anything(), expect.anything(), expect.anything());
    });

    it('should respond with NOT_FOUND if service thrown an error', async () => {
      jest.mocked(mockUsersService.findByPk).mockImplementation(() => Promise.reject(mockError));
      const response = await supertest(app).get(MOCK_ID_ROUTE);
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    });
  });

  describe('createUser', () => {
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

    it('should pass request body to the user service', async () => {
      await supertest(app).post(MOCK_BASE_ROUTE).send(mockUserDraftDto);
      expect(mockUsersService.create).toHaveBeenCalledWith(mockUserDraftDto);
    });

    it('should respond with the value returned by the user service', async () => {
      jest.mocked(mockUsersService.create).mockReturnValue(Promise.resolve(mockUser));
      const response = await supertest(app).post(MOCK_BASE_ROUTE).send(mockUserDraftDto);
      expect(response.body).toEqual(mockUser);
    });

    it('should not get to the user service when request body is invalid', async () => {
      await supertest(app).post(MOCK_BASE_ROUTE);
      expect(mockUsersService.create).not.toHaveBeenCalled();
    });

    it('should move to the error logging middleware if service thrown an error', async () => {
      jest.mocked(mockUsersService.create).mockImplementation(() => Promise.reject(mockError));
      await supertest(app).post(MOCK_BASE_ROUTE).send(mockUserDraftDto);
      expect(mockErrorLogger).toHaveBeenCalledWith(mockError, expect.anything(), expect.anything(), expect.anything());
    });

    it('should respond with NOT_FOUND if the user service could not create the user', async () => {
      jest.mocked(mockUsersService.create).mockImplementation(() => Promise.reject(mockError));
      const response = await supertest(app).post(MOCK_BASE_ROUTE).send(mockUserDraftDto);
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    });
  });

  describe('patchUser', () => {
    it('should check jwt token before proceeding', async () => {
      await supertest(app).patch(MOCK_ID_ROUTE);
      expect(checkJwtToken).toHaveBeenCalled();
    });

    it('should log request with middleware', async () => {
      await supertest(app).patch(MOCK_ID_ROUTE);
      expect(requestLoggerMiddleware).toHaveBeenCalled();
    });

    it('should respond with BAD_REQUEST status when called with an invalid id', async () => {
      const response = await supertest(app).patch(`${MOCK_BASE_ROUTE}/${MOCK_NOT_UUID}`).send(mockUserDraftDto);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should respond with BAD_REQUEST status when called with an invalid body', async () => {
      const response = await supertest(app).patch(MOCK_ID_ROUTE).send({ kek: 'lol' });
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should respond with BAD_REQUEST status when called with no body', async () => {
      const response = await supertest(app).patch(MOCK_ID_ROUTE);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should pass request body to the user service', async () => {
      await supertest(app).patch(MOCK_ID_ROUTE).send(mockUserDraftDto);
      expect(mockUsersService.patch).toHaveBeenCalledWith(MOCK_ID, mockUserDraftDto);
    });

    it('should respond with the value returned by the user service', async () => {
      jest.mocked(mockUsersService.patch).mockReturnValue(Promise.resolve(mockUser));
      const response = await supertest(app).patch(MOCK_ID_ROUTE).send(mockUserDraftDto);
      expect(response.body).toEqual(mockUser);
    });

    it('should not get to the user service when request body is invalid', async () => {
      await supertest(app).patch(MOCK_ID_ROUTE);
      expect(mockUsersService.patch).not.toHaveBeenCalled();
    });

    it('should move to the error logging middleware if service thrown an error', async () => {
      jest.mocked(mockUsersService.patch).mockImplementation(() => Promise.reject(mockError));
      await supertest(app).patch(MOCK_ID_ROUTE).send(mockUserDraftDto);
      expect(mockErrorLogger).toHaveBeenCalledWith(mockError, expect.anything(), expect.anything(), expect.anything());
    });

    it('should respond with NOT_FOUND if the user service could not create the user', async () => {
      jest.mocked(mockUsersService.patch).mockImplementation(() => Promise.reject(mockError));
      const response = await supertest(app).patch(MOCK_ID_ROUTE).send(mockUserDraftDto);
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    });
  });

  describe('softDelete', () => {
    it('should check jwt token before proceeding', async () => {
      await supertest(app).delete(MOCK_ID_ROUTE);
      expect(checkJwtToken).toHaveBeenCalled();
    });

    it('should log request with middleware', async () => {
      await supertest(app).delete(MOCK_ID_ROUTE);
      expect(requestLoggerMiddleware).toHaveBeenCalled();
    });

    it('should respond with BAD_REQUEST status when called with an invalid id', async () => {
      const response = await supertest(app).delete(`${MOCK_BASE_ROUTE}/${MOCK_NOT_UUID}`).send(mockUserDraftDto);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should pass parameters to the user service', async () => {
      jest.mocked(mockUsersService.findByPk).mockReturnValue(Promise.resolve(mockUser));
      await supertest(app).delete(MOCK_ID_ROUTE).send(mockUserDraftDto);
      expect(mockUsersService.findByPk).toHaveBeenCalledWith(MOCK_ID);
      expect(mockUsersService.delete).toHaveBeenCalledWith(MOCK_ID);
    });

    it('should respond with OK if user was successfully deleted', async () => {
      jest.mocked(mockUsersService.findByPk).mockReturnValue(Promise.resolve(mockUser));
      const response = await supertest(app).delete(MOCK_ID_ROUTE).send(mockUserDraftDto);
      expect(response.statusCode).toEqual(StatusCodes.OK);
    });

    it('should not get to the user service when request id is invalid', async () => {
      await supertest(app).delete(`${MOCK_BASE_ROUTE}/${MOCK_NOT_UUID}`);
      expect(mockUsersService.delete).not.toHaveBeenCalled();
    });

    it('should move to the error logging middleware if service thrown an error', async () => {
      jest.mocked(mockUsersService.findByPk).mockImplementation(() => Promise.reject(mockError));
      await supertest(app).delete(MOCK_ID_ROUTE);
      expect(mockErrorLogger).toHaveBeenCalledWith(mockError, expect.anything(), expect.anything(), expect.anything());
    });

    it('should respond with NOT_FOUND if the user service could not create the user', async () => {
      jest.mocked(mockUsersService.findByPk).mockImplementation(() => Promise.reject(mockError));
      const response = await supertest(app).delete(MOCK_ID_ROUTE);
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    });
  });
});
