import { spawn } from 'child_process';
import app from '../../src/app';
import { IUser } from '../../src/models/users.model';
const supertest = require('supertest');

const apiAddress = 'localhost:9090';

async function clearUsers() {
  const command = 'docker-compose';
  const args = ['exec', 'mongo-test', 'mongo', 'puttirinki_api', '--eval', 'db.users.deleteMany({})'];
  const options = {
    shell: true,
  };
  spawn(command, args, options);
}

type userResponse = {
  data: IUser[];
};

describe('users service', () => {
  beforeAll(async () => {
    process.stdout.write('Starting Server');
    clearUsers();
  });

  it('registers the service', () => {
    const service = app.service('users');
    expect(service).toBeTruthy();
  });

  it('responds with id if user ok', async () => {
    const users = (await app.service('users').find()) as userResponse;
    users.data.forEach(async (user) => {
      await app.service('users').remove(user._id);
    });
    const response = await supertest(app).post('/users', {
      username: 'telkjlkjstuser',
      password: 'testpw',
      email: 'xxxx@bb.com',
    });
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ _id: expect.stringMatching('') });
  });

  it('responds with error if username already taken', async () => {
    try {
      await app.service('users').create({
        username: 'testuser',
        password: 'testpw',
        email: 'zzzzaaa@bb.com',
      });
    } catch (error) {}
    const response = await supertest(app).post('/users', {
      username: 'testuser',
      password: 'testpw',
      email: 'aaa@bb.com',
    });
    expect(response.status).toEqual(409);
  });
});
