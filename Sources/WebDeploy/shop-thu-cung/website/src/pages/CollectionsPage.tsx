import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import type { Product } from '../contexts/SiteContext'

const CAT_ICONS: Record<string, string> = { 'thuc-an': '🍖', 'phu-kien': '🦴', 'do-choi': '🎾', 'chuong-nha': '🏠', 'cham-soc': '🧴' }
const BRANDS = ['PawFresh', 'PetKing', 'MeowMart', "Buddy's Choice", 'VetCare Pro', 'FurNest', 'PurePaw', 'Happy Tail']

export default function CollectionsPage() {
  const { categories } = useSite()
  const [products, setProducts] = useState<Product[]>([])

  useDocumentMeta({
    title: 'Bộ sưu tập — Pet Haus',
    description: 'Bộ sưu tập Pet Haus — khám phá theo góc của Boss cún, hội con sen mèo, chuồng & nhà ở, và các thương hiệu uy tín.',
  })

  useEffect(() => {
    api.getPaged<Product[]>('/public/products?per_page=200').then(({ data }) => setProducts(data)).catch(() => {})
  }, [])

  const brandCount = (b: string) => products.filter(p => p.brand === b).length

  return (
    <>
      <section className="tc-page-header">
        <div className="tc-container tc-page-header-inner">
          <div className="tc-eyebrow">Khám phá theo chủ đề</div>
          <h1>Bộ sưu tập</h1>
          <p>Chọn nhanh theo nhu cầu — dành cho boss cún, hội con sen mèo, hay góc chăm sóc nhà cửa cho thú cưng.</p>
        </div>
      </section>

      <section className="tc-sec">
        <div className="tc-container">
          <div className="tc-bento" data-reveal>
            <Link to="/?petType=cho" className="tc-bento-card tc-bento-1">
              <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=900&auto=format&fit=crop&q=80" alt="Chú chó năng động ngoài trời" loading="lazy" />
              <div className="tc-bento-card-content"><h3>Góc của Boss</h3><span>Thức ăn, phụ kiện & đồ chơi cho chó</span></div>
            </Link>
            <Link to="/?petType=meo" className="tc-bento-card tc-bento-2">
              <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=700&auto=format&fit=crop&q=80" alt="Chú mèo dễ thương" loading="lazy" />
              <div className="tc-bento-card-content"><h3>Hội con sen mèo</h3><span>Mọi thứ boss mèo cần</span></div>
            </Link>
            <Link to="/khuyen-mai" className="tc-bento-card tc-bento-3">
              <img src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&auto=format&fit=crop&q=80" alt="Sản phẩm thú cưng đang giảm giá" loading="lazy" />
              <div className="tc-bento-card-content"><h3>Đang giảm giá</h3><span>Ưu đãi mỗi ngày</span></div>
            </Link>
            <Link to="/?category=chuong-nha" className="tc-bento-card tc-bento-4">
              <img src="https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=500&auto=format&fit=crop&q=80" alt="Chuồng và nhà ở cho thú cưng" loading="lazy" />
              <div className="tc-bento-card-content"><h3>Chuồng & Nhà ở</h3><span>Góc nghỉ ngơi ấm áp</span></div>
            </Link>
          </div>
        </div>
      </section>

      <section className="tc-sec tc-sec-alt">
        <div className="tc-container">
          <div className="tc-sec-header" data-reveal>
            <div className="tc-eyebrow" style={{ color: 'var(--accent-h)' }}>Danh mục sản phẩm</div>
            <h2 className="tc-sec-title">Mua sắm theo <em>nhu cầu</em></h2>
          </div>
          <div className="row g-3" data-reveal>
            {categories.map(c => (
              <div className="col-6 col-lg-4" key={c.slug}>
                <Link to={`/?category=${c.slug}`} className="tc-brand-card" style={{ display: 'block', textAlign: 'left', padding: 24 }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{CAT_ICONS[c.slug] ?? '🐾'}</div>
                  <strong style={{ fontSize: 16 }}>{c.name}</strong>
                  <span>{c.product_count} sản phẩm</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tc-sec">
        <div className="tc-container">
          <div className="tc-sec-header" data-reveal>
            <div className="tc-eyebrow">Thương hiệu phân phối</div>
            <h2 className="tc-sec-title">Đối tác <em>thương hiệu</em></h2>
          </div>
          <div className="tc-hscroll" data-reveal>
            {BRANDS.map(b => (
              <Link key={b} to={`/?brand=${encodeURIComponent(b)}`} className="tc-brand-card">
                <strong>{b}</strong><span>{brandCount(b)} sản phẩm</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
