import { Application } from '../declarations';
import { Model, Mongoose, Schema, Document } from 'mongoose';
import { PracticeSessionData } from '../services/practiceSessions/practiceSessions.class';

export interface IUser extends Document {
  email: string;
  name: string;
  username: string;
  password: string;
  practiceSessions: PracticeSessionData[];
}

export default function (app: Application): Model<IUser> {
  const modelName = 'users';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const schema: Schema = new mongooseClient.Schema(
    {
      email: { type: String, unique: true, lowercase: true },
      password: { type: String, require: true },
      name: { type: String },
      username: { type: String, unique: true, require: true },
    },
    {
      timestamps: true,
    },
  );

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }

  return mongooseClient.model<any>(modelName, schema);
}
