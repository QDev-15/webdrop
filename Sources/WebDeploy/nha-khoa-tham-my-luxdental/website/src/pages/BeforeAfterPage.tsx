import { NavLink } from 'react-router-dom'

// Static before/after gallery — real content from template
const BA_ITEMS = [
  { service: 'Veneer sứ cao cấp', desc: '8 mặt dán sứ E.max, thiết kế nụ cười toàn diện', height: 'h-tall' },
  { service: 'Bọc răng sứ thẩm mỹ', desc: 'Phục hình răng cửa bị mẻ, khôi phục hình dáng tự nhiên', height: '' },
  { service: 'Tẩy trắng răng Zoom', desc: 'Tẩy trắng chuyên sâu tại phòng khám, tăng 10 bậc trắng sáng', height: 'h-short' },
  { service: 'Thiết kế nụ cười DSD', desc: 'Digital Smile Design — nụ cười cân đối hoàn hảo', height: 'h-tall' },
  { service: 'Niềng răng Invisalign', desc: 'Niềng trong suốt 14 tháng, chuẩn tỷ lệ vàng', height: '' },
  { service: 'Implant thẩm mỹ', desc: 'Cấy ghép implant Straumann, phục hình sứ cao cấp', height: 'h-short' },
  { service: 'Veneer sứ 12 mặt', desc: 'Cải thiện màu sắc, hình dáng toàn hàm trên', height: 'h-tall' },
  { service: 'Nhổ răng & tái tạo xương', desc: 'Nhổ răng khôn, ghép xương, đặt implant ngay trong một buổi', height: '' },
  { service: 'Chỉnh nha + Veneer', desc: 'Kết hợp niềng răng và veneer sứ — kết quả tối ưu', height: 'h-short' },
]

// Placeholder gradient background for before/after images
const BEFORE_COLOR = (i: number) => `hsl(${(i * 35 + 200) % 360},15%,30%)`
const AFTER_COLOR  = (i: number) => `hsl(${(i * 35 + 200) % 360},35%,55%)`

export default function BeforeAfterPage() {
  return (
    <>
      <section className="lx-page-hero">
        <div className="wd-container lx-ph-inner">
          <div className="lx-ph-crumb">
            <NavLink to="/">Trang chủ</NavLink> / Trước &amp; Sau
          </div>
          <div className="lx-ph-eyebrow">Kết quả thực tế</div>
          <h1 className="lx-ph-title">Trước <em>&amp; Sau</em></h1>
          <p className="lx-ph-sub">
            Mỗi nụ cười là một hành trình. Khám phá những kết quả thực tế mà LuxDental đã tạo nên cho hàng nghìn khách hàng.
          </p>
        </div>
      </section>

      <section className="sec-pad">
        <div className="wd-container">
          <div className="lx-masonry">
            {BA_ITEMS.map((item, i) => (
              <div key={i} className={`lx-masonry-item${item.height ? ' ' + item.height : ''}`} data-reveal data-delay={String((i % 3) + 1)}>
                <div className="lx-ba-wrap">
                  <div className="lx-ba-grid">
                    {/* Before */}
                    <div className="lx-ba-img" style={{ background: BEFORE_COLOR(i), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'rgba(255,255,255,.15)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Before</span>
                    </div>
                    {/* After */}
                    <div className="lx-ba-img" style={{ background: AFTER_COLOR(i), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'rgba(255,255,255,.2)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>After</span>
                    </div>
                  </div>
                  <div className="lx-ba-label before">Trước</div>
                  <div className="lx-ba-label after">Sau</div>
                  <div className="lx-ba-divider" />
                  {/* Caption */}
                  <div style={{ padding: '14px 16px', background: 'var(--surface)', borderTop: '3px solid var(--accent)' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: 4 }}>{item.service}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <div data-reveal style={{ marginTop: 40, padding: 24, background: 'var(--warm)', borderLeft: '6px solid var(--accent)' }}>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.75 }}>
              <strong style={{ color: 'var(--text)', fontWeight: 700 }}>Lưu ý:</strong> Hình ảnh trước/sau thực tế sẽ được cập nhật từ Admin Panel.
              Kết quả thực tế có thể khác nhau tùy theo tình trạng răng ban đầu của mỗi khách hàng.
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }} data-reveal>
            <NavLink to="/dat-lich" className="lx-btn lx-btn-accent">
              Đặt lịch để có nụ cười như vậy
            </NavLink>
          </div>
        </div>
      </section>
    </>
  )
}
