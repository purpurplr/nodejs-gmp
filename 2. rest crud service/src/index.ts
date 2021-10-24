import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { app } from './server';

const DEFAULT_PORT = 4343;
const port = Number(process.env.PORT) || DEFAULT_PORT;

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
