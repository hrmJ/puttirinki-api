import { Params } from '@feathersjs/feathers';
import { Service, MongooseServiceOptions } from 'feathers-mongoose';
import { Schema } from 'mongoose';
import { Application } from '../../declarations';

export type PracticeSessionData = {
  right: number;
  left: number;
  top: number;
  bottom: number;
  hit: number;
  user: Schema.Types.ObjectId;
};

export class PracticeSessions extends Service {
  private db;

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongooseServiceOptions>, app: Application) {
    super(options);
    this.db = app.get('mongooseClient');
  }

  async compileStats(userId: string): Promise<any> {
    if (!userId) {
      return null;
    }

    const res = await this.db.models.practiceSessions.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          sessionCount: { $sum: 1 },
          hit: { $sum: '$hit' },
          left: { $sum: '$left' },
          right: { $sum: '$right' },
          top: { $sum: '$top' },
          bottom: { $sum: '$bottom' },
          total: { $sum: { $add: ['$hit', '$bottom', '$top', '$left', '$right'] } },
        },
      },
    ]);
    return res.length ? res[0] : { error: 'no user data found' };
  }

  async find(params: Params): Promise<any> {
    const user = params?.user?._id;
    return this.compileStats(user);
  }

  async create(data: PracticeSessionData, params?: Params): Promise<PracticeSessions> {
    const user = params?.user;
    data.user = params?.user?._id;
    const session = await super.create({ ...data }, params);
    if (user) {
      await this.db.models.users.findByIdAndUpdate(user._id, { $push: { practiceSessions: session._id } });
    }
    return session;
  }
}
