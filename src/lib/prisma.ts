import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

type GlobalPrisma = {
  prisma?: PrismaClient
  pool?: Pool
  adapter?: PrismaPg
}

const globalForPrisma = global as unknown as GlobalPrisma

const connectionString = process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy"

const pool =
  globalForPrisma.pool ||
  new Pool({
    connectionString,
    max: 5,
  })

if (!globalForPrisma.pool) {
  globalForPrisma.pool = pool
}

const adapter = globalForPrisma.adapter || new PrismaPg(pool)
if (!globalForPrisma.adapter) {
  globalForPrisma.adapter = adapter
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

