import mongoose from 'mongoose';
import { Application } from './declarations';
import logger from './logger';
import dotenv from 'dotenv';
dotenv.config();

export default function (app: Application): void {
  mongoose
    .connect(process.env.MONGO_URI || app.get('mongouri'), {
      useCreateIndex: true,
      useNewUrlParser: true,
      pass: process.env.MONGO_PASS || app.get('mongopass'),
      user: process.env.MONGO_UNAME || app.get('mongouname'),
    })
    .catch((err) => {
      logger.error(err);
      process.exit(1);
    });

  app.set('mongooseClient', mongoose);
}
