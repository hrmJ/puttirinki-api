import app from '../../src/app';

describe('practiceSessions service', () => {
  it('registered the service', () => {
    const service = app.service('practiceSessions');
    expect(service).toBeTruthy();
  });
});
