import cookieParser from 'cookie-parser';
import express from 'express';
import 'express-async-errors';

import baseRouter from './base-router';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', baseRouter);

export { app };
