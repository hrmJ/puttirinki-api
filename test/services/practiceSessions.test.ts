import app from '../../src/app';

describe('practiceSessions service', () => {
  it('registered the service', () => {
    const service = app.service('practiceSessions');
    expect(service).toBeTruthy();
  });

  it('creates a practiceSession', async () => {
    expect.assertions(1);
    const session = await app.service('practiceSessions').create({
      top: 0,
      left: 0,
      right: 2,
      bottom: 0,
      hit: 0,
      user: null,
    });
    expect(session.right).toEqual(2);
  });
});
