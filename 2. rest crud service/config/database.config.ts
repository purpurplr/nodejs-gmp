import 'dotenv/config';
import { Dialect, Options } from 'sequelize';

export const databaseConfig: Options = {
  database: process.env.DB,
  dialect: process.env.DB_DIALECT as Dialect,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
};
