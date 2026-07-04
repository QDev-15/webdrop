import { Link } from 'react-router-dom'

const STEPS = [
  { num: '01', title: 'Thăm khám & Scan 3D', text: 'Chụp phim kỹ thuật số, scan hàm không đau — cho kết quả tức thì, chính xác tuyệt đối. Phân tích cấu trúc xương hàm và khớp cắn.' },
  { num: '02', title: 'Lập kế hoạch điều trị 3D', text: 'Mô phỏng lộ trình dịch chuyển từng răng bằng phần mềm 3D. Xem trước kết quả cuối cùng ngay tại buổi tư vấn đầu tiên.' },
  { num: '03', title: 'Gắn thiết bị chỉnh nha', text: 'Bác sĩ chuyên khoa thực hiện gắn mắc cài hoặc khay trong suốt theo đúng kế hoạch. Hướng dẫn chăm sóc chi tiết.' },
  { num: '04', title: 'Theo dõi & Hoàn tất', text: 'Tái khám định kỳ 4–6 tuần để điều chỉnh lực và kiểm tra tiến độ. Kết thúc điều trị: đeo hàm duy trì để giữ kết quả dài lâu.' },
]

export default function About() {
  return (
    <section className="cn-process sec-pad">
      <div className="wd-container">
        <div style={{ textAlign: 'center', marginBottom: 52 }} data-reveal>
          <div className="cn-eyebrow">Quy trình điều trị</div>
          <h2 className="cn-title" style={{ color: '#fff' }}>Từ tư vấn đến <em>nụ cười hoàn hảo</em></h2>
          <p className="cn-sub" style={{ color: 'rgba(255,255,255,.45)', margin: '0 auto' }}>
            4 bước khoa học — theo dõi kỹ thuật số từng giai đoạn, không phỏng đoán.
          </p>
        </div>
        <div className="cn-process-steps">
          {STEPS.map((s, i) => (
            <div className="cn-step" key={s.num} data-reveal data-delay={String(i % 4)}>
              <div className="cn-step-num">{s.num}</div>
              <div className="cn-step-title">{s.title}</div>
              <div className="cn-step-text">{s.text}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 44 }} data-reveal>
          <Link to="/quy-trinh-nieng" className="cn-btn cn-btn-outline-lt">
            Xem quy trình chi tiết →
          </Link>
        </div>
      </div>
    </section>
  )
}
