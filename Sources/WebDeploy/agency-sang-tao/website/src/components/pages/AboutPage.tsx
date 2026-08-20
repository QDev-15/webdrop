import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import { api } from '../../api/client'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'

interface TeamMember {
  id: number
  name: string
  position: string
  avatar: string
  experience: string
}

export default function AboutPage() {
  useDocumentMeta({
    title: 'Về chúng tôi — Agency Sáng Tạo',
    description: 'Tìm hiểu về đội ngũ và câu chuyện của Agency Sáng Tạo — agency chuyên branding, thiết kế và digital creative tại TP.HCM.',
  })
  const { settings } = useSite()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])

  useEffect(() => {
    api.get<TeamMember[]>('/public/team').then(setTeamMembers).catch(console.error)
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
  }, [teamMembers])

  const siteName     = settings.site_name || 'Agency Sáng Tạo'
  const aboutContent = settings.about_content || 'Agency sáng tạo chuyên branding, thiết kế và digital marketing.'
  const teamImage    = settings.about_image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format&fit=crop'
  const teamTitle    = settings.team_hero_title || 'The Team Behind The Work'
  const teamSub      = settings.team_hero_sub || '15 chuyên gia sáng tạo với hơn 8 năm kinh nghiệm'

  return (
    <main>
      {/* PAGE HERO */}
      <section className="ag-page-hero">
        <div className="wd-container">
          <div className="ag-ph-label" data-reveal>Về chúng tôi</div>
          <h1 className="ag-ph-title" data-reveal>
            <span className="outline">WHO</span><br/>WE ARE
          </h1>
          <p className="ag-ph-sub" data-reveal>{aboutContent}</p>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="ag-about-manifesto">
        <div className="wd-container">
          <p className="ag-manifesto-text" data-reveal>
            <span className="highlight">Chúng tôi tin rằng</span>{' '}
            <span className="accent-word">thương hiệu mạnh</span>{' '}
            <span className="highlight">là nền tảng cho</span>{' '}
            <span className="accent-word">mọi thành công.</span>{' '}
            Không chỉ đẹp,{' '}
            <span className="highlight">mà còn phải</span>{' '}
            <span className="accent-word">có ý nghĩa.</span>
          </p>
        </div>
      </section>

      {/* VALUES */}
      <section className="ag-sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div data-reveal>
            <div className="ag-section-label">Giá trị cốt lõi</div>
            <h2 className="ag-section-title" style={{ marginBottom: '48px' }}>Điều chúng tôi <em>tin vào</em></h2>
          </div>
          {[
            { num: '01', title: 'Sáng tạo có mục đích', desc: 'Mọi quyết định thiết kế đều phải có lý do rõ ràng và phục vụ mục tiêu kinh doanh cụ thể.' },
            { num: '02', title: 'Thấu hiểu trước thiết kế', desc: 'Chúng tôi dành thời gian để thật sự hiểu thương hiệu, thị trường và khách hàng trước khi đặt bút.' },
            { num: '03', title: 'Hợp tác là chìa khóa', desc: 'Kết quả tốt nhất đến từ sự phối hợp chặt chẽ giữa đội ngũ của chúng tôi và team khách hàng.' },
            { num: '04', title: 'Kết quả đo lường được', desc: 'Chúng tôi không chỉ tạo ra thứ đẹp — chúng tôi tạo ra thứ hoạt động hiệu quả và có thể đo lường.' },
          ].map((value) => (
            <div key={value.num} className="ag-value-item" data-reveal>
              <span className="ag-value-num">{value.num}</span>
              <div>
                <h3 className="ag-value-title">{value.title}</h3>
                <p className="ag-value-desc">{value.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section className="ag-team-section">
        <div className="wd-container">
          <div data-reveal>
            <div className="ag-section-label">Đội ngũ</div>
            <h2 className="ag-section-title" style={{ marginBottom: '32px' }}>Con người làm nên <em>sự khác biệt</em></h2>
          </div>
        </div>
        <div className="ag-team-hero-wrap" data-reveal>
          <img src={teamImage} alt={`Đội ngũ ${siteName}`} />
          <div className="ag-team-hero-caption">
            <h3 className="ag-team-hero-title">{teamTitle}</h3>
            <span className="ag-team-hero-sub">{teamSub}</span>
          </div>
        </div>
        <div className="wd-container">
          <div className="ag-team-members">
            {teamMembers.map((member, i) => (
              <div key={member.id} className={`ag-member-card${i === 1 ? ' reveal-d1' : i === 2 ? ' reveal-d2' : ''}`} data-reveal>
                {member.avatar && <img className="ag-member-photo" src={member.avatar} alt={member.name} loading="lazy" />}
                <div className="ag-member-role">{member.position}</div>
                <div className="ag-member-name">{member.name}</div>
                {member.experience && <div className="ag-member-exp">{member.experience}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--dark2)', padding: 'clamp(56px, 7vw, 80px) 0' }}>
        <div className="wd-container">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-4" data-reveal>
            <div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>Làm việc cùng chúng tôi</div>
              <h2 style={{ fontFamily: 'var(--heading)', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '-1px', margin: 0, lineHeight: '.95' }}>
                Bắt đầu dự án<br/>của bạn ngay hôm nay
              </h2>
            </div>
            <Link to="/lien-he" className="ag-btn-accent">Liên hệ ngay &rarr;</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
