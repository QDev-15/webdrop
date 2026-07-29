import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { Link } from 'react-router-dom'

export default function CollectionsPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: 'Bộ sưu tập — ' + settings.site_name,
    description: 'Các bộ sưu tập sản phẩm nổi bật',
  })

  const collections = [
    { name: 'Nhà bếp hiện đại', slug: 'nha-bep', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&auto=format&fit=crop&q=80' },
    { name: 'Trang trí nhà cửa', slug: 'trang-tri', image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&auto=format&fit=crop&q=80' },
    { name: 'Phòng tắm sang trọng', slug: 'phong-tam', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&auto=format&fit=crop&q=80' },
    { name: 'Nội thất nhỏ tinh tế', slug: 'noi-that-nho', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=80' },
    { name: 'Chiếu sáng thương hiệu', slug: 'den-anh-sang', image: 'https://images.unsplash.com/photo-1565636192335-14e06ba8e600?w=500&auto=format&fit=crop&q=80' },
  ]

  return (
    <>
      <div className="dg-page-hero">
        <div className="dg-container">
          <h1 className="dg-page-hero__title">Bộ sưu tập</h1>
          <p className="dg-page-hero__sub">Khám phá các bộ sưu tập sản phẩm theo chủ đề</p>
        </div>
      </div>

      <main className="dg-container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {collections.map((c) => (
            <Link key={c.slug} to={`/san-pham?category=${c.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', transition: 'transform .3s' }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)'} onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}>
                <div style={{ position: 'relative', overflow: 'hidden', paddingBottom: '66%' }}>
                  <img src={c.image} alt={c.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '24px', backgroundColor: 'var(--warm)' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{c.name}</h3>
                  <span style={{ fontSize: '14px', color: 'var(--accent)', fontWeight: '600' }}>Xem bộ sưu tập →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}
