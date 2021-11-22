import { Client, QueryArrayResult } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { databaseConfig } from '../config/database.config';

console.log(1);
console.log(__dirname);

const client = new Client({
  user: databaseConfig.username,
  host: databaseConfig.host,
  database: databaseConfig.database,
  password: databaseConfig.password,
  port: databaseConfig.port,
});

client.connect();

const queryPath = path.resolve(__dirname, 'init-users.sql');
const query = fs.readFileSync(queryPath, { encoding: 'utf-8' });

client.query(query, (err: Error | undefined, res: QueryArrayResult | undefined) => {
  if (err) console.log('Error', err);
  if (res) console.log('Results', res);
  client.end();
});
