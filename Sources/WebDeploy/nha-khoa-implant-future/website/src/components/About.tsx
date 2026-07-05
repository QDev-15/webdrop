import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function About() {
  const { settings } = useSite()
  const statCases = settings.stat_cases || '12.000+'
  const statSatisfaction = settings.stat_satisfaction || '99.2%'
  const statYears = settings.stat_years || '10+'

  return (
    <section className="ft-about sec-pad">
      <div className="wd-container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-5" data-reveal>
            <div className="ft-about-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&auto=format&fit=crop"
                alt="Phòng khám Future Dental"
                loading="lazy"
                className="ft-about-img"
              />
              <div className="ft-about-badge-float">
                <div className="ft-ab-num">{statSatisfaction}%</div>
                <div className="ft-ab-label">Tỷ lệ tích hợp xương thành công</div>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div data-reveal>
              <div className="ft-eyebrow">Về chúng tôi</div>
              <h2 className="ft-sec-title">Tiên phong công nghệ <em>Implant 3D</em> tại Việt Nam</h2>
            </div>
            <p className="ft-about-desc" data-reveal>
              Future Dental được thành lập bởi đội ngũ bác sĩ chuyên sâu về Implant, tốt nghiệp và tu nghiệp tại Thụy Sĩ, Hoa Kỳ và Đức. Chúng tôi đi tiên phong trong việc ứng dụng công nghệ kỹ thuật số toàn diện vào từng ca cấy ghép — từ scan 3D intraoral, thiết kế CAD-CAM đến định vị phẫu thuật bằng máng in 3D.
            </p>
            <p className="ft-about-desc" data-reveal>
              Mỗi ca Implant tại Future Dental được lập kế hoạch chi tiết trên phần mềm 3D trước khi bước vào phòng phẫu thuật. Điều này đảm bảo độ chính xác tuyệt đối, giảm thiểu rủi ro và rút ngắn thời gian lành thương.
            </p>

            <div className="ft-about-stats row g-3 mt-2" data-reveal>
              <div className="col-4">
                <div className="ft-astat">
                  <div className="ft-astat-num">{statCases}</div>
                  <div className="ft-astat-label">Ca Implant thành công</div>
                </div>
              </div>
              <div className="col-4">
                <div className="ft-astat">
                  <div className="ft-astat-num">{statYears}+</div>
                  <div className="ft-astat-label">Năm kinh nghiệm</div>
                </div>
              </div>
              <div className="col-4">
                <div className="ft-astat">
                  <div className="ft-astat-num">4</div>
                  <div className="ft-astat-label">Bác sĩ chuyên sâu</div>
                </div>
              </div>
            </div>

            <div className="mt-4" data-reveal>
              <Link to="/cong-nghe-3d" className="ft-btn ft-btn-neon">Xem công nghệ của chúng tôi →</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
