import { app } from './server';

const DEFAULT_PORT = 4343;
const port = Number(process.env.PORT) || DEFAULT_PORT;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

process
  .on('uncaughtException', (err: Error, origin) => {
    console.error('Uncaught Exception:', err);
    console.error('Exception Origin:', origin);
  })
  .on('unhandledRejection', (err) => {
    console.error(err);
  });
