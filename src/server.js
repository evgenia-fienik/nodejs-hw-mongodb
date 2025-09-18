import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
// import { getAllContacts, getContactById } from './services/contacts.js';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());

  //Відступи у JSON-відповіді
  app.set('json spaces', 2);

  //використання роутера у contacts
  app.use('/contacts', contactsRouter);

  //обробка неіснуючіх роутів
  app.use(notFoundHandler);

  //оброблює помилки
  app.use(errorHandler);

  //
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
