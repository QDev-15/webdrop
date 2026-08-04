import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const adminUser = await prisma.user.findFirst({
      where: { role: 'superadmin' },
    })

    if (!adminUser) {
      console.error('No admin user found!')
      process.exit(1)
    }

    // Thêm 7 categories phụ
    const newCategories = [
      { slug: 'website-deploy', name: 'Website & Deploy', sortOrder: 4 },
      { slug: 'cv-builder', name: 'CV Builder', sortOrder: 5 },
      { slug: 'tai-lieu-huong-dan', name: 'Tài liệu & Hướng dẫn', sortOrder: 6 },
      { slug: 'khac-phuc-su-co', name: 'Khắc phục sự cố', sortOrder: 7 },
      { slug: 'thiet-ke-tuy-chinh', name: 'Thiết kế & Tùy chỉnh', sortOrder: 8 },
      { slug: 'quan-ly-tai-khoan', name: 'Quản lý & Tài khoản', sortOrder: 9 },
      { slug: 'tich-hop-api', name: 'Tích hợp & API', sortOrder: 10 },
    ]

    let created = 0
    for (const cat of newCategories) {
      const result = await prisma.helpCategory.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name, sortOrder: cat.sortOrder },
        create: cat,
      })
      created++
      console.log(`✓ ${cat.name}`)
    }

    console.log(`\n✅ Created/updated ${created} categories`)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
