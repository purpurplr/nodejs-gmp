import { Client, QueryArrayResult } from 'pg';
import * as path from 'path';
import * as fs from 'fs';
import { databaseConfig } from '../config/database.config';

const client = new Client({
  user: databaseConfig.username,
  host: databaseConfig.host,
  database: databaseConfig.database,
  password: databaseConfig.password,
  port: databaseConfig.port,
});

client.connect();

const QUERY_PATH_LIST = ['init-users.sql', 'init-roles.sql', 'init-user-roles.sql'].map((queryPath: string) =>
  path.resolve(__dirname, 'queries', queryPath),
);

const joinedQuery = QUERY_PATH_LIST.reduce((acc: string, queryPath: string) => {
  const query: string = fs.readFileSync(queryPath, { encoding: 'utf-8' });
  return acc + query;
}, '');

client.query(joinedQuery, (error: Error | undefined, result: QueryArrayResult) => {
  if (error) console.error('Error', error);
  console.log('Result', result);
  client.end();
});
