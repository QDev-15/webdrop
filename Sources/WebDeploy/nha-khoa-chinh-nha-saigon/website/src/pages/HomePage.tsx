import { Link } from 'react-router-dom'
import HeroSlider from '../components/HeroSlider'
import About from '../components/About'
import Services from '../components/Services'
import Testimonials from '../components/Testimonials'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function HomePage() {
  useDocumentMeta({
    title: 'Nha Khoa Chỉnh Nha Sài Gòn — Niềng Răng Công Nghệ Số',
    description: 'Chuyên khoa niềng răng, chỉnh nha công nghệ số tại Sài Gòn: mắc cài kim loại, mắc cài sứ, Invisalign. Scan 3D, lộ trình điều trị chính xác từng milimet.',
  })

  return (
    <>
      <HeroSlider />

      {/* USP + Stat bar */}
      <About />

      {/* Services section */}
      <section className="cn-services sec-pad">
        <div className="wd-container">
          <div className="cn-section-head" data-reveal>
            <div>
              <div className="cn-eyebrow">Dịch vụ nổi bật</div>
              <h2 className="cn-title">Giải pháp niềng răng cho <em>mọi nhu cầu</em></h2>
              <p className="cn-sub">Từ mắc cài truyền thống đến khay trong suốt cao cấp — tư vấn giải pháp phù hợp với cấu trúc răng và ngân sách của bạn.</p>
            </div>
            <Link to="/dich-vu" className="cn-btn cn-btn-ghost">Xem tất cả dịch vụ</Link>
          </div>
          <Services limit={3} featured />
        </div>
      </section>

      {/* Process preview */}
      <section className="cn-process-prev sec-pad">
        <div className="cn-process-prev-inner wd-container">
          <div className="cn-section-head" data-reveal>
            <div>
              <div className="cn-eyebrow cn-eyebrow-lt">Quy trình chỉnh nha</div>
              <h2 className="cn-title cn-title-lt">4 bước đến nụ cười <em>hoàn hảo</em></h2>
              <p className="cn-sub cn-sub-lt">Quy trình minh bạch, theo dõi được từng giai đoạn bằng công nghệ scan số hóa.</p>
            </div>
            <Link to="/quy-trinh-nieng" className="cn-btn cn-btn-outline-lt">Xem chi tiết quy trình</Link>
          </div>
          <div className="cn-pp-row">
            {[
              { n: '01', title: 'Thăm khám & Scan 3D', desc: 'Chụp phim, scan hàm răng kỹ thuật số không đau.' },
              { n: '02', title: 'Lập kế hoạch điều trị', desc: 'Mô phỏng lộ trình dịch chuyển răng bằng phần mềm 3D.' },
              { n: '03', title: 'Gắn mắc cài / khay niềng', desc: 'Thực hiện bởi bác sĩ chuyên khoa chỉnh nha.' },
              { n: '04', title: 'Tái khám định kỳ', desc: 'Theo dõi tiến độ, chỉnh lực mỗi 4–6 tuần.' },
            ].map((s, i) => (
              <div key={s.n} className="cn-pp-step" data-reveal data-delay={String(i + 1)}>
                <div className="cn-pp-num">{s.n}</div>
                <div className="cn-pp-title">{s.title}</div>
                <p className="cn-pp-text">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="cn-reviews sec-pad">
        <div className="wd-container">
          <div className="cn-text-center" style={{ maxWidth: '560px', margin: '0 auto 48px' }} data-reveal>
            <div className="cn-eyebrow" style={{ justifyContent: 'center' }}>Đánh giá khách hàng</div>
            <h2 className="cn-title">Khách hàng nói gì về <em>hành trình niềng răng</em></h2>
          </div>
          <Testimonials featured />
        </div>
      </section>

      {/* CTA */}
      <section className="cn-cta sec-pad">
        <div className="cn-cta-shape" aria-hidden="true" />
        <div className="cn-cta-shape b" aria-hidden="true" />
        <div className="wd-container">
          <div className="cn-cta-inner" data-reveal>
            <div>
              <h2 className="cn-cta-title">Sẵn sàng cho hành trình <em>chỉnh nha chính xác?</em></h2>
              <p className="cn-cta-sub">Đặt lịch tư vấn miễn phí — scan 3D, đánh giá tình trạng răng và nhận lộ trình điều trị chi tiết ngay trong buổi hẹn đầu tiên.</p>
            </div>
            <div className="cn-cta-actions">
              <Link to="/dat-lich" className="cn-btn cn-btn-primary">Đặt lịch tư vấn</Link>
              <Link to="/lien-he" className="cn-btn cn-btn-outline-lt">Liên hệ ngay</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
