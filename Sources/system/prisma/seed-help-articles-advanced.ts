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

    const articles = [
      // Website & Deploy (15 bài)
      { slug: 'website-goi-b-la-gi', title: 'Website Gói B là gì?', excerpt: 'Giới thiệu Website Gói B hoàn chỉnh', categorySlug: 'website-deploy' },
      { slug: 'yeu-cau-hosting-website', title: 'Yêu cầu hosting', excerpt: 'Hosting tối thiểu cho website', categorySlug: 'website-deploy' },
      { slug: 'huong-dan-deploy-website', title: 'Hướng dẫn deploy từng bước', excerpt: 'Quy trình deploy A-Z', categorySlug: 'website-deploy' },
      { slug: 'huong-dan-admin-panel', title: 'Sử dụng admin panel', excerpt: 'Quản lý website qua admin', categorySlug: 'website-deploy' },
      { slug: 'chinh-sua-noi-dung-website', title: 'Chỉnh sửa nội dung', excerpt: 'Cập nhật text, ảnh, menu', categorySlug: 'website-deploy' },
      { slug: 'cai-dat-sepay', title: 'Cài đặt thanh toán SePay', excerpt: 'Tích hợp SePay cho website', categorySlug: 'website-deploy' },
      { slug: 'van-de-thuong-gap-deploy', title: 'Vấn đề thường gặp khi deploy', excerpt: 'Giải quyết các lỗi phổ biến', categorySlug: 'website-deploy' },
      { slug: 'backup-restore-database', title: 'Backup & restore database', excerpt: 'Sao lưu dữ liệu website', categorySlug: 'website-deploy' },
      { slug: 'di-chuyen-website-sang-hosting', title: 'Di chuyển sang hosting khác', excerpt: 'Migrate website', categorySlug: 'website-deploy' },
      { slug: 'ho-tro-hosting-cu-the', title: 'Hỗ trợ hosting cụ thể', excerpt: 'Hướng dẫn từng hosting', categorySlug: 'website-deploy' },
      { slug: 'toc-do-website-chap', title: 'Tốc độ website chập', excerpt: 'Cải thiện performance', categorySlug: 'website-deploy' },
      { slug: 'ssl-https-can-thiet', title: 'SSL/HTTPS có cần thiết?', excerpt: 'Bảo mật website', categorySlug: 'website-deploy' },
      { slug: 'email-template-loi-sai', title: 'Email từ admin lỗi sai', excerpt: 'Fix email thông báo', categorySlug: 'website-deploy' },
      { slug: 'backup-tu-dong', title: 'Backup tự động', excerpt: 'Tự động sao lưu database', categorySlug: 'website-deploy' },
      { slug: 'cache-optimization', title: 'Tối ưu cache website', excerpt: 'Tăng tốc độ qua cache', categorySlug: 'website-deploy' },

      // CV Builder (7 bài)
      { slug: 'cv-builder-la-gi', title: 'CV Builder là gì?', excerpt: 'Giới thiệu CV Builder SaaS', categorySlug: 'cv-builder' },
      { slug: 'tao-cv-tung-buoc', title: 'Tạo CV từng bước', excerpt: 'Quy trình tạo CV', categorySlug: 'cv-builder' },
      { slug: 'lua-chon-template-cv', title: 'Lựa chọn template CV', excerpt: 'Các mẫu CV có sẵn', categorySlug: 'cv-builder' },
      { slug: 'chinh-sua-cv', title: 'Chỉnh sửa CV', excerpt: 'Cập nhật CV online', categorySlug: 'cv-builder' },
      { slug: 'chia-se-cv', title: 'Chia sẻ CV', excerpt: 'Share link & QR code', categorySlug: 'cv-builder' },
      { slug: 'export-cv', title: 'Export CV', excerpt: 'Xuất PDF, Word, HTML', categorySlug: 'cv-builder' },
      { slug: 'template-cv-chi-tiet', title: 'Template CV chi tiết', excerpt: 'Tất cả mẫu CV', categorySlug: 'cv-builder' },

      // Tài liệu & Hướng dẫn (12 bài)
      { slug: 'mo-quan-online', title: '5 điều khi mở quán online', excerpt: 'Tips khởi đầu', categorySlug: 'tai-lieu-huong-dan' },
      { slug: 'toi-uu-website-ban-hang', title: 'Tối ưu website bán hàng', excerpt: 'Tăng conversion', categorySlug: 'tai-lieu-huong-dan' },
      { slug: 'seo-co-ban', title: 'SEO cơ bản', excerpt: 'Hướng dẫn SEO beginner', categorySlug: 'tai-lieu-huong-dan' },
      { slug: 'toc-do-anh-huong-seo', title: 'Tốc độ ảnh hưởng SEO', excerpt: 'Tác động tốc độ', categorySlug: 'tai-lieu-huong-dan' },
      { slug: 'so-sanh-template-shop', title: 'So sánh template shop', excerpt: 'Chọn template phù hợp', categorySlug: 'tai-lieu-huong-dan' },
      { slug: 'website-an-toan', title: 'Website an toàn & đáng tin', excerpt: 'Xây dựng trust', categorySlug: 'tai-lieu-huong-dan' },
      { slug: 'mobile-first-design', title: 'Mobile-first design', excerpt: 'Responsive mobile', categorySlug: 'tai-lieu-huong-dan' },
      { slug: 'email-marketing-co-ban', title: 'Email marketing cơ bản', excerpt: 'Gửi email hiệu quả', categorySlug: 'tai-lieu-huong-dan' },
      { slug: 'social-media-integration', title: 'Tích hợp Social Media', excerpt: 'Kết nối social', categorySlug: 'tai-lieu-huong-dan' },
      { slug: 'analytics-seo-tools', title: 'Analytics & SEO tools', excerpt: 'Tools miễn phí', categorySlug: 'tai-lieu-huong-dan' },
      { slug: 'content-marketing', title: 'Content marketing cơ bản', excerpt: 'Chiến lược nội dung', categorySlug: 'tai-lieu-huong-dan' },
      { slug: 'customer-retention', title: 'Giữ khách hàng lâu dài', excerpt: 'Retention strategy', categorySlug: 'tai-lieu-huong-dan' },

      // Khắc phục sự cố (8 bài)
      { slug: 'faq-chung', title: 'FAQ chung', excerpt: 'Câu hỏi thường gặp', categorySlug: 'khac-phuc-su-co' },
      { slug: 'template-browser-nao', title: 'Template hoạt động trên browser nào', excerpt: 'Tương thích trình duyệt', categorySlug: 'khac-phuc-su-co' },
      { slug: 'tuy-chinh-template', title: 'Tùy chỉnh template', excerpt: 'Cách chỉnh sửa', categorySlug: 'khac-phuc-su-co' },
      { slug: 'thay-doi-mau-font', title: 'Thay đổi màu & font', excerpt: 'Tùy chỉnh design', categorySlug: 'khac-phuc-su-co' },
      { slug: 'them-xoa-trang-html', title: 'Thêm/xóa trang HTML', excerpt: 'Quản lý trang', categorySlug: 'khac-phuc-su-co' },
      { slug: 'toi-uu-toc-do', title: 'Tối ưu tốc độ', excerpt: 'Tăng tốc load', categorySlug: 'khac-phuc-su-co' },
      { slug: 'van-de-responsive-mobile', title: 'Vấn đề responsive mobile', excerpt: 'Fix lỗi mobile', categorySlug: 'khac-phuc-su-co' },
      { slug: 'doi-ten-mien-domain', title: 'Đổi tên miền', excerpt: 'Chuyển domain', categorySlug: 'khac-phuc-su-co' },

      // Thiết kế & Tùy chỉnh (6 bài)
      { slug: 'design-system', title: 'Design system webdrop', excerpt: 'Màu, font, layout', categorySlug: 'thiet-ke-tuy-chinh' },
      { slug: 'css-co-ban', title: 'CSS cơ bản', excerpt: 'Học CSS điều chỉnh', categorySlug: 'thiet-ke-tuy-chinh' },
      { slug: 'google-fonts', title: 'Google Fonts', excerpt: 'Thêm font mới', categorySlug: 'thiet-ke-tuy-chinh' },
      { slug: 'css-animations', title: 'CSS Animations', excerpt: 'Làm đẹp website', categorySlug: 'thiet-ke-tuy-chinh' },
      { slug: 'bootstrap-reference', title: 'Bootstrap 5 reference', excerpt: 'Class Bootstrap', categorySlug: 'thiet-ke-tuy-chinh' },
      { slug: 'tools-che-chinh-sua', title: 'Tools hỗ trợ chỉnh sửa', excerpt: 'Plugin & tool', categorySlug: 'thiet-ke-tuy-chinh' },

      // Quản lý & Tài khoản (6 bài)
      { slug: 'doi-mat-khau', title: 'Đổi mật khẩu', excerpt: 'Thay đổi mật khẩu', categorySlug: 'quan-ly-tai-khoan' },
      { slug: 'bat-2fa', title: 'Bật 2FA', excerpt: 'Xác thực 2 lớp', categorySlug: 'quan-ly-tai-khoan' },
      { slug: 'quan-ly-san-pham-mua', title: 'Quản lý sản phẩm đã mua', excerpt: 'Theo dõi template', categorySlug: 'quan-ly-tai-khoan' },
      { slug: 'lich-su-don-hang', title: 'Lịch sử đơn hàng', excerpt: 'Xem lịch sử', categorySlug: 'quan-ly-tai-khoan' },
      { slug: 'xoa-tai-khoan', title: 'Xóa tài khoản', excerpt: 'Hủy tài khoản', categorySlug: 'quan-ly-tai-khoan' },
      { slug: 'chinh-sach-bao-mat', title: 'Chính sách bảo mật', excerpt: 'Privacy policy', categorySlug: 'quan-ly-tai-khoan' },

      // Tích hợp & API (4 bài)
      { slug: 'api-reference', title: 'API reference', excerpt: 'Tài liệu API', categorySlug: 'tich-hop-api' },
      { slug: 'webhook-sepay', title: 'Webhook SePay', excerpt: 'Xác nhận thanh toán', categorySlug: 'tich-hop-api' },
      { slug: 'cloudflare-r2', title: 'Cloudflare R2 CDN', excerpt: 'Setup CDN ảnh', categorySlug: 'tich-hop-api' },
      { slug: 'zapier-integration', title: 'Zapier Integration', excerpt: 'Tự động hóa workflow', categorySlug: 'tich-hop-api' },
    ]

    let created = 0
    for (const article of articles) {
      const category = await prisma.helpCategory.findUnique({
        where: { slug: article.categorySlug },
      })

      if (!category) {
        console.warn(`⚠️  Category ${article.categorySlug} not found, skipping ${article.slug}`)
        continue
      }

      await prisma.helpArticle.upsert({
        where: { slug: article.slug },
        update: { title: article.title, excerpt: article.excerpt },
        create: {
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          content: `Nội dung chi tiết cho: ${article.title}`,
          categoryId: category.id,
          createdBy: adminUser.id,
          status: 'published',
          sortOrder: created + 1,
        },
      })

      created++
      console.log(`✓ ${article.slug}`)
    }

    console.log(`\n✅ Seeded ${created} advanced help articles`)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
