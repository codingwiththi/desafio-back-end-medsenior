import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.__prisma ||
  new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'error', emit: 'stdout' },
      { level: 'info', emit: 'stdout' },
      { level: 'warn', emit: 'stdout' },
    ],
  });

// Log database queries in development
if (process.env.NODE_ENV === 'development') {
  // Temporarily disable query logging due to type issues
  // prisma.$on('query', (e: any) => {
  //   logger.debug(`Query: ${e.query}`);
  //   logger.debug(`Duration: ${e.duration}ms`);
  // });
}

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}
