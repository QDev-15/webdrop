import { useEffect } from 'react'
import { Settings } from '../App'

interface Props {
  settings: Settings
}

export default function About({ settings }: Props) {
  const name = settings.about_name || 'Tên'
  const role = settings.about_role || 'UI/UX Designer & Developer'
  const bio2 = settings.about_bio_2 || ''
  const image = settings.about_image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=700&q=80&auto=format&fit=crop'
  const yearsExp = settings.about_years_exp || '5'
  const projectsCount = settings.about_projects_count || '40+'
  const clientsCount = settings.about_clients_count || '15+'
  const cvUrl = settings.about_cv_url || 'https://drive.google.com'

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('.reveal:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
        })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [settings])

  return (
    <section className="sec-pad sec-light" id="ve-toi">
      <div className="wd-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px', alignItems: 'center' }}>
          <div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '1', position: 'relative' }} className="reveal">
            <img src={image} alt="Working" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 20, right: 20, background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 20px', minWidth: 130 }}>
              <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--text)', letterSpacing: '-.5px' }}>{yearsExp} năm</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 3 }}>Kinh nghiệm</div>
            </div>
          </div>
          <div>
            <div className="eyebrow eyebrow-dark reveal">Về tôi</div>
            <h2 className="sec-title reveal" style={{ color: 'var(--text)' }}>Đam mê thiết kế,<br /><em>chú tâm từng pixel.</em></h2>
            <p className="sec-sub reveal reveal-d1" style={{ color: 'var(--text-2)' }}>
              Tôi là {name} — {role} với {yearsExp} năm kinh nghiệm làm việc với các startup và agency. Tôi tin rằng thiết kế tốt không chỉ đẹp mà còn phải giải quyết đúng vấn đề.
            </p>
            {bio2 && (
              <p className="sec-sub reveal reveal-d2 mt-3" style={{ color: 'var(--text-2)', marginTop: 12 }}>
                {bio2}
              </p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 24 }}>
              <div className="reveal reveal-d1">
                <div style={{ textAlign: 'center', padding: 20, background: 'var(--warm)', borderRadius: 12 }}>
                  <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--text)', letterSpacing: '-.8px' }}>{projectsCount}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Dự án</div>
                </div>
              </div>
              <div className="reveal reveal-d2">
                <div style={{ textAlign: 'center', padding: 20, background: 'var(--accent-light)', borderRadius: 12 }}>
                  <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--accent)', letterSpacing: '-.8px' }}>{clientsCount}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Khách hàng</div>
                </div>
              </div>
              <div className="reveal reveal-d3">
                <div style={{ textAlign: 'center', padding: 20, background: 'var(--warm)', borderRadius: 12 }}>
                  <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--text)', letterSpacing: '-.8px' }}>100%</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Tâm huyết</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }} className="reveal">
              <a href="#du-an" className="btn-accent">Xem dự án</a>
              <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost-light">Tải CV ↓</a>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media(min-width:992px){
          #ve-toi .wd-container > div { grid-template-columns: 5fr 7fr !important; }
        }
      `}</style>
    </section>
  )
}
