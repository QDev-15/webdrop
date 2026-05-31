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
    prisma.industry.upsert({ where: { slug: 'agency' },    update: {}, create: { name: 'Agency / Công ty dịch vụ', slug: 'agency',    sortOrder: 1 } }),
    prisma.industry.upsert({ where: { slug: 'spa-beauty' }, update: {}, create: { name: 'Spa / Làm đẹp',           slug: 'spa-beauty', sortOrder: 2 } }),
    prisma.industry.upsert({ where: { slug: 'restaurant' }, update: {}, create: { name: 'Nhà hàng / Cafe',          slug: 'restaurant', sortOrder: 3 } }),
    prisma.industry.upsert({ where: { slug: 'personal' },  update: {}, create: { name: 'Cá nhân / Portfolio',      slug: 'personal',   sortOrder: 4 } }),
    prisma.industry.upsert({ where: { slug: 'blog' },      update: {}, create: { name: 'Blog',                     slug: 'blog',       sortOrder: 5 } }),
    prisma.industry.upsert({ where: { slug: 'community' }, update: {}, create: { name: 'Cộng đồng / Forum',        slug: 'community',  sortOrder: 6 } }),
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
  // Demo URLs: https://webdrop-eol.pages.dev/{Category}/{slug}/
  const DEMO_BASE = 'https://webdrop-eol.pages.dev'

  const templateData: {
    slug: string
    name: string
    description: string
    thumbnail: string
    demoUrl: string | null
    price: number
    category: 'web' | 'admin'
    industrySlug: string | null
    salesCount: number
    status: 'published' | 'draft'
  }[] = [
    // ── Blogs ──────────────────────────────────────────────────────────────
    {
      slug: 'blog-ca-nhan',
      name: 'Blog Cá Nhân',
      description: 'Template blog cá nhân sạch sẽ, tập trung nội dung. Danh mục, tags, sidebar.',
      thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Blogs/blog-ca-nhan/`,
      price: 499000,
      category: 'web',
      industrySlug: 'blog',
      salesCount: 12,
      status: 'published',
    },

    // ── Cafes ──────────────────────────────────────────────────────────────
    {
      slug: 'cafe-thoi-gian',
      name: 'Cafe Thời Gian',
      description: 'Template quán cafe hiện đại, menu đồ uống, không gian ấm cúng, đặt bàn.',
      thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Cafes/cafe-thoi-gian/`,
      price: 799000,
      category: 'web',
      industrySlug: 'restaurant',
      salesCount: 18,
      status: 'published',
    },

    // ── Companies ──────────────────────────────────────────────────────────
    {
      slug: 'agency-sang-tao',
      name: 'Agency Sáng Tạo',
      description: 'Template agency sáng tạo chuyên nghiệp. Portfolio dự án, đội ngũ, dịch vụ thiết kế.',
      thumbnail: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Companies/agency-sang-tao/`,
      price: 999000,
      category: 'web',
      industrySlug: 'agency',
      salesCount: 24,
      status: 'published',
    },
    {
      slug: 'agency-web',
      name: 'Agency Web',
      description: 'Template công ty web agency. Hero slider, portfolio, pricing plans, testimonials.',
      thumbnail: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Companies/agency-web/`,
      price: 999000,
      category: 'web',
      industrySlug: 'agency',
      salesCount: 38,
      status: 'published',
    },
    {
      slug: 'cong-ty-xay-dung',
      name: 'Công Ty Xây Dựng',
      description: 'Template công ty xây dựng. Dự án thi công, đội ngũ kỹ sư, báo giá, chứng chỉ.',
      thumbnail: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Companies/cong-ty-xay-dung/`,
      price: 799000,
      category: 'web',
      industrySlug: 'agency',
      salesCount: 15,
      status: 'published',
    },
    {
      slug: 'luat-van-phong',
      name: 'Văn Phòng Luật',
      description: 'Template văn phòng luật sư uy tín. Lĩnh vực tư vấn, đội ngũ luật sư, form tư vấn.',
      thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Companies/luat-van-phong/`,
      price: 999000,
      category: 'web',
      industrySlug: 'agency',
      salesCount: 11,
      status: 'published',
    },
    {
      slug: 'startup-cong-nghe',
      name: 'Startup Công Nghệ',
      description: 'Template landing page cho startup tech, SaaS, app. Pricing plans, features, CTA mạnh.',
      thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Companies/startup-cong-nghe/`,
      price: 799000,
      category: 'web',
      industrySlug: 'agency',
      salesCount: 29,
      status: 'published',
    },
    {
      slug: 'tu-van-tai-chinh',
      name: 'Tư Vấn Tài Chính',
      description: 'Template công ty tư vấn tài chính & đầu tư. Chuyên gia, dịch vụ, case study.',
      thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Companies/tu-van-tai-chinh/`,
      price: 799000,
      category: 'web',
      industrySlug: 'agency',
      salesCount: 9,
      status: 'published',
    },

    // ── Forums ─────────────────────────────────────────────────────────────
    {
      slug: 'forum-cong-dong',
      name: 'Forum Cộng Đồng',
      description: 'Template diễn đàn cộng đồng. Threads, categories, members, trending topics.',
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Forums/forum-cong-dong/`,
      price: 499000,
      category: 'web',
      industrySlug: 'community',
      salesCount: 8,
      status: 'published',
    },

    // ── Portfolios ─────────────────────────────────────────────────────────
    {
      slug: 'portfolio-toi',
      name: 'Portfolio Tối',
      description: 'Template portfolio cá nhân nền tối sang trọng. Phù hợp designer, developer, photographer.',
      thumbnail: 'https://images.unsplash.com/photo-1545665277-5937489579f2?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Portfolios/portfolio-toi/`,
      price: 499000,
      category: 'web',
      industrySlug: 'personal',
      salesCount: 24,
      status: 'published',
    },

    // ── Restaurants ────────────────────────────────────────────────────────
    {
      slug: 'am-thuc',
      name: 'Ẩm Thực Việt',
      description: 'Template nhà hàng ẩm thực Việt Nam. Menu phong phú, đặt bàn, không gian truyền thống.',
      thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Restaurants/am-thuc/`,
      price: 799000,
      category: 'web',
      industrySlug: 'restaurant',
      salesCount: 17,
      status: 'published',
    },
    {
      slug: 'nha-hang-cao-cap',
      name: 'Nhà Hàng Cao Cấp',
      description: 'Template fine dining cao cấp. Gallery ảnh đẹp, menu tasting, đặt bàn, chef profile.',
      thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Restaurants/nha-hang-cao-cap/`,
      price: 999000,
      category: 'web',
      industrySlug: 'restaurant',
      salesCount: 22,
      status: 'published',
    },
    {
      slug: 'nha-hang-chay-organic',
      name: 'Nhà Hàng Chay Organic',
      description: 'Template nhà hàng chay & organic. Tươi sạch, thân thiện môi trường, menu healthy.',
      thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Restaurants/nha-hang-chay-organic/`,
      price: 799000,
      category: 'web',
      industrySlug: 'restaurant',
      salesCount: 14,
      status: 'published',
    },
    {
      slug: 'nha-hang-hai-san',
      name: 'Nhà Hàng Hải Sản',
      description: 'Template nhà hàng hải sản tươi sống. Menu phong phú, gallery món ăn, đặt bàn nhóm.',
      thumbnail: 'https://images.unsplash.com/photo-1559742811-822873691df8?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Restaurants/nha-hang-hai-san/`,
      price: 999000,
      category: 'web',
      industrySlug: 'restaurant',
      salesCount: 19,
      status: 'published',
    },
    {
      slug: 'nha-hang-nhat-ban',
      name: 'Nhà Hàng Nhật Bản',
      description: 'Template nhà hàng Nhật tinh tế. Menu sushi/ramen, không gian zen, đặt bàn online.',
      thumbnail: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Restaurants/nha-hang-nhat-ban/`,
      price: 999000,
      category: 'web',
      industrySlug: 'restaurant',
      salesCount: 31,
      status: 'published',
    },
    {
      slug: 'nha-hang-phap',
      name: 'Nhà Hàng Pháp',
      description: 'Template nhà hàng Pháp sang trọng. Fine dining, wine list, chef profile, reservations.',
      thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Restaurants/nha-hang-phap/`,
      price: 999000,
      category: 'web',
      industrySlug: 'restaurant',
      salesCount: 13,
      status: 'published',
    },
    {
      slug: 'nha-hang-truyen-thong',
      name: 'Nhà Hàng Truyền Thống',
      description: 'Template nhà hàng Việt truyền thống. Đậm đà bản sắc, không gian ấm cúng, thực đơn gia truyền.',
      thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Restaurants/nha-hang-truyen-thong/`,
      price: 799000,
      category: 'web',
      industrySlug: 'restaurant',
      salesCount: 16,
      status: 'published',
    },
    {
      slug: 'quan-an-pho-bien',
      name: 'Quán Ăn Phổ Biến',
      description: 'Template quán ăn bình dân, menu đơn giản, đặt đồ online, giờ mở cửa.',
      thumbnail: 'https://images.unsplash.com/photo-1490427712608-c6ec4a90e3d9?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Restaurants/quan-an-pho-bien/`,
      price: 499000,
      category: 'web',
      industrySlug: 'restaurant',
      salesCount: 27,
      status: 'published',
    },
    {
      slug: 'quan-bbq-lua',
      name: 'Quán BBQ & Lửa',
      description: 'Template quán BBQ nướng lửa. Menu thịt nướng, combo nhóm, đặt bàn, không khí sôi động.',
      thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Restaurants/quan-bbq-lua/`,
      price: 999000,
      category: 'web',
      industrySlug: 'restaurant',
      salesCount: 20,
      status: 'published',
    },
    {
      slug: 'tiem-banh-ngot',
      name: 'Tiệm Bánh Ngọt',
      description: 'Template tiệm bánh ngọt & bakery. Gallery bánh đẹp, đặt bánh theo yêu cầu, cửa hàng.',
      thumbnail: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Restaurants/tiem-banh-ngot/`,
      price: 799000,
      category: 'web',
      industrySlug: 'restaurant',
      salesCount: 23,
      status: 'published',
    },

    // ── Spa-Services ───────────────────────────────────────────────────────
    {
      slug: 'spa-beauty',
      name: 'Spa & Làm Đẹp',
      description: 'Template spa & làm đẹp sang trọng. Dịch vụ massage, chăm sóc da, đặt lịch online.',
      thumbnail: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Spa-Services/spa-beauty/`,
      price: 799000,
      category: 'web',
      industrySlug: 'spa-beauty',
      salesCount: 33,
      status: 'published',
    },
    {
      slug: 'nail-salon',
      name: 'Nail Salon',
      description: 'Template tiệm nail chuyên nghiệp. Gallery mẫu nail, bảng giá dịch vụ, đặt lịch theo thợ.',
      thumbnail: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Spa-Services/nail-salon/`,
      price: 699000,
      category: 'web',
      industrySlug: 'spa-beauty',
      salesCount: 28,
      status: 'published',
    },
    {
      slug: 'yoga-wellness',
      name: 'Yoga & Wellness',
      description: 'Template trung tâm yoga & wellness. Lịch lớp học, giáo viên, gói thành viên.',
      thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Spa-Services/yoga-wellness/`,
      price: 799000,
      category: 'web',
      industrySlug: 'spa-beauty',
      salesCount: 19,
      status: 'published',
    },
    {
      slug: 'tiem-toc-barber',
      name: 'Tiệm Tóc & Barber',
      description: 'Template tiệm tóc & barber shop. Dark theme, gallery kiểu tóc, đặt lịch theo stylist.',
      thumbnail: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Spa-Services/tiem-toc-barber/`,
      price: 699000,
      category: 'web',
      industrySlug: 'spa-beauty',
      salesCount: 21,
      status: 'published',
    },
    {
      slug: 'massage-tri-lieu',
      name: 'Massage Trị Liệu',
      description: 'Template trung tâm massage trị liệu. Các loại massage, đặt lịch theo thời lượng.',
      thumbnail: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Spa-Services/massage-tri-lieu/`,
      price: 799000,
      category: 'web',
      industrySlug: 'spa-beauty',
      salesCount: 16,
      status: 'published',
    },
    {
      slug: 'tham-my-vien',
      name: 'Thẩm Mỹ Viện',
      description: 'Template thẩm mỹ viện chuyên nghiệp. Dịch vụ, đội ngũ bác sĩ, before/after gallery.',
      thumbnail: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Spa-Services/tham-my-vien/`,
      price: 999000,
      category: 'web',
      industrySlug: 'spa-beauty',
      salesCount: 25,
      status: 'published',
    },
    {
      slug: 'spa-luxury',
      name: 'Spa Luxury',
      description: 'Template resort spa cao cấp 5 sao. Gói trải nghiệm, couple package, không gian đẳng cấp.',
      thumbnail: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Spa-Services/spa-luxury/`,
      price: 999000,
      category: 'web',
      industrySlug: 'spa-beauty',
      salesCount: 12,
      status: 'published',
    },
    {
      slug: 'pilates-studio',
      name: 'Pilates Studio',
      description: 'Template studio pilates & fitness. Lớp học, reformer, huấn luyện viên, gói tháng.',
      thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Spa-Services/pilates-studio/`,
      price: 799000,
      category: 'web',
      industrySlug: 'spa-beauty',
      salesCount: 14,
      status: 'published',
    },
    {
      slug: 'cham-soc-da',
      name: 'Chăm Sóc Da',
      description: 'Template phòng khám da liễu & skincare clinic. Điều trị da, công nghệ laser, bác sĩ.',
      thumbnail: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Spa-Services/cham-soc-da/`,
      price: 999000,
      category: 'web',
      industrySlug: 'spa-beauty',
      salesCount: 18,
      status: 'published',
    },
    {
      slug: 'beauty-studio',
      name: 'Beauty Studio',
      description: 'Template beauty studio tổng hợp: tóc, nail, makeup, skincare. Đặt lịch theo dịch vụ.',
      thumbnail: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80&auto=format&fit=crop',
      demoUrl: `${DEMO_BASE}/Spa-Services/beauty-studio/`,
      price: 799000,
      category: 'web',
      industrySlug: 'spa-beauty',
      salesCount: 26,
      status: 'published',
    },

    // ── Admin ──────────────────────────────────────────────────────────────
    {
      slug: 'admin-basic',
      name: 'Admin Basic',
      description: 'Template admin dashboard cơ bản. Quản lý bài viết, người dùng, cài đặt. Dark sidebar.',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop',
      demoUrl: null,
      price: 1499000,
      category: 'admin',
      industrySlug: null,
      salesCount: 8,
      status: 'published',
    },
  ]

  for (const t of templateData) {
    await prisma.template.upsert({
      where: { slug: t.slug },
      update: {
        name: t.name,
        description: t.description,
        thumbnail: t.thumbnail,
        demoUrl: t.demoUrl,
        price: t.price,
        salesCount: t.salesCount,
      },
      create: {
        name: t.name,
        slug: t.slug,
        description: t.description,
        thumbnail: t.thumbnail,
        demoUrl: t.demoUrl,
        price: t.price,
        category: t.category,
        industryId: t.industrySlug ? industryMap[t.industrySlug] : null,
        salesCount: t.salesCount,
        status: t.status,
      },
    })
  }
  console.log('✅ Templates:', templateData.length)

  // ── Settings ───────────────────────────────────────────────────────────
  const settingsData = [
    { key: 'site_name',        value: 'webdrop.vn',                          group: 'general' },
    { key: 'site_description', value: 'Mẫu web đẹp, triển khai trọn gói',   group: 'general' },
    { key: 'site_email',       value: 'hello@webdrop.vn',                    group: 'general' },
    { key: 'site_phone',       value: '0900 000 000',                        group: 'general' },
    { key: 'social_facebook',  value: 'https://facebook.com/webdrop.vn',     group: 'social'  },
    { key: 'social_zalo',      value: '0900000000',                          group: 'social'  },
  ]

  for (const s of settingsData) {
    await prisma.setting.upsert({ where: { key: s.key }, update: {}, create: s })
  }
  console.log('✅ Settings:', settingsData.length)

  console.log('\n🎉 Seed complete!')
  console.log('   Admin login: admin@webdrop.vn / webdrop@2025')
  console.log(`   Templates  : ${templateData.length} (${templateData.filter(t => t.category === 'web').length} web + ${templateData.filter(t => t.category === 'admin').length} admin)`)
  console.log(`   Demo base  : ${DEMO_BASE}`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
