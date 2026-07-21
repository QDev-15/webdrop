import { NavLink } from 'react-router-dom'
import Services from '../components/Services'
import { useSite } from '../App'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function ServicesPage() {
  const { settings } = useSite()
  useDocumentMeta({ title: `Dịch vụ — ${settings.site_name || 'LuxDental'}`, description: `Các dịch vụ thẩm mỹ nha khoa cao cấp tại ${settings.site_name || 'LuxDental'} — veneer sứ, bọc răng sứ, tẩy trắng.` })
  return (
    <>
      {/* Page hero */}
      <section className="lx-page-hero">
        <div className="wd-container lx-ph-inner">
          <div className="lx-ph-crumb">
            <NavLink to="/">Trang chủ</NavLink> / Dịch vụ
          </div>
          <div className="lx-ph-eyebrow">Thẩm mỹ nha khoa</div>
          <h1 className="lx-ph-title">Dịch vụ<br /><em>Của chúng tôi</em></h1>
          <p className="lx-ph-sub">
            Từ veneer sứ cao cấp đến cấy ghép implant — mỗi dịch vụ đều được thực hiện bởi chuyên gia hàng đầu với vật liệu nhập khẩu chuẩn quốc tế.
          </p>
        </div>
      </section>

      {/* Services full grid */}
      <section className="sec-pad">
        <div className="wd-container">
          <Services mode="full" />
        </div>
      </section>

      {/* Info strip */}
      <section className="lx-stat-bar">
        <div className="wd-container">
          <div className="row gy-3">
            {[
              { label: 'Tư vấn miễn phí', icon: '💬' },
              { label: 'Vật liệu nhập khẩu', icon: '🦷' },
              { label: 'Bảo hành dài hạn', icon: '🛡️' },
              { label: 'Thanh toán linh hoạt', icon: '💳' },
            ].map((s, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="lx-stat">
                  <div className="lx-stat-num" style={{ fontSize: 36 }}>{s.icon}</div>
                  <div className="lx-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
