import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Get admin user
    const adminUser = await prisma.user.findFirst({
      where: { role: 'superadmin' },
    })

    if (!adminUser) {
      console.error('No admin user found!')
      process.exit(1)
    }

    // Get or create categories
    const categories = {
      'bat-dau': await prisma.helpCategory.upsert({
        where: { slug: 'bat-dau' },
        update: {},
        create: { slug: 'bat-dau', name: 'Bắt đầu', sortOrder: 1 },
      }),
      'mua-tai-template': await prisma.helpCategory.upsert({
        where: { slug: 'mua-tai-template' },
        update: {},
        create: { slug: 'mua-tai-template', name: 'Mua & Tải Template', sortOrder: 2 },
      }),
      'thanh-toan-hoa-don': await prisma.helpCategory.upsert({
        where: { slug: 'thanh-toan-hoa-don' },
        update: {},
        create: { slug: 'thanh-toan-hoa-don', name: 'Thanh toán & Hóa đơn', sortOrder: 3 },
      }),
      'lien-he-ho-tro': await prisma.helpCategory.upsert({
        where: { slug: 'lien-he-ho-tro' },
        update: {},
        create: { slug: 'lien-he-ho-tro', name: 'Liên hệ Hỗ trợ', sortOrder: 11 },
      }),
    }

    // Simple articles without complex formatting
    const articles = [
      {
        slug: 'webdrop-la-gi',
        title: 'webdrop.store là gì?',
        excerpt: 'Nền tảng toàn diện giúp xây dựng website, template và giải pháp online',
        content: 'webdrop.store cung cấp 3 dòng sản phẩm chính: Template website, Website hoàn chỉnh với admin, và CV Builder SaaS. Mỗi sản phẩm đều được thiết kế thân thiện, hỗ trợ SEO, và dễ quản lý không cần kiến thức lập trình.',
        categorySlug: 'bat-dau',
        metaTitle: 'webdrop.store - Nền tảng Website & Template',
        metaDescription: 'Nền tảng cung cấp website, template, CV builder với giá cả phải chăng',
      },
      {
        slug: 'so-sanh-3-san-pham',
        title: 'So sánh 3 sản phẩm: Template vs Website vs CV',
        excerpt: 'Bảng so sánh chi tiết 3 gói sản phẩm để chọn phù hợp',
        content: 'Template: 199k-999k, file HTML tĩnh, tự chỉnh sửa. Website hoàn chỉnh: 3-22 triệu, có admin panel, database, thanh toán online. CV Builder: 99k/CV, tạo CV online, chia sẻ link, export PDF/Word. Chọn dựa trên nhu cầu của bạn.',
        categorySlug: 'bat-dau',
        metaTitle: 'So sánh 3 sản phẩm: Template vs Website vs CV Builder',
        metaDescription: 'Bảng so sánh chi tiết giúp chọn gói sản phẩm phù hợp',
      },
      {
        slug: 'chon-san-pham-phu-hop',
        title: 'Chọn sản phẩm phù hợp cho bạn',
        excerpt: 'Hướng dẫn xác định nhu cầu và chọn gói sản phẩm',
        content: 'Freelancer tìm việc: CV Builder. Muốn website đơn giản: Template. Quán ăn/salon: Website hoàn chỉnh. Shop bán hàng: Website hoàn chỉnh. Agency: Template hoặc custom.',
        categorySlug: 'bat-dau',
        metaTitle: 'Cách chọn sản phẩm phù hợp',
        metaDescription: 'Hướng dẫn chi tiết cho bạn chọn đúng gói sản phẩm',
      },
      {
        slug: 'cac-buoc-mua-san-pham',
        title: 'Các bước mua sản phẩm đầu tiên',
        excerpt: 'Hướng dẫn từng bước từ A đến Z',
        content: 'Bước 1: Duyệt thư viện mẫu. Bước 2: Xem chi tiết. Bước 3: Thêm vào giỏ. Bước 4: Thanh toán. Bước 5: Nhập thông tin. Bước 6: Xác nhận thanh toán. Bước 7: Tải file hoặc nhận tài khoản admin.',
        categorySlug: 'bat-dau',
        metaTitle: 'Hướng dẫn mua sản phẩm từng bước',
        metaDescription: 'Quy trình mua từ duyệt mẫu đến thanh toán',
      },
      {
        slug: 'faq-bat-dau',
        title: 'Câu hỏi thường gặp khi bắt đầu',
        excerpt: 'Giải đáp những câu hỏi phổ biến',
        content: 'Cần biết code không? Không. Template miễn phí không? Không, từ 99k. Cần hosting riêng không? Website gói B cần, template thì không. Có hỗ trợ không? Có, email support@webdrop.store.',
        categorySlug: 'bat-dau',
        metaTitle: 'FAQ - Câu hỏi thường gặp',
        metaDescription: 'Trả lời câu hỏi phổ biến của người dùng mới',
      },
      {
        slug: 'duyet-va-tim-template',
        title: 'Cách duyệt & tìm template phù hợp',
        excerpt: 'Sử dụng bộ lọc để tìm template hoàn hảo',
        content: 'Duyệt theo ngành: Nhà hàng, Spa, Shop, Nha khoa. Tìm kiếm từ khóa. Lọc theo loại: Template hoặc Website. Xem đánh giá. Chọn theo màu sắc yêu thích, kiểm tra responsive trên mobile.',
        categorySlug: 'mua-tai-template',
        metaTitle: 'Hướng dẫn duyệt và tìm template',
        metaDescription: 'Sử dụng bộ lọc để tìm template phù hợp',
      },
      {
        slug: 'huong-dan-mua-template',
        title: 'Hướng dẫn mua template từng bước',
        excerpt: 'Quy trình: thêm vào giỏ → thanh toán → tải file',
        content: 'Chọn template → Xem chi tiết → Thêm vào giỏ → Xem giỏ hàng → Thanh toán → Nhập thông tin → Chuyển khoản → Nhận email → Tải file.',
        categorySlug: 'mua-tai-template',
        metaTitle: 'Hướng dẫn mua template chi tiết',
        metaDescription: 'Các bước mua từ chọn mẫu đến tải file',
      },
      {
        slug: 'cac-loai-template-theo-nganh',
        title: 'Các loại template có sẵn theo ngành',
        excerpt: 'Danh sách template theo các ngành kinh doanh',
        content: 'Nhà hàng: 10 template. Spa & Làm đẹp: 10 template. Shop: 14 template. Nha khoa: 10 template. Agency & Portfolio: 6 template. Khác: Blog, Forum, Cafe, Pilates.',
        categorySlug: 'mua-tai-template',
        metaTitle: 'Danh sách template theo ngành',
        metaDescription: 'Khám phá 50+ template theo các ngành khác nhau',
      },
      {
        slug: 'template-hay-website',
        title: 'Template nào có website đầy đủ',
        excerpt: 'Phân biệt template-only và website hoàn chỉnh',
        content: 'Badge 📦 = Template chỉ file HTML. Badge 🌐 = Website hoàn chỉnh với admin panel. Template-only giá rẻ, chỉnh sửa file HTML. Website hoàn chỉnh giá cao, có admin panel, database.',
        categorySlug: 'mua-tai-template',
        metaTitle: 'Phân biệt Template-only và Website hoàn chỉnh',
        metaDescription: 'Hướng dẫn phân biệt 2 loại template',
      },
      {
        slug: 'cach-tai-file-template',
        title: 'Cách tải file template sau thanh toán',
        excerpt: 'Hướng dẫn tải từ email xác nhận',
        content: 'Chờ 1-5 phút sau chuyển khoản. Mở email từ webdrop.store. Nhấn link tải trong email. Giải nén file .zip. Tìm file index.html. Mở bằng trình duyệt. Chỉnh sửa nếu cần.',
        categorySlug: 'mua-tai-template',
        metaTitle: 'Hướng dẫn tải file template',
        metaDescription: 'Cách tải, giải nén, và mở file template',
      },
      {
        slug: 'khong-nhan-email-tai',
        title: 'Không nhận được email tải?',
        excerpt: 'Giải pháp khi không nhận email',
        content: 'Kiểm tra email chính, spam, junk. Chờ 10 phút rồi refresh. Kiểm tra tài khoản webdrop: Tài khoản → Lịch sử tải → link download trực tiếp. Kiểm tra trạng thái thanh toán. Liên hệ support@webdrop.store nếu vẫn không được.',
        categorySlug: 'mua-tai-template',
        metaTitle: 'Giải quyết vấn đề không nhận email tải',
        metaDescription: 'Các lý do và cách khắc phục',
      },
      {
        slug: 'tai-lai-template-bao-nhieu-lan',
        title: 'Tải lại template bao nhiêu lần?',
        excerpt: 'Chính sách tải lại file',
        content: 'Tải lại không giới hạn. Cách 1: Tài khoản → Lịch sử tải → Tải lại. Cách 2: Email cũ → nhấn link tải. Cách 3: Email support@webdrop.store. Mỗi lần tải được file mới nhất.',
        categorySlug: 'mua-tai-template',
        metaTitle: 'Tải lại template - Chính sách',
        metaDescription: 'Bạn có thể tải lại bao nhiêu lần tùy thích',
      },
      {
        slug: 'template-co-ho-tro-refund',
        title: 'Template có hỗ trợ refund không?',
        excerpt: 'Chính sách hoàn tiền',
        content: 'Hoàn 100% trong 7 ngày nếu không hài lòng. Không hoàn nếu quá 7 ngày, đã chỉnh sửa, đã sử dụng trên website live. Email support@webdrop.store kèm mã đơn để yêu cầu hoàn tiền.',
        categorySlug: 'mua-tai-template',
        metaTitle: 'Chính sách hoàn tiền template',
        metaDescription: 'Điều kiện và quy trình hoàn tiền',
      },
      {
        slug: 'cac-phuong-thuc-thanh-toan',
        title: 'Các phương thức thanh toán',
        excerpt: 'Danh sách các cách thanh toán',
        content: 'Chuyển khoản: không phí, 1-5 phút xác nhận. Ví điện tử SePay: không phí, liền tức. Thanh toán tiền mặt COD: có phí vận chuyển. Chọn phương thức lúc thanh toán.',
        categorySlug: 'thanh-toan-hoa-don',
        metaTitle: 'Các phương thức thanh toán',
        metaDescription: 'Danh sách đầy đủ các cách thanh toán',
      },
      {
        slug: 'huong-dan-thanh-toan-chuyen-khoan',
        title: 'Hướng dẫn thanh toán chuyển khoản',
        excerpt: 'Các bước chi tiết để thanh toán',
        content: 'Chọn chuyển khoản ngân hàng. Sao chép thông tin tài khoản. Mở app ngân hàng. Chọn chuyển khoản → Chuyển đến ngân hàng khác. Điền số tài khoản, số tiền, nội dung (mã đơn). Xác nhận OTP. Chờ 1-5 phút xác nhận.',
        categorySlug: 'thanh-toan-hoa-don',
        metaTitle: 'Hướng dẫn chuyển khoản chi tiết',
        metaDescription: 'Các bước thanh toán bằng chuyển khoản',
      },
      {
        slug: 'xac-nhan-thanh-toan-mat-bao-lau',
        title: 'Xác nhận thanh toán mất bao lâu?',
        excerpt: 'Thời gian xác nhận thanh toán',
        content: 'Bình thường 1-5 phút. Ngoài giờ làm việc: xác nhận hôm sau. Nếu chậm quá 30 phút: kiểm tra số tiền, nội dung, email spam. Kiểm tra lịch sử đơn hàng. Liên hệ support nếu vẫn chưa.',
        categorySlug: 'thanh-toan-hoa-don',
        metaTitle: 'Thời gian xác nhận thanh toán',
        metaDescription: 'Bao lâu thì xác nhận thanh toán',
      },
      {
        slug: 'khong-nhan-email-xac-nhan',
        title: 'Không nhận email xác nhận?',
        excerpt: 'Cách kiểm tra email xác nhận',
        content: 'Kiểm tra inbox, spam, junk. Chờ 10 phút rồi refresh. Đăng nhập webdrop.store → Tài khoản → Lịch sử tải → tải link trực tiếp. Kiểm tra lịch sử đơn hàng → xem trạng thái. Email support@webdrop.store nếu vẫn không tìm được.',
        categorySlug: 'thanh-toan-hoa-don',
        metaTitle: 'Tìm email xác nhận thanh toán',
        metaDescription: 'Hướng dẫn tìm lại email hoặc lấy link tải trực tiếp',
      },
      {
        slug: 'cach-tai-hoa-don',
        title: 'Cách tải hóa đơn',
        excerpt: 'Tải hóa đơn từ tài khoản',
        content: 'Đăng nhập webdrop.store. Tài khoản → Lịch sử đơn hàng. Tìm đơn hàng → Tải hóa đơn hoặc PDF. Hóa đơn thường được cấp. Hóa đơn VAT: chưa áp dụng, email support để hỏi.',
        categorySlug: 'thanh-toan-hoa-don',
        metaTitle: 'Hướng dẫn tải hóa đơn',
        metaDescription: 'Cách lấy hóa đơn PDF từ webdrop',
      },
      {
        slug: 'chinh-sach-hoan-tien',
        title: 'Chính sách hoàn tiền & refund',
        excerpt: 'Điều kiện và quy trình hoàn tiền',
        content: 'Hoàn 100% trong 7 ngày từ ngày mua. Không hoàn nếu quá 7 ngày, đã chỉnh sửa, đã dùng trên website live, tải >10 lần. Email support@webdrop.store với mã đơn + lý do. Hoàn về tài khoản gốc trong 3-5 ngày.',
        categorySlug: 'thanh-toan-hoa-don',
        metaTitle: 'Chính sách hoàn tiền',
        metaDescription: 'Điều kiện và quy trình hoàn tiền',
      },
      {
        slug: 'don-hang-co-van-de',
        title: 'Đơn hàng có vấn đề? Liên hệ hỗ trợ',
        excerpt: 'Cách liên hệ support để giải quyết',
        content: 'Email: support@webdrop.store (1-2h phản hồi). Form liên hệ trên website. Zalo/Phone: vấn đề cấp bách. Gửi: mã đơn hàng, tên template, email, điện thoại, mô tả vấn đề. Không spam tin nhắn.',
        categorySlug: 'thanh-toan-hoa-don',
        metaTitle: 'Liên hệ hỗ trợ khi có vấn đề',
        metaDescription: 'Cách liên hệ để giải quyết vấn đề đơn hàng',
      },
      {
        slug: 'ma-giam-gia',
        title: 'Mã giảm giá & cách sử dụng',
        excerpt: 'Cách tìm, nhập, và sử dụng mã',
        content: 'Tìm ở: email, trang chủ, Facebook, newsletter. Loại: giảm % hoặc cố định tiền. Cách dùng: thêm vào giỏ → ô mã giảm giá → nhập mã → áp dụng. Giá sẽ cập nhật tự động. 1 đơn chỉ dùng 1 mã.',
        categorySlug: 'thanh-toan-hoa-don',
        metaTitle: 'Hướng dẫn sử dụng mã giảm giá',
        metaDescription: 'Tìm và sử dụng mã khuyến mại',
      },
      {
        slug: 'lien-he-ho-tro-full',
        title: 'Liên hệ hỗ trợ',
        excerpt: 'Thông tin liên hệ và cách nhận hỗ trợ',
        content: 'Email: support@webdrop.store (1-2h, giờ hành chính). Zalo/Phone: xem trong đơn hàng. Form: webdrop.store → Liên hệ. Giờ: thứ 2-6 8h-17h30. Email nhanh nhất. Cung cấp: mã đơn, email, mô tả rõ ràng. Không spam.',
        categorySlug: 'lien-he-ho-tro',
        metaTitle: 'Liên hệ Hỗ trợ',
        metaDescription: 'Thông tin liên hệ support webdrop.store',
      },
    ]

    // Insert articles
    let created = 0
    for (const article of articles) {
      const category = categories[article.categorySlug as keyof typeof categories]

      await prisma.helpArticle.upsert({
        where: { slug: article.slug },
        update: {
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          metaTitle: article.metaTitle,
          metaDescription: article.metaDescription,
        },
        create: {
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          metaTitle: article.metaTitle,
          metaDescription: article.metaDescription,
          categoryId: category.id,
          createdBy: adminUser.id,
          status: 'published',
          sortOrder: created + 1,
        },
      })

      created++
    }

    console.log(`✅ Seeded ${created} help articles`)
  } catch (error) {
    console.error('Error seeding articles:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
