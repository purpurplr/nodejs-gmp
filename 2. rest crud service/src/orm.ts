import { Sequelize } from 'sequelize';
import { databaseConfig } from '../config/database.config';

const sequelize = new Sequelize(databaseConfig);

sequelize.authenticate();

export const orm = { sequelize };
