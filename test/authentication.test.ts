import app from '../src/app';

describe('authentication', () => {
  it('registered the authentication service', () => {
    expect(app.service('authentication')).toBeTruthy();
  });

  describe('local strategy', () => {
    const userInfo = {
      name: 'Testy Tester',
      username: 'thisuser',
      email: 'thisuser2@aaa.com',
      password: 'supersecret',
    };

    beforeAll(async () => {
      try {
        await app.service('users').create(userInfo);
      } catch (error) {
        // Do nothing, it just means the user already exists and can be tested
      }
    });

    it('authenticates user and creates accessToken', async () => {
      const { user, accessToken } = await app.service('authentication').create(
        {
          strategy: 'local',
          username: 'thisuser',
          password: 'supersecret',
        },
        {},
      );

      expect(accessToken).toBeTruthy();
      expect(user).toBeTruthy();
    });
  });
});
