import app from './app';
import serverless from 'serverless-http';

const handler = serverless(app);
module.exports.handler = async (event: any, context: any) => {
  // you can do other things here
  const result = await handler(event, context);
  // and here
  return result;
};

//export default { handler: serverless(app) };
