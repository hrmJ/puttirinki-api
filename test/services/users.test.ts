import { spawn } from 'child_process';
import app from '../../src/app';
const supertest = require('supertest');

const apiAddress = 'localhost:9090';

describe('users service', () => {
  beforeAll(async () => {
    process.stdout.write('Starting Server');
    const command = 'docker-compose';
    const args = ['exec', 'mongo-test', 'mongo', 'puttirinki_api', '--eval', 'db.users.deleteMany({})'];
    const options = {
      shell: true,
    };
    spawn(command, args, options);
  });

  it('registers the service', () => {
    const service = app.service('users');
    expect(service).toBeTruthy();
  });

  it('responds with id if user ok', async () => {
    const response = await supertest(app).post('/users', {
      username: 'testuser',
      password: 'testpw',
      email: 'aaa@bb.com',
    });
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ _id: expect.stringMatching('') });
  });

  it('responds with error if username already taken', async () => {
    await app.service('users').create({
      username: 'testuser',
      password: 'testpw',
      email: 'aaa@bb.com',
    });
    const response = await supertest(app).post('/users', {
      username: 'testuser',
      password: 'testpw',
      email: 'aaa@bb.com',
    });
    expect(response.status).toEqual(409);
  });
});
