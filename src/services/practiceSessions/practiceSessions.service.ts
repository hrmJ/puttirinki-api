import { Application } from '../../declarations';
import { PracticeSessions } from './practiceSessions.class';
import createModel from '../../models/users.model';

declare module '../../declarations' {
  interface ServiceTypes {
    practiceSessions: PracticeSessions & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  };

  app.use('/practiceSessions', new PracticeSessions(options, app));
  app.service('practiceSessions');
}
