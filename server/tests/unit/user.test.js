/**
 * Sample Unit Test for User Model
 * This is a template - adjust based on your actual User model
 */

const mongoose = require('mongoose');
const User = require('../../models/user.model');

describe('User Model Unit Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    // Cleanup and disconnect
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  afterEach(async () => {
    // Clean up after each test
    await User.deleteMany({});
  });

  describe('User Creation', () => {
    it('should create a valid user', async () => {
      const validUser = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        fullName: 'Test User',
        role: 'candidate',
      };

      const user = await User.create(validUser);

      expect(user).toBeDefined();
      expect(user.email).toBe(validUser.email);
      expect(user.fullName).toBe(validUser.fullName);
      expect(user.role).toBe(validUser.role);
      expect(user.password).not.toBe(validUser.password); // Should be hashed
    });

    it('should fail to create user without required fields', async () => {
      const invalidUser = {
        email: 'test@example.com',
        // Missing password and fullName
      };

      await expect(User.create(invalidUser)).rejects.toThrow();
    });

    it('should fail to create user with invalid email', async () => {
      const invalidUser = {
        email: 'invalid-email',
        password: 'SecurePass123!',
        fullName: 'Test User',
      };

      await expect(User.create(invalidUser)).rejects.toThrow();
    });

    it('should not allow duplicate emails', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'SecurePass123!',
        fullName: 'Test User',
        role: 'candidate',
      };

      await User.create(userData);

      // Try to create another user with same email
      await expect(User.create(userData)).rejects.toThrow();
    });
  });

  describe('User Methods', () => {
    it('should correctly compare passwords', async () => {
      const password = 'SecurePass123!';
      const user = await User.create({
        email: 'method@example.com',
        password,
        fullName: 'Method Test',
        role: 'candidate',
      });

      const isMatch = await user.comparePassword(password);
      expect(isMatch).toBe(true);

      const isNotMatch = await user.comparePassword('WrongPassword');
      expect(isNotMatch).toBe(false);
    });
  });
});