import { PrismaClient } from '@prisma/client';

// Ensure minimal env vars for tests
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'test-refresh-secret';

// Mock PrismaClient for tests
const prisma = new PrismaClient();

beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
});

afterAll(async () => {
  // Clean up and disconnect
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clean database before each test
  const deleteUsers = prisma.user.deleteMany();
  const deleteCompanies = prisma.company.deleteMany();
  const deleteQuestions = prisma.question.deleteMany();
  const deleteRefreshTokens = prisma.refreshToken.deleteMany();

  await prisma.$transaction([
    deleteUsers,
    deleteQuestions,
    deleteRefreshTokens,
    deleteCompanies,
  ]);
});

export { prisma };
