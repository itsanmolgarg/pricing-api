const request = require('supertest');
const app = require('../../app');
const db = require('../../db');
const { validateCreatePriceProfile } = require('../../apis/pricingProfile/services');

jest.mock('../../db.js', () => ({
  pricingProfile: [],
}));

jest.mock('../../apis/pricingProfile/services', () => ({
  validateCreatePriceProfile: jest.fn(),
}));

describe('POST /api/pricing-profile', () => {
  afterEach(() => {
    // Reset db state after each test
    db.pricingProfile = [];
  });

  it('should create a new pricing profile', async () => {
    validateCreatePriceProfile.mockReturnValue(true); // Mock valid input
    const newProfile = {
      name: 'Test Profile',
      description: 'Test Description',
      type: 'single',
      basedOnId: 'abc123',
      adjustmentMode: 'fixed',
      adjustmentIncrement: 'increase'
    };

    const response = await request(app)
      .post('/api/pricing-profile')
      .send(newProfile);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Success');
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.name).toBe(newProfile.name);
    expect(db.pricingProfile.length).toBe(1);
  });

  it('should return 401 if input is not valid', async () => {
    validateCreatePriceProfile.mockReturnValue(false); // Mock invalid input
    const invalidProfile = {
      description: 'Test Description',
      type: 'single',
      basedOnId: 'abc123',
      adjustmentMode: 'fixed',
      adjustmentIncrement: 'increase'
    };

    const response = await request(app)
      .post('/api/pricing-profile')
      .send(invalidProfile);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Input is not valid');
    expect(db.pricingProfile.length).toBe(0);
  });

  it('should handle internal server error', async () => {
    validateCreatePriceProfile.mockImplementation(() => {
      throw new Error('Mock error');
    });

    const response = await request(app)
      .post('/api/pricing-profile')
      .send({
        name: 'Test Profile',
        description: 'Test Description',
        type: 'single',
        basedOnId: 'abc123',
        adjustmentMode: 'fixed',
        adjustmentIncrement: 'increase'
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal server error');
    expect(db.pricingProfile.length).toBe(0); 
  });
});
