import { useSite } from '../contexts/SiteContext'
import { renderTitle } from '../utils/text'

export default function About() {
  const { settings } = useSite()

  const stats = [1, 2, 3, 4].map(i => ({
    num: settings[`about_stat${i}_num`],
    label: settings[`about_stat${i}_label`],
  }))

  const team = [1, 2, 3].map(i => ({
    name: settings[`team${i}_name`],
    role: settings[`team${i}_role`],
    desc: settings[`team${i}_desc`],
    avatar: settings[`team${i}_avatar`],
  }))

  const ingredients = [1, 2, 3, 4].map(i => ({
    icon: settings[`ing${i}_icon`],
    title: settings[`ing${i}_title`],
    desc: settings[`ing${i}_desc`],
  }))

  return (
    <>
      {/* CÂU CHUYỆN THƯƠNG HIỆU */}
      <section className="cbn-sec-pad" style={{ background: 'var(--bg)', paddingTop: 'clamp(48px,7vw,80px)' }}>
        <div className="cbn-container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 cbn-reveal">
              <div className="cbn-eyebrow">{settings.about_story_eyebrow}</div>
              <h2 className="cbn-sec-title">{renderTitle(settings.about_story_title)}</h2>
              <p className="cbn-sec-sub mb-3" style={{ maxWidth: '100%' }}>{settings.about_story_text1}</p>
              <p className="cbn-sec-sub" style={{ maxWidth: '100%' }}>{settings.about_story_text2}</p>
            </div>
            <div className="col-lg-6 cbn-reveal cbn-reveal-d1">
              <div className="row g-3">
                <div className="col-6">
                  {settings.about_story_img1 && (
                    <img src={settings.about_story_img1} alt="Bếp bánh Rosette những ngày đầu" loading="lazy"
                      style={{ borderRadius: 20, width: '100%', aspectRatio: '3/4', objectFit: 'cover' }} />
                  )}
                </div>
                <div className="col-6 d-flex flex-column gap-3">
                  {settings.about_story_img2 && (
                    <img src={settings.about_story_img2} alt="Bánh kem hoa hồng bơ thành phẩm" loading="lazy"
                      style={{ borderRadius: 20, width: '100%', flex: 1, objectFit: 'cover', minHeight: 0 }} />
                  )}
                  {settings.about_story_img3 && (
                    <img src={settings.about_story_img3} alt="Cửa hàng Rosette hiện tại" loading="lazy"
                      style={{ borderRadius: 20, width: '100%', flex: 1, objectFit: 'cover', minHeight: 0 }} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="cbn-sec-dark cbn-story-sec" style={{ padding: 'clamp(48px,7vw,80px) 0' }}>
        <div className="cbn-container">
          <div className="row g-4 text-center">
            {stats.map((s, i) => (
              <div className={`col-6 col-md-3 cbn-reveal cbn-reveal-d${Math.min(i + 1, 3)}`} key={i}>
                <div className="cbn-stat-num">{s.num}</div>
                <div className="cbn-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ĐỘI NGŨ */}
      <section className="cbn-sec-pad" style={{ background: 'var(--warm)' }}>
        <div className="cbn-container">
          <div className="text-center cbn-reveal mb-5">
            <div className="cbn-eyebrow">{settings.team_eyebrow}</div>
            <h2 className="cbn-sec-title">{renderTitle(settings.team_title)}</h2>
            <p className="cbn-sec-sub mx-auto">{settings.team_desc}</p>
          </div>
          <div className="row g-4">
            {team.map((m, i) => (
              <div className="col-md-4" key={i}>
                <div className={`cbn-team-card cbn-reveal cbn-reveal-d${i + 1}`}>
                  <div className="cbn-team-img">
                    {m.avatar && <img src={m.avatar} alt={m.name} loading="lazy" />}
                  </div>
                  <div className="cbn-team-name">{m.name}</div>
                  <div className="cbn-team-role">{m.role}</div>
                  <div className="cbn-team-desc">{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NGUYÊN LIỆU */}
      <section className="cbn-sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="cbn-container">
          <div className="row align-items-start g-5">
            <div className="col-lg-5 cbn-reveal">
              <div className="cbn-eyebrow">{settings.ing_eyebrow}</div>
              <h2 className="cbn-sec-title">{renderTitle(settings.ing_title)}</h2>
              <p className="cbn-sec-sub" style={{ maxWidth: '100%' }}>{settings.ing_desc}</p>
            </div>
            <div className="col-lg-7 cbn-reveal cbn-reveal-d1">
              {ingredients.map((ing, i) => (
                <div className="cbn-ing-item" key={i}>
                  <div className="cbn-ing-icon">{ing.icon}</div>
                  <div>
                    <div className="cbn-ing-title">{ing.title}</div>
                    <div className="cbn-ing-desc">{ing.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
