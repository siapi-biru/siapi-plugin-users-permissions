'use strict';

// Test a simple default API with no relations

const { createSiapiInstance } = require('../../../test/helpers/siapi');
const { createAuthRequest } = require('../../../test/helpers/request');

let siapi;
let rq;
let data = {};

describe('Users API', () => {
  beforeAll(async () => {
    siapi = await createSiapiInstance();
    rq = await createAuthRequest({ siapi });
  });

  afterAll(async () => {
    await siapi.destroy();
  });

  test('Create User', async () => {
    const user = {
      username: 'User 1',
      email: 'user1@siapi.io',
      password: 'test1234',
    };

    const res = await rq({
      method: 'POST',
      url: '/auth/local/register',
      body: user,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      jwt: expect.any(String),
      user: {
        username: user.username,
        email: user.email,
      },
    });
    data.user = res.body.user;
  });

  test('Delete user', async () => {
    const res = await rq({
      method: 'DELETE',
      url: `/users/${data.user.id}`,
    });

    expect(res.statusCode).toBe(200);
  });
});
