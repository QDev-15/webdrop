import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const TIMELINE = [
  { year: '2008', text: 'Nụ Cười Xưa thành lập tại một căn nhà nhỏ trên đường Nguyễn Văn Linh, Q.7. Phòng khám bắt đầu với 2 bác sĩ và một ghế nha khoa cổ điển, ấm cúng phong cách vintage mà người sáng lập tâm huyết.' },
  { year: '2012', text: 'Mở rộng thêm phòng khám, nâng cấp trang thiết bị nhưng vẫn giữ nguyên tinh thần "retro-modern": công nghệ hiện đại, không khí thân quen. Đạt 3.000 bệnh nhân phục vụ.' },
  { year: '2016', text: 'Ra mắt dịch vụ niềng răng trong suốt — một trong những phòng khám đầu tiên tại Q.7 triển khai Invisalign. Đội ngũ tăng lên 6 bác sĩ chuyên khoa.' },
  { year: '2020', text: 'Vượt qua đại dịch Covid-19, duy trì hoạt động và ra mắt hệ thống đặt lịch online, phục vụ khám từ xa. Khách hàng trung thành tăng lên hơn 10.000 hồ sơ.' },
  { year: '2024', text: 'Kỷ niệm 16 năm thành lập. Nâng cấp toàn bộ cơ sở vật chất, bổ sung máy scan 3D và buồng phẫu thuật Implant tiêu chuẩn quốc tế. Mở rộng đội ngũ lên 8+ bác sĩ chuyên khoa.' },
]

export default function StoryPage() {
  const { settings } = useSite()

  const storyYear  = settings.story_year  || '2008'
  const storyTitle = settings.story_title || 'Hành trình 16 năm — Từ một phòng khám nhỏ'
  const storyText  = settings.story_text  || 'Nụ Cười Xưa Nha Khoa ra đời năm 2008 với một mong muốn giản dị: tạo ra một nơi khám răng mà khách hàng cảm thấy thoải mái như ở nhà — không lo lắng, không áp lực, không bị giục giã.'
  const storyImage = settings.story_image || ''

  return (
    <>
      {/* Page hero */}
      <div className="nc-page-hero">
        <div className="wd-container nc-strip-inner">
          <div className="nc-ph-crumb">
            <Link to="/">Trang chủ</Link> / Câu chuyện
          </div>
          <h1 className="nc-ph-title">Câu chuyện <span>của chúng tôi</span></h1>
          <p className="nc-ph-sub">Hành trình xây dựng một phòng khám nha khoa phong cách retro-vintage, nơi răng đẹp gặp ký ức đẹp.</p>
        </div>
      </div>

      {/* Main story */}
      <section className="sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="wd-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px', alignItems: 'center', marginBottom: '64px' }}>
            <div data-reveal>
              <div className="nc-story-year">{storyYear}</div>
              <h2 className="nc-story-title">{storyTitle}</h2>
              <p className="nc-story-desc">{storyText}</p>
            </div>
            <div data-reveal data-delay="2">
              <div className="nc-story-img">
                {storyImage ? (
                  <img src={storyImage} alt={storyTitle} loading="lazy" />
                ) : (
                  <div style={{ background: 'var(--accent-light)', height: '100%', minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                    <span style={{ fontSize: '80px', opacity: .2 }}>🏛️</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }} data-reveal>
            <div className="nc-eyebrow" style={{ display: 'inline-flex' }}>Hành trình phát triển</div>
            <h2 className="nc-title" style={{ textAlign: 'center' }}>Những <span>mốc quan trọng</span></h2>
          </div>

          <div className="nc-timeline" data-reveal>
            {TIMELINE.map((item, i) => (
              <div key={item.year} className={`nc-tl-item${i % 2 === 1 ? ' right' : ''}`}>
                <div className="nc-tl-dot" />
                <div className="nc-tl-content">
                  <div className="nc-tl-year">{item.year}</div>
                  <p className="nc-tl-text">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="sec-pad" style={{ background: 'var(--bg-2)' }}>
        <div className="wd-container">
          <div style={{ textAlign: 'center', marginBottom: '52px' }} data-reveal>
            <div className="nc-eyebrow" style={{ display: 'inline-flex' }}>Giá trị cốt lõi</div>
            <h2 className="nc-title" style={{ textAlign: 'center' }}>Điều chúng tôi <span>tin và sống</span></h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '28px' }}>
            {[
              { icon: '🤝', title: 'Tin tưởng', desc: 'Không bao giờ đề xuất điều trị không cần thiết. Minh bạch về chi phí trước khi bắt đầu.' },
              { icon: '🎯', title: 'Chuyên nghiệp', desc: 'Bác sĩ cập nhật kiến thức liên tục theo chuẩn quốc tế, thực hành trên công nghệ mới nhất.' },
              { icon: '🌱', title: 'Tận tâm', desc: 'Mỗi bệnh nhân là một câu chuyện khác nhau — chúng tôi lắng nghe trước khi điều trị.' },
              { icon: '🏆', title: 'Chất lượng', desc: 'Vật liệu nha khoa nhập khẩu chính hãng, quy trình kiểm soát chất lượng nghiêm ngặt.' },
            ].map((v, i) => (
              <div key={i} className="nc-feat-row" data-reveal data-delay={String(i + 1)}>
                <div className="nc-feat-icon">{v.icon}</div>
                <h3 className="nc-feat-title">{v.title}</h3>
                <p className="nc-feat-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="nc-cta">
        <div className="wd-container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <h2 className="nc-title-dk" style={{ textAlign: 'center', marginBottom: '16px' }} data-reveal>
            Trở thành một phần <span>câu chuyện của chúng tôi</span>
          </h2>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }} data-reveal>
            <Link to="/dat-lich" className="nc-btn">Đặt lịch khám ngay</Link>
            <Link to="/bac-si" className="nc-btn-dark-outline">Gặp đội ngũ bác sĩ</Link>
          </div>
        </div>
      </div>
    </>
  )
}
