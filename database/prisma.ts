import { PrismaClient } from '@prisma/client';

// ============================================================
// PRISMA CLIENT SINGLETON — Place at: src/lib/prisma.ts
//
// Next.js hot-reloads in development, creating new PrismaClient
// instances each time. This singleton prevents connection pool
// exhaustion by reusing the same instance.
// ============================================================

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
