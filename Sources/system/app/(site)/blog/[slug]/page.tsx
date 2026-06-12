export const revalidate = 60

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Footer from '@/components/site/Footer'
import NavBar from '@/components/site/NavBar'
import { prisma } from '@/lib/prisma'

const BASE = process.env.NEXT_PUBLIC_URL || 'https://webdrop.vn'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params

  let title = '', desc = '', img = ''

  try {
    const row = await prisma.post.findUnique({
      where: { slug, status: 'published' },
      select: { title: true, excerpt: true, thumbnail: true },
    })
    if (row) { title = row.title; desc = row.excerpt || ''; img = row.thumbnail || '' }
  } catch { /* fallback */ }

  if (!title) {
    const mock = MOCK_POSTS[slug]
    if (mock) { title = mock.title; desc = mock.excerpt }
  }
  if (!title) return { title: 'Bài viết — webdrop.vn' }

  const ogImg = img || '/og-default.jpg'
  return {
    title,
    description: desc || undefined,
    alternates:  { canonical: `${BASE}/blog/${slug}` },
    openGraph:   { title, description: desc || undefined, images: [{ url: ogImg, width: 1200, height: 630 }], type: 'article' },
    twitter:     { card: 'summary_large_image', title, description: desc || undefined, images: [ogImg] },
  }
}

export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({ where: { status: 'published' }, select: { slug: true } })
    return posts.map(p => ({ slug: p.slug }))
  } catch {
    return [
      { slug: 'chon-template-fnb' }, { slug: 'website-load-cham' },
      { slug: 'bootstrap-vs-tailwind' }, { slug: 'seo-co-ban' },
    ]
  }
}

const MOCK_POSTS: Record<string, { title: string; excerpt: string; category: string; date: string; content: string }> = {
  'chon-template-fnb': {
    title: 'Làm sao chọn template phù hợp cho ngành F&B?',
    excerpt: 'Ngành F&B có những yêu cầu đặc thù về hiển thị menu, đặt bàn và gallery ảnh.',
    category: 'Hướng dẫn', date: '15/05/2026',
    content: `Khi lựa chọn template website cho ngành F&B (Food & Beverage), có 4 yếu tố quan trọng bạn cần xem xét:

**1. Hiển thị menu dễ đọc**
Menu là trái tim của website nhà hàng. Chọn template có layout menu dạng grid hoặc danh sách rõ ràng, hỗ trợ hiển thị ảnh món ăn, giá cả và mô tả ngắn.

**2. Tính năng đặt bàn online**
Khách hàng ngày nay muốn đặt bàn ngay trên website. Tìm template có form đặt bàn đơn giản: ngày, giờ, số người, thông tin liên hệ.

**3. Gallery ảnh đẹp**
Ảnh chất lượng cao về món ăn, không gian, bầu không khí giúp thu hút khách. Template nên có section gallery hoặc slider ảnh nổi bật.

**4. Thông tin liên hệ và địa chỉ rõ ràng**
Số điện thoại, địa chỉ, giờ mở cửa phải hiển thị nổi bật. Tích hợp Google Maps là điểm cộng lớn.

webdrop.vn cung cấp template nhà hàng/cafe tối ưu cho tất cả 4 yếu tố này với giá từ 499.000đ.`,
  },
  'website-load-cham': {
    title: '5 lý do website của bạn load chậm và cách fix',
    excerpt: 'PageSpeed thấp làm mất khách hàng. Tìm hiểu nguyên nhân phổ biến và giải pháp đơn giản.',
    category: 'Tips', date: '10/05/2026',
    content: `Một website load chậm mất 40% khách hàng trong 3 giây đầu tiên. Đây là 5 nguyên nhân phổ biến nhất:

**1. Ảnh không được tối ưu**
Đây là nguyên nhân số 1. Upload ảnh trực tiếp từ điện thoại (4-10MB/ảnh) mà không nén sẽ làm website chậm nghiêm trọng. Giải pháp: dùng TinyPNG để nén ảnh xuống dưới 200KB trước khi upload.

**2. Quá nhiều plugin/script**
Mỗi plugin hay script bên thứ 3 (chat widget, tracking, social) tốn thêm thời gian load. Chỉ giữ những gì thực sự cần thiết.

**3. Hosting kém chất lượng**
Server ở nước ngoài hoặc shared hosting rẻ tiền thường có tốc độ phản hồi chậm. Với thị trường Việt Nam, nên chọn hosting đặt tại datacenter HCM/HN.

**4. Không dùng CDN**
CDN (Content Delivery Network) phân phối file tĩnh (ảnh, CSS, JS) từ server gần người dùng nhất. Cloudflare CDN miễn phí và dễ cấu hình.

**5. Code không được minify**
CSS và JavaScript chưa được nén/minify tốn nhiều băng thông hơn cần thiết. Các template của webdrop.vn sử dụng Bootstrap qua CDN đã được tối ưu sẵn.`,
  },
  'bootstrap-vs-tailwind': {
    title: 'Bootstrap 5.3 vs Tailwind CSS — nên chọn gì?',
    excerpt: 'So sánh chi tiết hai CSS framework phổ biến nhất theo góc độ người không phải developer.',
    category: 'Kỹ thuật', date: '05/05/2026',
    content: `Cả Bootstrap và Tailwind đều là CSS framework phổ biến, nhưng chúng phục vụ hai đối tượng khác nhau:

**Bootstrap 5.3 — Phù hợp cho ai?**
- Người mới học web, designer, marketer tự làm website
- Có sẵn component hoàn chỉnh (navbar, card, modal, form...)
- Chỉ cần thêm class vào HTML, không cần viết CSS nhiều
- File CSS khoảng 25KB (gzip), load nhanh qua CDN

**Tailwind CSS — Phù hợp cho ai?**
- Developer chuyên nghiệp xây dựng UI tùy chỉnh cao
- Utility-first: viết style trực tiếp trong class HTML
- Cần build system (Node.js, npm) — không mở thẳng trên trình duyệt được
- Tối ưu bundle size tốt hơn khi dùng đúng cách

**webdrop.vn chọn Bootstrap vì:**
Template của chúng tôi được thiết kế để khách hàng tự chỉnh sửa mà không cần developer. Bootstrap cho phép mở file HTML thẳng trên trình duyệt, không cần build system, dễ chỉnh nội dung hơn cho người không biết code.

Nếu bạn là developer xây dựng ứng dụng React/Next.js phức tạp, Tailwind là lựa chọn tốt hơn.`,
  },
  'seo-co-ban': {
    title: 'Checklist SEO cơ bản cho website nhỏ',
    excerpt: '10 điểm SEO đơn giản mà mọi website cần có để xuất hiện trên Google.',
    category: 'Tips', date: '28/04/2026',
    content: `SEO không nhất thiết phải phức tạp. Đây là 10 điểm cơ bản mọi website cần làm:

**1. Tiêu đề trang (Title Tag)**
Mỗi trang cần title riêng, dưới 60 ký tự, chứa từ khóa chính. Ví dụ: "Nhà hàng Hải Sản Đà Nẵng | Đặt bàn 0901 234 567"

**2. Meta Description**
Mô tả ngắn 150-160 ký tự xuất hiện dưới tiêu đề trong kết quả Google. Viết hấp dẫn để tăng click.

**3. Heading structure (H1, H2, H3)**
Mỗi trang chỉ có 1 thẻ H1, dùng H2/H3 cho các mục phụ. Đưa từ khóa vào H1.

**4. URL thân thiện**
URL nên ngắn gọn, có từ khóa: '/nha-hang-hai-san' thay vì '/page?id=123'

**5. Ảnh có alt text**
Mô tả ảnh giúp Google hiểu nội dung và cải thiện accessibility.

**6. Tốc độ tải trang**
Trang load nhanh được Google ưu tiên. Xem bài viết về tối ưu tốc độ của chúng tôi.

**7. Mobile-friendly**
Tất cả template webdrop.vn đều responsive 100% — điểm cộng lớn với Google Mobile-First Index.

**8. Google Search Console**
Đăng ký miễn phí, submit sitemap để Google crawl website của bạn nhanh hơn.

**9. Nội dung chất lượng**
Viết ít nhất 300 từ trên mỗi trang quan trọng, trả lời đúng câu hỏi của khách hàng.

**10. Internal linking**
Liên kết giữa các trang trong website giúp Google hiểu cấu trúc và tăng thời gian ở lại.`,
  },
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let post: {
    title: string; excerpt: string | null; content: string | null; thumbnail: string | null
    category: { name: string; slug: string } | null; createdAt: Date | string
  } | null = null

  try {
    const row = await prisma.post.findUnique({
      where: { slug, status: 'published' },
      include: { category: { select: { name: true, slug: true } } },
    })
    if (row) post = row
  } catch { /* DB offline */ }

  if (!post) {
    const mock = MOCK_POSTS[slug]
    if (!mock) notFound()
    post = {
      title: mock.title,
      excerpt: mock.excerpt,
      content: mock.content,
      thumbnail: null,
      category: { name: mock.category, slug: mock.category.toLowerCase() },
      createdAt: mock.date,
    }
  }

  const dateStr = post.createdAt instanceof Date
    ? post.createdAt.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : String(post.createdAt)

  function renderMarkdown(text: string) {
    const lines = text.split('\n')
    const result: React.ReactNode[] = []
    let listItems: string[] = []
    let listKey = 0

    function flushList() {
      if (listItems.length > 0) {
        result.push(
          <ul key={`ul-${listKey++}`} style={{ paddingLeft: 20, marginBottom: 14 }}>
            {listItems.map((item, j) => (
              <li key={j} style={{ marginBottom: 6 }} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
            ))}
          </ul>
        )
        listItems = []
      }
    }

    lines.forEach((line, i) => {
      if (!line.trim()) { flushList(); return }
      if (line.startsWith('- ')) {
        listItems.push(line.slice(2))
      } else if (/^\*\*[^*]+\*\*$/.test(line.trim())) {
        flushList()
        result.push(<h2 key={i} style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', marginTop: 28, marginBottom: 10 }}>{line.replace(/\*\*/g, '')}</h2>)
      } else {
        flushList()
        result.push(<p key={i} style={{ marginBottom: 14 }} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />)
      }
    })
    flushList()
    return result
  }

  const articleSchema = {
    '@context':       'https://schema.org',
    '@type':          'Article',
    headline:         post.title,
    description:      post.excerpt || undefined,
    image:            post.thumbnail || undefined,
    datePublished:    post.createdAt instanceof Date ? post.createdAt.toISOString() : undefined,
    dateModified:     post.createdAt instanceof Date ? post.createdAt.toISOString() : undefined,
    author:           { '@type': 'Organization', name: 'webdrop.vn', url: BASE },
    publisher:        { '@type': 'Organization', name: 'webdrop.vn', logo: { '@type': 'ImageObject', url: `${BASE}/logo.png` } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE}/blog/${slug}` },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <NavBar />
      <div style={{ paddingTop: 62 }}>
        {/* Hero */}
        {post.thumbnail ? (
          <div style={{ position: 'relative', height: 'clamp(220px,30vw,420px)', overflow: 'hidden' }}>
            <img src={post.thumbnail} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(12,11,9,.7))' }} />
          </div>
        ) : (
          <div style={{ background: 'var(--dark2)', padding: 'clamp(48px,7vw,72px) 0 clamp(32px,5vw,48px)' }}>
            <div className="wd-container" style={{ textAlign: 'center' }}>
              {post.category && (
                <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent-mid)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 14 }}>{post.category.name}</div>
              )}
              <h1 style={{ fontSize: 'clamp(22px,3.5vw,42px)', fontWeight: 600, color: '#fff', letterSpacing: '-1px', lineHeight: 1.2, maxWidth: 720, margin: '0 auto 12px' }}>{post.title}</h1>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', fontWeight: 300 }}>{dateStr}</div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="wd-container" style={{ maxWidth: 760, padding: 'clamp(36px,6vw,64px) clamp(20px,5vw,80px)' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, fontSize: 13 }}>
            <Link href="/" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Trang chủ</Link>
            <span style={{ color: 'var(--text-3)' }}>›</span>
            <Link href="/blog" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Blog</Link>
            <span style={{ color: 'var(--text-3)' }}>›</span>
            <span style={{ color: 'var(--text-2)' }}>{post.title.length > 40 ? post.title.slice(0, 40) + '...' : post.title}</span>
          </div>

          {/* Meta (if thumbnail hero) */}
          {post.thumbnail && (
            <div style={{ marginBottom: 20 }}>
              {post.category && (
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.5px', marginRight: 12 }}>{post.category.name}</span>
              )}
              <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{dateStr}</span>
              <h1 style={{ fontSize: 'clamp(22px,3vw,36px)', fontWeight: 600, letterSpacing: '-.5px', lineHeight: 1.25, marginTop: 10 }}>{post.title}</h1>
            </div>
          )}

          {/* Excerpt highlight */}
          {post.excerpt && (
            <p style={{ fontSize: 16, fontWeight: 400, color: 'var(--text-2)', lineHeight: 1.8, borderLeft: '3px solid var(--accent)', paddingLeft: 18, marginBottom: 32, fontStyle: 'italic' }}>
              {post.excerpt}
            </p>
          )}

          {/* Body content */}
          <div style={{ fontSize: 15, lineHeight: 1.85, color: 'var(--text)', fontWeight: 300 }}>
            {renderMarkdown(post.content || post.excerpt || '')}
          </div>

          {/* CTA */}
          <div style={{ marginTop: 40, background: 'var(--accent-light)', border: '1px solid rgba(26,107,82,.15)', borderRadius: 14, padding: 'clamp(20px,4vw,32px)', textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Tìm template phù hợp cho doanh nghiệp của bạn?</div>
            <p style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 300, marginBottom: 18 }}>Duyệt thư viện mẫu Bootstrap 5 — mở file là chạy, không cần build.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/templates" style={{ padding: '10px 22px', borderRadius: 9, background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>Xem thư viện mẫu</Link>
              <Link href="/contact" style={{ padding: '10px 22px', borderRadius: 9, border: '1px solid var(--border)', color: 'var(--text-2)', fontSize: 13, textDecoration: 'none' }}>Tư vấn miễn phí</Link>
            </div>
          </div>

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border-light)' }}>
            <Link href="/blog" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>← Quay lại Blog</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
