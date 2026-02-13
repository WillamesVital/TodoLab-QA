const request = require('supertest');
const app = require('../app');
const { resetDatabase } = require('./helpers/resetDatabase');

describe('Health endpoint', () => {
  beforeEach(() => {
    resetDatabase();
  });

  it('deve responder 200 com status ok', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
