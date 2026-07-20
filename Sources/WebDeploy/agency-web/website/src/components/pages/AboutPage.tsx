import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import { api } from '../../api/client'
import { usePageTitle } from '../../hooks/usePageTitle'

interface TeamMember {
  id: number; name: string; position: string; bio: string; avatar: string
}

export default function AboutPage() {
  const { settings } = useSite()
  usePageTitle('Về chúng tôi', `Tìm hiểu về ${settings.site_name || 'chúng tôi'}.`)
  const [team, setTeam] = useState<TeamMember[]>([])

  useEffect(() => {
    api.get<TeamMember[]>('/public/team').then(setTeam).catch(console.error)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('[data-reveal]:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [team])

  const values = [
    { icon: '🎯', title: 'Kết quả thực sự', desc: 'Chúng tôi đo lường thành công bằng kết quả kinh doanh của khách hàng, không phải số lượng dự án.' },
    { icon: '🤝', title: 'Minh bạch tuyệt đối', desc: 'Timeline rõ ràng, chi phí cố định, không phát sinh. Cập nhật tiến độ hàng ngày không cần nhắc.' },
    { icon: '🚀', title: 'Không ngừng học hỏi', desc: 'Công nghệ thay đổi mỗi ngày. Đội ngũ chúng tôi liên tục cập nhật kiến thức và công cụ mới nhất.' },
    { icon: '💚', title: 'Đồng hành lâu dài', desc: 'Không chỉ là vendor, chúng tôi là đối tác chiến lược — luôn ở đây khi bạn cần.' },
  ]

  const timeline = [
    { year: '2016', title: 'Thành lập công ty', desc: '3 nhà sáng lập, 1 văn phòng nhỏ, và 1 giấc mơ lớn về công nghệ.' },
    { year: '2018', title: 'Đạt mốc 50 dự án', desc: 'Mở rộng đội ngũ lên 12 người, thêm dịch vụ mobile app và marketing số.' },
    { year: '2021', title: 'Top 10 Agency tại Hà Nội', desc: 'Được vinh danh trong danh sách Top Digital Agency, 80+ dự án thành công.' },
    { year: '2024', title: '120+ dự án, 25 chuyên gia', desc: 'Mở rộng sang TP.HCM, phục vụ khách hàng trên toàn quốc và quốc tế.' },
  ]

  return (
    <>
      <section className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Về chúng tôi</div>
          <h1 className="ph-title">Đội ngũ <em>đam mê</em><br />công nghệ</h1>
          <p className="ph-sub">Hơn 8 năm kinh nghiệm, hơn 120 dự án — chúng tôi không chỉ làm website, chúng tôi tạo ra kết quả kinh doanh thực sự.</p>
        </div>
      </section>

      {/* ABOUT STORY */}
      <section className="sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="wd-container">
          <div className="row g-5 align-items-center">
            <div className="col-md-6 reveal" data-reveal>
              <div style={{ borderRadius: '18px', overflow: 'hidden', aspectRatio: '4/3', position: 'relative' }}>
                <img
                  src={settings.about_image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop'}
                  alt="Team"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(26,107,82,.15) 0%,transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'var(--surface)', borderRadius: '12px', padding: '14px 18px', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,.1)' }}>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text)', letterSpacing: '-1px' }}>{settings.stat_projects || '120+'}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 300 }}>dự án hoàn thành thành công</div>
                </div>
              </div>
            </div>
            <div className="col-md-6 reveal reveal-d1" data-reveal>
              <div className="eyebrow">Câu chuyện của chúng tôi</div>
              <h2 className="sec-title">Bắt đầu từ <em>niềm đam mê</em></h2>
              <p style={{ fontSize: '15px', fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '16px' }}>
                {settings.about_content || '[TÊN CÔNG TY] được thành lập năm 2016 với một mục tiêu đơn giản: giúp doanh nghiệp Việt Nam tận dụng tối đa sức mạnh của công nghệ số.'}
              </p>
              <div className="d-flex gap-4">
                <div><div className="stat-num">{settings.stat_projects || '120+'}</div><div className="stat-label">Dự án</div></div>
                <div><div className="stat-num">{settings.stat_years || '8 năm'}</div><div className="stat-label">Kinh nghiệm</div></div>
                <div><div className="stat-num">{settings.stat_satisfaction || '98%'}</div><div className="stat-label">Hài lòng</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="text-center mb-5 reveal" data-reveal>
            <div className="eyebrow">Giá trị cốt lõi</div>
            <h2 className="sec-title">Những điều chúng tôi <em>tin tưởng</em></h2>
          </div>
          <div className="row g-3">
            {values.map((v, i) => (
              <div key={v.title} className="col-md-3">
                <div className={`reveal${i > 0 ? ` reveal-d${i}` : ''}`} data-reveal style={{ padding: '28px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', height: '100%' }}>
                  <div style={{ fontSize: '28px', marginBottom: '14px' }}>{v.icon}</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px', letterSpacing: '-.3px' }}>{v.title}</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.7 }}>{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      {team.length > 0 && (
        <section className="sec-pad" style={{ background: 'var(--surface)' }}>
          <div className="wd-container">
            <div className="text-center mb-5 reveal" data-reveal>
              <div className="eyebrow">Đội ngũ</div>
              <h2 className="sec-title">Những người <em>tạo nên</em> chúng tôi</h2>
            </div>
            <div className="row g-4">
              {team.map((m, i) => (
                <div key={m.id} className="col-6 col-md-3">
                  <div className={`tm-card reveal${i > 0 ? ` reveal-d${Math.min(i, 3)}` : ''}`} data-reveal>
                    {m.avatar && <img className="tm-avatar" src={m.avatar} alt={m.name} loading="lazy" />}
                    <div className="tm-name">{m.name}</div>
                    <div className="tm-role">{m.position}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TIMELINE */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="row g-5 align-items-start">
            <div className="col-md-5 reveal" data-reveal>
              <div className="eyebrow">Hành trình</div>
              <h2 className="sec-title">8 năm <em>phát triển</em></h2>
              <p className="sec-sub mb-0">Từ startup nhỏ đến công ty công nghệ uy tín — mỗi mốc đều là một bài học và một thành tựu.</p>
            </div>
            <div className="col-md-7 reveal reveal-d1" data-reveal>
              {timeline.map((t, i) => (
                <div key={t.year} style={{ display: 'flex', gap: '24px', position: 'relative' }}>
                  {i < timeline.length - 1 && (
                    <div style={{ position: 'absolute', left: '15px', top: '36px', bottom: '-24px', width: '1px', background: 'var(--border-light)' }} />
                  )}
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-light)', border: '2px solid var(--accent-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: 'var(--accent)', flexShrink: 0 }}>
                    {t.year.slice(2)}
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', marginBottom: '4px' }}>{t.year}</div>
                    <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text)', marginBottom: '5px' }}>{t.title}</div>
                    <div style={{ fontSize: '13.5px', fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.65, paddingBottom: '24px' }}>{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="cta-sec">
        <div className="wd-container" data-reveal>
          <h2 className="cta-title">Hãy làm việc cùng nhau</h2>
          <p className="cta-sub">Chúng tôi luôn sẵn sàng lắng nghe và tìm giải pháp tốt nhất cho bạn.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap position-relative">
            <Link to="/lien-he" className="btn-white">Liên hệ ngay →</Link>
            <Link to="/dich-vu" className="btn-outline-white">Xem dịch vụ</Link>
          </div>
        </div>
      </section>
    </>
  )
}
