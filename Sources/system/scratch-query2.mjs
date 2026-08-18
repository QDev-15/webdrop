import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const templates = await prisma.template.findMany({
  where: { industry: { slug: 'agency' } },
  orderBy: { id: 'asc' },
})
console.log('=== agency industry templates ===')
for (const t of templates) {
  console.log(JSON.stringify({
    id: t.id, name: t.name, slug: t.slug, category: t.category, status: t.status,
    price: t.price.toString(), hasWebsite: t.hasWebsite, customPrice: t.customPrice?.toString(), websitePrice: t.websitePrice?.toString(),
    demoUrl: t.demoUrl, deployUrl: t.deployUrl, thumbnail: t.thumbnail,
  }, null, 0))
}

await prisma.$disconnect()
