import { AuthService } from '@/services/authService';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  describe('register', () => {
    it('should register a new user and company successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        companyName: 'Test Company',
      };

      const result = await authService.register(
        userData.email,
        userData.password,
        userData.name,
        userData.companyName,
      );

      expect(result.user).toBeDefined();
      expect(result.company).toBeDefined();
      expect(result.tokens).toBeDefined();
      expect(result.user.email).toBe(userData.email);
      expect(result.user.name).toBe(userData.name);
      expect(result.user.role).toBe('ADMIN'); // First user becomes admin
      expect(result.company.name).toBe(userData.companyName);
    });

    it('should throw error if user already exists', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        companyName: 'Test Company',
      };

      // Register user first time
      await authService.register(
        userData.email,
        userData.password,
        userData.name,
        userData.companyName,
      );

      // Try to register same user again
      await expect(
        authService.register(
          userData.email,
          userData.password,
          userData.name,
          userData.companyName,
        ),
      ).rejects.toThrow('User already exists with this email');
    });

    it('should assign USER role when joining existing company', async () => {
      // Create company with first user (admin)
      await authService.register(
        'admin@company.com',
        'password123',
        'Admin User',
        'Existing Company',
      );

      // Register second user for same company
      const result = await authService.register(
        'user@company.com',
        'password123',
        'Regular User',
        'Existing Company',
      );

      expect(result.user.role).toBe('USER');
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      // Create a test user
      await authService.register(
        'test@example.com',
        'password123',
        'Test User',
        'Test Company',
      );
    });

    it('should login successfully with valid credentials', async () => {
      const result = await authService.login('test@example.com', 'password123');

      expect(result.user).toBeDefined();
      expect(result.company).toBeDefined();
      expect(result.tokens).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw error with invalid email', async () => {
      await expect(
        authService.login('invalid@example.com', 'password123'),
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error with invalid password', async () => {
      await expect(
        authService.login('test@example.com', 'wrongpassword'),
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
