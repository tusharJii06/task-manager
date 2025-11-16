import { app } from './app';
import { env } from './config/env';

const port = parseInt(env.port, 10);

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
