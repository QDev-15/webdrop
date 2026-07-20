import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function AboutPage() {
  const { settings } = useSite()

  const authorName = settings.author_name ?? 'Nguyễn Văn A'
  const authorTitle = settings.author_title ?? 'Developer & Writer'
  const authorBio = settings.author_bio ?? 'Tôi viết về công nghệ, tư duy và cuộc sống. Mỗi tuần một bài, đúng giờ.'
  usePageTitle('Về tôi', authorBio)
  const authorAvatar = settings.author_avatar ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80&auto=format&fit=crop&crop=face'
  const siteEmail = settings.site_email ?? ''
  const socialFacebook = settings.social_facebook ?? ''
  const siteName = settings.site_name ?? 'Blog'

  useEffect(() => {
    document.title = `Về tôi — ${siteName}`
  }, [siteName])

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('[data-reveal]:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
        })
      }, { threshold: 0.08 })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const topics = [
    { icon: '💻', title: 'Công nghệ', desc: 'Lập trình, công cụ, AI và cách tôi ứng dụng công nghệ vào công việc thực tế.' },
    { icon: '🧠', title: 'Tư duy', desc: 'Cách học, cách làm việc tập trung, mental models và những bài học từ sách.' },
    { icon: '🌱', title: 'Cuộc sống', desc: 'Tối giản, thói quen tốt, sức khỏe tâm lý và những ghi chép về cuộc sống hằng ngày.' },
  ]

  const timeline = [
    { year: '2020', title: 'Bắt đầu tự học lập trình', desc: 'Sau nhiều năm làm công việc khác, tôi quyết định chuyển ngành. Python là ngôn ngữ đầu tiên — viết script, làm project nhỏ, rồi từ từ hiểu ra cách tư duy của lập trình viên.' },
    { year: '2021', title: 'Công việc đầu tiên trong ngành IT', desc: 'Sau 14 tháng tự học, được nhận vào một startup nhỏ. Đây là giai đoạn học nhanh nhất trong đời — vừa code vừa học.' },
    { year: '2022', title: 'Bắt đầu viết blog', desc: 'Tôi bắt đầu ghi lại những gì mình học — không phải để nổi tiếng, mà để hiểu rõ hơn.' },
    { year: 'Hiện tại', title: 'Vẫn đang học, vẫn đang viết', desc: 'Mỗi tuần một bài. Tôi tin rằng dù ở level nào, vẫn có điều gì đó đáng viết.' },
  ]

  return (
    <main style={{ paddingTop: '60px' }}>

      {/* HERO */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 0 clamp(48px,6vw,80px)' }}>
        <div className="wd-container" style={{ maxWidth: '900px' }}>
          <div className="row g-4 align-items-center">
            <div className="col-lg-4 text-center text-lg-start">
              <div className="reveal" data-reveal style={{ display: 'inline-block', position: 'relative' }}>
                <img
                  src={authorAvatar}
                  style={{ width: '200px', height: '200px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--accent-light)' }}
                  alt={authorName}
                />
                <div style={{ position: 'absolute', bottom: '12px', right: '12px', width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent)', border: '3px solid var(--bg)' }} />
              </div>
            </div>
            <div className="col-lg-8">
              <div className="reveal" data-reveal>
                <div style={{ display: 'inline-block', fontSize: '11px', fontWeight: '600', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.2px', background: 'var(--accent-light)', padding: '5px 12px', borderRadius: '5px', marginBottom: '14px' }}>
                  {authorTitle}
                </div>
                <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: '600', color: 'var(--text)', letterSpacing: '-.8px', lineHeight: '1.1', marginBottom: '16px' }}>
                  Xin chào, tôi là<br />
                  <em style={{ color: 'var(--accent)', fontStyle: 'normal' }}>{authorName}</em>
                </h1>
                <p style={{ fontSize: '16px', fontWeight: '300', color: 'var(--text-2)', lineHeight: '1.8', marginBottom: '24px' }}>
                  {authorBio}
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Link to="/lien-he" className="btn-accent">Nhắn tin cho tôi</Link>
                  <Link
                    to="/danh-muc/cong-nghe"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '500', color: 'var(--text-2)', textDecoration: 'none', padding: '11px 20px', border: '1px solid var(--border)', borderRadius: '9px', background: 'var(--surface)', transition: 'border-color .2s' }}
                  >
                    Đọc bài viết →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '24px 0', background: 'var(--warm)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="wd-container" style={{ maxWidth: '900px' }}>
          <div className="row g-3 text-center">
            {[
              { value: '66+', label: 'Bài viết' },
              { value: '2.4k', label: 'Người đọc/tuần' },
              { value: '3 năm', label: 'Viết đều đặn' },
            ].map((stat, i) => (
              <div key={i} className={`col-4 reveal${i > 0 ? ` reveal-d${i}` : ''}`} data-reveal>
                <div style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: '600', color: 'var(--text)', letterSpacing: '-.5px' }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px', fontWeight: '300' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOPICS */}
      <section style={{ padding: 'clamp(56px,8vw,96px) 0' }}>
        <div className="wd-container" style={{ maxWidth: '900px' }}>
          <div className="text-center mb-5 reveal" data-reveal>
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '10px' }}>Nội dung</div>
            <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: '600', letterSpacing: '-.4px' }}>Tôi viết về những chủ đề này</h2>
          </div>
          <div className="row g-3">
            {topics.map((t, i) => (
              <div key={i} className={`col-md-4 reveal${i > 0 ? ` reveal-d${i}` : ''}`} data-reveal>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px 22px', height: '100%', transition: 'transform .25s,box-shadow .25s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 36px rgba(0,0,0,.07)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '' }}
                >
                  <span style={{ fontSize: '28px', marginBottom: '14px', display: 'block' }}>{t.icon}</span>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text)', marginBottom: '8px' }}>{t.title}</h3>
                  <p style={{ fontSize: '13px', fontWeight: '300', color: 'var(--text-2)', lineHeight: '1.7', margin: '0' }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section style={{ padding: 'clamp(48px,7vw,88px) 0', background: 'var(--warm)' }}>
        <div className="wd-container" style={{ maxWidth: '720px' }}>
          <div className="text-center mb-5 reveal" data-reveal>
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '10px' }}>Hành trình</div>
            <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: '600', letterSpacing: '-.4px' }}>Từ không biết gì đến đây</h2>
          </div>
          <div>
            {timeline.map((item, i) => (
              <div key={i} className={`reveal${i > 0 ? ` reveal-d${i > 2 ? '3' : i}` : ''}`} data-reveal
                style={{ position: 'relative', paddingLeft: '36px', paddingBottom: i < timeline.length - 1 ? '32px' : '0' }}>
                {i < timeline.length - 1 && (
                  <div style={{ position: 'absolute', left: '10px', top: '26px', bottom: '0', width: '1px', background: 'var(--border)' }} />
                )}
                <div style={{ position: 'absolute', left: '0', top: '6px', width: '22px', height: '22px', borderRadius: '50%', background: i === timeline.length - 1 ? 'var(--accent)' : 'var(--accent-light)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: i === timeline.length - 1 ? '#fff' : 'var(--accent)', fontWeight: '700' }}>
                  {i === timeline.length - 1 ? '→' : '✓'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '4px', fontWeight: '500' }}>{item.year}</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text)', marginBottom: '6px' }}>{item.title}</div>
                <p style={{ fontSize: '14px', fontWeight: '300', color: 'var(--text-2)', lineHeight: '1.7', margin: '0' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONNECT */}
      <section style={{ padding: 'clamp(48px,7vw,88px) 0' }}>
        <div className="wd-container" style={{ maxWidth: '720px' }}>
          <div className="text-center mb-5 reveal" data-reveal>
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '10px' }}>Kết nối</div>
            <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: '600', letterSpacing: '-.4px', marginBottom: '8px' }}>Tìm thấy tôi ở đây</h2>
            <p style={{ fontSize: '14px', fontWeight: '300', color: 'var(--text-2)' }}>Tôi hoạt động chủ yếu trên các nền tảng này</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {siteEmail && (
              <a href={`mailto:${siteEmail}`}
                className="reveal" data-reveal
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', textDecoration: 'none', color: 'var(--text-2)', fontSize: '14px', transition: 'all .2s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--accent)'; el.style.color = 'var(--accent)'; el.style.transform = 'translateX(3px)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text-2)'; el.style.transform = '' }}
              >
                <span style={{ fontSize: '22px' }}>📧</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text)' }}>Email</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{siteEmail}</div>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-3)' }}>→</span>
              </a>
            )}
            {socialFacebook && (
              <a href={socialFacebook} target="_blank" rel="noopener noreferrer"
                className="reveal" data-reveal
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', textDecoration: 'none', color: 'var(--text-2)', fontSize: '14px', transition: 'all .2s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--accent)'; el.style.color = 'var(--accent)'; el.style.transform = 'translateX(3px)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text-2)'; el.style.transform = '' }}
              >
                <span style={{ fontSize: '22px' }}>📘</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text)' }}>Facebook</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{socialFacebook}</div>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-3)' }}>→</span>
              </a>
            )}
            <Link to="/lien-he"
              className="reveal" data-reveal
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', textDecoration: 'none', color: 'var(--text-2)', fontSize: '14px', transition: 'all .2s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--accent)'; el.style.color = 'var(--accent)'; el.style.transform = 'translateX(3px)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text-2)'; el.style.transform = '' }}
            >
              <span style={{ fontSize: '22px' }}>💬</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text)' }}>Liên hệ trực tiếp</div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Gửi tin nhắn qua form liên hệ</div>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-3)' }}>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* NEWSLETTER CTA */}
      <section style={{ padding: 'clamp(48px,7vw,80px) 0', background: 'var(--dark2)' }}>
        <div className="wd-container" style={{ maxWidth: '600px', textAlign: 'center' }}>
          <div className="reveal" data-reveal>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '12px' }}>Newsletter</div>
            <h2 style={{ fontSize: 'clamp(22px,3.5vw,34px)', fontWeight: '600', color: '#fff', letterSpacing: '-.5px', marginBottom: '12px' }}>
              Mỗi tuần một bài.<br />Đúng giờ, không spam.
            </h2>
            <p style={{ fontSize: '14px', fontWeight: '300', color: 'rgba(255,255,255,.5)', lineHeight: '1.7', marginBottom: '28px' }}>
              Đăng ký để nhận bài viết mới nhất qua email.
            </p>
            <div style={{ display: 'flex', gap: '10px', maxWidth: '420px', margin: '0 auto' }}>
              <input
                type="email"
                placeholder="Nhập email của bạn..."
                style={{ flex: 1, fontFamily: 'var(--sans)', fontSize: '14px', border: '1px solid rgba(255,255,255,.15)', borderRadius: '9px', padding: '11px 16px', background: 'rgba(255,255,255,.07)', color: '#fff', outline: 'none' }}
              />
              <button
                style={{ fontFamily: 'var(--sans)', fontSize: '14px', fontWeight: '500', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '9px', padding: '11px 20px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-h)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
              >
                Đăng ký
              </button>
            </div>
            <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,.2)', marginTop: '12px' }}>Unsubscribe bất cứ lúc nào. Không chia sẻ email.</div>
          </div>
        </div>
      </section>

    </main>
  )
}
