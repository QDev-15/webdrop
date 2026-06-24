import HeroSlider from '../components/HeroSlider'
import About from '../components/About'
import Services from '../components/Services'
import Team from '../components/Team'
import Testimonials from '../components/Testimonials'
import { Link } from 'react-router-dom'

const PROBLEMS = [
  { icon: '🔴', title: 'Mụn trứng cá', desc: 'Mụn viêm, mụn đầu đen, mụn bọc — điều trị tận gốc, ngăn tái phát.' },
  { icon: '🟤', title: 'Nám & Tàn nhang', desc: 'Nám hỗn hợp, tàn nhang sâu — điều trị bằng laser chuyên biệt.' },
  { icon: '⏳', title: 'Lão hóa da', desc: 'Nếp nhăn, chảy xệ, mất đàn hồi — phục hồi cấu trúc collagen.' },
  { icon: '🔵', title: 'Lỗ chân lông', desc: 'Lỗ chân lông to, da sần, da dầu — thu nhỏ và tinh tế hóa bề mặt da.' },
  { icon: '🌸', title: 'Da nhạy cảm', desc: 'Đỏ mặt, da mỏng, dễ kích ứng — phác đồ nhẹ dịu, phục hồi hàng rào da.' },
  { icon: '⚡', title: 'Sẹo & Rỗ', desc: 'Sẹo mụn, sẹo lõm, sẹo phì đại — tái tạo bề mặt da không xâm lấn.' },
]

const PROCESS_STEPS = [
  { num: '01', title: 'Đặt lịch tư vấn', desc: 'Đặt lịch online hoặc gọi hotline. Tư vấn đầu tiên miễn phí — không cam kết mua ngay.' },
  { num: '02', title: 'Khám & phân tích da chuyên sâu', desc: 'Bác sĩ da liễu khám lâm sàng, sử dụng máy phân tích da Visia để đánh giá tình trạng chính xác dưới da.' },
  { num: '03', title: 'Lập phác đồ cá nhân hóa', desc: 'Bác sĩ đề xuất phác đồ điều trị phù hợp với loại da, tình trạng và ngân sách — trình bày chi tiết, rõ ràng.' },
  { num: '04', title: 'Thực hiện điều trị', desc: 'Thực hiện theo phác đồ, theo dõi phản ứng da sau mỗi buổi, điều chỉnh linh hoạt nếu cần.' },
  { num: '05', title: 'Chăm sóc hậu điều trị', desc: 'Hướng dẫn skincare tại nhà, tái khám định kỳ, hỗ trợ 24/7 qua Zalo. Theo dõi kết quả lâu dài.' },
]

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <About />

      {/* Skin Problems */}
      <section className="csd-sec" style={{ background: 'var(--surface)' }}>
        <div className="wd-container">
          <div className="row align-items-end g-0 mb-5">
            <div className="col-md-7" data-reveal>
              <div className="csd-eyebrow">Vấn đề da chúng tôi điều trị</div>
              <h2 className="csd-title">Mọi vấn đề về da —<br /><em>một giải pháp đúng chuyên môn</em></h2>
            </div>
            <div className="col-md-5 text-md-end" data-reveal data-delay="2">
              <p className="csd-sub">Phác đồ điều trị được cá nhân hóa theo từng loại da và tình trạng cụ thể.</p>
            </div>
          </div>
          <div className="row g-4">
            {PROBLEMS.map((p, i) => (
              <div key={p.title} className="col-6 col-md-4 col-lg-2" data-reveal data-delay={i < 3 ? String(i) : String(i - 3)}>
                <div className="csd-problem-item">
                  <div className="csd-pi-icon">{p.icon}</div>
                  <div className="csd-pi-title">{p.title}</div>
                  <div className="csd-pi-desc">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5" data-reveal>
            <Link to="/dich-vu" className="csd-btn-ghost">Xem tất cả điều trị →</Link>
          </div>
        </div>
      </section>

      <Services limit={6} />
      <Team />

      {/* Treatment Process */}
      <section className="csd-sec" style={{ background: 'var(--mint)' }}>
        <div className="wd-container">
          <div className="row g-5 align-items-start">
            <div className="col-md-5" data-reveal>
              <div className="csd-eyebrow">Quy trình điều trị</div>
              <h2 className="csd-title">Từ tư vấn đến <em>kết quả rõ ràng</em></h2>
              <p className="csd-sub" style={{ marginBottom: 28 }}>Mỗi phác đồ được xây dựng riêng cho từng bệnh nhân — không áp dụng công thức chung chung.</p>
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=700&q=80&auto=format&fit=crop"
                alt="Quy trình điều trị da" style={{ width: '100%', borderRadius: 16 }} loading="lazy"
              />
            </div>
            <div className="col-md-7" data-reveal data-delay="2">
              <ol className="csd-timeline">
                {PROCESS_STEPS.map(s => (
                  <li className="csd-tl-item" key={s.num}>
                    <div className="csd-tl-num">{s.num}</div>
                    <div className="csd-tl-body">
                      <div className="csd-tl-title">{s.title}</div>
                      <div className="csd-tl-desc">{s.desc}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* CTA */}
      <section className="csd-cta">
        <div className="wd-container" data-reveal>
          <h2 className="csd-cta-title">Bắt đầu hành trình da khỏe mạnh</h2>
          <p className="csd-cta-sub">Đặt lịch tư vấn miễn phí — bác sĩ phân tích da và lập phác đồ riêng cho bạn.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap" style={{ position: 'relative' }}>
            <Link to="/dat-lich" className="csd-btn-white">Đặt lịch ngay →</Link>
            <Link to="/dich-vu" className="csd-btn-outline-white">Xem dịch vụ</Link>
          </div>
        </div>
      </section>
    </>
  )
}
