import { useEffect, useRef, useState } from 'react'
import { api } from '../api/client'

interface GalleryItem {
  id: number
  title: string
  image: string
  category: string
}

const CATEGORIES = ['Tất cả', 'Không gian', 'Món ăn', 'Phòng VIP']

const STATIC_ITEMS: GalleryItem[] = [
  { id: 1, title: 'Sảnh chính nhìn từ trên', image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&q=80&auto=format&fit=crop', category: 'Không gian' },
  { id: 2, title: 'Dãy bàn nướng than hoa', image: 'https://images.unsplash.com/photo-1544025162-d76538977abd?w=600&q=80&auto=format&fit=crop', category: 'Không gian' },
  { id: 3, title: 'Phòng VIP — Ánh Bạch Kim', image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80&auto=format&fit=crop', category: 'Phòng VIP' },
  { id: 4, title: 'Bò Wagyu trên bếp than', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80&auto=format&fit=crop', category: 'Món ăn' },
  { id: 5, title: 'Combo hải sản đặc biệt', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop', category: 'Món ăn' },
  { id: 6, title: 'Góc bar nước & tráng miệng', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80&auto=format&fit=crop', category: 'Không gian' },
  { id: 7, title: 'Ánh lửa và khói than hoa', image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80&auto=format&fit=crop', category: 'Không gian' },
]

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [active, setActive] = useState('Tất cả')
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    api.get<GalleryItem[]>('/public/gallery')
      .then(data => setItems(data))
      .catch(() => {})
  }, [])

  const display = (items.length > 0 ? items : STATIC_ITEMS).filter(i =>
    active === 'Tất cả' || i.category === active
  )

  useEffect(() => {
    const t = setTimeout(() => {
      const els = ref.current?.querySelectorAll<HTMLElement>('[data-reveal]:not(.visible)')
      if (!els?.length) return
      const ro = new IntersectionObserver(entries =>
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      , { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(t)
  }, [display.length])

  // Close lightbox on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div ref={ref}>
      <div className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Không gian</div>
          <h1 className="ph-title">Không Gian <em>Ấm Cúng & Sôi Động</em></h1>
          <p className="ph-sub">Sức chứa 200+ chỗ ngồi, 4 phòng VIP, hệ thống hút khói hiện đại — không lo ám mùi lên người.</p>
        </div>
      </div>

      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          {/* VIP info */}
          <div className="row g-4 mb-5" data-reveal>
            <div className="col-md-6">
              <div className="booking-card h-100">
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Phòng VIP — Đặt tiệc riêng tư</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 16 }}>4 phòng VIP cách âm, máy lạnh riêng biệt. Phù hợp sinh nhật, tiệc công ty, gặp mặt gia đình. Màn hình TV 55" kèm microphone cho buổi tiệc thêm ấn tượng.</p>
                <div className="row g-2">
                  {[
                    ['Phòng Hổ Phách', '6–8 người'],
                    ['Phòng Hồng Ngọc', '8–10 người'],
                    ['Phòng Bạch Kim', '10–12 người'],
                    ['Phòng Kim Cương', '15–20 người'],
                  ].map(([name, size]) => (
                    <div key={name} className="col-6">
                      <div style={{ background: 'var(--warm)', borderRadius: 10, padding: '10px 14px', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{name}</div>
                        <div style={{ fontSize: 12, color: 'var(--accent)' }}>{size}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="booking-card h-100">
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Tiện ích tại nhà hàng</h3>
                {[
                  ['🌬️', 'Hệ thống hút khói tiên tiến', 'Không ám mùi quần áo sau khi nướng — cam kết'],
                  ['🅿️', 'Bãi đỗ xe rộng rãi', 'Miễn phí 100 chỗ xe máy, 30 chỗ ôtô'],
                  ['👶', 'Khu vui chơi trẻ em', 'Góc vui chơi riêng cho bé dưới 10 tuổi'],
                  ['♿', 'Lối đi cho người khuyết tật', 'Thang máy và lối đi riêng toàn bộ tầng 1'],
                ].map(([icon, title, desc]) => (
                  <div key={title} className="contact-item">
                    <div className="ci-icon" style={{ fontSize: 22 }}>{icon}</div>
                    <div>
                      <div className="ci-label">{title}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--text-3)' }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gallery filter */}
          <div className="text-center" data-reveal style={{ marginBottom: 28 }}>
            <div className="eyebrow">Gallery</div>
            <h2 className="sec-title">Ảnh thực tế từ quán</h2>
          </div>
          <div className="d-flex gap-2 justify-content-center flex-wrap mb-4" data-reveal>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                style={{
                  padding: '8px 20px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: active === cat ? 600 : 400,
                  background: active === cat ? 'var(--accent)' : 'var(--surface)',
                  color: active === cat ? '#fff' : 'var(--text-2)',
                  transition: 'all .2s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="gallery-grid" data-reveal>
            {display.map(item => (
              <div key={item.id} className="gg-item" onClick={() => setLightbox(item)} style={{ cursor: 'pointer' }}>
                <img className="gg-img" src={item.image} alt={item.title} loading="lazy" />
                <div className="gg-overlay"><span className="gg-title">{item.title}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.92)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', fontSize: 24, width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            &times;
          </button>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 900, width: '100%' }}>
            <img src={lightbox.image} alt={lightbox.title} style={{ width: '100%', borderRadius: 12, display: 'block' }} />
            <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 14, marginTop: 12, textAlign: 'center' }}>{lightbox.title}</div>
          </div>
        </div>
      )}
    </div>
  )
}
