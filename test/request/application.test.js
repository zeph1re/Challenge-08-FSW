const request = require('supertest');
const app = require('../../app/index');
require('dotenv').config();

describe('test handleGetRoot', () => {
  it('return 200 OK', async () => {
    return request(app)
      .get('/')
      .set('Content-Type', 'application/json')
      .then((res) => {
        expect(res.statusCode).toBe(200);
      });
  });
});
