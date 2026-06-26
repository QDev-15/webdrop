export const revalidate = 60
export const metadata = {
  title:      'Blog & Tips về website, SEO và thiết kế',
  description: 'Hướng dẫn chọn mẫu website, tối ưu SEO, tăng tốc trang, so sánh công nghệ — kiến thức thực tế từ webdrop.store.',
  alternates: { canonical: `${process.env.NEXT_PUBLIC_URL || 'https://webdrop.store'}/blog` },
}

import Footer from '@/components/site/Footer'
import RevealObserver from '@/components/site/RevealObserver'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getPosts() {
  try {
    return await prisma.post.findMany({
      where: { status: 'published' },
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
      take: 12,
    })
  } catch { return [] }
}

const mockPosts = [
  { id: 1, title: 'Làm sao chọn template phù hợp cho ngành F&B?', slug: 'chon-template-fnb', excerpt: 'Ngành F&B có những yêu cầu đặc thù về hiển thị menu, đặt bàn và gallery ảnh. Bài viết này hướng dẫn chọn template đúng cho quán cafe, nhà hàng.', category: { name: 'Hướng dẫn' }, createdAt: new Date('2026-05-15') },
  { id: 2, title: '5 lý do website của bạn load chậm và cách fix', slug: 'website-load-cham', excerpt: 'PageSpeed thấp làm mất khách hàng. Tìm hiểu nguyên nhân phổ biến và giải pháp đơn giản không cần developer.', category: { name: 'Tips' }, createdAt: new Date('2026-05-10') },
  { id: 3, title: 'Bootstrap 5.3 vs Tailwind CSS — nên chọn gì?', slug: 'bootstrap-vs-tailwind', excerpt: 'So sánh chi tiết hai CSS framework phổ biến nhất hiện nay theo góc độ của người không phải developer.', category: { name: 'Kỹ thuật' }, createdAt: new Date('2026-05-05') },
  { id: 4, title: 'Checklist SEO cơ bản cho website nhỏ', slug: 'seo-co-ban', excerpt: '10 điểm SEO đơn giản mà mọi website cần có để xuất hiện trên Google, không cần thuê chuyên gia.', category: { name: 'Tips' }, createdAt: new Date('2026-04-28') },
]

export default async function BlogPage() {
  const dbPosts = await getPosts()
  const posts = dbPosts.length > 0 ? dbPosts.map(p => ({
    id: p.id, title: p.title, slug: p.slug,
    excerpt: p.excerpt || '',
    category: p.category,
    createdAt: p.createdAt,
    thumbnail: p.thumbnail,
  })) : mockPosts.map(p => ({ ...p, thumbnail: null }))

  return (
    <>
      <RevealObserver />
      <div style={{ paddingTop: 62 }}>
        <section style={{ background: 'var(--dark2)', padding: 'clamp(56px,8vw,88px) 0 clamp(40px,5vw,60px)', textAlign: 'center' }}>
          <div className="wd-container">
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent-mid)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 14 }}>Blog & Tips</div>
            <h1 style={{ fontSize: 'clamp(28px,4vw,50px)', fontWeight: 600, color: '#fff', letterSpacing: '-1px', marginBottom: 12 }}>
              Kiến thức <em style={{ color: '#4ade80', fontStyle: 'italic', fontWeight: 300 }}>hữu ích</em> về web
            </h1>
            <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,.4)', maxWidth: 440, margin: '0 auto' }}>
              Hướng dẫn thực tế về thiết kế, kỹ thuật và marketing cho doanh nghiệp Việt Nam.
            </p>
          </div>
        </section>

        <section className="sec-pad">
          <div className="wd-container">
            <div className="row g-4">
              {posts.map((post, i) => (
                <div key={post.id} className="col-md-6 col-lg-4">
                  <article className={`reveal reveal-d${(i % 3) + 1}`} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform .2s, box-shadow .2s' }}>
                    {post.thumbnail ? (
                      <img src={post.thumbnail} alt={post.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} loading="lazy" />
                    ) : (
                      <div style={{ height: 180, background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>📝</div>
                    )}
                    <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {post.category && (
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 8 }}>
                          {post.category.name}
                        </div>
                      )}
                      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, lineHeight: 1.5, flex: 1 }}>{post.title}</h3>
                      {post.excerpt && <p style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.6, marginBottom: 14 }}>{post.excerpt}</p>}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                        <Link href={`/blog/${post.slug}`} style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Đọc tiếp →</Link>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
