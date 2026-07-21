import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface Service {
  id: number
  number: string
  name: string
  description: string
  features: string
  price: string
  image: string
  is_featured: number
  sort_order: number
}

const TIMELINE_STEPS = [
  { num: '01', title: 'Thăm khám & Tư vấn', desc: 'Chụp CT 3D, phân tích xương hàm và tình trạng răng miệng tổng thể. Bác sĩ lập kế hoạch điều trị cá nhân hóa.' },
  { num: '02', title: 'Thiết kế 3D', desc: 'Thiết kế vị trí Implant, mão phục hình và máng phẫu thuật trên phần mềm CAD-CAM. Khách hàng xem trước kết quả.' },
  { num: '03', title: 'Phẫu thuật định vị', desc: 'Đặt trụ Implant với máng định vị in 3D. Quy trình chính xác, ít sang chấn, thời gian ngắn.' },
  { num: '04', title: 'Tích hợp Osseointegration', desc: 'Trụ Implant tích hợp với xương hàm trong 3–6 tháng. Theo dõi định kỳ để đảm bảo quá trình lành thương tối ưu.' },
  { num: '05', title: 'Gắn mão phục hình', desc: 'Gắn mão sứ zirconia CAD-CAM vĩnh viễn. Kiểm tra khớp cắn, điều chỉnh và bàn giao kết quả hoàn chỉnh.' },
]

export default function ServicesPage() {
  const { settings } = useSite()
  useDocumentMeta({ title: `Dịch vụ Implant — ${settings.site_name || 'Nha khoa'}`, description: `Các dịch vụ cấy ghép Implant tại ${settings.site_name || 'nha khoa'}.` })
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    api.get<Service[]>('/public/services').then(data => setServices(data)).catch(() => {})
  }, [])

  const fallback: Service[] = [
    { id: 1, number: '01', name: 'Implant một răng', description: 'Phục hồi răng mất hoàn toàn tự nhiên với trụ titan sinh học tương thích.', features: 'Titanium Grade 4|Osseotite® Surface|15 năm bảo hành', price: 'Từ 18.000.000đ', image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&q=80', is_featured: 1, sort_order: 1 },
    { id: 2, number: '02', name: 'All-on-4', description: 'Phục hồi toàn hàm chỉ với 4 trụ Implant — giải pháp tối ưu cho mất răng toàn hàm.', features: '4 Implant|Hàm răng cố định|Phẫu thuật 1 ngày', price: 'Từ 85.000.000đ', image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80', is_featured: 1, sort_order: 2 },
    { id: 3, number: '03', name: 'All-on-6', description: 'Phục hồi toàn hàm với 6 trụ Implant — độ ổn định tối đa, phân bổ lực tối ưu.', features: '6 Implant|Ổn định tối đa|30 năm bảo hành', price: 'Từ 115.000.000đ', image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&q=80', is_featured: 1, sort_order: 3 },
    { id: 4, number: '04', name: 'Ghép xương', description: 'Tái tạo xương hàm đủ thể tích trước khi cấy ghép Implant.', features: 'Bone Graft BioOss|Collagen Membrane|Tái tạo hoàn toàn', price: 'Từ 6.500.000đ/mảnh', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80', is_featured: 0, sort_order: 4 },
    { id: 5, number: '05', name: 'Implant tức thì', description: 'Đặt Implant ngay trong ngày nhổ răng — giảm thời gian điều trị, bảo tồn xương tối đa.', features: 'Same-day Implant|Bảo tồn xương|1 lần phẫu thuật', price: 'Từ 22.000.000đ', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80', is_featured: 0, sort_order: 5 },
    { id: 6, number: '06', name: 'Mão sứ Implant', description: 'Mão sứ zirconia toàn phần — không kim loại, màu sắc tự nhiên, độ bền vượt trội.', features: 'Zirconia cao cấp|Màu tự nhiên|20 năm bảo hành', price: 'Từ 5.000.000đ/răng', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80', is_featured: 0, sort_order: 6 },
  ]

  const displayed = services.length > 0 ? services : fallback

  return (
    <>
      {/* Page Header */}
      <section className="ft-page-header">
        <div className="wd-container">
          <div className="ft-ph-inner">
            <div className="ft-eyebrow ft-eyebrow-light">Dịch vụ Implant</div>
            <h1 className="ft-ph-title">Giải pháp phục hình <em>toàn diện</em></h1>
            <p className="ft-ph-sub">Từ một chiếc răng đến toàn hàm — chúng tôi có giải pháp Implant phù hợp cho mọi trường hợp lâm sàng.</p>
          </div>
        </div>
      </section>

      {/* Bento Grid Highlight */}
      <section className="ft-bento-section sec-pad">
        <div className="wd-container">
          <div className="ft-bento-grid" data-reveal>
            <div className="ft-bento-main">
              <div className="ft-bento-badge">Phổ biến nhất</div>
              <h3>All-on-4 & All-on-6</h3>
              <p>Phục hồi toàn hàm trong một ngày — chất lượng cao nhất, bảo hành dài nhất.</p>
              <Link to="/dat-lich" className="ft-btn ft-btn-neon mt-auto">Tư vấn ngay →</Link>
            </div>
            <div className="ft-bento-card">
              <div className="ft-bento-icon">◈</div>
              <h4>Implant 1 răng</h4>
              <p>Giải pháp lý tưởng cho mất 1–2 răng</p>
            </div>
            <div className="ft-bento-card ft-bento-card-accent">
              <div className="ft-bento-icon">⬟</div>
              <h4>Implant tức thì</h4>
              <p>Cấy ghép ngay trong ngày nhổ răng</p>
            </div>
            <div className="ft-bento-card">
              <div className="ft-bento-icon">⬡</div>
              <h4>Ghép xương</h4>
              <p>Tái tạo nền xương trước khi cấy ghép</p>
            </div>
            <div className="ft-bento-card">
              <div className="ft-bento-icon">◇</div>
              <h4>Mão sứ CAD-CAM</h4>
              <p>Phục hình thẩm mỹ cao cấp zirconia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="ft-services-list sec-pad" style={{ paddingTop: 0 }}>
        <div className="wd-container">
          <div className="row g-4">
            {displayed.map((svc, i) => {
              const feats = svc.features ? svc.features.split('|') : []
              return (
                <div key={svc.id} className="col-md-6 col-lg-4">
                  <div className="ft-svc-card" data-reveal style={{ transitionDelay: `${i * 0.08}s` }}>
                    <div className="ft-svc-num">{svc.number || String(i + 1).padStart(2, '0')}</div>
                    <div className="ft-svc-img-wrap">
                      <img src={svc.image || 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&q=80'} alt={svc.name} loading="lazy" />
                    </div>
                    <div className="ft-svc-body">
                      <h3 className="ft-svc-name">{svc.name}</h3>
                      <p className="ft-svc-desc">{svc.description}</p>
                      {feats.length > 0 && (
                        <ul className="ft-svc-feats">
                          {feats.map((f, fi) => <li key={fi}>{f}</li>)}
                        </ul>
                      )}
                      <div className="ft-svc-footer">
                        <div className="ft-svc-price">{svc.price}</div>
                        <Link to="/dat-lich" className="ft-svc-cta">Tư vấn →</Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="ft-timeline-section sec-pad" style={{ background: 'var(--surface-2)' }}>
        <div className="wd-container">
          <div className="ft-sec-header" data-reveal>
            <div className="ft-eyebrow">Quy trình điều trị</div>
            <h2 className="ft-sec-title">5 bước <em>chuẩn quốc tế</em></h2>
          </div>
          <div className="ft-timeline mt-4">
            {TIMELINE_STEPS.map((step, i) => (
              <div key={i} className="ft-timeline-item" data-reveal style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="ft-tl-num">{step.num}</div>
                <div className="ft-tl-body">
                  <h3 className="ft-tl-title">{step.title}</h3>
                  <p className="ft-tl-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5" data-reveal>
            <Link to="/dat-lich" className="ft-btn ft-btn-neon">Bắt đầu hành trình của bạn →</Link>
          </div>
        </div>
      </section>
    </>
  )
}
