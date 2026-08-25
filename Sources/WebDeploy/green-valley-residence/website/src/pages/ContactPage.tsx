import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import AgentCard from '../components/AgentCard'
import ContactForm from '../components/ContactForm'

export default function ContactPage() {
  useDocumentMeta({
    title: 'Liên hệ Phòng Kinh doanh dự án | Green Valley Residence',
    description: 'Liên hệ Phòng Kinh doanh dự án Green Valley Residence để nhận bảng giá mới nhất, đặt lịch tham quan nhà mẫu và tư vấn chính sách bán hàng, hỗ trợ vay ngân hàng.',
  })

  const { settings } = useSite()
  const hotline = settings.site_phone || '1900 6868'
  const salesPhone = settings.site_phone2 || ''
  const mapSrc = `https://maps.google.com/maps?q=${settings.contact_map_lat || '10.8046'},${settings.contact_map_lng || '106.7350'}&hl=vi&z=16&output=embed`

  return (
    <>
      <header className="gvr-page-hero">
        <span className="blob blob-a"></span><span className="blob blob-b"></span>
        <div className="wd-container">
          <div className="gvr-crumb"><Link to="/">Trang chủ</Link> / Liên hệ</div>
          <div className="eyebrow eyebrow-light">Phòng Kinh doanh dự án</div>
          <h1 className="sec-title on-dark" style={{ marginBottom: 12 }}>Liên hệ nhận tư vấn</h1>
          <p className="sec-sub on-dark">Để lại thông tin hoặc gọi trực tiếp — đội ngũ tư vấn viên sẽ hỗ trợ bạn trong vòng 30 phút.</p>
        </div>
      </header>

      <section className="sec-pad">
        <div className="wd-container">
          <div className="row g-4">
            <div className="col-lg-4">
              <AgentCard />

              <div className="gvr-card gvr-card-solid p-4 mb-4">
                <div className="gvr-feat mb-3"><div className="gvr-feat-icon">📍</div><div><div className="gvr-feat-title" style={{ fontSize: 14 }}>Nhà mẫu &amp; văn phòng kinh doanh</div><div className="gvr-feat-desc">{settings.site_address}</div></div></div>
                <div className="gvr-feat mb-3"><div className="gvr-feat-icon">☎</div><div><div className="gvr-feat-title" style={{ fontSize: 14 }}>Hotline</div><div className="gvr-feat-desc">{hotline} (giờ hành chính){salesPhone ? ` — ${salesPhone} (24/7)` : ''}</div></div></div>
                <div className="gvr-feat mb-3"><div className="gvr-feat-icon">✉️</div><div><div className="gvr-feat-title" style={{ fontSize: 14 }}>Email</div><div className="gvr-feat-desc">{settings.site_email}</div></div></div>
                <div className="gvr-feat"><div className="gvr-feat-icon">🕐</div><div><div className="gvr-feat-title" style={{ fontSize: 14 }}>Giờ đón tiếp nhà mẫu</div><div className="gvr-feat-desc">{settings.working_hours}</div></div></div>
              </div>
            </div>

            <div className="col-lg-8">
              <ContactForm variant="full" />
              <div className="gvr-footer-maps" style={{ margin: 0 }}>
                <iframe src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`Vị trí văn phòng ${settings.site_name || 'Green Valley Residence'}`}></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
