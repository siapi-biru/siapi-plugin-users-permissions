'use strict';

// Test a simple default API with no relations

const { createSiapiInstance } = require('../../../test/helpers/siapi');
const { createAuthRequest } = require('../../../test/helpers/request');

let siapi;
let rq;
let data = {};
let internals = {
  user: {
    username: 'User 1',
    email: 'user1@siapi.io',
    password: 'test1234',
  },
  role: {
    name: 'Test Role',
    description: 'Some random test role',
  },
};

/**
 * Utils for this test files
 */
const createTestUser = () =>
  rq({
    method: 'POST',
    url: '/auth/local/register',
    body: internals.user,
  });

const deleteTestUser = () =>
  rq({
    method: 'DELETE',
    url: `/users/${data.user.id}`,
  });

/*****************************
 * TESTS
 *****************************/
describe('Roles API', () => {
  beforeAll(async () => {
    siapi = await createSiapiInstance();
    rq = await createAuthRequest({ siapi });

    const res = await createTestUser();
    data.user = res.body.user;
  });

  afterAll(async () => {
    await deleteTestUser();
    await siapi.destroy();
  });

  test('Create Role', async () => {
    const res = await rq({
      method: 'POST',
      url: '/users-permissions/roles',
      body: {
        ...internals.role,
        permissions: [],
        users: [data.user],
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ ok: true });
  });

  test('List Roles', async () => {
    const res = await rq({
      method: 'GET',
      url: '/users-permissions/roles',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.roles).toEqual(
      expect.arrayContaining([expect.objectContaining(internals.role)])
    );

    data.role = res.body.roles.find(r => r.name === internals.role.name);
  });

  test('Delete Role', async () => {
    const res = await rq({
      method: 'DELETE',
      url: `/users-permissions/roles/${data.role.id}`,
    });

    expect(res.statusCode).toBe(200);
  });
});
