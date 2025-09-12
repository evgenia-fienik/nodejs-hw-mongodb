import 'dotenv/config';
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

const startApp = async () => {
  //   console.log(
  //     'ENV:',
  //     process.env.MONGODB_USER,
  //     process.env.MONGODB_PASSWORD,
  //     process.env.MONGODB_URL,
  //     process.env.MONGODB_DB,
  //   );

  await initMongoConnection();
  setupServer();
};

startApp();
