import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function BookingCTA() {
  const { settings } = useSite()
  const s = (k: string, fb = '') => settings[k] || fb

  return (
    <section className="ns-cta-sec">
      <div className="wd-container" style={{ position: 'relative' }}>
        <div data-reveal>
          <h2 className="ns-cta-title">
            Sẵn sàng cho bộ móng <strong>Hoàn Hảo</strong>?
          </h2>
          <p className="ns-cta-sub">
            Đặt lịch trước để được phục vụ đúng giờ và trải nghiệm tốt nhất.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/dat-lich" className="ns-btn-cta-white">Đặt lịch ngay</Link>
            {s('zalo_number') && (
              <a href={`https://zalo.me/${s('zalo_number')}`} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,.8)', padding: '14px 28px', borderRadius: 9999, border: '1px solid rgba(255,255,255,.3)', textDecoration: 'none', transition: 'all .2s' }}>
                💬 Nhắn Zalo
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
