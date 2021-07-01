import mongoose from 'mongoose';
import { Application } from './declarations';
import logger from './logger';
import dotenv from 'dotenv';
dotenv.config();

export default function (app: Application): void {
  const connectionOpts = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true };
  mongoose.connect(process.env.MONGO_URI || app.get('mongouri'), connectionOpts).catch((err) => {
    logger.error(err);
    process.exit(1);
  });

  app.set('mongooseClient', mongoose);
}
