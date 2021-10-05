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
  distance: string;
  user: Schema.Types.ObjectId | null;
};

export class PracticeSessions extends Service {
  private db;

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongooseServiceOptions>, app: Application) {
    super(options);
    this.db = app.get('mongooseClient');
  }

  async compileStats(userId: string, distance: string, operator: string): Promise<any> {
    if (!userId) {
      return null;
    }

    // const distanceFilter = getDistanceFilter(distance, operator);
    // distance: { $lte: parseInt(distance || '0') }

    const res = await this.db.models.practiceSessions.aggregate([
      { $match: { $and: [{ user: userId, distance: { [operator]: Number(distance) } }] } },
      {
        $group: {
          _id: null,
          sessionCount: { $sum: 1 },
          hit: { $sum: '$hit' },
          left: { $sum: '$left' },
          right: { $sum: '$right' },
          top: { $sum: '$top' },
          bottom: { $sum: '$bottom' },
          distance: { $first: distance },
          total: { $sum: { $add: ['$hit', '$bottom', '$top', '$left', '$right'] } },
        },
      },
    ]);
    return res.length ? res[0] : { error: 'no user data found' };
  }

  async find(params: Params): Promise<any> {
    const user = params?.user?._id;
    const distance: string = params?.query?.distance;
    const operator: string = params?.query?.operator || '$eq';
    return this.compileStats(user, distance, operator);
  }

  async create(data: PracticeSessionData, params?: Params): Promise<PracticeSessionData> {
    const user = params?.user;
    data.user = params?.user?._id;
    const distance = parseInt(data.distance);
    const session = await super.create({ ...data, distance }, params);
    if (user) {
      await this.db.models.users.findByIdAndUpdate(user._id, { $push: { practiceSessions: session._id } });
    }
    return session;
  }
}
