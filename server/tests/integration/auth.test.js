/**
 * Sample Integration Test for Authentication API
 * This is a template - adjust based on your actual API routes
 */

const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../../server');
const User = require('../../models/user.model');

describe('Authentication API Integration Tests', () => {
  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /user/register', () => {
    it('should register a new user successfully', async () => {
      const newUser = {
        email: 'newuser@example.com',
        password: 'SecurePass123!',
        fullName: 'New User',
        role: 'candidate',
      };

      const response = await request(app)
        .post('/user/register')
        .send(newUser)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(newUser.email);
    });

    it('should fail with invalid email', async () => {
      const invalidUser = {
        email: 'invalid-email',
        password: 'SecurePass123!',
        fullName: 'Invalid User',
      };

      const response = await request(app)
        .post('/user/register')
        .send(invalidUser)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail when email already exists', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'SecurePass123!',
        fullName: 'Existing User',
        role: 'candidate',
      };

      // Create first user
      await User.create(userData);

      // Try to register with same email
      const response = await request(app)
        .post('/user/register')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(409);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /user/login', () => {
    beforeEach(async () => {
      // Create a user for login tests
      await User.create({
        email: 'loginuser@example.com',
        password: 'SecurePass123!',
        fullName: 'Login User',
        role: 'candidate',
      });
    });

    it('should login with valid credentials', async () => {
      const credentials = {
        email: 'loginuser@example.com',
        password: 'SecurePass123!',
      };

      const response = await request(app)
        .post('/user/login')
        .send(credentials)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should fail with incorrect password', async () => {
      const credentials = {
        email: 'loginuser@example.com',
        password: 'WrongPassword',
      };

      const response = await request(app)
        .post('/user/login')
        .send(credentials)
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should fail with non-existent email', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'SecurePass123!',
      };

      const response = await request(app)
        .post('/user/login')
        .send(credentials)
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});