import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const BENTO_ITEMS = [
  { big: true,  caption: 'Phòng điều trị hiện đại',   sub: 'Trang thiết bị nhập khẩu châu Âu',  img: 'https://plus.unsplash.com/premium_photo-1674368232044-31d75efc09fa??w=800' },
  { wide: false, caption: 'CT Cone Beam 3D',            sub: 'Chụp hình chính xác 0.1mm',          img: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600' },
  { wide: false, caption: 'Phòng phẫu thuật vô khuẩn', sub: 'Chuẩn phòng mạch quốc tế',           img: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=600' },
  { wide: false, caption: 'Hệ thống DEXIS X-quang KTS', sub: 'Chụp X-quang số hóa liều thấp',    img: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600' },
  { wide: true,  caption: 'Phòng chờ chuyên nghiệp',   sub: 'Không gian thoải mái, thư giãn',    img: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800' },
  { wide: false, caption: 'iTero scan răng 3D',          sub: 'Scan chính xác không tiếp xúc',     img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600' },
]

const TECH_USP = [
  { title: 'CT Cone Beam 3D', desc: 'Hệ thống chụp CT 3 chiều phân giải cao, giúp bác sĩ phân tích chính xác cấu trúc xương hàm, chân răng và mô.' },
  { title: 'iTero Element 5D', desc: 'Máy scan đầu đọc dùng laser phân giải cao, loại bỏ tiếp xúc trực tiếp, tăng chính xác cho chỉnh nha và răng sứ.' },
  { title: 'Laser Biolase Epic', desc: 'Laser nha khoa thế hệ mới — điều trị viêm nướu, tẩy trắng, phẫu thuật mô mềm an toàn không đau.' },
  { title: 'Autoclave Class B', desc: 'Hệ thống khử khuẩn chuẩn Class B đạt chuẩn châu Âu, đảm bảo vô khuẩn tuyệt đối mọi dụng cụ.' },
]

export default function FacilitiesPage() {
  const { settings } = useSite()
  const branches   = settings.stat_branches || '12'
  const cities     = '6'
  const chairs     = '40+'
  const iso        = '100%'

  return (
    <>
      {/* Page hero */}
      <section className="vd-page-hero">
        <div className="wd-container">
          <div className="vd-ph-inner">
            <div className="vd-ph-crumb">
              <Link to="/">Trang chủ</Link>
              <span>›</span>
              <span>Cơ sở vật chất</span>
            </div>
            <h1 className="vd-ph-title">Cơ Sở Vật Chất <em>Hiện Đại</em></h1>
            <p className="vd-ph-sub">Trang thiết bị nhập khẩu trực tiếp từ châu Âu và Mỹ — chuẩn điều trị quốc tế.</p>
          </div>
        </div>
      </section>

      {/* Bento gallery */}
      <section className="vd-sec-pad">
        <div className="wd-container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="vd-eyebrow center" data-reveal="true">Hình Ảnh Thực Tế</div>
            <h2 className="vd-h2" style={{ textAlign: 'center' }} data-reveal="true" data-delay="1">
              Không Gian <em>Chuyên Nghiệp</em>
            </h2>
          </div>

          <div className="vd-bento" data-reveal="true">
            {BENTO_ITEMS.map((item, i) => (
              <div key={i} className={`vd-bento-item${item.big ? ' big' : ''}${item.wide ? ' wide' : ''}`}>
                <img src={item.img} alt={item.caption} loading="lazy" />
                <div className="vd-bento-overlay">
                  <div className="vd-bento-caption">
                    {item.caption}
                    <span>{item.sub}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech USP */}
      <section className="vd-sec-pad" style={{ background: 'var(--accent-pale)' }}>
        <div className="wd-container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="vd-eyebrow center" data-reveal="true">Công Nghệ</div>
            <h2 className="vd-h2" style={{ textAlign: 'center' }} data-reveal="true" data-delay="1">
              Trang Thiết Bị <em>Đầu Bảng</em>
            </h2>
            <p className="vd-lead center" data-reveal="true" data-delay="2">
              Chúng tôi đầu tư vào công nghệ tiên tiến nhất để mang lại kết quả điều trị tốt nhất.
            </p>
          </div>

          <div className="row g-4">
            {TECH_USP.map((t, i) => (
              <div className="col-lg-6" key={i}>
                <div style={{ display: 'flex', gap: 20, padding: '28px', background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border)', height: '100%' }} data-reveal="true" data-delay={`${i + 1}`}>
                  <div style={{ width: 48, height: 48, minWidth: 48, background: 'var(--accent-light)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg viewBox="0 0 24 24" style={{ width: 24, height: 24, fill: 'var(--accent)' }}>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>{t.title}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.7 }}>{t.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stat bar */}
      <section className="vd-stat-bar">
        <div className="wd-container">
          <div className="row g-0">
            {[
              { num: branches + '+', label: 'Chi Nhánh' },
              { num: cities,         label: 'Tỉnh Thành' },
              { num: chairs,         label: 'Ghế Điều Trị' },
              { num: iso,            label: 'ISO 9001' },
            ].map((s, i) => (
              <div className="col-md-3 col-6 vd-stat-divider" key={i}>
                <div className="vd-stat-item" data-reveal="true" data-delay={`${i + 1}`}>
                  <div className="vd-stat-num">{s.num}</div>
                  <div className="vd-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
