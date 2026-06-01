import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  prismaUrl: string | undefined
}

function createClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

// Tạo lại client nếu DATABASE_URL thay đổi (tránh dùng connection cũ sau khi đổi .env)
const currentUrl = process.env.DATABASE_URL
if (globalForPrisma.prismaUrl && globalForPrisma.prismaUrl !== currentUrl) {
  globalForPrisma.prisma?.$disconnect()
  globalForPrisma.prisma = undefined
}

export const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  globalForPrisma.prismaUrl = currentUrl
}
