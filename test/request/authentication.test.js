const request = require('supertest');
const app = require('../../app/index');
require('dotenv').config();

describe('test api handleLogin', () => {
  it('return 201 OK', async () => {
    const email = 'ganda@gmail.com';
    const password = '123456';

    return request(app)
      .post('/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send({ email, password })
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );
      });
  });

  it('return 404! (Not Registered)', async () => {
    const email = 'salsa@gmail.com';
    const password = 'salsa';

    return request(app)
      .post('/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send({ email, password })
      .then((res) => {
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );
      });
  });

  it('return 401! (Wrong Password)', async () => {
    const email = 'ganda@gmail.com';
    const password = 'ganda123';

    return request(app)
      .post('/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send({ email, password })
      .then((res) => {
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );
      });
  });
});

describe('test api handleRegister', () => {
  it('return 201 OK', async () => {
    const name = 'putri';
    const email = `putri${Math.random().toString().substring(12)}@gmail.com`;
    const password = '123';

    return request(app)
      .post('/v1/auth/register')
      .set('Content-Type', 'application/json')
      .send({ name, email, password })
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );
      });
  });

  it('response 422 (EmailAlreadyTakenError)', async () => {
    const name = 'ganda';
    const email = 'gandaa@gmail.com';
    const password = 'ganda';

    return request(app)
      .post('/v1/auth/register')
      .set('Content-Type', 'application/json')
      .send({ name, email, password })
      .then((res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: {
              name: expect.any(String),
              message: expect.any(String),
              details: {
                email: expect.any(String),
              },
            },
          })
        );
      });
  });
});

describe('test api handleWhoAmI', () => {
  it('should response with 200 as status code', async () => {
    const accessToken = await request(app).post('/v1/auth/login').send({
      email: 'putri645412@gmail.com',
      password: 'putri',
    });

    return request(app)
      .get('/v1/auth/whoami')
      .set('Authorization', `Bearer ${accessToken.body.accessToken}`)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          id: expect.any(Number),
          name: expect.any(String),
          email: expect.any(String),
          image: null,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });
  });

  it('should response with 401 as status code', async () => {
    return request(app)
      .get('/v1/auth/whoami')
      .set('Authorization', `Bearer ${'invalidtoken'}`)
      .then((res) => {
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual({
          error: {
            name: expect.any(String),
            message: expect.any(String),
            details: null,
          },
        });
      });
  });
});
