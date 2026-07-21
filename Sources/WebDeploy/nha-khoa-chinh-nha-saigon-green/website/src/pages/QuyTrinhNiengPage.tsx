import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const STEPS_FULL = [
  {
    num: '01',
    title: 'Thăm khám & Scan 3D ban đầu',
    text: 'Bác sĩ thăm khám lâm sàng, chụp phim X-quang toàn cảnh và cận cảnh. Scan hàm răng kỹ thuật số không đau bằng máy iTero — kết quả hiện ngay trên màn hình.',
    details: [
      'Chụp phim X-quang kỹ thuật số toàn bộ',
      'Scan 3D hàm răng — thời gian 5–10 phút',
      'Phân tích cấu trúc xương hàm và khớp cắn',
      'Chẩn đoán mức độ sai lệch',
    ],
  },
  {
    num: '02',
    title: 'Lập kế hoạch điều trị 3D',
    text: 'Bác sĩ sử dụng phần mềm chuyên dụng để mô phỏng chính xác lộ trình dịch chuyển từng chiếc răng. Bạn có thể xem trước kết quả cuối cùng ngay tại buổi tư vấn.',
    details: [
      'Mô phỏng lộ trình dịch chuyển từng răng',
      'Xem trước kết quả 3D sau điều trị',
      'Tư vấn lựa chọn phương pháp phù hợp',
      'Báo giá minh bạch — không phát sinh ngoài',
    ],
  },
  {
    num: '03',
    title: 'Chuẩn bị răng & Gắn thiết bị',
    text: 'Làm sạch và nhổ răng khôn nếu cần (theo chỉ định). Gắn mắc cài hoặc giao khay trong suốt theo đúng kế hoạch điều trị đã được duyệt.',
    details: [
      'Vệ sinh răng miệng chuyên sâu',
      'Nhổ răng khôn hoặc răng thừa nếu cần',
      'Gắn mắc cài hoặc giao bộ khay Invisalign',
      'Hướng dẫn chăm sóc răng miệng khi niềng',
    ],
  },
  {
    num: '04',
    title: 'Theo dõi định kỳ — Chỉnh lực',
    text: 'Tái khám mỗi 4–6 tuần để bác sĩ chỉnh lực dây thun, kiểm tra tiến độ bằng scan 3D định kỳ và điều chỉnh kế hoạch nếu cần.',
    details: [
      'Tái khám mỗi 4–6 tuần',
      'Scan 3D theo dõi tiến độ định kỳ',
      'Chỉnh lực và thay dây cung',
      'Nhắc lịch tự động qua SMS/Zalo',
    ],
  },
  {
    num: '05',
    title: 'Tháo thiết bị & Hàm duy trì',
    text: 'Sau khi hoàn tất mục tiêu điều trị, bác sĩ tháo mắc cài và gắn hàm duy trì cố định + làm hàm tháo lắp. Hàm duy trì giữ răng không bị xô lệch trở lại.',
    details: [
      'Kiểm tra kết quả cuối — so sánh trước/sau 3D',
      'Tháo mắc cài — vệ sinh sạch men răng',
      'Gắn hàm duy trì cố định mặt trong',
      'Giao hàm duy trì tháo lắp kèm hướng dẫn',
    ],
  },
  {
    num: '06',
    title: 'Chăm sóc sau điều trị',
    text: 'Tái khám 3 tháng/lần trong năm đầu, 6 tháng/lần từ năm thứ 2. Bác sĩ theo dõi độ ổn định và can thiệp kịp thời nếu phát hiện dịch chuyển không mong muốn.',
    details: [
      'Tái khám theo lịch hẹn định kỳ',
      'Kiểm tra hàm duy trì và điều chỉnh nếu cần',
      'Tư vấn tẩy trắng răng sau niềng',
      'Hỗ trợ tư vấn qua Zalo bất cứ lúc nào',
    ],
  },
]

const TECH_ITEMS = [
  { icon: '◈', name: 'Máy scan iTero', desc: 'Scan 3D hàm răng không đau, độ chính xác 0.1mm — tiêu chuẩn Invisalign toàn cầu.' },
  { icon: '◉', name: 'Phần mềm ClinCheck 3D', desc: 'Mô phỏng và lập kế hoạch điều trị Invisalign — xem trước kết quả cuối cùng.' },
  { icon: '◆', name: 'X-quang kỹ thuật số', desc: 'Chụp phim toàn cảnh và cận cảnh kỹ thuật số — giảm 80% bức xạ so với phim thường.' },
  { icon: '◇', name: 'Phần mềm lập kế hoạch', desc: 'Phân tích cấu trúc xương hàm 3D, tính toán điểm tựa niềng và lực tối ưu.' },
]

export default function QuyTrinhNiengPage() {
  useDocumentMeta({
    title: 'Quy trình điều trị — Nha Khoa Chỉnh Nha Sài Gòn',
    description: '6 bước khoa học trong quy trình niềng răng: thăm khám & scan 3D, lập kế hoạch điều trị 3D, chuẩn bị răng, gắn thiết bị, tái khám định kỳ đến tháo niềng.',
  })
  return (
    <>
      <div className="cn-page-hero">
        <div className="wd-container">
          <div className="cn-ph-badge">Quy trình điều trị</div>
          <h1 className="cn-ph-title">6 bước <em>khoa học</em> đến nụ cười hoàn hảo</h1>
          <p className="cn-ph-sub">Mỗi ca điều trị đều được lập kế hoạch kỹ thuật số từ đầu đến cuối — không phỏng đoán, không bất ngờ.</p>
        </div>
      </div>

      <section className="sec-pad">
        <div className="wd-container">
          <div className="cn-quy-trinh-full">
            <div className="cn-process-steps" style={{ gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {STEPS_FULL.map((s, i) => (
                <div className="cn-step cn-step-full" key={s.num} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }} data-reveal data-delay={String(i % 2)}>
                  <div className="cn-step-num">{s.num}</div>
                  <div className="cn-step-title" style={{ color: 'var(--text)', fontSize: 17 }}>{s.title}</div>
                  <div className="cn-step-text" style={{ color: 'var(--text-2)', margin: '10px 0 14px' }}>{s.text}</div>
                  <div className="cn-step-full-details">
                    {s.details.map(d => (
                      <div key={d} className="cn-step-full-detail">{d}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section style={{ background: 'var(--surface)', padding: 'clamp(48px,6vw,80px) 0' }}>
        <div className="wd-container">
          <div style={{ textAlign: 'center', marginBottom: 40 }} data-reveal>
            <div className="cn-eyebrow">Công nghệ ứng dụng</div>
            <h2 className="cn-title">Thiết bị & Phần mềm <em>hiện đại nhất</em></h2>
          </div>
          <div className="row g-4">
            {TECH_ITEMS.map((t, i) => (
              <div className="col-12 col-sm-6 col-lg-3" key={t.name} data-reveal data-delay={String(i)}>
                <div className="cn-svc-card" style={{ height: '100%' }}>
                  <div className="cn-svc-icon" aria-hidden="true" style={{ marginBottom: 16 }}>
                    <span style={{ fontSize: 18 }}>{t.icon}</span>
                  </div>
                  <div className="cn-svc-title" style={{ fontSize: 15 }}>{t.name}</div>
                  <div className="cn-svc-text">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cn-cta">
        <div className="wd-container">
          <div className="cn-cta-inner" data-reveal>
            <div className="cn-eyebrow" style={{ justifyContent: 'center' }}>Bắt đầu</div>
            <h2 className="cn-title" style={{ color: '#fff' }}>Bắt đầu với <em>Scan 3D miễn phí</em></h2>
            <p className="cn-sub" style={{ color: 'rgba(255,255,255,.45)', margin: '0 auto 36px' }}>
              Đặt lịch thăm khám và scan 3D miễn phí — bác sĩ sẽ phân tích và lập kế hoạch điều trị ngay tại buổi đầu tiên.
            </p>
            <div className="cn-cta-btns">
              <Link to="/dat-lich" className="cn-btn cn-btn-primary">Đặt lịch scan 3D miễn phí</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
