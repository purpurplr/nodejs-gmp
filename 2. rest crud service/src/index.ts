import { app } from './server';

const DEFAULT_PORT = 4343;
const port = Number(process.env.PORT) || DEFAULT_PORT;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
