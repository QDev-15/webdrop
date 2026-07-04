import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Category {
  id: number
  name: string
  slug: string
  description: string
  service_count: number
}

interface Service {
  id: number
  name: string
  category_id: number
  category_name: string
  description: string
  price_from: number
  price_unit: string
  duration: string
  image: string
}

const COMPARE_ROWS = [
  { label: 'Giá từ', mac_cai: '25tr', su: '35tr', tu_buoc: '40tr', mat_trong: '90tr', invisalign: '80tr', noi_dia: '45tr' },
  { label: 'Thời gian', mac_cai: '12–24 tháng', su: '12–24 tháng', tu_buoc: '10–20 tháng', mat_trong: '14–26 tháng', invisalign: '9–18 tháng', noi_dia: '8–16 tháng' },
  { label: 'Thẩm mỹ', mac_cai: '—', su: '✓✓', tu_buoc: '—', mat_trong: '✓✓✓', invisalign: '✓✓✓', noi_dia: '✓✓' },
  { label: 'Tháo lắp', mac_cai: '—', su: '—', tu_buoc: '—', mat_trong: '—', invisalign: '✓', noi_dia: '✓' },
  { label: 'Phù hợp ca phức tạp', mac_cai: '✓✓✓', su: '✓✓✓', tu_buoc: '✓✓✓', mat_trong: '✓✓✓', invisalign: '✓✓', noi_dia: '✓' },
]

export default function DichVuPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [services, setServices]     = useState<Service[]>([])
  const [activeTab, setActiveTab]   = useState(0)

  useEffect(() => {
    Promise.all([
      api.get<Category[]>('/public/service-categories'),
      api.get<Service[]>('/public/services'),
    ]).then(([cats, svcs]) => {
      setCategories(cats)
      setServices(svcs)
    }).catch(() => {})
  }, [])

  const filtered = activeTab === 0 ? services : services.filter(s => s.category_id === categories[activeTab - 1]?.id)

  return (
    <>
      {/* Page hero */}
      <div className="cn-page-hero">
        <div className="wd-container">
          <div className="cn-ph-badge">Dịch vụ chỉnh nha</div>
          <h1 className="cn-ph-title">Giải pháp niềng răng <em>toàn diện</em></h1>
          <p className="cn-ph-sub">Từ mắc cài truyền thống đến Invisalign cao cấp — tư vấn giải pháp phù hợp với cấu trúc răng và ngân sách.</p>
        </div>
      </div>

      {/* Services */}
      <section className="sec-pad">
        <div className="wd-container">
          {/* Filter tabs */}
          {categories.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}>
              <button
                onClick={() => setActiveTab(0)}
                className={activeTab === 0 ? 'cn-btn cn-btn-primary cn-btn-sm' : 'cn-btn cn-btn-ghost cn-btn-sm'}
              >
                Tất cả ({services.length})
              </button>
              {categories.map((cat, i) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(i + 1)}
                  className={activeTab === i + 1 ? 'cn-btn cn-btn-primary cn-btn-sm' : 'cn-btn cn-btn-ghost cn-btn-sm'}
                >
                  {cat.name} ({cat.service_count})
                </button>
              ))}
            </div>
          )}

          <div className="cn-dv-bento">
            {filtered.map((s, i) => (
              <div className="cn-dv-card" key={s.id} data-reveal data-delay={String(i % 3)}>
                {s.image && (
                  <div style={{ height: 160, borderRadius: 10, overflow: 'hidden', marginBottom: 18 }}>
                    <img src={s.image} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  </div>
                )}
                <div className="cn-dv-card-tag">{s.category_name}</div>
                <div className="cn-dv-card-name">{s.name}</div>
                <div className="cn-dv-card-desc">{s.description}</div>
                {s.price_from > 0 ? (
                  <>
                    <div className="cn-dv-card-price">{Number(s.price_from).toLocaleString('vi-VN')}đ</div>
                    <div className="cn-dv-card-duration">/ {s.price_unit} · {s.duration}</div>
                  </>
                ) : (
                  <div className="cn-dv-card-price">Miễn phí</div>
                )}
                <Link to="/dat-lich" className="cn-dv-card-link">
                  Đặt lịch tư vấn →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section style={{ background: 'var(--surface)', padding: 'clamp(48px,6vw,80px) 0' }}>
        <div className="wd-container">
          <div style={{ textAlign: 'center', marginBottom: 40 }} data-reveal>
            <div className="cn-eyebrow">So sánh</div>
            <h2 className="cn-title">Bảng so sánh <em>các phương pháp</em></h2>
          </div>
          <div className="cn-cmp-table-wrap" data-reveal>
            <table className="cn-cmp-table">
              <thead>
                <tr>
                  <th>Tiêu chí</th>
                  <th>Mắc cài KL</th>
                  <th>Mắc cài sứ</th>
                  <th>Tự buộc</th>
                  <th>Mặt trong</th>
                  <th>Invisalign</th>
                  <th>Khay nội địa</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map(row => (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    <td className={row.mac_cai.startsWith('✓') ? 'cn-cmp-yes' : row.mac_cai === '—' ? 'cn-cmp-no' : 'cn-cmp-price'}>{row.mac_cai}</td>
                    <td className={row.su.startsWith('✓') ? 'cn-cmp-yes' : row.su === '—' ? 'cn-cmp-no' : 'cn-cmp-price'}>{row.su}</td>
                    <td className={row.tu_buoc.startsWith('✓') ? 'cn-cmp-yes' : row.tu_buoc === '—' ? 'cn-cmp-no' : 'cn-cmp-price'}>{row.tu_buoc}</td>
                    <td className={row.mat_trong.startsWith('✓') ? 'cn-cmp-yes' : row.mat_trong === '—' ? 'cn-cmp-no' : 'cn-cmp-price'}>{row.mat_trong}</td>
                    <td className={row.invisalign.startsWith('✓') ? 'cn-cmp-yes' : row.invisalign === '—' ? 'cn-cmp-no' : 'cn-cmp-price'}>{row.invisalign}</td>
                    <td className={row.noi_dia.startsWith('✓') ? 'cn-cmp-yes' : row.noi_dia === '—' ? 'cn-cmp-no' : 'cn-cmp-price'}>{row.noi_dia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }} data-reveal>
            <Link to="/dat-lich" className="cn-btn cn-btn-primary">Tư vấn miễn phí — Chọn phương pháp phù hợp</Link>
          </div>
        </div>
      </section>
    </>
  )
}
