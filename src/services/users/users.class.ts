import { Service, MongooseServiceOptions } from 'feathers-mongoose';
import { Application } from '../../declarations';
import { IUser } from '../../models/users.model';

export class Users extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongooseServiceOptions>, app: Application) {
    super(options);
  }

  async get(id: string): Promise<Pick<IUser, '_id' | 'name'>> {
    const user = await super.get(id);
    const { _id, username } = user;
    return { _id, name: username };
  }
}
