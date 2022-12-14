import { PrismaClient } from '@prisma/client';

declare global {
  const prisma: PrismaClient | undefined;
}

const prisma = (globalThis as any).prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') (globalThis as any).prisma = prisma;

export default prisma;
