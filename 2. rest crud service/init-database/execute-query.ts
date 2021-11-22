import { Client, QueryArrayResult } from 'pg';
import { promises as pfs } from 'fs';

export async function executeQuery(client: Client, queryPath: string): Promise<QueryArrayResult> {
  const query = await pfs.readFile(queryPath, { encoding: 'utf-8' });

  return new Promise((resolve, reject) => {
    client.query(query, (error: Error | undefined, result: QueryArrayResult) => {
      if (error) reject(error);
      resolve(result);
    });
  });
}
