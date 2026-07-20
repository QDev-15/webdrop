import { useSite } from '../contexts/SiteContext'
import Contact from '../components/Contact'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function ContactPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: 'Liên hệ | Shop Hữu Cơ',
    description: 'Liên hệ với Shop Hữu Cơ để được tư vấn sản phẩm, theo dõi đơn hàng hoặc giải đáp thắc mắc.',
  })
  const phone = settings['site_phone'] || ''
  const email = settings['site_email'] || ''
  const address = settings['site_address'] || ''
  const hours = settings['working_hours'] || '8:00 – 21:00, Thứ 2 – CN'
  const mapEmbed = settings['map_embed'] || ''

  return (
    <section className="sb-contact-section">
      <div className="sb-container">
        <div className="sb-contact-grid">
          <div className="sb-contact-info">
            <div className="sb-eyebrow">Liên hệ</div>
            <h2>Chúng tôi luôn <em style={{ fontStyle: 'italic', color: 'var(--accent)', fontFamily: 'var(--serif)' }}>sẵn lòng</em> lắng nghe</h2>
            <p>Hãy liên hệ với chúng tôi nếu bạn cần tư vấn sản phẩm, theo dõi đơn hàng, hoặc có bất kỳ thắc mắc nào.</p>

            <div className="sb-contact-details">
              {phone && (
                <div className="sb-contact-detail">
                  <div className="sb-contact-icon">📞</div>
                  <div className="sb-contact-detail-text">
                    <strong>Điện thoại</strong>
                    <p><a href={`tel:${phone}`}>{phone}</a></p>
                  </div>
                </div>
              )}
              {email && (
                <div className="sb-contact-detail">
                  <div className="sb-contact-icon">✉</div>
                  <div className="sb-contact-detail-text">
                    <strong>Email</strong>
                    <p><a href={`mailto:${email}`}>{email}</a></p>
                  </div>
                </div>
              )}
              {address && (
                <div className="sb-contact-detail">
                  <div className="sb-contact-icon">📍</div>
                  <div className="sb-contact-detail-text">
                    <strong>Địa chỉ</strong>
                    <p>{address}</p>
                  </div>
                </div>
              )}
              <div className="sb-contact-detail">
                <div className="sb-contact-icon">🕐</div>
                <div className="sb-contact-detail-text">
                  <strong>Giờ mở cửa</strong>
                  <p>{hours}</p>
                </div>
              </div>
            </div>

            {mapEmbed && (
              <div className="sb-contact-map">
                <iframe src={mapEmbed} title="Bản đồ cửa hàng" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            )}
          </div>

          <Contact />
        </div>
      </div>
    </section>
  )
}
