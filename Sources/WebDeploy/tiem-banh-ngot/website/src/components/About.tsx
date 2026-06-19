import { useSite } from '../App'

const STEPS = [
  { num: '01', title: 'Chọn loại bánh', desc: 'Chọn từ hơn 200 mẫu bánh kem, macaron, croissant và pastry đặc biệt.' },
  { num: '02', title: 'Tùy chỉnh theo ý thích', desc: 'Chọn kích thước, hương vị, phong cách trang trí và thông điệp riêng.' },
  { num: '03', title: 'Đặt hàng & Xác nhận', desc: 'Điền form đặt bánh, chúng tôi xác nhận trong vòng 2 giờ làm việc.' },
  { num: '04', title: 'Nhận bánh tươi ngon', desc: 'Nhận tại tiệm hoặc giao tận nơi. Bánh làm tươi theo đơn hàng của bạn.' },
]

export default function About() {
  const { settings } = useSite()

  return (
    <>
      {/* Custom cake steps */}
      <section className="sec-pad" style={{ background: 'var(--warm)' }}>
        <div className="wd-container">
          <div className="text-center mb-5" data-reveal>
            <div className="eyebrow">Quy trình đặt bánh</div>
            <h2 className="sec-title">Đặt bánh <em>thật đơn giản</em></h2>
            <p className="sec-sub">Chỉ 4 bước đơn giản để có chiếc bánh theo yêu cầu riêng của bạn</p>
          </div>
          <div className="row g-4">
            {STEPS.map((step, i) => (
              <div className="col-sm-6 col-lg-3" key={step.num}>
                <div className={`custom-step reveal reveal-d${i + 1}`} data-reveal>
                  <div className="cs-num">{step.num}</div>
                  <div className="cs-title">{step.title}</div>
                  <p className="cs-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About story */}
      <section className="sec-pad" style={{ background: 'var(--dark2)' }}>
        <div className="wd-container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5" data-reveal>
              <div className="eyebrow sec-dark">Câu chuyện của chúng tôi</div>
              <h2 className="sec-title sec-dark">
                {settings.about_title ?? <>Làm từ <em>tình yêu</em> &amp; niềm đam mê</>}
              </h2>
              <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,.45)', lineHeight: 1.8, marginBottom: 28 }}>
                {settings.about_content ?? 'Được thành lập từ năm 2018 bởi những nghệ nhân bánh ngọt đam mê, La Douceur Patisserie ra đời với một sứ mệnh: mang đến những chiếc bánh tinh tế, làm thủ công từ những nguyên liệu tốt nhất. Mỗi chiếc bánh là kết tinh của nghệ thuật và tình yêu.'}
              </p>
              <div className="d-flex gap-4">
                <div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent-mid)', letterSpacing: -1 }}>{settings.about_stat_years ?? '6+'}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>Năm kinh nghiệm</div>
                </div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent-mid)', letterSpacing: -1 }}>{settings.about_stat_products ?? '200+'}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>Loại bánh</div>
                </div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent-mid)', letterSpacing: -1 }}>{settings.about_stat_orders ?? '3K+'}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>Đơn/tháng</div>
                </div>
              </div>
            </div>
            <div className="col-lg-7" data-reveal style={{ position: 'relative' }}>
              {settings.about_image ? (
                <img
                  src={settings.about_image}
                  alt="Về chúng tôi"
                  style={{ width: '100%', borderRadius: 16, objectFit: 'cover', maxHeight: 420 }}
                />
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1587668178277-295251f900ce?w=800&q=80"
                  alt="La Douceur Patisserie"
                  style={{ width: '100%', borderRadius: 16, objectFit: 'cover', height: 420 }}
                />
              )}
              <div style={{
                position: 'absolute', bottom: 24, left: 24, background: 'rgba(255,255,255,.95)',
                backdropFilter: 'blur(8px)', borderRadius: 12, padding: '14px 20px'
              }}>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 2 }}>Nguyên liệu nhập khẩu</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>🇫🇷 Pháp · 🇯🇵 Nhật · 🇧🇪 Bỉ</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
