import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const TECHS = [
  {
    name: 'Trios 3Shape',
    category: 'Scan 3D Intraoral',
    desc: 'Máy scan khoang miệng 3D thế hệ mới nhất — tốc độ quét nhanh, độ chính xác 0.01mm, không cần lấy khuôn truyền thống. Dữ liệu scan được xuất trực tiếp vào phần mềm thiết kế CAD-CAM.',
    specs: ['Chính xác 0.01mm', 'Quét toàn hàm < 90s', 'Tích hợp CAD-CAM trực tiếp'],
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&auto=format&fit=crop',
  },
  {
    name: 'Vatech CBCT 3D',
    category: 'Chụp CT Nha khoa',
    desc: 'Hệ thống chụp CT chùm tia hình nón — cho hình ảnh 3D chi tiết của xương hàm, răng và cấu trúc xung quanh. Thiết yếu để lập kế hoạch Implant chính xác và an toàn.',
    specs: ['Hình ảnh 3D chi tiết', 'Liều phóng xạ thấp', 'Phân tích mật độ xương'],
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80&auto=format&fit=crop',
  },
  {
    name: 'exocad CAD-CAM',
    category: 'Thiết kế kỹ thuật số',
    desc: 'Phần mềm thiết kế nha khoa hàng đầu thế giới — tích hợp dữ liệu từ scan 3D và CBCT để thiết kế mão phục hình và máng phẫu thuật với độ chính xác tuyệt đối.',
    specs: ['Thiết kế mão zirconia', 'Lập kế hoạch Implant 3D', 'Xuất file máng in 3D'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80&auto=format&fit=crop',
  },
  {
    name: 'SLA 3D Printer',
    category: 'In máng phẫu thuật',
    desc: 'Máy in 3D SLA độ phân giải cao — in máng phẫu thuật định vị Implant với sai số <0.1mm. Máng phẫu thuật đảm bảo bác sĩ đặt trụ đúng vị trí được lập kế hoạch trên phần mềm 3D.',
    specs: ['Sai số <0.1mm', 'Nhựa nha khoa sinh học', 'Máng in trong ngày'],
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80&auto=format&fit=crop',
  },
]

export default function TechPage() {
  const { settings } = useSite()
  useDocumentMeta({ title: `Công nghệ 3D — ${settings.site_name || 'Nha khoa'}`, description: `Công nghệ cấy ghép Implant 3D hiện đại tại ${settings.site_name || 'nha khoa'}.` })
  const statCases = settings.stat_cases || '12.000+'
  const statSatisfaction = settings.stat_satisfaction || '99.2%'
  const statYears = settings.stat_years || '10+'

  return (
    <>
      {/* Page Header */}
      <section className="ft-page-header">
        <div className="wd-container">
          <div className="ft-ph-inner">
            <div className="ft-eyebrow ft-eyebrow-light">Công nghệ 3D</div>
            <h1 className="ft-ph-title">Hệ thống thiết bị <em>số hóa toàn diện</em></h1>
            <p className="ft-ph-sub">Bốn công nghệ cốt lõi tạo nên quy trình Implant chính xác nhất — từ chẩn đoán đến phục hình hoàn chỉnh.</p>
          </div>
        </div>
      </section>

      {/* Full-bleed Showcase */}
      <section className="ft-fullbleed">
        <div className="ft-fullbleed-img-wrap">
          <img
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=80&auto=format&fit=crop"
            alt="Phòng phẫu thuật kỹ thuật số Future Dental"
            loading="lazy"
          />
          <div className="ft-fullbleed-overlay"></div>
        </div>
        <div className="wd-container">
          <div className="ft-fullbleed-inner">
            <div className="row align-items-center g-5">
              <div className="col-lg-6" data-reveal>
                <div className="ft-eyebrow ft-eyebrow-light">Digital Dentistry</div>
                <h2 className="ft-fullbleed-title">Từ <em>dữ liệu 3D</em> đến kết quả thực tế</h2>
                <p className="ft-fullbleed-desc">Toàn bộ quy trình được số hóa — mọi quyết định kỹ thuật được tính toán trên phần mềm trước khi thực hiện, loại bỏ sai số con người.</p>
              </div>
              <div className="col-lg-5 offset-lg-1">
                <div className="ft-tech-stat-panel" data-reveal>
                  <div className="ft-tsp-item">
                    <div className="ft-tsp-num">0.1mm</div>
                    <div className="ft-tsp-label">Sai lệch phẫu thuật tối đa</div>
                  </div>
                  <div className="ft-tsp-item">
                    <div className="ft-tsp-num">{statSatisfaction}%</div>
                    <div className="ft-tsp-label">Tỷ lệ tích hợp xương</div>
                  </div>
                  <div className="ft-tsp-item">
                    <div className="ft-tsp-num">{statCases}</div>
                    <div className="ft-tsp-label">Ca Implant thành công</div>
                  </div>
                  <div className="ft-tsp-item">
                    <div className="ft-tsp-num">{statYears}+</div>
                    <div className="ft-tsp-label">Năm kinh nghiệm Implant</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Detail Cards */}
      <section className="sec-pad">
        <div className="wd-container">
          <div className="ft-sec-header" data-reveal>
            <div className="ft-eyebrow">Hệ thống thiết bị</div>
            <h2 className="ft-sec-title">4 công nghệ <em>cốt lõi</em></h2>
          </div>
          <div className="ft-tech-list mt-4">
            {TECHS.map((tech, i) => (
              <div key={i} className={`ft-tech-item ${i % 2 === 1 ? 'ft-tech-item-reverse' : ''}`} data-reveal>
                <div className="ft-tech-img-col">
                  <img src={tech.image} alt={tech.name} loading="lazy" />
                </div>
                <div className="ft-tech-body-col">
                  <div className="ft-tech-category">{tech.category}</div>
                  <h3 className="ft-tech-name">{tech.name}</h3>
                  <p className="ft-tech-desc">{tech.desc}</p>
                  <ul className="ft-tech-specs">
                    {tech.specs.map((s, si) => <li key={si}>{s}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ft-cta sec-pad">
        <div className="wd-container">
          <div className="ft-cta-inner" data-reveal>
            <div className="ft-eyebrow">Trải nghiệm ngay</div>
            <h2 className="ft-cta-title">Đặt lịch <em>tư vấn 3D</em> miễn phí</h2>
            <p className="ft-cta-sub">Đến thăm khám — chúng tôi sẽ chụp CT 3D và trình bày kế hoạch điều trị chi tiết hoàn toàn miễn phí.</p>
            <div className="ft-cta-actions">
              <Link to="/dat-lich" className="ft-btn ft-btn-neon">Đặt lịch tư vấn miễn phí →</Link>
              <Link to="/dich-vu-implant" className="ft-btn ft-btn-ghost">Xem dịch vụ Implant</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
