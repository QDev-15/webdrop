import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10)
}

async function main() {
  console.log('🌱 Seeding database...')

  // ── Users ──────────────────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: 'admin@webdrop.store' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@webdrop.store',
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
    prisma.industry.upsert({ where: { slug: 'dental' }, update: {}, create: { name: 'Nha khoa', slug: 'dental', sortOrder: 7 } }),
    prisma.industry.upsert({ where: { slug: 'shop' }, update: {}, create: { name: 'Shop bán hàng', slug: 'shop', sortOrder: 8 } }),
  ])
  console.log('✅ Industries:', industries.length)

  const industryMap = Object.fromEntries(industries.map(i => [i.slug, i.id]))

  // ── Service Packages ───────────────────────────────────────────────────
  const packages = await Promise.all([
    prisma.servicePackage.upsert({
      where: { code: 'GOI_A' },
      update: {},
      create: { name: 'Gói A — Template', code: 'GOI_A', description: 'Template HTML/CSS/Bootstrap thuần, bàn giao file ZIP', priceFrom: 99000, priceTo: 99000, sortOrder: 1 },
    }),
    prisma.servicePackage.upsert({
      where: { code: 'GOI_B' },
      update: {},
      create: { name: 'Gói B — Website chuẩn', code: 'GOI_B', description: 'React + PHP + SQLite, deploy lên hosting là chạy', priceFrom: 500000, priceTo: 500000, sortOrder: 2 },
    }),
    prisma.servicePackage.upsert({
      where: { code: 'GOI_C' },
      update: {},
      create: { name: 'Gói C — Website full custom', code: 'GOI_C', description: 'Thiết kế theo yêu cầu, Phase 1 wireframe, Phase 2 develop', priceFrom: 7000000, priceTo: null, sortOrder: 3 },
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
    hasWebsite?: boolean
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
        price: 99000,
        category: 'web',
        industrySlug: 'blog',
        hasWebsite: true,
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
        price: 99000,
        category: 'web',
        industrySlug: 'restaurant',
        hasWebsite: true,
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
        price: 99000,
        category: 'web',
        industrySlug: 'agency',
        hasWebsite: true,
        salesCount: 24,
        status: 'published',
      },
      {
        slug: 'agency-web',
        name: 'Agency Web',
        description: 'Template công ty web agency. Hero slider, portfolio, pricing plans, testimonials.',
        thumbnail: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Companies/agency-web/`,
        price: 99000,
        category: 'web',
        industrySlug: 'agency',
        hasWebsite: true,
        salesCount: 38,
        status: 'published',
      },
      {
        slug: 'cong-ty-xay-dung',
        name: 'Công Ty Xây Dựng',
        description: 'Template công ty xây dựng. Dự án thi công, đội ngũ kỹ sư, báo giá, chứng chỉ.',
        thumbnail: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Companies/cong-ty-xay-dung/`,
        price: 99000,
        category: 'web',
        industrySlug: 'agency',
        hasWebsite: true,
        salesCount: 15,
        status: 'published',
      },
      {
        slug: 'luat-van-phong',
        name: 'Văn Phòng Luật',
        description: 'Template văn phòng luật sư uy tín. Lĩnh vực tư vấn, đội ngũ luật sư, form tư vấn.',
        thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Companies/luat-van-phong/`,
        price: 99000,
        category: 'web',
        industrySlug: 'agency',
        hasWebsite: true,
        salesCount: 11,
        status: 'published',
      },
      {
        slug: 'startup-cong-nghe',
        name: 'Startup Công Nghệ',
        description: 'Template landing page cho startup tech, SaaS, app. Pricing plans, features, CTA mạnh.',
        thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Companies/startup-cong-nghe/`,
        price: 99000,
        category: 'web',
        industrySlug: 'agency',
        hasWebsite: true,
        salesCount: 29,
        status: 'published',
      },
      {
        slug: 'tu-van-tai-chinh',
        name: 'Tư Vấn Tài Chính',
        description: 'Template công ty tư vấn tài chính & đầu tư. Chuyên gia, dịch vụ, case study.',
        thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Companies/tu-van-tai-chinh/`,
        price: 99000,
        category: 'web',
        industrySlug: 'agency',
        hasWebsite: true,
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
        price: 99000,
        category: 'web',
        industrySlug: 'community',
        hasWebsite: true,
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
        price: 99000,
        category: 'web',
        industrySlug: 'personal',
        hasWebsite: true,
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
        price: 99000,
        category: 'web',
        industrySlug: 'restaurant',
        hasWebsite: true,
        salesCount: 17,
        status: 'published',
      },
      {
        slug: 'nha-hang-cao-cap',
        name: 'Nhà Hàng Cao Cấp',
        description: 'Template fine dining cao cấp. Gallery ảnh đẹp, menu tasting, đặt bàn, chef profile.',
        thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Restaurants/nha-hang-cao-cap/`,
        price: 99000,
        category: 'web',
        industrySlug: 'restaurant',
        hasWebsite: true,
        salesCount: 22,
        status: 'published',
      },
      {
        slug: 'nha-hang-chay-organic',
        name: 'Nhà Hàng Chay Organic',
        description: 'Template nhà hàng chay & organic. Tươi sạch, thân thiện môi trường, menu healthy.',
        thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Restaurants/nha-hang-chay-organic/`,
        price: 99000,
        category: 'web',
        industrySlug: 'restaurant',
        hasWebsite: true,
        salesCount: 14,
        status: 'published',
      },
      {
        slug: 'nha-hang-hai-san',
        name: 'Nhà Hàng Hải Sản',
        description: 'Template nhà hàng hải sản tươi sống. Menu phong phú, gallery món ăn, đặt bàn nhóm.',
        thumbnail: 'https://images.unsplash.com/photo-1559742811-822873691df8?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Restaurants/nha-hang-hai-san/`,
        price: 99000,
        category: 'web',
        industrySlug: 'restaurant',
        hasWebsite: true,
        salesCount: 19,
        status: 'published',
      },
      {
        slug: 'nha-hang-nhat-ban',
        name: 'Nhà Hàng Nhật Bản',
        description: 'Template nhà hàng Nhật tinh tế. Menu sushi/ramen, không gian zen, đặt bàn online.',
        thumbnail: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Restaurants/nha-hang-nhat-ban/`,
        price: 99000,
        category: 'web',
        industrySlug: 'restaurant',
        hasWebsite: true,
        salesCount: 31,
        status: 'published',
      },
      {
        slug: 'nha-hang-phap',
        name: 'Nhà Hàng Pháp',
        description: 'Template nhà hàng Pháp sang trọng. Fine dining, wine list, chef profile, reservations.',
        thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Restaurants/nha-hang-phap/`,
        price: 99000,
        category: 'web',
        industrySlug: 'restaurant',
        hasWebsite: true,
        salesCount: 13,
        status: 'published',
      },
      {
        slug: 'nha-hang-truyen-thong',
        name: 'Nhà Hàng Truyền Thống',
        description: 'Template nhà hàng Việt truyền thống. Đậm đà bản sắc, không gian ấm cúng, thực đơn gia truyền.',
        thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Restaurants/nha-hang-truyen-thong/`,
        price: 99000,
        category: 'web',
        industrySlug: 'restaurant',
        hasWebsite: true,
        salesCount: 16,
        status: 'published',
      },
      {
        slug: 'quan-an-pho-bien',
        name: 'Quán Ăn Phổ Biến',
        description: 'Template quán ăn bình dân, menu đơn giản, đặt đồ online, giờ mở cửa.',
        thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Restaurants/quan-an-pho-bien/`,
        price: 99000,
        category: 'web',
        industrySlug: 'restaurant',
        hasWebsite: true,
        salesCount: 27,
        status: 'published',
      },
      {
        slug: 'quan-bbq-lua',
        name: 'Quán BBQ & Lửa',
        description: 'Template quán BBQ nướng lửa. Menu thịt nướng, combo nhóm, đặt bàn, không khí sôi động.',
        thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Restaurants/quan-bbq-lua/`,
        price: 99000,
        category: 'web',
        industrySlug: 'restaurant',
        hasWebsite: true,
        salesCount: 20,
        status: 'published',
      },
      {
        slug: 'tiem-banh-ngot',
        name: 'Tiệm Bánh Ngọt',
        description: 'Template tiệm bánh ngọt & bakery. Gallery bánh đẹp, đặt bánh theo yêu cầu, cửa hàng.',
        thumbnail: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Restaurants/tiem-banh-ngot/`,
        price: 99000,
        category: 'web',
        industrySlug: 'restaurant',
        hasWebsite: true,
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
        price: 99000,
        category: 'web',
        industrySlug: 'spa-beauty',
        hasWebsite: true,
        salesCount: 33,
        status: 'published',
      },
      {
        slug: 'nail-salon',
        name: 'Nail Salon',
        description: 'Template tiệm nail chuyên nghiệp. Gallery mẫu nail, bảng giá dịch vụ, đặt lịch theo thợ.',
        thumbnail: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Spa-Services/nail-salon/`,
        price: 99000,
        category: 'web',
        industrySlug: 'spa-beauty',
        hasWebsite: true,
        salesCount: 28,
        status: 'published',
      },
      {
        slug: 'yoga-wellness',
        name: 'Yoga & Wellness',
        description: 'Template trung tâm yoga & wellness. Lịch lớp học, giáo viên, gói thành viên.',
        thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Spa-Services/yoga-wellness/`,
        price: 99000,
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
        price: 99000,
        category: 'web',
        industrySlug: 'spa-beauty',
        hasWebsite: true,
        salesCount: 21,
        status: 'published',
      },
      {
        slug: 'massage-tri-lieu',
        name: 'Massage Trị Liệu',
        description: 'Template trung tâm massage trị liệu. Các loại massage, đặt lịch theo thời lượng.',
        thumbnail: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Spa-Services/massage-tri-lieu/`,
        price: 99000,
        category: 'web',
        industrySlug: 'spa-beauty',
        hasWebsite: true,
        salesCount: 16,
        status: 'published',
      },
      {
        slug: 'tham-my-vien',
        name: 'Thẩm Mỹ Viện',
        description: 'Template thẩm mỹ viện chuyên nghiệp. Dịch vụ, đội ngũ bác sĩ, before/after gallery.',
        thumbnail: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Spa-Services/tham-my-vien/`,
        price: 99000,
        category: 'web',
        industrySlug: 'spa-beauty',
        hasWebsite: true,
        salesCount: 25,
        status: 'published',
      },
      {
        slug: 'spa-luxury',
        name: 'Spa Luxury',
        description: 'Template resort spa cao cấp 5 sao. Gói trải nghiệm, couple package, không gian đẳng cấp.',
        thumbnail: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Spa-Services/spa-luxury/`,
        price: 99000,
        category: 'web',
        industrySlug: 'spa-beauty',
        hasWebsite: true,
        salesCount: 12,
        status: 'published',
      },
      {
        slug: 'pilates-studio',
        name: 'Pilates Studio',
        description: 'Template studio pilates & fitness. Lớp học, reformer, huấn luyện viên, gói tháng.',
        thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Spa-Services/pilates-studio/`,
        price: 99000,
        category: 'web',
        industrySlug: 'spa-beauty',
        hasWebsite: true,
        salesCount: 14,
        status: 'published',
      },
      {
        slug: 'cham-soc-da',
        name: 'Chăm Sóc Da',
        description: 'Template phòng khám da liễu & skincare clinic. Điều trị da, công nghệ laser, bác sĩ.',
        thumbnail: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Spa-Services/cham-soc-da/`,
        price: 99000,
        category: 'web',
        industrySlug: 'spa-beauty',
        hasWebsite: true,
        salesCount: 18,
        status: 'published',
      },
      {
        slug: 'beauty-studio',
        name: 'Beauty Studio',
        description: 'Template beauty studio tổng hợp: tóc, nail, makeup, skincare. Đặt lịch theo dịch vụ.',
        thumbnail: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Spa-Services/beauty-studio/`,
        price: 99000,
        category: 'web',
        industrySlug: 'spa-beauty',
        hasWebsite: true,
        salesCount: 26,
        status: 'published',
      },

      // ── Dental-Clinics ─────────────────────────────────────────────────────
      {
        slug: 'nha-khoa-dong-do',
        name: 'Nha Khoa Đông Đô',
        description: 'Template nha khoa cao cấp, sang trọng. Tông tối + accent jade emerald, nav floating.',
        thumbnail: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Dental-Clinics/nha-khoa-dong-do/`,
        price: 99000,
        category: 'web',
        industrySlug: 'dental',
        hasWebsite: true,
        salesCount: 9,
        status: 'published',
      },
      {
        slug: 'nha-khoa-gia-dinh-sunrise',
        name: 'Sunrise — Nha Khoa Gia Đình',
        description: 'Template nha khoa gia đình thân thiện, ấm áp, tông trắng + sky blue, phù hợp mọi lứa tuổi.',
        thumbnail: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Dental-Clinics/nha-khoa-gia-dinh-sunrise/`,
        price: 99000,
        category: 'web',
        industrySlug: 'dental',
        hasWebsite: true,
        salesCount: 11,
        status: 'published',
      },
      {
        slug: 'nha-khoa-tham-my-luxdental',
        name: 'LuxDental — Nha Khoa Thẩm Mỹ',
        description: 'Template nha khoa thẩm mỹ phong cách magazine, đen-trắng tương phản cao + scarlet.',
        thumbnail: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Dental-Clinics/nha-khoa-tham-my-luxdental/`,
        price: 99000,
        category: 'web',
        industrySlug: 'dental',
        hasWebsite: true,
        salesCount: 7,
        status: 'published',
      },
      {
        slug: 'nha-khoa-chinh-nha-saigon',
        name: 'Nha Khoa Chỉnh Nha Sài Gòn',
        description: 'Template chuyên khoa chỉnh nha/niềng răng, hình học hiện đại, two-tone cobalt blue.',
        thumbnail: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Dental-Clinics/nha-khoa-chinh-nha-saigon/`,
        price: 99000,
        category: 'web',
        industrySlug: 'dental',
        hasWebsite: true,
        salesCount: 8,
        status: 'published',
      },
      {
        slug: 'nha-khoa-chinh-nha-saigon-green',
        name: 'Nha Khoa Chỉnh Nha Sài Gòn (Bản Xanh)',
        description: 'Template chuyên khoa chỉnh nha/niềng răng, phối màu Jade Emerald + DM Sans, tông ấm gần gũi hơn bản cobalt blue.',
        thumbnail: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Dental-Clinics/nha-khoa-chinh-nha-saigon-green/`,
        price: 99000,
        category: 'web',
        industrySlug: 'dental',
        hasWebsite: true,
        salesCount: 2,
        status: 'published',
      },
      {
        slug: 'nha-khoa-tre-em-kidsmile',
        name: 'KidSmile — Nha Khoa Trẻ Em',
        description: 'Template nha khoa chuyên nhi, pastel dịu nhẹ, thân thiện và vui tươi cho trẻ em.',
        thumbnail: 'https://images.unsplash.com/photo-1571772805064-207c8435df79?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Dental-Clinics/nha-khoa-tre-em-kidsmile/`,
        price: 99000,
        category: 'web',
        industrySlug: 'dental',
        hasWebsite: true,
        salesCount: 13,
        status: 'published',
      },
      {
        slug: 'nha-khoa-implant-future',
        name: 'Future Dental — Implant 3D',
        description: 'Template chuyên khoa cấy ghép Implant, công nghệ scan 3D, tông tối + neon magenta.',
        thumbnail: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Dental-Clinics/nha-khoa-implant-future/`,
        price: 99000,
        category: 'web',
        industrySlug: 'dental',
        hasWebsite: true,
        salesCount: 6,
        status: 'published',
      },
      {
        slug: 'nha-khoa-quoc-te-vietduc',
        name: 'Nha Khoa Quốc Tế Việt Đức',
        description: 'Template hệ thống nha khoa chuẩn quốc tế, nhiều chi nhánh, tông navy/teal chuyên nghiệp.',
        thumbnail: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Dental-Clinics/nha-khoa-quoc-te-vietduc/`,
        price: 99000,
        category: 'web',
        industrySlug: 'dental',
        hasWebsite: true,
        salesCount: 10,
        status: 'published',
      },
      {
        slug: 'nha-khoa-tong-quat-antam',
        name: 'Nha Khoa An Tâm',
        description: 'Template nha khoa tổng quát, không gian yên tĩnh, tối giản thiền định, tông sage green.',
        thumbnail: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Dental-Clinics/nha-khoa-tong-quat-antam/`,
        price: 99000,
        category: 'web',
        industrySlug: 'dental',
        hasWebsite: true,
        salesCount: 12,
        status: 'published',
      },
      {
        slug: 'nha-khoa-nu-cuoi-xua',
        name: 'Nụ Cười Xưa — Nha Khoa Phong Cách Retro',
        description: 'Template nha khoa thương hiệu vintage/retro độc đáo, gần gũi, tông teal cổ điển.',
        thumbnail: 'https://images.unsplash.com/photo-1609207825181-52d3214556dd?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Dental-Clinics/nha-khoa-nu-cuoi-xua/`,
        price: 99000,
        category: 'web',
        industrySlug: 'dental',
        hasWebsite: true,
        salesCount: 5,
        status: 'published',
      },
      {
        slug: 'nha-khoa-cong-nghe-smiletech',
        name: 'SmileTech — Nha Khoa Công Nghệ Cao',
        description: 'Template nha khoa số hóa, AI chẩn đoán, glassmorphism gradient xanh dương-tím.',
        thumbnail: 'https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Dental-Clinics/nha-khoa-cong-nghe-smiletech/`,
        price: 99000,
        category: 'web',
        industrySlug: 'dental',
        hasWebsite: true,
        salesCount: 14,
        status: 'published',
      },

      // ── Shops ──────────────────────────────────────────────────────────────
      {
        slug: 'shop-ban-hang',
        name: 'Shop Bán Hàng Hữu Cơ',
        description: 'Template + Website shop bán hàng phong cách ORGANIC-EARTH — thời trang, phụ kiện, đồ dùng tự nhiên. Có sẵn tìm kiếm/lọc sản phẩm, giỏ hàng, thanh toán COD/SePay.',
        thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Shops/shop-ban-hang/`,
        price: 99000,
        category: 'web',
        industrySlug: 'shop',
        hasWebsite: true,
        salesCount: 4,
        status: 'published',
      },
      {
        slug: 'shop-thoi-trang',
        name: 'Shop Thời Trang',
        description: 'Template shop thời trang phong cách BOLD-EDITORIAL — tông tối giản sắc nét, Electric Blue accent, bố cục magazine grid.',
        thumbnail: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Shops/shop-thoi-trang/`,
        price: 99000,
        category: 'web',
        industrySlug: 'shop',
        hasWebsite: true,
        salesCount: 3,
        status: 'published',
      },
      {
        slug: 'shop-giay-dep',
        name: 'Shop Giày Dép',
        description: 'Template + Website shop giày dép phong cách DARK-ENERGY — tông tối, Volt Lime + Cyan accent, nav floating pill. Có sẵn tìm kiếm/lọc sản phẩm, giỏ hàng, coupon, thanh toán COD/SePay.',
        thumbnail: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Shops/shop-giay-dep/`,
        price: 99000,
        category: 'web',
        industrySlug: 'shop',
        hasWebsite: true,
        salesCount: 3,
        status: 'published',
      },
      {
        slug: 'shop-quan-ao',
        name: 'Shop Quần Áo Nữ',
        description: 'Template + Website shop quần áo nữ phong cách SOFT-PASTEL — Lavender + Butter accent, nav always-solid. Có sẵn tìm kiếm/lọc sản phẩm, giỏ hàng, coupon, thanh toán COD/SePay.',
        thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Shops/shop-quan-ao/`,
        price: 99000,
        category: 'web',
        industrySlug: 'shop',
        hasWebsite: true,
        salesCount: 3,
        status: 'published',
      },
      {
        slug: 'shop-thuc-pham-sach',
        name: 'Shop Thực Phẩm Sạch',
        description: 'Template + Website shop thực phẩm sạch phong cách FRESH-MINIMAL — Leaf Green + Harvest Amber accent, nav underline-active. Có sẵn tìm kiếm/lọc sản phẩm, giỏ hàng, coupon, thanh toán COD/SePay.',
        thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Shops/shop-thuc-pham-sach/`,
        price: 99000,
        category: 'web',
        industrySlug: 'shop',
        hasWebsite: true,
        salesCount: 3,
        status: 'published',
      },
      {
        slug: 'shop-rau-xanh',
        name: 'Shop Rau Củ Quả',
        description: 'Template + Website shop rau củ quả phong cách WARM-ARTISAN — Ochre Clay + Khaki Olive accent, nav centered-logo signage. Có sẵn tìm kiếm/lọc sản phẩm, giỏ hàng, coupon, thanh toán COD/SePay.',
        thumbnail: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Shops/shop-rau-xanh/`,
        price: 99000,
        category: 'web',
        industrySlug: 'shop',
        hasWebsite: true,
        salesCount: 3,
        status: 'published',
      },
      {
        slug: 'shop-tui-sach',
        name: 'Shop Túi Xách',
        description: 'Template + Website shop túi xách/túi da cao cấp phong cách LUXE-DARK — Gold + Burgundy accent, nav full-width dark bar. Có sẵn tìm kiếm/lọc sản phẩm, giỏ hàng, coupon, thanh toán COD/SePay.',
        thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Shops/shop-tui-sach/`,
        price: 99000,
        category: 'web',
        industrySlug: 'shop',
        hasWebsite: true,
        salesCount: 3,
        status: 'published',
      },
      {
        slug: 'shop-may-anh',
        name: 'Shop Máy Ảnh',
        description: 'Template + Website shop máy ảnh & thiết bị nhiếp ảnh phong cách GEOMETRIC-MODERN — Optical Teal + Amber accent, hero geometric split. Có sẵn tìm kiếm/lọc sản phẩm, giỏ hàng, coupon, thanh toán COD/SePay.',
        thumbnail: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Shops/shop-may-anh/`,
        price: 99000,
        category: 'web',
        industrySlug: 'shop',
        hasWebsite: true,
        salesCount: 3,
        status: 'published',
      },
      {
        slug: 'shop-may-tinh',
        name: 'Shop Máy Tính',
        description: 'Template + Website shop máy tính & laptop phong cách GLASS-MODERN — Indigo + Cyan accent, glassmorphism, hero slider crossfade. Có sẵn tìm kiếm/lọc sản phẩm, giỏ hàng, coupon, thanh toán COD/SePay.',
        thumbnail: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Shops/shop-may-tinh/`,
        price: 99000,
        category: 'web',
        industrySlug: 'shop',
        hasWebsite: true,
        salesCount: 3,
        status: 'published',
      },
      {
        slug: 'shop-ami-mobile',
        name: 'AMI Mobile',
        description: 'Template + Website shop điện thoại & phụ kiện — tông mustard ấm, 9 trang đầy đủ (sản phẩm, khuyến mãi, giới thiệu...). Có sẵn tìm kiếm/lọc sản phẩm, giỏ hàng, thanh toán COD/SePay.',
        thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Shops/shop-ami-mobile/`,
        price: 99000,
        category: 'web',
        industrySlug: 'shop',
        hasWebsite: true,
        salesCount: 1,
        status: 'published',
      },
      {
        slug: 'shop-quan-ao-ami',
        name: 'AMI Fashion',
        description: 'Template + Website shop thời trang tối giản phong cách ZEN-MINIMAL — Sage Green + Taupe accent, bộ sưu tập theo mùa, chất liệu cao cấp. Có sẵn tìm kiếm/lọc sản phẩm, giỏ hàng, thanh toán COD/SePay.',
        thumbnail: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Shops/shop-quan-ao-ami/`,
        price: 99000,
        category: 'web',
        industrySlug: 'shop',
        hasWebsite: true,
        salesCount: 1,
        status: 'published',
      },
      {
        slug: 'shop-my-pham',
        name: 'Shop Mỹ Phẩm LUMIÈRE',
        description: 'Template + Website shop mỹ phẩm & làm đẹp phong cách LUXE-DARK — Rose Gold + Charcoal accent, lọc theo loại da. Có sẵn tìm kiếm/lọc sản phẩm, giỏ hàng, thanh toán COD/SePay.',
        thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Shops/shop-my-pham/`,
        price: 99000,
        category: 'web',
        industrySlug: 'shop',
        hasWebsite: true,
        salesCount: 1,
        status: 'published',
      },
      {
        slug: 'shop-the-thao',
        name: 'Shop Thể Thao & Gym',
        description: 'Template shop thể thao & gym phong cách DARK-ENERGY — Signal Orange + Electric Blue accent, full dark, trang chủ search-first. Có sẵn tìm kiếm/lọc sản phẩm, giỏ hàng.',
        thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Shops/shop-the-thao/`,
        price: 99000,
        category: 'web',
        industrySlug: 'shop',
        salesCount: 0,
        status: 'published',
      },
      {
        slug: 'shop-do-choi',
        name: 'Shop Đồ Chơi Trẻ Em',
        description: 'Template shop đồ chơi trẻ em phong cách SOFT-PASTEL — Sky Blue + Sunny Yellow + Coral accent, lọc theo nhóm tuổi. Có sẵn tìm kiếm/lọc sản phẩm, giỏ hàng.',
        thumbnail: 'https://images.unsplash.com/photo-1558877385-81a1c7e67d72?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Shops/shop-do-choi/`,
        price: 99000,
        category: 'web',
        industrySlug: 'shop',
        hasWebsite: true,
        salesCount: 0,
        status: 'published',
      },
      {
        slug: 'shop-do-gia-dung',
        name: 'Shop Đồ Gia Dụng',
        description: 'Template + Website shop đồ gia dụng phong cách WARM-ARTISAN — Terracotta + Sage accent, nhà bếp/trang trí/phòng tắm/nội thất nhỏ. Có sẵn tìm kiếm/lọc sản phẩm, giỏ hàng, thanh toán COD/SePay.',
        thumbnail: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Shops/shop-do-gia-dung/`,
        price: 99000,
        category: 'web',
        industrySlug: 'shop',
        hasWebsite: true,
        salesCount: 0,
        status: 'published',
      },
      {
        slug: 'shop-van-phong-pham',
        name: 'Shop Văn Phòng Phẩm',
        description: 'Template shop văn phòng phẩm phong cách CLEAN-CORPORATE — Steel Blue + Charcoal Navy accent, trang chủ search-first unified. Có sẵn tìm kiếm/lọc sản phẩm, giỏ hàng.',
        thumbnail: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&q=80&auto=format&fit=crop',
        demoUrl: `${DEMO_BASE}/Shops/shop-van-phong-pham/`,
        price: 99000,
        category: 'web',
        industrySlug: 'shop',
        salesCount: 0,
        status: 'published',
      },

      // ── Admin ──────────────────────────────────────────────────────────────
      {
        slug: 'admin-basic',
        name: 'Admin Basic',
        description: 'Template admin dashboard cơ bản. Quản lý bài viết, người dùng, cài đặt. Dark sidebar.',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop',
        demoUrl: null,
        price: 99000,
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
        websitePrice: 500000,
        hasWebsite: t.hasWebsite ?? false,
        salesCount: t.salesCount,
      },
      create: {
        name: t.name,
        slug: t.slug,
        description: t.description,
        thumbnail: t.thumbnail,
        demoUrl: t.demoUrl,
        price: t.price,
        websitePrice: 500000,
        category: t.category,
        industryId: t.industrySlug ? industryMap[t.industrySlug] : null,
        hasWebsite: t.hasWebsite ?? false,
        salesCount: t.salesCount,
        status: t.status,
      },
    })
  }
  console.log('✅ Templates:', templateData.length)

  // ── Settings ───────────────────────────────────────────────────────────
  const settingsData = [
    { key: 'site_name', value: 'webdrop.store', group: 'general' },
    { key: 'site_description', value: 'Mẫu web đẹp, triển khai trọn gói', group: 'general' },
    { key: 'site_logo', value: '', group: 'general' },
    { key: 'site_favicon', value: '', group: 'general' },
    { key: 'site_email', value: 'hello@webdrop.store', group: 'general' },
    { key: 'site_phone', value: '0900 000 000', group: 'general' },
    { key: 'social_facebook', value: 'https://facebook.com/webdrop.store', group: 'social' },
    { key: 'social_zalo', value: '0900000000', group: 'social' },
  ]

  for (const s of settingsData) {
    await prisma.setting.upsert({ where: { key: s.key }, update: {}, create: s })
  }
  console.log('✅ Settings:', settingsData.length)

  // ── Hero Slides ────────────────────────────────────────────────────────
  const { slides } = await import('../src/data/slides.config')
  const existing = await prisma.heroSlide.count()
  if (existing === 0) {
    for (let i = 0; i < slides.length; i++) {
      const s = slides[i] as unknown as Record<string, unknown>
      const { type, bg, badge, buttons, title, ...data } = s
      await prisma.heroSlide.create({
        data: {
          type:     type    as 'intro' | 'features' | 'grid' | 'pricing' | 'testimonial',
          bg:       bg      as string,
          badge:    badge   as string,
          title:    (title  ?? []) as object,
          data:     data    as object,
          buttons:  buttons as object,
          sortOrder: i,
          status: 'published',
        },
      })
    }
    console.log('✅ Hero slides:', slides.length)
  } else {
    console.log('⏭  Hero slides: đã có dữ liệu, bỏ qua')
  }

  // ── Pricing Groups ────────────────────────────────────────────────────
  const pricingExisting = await prisma.pricingGroup.count()
  if (pricingExisting === 0) {
    // Group 1: Gói Template (cards)
    const g1 = await prisma.pricingGroup.create({
      data: { slug: 'goi-template', eyebrow: 'Gói Template', title: 'Template', titleEm: 'thuần HTML/CSS', subtitle: 'Mở thẳng trên trình duyệt, không cần build, không cần server. Bàn giao file ZIP + demo live.', footnote: 'Bundle 5 template: Tiết kiệm 30–40% so với mua lẻ', bg: 'light', type: 'cards', tags: [], sortOrder: 0 },
    })
    await prisma.pricingPlan.createMany({ data: [
      { groupId: g1.id, name: 'Template 1 trang',  price: '99.000đ', features: ['File HTML/CSS/JS nguồn', 'Responsive mobile-first', 'Hướng dẫn chỉnh nội dung', 'Bootstrap 5.3'], hot: false, ctaLabel: 'Xem mẫu', ctaHref: '/templates', sortOrder: 0 },
      { groupId: g1.id, name: 'Template multi-page', price: '99.000đ', features: ['4–6 trang HTML', 'Responsive hoàn toàn', 'Demo live link', 'Hướng dẫn chi tiết'], hot: true, ctaLabel: 'Xem mẫu', ctaHref: '/templates', sortOrder: 1 },
      { groupId: g1.id, name: 'Admin Template',    price: '99.000đ', features: ['Dashboard + CRUD pages', 'Mobile responsive sidebar', 'Dark sidebar design', 'Bootstrap 5.3'], hot: false, ctaLabel: 'Xem mẫu', ctaHref: '/templates', sortOrder: 2 },
    ]})

    // Group 2: Gói Web cơ bản (cards, warm bg)
    const g2 = await prisma.pricingGroup.create({
      data: { slug: 'goi-web-co-ban', eyebrow: 'Gói Web cơ bản', title: 'Website', titleEm: 'chuẩn, deploy nhanh', subtitle: 'React SPA + PHP + SQLite. Upload lên hosting là chạy. Không cần config gì thêm.', footnote: 'Cài đặt hosting + domain: +500.000 – 1.000.000đ (tính riêng 1 lần)', bg: 'warm', type: 'cards', tags: [], sortOrder: 1 },
    })
    await prisma.pricingPlan.createMany({ data: [
      { groupId: g2.id, name: 'Basic',    price: '500.000đ', features: ['Landing 1 trang', 'Form liên hệ', 'Admin xem form', 'Hosting PHP + SQLite'], hot: false, ctaLabel: 'Đặt hàng ngay', ctaHref: '/checkout', sortOrder: 0 },
      { groupId: g2.id, name: 'Standard', price: '500.000đ', features: ['5–7 trang', 'Blog/tin tức', 'Admin quản lý nội dung', 'SEO cơ bản'], hot: true, ctaLabel: 'Đặt hàng ngay', ctaHref: '/checkout', sortOrder: 1 },
      { groupId: g2.id, name: 'Pro',      price: '500.000đ', features: ['10+ trang', 'Đa ngôn ngữ', 'Admin đầy đủ', 'SEO nâng cao + Analytics'], hot: false, ctaLabel: 'Đặt hàng ngay', ctaHref: '/checkout', sortOrder: 2 },
    ]})

    // Group 3: Gói Theo Yêu cầu (banner)
    await prisma.pricingGroup.create({
      data: { slug: 'goi-theo-yeu-cau', eyebrow: 'Gói Theo Yêu cầu', title: 'Website + Admin', titleEm: 'full custom', bg: 'light', type: 'banner', description: 'Thiết kế theo yêu cầu, 2 phase rõ ràng. Từ 7.000.000đ tùy scope.', tags: ['Wireframe → Design', 'Duyệt rồi mới dev', 'Bàn giao source code', 'Bảo trì tháng'], ctaLabel: 'Liên hệ tư vấn →', ctaHref: '/contact', sortOrder: 2 },
    })

    // FAQs
    await prisma.pricingFaq.createMany({ data: [
      { question: 'Cài đặt hosting tính riêng không?', answer: 'Có, cài đặt hosting + domain tính phí dịch vụ riêng 500.000 – 1.000.000đ/lần.', sortOrder: 0 },
      { question: 'Giá có bao gồm hosting hàng năm không?', answer: 'Không. Giá trên chỉ là phí thiết kế/bàn giao. Hosting và domain là chi phí hàng năm bạn tự trả với nhà cung cấp.', sortOrder: 1 },
      { question: 'Có thể mua source code Gói Theo Yêu cầu không?', answer: 'Có. Source code tính thêm 20–30% giá trị dự án.', sortOrder: 2 },
      { question: 'Bảo hành bao lâu?', answer: 'Hỗ trợ sửa lỗi miễn phí trong 30 ngày sau bàn giao. Sau đó có gói bảo trì hàng tháng từ 1.000.000đ.', sortOrder: 3 },
    ]})
    console.log('✅ Pricing groups: 3 nhóm + 4 FAQ')
  } else {
    console.log('⏭  Pricing groups: đã có dữ liệu, bỏ qua')
  }

  // ── How It Works Packages ─────────────────────────────────────────────
  const hiwExisting = await prisma.howItWorksPackage.count()
  if (hiwExisting === 0) {
    const hiwPackages = [
      {
        name: 'Gói Template', slug: 'goi-template', tagline: 'Mua file, tự cài đặt theo hướng dẫn',
        icon: '📦', price: 'Từ 99.000đ', hot: false, sortOrder: 0,
        ctaLabel: 'Xem thư viện mẫu', ctaHref: '/templates',
        suitable: ['Có kinh nghiệm kỹ thuật cơ bản', 'Muốn tự kiểm soát hoàn toàn', 'Ngân sách tối ưu'],
        steps: [
          { title: 'Chọn mẫu',             desc: 'Duyệt thư viện 30+ mẫu, xem demo live, chọn mẫu phù hợp ngành nghề.' },
          { title: 'Thanh toán',            desc: 'Chuyển khoản — xác nhận trong 2 giờ làm việc.' },
          { title: 'Nhận file ZIP',         desc: 'Download file HTML/CSS/JS + hướng dẫn chỉnh nội dung chi tiết.' },
          { title: 'Tự chỉnh & triển khai', desc: 'Thay text, ảnh theo hướng dẫn. Upload lên bất kỳ hosting nào là chạy.' },
        ],
      },
      {
        name: 'Gói Web cơ bản', slug: 'goi-web-co-ban', tagline: 'Website đầy đủ — deploy xong là chạy luôn',
        icon: '🌐', price: 'Từ 500.000đ', hot: true, sortOrder: 1,
        ctaLabel: 'Đặt hàng ngay', ctaHref: '/templates',
        suitable: ['Không rành kỹ thuật', 'Muốn website nhanh — 3 đến 5 ngày', 'Cần cài đặt trọn gói'],
        steps: [
          { title: 'Chọn mẫu & đặt hàng', desc: 'Chọn template từ thư viện, điền form brief ngắn (ngành, màu sắc, nội dung chính).' },
          { title: 'Chúng tôi cài đặt',   desc: 'Setup hosting, domain, SSL. Điền nội dung theo brief. Thường hoàn thành trong 3–5 ngày.' },
          { title: 'Duyệt & bàn giao',    desc: 'Review website, yêu cầu chỉnh sửa (tối đa 2 lần). Bàn giao quyền truy cập đầy đủ.' },
          { title: 'Hỗ trợ 30 ngày',      desc: 'Hỗ trợ kỹ thuật miễn phí 30 ngày đầu qua Zalo. Sau đó có gói bảo trì tháng.' },
        ],
      },
      {
        name: 'Gói Theo Yêu cầu', slug: 'goi-theo-yeu-cau', tagline: 'Thiết kế độc quyền từ đầu theo yêu cầu',
        icon: '✏️', price: 'Từ 20.000.000đ', hot: false, sortOrder: 2,
        ctaLabel: 'Liên hệ tư vấn', ctaHref: '/contact',
        suitable: ['Cần thiết kế riêng biệt', 'Có tính năng đặc thù theo nghiệp vụ', 'Dự án lớn, dài hạn'],
        steps: [
          { title: 'Trao đổi & brief',     desc: 'Cuộc gọi / Zalo 30 phút để hiểu rõ yêu cầu, ngành nghề, đối tượng khách hàng, ngân sách.' },
          { title: 'Wireframe & ký scope', desc: 'Phác thảo cấu trúc trang, danh sách tính năng. Ký checklist scope tránh phát sinh.' },
          { title: 'Design UI',            desc: 'Thiết kế giao diện trên Figma. Khách duyệt, chỉnh sửa đến khi ưng ý.' },
          { title: 'Phát triển',           desc: 'Code frontend + backend theo thiết kế đã duyệt. Báo cáo tiến độ hàng tuần.' },
          { title: 'Test & Deploy',        desc: 'Kiểm thử kỹ trên nhiều thiết bị. Deploy lên hosting, cấu hình domain, SSL.' },
          { title: 'Bàn giao & hỗ trợ',   desc: 'Bàn giao source code (nếu chọn) hoặc bản build. Hỗ trợ 90 ngày sau bàn giao.' },
        ],
      },
    ]
    for (const p of hiwPackages) {
      const { steps, ...pkgData } = p
      const pkg = await prisma.howItWorksPackage.create({ data: pkgData })
      for (let i = 0; i < steps.length; i++) {
        await prisma.howItWorksStep.create({ data: { packageId: pkg.id, ...steps[i], sortOrder: i } })
      }
    }
    console.log('✅ How It Works packages:', hiwPackages.length)
  } else {
    console.log('⏭  How It Works packages: đã có dữ liệu, bỏ qua')
  }

  // ── Blog: Categories + bài viết mẫu ─────────────────────────────────────
  const blogCategories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'cam-nang' }, update: {}, create: { name: 'Cẩm nang', slug: 'cam-nang' } }),
    prisma.category.upsert({ where: { slug: 'case-study' }, update: {}, create: { name: 'Case Study', slug: 'case-study' } }),
    prisma.category.upsert({ where: { slug: 'so-sanh' }, update: {}, create: { name: 'So sánh', slug: 'so-sanh' } }),
  ])
  const blogCategoryMap = Object.fromEntries(blogCategories.map(c => [c.slug, c.id]))
  const blogCategory = blogCategories[0]

  const blogPosts: {
    slug: string
    title: string
    excerpt: string
    metaTitle: string
    metaDescription: string
    content: string
    categorySlug?: string
  }[] = [
    {
      slug: 'website-nha-khoa-tang-dat-lich',
      title: '5 điều website nha khoa cần có để tăng tỷ lệ đặt lịch',
      excerpt: 'Nhiều phòng khám nha khoa có website nhưng vẫn ít người đặt lịch online. Vấn đề thường không nằm ở thiết kế đẹp hay xấu, mà ở 5 yếu tố cụ thể dưới đây.',
      metaTitle: '5 điều website nha khoa cần có để tăng đặt lịch | webdrop.store',
      metaDescription: 'Hướng dẫn 5 yếu tố quan trọng giúp website nha khoa tăng tỷ lệ đặt lịch online, đúc kết từ kinh nghiệm xây hơn 10 website nha khoa thực tế.',
      content: `Nhiều phòng khám nha khoa đầu tư website nhưng lượng đặt lịch online vẫn thấp. Qua kinh nghiệm xây dựng hơn 10 website cho các phòng khám nha khoa với nhiều phong cách khác nhau, chúng tôi nhận thấy vấn đề thường không nằm ở giao diện đẹp hay xấu, mà ở 5 yếu tố cụ thể sau.

**1. Form đặt lịch nằm ngay trang chủ, ít bước nhất có thể**

Khách hàng tiềm năng thường lướt web trên điện thoại và không muốn tìm kiếm quá nhiều để đặt lịch. Form đặt lịch nên xuất hiện ngay ở phần đầu trang chủ (hoặc nút CTA nổi bật dẫn tới form), chỉ hỏi những thông tin thật sự cần thiết: họ tên, số điện thoại, dịch vụ quan tâm, thời gian mong muốn. Càng nhiều trường bắt buộc, tỷ lệ khách bỏ ngang càng cao.

**2. Hiển thị đội ngũ bác sĩ rõ ràng, có ảnh thật và chuyên môn cụ thể**

Nha khoa là dịch vụ liên quan trực tiếp đến sức khỏe, khách hàng cần biết ai sẽ điều trị cho mình trước khi đặt lịch. Trang bác sĩ nên có ảnh thật, số năm kinh nghiệm, chuyên môn cụ thể (chỉnh nha, implant, thẩm mỹ răng...). Đây là yếu tố tạo niềm tin nhanh nhất trên một trang y tế.

**3. Bảng giá dịch vụ minh bạch, kể cả khi chỉ là khoảng giá**

Rất nhiều website nha khoa giấu hoàn toàn giá dịch vụ, buộc khách phải gọi điện hỏi — điều này khiến một bộ phận khách hàng bỏ qua vì ngại hỏi giá. Hiển thị khoảng giá tham khảo cho từng dịch vụ, kèm ghi chú giá cụ thể tùy tình trạng răng và được tư vấn miễn phí khi thăm khám, giúp khách chủ động hơn và lọc trước đối tượng phù hợp.

**4. Đánh giá và câu chuyện khách hàng thật, không chỉ là sao số**

Testimonial dạng năm sao chung chung không còn thuyết phục. Nên có vài đánh giá chi tiết, gắn tên thật hoặc viết tắt, kèm dịch vụ đã sử dụng. Với các phòng khám chuyên sâu như implant hay chỉnh nha, ảnh trước/sau đã được khách đồng ý là yếu tố thuyết phục mạnh nhất.

**5. Tốc độ tải trang nhanh trên di động**

Phần lớn khách hàng tìm phòng khám nha khoa qua tìm kiếm trên điện thoại, thường trong lúc đang đau răng và cần quyết định nhanh. Website tải chậm sẽ mất phần lớn nhóm khách hàng này trước khi họ kịp thấy form đặt lịch. Ảnh cần được nén, hạn chế hiệu ứng nặng, và ưu tiên bố cục đơn giản trên màn hình nhỏ.

Cả 5 yếu tố trên đều không đòi hỏi ngân sách lớn — quan trọng là được thiết kế đúng ngay từ đầu. Đây cũng là các nguyên tắc chúng tôi áp dụng khi xây dựng bộ template website nha khoa tại webdrop.store.`,
    },
    {
      slug: 'case-study-nha-khoa-chinh-nha-saigon',
      title: 'Case study: Thiết kế website cho phòng khám nha khoa chỉnh nha',
      excerpt: 'Ngành chỉnh nha có đặc thù riêng: quy trình điều trị dài, khách cần theo dõi tiến độ, và niềm tin vào bác sĩ là yếu tố quyết định. Đây là cách chúng tôi tiếp cận khi xây dựng website cho phòng khám chuyên chỉnh nha.',
      metaTitle: 'Case study: Website cho phòng khám nha khoa chỉnh nha | webdrop.store',
      metaDescription: 'Cách tiếp cận thiết kế website cho phòng khám chuyên chỉnh nha — quy trình điều trị, bộ lọc phương pháp, đội ngũ bác sĩ và form tư vấn.',
      categorySlug: 'case-study',
      content: `Khi nhận yêu cầu xây dựng website cho một phòng khám chuyên chỉnh nha, điều đầu tiên chúng tôi làm không phải là chọn màu sắc hay font chữ, mà là xác định câu hỏi lớn nhất mà khách hàng tiềm năng đang có trong đầu: chỉnh nha mất bao lâu, tốn bao nhiêu, và ai sẽ làm cho mình.

**1. Quy trình điều trị được trực quan hóa**

Chỉnh nha là dịch vụ kéo dài nhiều tháng, thậm chí vài năm. Thay vì chỉ liệt kê dịch vụ, chúng tôi thiết kế riêng một trang mô tả từng bước quy trình: thăm khám, lấy dấu răng, gắn khí cụ, tái khám định kỳ, tháo niềng. Khách hàng nhìn vào biết ngay mình đang bắt đầu từ đâu.

**2. Bộ lọc theo loại hình chỉnh nha**

Chỉnh nha có nhiều phương pháp như mắc cài kim loại, mắc cài sứ, khay trong suốt, với mức giá khác nhau. Trang dịch vụ cho phép khách so sánh nhanh giữa các phương pháp thay vì phải đọc hết từng đoạn văn dài.

**3. Đội ngũ bác sĩ là trọng tâm, không phải phụ**

Với dịch vụ có thời gian điều trị dài, khách hàng gắn bó với một bác sĩ cụ thể chứ không phải một phòng khám chung chung. Trang bác sĩ được thiết kế nổi bật ngay từ trang chủ, không giấu trong menu con.

**4. Form đặt lịch tư vấn rút gọn**

Khác với dịch vụ khám nhanh, chỉnh nha thường bắt đầu bằng buổi tư vấn miễn phí. Form đặt lịch vì vậy được thiết kế đơn giản, chỉ hỏi thông tin đủ để phòng khám liên hệ lại tư vấn kỹ hơn qua điện thoại.

Kết quả là một website tập trung đúng vào tâm lý của người đang cân nhắc chỉnh nha: cần thời gian suy nghĩ, cần thông tin rõ ràng, và cần tin tưởng vào người sẽ đồng hành cùng mình trong suốt quá trình điều trị.`,
    },
    {
      slug: 'case-study-shop-ban-hang-huu-co',
      title: 'Case study: Xây dựng website bán hàng cho sản phẩm hữu cơ, thủ công',
      excerpt: 'Sản phẩm hữu cơ và thủ công có đặc thù khác hẳn hàng công nghiệp: câu chuyện thương hiệu, chất liệu, và niềm tin vào nguồn gốc quan trọng không kém giá bán.',
      metaTitle: 'Case study: Website bán hàng hữu cơ, thủ công | webdrop.store',
      metaDescription: 'Cách tiếp cận thiết kế website bán hàng cho sản phẩm hữu cơ, thủ công — kể chuyện thương hiệu, mô tả chất liệu, bộ lọc theo nhu cầu, thanh toán linh hoạt.',
      categorySlug: 'case-study',
      content: `Bán hàng hữu cơ và đồ thủ công khác với bán hàng công nghiệp ở một điểm quan trọng: khách hàng không chỉ mua sản phẩm, họ mua câu chuyện đằng sau sản phẩm đó. Website vì vậy cần làm được nhiều hơn một trang danh mục sản phẩm thông thường.

**1. Trang chủ kể chuyện trước khi bán hàng**

Thay vì đưa ngay sản phẩm lên đầu trang, phần đầu trang chủ dành để giới thiệu triết lý thương hiệu: vì sao chọn nguyên liệu hữu cơ, quy trình sản xuất thủ công khác gì hàng đại trà. Sản phẩm xuất hiện ngay sau đó như một hệ quả tự nhiên của câu chuyện.

**2. Mô tả sản phẩm nêu rõ chất liệu**

Với hàng thủ công, chất liệu là yếu tố khách hàng quan tâm hàng đầu — vải gì, xử lý ra sao, có an toàn cho da nhạy cảm không. Mỗi sản phẩm có mục chất liệu tách riêng khỏi mô tả chung, dễ quét mắt tìm thông tin.

**3. Bộ lọc theo nhu cầu thực tế**

Khách mua hàng hữu cơ thường tìm theo nhu cầu cụ thể như màu sắc, mức giá, tình trạng còn hàng, hơn là duyệt ngẫu nhiên. Trang sản phẩm có bộ lọc đầy đủ: danh mục, khoảng giá, màu sắc, đánh giá, tình trạng kho, kèm ô tìm kiếm gõ là ra kết quả ngay.

**4. Thanh toán linh hoạt, không ép một hình thức**

Không phải khách hàng nào cũng quen chuyển khoản online. Website hỗ trợ song song thanh toán khi nhận hàng và chuyển khoản qua mã QR, để khách chọn hình thức họ thấy an tâm nhất.

Một website bán hàng tốt cho nhóm sản phẩm hữu cơ, thủ công không chỉ là một cửa hàng online — nó là nơi khách hàng hiểu được vì sao sản phẩm có giá trị hơn hàng đại trà cùng loại.`,
    },
    {
      slug: 'case-study-nha-khoa-tre-em',
      title: 'Case study: Thiết kế website nha khoa trẻ em thân thiện với phụ huynh',
      excerpt: 'Website nha khoa trẻ em có hai đối tượng cùng lúc: trẻ nhỏ cần cảm thấy an toàn, phụ huynh cần thông tin rõ ràng để yên tâm đặt lịch.',
      metaTitle: 'Case study: Website nha khoa trẻ em | webdrop.store',
      metaDescription: 'Cách cân bằng thiết kế website nha khoa trẻ em giữa hai đối tượng: trẻ nhỏ và phụ huynh — màu sắc, nội dung, cẩm nang cha mẹ, form đặt lịch.',
      categorySlug: 'case-study',
      content: `Nha khoa trẻ em là một trong những ngách khó thiết kế nhất, vì website phải nói chuyện được với hai đối tượng hoàn toàn khác nhau cùng lúc: đứa trẻ không phải người quyết định nhưng ảnh hưởng đến cảm xúc chuyến đi khám, và phụ huynh là người thực sự đặt lịch và trả tiền.

**1. Màu sắc và hình khối mềm mại nhưng không trẻ con hóa quá mức**

Màu sắc pastel, bo góc lớn giúp không gian trông thân thiện, nhưng vẫn cần giữ sự chuyên nghiệp để phụ huynh tin tưởng đây là cơ sở y tế thật sự, không phải khu vui chơi.

**2. Nội dung viết cho phụ huynh, hình ảnh nói với trẻ**

Toàn bộ phần chữ về dịch vụ, giá cả, quy trình được viết rõ ràng, chuyên nghiệp dành cho phụ huynh đọc và quyết định. Hình ảnh minh họa, biểu tượng thì thiết kế gần gũi, dễ thương để giảm cảm giác lo sợ khi trẻ nhìn vào.

**3. Cẩm nang cho cha mẹ như một mục riêng**

Phụ huynh có nhiều câu hỏi trước khi đưa con đi khám: khi nào nên khám lần đầu, cách chuẩn bị tâm lý cho trẻ, chăm sóc răng sữa. Một mục cẩm nang riêng giúp trả lời trước những băn khoăn này, giảm bớt lo lắng trước khi đặt lịch.

**4. Form đặt lịch hỏi thông tin của cả phụ huynh và trẻ**

Khác với nha khoa người lớn, form đặt lịch cần thêm trường tên trẻ và độ tuổi để phòng khám chuẩn bị trước cách tiếp cận phù hợp với từng lứa tuổi.

Thiết kế cho nha khoa trẻ em vì vậy không đơn thuần là làm dễ thương hơn, mà là thiết kế đồng thời cho hai lớp cảm xúc khác nhau trong cùng một website.`,
    },
    {
      slug: 'checklist-website-ban-hang-online',
      title: 'Checklist 10 điều website bán hàng online cần có trước khi ra mắt',
      excerpt: 'Trước khi bấm nút ra mắt website bán hàng, hãy chắc chắn 10 điều dưới đây đã có — thiếu một trong số này có thể khiến bạn mất đơn hàng ngay từ lần đầu khách ghé thăm.',
      metaTitle: 'Checklist 10 điều website bán hàng online cần có | webdrop.store',
      metaDescription: '10 điều cần kiểm tra trước khi ra mắt website bán hàng online: giá cả, thanh toán, tìm kiếm, tốc độ tải trang và niềm tin khách hàng.',
      content: `Nhiều chủ shop mở website xong mới phát hiện thiếu những thứ cơ bản khiến khách bỏ giỏ hàng giữa chừng. Dưới đây là 10 điều nên kiểm tra trước khi chính thức ra mắt website bán hàng.

- Trang sản phẩm có ảnh rõ nét, nhiều góc chụp, không chỉ 1 ảnh duy nhất
- Giá hiển thị rõ ràng, không bắt khách phải nhắn tin hỏi giá
- Có ít nhất 2 phương thức thanh toán, ví dụ thanh toán khi nhận hàng và chuyển khoản qua mã QR
- Chính sách đổi trả được ghi rõ, dễ tìm thấy
- Form liên hệ hoặc số điện thoại hiển thị ở nhiều vị trí, không chỉ trang liên hệ
- Giỏ hàng và thanh toán hoạt động mượt trên điện thoại, không chỉ máy tính
- Có tìm kiếm sản phẩm theo tên, không bắt khách cuộn qua toàn bộ danh mục
- Có ít nhất vài đánh giá thật từ khách hàng, không để trang trống hoàn toàn
- Tốc độ tải trang dưới 3 giây, ảnh sản phẩm đã được nén
- Có thông tin cửa hàng thật như địa chỉ, giờ mở cửa để tạo niềm tin, không phải một trang vô danh

Một website bán hàng không cần quá cầu kỳ để bắt đầu bán được hàng, nhưng thiếu bất kỳ điều nào trong danh sách trên đều có thể khiến khách rời đi trước khi kịp đặt hàng.`,
    },
    {
      slug: 'thiet-ke-website-spa-tham-my',
      title: 'Website spa/thẩm mỹ nên thiết kế thế nào để tăng khách hàng',
      excerpt: 'Spa và thẩm mỹ viện là ngành mà cảm nhận thị giác quyết định phần lớn niềm tin ban đầu của khách. Đây là những nguyên tắc thiết kế giúp website spa chuyển đổi khách ghé thăm thành khách đặt lịch.',
      metaTitle: 'Website spa, thẩm mỹ nên thiết kế thế nào | webdrop.store',
      metaDescription: 'Nguyên tắc thiết kế website spa, thẩm mỹ viện giúp tăng đặt lịch: hình ảnh thật, bảng dịch vụ theo nhu cầu, ưu đãi liệu trình, đặt lịch online.',
      content: `Khách hàng chọn spa hoặc thẩm mỹ viện phần lớn dựa trên cảm giác nơi này có sạch sẽ, chuyên nghiệp, đáng tin không, và cảm giác đó hình thành trong vài giây đầu tiên nhìn vào website.

**1. Hình ảnh không gian thật, không dùng ảnh stock chung chung**

Ảnh chụp thật không gian spa, phòng dịch vụ tạo cảm giác chân thực hơn nhiều so với ảnh minh họa lấy từ internet, dù ảnh thật có thể không đẹp hoàn hảo bằng ảnh stock.

**2. Bảng dịch vụ phân nhóm rõ ràng theo nhu cầu**

Spa thường có rất nhiều dịch vụ như chăm sóc da, massage, giảm béo, làm đẹp. Nhóm dịch vụ theo nhu cầu cụ thể của khách thay vì liệt kê một danh sách dài giúp khách tìm đúng thứ mình cần nhanh hơn.

**3. Ưu đãi và gói liệu trình hiển thị nổi bật**

Khách hàng spa thường quan tâm đến gói liệu trình nhiều buổi hơn là dịch vụ lẻ. Nếu có ưu đãi theo gói, nên hiển thị ngay ở vị trí dễ thấy thay vì chỉ nói khi khách gọi điện hỏi.

**4. Đặt lịch online thay vì chỉ có số điện thoại**

Nhiều khách hàng có xu hướng ngại gọi điện đặt lịch lần đầu. Một form đặt lịch online đơn giản giúp họ chủ động hơn, giảm rào cản tâm lý ban đầu.

Thiết kế website spa, thẩm mỹ tốt không phải là làm cho đẹp mắt nhất có thể, mà là làm cho khách cảm thấy an tâm đủ để bước qua rào cản đặt lịch lần đầu tiên.`,
    },
    {
      slug: 'website-cho-quan-cafe-nha-hang',
      title: 'Mở quán cafe/nhà hàng có cần website riêng không?',
      excerpt: 'Nhiều chủ quán nghĩ chỉ cần fanpage Facebook là đủ. Nhưng có một số tình huống website riêng vẫn mang lại giá trị mà fanpage không thể thay thế được.',
      metaTitle: 'Mở quán cafe, nhà hàng có cần website riêng không | webdrop.store',
      metaDescription: 'So sánh vai trò của website và fanpage Facebook cho quán cafe, nhà hàng — tìm kiếm Google, menu chuyên nghiệp, đặt bàn online.',
      content: `Đây là câu hỏi phổ biến của nhiều chủ quán cafe, nhà hàng nhỏ: đã có fanpage Facebook rồi, có cần làm thêm website không? Câu trả lời phụ thuộc vào việc bạn muốn quán của mình được tìm thấy theo cách nào.

**1. Fanpage phụ thuộc vào thuật toán, website thì không**

Bài đăng trên fanpage chỉ tiếp cận được một phần nhỏ người theo dõi do thuật toán giới hạn hiển thị tự nhiên. Website luôn hiển thị đầy đủ thông tin cho bất kỳ ai truy cập, không bị giới hạn bởi thuật toán của bên thứ ba.

**2. Tìm kiếm Google là kênh khách hàng mới không có trên fanpage**

Người tìm nhà hàng hải sản gần đây trên Google thường không có sẵn trên fanpage của bạn để tìm thấy. Một website có SEO cơ bản gồm tên quán, địa chỉ, món ăn giúp xuất hiện đúng lúc khách đang tìm kiếm.

**3. Menu và đặt bàn chuyên nghiệp hơn qua website**

Xem menu qua ảnh đăng trên fanpage thường lộn xộn, khó tìm món cụ thể. Website có trang menu dạng danh sách, phân loại theo nhóm món, kèm hình ảnh và giá rõ ràng, dễ quét mắt hơn nhiều.

**4. Website và fanpage nên đi cùng nhau, không thay thế nhau**

Câu trả lời thực tế không phải là chọn một trong hai, mà là dùng fanpage để tương tác, đăng khuyến mãi hàng ngày, và dùng website để làm nơi khách tra cứu thông tin ổn định, đặt bàn, và xuất hiện trên Google tìm kiếm.

Với quán quy mô nhỏ mới mở, website không phải là điều bắt buộc ngay từ ngày đầu, nhưng khi lượng khách tìm kiếm online tăng lên, đây là kênh giúp quán được tìm thấy mà không phụ thuộc hoàn toàn vào một nền tảng mạng xã hội duy nhất.`,
    },
    {
      slug: 'top-10-mau-website-nha-khoa-2026',
      title: 'Top 10 mẫu website nha khoa đẹp nhất 2026 (kèm demo)',
      excerpt: 'Tổng hợp 10 mẫu website nha khoa với 10 phong cách thiết kế khác nhau, từ sang trọng, tối giản đến trẻ trung, phù hợp cho từng định vị phòng khám.',
      metaTitle: 'Top 10 mẫu website nha khoa đẹp nhất 2026 | webdrop.store',
      metaDescription: 'So sánh 10 mẫu website nha khoa theo 10 phong cách thiết kế khác nhau, kèm demo trực tiếp, phù hợp từng định vị phòng khám.',
      categorySlug: 'so-sanh',
      content: `Mỗi phòng khám nha khoa có một định vị khác nhau: cao cấp, gia đình, chuyên sâu, hay thân thiện với trẻ em. Dưới đây là 10 mẫu website nha khoa với 10 phong cách thiết kế riêng biệt để bạn tham khảo theo đúng định vị của phòng khám mình.

- Phong cách sang trọng, tối màu, phù hợp phòng khám nha khoa cao cấp, dịch vụ thẩm mỹ răng giá trị cao
- Phong cách tối giản, tươi sáng, phù hợp phòng khám nha khoa gia đình, đa khoa
- Phong cách tương phản mạnh, hiện đại, phù hợp phòng khám định vị cao cấp, tập trung thẩm mỹ
- Phong cách hình khối, có cấu trúc rõ ràng, phù hợp phòng khám chỉnh nha chuyên sâu
- Phong cách pastel, mềm mại, phù hợp phòng khám nha khoa trẻ em
- Phong cách năng lượng, tối màu có điểm nhấn nổi bật, phù hợp phòng khám Implant công nghệ cao
- Phong cách chuyên nghiệp, gam xanh trầm, phù hợp phòng khám nha khoa quốc tế, đa chi nhánh
- Phong cách thiền định, tối giản tuyệt đối, phù hợp phòng khám định vị chăm sóc nhẹ nhàng, không đau
- Phong cách hoài cổ, cá tính riêng, phù hợp phòng khám muốn tạo dấu ấn khác biệt
- Phong cách kính mờ, hiện đại công nghệ, phù hợp phòng khám định vị công nghệ tiên tiến

Cả 10 mẫu đều dùng chung một bộ khung tính năng: trang dịch vụ, đội ngũ bác sĩ, đặt lịch online, đánh giá khách hàng, chỉ khác nhau ở màu sắc, font chữ và cách bố trí để phù hợp với từng định vị thương hiệu. Bạn có thể xem demo trực tiếp từng mẫu trong thư viện mẫu của chúng tôi trước khi quyết định.`,
    },
    {
      slug: 'nen-chon-goi-template-hay-website-hoan-chinh',
      title: 'Nên chọn Gói Template hay Gói Website hoàn chỉnh?',
      excerpt: 'Cùng là mua một website, nhưng Gói Template và Gói Website hoàn chỉnh phục vụ hai nhu cầu rất khác nhau. Đây là cách chọn đúng gói cho tình huống của bạn.',
      metaTitle: 'Nên chọn Gói Template hay Gói Website hoàn chỉnh | webdrop.store',
      metaDescription: 'So sánh Gói Template và Gói Website hoàn chỉnh của webdrop.store — khác biệt về vận hành, chi phí và cách chọn đúng gói.',
      categorySlug: 'so-sanh',
      content: `Nhiều khách hàng mới tìm hiểu thường bối rối giữa hai lựa chọn: mua Gói Template hay Gói Website hoàn chỉnh. Cả hai đều cho ra một website chạy được, nhưng khác nhau ở cách vận hành phía sau.

**Gói Template — phù hợp khi bạn muốn tự chủ hoàn toàn**

Đây là file HTML/CSS thuần, mở thẳng trên trình duyệt, không cần server hay cơ sở dữ liệu. Bạn tự chỉnh sửa nội dung trực tiếp trong file, tự upload lên bất kỳ hosting nào. Phù hợp với người có chút hiểu biết kỹ thuật cơ bản, hoặc muốn nhờ người quen chỉnh sửa thêm sau này, và có ngân sách hạn chế.

**Gói Website hoàn chỉnh — phù hợp khi bạn muốn quản lý nội dung dễ dàng**

Đây là hệ thống kết hợp giao diện người dùng, backend và cơ sở dữ liệu, đi kèm trang quản trị riêng. Bạn tự thêm sản phẩm, bài viết, đổi thông tin liên hệ qua giao diện quản trị mà không cần đụng vào code. Phù hợp với người kinh doanh cần cập nhật nội dung thường xuyên như sản phẩm mới, khuyến mãi, bài viết, mà không muốn phụ thuộc vào việc sửa code mỗi lần.

**Câu hỏi để tự quyết định**

Nếu website của bạn gần như không đổi nội dung sau khi ra mắt, ví dụ trang giới thiệu công ty hay portfolio cá nhân, Gói Template là đủ và tiết kiệm chi phí. Nếu bạn cần tự thêm sản phẩm, bài viết, xử lý đơn hàng liên tục, Gói Website hoàn chỉnh sẽ tiết kiệm thời gian hơn nhiều về lâu dài dù chi phí ban đầu cao hơn.

Không có lựa chọn nào tốt hơn tuyệt đối, chỉ có lựa chọn phù hợp hơn với cách bạn sẽ vận hành website sau khi nhận bàn giao.`,
    },
    {
      slug: 'cv-online-la-gi',
      title: 'CV Online là gì và vì sao nên có link CV thay vì chỉ file PDF',
      excerpt: 'Gửi file PDF khi xin việc là cách làm quen thuộc, nhưng một link CV online đang dần trở thành lựa chọn được nhiều ứng viên sử dụng thêm. Đây là những khác biệt thực tế giữa hai hình thức.',
      metaTitle: 'CV Online là gì, vì sao nên có link CV | webdrop.store',
      metaDescription: 'So sánh CV Online và file PDF truyền thống khi xin việc — cập nhật một lần, dễ chia sẻ, trình bày trực quan hơn trên màn hình.',
      content: `Khi ứng tuyển, phần lớn mọi người vẫn gửi CV dưới dạng file PDF đính kèm email. Cách này hoạt động tốt, nhưng CV Online, một trang web cá nhân hiển thị CV qua một đường link, đang dần được nhiều ứng viên lựa chọn thêm vì một vài lý do thực tế.

**1. Cập nhật một lần, dùng cho mọi nơi ứng tuyển**

Với file PDF, mỗi lần cập nhật kinh nghiệm bạn phải tải file mới và gửi lại cho từng nơi. Với CV Online, bạn chỉnh sửa một lần trên hệ thống, đường link không đổi, nhà tuyển dụng luôn xem được phiên bản mới nhất.

**2. Dễ chia sẻ hơn trong nhiều tình huống**

Một đường link ngắn dễ dán vào tin nhắn Zalo, email, hồ sơ mạng xã hội nghề nghiệp, thay vì phải gửi kèm file đính kèm mà một số nền tảng tuyển dụng giới hạn dung lượng hoặc định dạng.

**3. Trình bày trực quan hơn trên màn hình**

CV Online thiết kế dạng cuộn trang một trang duy nhất, tối ưu để đọc trên màn hình thay vì mô phỏng khổ giấy A4 như file PDF, dễ đọc hơn khi nhà tuyển dụng xem trên điện thoại hoặc máy tính.

**4. Vẫn xuất được file khi cần**

CV Online không thay thế hoàn toàn PDF, vẫn có thể xuất ra file khi một số nơi tuyển dụng yêu cầu nộp file cụ thể. Đây là lựa chọn bổ sung, không phải đánh đổi.

Với ứng viên ứng tuyển nhiều nơi cùng lúc hoặc thường xuyên cập nhật kinh nghiệm, có thêm một link CV online bên cạnh file PDF truyền thống là một lựa chọn hợp lý, không tốn thêm nhiều công sức duy trì.`,
    },
    {
      slug: 'website-agency-portfolio-can-gi',
      title: 'Website Agency/Portfolio cần có gì để khách hàng tin tưởng chọn bạn',
      excerpt: 'Với agency hay freelancer, website portfolio thường là nơi đầu tiên khách hàng tiềm năng đánh giá năng lực trước khi liên hệ. Đây là những yếu tố quyết định họ có nhắn tin cho bạn hay không.',
      metaTitle: 'Website Agency, Portfolio cần có gì | webdrop.store',
      metaDescription: 'Yếu tố quan trọng trong website portfolio agency, freelancer: dự án tiêu biểu, bối cảnh dự án, bảng giá minh bạch, phản hồi nhanh.',
      content: `Khác với bán sản phẩm vật lý, agency và freelancer bán năng lực và uy tín, thứ khó chứng minh chỉ qua vài dòng giới thiệu. Website portfolio vì vậy đóng vai trò quan trọng hơn nhiều so với một trang giới thiệu thông thường.

**1. Dự án tiêu biểu đặt lên đầu, không chôn trong danh sách dài**

Khách hàng tiềm năng thường chỉ dành vài chục giây lướt qua trước khi quyết định có xem tiếp hay không. Vài dự án tốt nhất nên xuất hiện ngay ở trang chủ thay vì bắt khách phải bấm vào trang dự án mới thấy.

**2. Mỗi dự án nên có bối cảnh, không chỉ ảnh đẹp**

Một ảnh chụp giao diện đẹp không nói lên được vấn đề gì đã giải quyết cho khách hàng. Mỗi dự án nên có một đoạn ngắn mô tả bài toán ban đầu và cách tiếp cận, giúp khách hàng tiềm năng hình dung được năng lực xử lý vấn đề, không chỉ tay nghề thẩm mỹ.

**3. Bảng giá minh bạch hoặc quy trình làm việc rõ ràng**

Nhiều agency ngại công khai giá vì sợ mất khách so sánh. Nhưng việc giấu hoàn toàn giá và quy trình khiến khách hàng ngại liên hệ vì không biết mức độ phù hợp với ngân sách của mình. Công khai khoảng giá tham khảo hoặc ít nhất quy trình làm việc theo từng bước giúp khách chủ động hơn khi quyết định liên hệ.

**4. Thông tin liên hệ dễ tìm, phản hồi nhanh là lợi thế cạnh tranh**

Với dịch vụ agency, tốc độ phản hồi ban đầu ảnh hưởng trực tiếp đến việc chốt được khách hay không. Nút liên hệ nên xuất hiện ở nhiều vị trí, không chỉ ở cuối trang.

Website agency tốt không phải là nơi khoe nhiều dự án nhất, mà là nơi giúp khách hàng tiềm năng trả lời nhanh câu hỏi: người hoặc đội ngũ này có giải quyết được đúng vấn đề tôi đang gặp không?`,
    },
  ]

  for (const post of blogPosts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        categoryId: (post.categorySlug ? blogCategoryMap[post.categorySlug] : undefined) ?? blogCategory.id,
        status: 'published',
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        createdBy: admin.id,
      },
    })
  }
  console.log('✅ Blog posts:', blogPosts.length)

  console.log('\n🎉 Seed complete!')
  console.log(`   Templates  : ${templateData.length} (${templateData.filter(t => t.category === 'web').length} web + ${templateData.filter(t => t.category === 'admin').length} admin)`)
  console.log(`   Demo base  : ${DEMO_BASE}`)
  if (process.env.NODE_ENV !== 'production') {
    console.log('   Admin login: admin@webdrop.store / webdrop@2025')
  }
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
