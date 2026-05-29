'use client'
import { useState } from 'react'
import Link from 'next/link'
import { templates, categories } from '../../data/templates'

export default function TemplateGrid() {
  const [active, setActive] = useState('Tất cả')

  const filtered = active === 'Tất cả' ? templates : templates.filter(t => t.category === active)

  return (
    <section id="templates" className="sec-pad" style={{ background: 'var(--bg)' }}>
      <div className="wd-container">
        <div className="text-center reveal mb-4">
          <div className="eyebrow">Mẫu thiết kế</div>
          <h2 className="sec-title">Chọn mẫu <em>phù hợp</em> với bạn</h2>
          <p className="sec-sub">Mỗi mẫu được thiết kế bởi chuyên gia, responsive hoàn toàn, tối ưu tốc độ và SEO.</p>
        </div>
        <div className="d-flex gap-2 justify-content-center flex-wrap mb-4 reveal">
          {categories.map(cat => (
            <div key={cat} className={`pill${active === cat ? ' active' : ''}`} onClick={() => setActive(cat)}>
              {cat}
            </div>
          ))}
        </div>
        <div className="row g-3">
          {filtered.map((t, i) => (
            <div key={t.slug} className="col-md-4">
              <Link href={`/templates/${t.slug}`} style={{ textDecoration: 'none' }}>
                <div className={`tc reveal reveal-d${(i % 3) + 1}`}>
                  <div className="tc-thumb">
                    <img src={t.image} alt={t.name} loading="lazy" />
                    <div className="tc-hover-layer">
                      <div className="tc-demo-btn">Xem demo →</div>
                    </div>
                  </div>
                  <div className="tc-body">
                    <div className="tc-name">
                      {t.name}
                      {t.badge && <span className="tc-badge">{t.badge}</span>}
                    </div>
                    <div className="tc-meta">
                      <span className="tc-cat">{t.category}</span>
                      <span className="tc-price">{t.price}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-5 reveal">
          <button className="btn-more">Xem tất cả 30+ mẫu →</button>
        </div>
      </div>
    </section>
  )
}
