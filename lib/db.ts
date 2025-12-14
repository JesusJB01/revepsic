/**
 * Prisma Client Singleton for Next.js with Prisma 7
 * 
 * In Prisma 7, we use a PostgreSQL driver adapter for database connectivity.
 * This setup uses the @prisma/adapter-pg for direct PostgreSQL connections.
 * 
 * @see https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
 */
import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/app/generated/prisma';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function createPrismaClient() {
  // Create connection pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  globalForPrisma.pool = pool;
  
  // Create Prisma adapter
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;

