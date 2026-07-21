import { Link } from 'react-router-dom'
import HeroSlider from '../components/HeroSlider'
import Services from '../components/Services'
import Testimonials from '../components/Testimonials'
import Team from '../components/Team'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function HomePage() {
  const { settings } = useSite()
  useDocumentMeta({ title: settings.meta_title || settings.site_name || 'Nha khoa Implant', description: settings.meta_description })
  const phone = settings.site_phone || '028 3800 5566'

  return (
    <>
      <HeroSlider />

      {/* Features Section */}
      <section className="ft-features sec-pad">
        <div className="wd-container">
          <div className="ft-sec-header" data-reveal>
            <div className="ft-eyebrow">Tại sao chọn chúng tôi</div>
            <h2 className="ft-sec-title">Công nghệ Implant <em>vượt trội</em></h2>
          </div>
          <div className="row g-4 mt-2">
            {[
              { icon: '⬡', title: 'Scan 3D Intraoral', desc: 'Quét khoang miệng toàn diện — mô hình số chính xác đến 0.01mm, không cần lấy khuôn truyền thống gây khó chịu.' },
              { icon: '◈', title: 'Thiết kế CAD-CAM', desc: 'Thiết kế mão phục hình và máng phẫu thuật trên phần mềm 3D chuyên dụng — tối ưu hóa từng thông số kỹ thuật.' },
              { icon: '⬟', title: 'Phẫu thuật định vị', desc: 'Máng phẫu thuật in 3D chính xác tuyệt đối — giảm thiểu rủi ro, bảo tồn xương tối đa, ít sang chấn nhất.' },
              { icon: '◇', title: 'Trụ Implant cao cấp', desc: 'Sử dụng trụ Implant chính hãng từ Straumann (Thụy Sĩ), Nobel Biocare — tích hợp xương nhanh, bảo hành trọn đời.' },
            ].map((feat, i) => (
              <div key={i} className="col-md-6 col-lg-3">
                <div className="ft-feat-card" data-reveal style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="ft-feat-icon">{feat.icon}</div>
                  <h3 className="ft-feat-title">{feat.title}</h3>
                  <p className="ft-feat-desc">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Services />

      {/* Technology Full-bleed Section */}
      <section className="ft-fullbleed">
        <div className="ft-fullbleed-img-wrap">
          <img
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=80&auto=format&fit=crop"
            alt="Phòng phẫu thuật Future Dental"
            loading="lazy"
          />
          <div className="ft-fullbleed-overlay"></div>
        </div>
        <div className="wd-container">
          <div className="ft-fullbleed-inner">
            <div className="row align-items-center g-5">
              <div className="col-lg-6" data-reveal>
                <div className="ft-eyebrow ft-eyebrow-light">Công nghệ 3D</div>
                <h2 className="ft-fullbleed-title">Phòng phẫu thuật <em>số hóa</em> toàn diện</h2>
                <p className="ft-fullbleed-desc">Hệ thống thiết bị kỹ thuật số đồng bộ — từ chẩn đoán đến phục hình — đảm bảo mọi ca Implant đạt chuẩn quốc tế.</p>
                <Link to="/cong-nghe-3d" className="ft-btn ft-btn-neon mt-3">Khám phá công nghệ →</Link>
              </div>
              <div className="col-lg-6">
                <div className="row g-3">
                  {[
                    { label: 'Trios 3Shape', sub: 'Scan 3D Intraoral' },
                    { label: 'Vatech CBCT', sub: 'Chụp CT 3D hàm mặt' },
                    { label: 'exocad CAD-CAM', sub: 'Thiết kế kỹ thuật số' },
                    { label: 'SLA 3D Printer', sub: 'In máng phẫu thuật' },
                  ].map((tech, i) => (
                    <div key={i} className="col-6">
                      <div className="ft-tech-mini-card" data-reveal style={{ transitionDelay: `${i * 0.08}s` }}>
                        <div className="ft-tech-mini-label">{tech.label}</div>
                        <div className="ft-tech-mini-sub">{tech.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Team />

      <Testimonials />

      {/* CTA Section */}
      <section className="ft-cta sec-pad">
        <div className="wd-container">
          <div className="ft-cta-inner" data-reveal>
            <div className="ft-eyebrow">Bắt đầu ngay hôm nay</div>
            <h2 className="ft-cta-title">Sẵn sàng sở hữu <em>nụ cười hoàn hảo?</em></h2>
            <p className="ft-cta-sub">Đặt lịch tư vấn miễn phí — chúng tôi sẽ phân tích tình trạng và đề xuất giải pháp Implant phù hợp nhất cho bạn.</p>
            <div className="ft-cta-actions">
              <Link to="/dat-lich" className="ft-btn ft-btn-neon">Đặt lịch tư vấn miễn phí →</Link>
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="ft-btn ft-btn-ghost">Gọi ngay: {phone}</a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
