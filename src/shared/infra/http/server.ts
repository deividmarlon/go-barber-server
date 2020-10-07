import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import {errors} from 'celebrate';
import 'express-async-errors';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

function logRequests(request: Request, response: Response, next: NextFunction) {
  const { method, url } = request;
  const now = new Date();
  const logLabel = `[${method.toUpperCase()}] ${url} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

  console.time(logLabel);

  next();

  console.timeEnd(logLabel);
  console.log(request.body);
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(logRequests);
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

/** Trativas de Erros
 * Middlewarers que são específicos para tratativas de erros no express
 * são obrigados a receber 4 parâmentros
 */
app.use(errors());
app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }

    console.error(err);

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

app.listen(3333, () => {
  console.log('Server started on port 3333!');
});
