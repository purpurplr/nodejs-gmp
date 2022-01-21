import cookieParser from 'cookie-parser';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';

import baseRouter from './base-router';
import { requestLoggerMiddleware } from './utils/request-logger.middleware';
import { defaultErrorHandler } from './utils/default-error-handler';
import authRouter from './auth/auth.router';
import { corsConfig } from '../config/cors.config';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsConfig));

app.use(requestLoggerMiddleware);

app.use('/auth', authRouter);

app.use('/', baseRouter);

app.use(defaultErrorHandler);

export { app };
