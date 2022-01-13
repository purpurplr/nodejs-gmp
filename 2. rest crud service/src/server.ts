import cookieParser from 'cookie-parser';
import express from 'express';
import 'express-async-errors';

import baseRouter from './base-router';
import { requestLoggerMiddleware } from './utils/request-logger.middleware';
import { defaultErrorHandler } from './utils/default-error-handler';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLoggerMiddleware);

app.use('/', baseRouter);

app.use(defaultErrorHandler);

export { app };
