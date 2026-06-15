import { useEffect } from 'react'
import { Settings } from '../App'

interface Props {
  settings: Settings
}

export default function Hero({ settings }: Props) {
  const name = settings.about_name || 'Họ Tên'
  const role = settings.about_role || 'UI/UX Designer & Developer'
  const bio = settings.about_bio || 'Tôi thiết kế và xây dựng những sản phẩm số đẹp, nhanh và có trải nghiệm người dùng xuất sắc.'
  const avatar = settings.about_avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&auto=format&fit=crop'
  const projectsCount = settings.about_projects_count || '40+'
  const cvUrl = settings.about_cv_url || '#'
  const status = settings.about_status || 'Sẵn sàng nhận dự án mới'
  const linkedin = settings.social_linkedin || '#'
  const github = settings.social_github || '#'
  const behance = settings.social_behance || '#'
  const dribbble = settings.social_dribbble || '#'

  const [roleParts] = role.split('&')
  const roleEnd = role.includes('&') ? '& ' + role.split('& ')[1] : ''

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('.reveal:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            ro.unobserve(e.target)
          }
        })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [settings])

  return (
    <section className="hero" id="home">
      <div className="hero-grid"></div>
      <div className="hero-glow"></div>
      <div className="wd-container w-100 position-relative" style={{ zIndex: 2, width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px', alignItems: 'center' }}>
          <div style={{ maxWidth: 640 }}>
            <div className="hero-tag reveal">
              <span className="hero-dot"></span>{status}
            </div>
            <h1 className="hero-name reveal">{name}</h1>
            <div className="hero-role reveal reveal-d1">
              {roleParts}<span>{roleEnd}</span>
            </div>
            <p className="hero-bio reveal reveal-d2">{bio}</p>
            <div className="hero-actions reveal reveal-d3">
              <a href="#du-an" className="btn-accent">Xem dự án →</a>
              <a href="#lien-he" className="btn-outline">Liên hệ tôi</a>
            </div>
            <div className="hero-socials reveal">
              <span className="hero-soc-label">Follow</span>
              {linkedin && linkedin !== '#' && <a href={linkedin} target="_blank" rel="noopener noreferrer" className="social-link">in</a>}
              {github && github !== '#' && <a href={github} target="_blank" rel="noopener noreferrer" className="social-link">gh</a>}
              {behance && behance !== '#' && <a href={behance} target="_blank" rel="noopener noreferrer" className="social-link">be</a>}
              {dribbble && dribbble !== '#' && <a href={dribbble} target="_blank" rel="noopener noreferrer" className="social-link">dr</a>}
            </div>
          </div>
          <div style={{ display: 'none' }} className="hero-img-col">
            <div className="hero-img-wrap reveal">
              <img src={avatar} alt={name} className="hero-img" />
              <div className="hero-img-badge">
                <div className="hib-num">{projectsCount}</div>
                <div className="hib-label">Dự án hoàn thành</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-scroll">Scroll</div>
      <style>{`
        @media(min-width:992px){
          .hero .wd-container > div { grid-template-columns: 7fr 5fr !important; }
          .hero-img-col { display:block !important; }
        }
        .w-100 { width: 100%; }
      `}</style>
      {cvUrl && <a href={cvUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'none' }}>CV</a>}
    </section>
  )
}
