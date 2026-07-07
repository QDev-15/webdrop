export const revalidate = 60
export const metadata = {
  title:      'Blog & Tips về website, SEO và thiết kế',
  description: 'Hướng dẫn chọn mẫu website, tối ưu SEO, tăng tốc trang, so sánh công nghệ — kiến thức thực tế từ webdrop.store.',
  alternates: { canonical: `${process.env.NEXT_PUBLIC_URL || 'https://webdrop.store'}/blog` },
}

import Footer from '@/components/site/Footer'
import RevealObserver from '@/components/site/RevealObserver'
import BlogClient, { type BlogPostItem } from '@/components/site/BlogClient'
import { prisma } from '@/lib/prisma'
import { ensurePostThumbnail } from '@/lib/blogThumbnail'

async function getData() {
  try {
    const [posts, categories] = await Promise.all([
      prisma.post.findMany({
        where: { status: 'published' },
        include: { category: { select: { name: true, slug: true } } },
        orderBy: { createdAt: 'desc' },
        take: 60,
      }),
      prisma.category.findMany({ orderBy: { name: 'asc' } }),
    ])
    return { posts, categories }
  } catch {
    return { posts: [], categories: [] }
  }
}

const mockPosts = [
  { id: 1, title: 'Làm sao chọn template phù hợp cho ngành F&B?', slug: 'chon-template-fnb', excerpt: 'Ngành F&B có những yêu cầu đặc thù về hiển thị menu, đặt bàn và gallery ảnh. Bài viết này hướng dẫn chọn template đúng cho quán cafe, nhà hàng.', category: { name: 'Hướng dẫn', slug: 'huong-dan' }, createdAt: new Date('2026-05-15') },
  { id: 2, title: '5 lý do website của bạn load chậm và cách fix', slug: 'website-load-cham', excerpt: 'PageSpeed thấp làm mất khách hàng. Tìm hiểu nguyên nhân phổ biến và giải pháp đơn giản không cần developer.', category: { name: 'Tips', slug: 'tips' }, createdAt: new Date('2026-05-10') },
  { id: 3, title: 'Bootstrap 5.3 vs Tailwind CSS — nên chọn gì?', slug: 'bootstrap-vs-tailwind', excerpt: 'So sánh chi tiết hai CSS framework phổ biến nhất hiện nay theo góc độ của người không phải developer.', category: { name: 'Kỹ thuật', slug: 'ky-thuat' }, createdAt: new Date('2026-05-05') },
  { id: 4, title: 'Checklist SEO cơ bản cho website nhỏ', slug: 'seo-co-ban', excerpt: '10 điểm SEO đơn giản mà mọi website cần có để xuất hiện trên Google, không cần thuê chuyên gia.', category: { name: 'Tips', slug: 'tips' }, createdAt: new Date('2026-04-28') },
]

export default async function BlogPage() {
  const { posts: dbPosts, categories } = await getData()
  const hasDb = dbPosts.length > 0

  const rawPosts = hasDb ? dbPosts : mockPosts.map(p => ({ ...p, thumbnail: null as string | null, featured: false }))

  const posts: BlogPostItem[] = await Promise.all(
    rawPosts.map(async p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt || '',
      category: p.category,
      createdAt: p.createdAt,
      featured: p.featured,
      thumbnail: hasDb ? await ensurePostThumbnail(p) : p.thumbnail,
    }))
  )

  const categoryList = hasDb
    ? categories.map(c => ({ name: c.name, slug: c.slug }))
    : [...new Map(mockPosts.map(p => [p.category.slug, p.category])).values()]

  return (
    <>
      <RevealObserver />
      <div style={{ paddingTop: 62 }}>
        <BlogClient posts={posts} categories={categoryList} />
      </div>
      <Footer />
    </>
  )
}
