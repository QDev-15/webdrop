import { useSite } from '../contexts/SiteContext'

interface Feature { icon: string; title: string; desc: string }

const DEFAULT_FEATURES: Feature[] = [
  { icon: '✦', title: 'Thợ nail có chứng chỉ', desc: 'Đội ngũ được đào tạo bài bản, cập nhật xu hướng mới nhất mỗi tháng.' },
  { icon: '💎', title: 'Sản phẩm cao cấp', desc: 'Sử dụng 100% sản phẩm nail chính hãng, an toàn cho sức khỏe.' },
  { icon: '🌸', title: 'Không gian thư giãn', desc: 'Studio được thiết kế theo phong cách spa — yên tĩnh, sạch sẽ, thư giãn.' },
  { icon: '⏱️', title: 'Đúng giờ & tận tâm', desc: 'Cam kết đúng lịch hẹn, không để khách hàng chờ đợi quá lâu.' },
]

export default function About() {
  const { settings } = useSite()
  const s = (k: string, fb = '') => settings[k] || fb

  const features: Feature[] = [
    { icon: s('feature1_icon', DEFAULT_FEATURES[0].icon), title: s('feature1_title', DEFAULT_FEATURES[0].title), desc: s('feature1_desc', DEFAULT_FEATURES[0].desc) },
    { icon: s('feature2_icon', DEFAULT_FEATURES[1].icon), title: s('feature2_title', DEFAULT_FEATURES[1].title), desc: s('feature2_desc', DEFAULT_FEATURES[1].desc) },
    { icon: s('feature3_icon', DEFAULT_FEATURES[2].icon), title: s('feature3_title', DEFAULT_FEATURES[2].title), desc: s('feature3_desc', DEFAULT_FEATURES[2].desc) },
    { icon: s('feature4_icon', DEFAULT_FEATURES[3].icon), title: s('feature4_title', DEFAULT_FEATURES[3].title), desc: s('feature4_desc', DEFAULT_FEATURES[3].desc) },
  ]

  return (
    <section className="sec-pad" style={{ background: 'var(--warm)' }}>
      <div className="wd-container">
        <div className="row align-items-center g-5">
          <div className="col-lg-5" data-reveal>
            <div className="ns-eyebrow">Vì sao chọn chúng tôi</div>
            <h2 className="ns-title">{s('about_title', 'Tiêu chuẩn <strong>5 Sao</strong>')
              .replace('<strong>', '').replace('</strong>', '') // render as plain text
            }</h2>
            <p className="ns-sub">{s('about_sub', 'Chúng tôi không chỉ làm đẹp — chúng tôi tạo ra trải nghiệm khó quên cho mỗi khách hàng.')}</p>
          </div>
          <div className="col-lg-7">
            <div className="row g-3">
              {features.map((f, i) => (
                <div key={i} className="col-sm-6" data-reveal data-reveal-d={`d${i}`}>
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 24 }}>
                    <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, color: 'var(--text)' }}>{f.title}</div>
                    <p style={{ fontSize: 13, fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
