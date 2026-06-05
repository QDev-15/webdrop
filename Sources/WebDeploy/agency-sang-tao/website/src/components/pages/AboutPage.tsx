import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import RevealObserver from '../RevealObserver'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function AboutPage() {
  usePageTitle('Về chúng tôi')
  const { settings, team } = useSite()

  const displayTeam = team.length > 0 ? team : [
    { id: 1, name: 'Nguyễn Minh Quân', position: 'Founder & Creative Director', experience: '10 năm kinh nghiệm · Brand Strategy', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop&crop=face', sort_order: 1 },
    { id: 2, name: 'Trần Thị Bảo Châu', position: 'Lead Visual Designer', experience: '7 năm kinh nghiệm · Visual Identity', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&auto=format&fit=crop&crop=face', sort_order: 2 },
    { id: 3, name: 'Lê Hoàng Phúc', position: 'Digital & Campaign Lead', experience: '6 năm kinh nghiệm · Digital Strategy', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&auto=format&fit=crop&crop=face', sort_order: 3 },
    { id: 4, name: 'Phạm Như Quỳnh', position: 'Brand Designer', experience: '4 năm kinh nghiệm', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&auto=format&fit=crop&crop=face', sort_order: 4 },
    { id: 5, name: 'Hồ Văn Khang', position: 'UI/UX Designer', experience: '3 năm kinh nghiệm', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&auto=format&fit=crop&crop=face', sort_order: 5 },
    { id: 6, name: 'Vũ Thanh Hà', position: 'Content Strategist', experience: '5 năm kinh nghiệm', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&auto=format&fit=crop&crop=face', sort_order: 6 },
  ]

  const mainTeam = displayTeam.slice(0, 3)
  const extraTeam = displayTeam.slice(3)

  const manifesto = settings.about_manifesto ||
    'Chúng tôi tin rằng mọi thương hiệu đều có một câu chuyện đáng được kể — và thiết kế chính là ngôn ngữ mạnh mẽ nhất để kể câu chuyện đó.'

  const storyContent = settings.about_story_content ||
    'NOVA. được thành lập năm 2016 bởi Nguyễn Minh Quân — một designer với niềm tin rằng thiết kế không chỉ là nghề mà là sứ mệnh.\n\nTừ một studio nhỏ với 3 người, chúng tôi đã phát triển thành agency 15 thành viên với hơn 120 dự án thành công.'

  const teamCount = settings.about_team_count || String(displayTeam.length)

  return (
    <>
      <RevealObserver />

      {/* PAGE HERO */}
      <section className="ag-page-hero">
        <div className="wd-container">
          <div className="ag-ph-label" data-reveal>Về chúng tôi</div>
          <h1 className="ag-ph-title" data-reveal>
            <span className="outline">WHO</span><br />WE ARE
          </h1>
          <p className="ag-ph-sub" data-reveal>
            Một team nhỏ nhưng mạnh — những người thực sự tin rằng thiết kế tốt có thể thay đổi cách thế giới nhìn nhận một thương hiệu.
          </p>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="ag-about-manifesto">
        <div className="wd-container" data-reveal>
          <p className="ag-manifesto-text">{manifesto}</p>
        </div>
      </section>

      {/* STORY */}
      <section className="ag-sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="row align-items-center g-5 mb-5" data-reveal>
            <div className="col-lg-5">
              <div className="ag-section-label" style={{ marginBottom: '12px' }}>Câu chuyện của chúng tôi</div>
              <h2 className="ag-section-title">{settings.about_story_title || 'Bắt đầu từ một'} <em>studio nhỏ</em></h2>
              {storyContent.split('\n\n').map((para, i) => (
                <p key={i} style={{ fontFamily: 'var(--sans)', fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '16px' }}>{para}</p>
              ))}
              <Link to="/du-an" className="ag-btn-primary">Xem portfolio của chúng tôi</Link>
            </div>
            <div className="col-lg-7">
              <img
                src={settings.about_image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop'}
                alt="Đội ngũ làm việc sáng tạo"
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                loading="lazy"
              />
            </div>
          </div>

          <hr className="ag-divider" style={{ margin: 'clamp(40px, 5vw, 64px) 0' }} />

          <div className="row align-items-center g-5" data-reveal>
            <div className="col-lg-7 order-lg-1 order-2">
              <img
                src="https://images.unsplash.com/photo-1542744094-24638eff58bb?w=800&q=80&auto=format&fit=crop"
                alt="Không gian làm việc sáng tạo"
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                loading="lazy"
              />
            </div>
            <div className="col-lg-5 order-lg-2 order-1">
              <div className="ag-section-label" style={{ marginBottom: '12px' }}>Cách tiếp cận</div>
              <h2 className="ag-section-title">{settings.about_approach_title || 'Sáng tạo có'} <em>mục đích</em></h2>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '16px' }}>
                Chúng tôi không thiết kế chỉ vì đẹp. Mỗi quyết định thiết kế đều có lý do rõ ràng — phục vụ mục tiêu kinh doanh và tạo ra giá trị thực cho thương hiệu.
              </p>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.8 }}>
                Từ giai đoạn discovery đến delivery, chúng tôi làm việc như một đối tác chiến lược — không phải chỉ một nhà cung cấp dịch vụ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="ag-stat-bar">
        <div className="wd-container">
          <div className="ag-stat-bar-inner">
            {[
              { num: settings.stats_projects || '120+', label: 'Dự án' },
              { num: settings.stats_clients || '80+', label: 'Khách hàng' },
              { num: settings.stats_years || '8', label: 'Năm hoạt động' },
              { num: settings.stats_awards || '15', label: 'Giải thưởng' },
            ].map((stat, i) => (
              <div key={i} className="ag-stat-item" data-reveal>
                <div className="ag-stat-number">{stat.num}</div>
                <div className="ag-stat-name">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* VALUES */}
      <section className="ag-sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="wd-container">
          <div className="row g-5">
            <div className="col-lg-4" data-reveal>
              <div className="ag-section-label" style={{ marginBottom: '12px' }}>Giá trị cốt lõi</div>
              <h2 className="ag-section-title">Những điều chúng tôi<br /><em>tin tưởng</em></h2>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.8, marginTop: '16px' }}>
                Văn hóa và giá trị là nền tảng quyết định cách chúng tôi làm việc và tạo ra kết quả cho khách hàng.
              </p>
            </div>
            <div className="col-lg-8" data-reveal>
              {[
                { num: '01', title: 'Sáng tạo có mục đích', desc: 'Mỗi ý tưởng thiết kế đều được đặt trong bối cảnh kinh doanh cụ thể. Đẹp không đủ — hiệu quả mới là thước đo thực sự.' },
                { num: '02', title: 'Minh bạch trong quá trình', desc: 'Chúng tôi làm việc với khách hàng, không làm việc cho khách hàng. Mọi bước đều được chia sẻ và thảo luận cởi mở.' },
                { num: '03', title: 'Học hỏi liên tục', desc: 'Design trends thay đổi liên tục. Chúng tôi cam kết cập nhật và phát triển kỹ năng không ngừng.' },
                { num: '04', title: 'Cam kết chất lượng', desc: 'Chúng tôi không giao sản phẩm chưa đạt tiêu chuẩn. Mỗi deliverable đều được kiểm tra kỹ lưỡng trước khi bàn giao.' },
              ].map((value) => (
                <div key={value.num} className="ag-value-item">
                  <span className="ag-value-num">{value.num}</span>
                  <div>
                    <h3 className="ag-value-title">{value.title}</h3>
                    <p className="ag-value-desc">{value.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="ag-team-section">
        <div className="wd-container">
          <div data-reveal>
            <div className="ag-section-label">Đội ngũ</div>
            <h2 className="ag-section-title" style={{ marginBottom: '32px' }}>Những người tạo nên<br /><em>sự khác biệt</em></h2>
          </div>
        </div>

        <div className="ag-team-hero-wrap" data-reveal>
          <img
            src={settings.about_team_photo || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format&fit=crop'}
            alt="Toàn bộ đội ngũ"
          />
          <div className="ag-team-hero-caption">
            <h3 className="ag-team-hero-title">{teamCount} Người<br />Một Tầm<br />Nhìn</h3>
            <span className="ag-team-hero-sub">
              {settings.about_team_caption || 'Đội ngũ đa dạng chuyên môn — designer, strategist, copywriter, developer'}
            </span>
          </div>
        </div>

        <div className="wd-container">
          <div className="ag-team-members">
            {mainTeam.map((member) => (
              <div key={member.id} className="ag-member-card" data-reveal>
                <img className="ag-member-photo" src={member.avatar} alt={member.name} />
                <div className="ag-member-role">{member.position}</div>
                <div className="ag-member-name">{member.name}</div>
                <div className="ag-member-exp">{member.experience}</div>
              </div>
            ))}
          </div>

          {extraTeam.length > 0 && (
            <div className="row g-3 mt-1">
              {extraTeam.map((member) => (
                <div key={member.id} className="col-6 col-md-3" data-reveal>
                  <div className="ag-member-card">
                    <img className="ag-member-photo" src={member.avatar} alt={member.name} style={{ aspectRatio: '1/1' }} />
                    <div className="ag-member-role">{member.position}</div>
                    <div className="ag-member-name">{member.name}</div>
                  </div>
                </div>
              ))}
              <div className="col-6 col-md-3" data-reveal>
                <div className="ag-member-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', background: 'var(--accent-light)', border: '2px dashed var(--accent)' }}>
                  <div className="text-center" style={{ padding: '24px' }}>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>Đang tuyển dụng</div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '16px', fontWeight: 800, color: 'var(--text)', textTransform: 'uppercase' }}>Join Us</div>
                    <Link to="/lien-he" style={{ fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid var(--accent)', marginTop: '8px', display: 'inline-block' }}>
                      Ứng tuyển &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--accent)', padding: 'clamp(72px, 9vw, 112px) 0' }}>
        <div className="wd-container">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-4" data-reveal>
            <div>
              <div className="ag-cta-label">Cùng nhau tạo nên điều tuyệt vời</div>
              <h2 className="ag-cta-title">THƯƠNG HIỆU CỦA BẠN<br />ĐỢI ĐƯỢC KỂ</h2>
            </div>
            <div className="d-flex gap-3 flex-wrap">
              <Link to="/lien-he" className="ag-btn-primary">Liên hệ ngay</Link>
              <Link to="/du-an" className="ag-btn-outline">Xem dự án</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
