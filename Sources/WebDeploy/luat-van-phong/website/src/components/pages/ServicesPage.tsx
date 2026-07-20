import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import Reveal from '../Reveal'
import CtaForm from '../CtaForm'
import { usePageTitle } from '../../hooks/usePageTitle'

const romanNumerals = ['I.', 'II.', 'III.', 'IV.', 'V.', 'VI.']

export default function ServicesPage() {
  const { settings, services } = useSite()
  usePageTitle('Lĩnh vực tư vấn', `Các lĩnh vực tư vấn pháp lý của ${settings.site_name || 'chúng tôi'}.`)
  const phone = settings.site_phone || '0900 000 000'

  const processSteps = [
    { num: '1', title: 'Tư Vấn Ban Đầu', desc: 'Buổi tư vấn miễn phí 30–60 phút để hiểu rõ tình huống pháp lý, đánh giá rủi ro và xác định hướng xử lý tốt nhất.' },
    { num: '2', title: 'Phân Tích & Chiến Lược', desc: 'Nghiên cứu hồ sơ, phân tích pháp luật và án lệ, xây dựng chiến lược pháp lý tối ưu, báo giá dịch vụ minh bạch.' },
    { num: '3', title: 'Triển Khai & Thực Hiện', desc: 'Luật sư phụ trách trực tiếp soạn thảo văn bản, đại diện thương lượng, nộp hồ sơ và theo dõi tiến trình vụ việc.' },
    { num: '4', title: 'Kết Quả & Hậu Mãi', desc: 'Báo cáo kết quả chi tiết, tư vấn bước tiếp theo và duy trì hỗ trợ pháp lý dài hạn cho thân chủ.' },
  ]

  const features = [
    { num: '01', title: 'Chuyên Môn Sâu', desc: 'Mỗi lĩnh vực có luật sư chuyên sâu riêng, không làm đại trà — chất lượng tư vấn vượt trội.' },
    { num: '02', title: 'Minh Bạch Chi Phí', desc: 'Báo giá rõ ràng trước khi ký hợp đồng — không phát sinh chi phí ẩn hay bất ngờ.' },
    { num: '03', title: 'Cập Nhật Liên Tục', desc: 'Thân chủ được cập nhật tiến độ thường xuyên — luật sư phụ trách trả lời trong vòng 24 giờ.' },
    { num: '04', title: 'Bảo Mật Tuyệt Đối', desc: 'Thông tin thân chủ được bảo vệ theo nghĩa vụ bảo mật nghề nghiệp và quy định pháp luật.' },
  ]

  return (
    <>
      {/* PAGE HERO */}
      <section className="lv-page-hero">
        <div className="wd-container">
          <Reveal><div className="lv-ph-kicker">Chuyên môn pháp lý</div></Reveal>
          <Reveal delay={1}><h1 className="lv-ph-title">Lĩnh Vực <em>Hành Nghề</em></h1></Reveal>
          <Reveal delay={2}><p className="lv-ph-sub">Giải pháp pháp lý toàn diện cho doanh nghiệp và cá nhân — từ tư vấn đến tranh tụng.</p></Reveal>
        </div>
      </section>

      {/* INTRO */}
      <section className="lv-sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5">
              <Reveal>
                <span className="lv-section-label">Phương châm</span>
                <h2 className="lv-section-title">Chuyên môn sâu,<br/><em>giải pháp toàn diện.</em></h2>
              </Reveal>
            </div>
            <div className="col-lg-7">
              <Reveal delay={1}>
                <p style={{ fontFamily: 'var(--body-font)', fontSize: '16px', fontWeight: 300, color: 'var(--text-2)', lineHeight: '1.9', marginBottom: '16px' }}>
                  Với hơn 15 năm hành nghề, chúng tôi đã xây dựng đội ngũ luật sư chuyên sâu trong các lĩnh vực pháp lý trọng yếu của nền kinh tế Việt Nam.
                </p>
                <p style={{ fontFamily: 'var(--body-font)', fontSize: '16px', fontWeight: 300, color: 'var(--text-2)', lineHeight: '1.9' }}>
                  Chúng tôi không chỉ tư vấn pháp lý — chúng tôi đồng hành như một đối tác chiến lược, giúp thân chủ đưa ra quyết định đúng đắn và bảo vệ quyền lợi tối đa trong mọi hoàn cảnh.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* PRACTICE CARDS */}
      <section style={{ background: 'var(--warm)', padding: 'clamp(60px,8vw,100px) 0' }}>
        <div className="wd-container">
          <Reveal className="text-center" style={{ marginBottom: 'clamp(40px,5vw,60px)' }}>
            <span className="lv-section-label">Các lĩnh vực</span>
            <h2 className="lv-section-title">Sáu lĩnh vực <em>chuyên sâu</em></h2>
          </Reveal>
          <div className="row g-4">
            {services.map((s, i) => (
              <div key={s.id} className="col-md-6 col-lg-4">
                <Reveal delay={i % 3}>
                  <div className="lv-practice-card">
                    <div className="lv-practice-icon">{romanNumerals[i] || `${i + 1}.`}</div>
                    <h3 className="lv-practice-title">{s.name}</h3>
                    <p className="lv-practice-desc">{s.description}</p>
                    {s.items && s.items.length > 0 && (
                      <ul className="lv-practice-list">
                        {s.items.map((item, j) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="lv-sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <Reveal className="text-center" style={{ marginBottom: 'clamp(40px,5vw,64px)' }}>
            <span className="lv-section-label">Quy trình làm việc</span>
            <h2 className="lv-section-title">Từ tư vấn đến <em>kết quả.</em></h2>
            <p className="lv-section-sub" style={{ margin: '0 auto' }}>Quy trình làm việc minh bạch, rõ ràng — thân chủ luôn biết chúng tôi đang làm gì và tại sao.</p>
          </Reveal>
          <div className="row g-4" style={{ maxWidth: '860px', margin: '0 auto' }}>
            {processSteps.map((s, i) => (
              <div key={i} className="col-md-6">
                <Reveal delay={i % 2}>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', padding: '24px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ fontFamily: 'var(--heading-font)', fontSize: '40px', fontWeight: 300, color: 'var(--accent-mid)', opacity: .5, lineHeight: 1, flexShrink: 0, width: '52px', textAlign: 'center' }}>{s.num}</div>
                    <div>
                      <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '20px', fontWeight: 400, color: 'var(--text)', marginBottom: '8px' }}>{s.title}</h3>
                      <p style={{ fontFamily: 'var(--body-font)', fontSize: '13.5px', fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
                    </div>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="lv-features-section lv-sec-pad">
        <div className="wd-container">
          <Reveal className="text-center" style={{ marginBottom: 'clamp(40px,5vw,64px)' }}>
            <span className="lv-section-label">Tại sao chọn chúng tôi</span>
            <h2 className="lv-section-title">Khác biệt tạo nên<br/><em>sự tin tưởng.</em></h2>
          </Reveal>
          <div className="row g-4">
            {features.map((f, i) => (
              <div key={i} className="col-md-3 col-sm-6">
                <Reveal delay={i}>
                  <div className="lv-feature-item">
                    <div className="lv-feature-num">{f.num}</div>
                    <h3 className="lv-feature-title">{f.title}</h3>
                    <p className="lv-feature-desc">{f.desc}</p>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaForm
        heading="Vụ việc của bạn<br/><em>cần được xử lý ngay.</em>"
        phone={`Hotline: ${phone}`}
        buttonLabel="Yêu Cầu Tư Vấn"
        subtext="Miễn phí · Bảo mật · Phản hồi trong 24 giờ"
      />
    </>
  )
}
