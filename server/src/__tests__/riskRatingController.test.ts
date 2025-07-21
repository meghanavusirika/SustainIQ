import request from 'supertest';
import express from 'express';
import riskRatingRoutes from '../routes/riskRating';

const app = express();
app.use(express.json());
app.use('/api/risk-rating', riskRatingRoutes);

describe('Risk Rating API', () => {
  it('should return a risk score for a valid company', async () => {
    const res = await request(app)
      .get('/api/risk-rating/score')
      .query({ company: 'Apple' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('company');
    expect(res.body).toHaveProperty('riskScore');
    expect(typeof res.body.riskScore).toBe('number');
  });

  it('should return 400 for missing company parameter', async () => {
    const res = await request(app)
      .get('/api/risk-rating/score');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
}); 