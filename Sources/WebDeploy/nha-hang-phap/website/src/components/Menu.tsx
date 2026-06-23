import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface Category {
  id: number
  name: string
  name_fr: string
  description: string
}

interface MenuItem {
  id: number
  category_id: number
  name: string
  name_fr: string
  description: string
  price: number | null
  badge: string
  featured: number
}

interface Props {
  preview?: boolean
}

function formatPrice(price: number | null): string {
  if (price == null) return ''
  return price.toLocaleString('vi-VN') + 'đ'
}

export default function Menu({ preview = false }: Props) {
  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Category[]>('/public/menu-categories'),
      api.get<MenuItem[]>('/public/menu-items'),
    ]).then(([cats, its]) => {
      setCategories(cats)
      setItems(its)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      const els = document.querySelectorAll('.reveal:not(.visible)')
      const ro = new IntersectionObserver(entries =>
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      , { threshold: 0.08, rootMargin: '0px 0px -36px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(t)
  }, [items])

  if (loading) return <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-3)', fontStyle: 'italic' }}>Đang tải thực đơn...</div>

  // Preview: show 3 categories as columns with first 3 items each
  if (preview) {
    const previewCats = categories.slice(0, 3)
    return (
      <section className="sec-pad" style={{ background: 'var(--dark2)' }}>
        <div className="wd-container">
          <div className="text-center sec-dark reveal mb-5">
            <div className="eyebrow">Notre Carte · Thực đơn</div>
            <h2 className="sec-title">Sélection du <em>Chef</em></h2>
            <p className="sec-sub">Ba hành trình vị giác — từ khai vị đến tráng miệng, mỗi món là sự chắt lọc của kỹ thuật nấu ăn Pháp cổ điển.</p>
          </div>
          <div className="row g-0">
            {previewCats.map((cat, ci) => {
              const catItems = items.filter(i => i.category_id === cat.id).slice(0, 3)
              return (
                <div className="col-md-4 reveal" key={cat.id} style={{ transitionDelay: `${ci * 0.08}s` }}>
                  <div style={{
                    padding: '32px 28px',
                    borderRight: ci < previewCats.length - 1 ? '1px solid rgba(255,255,255,.06)' : 'none',
                    height: '100%'
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 400, textTransform: 'uppercase', letterSpacing: 3, color: '#fb7185', marginBottom: 16 }}>
                      {cat.name_fr} · {cat.name.split(' · ')[0]}
                    </div>
                    {catItems.map((item, ii) => (
                      <div className="plat-item" key={item.id}
                        style={{ borderBottomColor: 'rgba(255,255,255,.06)', borderBottom: ii < catItems.length - 1 ? undefined : 'none' }}>
                        <div className="pi-info">
                          <div className="pi-fr" style={{ color: '#fff' }}>{item.name_fr || item.name}</div>
                          <div className="pi-vi" style={{ color: 'rgba(255,255,255,.3)' }}>{item.name}</div>
                        </div>
                        <div className="pi-price" style={{ color: '#fb7185' }}>{formatPrice(item.price)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="text-center mt-5 reveal">
            <a href="/menu" className="btn-white">Xem toàn bộ thực đơn →</a>
          </div>
        </div>
      </section>
    )
  }

  // Full menu page
  return (
    <section className="sec-pad" style={{ background: 'var(--bg)' }}>
      <div className="wd-container">
        <div className="row g-5">
          <div className="col-lg-8 reveal">
            {categories.map(cat => {
              const catItems = items.filter(i => i.category_id === cat.id)
              if (catItems.length === 0) return null
              return (
                <div className="menu-course" key={cat.id}>
                  <div className="mc-header">
                    <div>
                      <div className="mc-fr">{cat.name_fr}</div>
                      <div className="mc-vi">{cat.name.split(' · ')[0]}</div>
                    </div>
                    <div className="mc-line"></div>
                  </div>
                  {catItems.map((item, ii) => (
                    <div className="plat-item" key={item.id} style={ii === catItems.length - 1 ? { borderBottom: 'none' } : undefined}>
                      <div className="pi-num">{String(ii + 1).padStart(2, '0')}</div>
                      <div className="pi-info">
                        <div className="pi-fr">{item.name_fr || item.name}</div>
                        <div className="pi-vi">{item.name}</div>
                        {item.description && <div className="pi-desc">{item.description}</div>}
                      </div>
                      <div className="pi-price">{formatPrice(item.price)}</div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
          <div className="col-lg-4 reveal reveal-d1">
            <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: 'var(--accent-light)', border: '1px solid rgba(159,18,57,.15)', borderRadius: 2, padding: 24 }}>
                <div style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--accent)', marginBottom: 12 }}>Đặt bàn tối nay</div>
                <div style={{ fontSize: 22, fontWeight: 300, color: 'var(--text)', letterSpacing: '-.3px', marginBottom: 4 }}>Gọi ngay</div>
                <div style={{ fontSize: 12.5, fontWeight: 300, color: 'var(--text-3)', marginBottom: 16 }}>Thứ Ba – Chủ Nhật · 18:00 – 22:30</div>
                <a href="/reservation" className="btn-accent" style={{ display: 'block', textAlign: 'center' }}>Réserver →</a>
              </div>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 2, padding: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1.2, color: 'var(--text-3)', marginBottom: 12 }}>Ghi chú quan trọng</div>
                <div style={{ fontSize: 13, fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.75 }}>
                  <p>🌿 Thực đơn thay đổi theo mùa — một số món có thể không có.</p>
                  <p>⚠️ Nếu có dị ứng thực phẩm, vui lòng thông báo khi đặt bàn.</p>
                  <p>🍷 Sommelière sẵn sàng tư vấn rượu vang phù hợp từng món.</p>
                </div>
              </div>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 2, padding: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1.2, color: 'var(--text-3)', marginBottom: 16 }}>Menu Dégustation</div>
                <div style={{ fontSize: 13.5, fontWeight: 300, color: 'var(--text)', lineHeight: 1.6, marginBottom: 12 }}>
                  Thực đơn đặc biệt 7 món<br />
                  <span style={{ color: 'var(--accent)', fontWeight: 300 }}>1.850.000đ / người</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 300, color: 'var(--text-3)' }}>Cần đặt trước 48 giờ.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
