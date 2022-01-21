import { databaseConfig } from './database.config';

export const corsConfig = {
  origin: databaseConfig.host,
};
