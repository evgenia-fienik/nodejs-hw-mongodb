import path from 'node:path';
import * as fs from 'node:fs';
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import routes from './routers/index.js';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const SWAGGER_DOCUMENT = JSON.parse(
  fs.readFileSync(path.join('docs', 'swagger.json')),
);

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(pino());
  app.use(cookieParser());

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(SWAGGER_DOCUMENT));

  app.use('/photos', express.static(path.resolve('src', 'uploads', 'photos')));

  app.set('json spaces', 2);

  app.use(routes);

  app.use(notFoundHandler);

  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
