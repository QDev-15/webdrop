import { useSite } from '../contexts/SiteContext'

export default function Gallery() {
  const { gallery } = useSite()

  const items = gallery.length > 0 ? gallery : [
    { id: 1, title: 'Buddha Bowl Rực Rỡ', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80&auto=format&fit=crop', category: 'Món chính' },
    { id: 2, title: 'Salad Mùa Hè Organic', image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80&auto=format&fit=crop', category: 'Salad' },
    { id: 3, title: 'Canh Nấm Hầm Thảo Dược', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80&auto=format&fit=crop', category: 'Món chính' },
    { id: 4, title: 'Bánh Mousse Xoài & Dừa', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80&auto=format&fit=crop', category: 'Tráng miệng' },
    { id: 5, title: 'Nông trại organic Đà Lạt', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80&auto=format&fit=crop', category: 'Không gian' },
    { id: 6, title: 'Không gian nhà hàng', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80&auto=format&fit=crop', category: 'Không gian' },
  ]

  return (
    <section className="sec-pad" style={{ background: 'var(--warm)' }}>
      <div className="wd-container">
        <div className="text-center reveal mb-5">
          <div className="eyebrow">Thư viện ảnh</div>
          <h2 className="sec-title">Khoảnh khắc <em>tươi xanh</em></h2>
          <p className="sec-sub">Từng góc của nhà hàng, từng đĩa thức ăn — đều được chăm chút với tâm huyết và tình yêu thiên nhiên.</p>
        </div>
        <div className="row g-3">
          {items.slice(0, 6).map((item, i) => (
            <div key={item.id} className={`col-6 col-md-4 reveal${i > 0 ? ` reveal-d${Math.min(i, 3)}` : ''}`}>
              <div style={{ borderRadius: '12px', overflow: 'hidden', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={item.image}
                    alt={item.title || ''}
                    style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block', transition: 'transform .5s ease' }}
                    loading="lazy"
                    onMouseEnter={e => ((e.target as HTMLElement).style.transform = 'scale(1.05)')}
                    onMouseLeave={e => ((e.target as HTMLElement).style.transform = 'scale(1)')}
                  />
                </div>
                {item.title && (
                  <div style={{ padding: '10px 14px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>{item.title}</div>
                    {item.category && <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>{item.category}</div>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
