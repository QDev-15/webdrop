import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useSite, type Product } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { fmtVND } from '../data/filters'

// Bố cục bento — thứ tự & kích thước ô khớp đúng bo-suu-tap.html gốc:
// Bắc Âu (big 2x2) · Nhật Bản Zen (1x1) · Công nghiệp (1x1) · Vintage (wide 2x1)
const BENTO_SIZE: Record<string, string> = { scandinavian: 'big', vintage: 'wide' }
const HEADS: Record<string, { eyebrow: string; title: string; emphasis: string }> = {
  scandinavian: { eyebrow: 'Bắc Âu tối giản', title: 'Đường nét ', emphasis: 'thanh gọn' },
  'nhat-ban-zen': { eyebrow: 'Nhật Bản Zen', title: 'Cân bằng ', emphasis: 'Wabi-sabi' },
  industrial: { eyebrow: 'Công nghiệp mộc mạc', title: 'Chất liệu ', emphasis: 'khỏe khoắn' },
  vintage: { eyebrow: 'Hoài cổ Vintage', title: 'Vẻ đẹp ', emphasis: 'cổ điển' },
}

function TeaserCard({ p }: { p: Product }) {
  const price = p.price_sale != null && p.price_sale > 0 && p.price_sale < p.price ? p.price_sale : p.price
  return (
    <article className="nt-prod-card">
      <Link to={`/san-pham/${p.slug}`} className="nt-prod-thumb"><img src={p.image} alt={p.name} loading="lazy" /></Link>
      <Link to={`/san-pham/${p.slug}`}><h3 className="nt-prod-name">{p.name}</h3></Link>
      <div className="nt-prod-price-row"><span className="nt-prod-price">{fmtVND(price)}</span></div>
    </article>
  )
}

function CollectionTeaser({ slug }: { slug: string }) {
  const [items, setItems] = useState<Product[]>([])
  useEffect(() => {
    api.get<Product[]>(`/public/products?collection=${slug}&per_page=6`).then(setItems).catch(() => {})
  }, [slug])
  const head = HEADS[slug]
  if (!head) return null
  return (
    <section className="nt-sec" style={{ paddingTop: 0 }}>
      <div className="nt-container">
        <div className="nt-sec-head between" data-reveal>
          <div>
            <div className="nt-eyebrow">{head.eyebrow}</div>
            <h2 className="nt-sec-title">{head.title}<em>{head.emphasis}</em></h2>
          </div>
          <Link to={`/?collection=${slug}`} className="nt-link">
            Xem tất cả
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>
        <div className="nt-hscroll" data-reveal>
          {items.map(p => <TeaserCard key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  )
}

export default function CollectionsPage() {
  const { collections } = useSite()
  useDocumentMeta({
    title: 'Bộ sưu tập — MỘC AN',
    description: '4 bộ sưu tập nội thất MỘC AN: Bắc Âu tối giản, Nhật Bản Zen, Công nghiệp mộc mạc, Hoài cổ Vintage — chọn phong cách phù hợp không gian sống của bạn.',
  })

  const orderedSlugs = ['scandinavian', 'nhat-ban-zen', 'industrial', 'vintage']
  const ordered = orderedSlugs
    .map(slug => collections.find(c => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))

  return (
    <div>
      <section className="nt-legal" style={{ maxWidth: 820, paddingTop: 'calc(var(--topbar-h) + var(--nav-h) + 48px)', paddingBottom: 8 }}>
        <div className="nt-eyebrow">Khám phá phong cách</div>
        <h1 style={{ fontWeight: 300 }}>Bộ sưu tập</h1>
        <p style={{ color: 'var(--text-2)', fontSize: 15, maxWidth: 600 }}>Mỗi bộ sưu tập là một câu chuyện phong cách riêng — chọn tông màu, chất liệu phù hợp với gu sống của bạn, hoặc phối trộn để tạo dấu ấn cá nhân.</p>
      </section>

      <section className="nt-sec-tight">
        <div className="nt-container" data-reveal>
          <div className="nt-bento">
            {ordered.map(c => (
              <Link key={c.slug} to={`/?collection=${c.slug}`} className={'nt-bento-item' + (BENTO_SIZE[c.slug] ? ' ' + BENTO_SIZE[c.slug] : '')}>
                <img src={c.image} alt={`Bộ sưu tập ${c.name}`} />
                <div className="nt-bento-overlay">
                  <span>{c.product_count} sản phẩm nổi bật</span>
                  <h3>{c.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {orderedSlugs.map(slug => <CollectionTeaser key={slug} slug={slug} />)}
    </div>
  )
}
