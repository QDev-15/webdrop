import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

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

export default function Services() {
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    api.get<Service[]>('/public/services').then(data => setServices(data)).catch(() => {})
  }, [])

  const fallback: Service[] = [
    { id: 1, number: '01', name: 'Implant một răng', description: 'Phục hồi răng mất hoàn toàn tự nhiên với trụ titan sinh học tương thích.', features: 'Titanium Grade 4|Osseotite® Surface|15 năm bảo hành', price: 'Từ 18.000.000đ', image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&q=80', is_featured: 1, sort_order: 1 },
    { id: 2, number: '02', name: 'All-on-4', description: 'Phục hồi toàn hàm chỉ với 4 trụ Implant — giải pháp tối ưu cho mất răng toàn hàm.', features: '4 Implant|Hàm răng cố định|Phẫu thuật 1 ngày', price: 'Từ 85.000.000đ', image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80', is_featured: 1, sort_order: 2 },
    { id: 3, number: '03', name: 'All-on-6', description: 'Phục hồi toàn hàm với 6 trụ Implant — độ ổn định tối đa, phân bổ lực tối ưu.', features: '6 Implant|Ổn định tối đa|30 năm bảo hành', price: 'Từ 115.000.000đ', image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&q=80', is_featured: 1, sort_order: 3 },
    { id: 4, number: '04', name: 'Ghép xương', description: 'Tái tạo xương hàm đủ thể tích trước khi cấy ghép Implant — đảm bảo nền tảng vững chắc.', features: 'Bone Graft BioOss|Collagen Membrane|Tái tạo hoàn toàn', price: 'Từ 6.500.000đ/mảnh', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80', is_featured: 0, sort_order: 4 },
    { id: 5, number: '05', name: 'Implant tức thì', description: 'Đặt Implant ngay trong ngày nhổ răng — giảm thời gian điều trị, bảo tồn xương tối đa.', features: 'Same-day Implant|Bảo tồn xương|1 lần phẫu thuật', price: 'Từ 22.000.000đ', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80', is_featured: 0, sort_order: 5 },
    { id: 6, number: '06', name: 'Mão sứ Implant', description: 'Mão sứ zirconia toàn phần — không kim loại, màu sắc tự nhiên, độ bền vượt trội.', features: 'Zirconia cao cấp|Màu tự nhiên|20 năm bảo hành', price: 'Từ 5.000.000đ/răng', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80', is_featured: 0, sort_order: 6 },
  ]

  const displayed = services.length > 0 ? services : fallback

  return (
    <section className="ft-services sec-pad">
      <div className="wd-container">
        <div className="ft-sec-header" data-reveal>
          <div className="ft-eyebrow">Dịch vụ chuyên sâu</div>
          <h2 className="ft-sec-title">Giải pháp Implant <em>toàn diện</em></h2>
          <p className="ft-sec-sub">Từ một chiếc răng đến toàn hàm — chúng tôi có giải pháp Implant phù hợp cho từng trường hợp lâm sàng cụ thể.</p>
        </div>

        <div className="row g-4 mt-2">
          {displayed.slice(0, 6).map((svc, i) => {
            const feats = svc.features ? svc.features.split('|') : []
            return (
              <div key={svc.id} className="col-md-6 col-lg-4">
                <div className="ft-svc-card" data-reveal style={{ transitionDelay: `${i * 0.08}s` }}>
                  <div className="ft-svc-num">{svc.number || String(i + 1).padStart(2, '0')}</div>
                  <div className="ft-svc-img-wrap">
                    <img
                      src={svc.image || 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&q=80'}
                      alt={svc.name}
                      loading="lazy"
                    />
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
                      <Link to="/dat-lich" className="ft-svc-cta">Tư vấn ngay →</Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="ft-services-cta" data-reveal>
          <Link to="/dich-vu-implant" className="ft-btn ft-btn-outline">Xem tất cả dịch vụ →</Link>
        </div>
      </div>
    </section>
  )
}
