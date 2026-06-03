import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import { api } from '../../api/client'
import RevealObserver from '../RevealObserver'

interface TeamMember {
  id: number; name: string; position: string; bio: string; avatar: string
}

const VALUES = [
  { icon: '🎯', title: 'Kết quả thực sự', desc: 'Chúng tôi đo lường thành công bằng kết quả kinh doanh của khách hàng, không phải số lượng dự án.' },
  { icon: '🤝', title: 'Minh bạch tuyệt đối', desc: 'Timeline rõ ràng, chi phí cố định, không phát sinh. Cập nhật tiến độ hàng ngày không cần nhắc.' },
  { icon: '🚀', title: 'Không ngừng học hỏi', desc: 'Công nghệ thay đổi mỗi ngày. Đội ngũ chúng tôi liên tục cập nhật kiến thức và công cụ mới nhất.' },
  { icon: '💚', title: 'Đồng hành lâu dài', desc: 'Không chỉ là vendor, chúng tôi là đối tác chiến lược — luôn ở đây khi bạn cần.' },
]

const TIMELINE = [
  { dot: '16', year: '2016', title: 'Thành lập công ty', desc: '3 nhà sáng lập, 1 văn phòng nhỏ, và 1 giấc mơ lớn về công nghệ.' },
  { dot: '18', year: '2018', title: 'Đạt mốc 50 dự án', desc: 'Mở rộng đội ngũ lên 12 người, thêm dịch vụ mobile app và marketing số.' },
  { dot: '21', year: '2021', title: 'Top 10 Agency tại Hà Nội', desc: 'Được vinh danh trong danh sách Top Digital Agency, 80+ dự án thành công.' },
  { dot: '24', year: '2024', title: '120+ dự án, 25 chuyên gia', desc: 'Mở rộng sang TP.HCM, phục vụ khách hàng trên toàn quốc và quốc tế.' },
]

export default function AboutPage() {
  const { settings } = useSite()
  const [team, setTeam] = useState<TeamMember[]>([])

  useEffect(() => {
    api.get<TeamMember[]>('/public/team').then(setTeam).catch(() => {})
  }, [])

  return (
    <>
      <section className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Về chúng tôi</div>
          <h1 className="ph-title">Đội ngũ <em>đam mê</em><br />công nghệ</h1>
          <p className="ph-sub">Hơn 8 năm kinh nghiệm, hơn 120 dự án — chúng tôi không chỉ làm website, chúng tôi tạo ra kết quả kinh doanh thực sự.</p>
        </div>
      </section>

      {/* STORY */}
      <section className="sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="wd-container">
          <div className="row g-5 align-items-center">
            <div className="col-md-6 reveal">
              <div style={{ borderRadius: '18px', overflow: 'hidden', aspectRatio: '4/3', position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop"
                  alt="Team"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(26,107,82,.15) 0%,transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'var(--surface)', borderRadius: '12px', padding: '14px 18px', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,.1)' }}>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text)', letterSpacing: '-1px' }}>{settings.about_stat1_num || '120+'}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 300 }}>dự án hoàn thành thành công</div>
                </div>
              </div>
            </div>
            <div className="col-md-6 reveal reveal-d1">
              <div className="eyebrow">{settings.about_tagline || 'Câu chuyện của chúng tôi'}</div>
              <h2 className="sec-title">Bắt đầu từ <em>niềm đam mê</em></h2>
              {(settings.about_content || '').split('\n\n').map((para, i) => (
                <p key={i} style={{ fontSize: '15px', fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '16px' }}>{para}</p>
              ))}
              <div className="d-flex gap-4" style={{ marginTop: '8px' }}>
                <div>
                  <div className="stat-num">{settings.about_members_count || '25+'}</div>
                  <div className="stat-label">Thành viên</div>
                </div>
                <div>
                  <div className="stat-num">{settings.about_stat2_num || '8 năm'}</div>
                  <div className="stat-label">Kinh nghiệm</div>
                </div>
                <div>
                  <div className="stat-num">{settings.about_stat3_num || '98%'}</div>
                  <div className="stat-label">Hài lòng</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="text-center reveal mb-5">
            <div className="eyebrow">Giá trị cốt lõi</div>
            <h2 className="sec-title">Những điều chúng tôi <em>tin tưởng</em></h2>
          </div>
          <div className="row g-3">
            {VALUES.map((v, i) => (
              <div key={i} className="col-md-3">
                <div className={`value-card reveal${i > 0 ? ` reveal-d${Math.min(i, 3)}` : ''}`}>
                  <div className="vc-icon">{v.icon}</div>
                  <div className="vc-title">{v.title}</div>
                  <div className="vc-desc">{v.desc}</div>
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
            <div className="text-center reveal mb-5">
              <div className="eyebrow">Đội ngũ</div>
              <h2 className="sec-title">Những người <em>tạo nên</em> chúng tôi</h2>
            </div>
            <div className="row g-4">
              {team.map((m, i) => (
                <div key={m.id} className="col-md-3 col-6">
                  <div className={`tm-card reveal${i > 0 ? ` reveal-d${Math.min(i, 3)}` : ''}`}>
                    {m.avatar && <img className="tm-avatar" src={m.avatar} alt={m.name} />}
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
            <div className="col-md-5 reveal">
              <div className="eyebrow">Hành trình</div>
              <h2 className="sec-title">8 năm <em>phát triển</em></h2>
              <p className="sec-sub mb-0">Từ startup nhỏ đến công ty công nghệ uy tín — mỗi mốc đều là một bài học và một thành tựu.</p>
            </div>
            <div className="col-md-7 reveal reveal-d1">
              {TIMELINE.map(t => (
                <div key={t.dot} className="timeline-item">
                  <div className="tl-dot">{t.dot}</div>
                  <div>
                    <div className="tl-year">{t.year}</div>
                    <div className="tl-title">{t.title}</div>
                    <div className="tl-desc">{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="cta-sec">
        <div className="wd-container reveal">
          <h2 className="cta-title">Hãy làm việc cùng nhau</h2>
          <p className="cta-sub">Chúng tôi luôn sẵn sàng lắng nghe và tìm giải pháp tốt nhất cho bạn.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap position-relative">
            <Link to="/lien-he" className="btn-white">Liên hệ ngay →</Link>
            <Link to="/dich-vu" className="btn-outline-white">Xem dịch vụ</Link>
          </div>
        </div>
      </section>

      <RevealObserver />
    </>
  )
}
