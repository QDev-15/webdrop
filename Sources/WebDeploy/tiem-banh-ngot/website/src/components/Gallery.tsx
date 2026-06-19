import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface GalleryItem {
  id: number
  title: string
  image: string
  category: string
}

const FALLBACK = [
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
  'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&q=80',
  'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&q=80',
  'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&q=80',
]

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([])

  useEffect(() => {
    api.get<GalleryItem[]>('/public/gallery')
      .then(setItems)
      .catch(() => {})
  }, [])

  const display = items.length >= 5 ? items.slice(0, 5) : null

  const gClasses = ['gg-1', 'gg-2', 'gg-3', 'gg-4', 'gg-5']

  return (
    <section className="sec-pad">
      <div className="wd-container">
        <div className="text-center mb-5" data-reveal>
          <div className="eyebrow">Thư viện ảnh</div>
          <h2 className="sec-title">Gallery <em>tác phẩm</em></h2>
          <p className="sec-sub">Những chiếc bánh đẹp nhất từ tiệm La Douceur</p>
        </div>

        <div className="gallery-grid" data-reveal>
          {(display ? display.map(i => i.image || '') : FALLBACK).map((src, i) => {
            const item = display ? display[i] : null
            const alt = item ? (item.title || `Bánh ${i + 1}`) : `Gallery ${i + 1}`
            const imgSrc = src || FALLBACK[i % FALLBACK.length]
            return (
              <div key={i} className={`gg-item ${gClasses[i]}`}>
                <img
                  src={imgSrc}
                  alt={alt}
                  loading="lazy"
                  onError={e => { (e.target as HTMLImageElement).src = FALLBACK[i % FALLBACK.length] }}
                />
              </div>
            )
          })}
        </div>

        <FlavorsSection />
      </div>
    </section>
  )
}

interface Flavor {
  id: number
  name: string
  icon: string
  description: string
  tags: string
  bg_color: string
}

function FlavorsSection() {
  const [flavors, setFlavors] = useState<Flavor[]>([])

  useEffect(() => {
    api.get<Flavor[]>('/public/flavors')
      .then(setFlavors)
      .catch(() => {})
  }, [])

  const defaultFlavors: Flavor[] = [
    { id: 1, name: 'Dâu tây tươi', icon: '🍓', description: 'Vị chua ngọt tự nhiên, hương thơm đặc trưng', tags: 'Nhẹ nhàng,Thanh mát', bg_color: '#fce7f3' },
    { id: 2, name: 'Socola Bỉ', icon: '🍫', description: 'Socola đen nhập khẩu từ Bỉ, đắng nhẹ và rich', tags: 'Đậm đà,Sang trọng', bg_color: '#fef3c7' },
    { id: 3, name: 'Matcha Nhật Bản', icon: '🍵', description: 'Trà xanh cao cấp từ Uji Nhật Bản, vị đắng thanh', tags: 'Đặc biệt,Tươi mát', bg_color: '#f0fdf4' },
    { id: 4, name: 'Vanilla Madagascar', icon: '🌿', description: 'Vanilla thuần khiết Madagascar, thơm dịu đặc biệt', tags: 'Classic,Mềm mại', bg_color: '#fff7ed' },
    { id: 5, name: 'Caramel Muối', icon: '🧂', description: 'Kết hợp ngọt của caramel và vị mặn tinh tế của muối hồng', tags: 'Độc đáo,Trendy', bg_color: '#fdf4ff' },
    { id: 6, name: 'Chanh Yuzu', icon: '🍋', description: 'Vị chanh Nhật thanh mát, thơm đặc trưng rất độc đáo', tags: 'Thanh mát,Sảng khoái', bg_color: '#eff6ff' },
  ]

  const displayFlavors = flavors.length > 0 ? flavors : defaultFlavors

  return (
    <div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="text-center mb-4" data-reveal>
        <div className="eyebrow">Hương vị</div>
        <h2 className="sec-title">Lựa chọn <em>hương vị</em></h2>
        <p className="sec-sub">Từ dâu tây tươi đến socola Bỉ thượng hạng — chúng tôi dùng nguyên liệu nhập khẩu tốt nhất</p>
      </div>
      <div className="row g-4">
        {displayFlavors.map((f, i) => {
          const tags = typeof f.tags === 'string' ? f.tags.split(',').map(t => t.trim()).filter(Boolean) : []
          return (
            <div key={f.id} className={`col-sm-6 col-lg-4 reveal reveal-d${(i % 3) + 1}`} data-reveal>
              <div className="flavor-card" style={{ background: f.bg_color || 'var(--warm)' }}>
                <div className="fc-icon">{f.icon}</div>
                <div className="fc-name">{f.name}</div>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.65, margin: 0 }}>{f.description}</p>
                {tags.length > 0 && (
                  <div className="fc-tags">
                    {tags.map(t => <span key={t} className="fc-tag">{t}</span>)}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
