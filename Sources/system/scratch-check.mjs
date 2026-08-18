import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const existing = await prisma.template.findUnique({ where: { slug: 'marketing-consultancy' } })
console.log('existing:', existing)
await prisma.$disconnect()
