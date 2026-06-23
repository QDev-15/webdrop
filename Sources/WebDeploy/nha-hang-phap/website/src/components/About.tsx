import { useSite } from '../App'

export default function About() {
  const { settings } = useSite()

  const aboutDesc = settings['about_description'] || 'Mỗi buổi tối tại Le Bistro là một hành trình — từ ly khai vị đến chén rượu tiêu tán, được chăm chút từng chi tiết nhỏ.'

  const chefName = settings['chef_name'] || 'Chef Antoine Moreau'
  const chefImage = settings['chef_image'] || 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80&auto=format&fit=crop'
  const chefBio1 = settings['chef_bio_1'] || 'Được đào tạo tại École Ferrandi, Paris, Chef Antoine đã trải qua hơn 15 năm làm việc tại các nhà hàng Michelin ở Paris, Lyon và Bordeaux.'
  const chefBio2 = settings['chef_bio_2'] || '"Món ăn ngon nhất là món ăn được làm từ nguyên liệu tươi nhất, với kỹ thuật đúng nhất và tình yêu chân thật nhất."'
  const yearsExp = settings['chef_years_exp'] || '15'
  const awards = settings['chef_awards'] || '8'
  const signatureDishes = settings['chef_signature_dishes'] || '40'

  return (
    <>
      {/* L'Art de Recevoir */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="text-center reveal mb-5">
            <div className="eyebrow">L'Art de Recevoir</div>
            <h2 className="sec-title">Nghệ thuật <em>tiếp đón</em> của chúng tôi</h2>
            <p className="sec-sub">{aboutDesc}</p>
          </div>
          <div className="row g-3">
            <div className="col-md-4 reveal reveal-d1">
              <div className="art-col" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="ac-icon">🥂</div>
                <div className="ac-title">Apéritif</div>
                <div className="ac-divider"></div>
                <div className="ac-text">Khai mạc buổi tối với ly Champagne hoặc Kir Royale — những sip đầu tiên mở ra một trải nghiệm ẩm thực khó quên.</div>
              </div>
            </div>
            <div className="col-md-4 reveal reveal-d2">
              <div className="art-col" style={{ background: 'var(--accent)', border: '1px solid var(--accent)' }}>
                <div className="ac-icon">🍽</div>
                <div className="ac-title" style={{ color: '#fff' }}>Table d'Hôtes</div>
                <div className="ac-divider" style={{ background: 'rgba(255,255,255,.3)' }}></div>
                <div className="ac-text" style={{ color: 'rgba(255,255,255,.7)' }}>Bàn ăn được sắp xếp tỉ mỉ — khăn trải bàn lanh Pháp, bộ dao nĩa bạc, nến lung linh trong không gian bistro ấm áp.</div>
              </div>
            </div>
            <div className="col-md-4 reveal reveal-d3">
              <div className="art-col" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="ac-icon">🍾</div>
                <div className="ac-title">Digestif</div>
                <div className="ac-divider"></div>
                <div className="ac-text">Kết thúc hoàn hảo với Cognac, Armagnac hoặc trà thảo mộc — để dư vị của bữa tối lingering mãi trong ký ức.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Le Chef */}
      <section className="chef-section">
        <div className="row g-0">
          <div className="col-lg-5 d-flex">
            <img className="chef-img" src={chefImage} alt={chefName} loading="lazy" />
          </div>
          <div className="col-lg-7 d-flex align-items-center sec-dark">
            <div style={{ padding: 'clamp(48px,6vw,80px) clamp(28px,5vw,72px)' }} className="reveal">
              <div className="eyebrow">Le Chef · Bếp trưởng</div>
              <h2 className="sec-title">{chefName}<br /><em>Executive Chef</em></h2>
              <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,.45)', lineHeight: 1.85, marginBottom: 16 }}>{chefBio1}</p>
              <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,.45)', lineHeight: 1.85, marginBottom: 28 }}>{chefBio2}</p>
              <div className="d-flex gap-5 flex-wrap">
                <div>
                  <div style={{ fontSize: 24, fontWeight: 300, color: '#fff', letterSpacing: '-.5px' }}>{yearsExp}+</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.25)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>Năm kinh nghiệm</div>
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 300, color: '#fff', letterSpacing: '-.5px' }}>{awards}+</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.25)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>Giải thưởng</div>
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 300, color: '#fff', letterSpacing: '-.5px' }}>{signatureDishes}+</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.25)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>Món đặc trưng</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
