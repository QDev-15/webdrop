import { NavLink } from 'react-router-dom'
import Team from '../components/Team'
import { useSite } from '../App'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TeamPage() {
  const { settings } = useSite()
  useDocumentMeta({ title: `Đội ngũ bác sĩ — ${settings.site_name || 'LuxDental'}`, description: `Đội ngũ bác sĩ chuyên khoa thẩm mỹ của ${settings.site_name || 'LuxDental'}.` })
  return (
    <>
      <section className="lx-page-hero">
        <div className="wd-container lx-ph-inner">
          <div className="lx-ph-crumb">
            <NavLink to="/">Trang chủ</NavLink> / Đội ngũ bác sĩ
          </div>
          <div className="lx-ph-eyebrow">Chuyên gia thẩm mỹ nha khoa</div>
          <h1 className="lx-ph-title">Đội ngũ<br /><em>Bác sĩ</em></h1>
          <p className="lx-ph-sub">
            Từng bác sĩ LuxDental đều là chuyên gia được đào tạo bài bản tại các trường đại học y khoa hàng đầu, với hàng nghìn ca thực hiện thành công.
          </p>
        </div>
      </section>

      <section className="sec-pad">
        <div className="wd-container">
          <div className="row mb-5 gy-3">
            <div className="col-lg-6" data-reveal>
              <div className="lx-eyebrow">Đội ngũ của chúng tôi</div>
              <h2 className="lx-title">Hơn <em>10 năm</em><br />chuyên môn</h2>
            </div>
            <div className="col-lg-6" data-reveal data-delay="1">
              <p className="lx-sub" style={{ marginTop: 8 }}>
                LuxDental quy tụ những bác sĩ nha khoa thẩm mỹ tốt nghiệp thủ khoa, chuyên sâu veneer sứ, thiết kế nụ cười và phục hình răng cao cấp.
                Mỗi chuyên gia đều thường xuyên cập nhật kỹ thuật mới nhất từ hội nghị quốc tế.
              </p>
            </div>
          </div>

          <Team showCta={false} />
        </div>
      </section>

      {/* Why our team */}
      <section className="sec-pad" style={{ background: 'var(--dark)' }}>
        <div className="wd-container">
          <div className="text-center mb-5" data-reveal>
            <div className="lx-eyebrow" style={{ justifyContent: 'center', color: 'var(--accent-mid)' }}>Tiêu chuẩn tuyển chọn</div>
            <h2 className="lx-title sec-dark">Chỉ những<br /><em>Bác sĩ tốt nhất</em></h2>
          </div>
          <div className="row gy-4">
            {[
              { title: 'Bằng cấp chuyên khoa', desc: 'Tối thiểu Thạc sĩ Răng Hàm Mặt, ưu tiên tiến sĩ và nghiên cứu sinh nước ngoài.' },
              { title: 'Kinh nghiệm thực chiến', desc: 'Ít nhất 5 năm thực hành lâm sàng, hoàn thành hơn 500 ca thẩm mỹ nha khoa.' },
              { title: 'Đào tạo quốc tế', desc: 'Tham gia khoá học tại Mỹ, Châu Âu về CAD/CAM, Digital Smile Design và Implantology.' },
              { title: 'Chứng chỉ hành nghề', desc: 'Đầy đủ giấy phép hành nghề Bộ Y tế, bảo hiểm hành nghề và cập nhật thường niên.' },
            ].map((item, i) => (
              <div key={i} className="col-sm-6" data-reveal data-delay={String((i % 2) + 1)}>
                <div style={{ padding: '24px 28px', border: '1px solid rgba(255,255,255,.1)', borderLeft: '6px solid var(--accent)', height: '100%' }}>
                  <div style={{ fontSize: 15, fontWeight: 800, textTransform: 'uppercase', color: '#fff', marginBottom: 10 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', lineHeight: 1.7 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sec-pad" style={{ background: 'var(--warm)' }}>
        <div className="wd-container text-center" data-reveal>
          <div className="lx-eyebrow" style={{ justifyContent: 'center' }}>Gặp bác sĩ của bạn</div>
          <h2 className="lx-title" style={{ marginBottom: 16 }}>Đặt lịch tư vấn<br /><em>miễn phí</em></h2>
          <p className="lx-sub center" style={{ marginBottom: 32 }}>
            Trao đổi trực tiếp với bác sĩ chuyên khoa, nhận tư vấn cá nhân hóa cho nụ cười của bạn.
          </p>
          <NavLink to="/dat-lich" className="lx-btn lx-btn-accent">
            Chọn bác sĩ &amp; đặt lịch
          </NavLink>
        </div>
      </section>
    </>
  )
}
