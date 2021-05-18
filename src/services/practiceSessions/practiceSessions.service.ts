import { Application } from '../../declarations';
import { PracticeSessions } from './practiceSessions.class';
import createModel from '../../models/practiceSessions.model';
import { ServiceAddons } from '@feathersjs/feathers';

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
