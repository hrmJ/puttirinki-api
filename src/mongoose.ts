import mongoose from 'mongoose';
import { Application } from './declarations';
import logger from './logger';
import dotenv from 'dotenv';
dotenv.config();

export default function (app: Application): void {
  const basicOpts = { useCreateIndex: true, useNewUrlParser: true };
  const connectionOpts =
    process.env.NODE_ENV === 'production'
      ? {
          ...basicOpts,
          pass: process.env.MONGO_PASS || app.get('mongopass'),
          user: process.env.MONGO_UNAME || app.get('mongouname'),
        }
      : { ...basicOpts };
  mongoose.connect(process.env.MONGO_URI || app.get('mongouri'), connectionOpts).catch((err) => {
    logger.error(err);
    process.exit(1);
  });

  app.set('mongooseClient', mongoose);
}
