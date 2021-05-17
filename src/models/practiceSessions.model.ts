import { Application } from '../declarations';
import { Model, Mongoose } from 'mongoose';

export type practiceSession = {
  right: number;
  left: number;
  top: number;
  bottom: number;
  hit: number;
};

export default function (app: Application): Model<any> {
  const modelName = 'practiceSessions';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const schema = new mongooseClient.Schema(
    {
      right: { type: Number },
      left: { type: Number },
      top: { type: Number },
      bottom: { type: Number },
      hit: { type: Number },
    },
    {
      timestamps: true,
    },
  );

  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  return mongooseClient.model<any>(modelName, schema);
}
