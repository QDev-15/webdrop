import { useSite } from '../contexts/SiteContext'

export default function About() {
  const { settings } = useSite()

  return (
    <div className="row align-items-center g-5">
      <div className="col-lg-6 reveal">
        <div className="eyebrow">{settings.about_eyebrow || 'Khởi nguồn'}</div>
        <h2 className="sec-title">Vì sao lại là <em>giờ đêm</em>?</h2>
        <p className="sec-sub mb-3">{settings.about_desc1}</p>
        <p className="sec-sub">{settings.about_desc2}</p>
      </div>
      <div className="col-lg-6 reveal reveal-d1">
        <div className="row g-3">
          <div className="col-6">
            {settings.about_image1 && (
              <img
                src={settings.about_image1}
                alt="Rang cà phê đậm cho khung giờ khuya"
                loading="lazy"
                style={{ borderRadius: 14, width: '100%', aspectRatio: '3/4', objectFit: 'cover', border: '1px solid var(--border)' }}
              />
            )}
          </div>
          <div className="col-6 d-flex flex-column gap-3">
            {settings.about_image2 && (
              <img
                src={settings.about_image2}
                alt="Barista NOX pha chế"
                loading="lazy"
                style={{ borderRadius: 14, width: '100%', flex: 1, objectFit: 'cover', minHeight: 0, border: '1px solid var(--border)' }}
              />
            )}
            {settings.about_image3 && (
              <img
                src={settings.about_image3}
                alt="Góc làm việc đêm tại NOX"
                loading="lazy"
                style={{ borderRadius: 14, width: '100%', flex: 1, objectFit: 'cover', minHeight: 0, border: '1px solid var(--border)' }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
