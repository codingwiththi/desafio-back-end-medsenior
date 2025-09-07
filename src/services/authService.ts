import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserRole, Company } from '@prisma/client';
import { prisma } from '@/utils/database';
import { logger } from '@/utils/logger';
import { AuthTokens } from '@/types/api';

export class AuthService {
  private readonly jwtSecret: string;
  private readonly jwtRefreshSecret: string;
  private readonly jwtExpiresIn: string;
  private readonly jwtRefreshExpiresIn: string;

  constructor() {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!jwtSecret || !jwtRefreshSecret) {
      throw new Error('JWT secrets must be configured');
    }

    this.jwtSecret = jwtSecret;
    this.jwtRefreshSecret = jwtRefreshSecret;
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '15m';
    this.jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  async register(
    email: string,
    password: string,
    name: string,
    companyName: string,
  ): Promise<{ user: User; company: Company; tokens: AuthTokens }> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Check if company already exists
    let company = await prisma.company.findUnique({
      where: { name: companyName },
    });

    // If company doesn't exist, create it and make the user an admin
    let role: UserRole = UserRole.USER;
    if (!company) {
      company = await prisma.company.create({
        data: { name: companyName },
      });
      role = UserRole.ADMIN; // First user of a company becomes admin
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        companyId: company.id,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user, company.id);

    logger.info('User registered successfully', {
      userId: user.id,
      email: user.email,
      companyId: company.id,
    });

    return { user, company, tokens };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: User; company: Company; tokens: AuthTokens }> {
    // Find user with company
    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true },
    });

    if (!user || !user.isActive) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user, user.companyId);

    logger.info('User logged in successfully', {
      userId: user.id,
      email: user.email,
    });

    return { user, company: user.company, tokens };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      jwt.verify(refreshToken, this.jwtRefreshSecret);

      // Check if refresh token exists in database
      const tokenRecord = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
        throw new Error('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(
        tokenRecord.user,
        tokenRecord.user.companyId,
      );

      // Remove old refresh token
      await prisma.refreshToken.delete({
        where: { token: refreshToken },
      });

      return tokens;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async logout(refreshToken: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  private async generateTokens(
    user: User,
    companyId: string,
  ): Promise<AuthTokens> {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId,
    };

    // Generate access token
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const accessToken = (jwt as any).sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    });

    // Generate refresh token with unique timestamp
    const refreshPayload = {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      jti: `${user.id}-${Date.now()}`, // Unique identifier
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const refreshToken = (jwt as any).sign(
      refreshPayload,
      this.jwtRefreshSecret,
      {
        expiresIn: this.jwtRefreshExpiresIn,
      },
    );

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }
}
