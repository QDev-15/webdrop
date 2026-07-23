import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import StatCounter from '../components/StatCounter'

export default function AboutPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Về chúng tôi — ${settings.site_name || 'AMI Mobile'}`,
    description: `${settings.site_name || 'AMI Mobile'} — cửa hàng điện thoại & phụ kiện chính hãng, nhiều năm kinh nghiệm, phục vụ hàng nghìn khách hàng mỗi năm.`,
  })

  const astats = [1, 2, 3, 4].map(i => ({
    num: Number(settings[`astat${i}_num`] || 0),
    suffix: settings[`astat${i}_suffix`] ?? '',
    label: settings[`astat${i}_label`] || '',
  }))

  const values = [1, 2, 3].map(i => ({
    icon: settings[`value${i}_icon`],
    title: settings[`value${i}_title`],
    desc: settings[`value${i}_desc`],
  })).filter(v => v.title)

  const teamColors: Record<string, string> = { accent: 'var(--accent)', mustard: 'var(--mustard)', dark2: 'var(--dark2)', gray: '#555' }
  const team = [1, 2, 3, 4].map(i => ({
    name: settings[`team${i}_name`],
    role: settings[`team${i}_role`],
    color: teamColors[settings[`team${i}_color`] || ''] || 'var(--accent)',
  })).filter(t => t.name)

  return (
    <>
      <div className="mb-page-hero">
        <div className="mb-container">
          <div className="mb-breadcrumb">
            <Link to="/">Trang chủ</Link><span>/</span><span>Về chúng tôi</span>
          </div>
          <div className="mb-label mb-page-hero-label">Câu chuyện</div>
          <h1>Về <em>{settings.site_name || 'AMI Mobile'}</em></h1>
          <p>Chính hãng từ đầu, tận tâm đến cuối</p>
        </div>
      </div>

      <section className="mb-sec" style={{ paddingTop: 56 }}>
        <div className="mb-container">
          <div className="row g-4 g-lg-5 align-items-center">
            <div className="col-lg-6" data-reveal>
              <div className="mb-about-img">
                <img src={settings.about_img} alt={`Cửa hàng ${settings.site_name || 'AMI Mobile'}`} style={{ width: '100%', borderRadius: 4, border: '2px solid var(--border)' }} />
              </div>
            </div>
            <div className="col-lg-6" data-reveal>
              <div className="mb-label">Câu chuyện</div>
              <h2 className="mb-sec-title">Hơn {settings.astat1_num || '15'} năm <em>phục vụ</em></h2>
              {settings.about_lead1 && <p style={{ color: 'var(--text-2)', lineHeight: 1.8, marginBottom: 16 }}>{settings.about_lead1}</p>}
              {settings.about_lead2 && <p style={{ color: 'var(--text-2)', lineHeight: 1.8, marginBottom: 24 }}>{settings.about_lead2}</p>}
              <Link to="/lien-he" className="mb-btn">Liên hệ với chúng tôi</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-stat-bar">
        <div className="mb-container">
          <div className="row g-4 text-center">
            {astats.map((s, i) => (
              <div className="col-6 col-md-3" data-reveal key={i}>
                <div className="mb-stat-num"><StatCounter target={s.num} suffix={s.suffix} /></div>
                <div className="mb-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {values.length > 0 && (
        <section className="mb-sec" style={{ padding: '64px 0' }}>
          <div className="mb-container">
            <div className="mb-label" data-reveal>Giá trị cốt lõi</div>
            <h2 className="mb-sec-title" data-reveal>Cam kết của <em>chúng tôi</em></h2>
            <div className="row g-4 mt-2">
              {values.map((v, i) => (
                <div className="col-md-4" data-reveal key={i}>
                  <div className="mb-value-card">
                    <div className="mb-value-icon">{v.icon}</div>
                    <h3>{v.title}</h3>
                    <p>{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {team.length > 0 && (
        <section className="mb-sec" style={{ background: 'var(--surface)', padding: '56px 0 72px' }}>
          <div className="mb-container">
            <div className="mb-label" data-reveal>Đội ngũ</div>
            <h2 className="mb-sec-title" data-reveal>Những người <em>đứng sau</em></h2>
            <div className="row g-4 mt-2 justify-content-center">
              {team.map((t, i) => (
                <div className="col-sm-6 col-md-3" data-reveal key={i}>
                  <div className="mb-team-card">
                    <div className="mb-team-avatar" style={{ background: t.color }}>{t.name.charAt(0).toUpperCase()}</div>
                    <div className="mb-team-name">{t.name}</div>
                    <div className="mb-team-role">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
