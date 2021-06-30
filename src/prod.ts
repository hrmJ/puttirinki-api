import app from './app';
import serverless from 'serverless-http';

export default { handler: serverless(app) };
