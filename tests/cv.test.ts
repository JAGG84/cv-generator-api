import request from 'supertest';
import app from '../src/app';

describe('CV Generator API', () => {
  it('POST /api/generate-cv - should validate input', async () => {
    const res = await request(app)
      .post('/api/generate-cv')
      .send({ email: 'invalid-email' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});