import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const industries = await prisma.industry.findMany({ orderBy: { sortOrder: 'asc' } })
console.log('=== INDUSTRIES ===')
for (const i of industries) console.log(i.id, i.slug, i.name)

console.log('\n=== TEMPLATES with hasWebsite=true (sample) ===')
const templates = await prisma.template.findMany({
  where: { hasWebsite: true },
  orderBy: { id: 'desc' },
  take: 8,
  include: { industry: true },
})
for (const t of templates) {
  console.log(JSON.stringify({
    id: t.id, name: t.name, slug: t.slug, category: t.category, status: t.status,
    price: t.price.toString(), customPrice: t.customPrice?.toString(), websitePrice: t.websitePrice?.toString(),
    industry: t.industry?.slug, demoUrl: t.demoUrl, deployUrl: t.deployUrl, thumbnail: t.thumbnail, downloadUrl: t.downloadUrl,
  }, null, 0))
}

console.log('\n=== check existing digital-innovation slug ===')
const existing = await prisma.template.findUnique({ where: { slug: 'digital-innovation' } })
console.log(existing)

await prisma.$disconnect()
