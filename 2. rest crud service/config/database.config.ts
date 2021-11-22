import { Options } from 'sequelize';

export const databaseConfig: Options = {
  dialect: 'postgres',
  database: 'postgres',
  username: 'postgres',
  password: 'password',
  host: 'localhost',
  port: 5432,
};
