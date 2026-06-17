import { useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  settings: Record<string, string>
}

const PROMISES = [
  { icon: '🚢', title: 'Nhập Hải Sản Mỗi Ngày', desc: 'Liên kết trực tiếp với ngư dân địa phương. Hải sản được vận chuyển về nhà hàng trước 8 giờ sáng hàng ngày, đảm bảo độ tươi tối đa.' },
  { icon: '❄️', title: 'Không Ướp Lạnh Lâu', desc: 'Hải sản được giữ trong bể nước biển nhân tạo. Không bao giờ cấp đông để bán lại — nếu không bán hết trong ngày, chúng tôi không giữ sang hôm sau.' },
  { icon: '👨‍🍳', title: 'Chế Biến Ngay Khi Gọi', desc: 'Từ bể sống đến chảo — tối đa 15 phút. Khách có thể tự chọn con, tự chọn cách chế biến. Đầu bếp tư vấn phương pháp phù hợp nhất.' },
]

const STEPS = [
  { num: 1, time: '3:00 – 5:00 sáng — Ra khơi', text: 'Ngư dân đối tác ra biển đánh bắt. Chúng tôi làm việc với 5 gia đình ngư dân địa phương ven biển.' },
  { num: 2, time: '6:00 – 8:00 sáng — Vào cảng', text: 'Thuyền cập bến, hải sản được phân loại ngay trên tàu. Đại diện nhà hàng kiểm tra và nhận hàng tại chỗ.' },
  { num: 3, time: '8:30 – 10:00 sáng — Vào bể', text: 'Hải sản được đưa thẳng vào bể nước biển nhân tạo tại nhà hàng. Bể tuần hoàn, nhiệt độ kiểm soát 24/7.' },
  { num: 4, time: '10:00 – 22:00 — Phục vụ', text: 'Khách tự chọn con, đầu bếp chế biến ngay. Từ bể đến bàn tối đa 15 phút.' },
]

export default function About({ settings }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('[data-reveal-about]:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [settings])

  const aboutContent = settings.about_content || 'Hành trình từ biển đến bàn ăn của bạn chỉ trong vài tiếng đồng hồ — không dài hơn.'

  return (
    <>
      {/* Promise Section */}
      <section style={{ background: 'var(--bg)', padding: 'clamp(48px,6vw,80px) 0' }}>
        <div className="wd-container">
          <div className="text-center reveal mb-5" data-reveal-about>
            <div className="eyebrow">Cam kết của chúng tôi</div>
            <h2 className="sec-title">Ba cam kết <em>tươi sống</em></h2>
            <p className="sec-sub">Chúng tôi xây dựng niềm tin qua từng bữa ăn — không phải qua quảng cáo.</p>
          </div>
          <div className="row g-4">
            {PROMISES.map((p, i) => (
              <div key={i} className="col-md-4">
                <div className={`promise-card reveal reveal-d${i + 1}`} data-reveal-about>
                  <div className="pc-icon">{p.icon}</div>
                  <div className="pc-title">{p.title}</div>
                  <div className="pc-desc">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4 reveal" data-reveal-about>
            <Link to="/lien-he" className="btn-ghost">Tìm hiểu thêm về cam kết →</Link>
          </div>
        </div>
      </section>

      {/* Catch Story — dark */}
      <section className="catch-story sec-pad sec-dark">
        <div className="wd-container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5 reveal" data-reveal-about>
              <div className="cs-image">
                <img src="https://images.unsplash.com/photo-1565689157206-0fddef7589a2?w=700&q=80&auto=format&fit=crop" alt="Hải sản tươi" loading="lazy" />
              </div>
            </div>
            <div className="col-lg-7 reveal reveal-d1" data-reveal-about>
              <div className="eyebrow">Từ biển đến bàn</div>
              <h2 className="sec-title">Câu chuyện <em>tươi sống</em></h2>
              <p className="sec-sub mb-4">{aboutContent}</p>
              {STEPS.map(s => (
                <div key={s.num} className="cs-step">
                  <div className="cs-step-num">{s.num}</div>
                  <div>
                    <div className="cs-step-title">{s.time}</div>
                    <div className="cs-step-text">{s.text}</div>
                  </div>
                </div>
              ))}
              <div className="mt-4">
                <Link to="/lien-he" className="btn-accent">Xem cam kết tươi sống</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Aquarium Section */}
      <section className="aquarium-section sec-pad">
        <div className="wd-container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 reveal" data-reveal-about>
              <div className="eyebrow">Bể hải sản sống</div>
              <h2 className="sec-title">Tự tay chọn <em>con ngon</em></h2>
              <p className="sec-sub mb-5">Nhà hàng chúng tôi có hệ thống bể hải sản sống rộng rãi, nuôi dưỡng hơn 10 loài khác nhau. Bạn có thể nhìn tận mắt và tự chọn con mình muốn.</p>
              {[
                { icon: '🐠', title: 'Hơn 10 loài hải sản', desc: 'Tôm, cua, ghẹ, mực, bạch tuộc, ốc, ngao, nghêu, cá mú, cá chẽm — luôn có đầy đủ trong ngày.' },
                { icon: '🌊', title: 'Nước biển nhân tạo', desc: 'Bể tuần hoàn liên tục, độ mặn và nhiệt độ kiểm soát, tương đương môi trường tự nhiên của hải sản.' },
                { icon: '📋', title: 'Nguồn gốc rõ ràng', desc: 'Mỗi bể đều có biển tên loài, nguồn gốc và ngày nhập. Minh bạch 100% với khách hàng.' },
              ].map(f => (
                <div key={f.icon} className="aq-feature">
                  <div className="aq-icon">{f.icon}</div>
                  <div>
                    <div className="aq-feat-title">{f.title}</div>
                    <div className="aq-feat-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-lg-6 reveal reveal-d1" data-reveal-about>
              <div className="row g-3">
                <div className="col-6">
                  <div className="aq-img">
                    <img src="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80&auto=format&fit=crop" alt="Bể hải sản" loading="lazy" />
                  </div>
                </div>
                <div className="col-6">
                  <div className="aq-img">
                    <img src="https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=600&q=80&auto=format&fit=crop" alt="Cua tươi sống" loading="lazy" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
