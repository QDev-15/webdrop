import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import Reveal from '../Reveal'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function LawyersPage() {
  usePageTitle('Đội ngũ luật sư')
  const { lawyers } = useSite()

  const partners   = lawyers.filter(l => Number(l.is_partner))
  const associates = lawyers.filter(l => !Number(l.is_partner))

  return (
    <>
      {/* PAGE HERO */}
      <section className="lv-page-hero">
        <div className="wd-container">
          <Reveal><div className="lv-ph-kicker">Đội ngũ chuyên gia</div></Reveal>
          <Reveal delay={1}><h1 className="lv-ph-title">Luật Sư <em>Của Chúng Tôi</em></h1></Reveal>
          <Reveal delay={2}><p className="lv-ph-sub">Được đào tạo tại các trường hàng đầu, thực chiến qua hàng trăm vụ việc — mỗi luật sư là một chuyên gia đáng tin cậy.</p></Reveal>
        </div>
      </section>

      {/* LEAD PARTNERS */}
      {partners.length > 0 && (
        <section className="lv-sec-pad" style={{ background: 'var(--bg)' }}>
          <div className="wd-container">
            <Reveal style={{ marginBottom: 'clamp(36px,5vw,56px)' }}>
              <span className="lv-section-label">Luật sư sáng lập &amp; điều hành</span>
              <h2 className="lv-section-title">Ban lãnh đạo <em>văn phòng.</em></h2>
            </Reveal>
            {partners.map((l, i) => (
              <Reveal key={l.id} className="lv-profile-bento" style={{ gridTemplateColumns: i % 2 === 0 ? '1fr 1.8fr' : '1.8fr 1fr' }}>
                {i % 2 === 0 ? (
                  <>
                    <div className="lv-profile-photo-col">
                      <img src={l.avatar} alt={l.name} />
                    </div>
                    <div className="lv-profile-info-col">
                      <h2 className="lv-profile-title">{l.name}</h2>
                      <div className="lv-profile-role">{l.role}</div>
                      <p className="lv-profile-bio">{l.bio}</p>
                      {l.tags && (
                        <div className="lv-profile-tags">
                          {l.tags.split(',').map((t, j) => (
                            <span key={j} className="lv-tag">{t.trim()}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="lv-profile-info-col">
                      <h2 className="lv-profile-title">{l.name}</h2>
                      <div className="lv-profile-role">{l.role}</div>
                      <p className="lv-profile-bio">{l.bio}</p>
                      {l.tags && (
                        <div className="lv-profile-tags">
                          {l.tags.split(',').map((t, j) => (
                            <span key={j} className="lv-tag">{t.trim()}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="lv-profile-photo-col">
                      <img src={l.avatar} alt={l.name} />
                    </div>
                  </>
                )}
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ASSOCIATES */}
      {associates.length > 0 && (
        <section style={{ background: 'var(--warm)', padding: 'clamp(60px,8vw,100px) 0' }}>
          <div className="wd-container">
            <Reveal style={{ marginBottom: 'clamp(36px,5vw,56px)' }}>
              <span className="lv-section-label">Đội ngũ luật sư thành viên</span>
              <h2 className="lv-section-title">Chuyên gia <em>từng lĩnh vực.</em></h2>
            </Reveal>
            <div className="row g-4">
              {associates.map((l, i) => (
                <div key={l.id} className="col-md-4 col-sm-6">
                  <Reveal delay={i % 3}>
                    <div className="lv-lawyer-card">
                      <div className="lv-lawyer-photo">
                        <img src={l.avatar} alt={l.name} />
                      </div>
                      <h3 className="lv-lawyer-name">{l.name}</h3>
                      <div className="lv-lawyer-role">{l.role}</div>
                      <p className="lv-lawyer-spec">{l.speciality}</p>
                    </div>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* JOIN US */}
      <section className="lv-sec-pad" style={{ background: 'var(--dark2)' }}>
        <div className="wd-container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <Reveal>
                <span className="lv-section-label on-dark">Cơ hội nghề nghiệp</span>
                <h2 className="lv-section-title on-dark">Gia nhập đội ngũ<br/><em>của chúng tôi.</em></h2>
                <p className="lv-section-sub on-dark" style={{ marginBottom: '32px' }}>
                  Chúng tôi luôn tìm kiếm những luật sư tài năng, có đam mê và cam kết với nghề. Môi trường làm việc chuyên nghiệp, cơ hội phát triển rõ ràng.
                </p>
                <Link to="/lien-he" className="lv-btn-ghost-gold">Gửi CV của bạn</Link>
              </Reveal>
            </div>
            <div className="col-lg-6">
              <Reveal delay={1}>
                <div style={{ border: '1px solid rgba(255,255,255,.08)', padding: '36px' }}>
                  <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '22px', fontWeight: 400, color: 'rgba(255,255,255,.8)', marginBottom: '20px' }}>Chúng tôi tìm kiếm:</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {[
                      'Luật sư có kinh nghiệm 3–10 năm trong các lĩnh vực ưu tiên',
                      'Thành thạo tiếng Anh pháp lý (ưu tiên có chứng chỉ quốc tế)',
                      'Tư duy phân tích sắc bén, kỹ năng viết pháp lý xuất sắc',
                      'Chứng chỉ hành nghề luật sư hợp lệ tại Việt Nam',
                      'Cam kết nghề nghiệp dài hạn và tinh thần đồng đội',
                    ].map((item, i) => (
                      <li key={i} style={{ fontFamily: 'var(--body-font)', fontSize: '14px', fontWeight: 300, color: 'rgba(255,255,255,.45)', padding: '12px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,.06)' : 'none', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--accent-mid)', flexShrink: 0 }}>·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
