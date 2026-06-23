import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function About() {
  const { settings } = useSite()

  const stats = [
    { num: settings.stat_clients || '5.000+', label: 'Khách hàng hài lòng' },
    { num: settings.stat_years   || '7+',     label: 'Năm kinh nghiệm' },
    { num: settings.stat_artists || '12+',    label: 'Nghệ nhân chuyên nghiệp' },
    { num: settings.stat_rating  || '4.9★',   label: 'Đánh giá trung bình' },
  ]

  return (
    <>
      {/* Stat strip */}
      <section className="bst-stat-strip">
        <div className="wd-container">
          <div className="row g-3">
            {stats.map((s, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="bst-stat-item" data-reveal data-delay={String(i + 1)}>
                  <div className="bst-stat-num">{s.num}</div>
                  <div className="bst-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 order-lg-2" data-reveal>
              {settings.about_image
                ? <img src={settings.about_image} alt="About" style={{ width: '100%', borderRadius: 16, border: '1px solid var(--border-pink)', objectFit: 'cover', aspectRatio: '4/3' }} />
                : (
                  <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--border-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>
                    ✨
                  </div>
                )
              }
            </div>
            <div className="col-lg-6 order-lg-1">
              <div data-reveal>
                <div className="bst-eyebrow">Về chúng tôi</div>
                <h2 className="bst-title">
                  {settings.about_title || 'Nghệ thuật làm đẹp — <em>đến từ tâm huyết</em>'}
                </h2>
              </div>
              <div data-reveal data-delay="1">
                <p className="bst-sub mb-4" style={{ maxWidth: 'none' }}>
                  {settings.about_content || 'Glow Beauty Studio là không gian làm đẹp toàn diện với đội ngũ nghệ nhân tài năng, được đào tạo chuyên sâu về kỹ thuật tóc, nail, makeup và skincare hiện đại nhất.'}
                </p>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <Link to="/dat-lich" className="bst-btn-primary">✨ Đặt lịch ngay</Link>
                  <Link to="/dich-vu" className="bst-btn-ghost">Xem dịch vụ</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
