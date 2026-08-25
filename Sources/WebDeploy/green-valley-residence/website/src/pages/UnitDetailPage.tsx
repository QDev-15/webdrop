import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useUnitTypes } from '../hooks/useUnitTypes'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { api } from '../api/client'
import UnitCard from '../components/UnitCard'
import ExtAmenitiesList from '../components/ExtAmenitiesList'
import MortgageCalculator from '../components/MortgageCalculator'
import AgentCard from '../components/AgentCard'
import ContactForm from '../components/ContactForm'
import PaymentTimeline from '../components/PaymentTimeline'
import { DIRECTION_LABELS, STATUS_LABELS, TYPE_LABELS, formatVND, formatFullVND, getRelatedUnits } from '../utils/format'

interface PaymentPhase { id: number; phase: string; percent: number; milestone: string }

export default function UnitDetailPage() {
  const { units, loading } = useUnitTypes()
  const { settings } = useSite()
  const [params] = useSearchParams()
  const requestedSlug = params.get('loai')
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [phases, setPhases] = useState<PaymentPhase[]>([])

  useEffect(() => {
    api.get<PaymentPhase[]>('/public/payment-phases').then(setPhases).catch(() => {})
  }, [])

  useEffect(() => { setGalleryIndex(0) }, [requestedSlug])

  const unit = units.find(u => u.slug === requestedSlug) || units.find(u => u.slug === 'sky-terrace-3pn') || units[0]

  useDocumentMeta({
    title: unit ? `${unit.name} | Green Valley Residence` : 'Chi tiết loại căn | Green Valley Residence',
    description: 'Thông tin chi tiết loại căn hộ tại Green Valley Residence — mặt bằng, thông số kỹ thuật, tiến độ thanh toán, công cụ tính vay và liên hệ Phòng Kinh doanh dự án.',
  })

  if (loading) return <div style={{ padding: '160px 0 80px', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div>
  if (!unit) return null

  const st = STATUS_LABELS[unit.status] ?? { label: unit.status, cls: '' }
  const allImages = [{ src: unit.floor_plan_image, label: 'Mặt bằng minh họa' }, ...unit.gallery.map((g, i) => ({ src: g, label: `Ảnh căn hộ mẫu ${i + 1}` }))].filter(im => im.src)
  const current = allImages[galleryIndex] ?? allImages[0]
  const mapSrc = `https://maps.google.com/maps?q=${settings.contact_map_lat || '10.8046'},${settings.contact_map_lng || '106.7350'}&hl=vi&z=15&output=embed`

  const specs: [string, string][] = [
    ['Loại căn', TYPE_LABELS[unit.type_tag] ?? unit.type_tag],
    ['Diện tích thông thủy', `${unit.area} m²`],
    ['Số phòng ngủ', String(unit.bedrooms)],
    ['Số phòng vệ sinh', String(unit.bathrooms)],
    ['Hướng ban công', DIRECTION_LABELS[unit.direction] ?? unit.direction],
    ['Tầng áp dụng', unit.floor_range],
    ['Khối tháp', unit.block],
    ['View', unit.view_desc],
    ['Tình trạng', st.label],
    ['Giá bán từ', formatFullVND(unit.price_from)],
  ]

  const related = getRelatedUnits(units, unit, 3)

  return (
    <>
      <section style={{ paddingTop: 118 }}>
        <div className="wd-container">
          <div className="gvr-crumb" style={{ color: 'var(--text-3)' }}>
            <Link to="/" style={{ color: 'var(--text-2)' }}>Trang chủ</Link> / <Link to="/bang-gia" style={{ color: 'var(--text-2)' }}>Bảng giá &amp; Mặt bằng</Link> / <span>{unit.name}</span>
          </div>
          <div className="d-flex align-items-center gap-3 flex-wrap mb-2">
            <span className="gvr-tag"><span className="gvr-tag-dot"></span> {TYPE_LABELS[unit.type_tag] ?? unit.type_tag}</span>
            <span className="gvr-tag">{unit.block}</span>
          </div>
          <h1 className="sec-title" style={{ marginBottom: 8 }}>{unit.name}</h1>
          <p className="sec-sub" style={{ maxWidth: 640 }}>{unit.view_desc}{unit.view_desc ? ' — ' : ''}{unit.description.split('.')[0]}.</p>
        </div>
      </section>

      {/* GALLERY */}
      {current && (
        <section className="sec-pad-sm">
          <div className="wd-container">
            <div className="gvr-gallery-main">
              <span className={`gvr-gallery-badge ${st.cls}`}>{st.label}</span>
              <img src={current.src} alt={`${unit.name} — ${current.label}`} />
            </div>
            <div className="gvr-gallery-thumbs">
              {allImages.map((im, i) => (
                <img key={i} src={im.src} alt={im.label} className={i === galleryIndex ? 'active' : ''} onClick={() => setGalleryIndex(i)} />
              ))}
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 10 }}>{current.label}</p>
          </div>
        </section>
      )}

      {/* QUICK FACTS */}
      <section className="sec-pad-sm" style={{ paddingTop: 0 }}>
        <div className="wd-container">
          <div className="gvr-qf-bar" data-reveal>
            <div className="gvr-qf-item"><div className="gvr-qf-icon">📐</div><div className="gvr-qf-value">{unit.area}m²</div><div className="gvr-qf-label">Diện tích</div></div>
            <div className="gvr-qf-item"><div className="gvr-qf-icon">🛏</div><div className="gvr-qf-value">{unit.bedrooms} PN</div><div className="gvr-qf-label">Phòng ngủ</div></div>
            <div className="gvr-qf-item"><div className="gvr-qf-icon">🚿</div><div className="gvr-qf-value">{unit.bathrooms} WC</div><div className="gvr-qf-label">Phòng tắm</div></div>
            <div className="gvr-qf-item"><div className="gvr-qf-icon">🧭</div><div className="gvr-qf-value">{DIRECTION_LABELS[unit.direction] ?? unit.direction}</div><div className="gvr-qf-label">Hướng</div></div>
            <div className="gvr-qf-item"><div className="gvr-qf-icon">🏢</div><div className="gvr-qf-value">Tầng {unit.floor_range}</div><div className="gvr-qf-label">Tầng áp dụng</div></div>
            <div className="gvr-qf-item"><div className="gvr-qf-icon">💰</div><div className="gvr-qf-value">{formatVND(unit.price_from)}</div><div className="gvr-qf-label">Giá từ</div></div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="sec-pad" style={{ paddingTop: 20 }}>
        <div className="wd-container">
          <div className="row g-4">
            <div className="col-lg-7">
              <div className="mb-5">
                <div className="eyebrow">Mô tả chi tiết</div>
                <p style={{ fontSize: 15, lineHeight: 1.85, color: 'var(--text-2)' }}>{unit.description}</p>
              </div>

              {unit.features.length > 0 && (
                <div className="mb-5">
                  <div className="eyebrow">Đặc điểm nổi bật</div>
                  <div className="row g-3">
                    {unit.features.map((f, i) => (
                      <div className="col-md-6" key={i}>
                        <div className="gvr-feat"><div className="gvr-feat-icon">✓</div><div className="gvr-feat-desc" style={{ fontWeight: 500, color: 'var(--text)' }}>{f}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-5">
                <div className="eyebrow">Bảng thông số kỹ thuật</div>
                <div className="gvr-card gvr-card-solid p-4">
                  <table className="gvr-spec-table">
                    <tbody>
                      {specs.map(([k, v]) => <tr key={k}><td>{k}</td><td>{v}</td></tr>)}
                    </tbody>
                  </table>
                </div>
              </div>

              {phases.length > 0 && (
                <div className="mb-5">
                  <div className="eyebrow">Tiến độ thanh toán</div>
                  <h2 className="sec-title" style={{ fontSize: 24, marginBottom: 24 }}>{phases.length} đợt thanh toán theo <em>tiến độ xây dựng</em></h2>
                  <PaymentTimeline items={phases} />
                </div>
              )}

              <div className="mb-5">
                <div className="eyebrow">Vị trí dự án</div>
                <div className="gvr-footer-maps" style={{ margin: '0 0 16px' }}>
                  <iframe src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`Vị trí ${settings.site_name || 'Green Valley Residence'}`}></iframe>
                </div>
                <ExtAmenitiesList />
              </div>
            </div>

            <div className="col-lg-5">
              <div style={{ position: 'sticky', top: 100 }}>
                <MortgageCalculator initialPrice={unit.price_from} />
                <AgentCard />
                <ContactForm variant="compact" defaultUnitSlug={unit.slug} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOẠI CĂN TƯƠNG TỰ */}
      {related.length > 0 && (
        <section className="sec-pad sec-tint" style={{ paddingTop: 60 }}>
          <div className="wd-container">
            <div className="eyebrow">Có thể bạn quan tâm</div>
            <h2 className="sec-title" style={{ marginBottom: 32 }}>Loại căn <em>tương tự</em></h2>
            <div className="row g-4">
              {related.map(u => (
                <div className="col-lg-4 col-md-6" key={u.id}>
                  <UnitCard unit={u} variant="related" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
