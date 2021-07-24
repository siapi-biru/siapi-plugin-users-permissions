'use strict';

// Helpers.
const { createSiapiInstance } = require('../../../test/helpers/siapi');
const { createAuthRequest, createRequest } = require('../../../test/helpers/request');

let siapi;
let authReq;
const data = {};

describe('Test Graphql user service', () => {
  beforeAll(async () => {
    siapi = await createSiapiInstance();
    authReq = await createAuthRequest({ siapi });
  });

  afterAll(async () => {
    await siapi.destroy();
  });

  describe('Check createUser authorizations', () => {
    test('createUser is forbidden to public', async () => {
      const rq = createRequest({ siapi });
      const res = await rq({
        url: '/graphql',
        method: 'POST',
        body: {
          query: /* GraphQL */ `
            mutation {
              createUser(input: { data: { username: "test", email: "test", password: "test" } }) {
                user {
                  id
                  username
                }
              }
            }
          `,
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        data: {
          createUser: null,
        },
        errors: [
          {
            message: 'Forbidden',
          },
        ],
      });
    });

    test('createUser is authorized for admins', async () => {
      const res = await authReq({
        url: '/graphql',
        method: 'POST',
        body: {
          query: /* GraphQL */ `
            mutation {
              createUser(
                input: {
                  data: { username: "test", email: "test-graphql@siapi.io", password: "test" }
                }
              ) {
                user {
                  id
                  username
                }
              }
            }
          `,
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        data: {
          createUser: {
            user: {
              id: expect.anything(),
              username: 'test',
            },
          },
        },
      });

      data.user = res.body.data.createUser.user;
    });
  });

  describe('Check updateUser authorizations', () => {
    test('updateUser is forbidden to public', async () => {
      const rq = createRequest({ siapi });
      const res = await rq({
        url: '/graphql',
        method: 'POST',
        body: {
          query: /* GraphQL */ `
            mutation {
              updateUser(
                input: {
                  where: { id: 1 }
                  data: { username: "test", email: "test", password: "test" }
                }
              ) {
                user {
                  id
                  username
                }
              }
            }
          `,
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        data: {
          updateUser: null,
        },
        errors: [
          {
            message: 'Forbidden',
          },
        ],
      });
    });

    test('updateUser is authorized for admins', async () => {
      const res = await authReq({
        url: '/graphql',
        method: 'POST',
        body: {
          query: /* GraphQL */ `
            mutation updateUser($id: ID!) {
              updateUser(input: { where: { id: $id }, data: { username: "newUsername" } }) {
                user {
                  id
                  username
                }
              }
            }
          `,
          variables: {
            id: data.user.id,
          },
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        data: {
          updateUser: {
            user: {
              id: expect.anything(),
              username: 'newUsername',
            },
          },
        },
      });

      data.user = res.body.data.updateUser.user;
    });
  });

  describe('Check deleteUser authorizations', () => {
    test('deleteUser is forbidden to public', async () => {
      const rq = createRequest({ siapi });
      const res = await rq({
        url: '/graphql',
        method: 'POST',
        body: {
          query: /* GraphQL */ `
            mutation deleteUser($id: ID!) {
              deleteUser(input: { where: { id: $id } }) {
                user {
                  id
                  username
                }
              }
            }
          `,
          variables: {
            id: data.user.id,
          },
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        data: {
          deleteUser: null,
        },
        errors: [
          {
            message: 'Forbidden',
          },
        ],
      });
    });

    test('deleteUser is authorized for admins', async () => {
      const res = await authReq({
        url: '/graphql',
        method: 'POST',
        body: {
          query: /* GraphQL */ `
            mutation deleteUser($id: ID!) {
              deleteUser(input: { where: { id: $id } }) {
                user {
                  id
                  username
                }
              }
            }
          `,
          variables: {
            id: data.user.id,
          },
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        data: {
          deleteUser: {
            user: data.user,
          },
        },
      });
    });
  });
});
