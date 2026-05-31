import { PrismaClient } from '@prisma/client'
import { scryptSync, randomBytes } from 'crypto'

const prisma = new PrismaClient()

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

async function main() {
  console.log('🌱 Seeding database...')

  // ── Users ──────────────────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: 'admin@webdrop.vn' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@webdrop.vn',
      password: hashPassword('webdrop@2025'),
      role: 'superadmin',
    },
  })
  console.log('✅ User:', admin.email)

  // ── Industries ─────────────────────────────────────────────────────────
  const industries = await Promise.all([
    prisma.industry.upsert({ where: { slug: 'agency' }, update: {}, create: { name: 'Agency / Công ty dịch vụ', slug: 'agency', sortOrder: 1 } }),
    prisma.industry.upsert({ where: { slug: 'spa-beauty' }, update: {}, create: { name: 'Spa / Làm đẹp', slug: 'spa-beauty', sortOrder: 2 } }),
    prisma.industry.upsert({ where: { slug: 'restaurant' }, update: {}, create: { name: 'Nhà hàng / Cafe', slug: 'restaurant', sortOrder: 3 } }),
    prisma.industry.upsert({ where: { slug: 'personal' }, update: {}, create: { name: 'Cá nhân / Portfolio', slug: 'personal', sortOrder: 4 } }),
    prisma.industry.upsert({ where: { slug: 'blog' }, update: {}, create: { name: 'Blog', slug: 'blog', sortOrder: 5 } }),
    prisma.industry.upsert({ where: { slug: 'community' }, update: {}, create: { name: 'Cộng đồng / Forum', slug: 'community', sortOrder: 6 } }),
  ])
  console.log('✅ Industries:', industries.length)

  const industryMap = Object.fromEntries(industries.map(i => [i.slug, i.id]))

  // ── Service Packages ───────────────────────────────────────────────────
  const packages = await Promise.all([
    prisma.servicePackage.upsert({
      where: { code: 'GOI_A' },
      update: {},
      create: { name: 'Gói A — Template', code: 'GOI_A', description: 'Template HTML/CSS/Bootstrap thuần, bàn giao file ZIP', priceFrom: 199000, priceTo: 1499000, sortOrder: 1 },
    }),
    prisma.servicePackage.upsert({
      where: { code: 'GOI_B' },
      update: {},
      create: { name: 'Gói B — Website chuẩn', code: 'GOI_B', description: 'React + PHP + SQLite, deploy lên hosting là chạy', priceFrom: 3000000, priceTo: 22000000, sortOrder: 2 },
    }),
    prisma.servicePackage.upsert({
      where: { code: 'GOI_C' },
      update: {},
      create: { name: 'Gói C — Website full custom', code: 'GOI_C', description: 'Thiết kế theo yêu cầu, Phase 1 wireframe, Phase 2 develop', priceFrom: 20000000, priceTo: null, sortOrder: 3 },
    }),
  ])
  console.log('✅ Packages:', packages.map(p => p.code).join(', '))

  // ── Templates ──────────────────────────────────────────────────────────
  const templateData = [
    {
      slug: 'cong-ty-dich-vu-pro',
      name: 'Công ty dịch vụ Pro',
      description: 'Template hiện đại cho agency, công ty dịch vụ, freelancer. Hero slider 5 slide, portfolio, pricing, reviews.',
      thumbnail: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80&auto=format&fit=crop',
      demoUrl: 'https://webdrop-company-service-pro.netlify.app',
      price: 2500000,
      category: 'web' as const,
      industrySlug: 'agency',
      salesCount: 38,
      status: 'published' as const,
    },
    {
      slug: 'portfolio-toi',
      name: 'Portfolio tối',
      description: 'Template portfolio cá nhân với nền tối sang trọng. Phù hợp designer, developer, photographer.',
      thumbnail: 'https://images.unsplash.com/photo-1545665277-5937489579f2?w=800&q=80&auto=format&fit=crop',
      demoUrl: "https://webdrop-portfolio.netlify.app",
      price: 2000000,
      category: 'web' as const,
      industrySlug: 'personal',
      salesCount: 24,
      status: 'published' as const,
    },
    {
      slug: 'nha-hang-cafe',
      name: 'Nhà hàng & Cafe',
      description: 'Template đẹp mắt cho nhà hàng, quán cafe. Menu section, gallery, đặt bàn, bản đồ.',
      thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop',
      demoUrl: 'https://webdrop-restaurant.netlify.app/',
      price: 3000000,
      category: 'web' as const,
      industrySlug: 'restaurant',
      salesCount: 19,
      status: 'published' as const,
    },
    {
      slug: 'blog-ca-nhan',
      name: 'Blog cá nhân',
      description: 'Template blog sạch sẽ, tập trung vào nội dung. Danh mục, tags, tìm kiếm, sidebar.',
      thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80&auto=format&fit=crop',
      demoUrl: "https://webdrop-blog-1.netlify.app",
      price: 1800000,
      category: 'web' as const,
      industrySlug: 'blog',
      salesCount: 31,
      status: 'published' as const,
    },
    {
      slug: 'spa-lam-dep',
      name: 'Spa & Làm đẹp',
      description: 'Template sang trọng cho spa, thẩm mỹ, làm đẹp. Gallery dịch vụ, đặt lịch, chứng chỉ.',
      thumbnail: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80&auto=format&fit=crop',
      demoUrl: 'https://webdrop-spa.netlify.app',
      price: 2800000,
      category: 'web' as const,
      industrySlug: 'spa-beauty',
      salesCount: 15,
      status: 'published' as const,
    },
    {
      slug: 'forum-cong-dong',
      name: 'Forum cộng đồng',
      description: 'Template cho diễn đàn, cộng đồng online. Threads, categories, members, badges.',
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80&auto=format&fit=crop',
      demoUrl: "https://webdrop-forum-1.netlify.app",
      price: 4500000,
      category: 'web' as const,
      industrySlug: 'community',
      salesCount: 8,
      status: 'published' as const,
    },
    {
      slug: 'admin-basic',
      name: 'Admin Basic',
      description: 'Template cho admin cơ bản.',
      thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80&auto=format&fit=crop",
      demoUrl: "https://webdrop-basic-admin.netlify.app",
      price: 4500000,
      category: 'admin' as const,
      industrySlug: 'admin',
      salesCount: 8,
      status: 'published' as const,
    },
  ]

  for (const t of templateData) {
    await prisma.template.upsert({
      where: { slug: t.slug },
      update: { salesCount: t.salesCount },
      create: {
        name: t.name,
        slug: t.slug,
        description: t.description,
        thumbnail: t.thumbnail,
        demoUrl: t.demoUrl,
        price: t.price,
        category: t.category,
        industryId: industryMap[t.industrySlug],
        salesCount: t.salesCount,
        status: t.status,
      },
    })
  }
  console.log('✅ Templates:', templateData.length)

  // ── Settings ───────────────────────────────────────────────────────────
  const settingsData = [
    { key: 'site_name', value: 'webdrop.vn', group: 'general' },
    { key: 'site_description', value: 'Mẫu web đẹp, triển khai trọn gói', group: 'general' },
    { key: 'site_email', value: 'hello@webdrop.vn', group: 'general' },
    { key: 'site_phone', value: '0900 000 000', group: 'general' },
    { key: 'social_facebook', value: 'https://facebook.com/webdrop.vn', group: 'social' },
    { key: 'social_zalo', value: '0900000000', group: 'social' },
  ]

  for (const s of settingsData) {
    await prisma.setting.upsert({ where: { key: s.key }, update: {}, create: s })
  }
  console.log('✅ Settings:', settingsData.length)

  console.log('\n🎉 Seed complete!')
  console.log('   Admin login: admin@webdrop.vn / webdrop@2025')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
