import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const SKILLS = [
  { label: 'Phân tích & đánh giá phần cứng', percent: 95 },
  { label: 'Viết nội dung công nghệ', percent: 92 },
  { label: 'SEO & biên tập nội dung', percent: 80 },
  { label: 'Quay dựng video review', percent: 68 },
]

const TIMELINE = [
  { year: '2018', title: 'Kỹ sư kiểm thử phần cứng', desc: 'Bắt đầu sự nghiệp tại một công ty gia công linh kiện điện tử, trực tiếp kiểm thử độ bền và hiệu năng linh kiện trước khi xuất xưởng.' },
  { year: '2020', title: 'Cây viết công nghệ tự do', desc: 'Chuyển hướng viết bài cộng tác cho vài trang tin công nghệ, tích lũy kinh nghiệm biên tập và tiếp cận sản phẩm mới sớm hơn.' },
  { year: '2022', title: 'PIXEL. ra đời', desc: 'Blog cá nhân viết vào cuối tuần chính thức trở thành PIXEL. — với mục tiêu duy nhất: viết công nghệ một cách trung thực và dễ hiểu.' },
  { year: '2024', title: 'Đội ngũ mở rộng', desc: 'Thu Hà gia nhập, phụ trách mảng thủ thuật và bảo mật — giúp PIXEL. đăng bài đều đặn hơn và đa dạng góc nhìn hơn.' },
  { year: '2026', title: 'Hơn 32.000 độc giả mỗi tuần', desc: 'PIXEL. trở thành nguồn tin công nghệ được nhiều bạn đọc tin tưởng, với hơn 1.240 bài viết đã đăng và cộng đồng ngày càng lớn.' },
]

export default function AboutPage() {
  useDocumentMeta({
    title: 'Về tôi — PIXEL. Blog Công Nghệ',
    description: 'Đăng Khoa — người sáng lập PIXEL., blog công nghệ độc lập chuyên tin tức, đánh giá sản phẩm và thủ thuật thực dụng.',
  })

  const { settings } = useSite()

  return (
    <>
      <header className="bcn-page-hero">
        <div className="bcn-page-hero-grid" aria-hidden="true"></div>
        <div className="bcn-container bcn-page-hero-inner">
          <div className="bcn-hero-label" style={{ marginBottom: 18 }}>Người viết</div>
          <h1>Về tôi</h1>
          <p>Người viết ra những bài đăng bạn vừa đọc — và lý do PIXEL. tồn tại.</p>
        </div>
      </header>

      {/* ============ Giới thiệu ============ */}
      <section className="bcn-sec">
        <div className="bcn-container">
          <div className="row align-items-center g-5" data-reveal>
            <div className="col-lg-5">
              <div style={{ position: 'relative' }}>
                <div className="bcn-hero-frame" style={{ borderColor: 'var(--ink)', top: -16, right: -16 }} aria-hidden="true"></div>
                <div style={{ borderRadius: 'var(--radius-card)', overflow: 'hidden', aspectRatio: '4/5', position: 'relative', zIndex: 2 }}>
                  <img src={settings.about_photo} alt={`${settings.site_name || 'PIXEL.'}, người sáng lập`} />
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="bcn-eyebrow">Xin chào</div>
              <h2 className="bcn-sec-title">{settings.about_title}</h2>
              <p className="bcn-sec-sub bcn-mb-0" style={{ maxWidth: '100%', marginBottom: 18 }}>{settings.about_text1}</p>
              <p style={{ fontSize: 14.5, color: 'var(--text-2)', lineHeight: 1.75, marginBottom: 28 }}>{settings.about_text2}</p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/lien-he" className="bcn-btn bcn-btn-accent">Liên hệ hợp tác</Link>
                <Link to="/chuyen-muc" className="bcn-btn bcn-btn-ghost">Xem bài viết của tôi</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Kỹ năng ============ */}
      <section className="bcn-sec bcn-sec-alt">
        <div className="bcn-container">
          <div className="row g-5">
            <div className="col-lg-6" data-reveal>
              <div className="bcn-eyebrow">Chuyên môn</div>
              <h2 className="bcn-sec-title">Những gì tôi làm tốt nhất</h2>
              <div style={{ marginTop: 28 }}>
                {SKILLS.map(s => (
                  <div className="bcn-skill" key={s.label}>
                    <div className="bcn-skill-head"><span>{s.label}</span><span>{s.percent}%</span></div>
                    <div className="bcn-skill-track"><div className="bcn-skill-fill" style={{ width: `${s.percent}%` }}></div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6" data-reveal data-delay="1">
              <div className="bcn-eyebrow">Đội ngũ</div>
              <h2 className="bcn-sec-title">Không chỉ có mình tôi</h2>
              <div className="d-flex gap-3 align-items-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderTop: '3px solid var(--accent)', borderRadius: 'var(--radius-card)', padding: 22, marginTop: 28 }}>
                <img src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=140&auto=format&fit=crop&q=70" alt="Thu Hà" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: 16, marginBottom: 4 }}>Thu Hà</h4>
                  <p style={{ fontSize: 13, color: 'var(--text-2)' }}>Biên tập viên thủ thuật &amp; bảo mật — đồng hành cùng PIXEL. từ năm 2024, phụ trách mảng thủ thuật hệ điều hành và an toàn thông tin.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Timeline ============ */}
      <section className="bcn-sec">
        <div className="bcn-container">
          <div className="bcn-sec-header bcn-center" data-reveal>
            <div className="bcn-eyebrow">Hành trình</div>
            <h2 className="bcn-sec-title">Từ blog cuối tuần đến PIXEL. hôm nay</h2>
          </div>
          <div className="bcn-timeline" style={{ marginTop: 44 }} data-reveal>
            {TIMELINE.map(t => (
              <div className="bcn-timeline-item" key={t.year}>
                <div className="bcn-timeline-year">{t.year}</div>
                <div className="bcn-timeline-title">{t.title}</div>
                <div className="bcn-timeline-desc">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
