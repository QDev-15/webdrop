import Booking from '../components/Booking'

export default function DatLichPage() {
  return (
    <>
      <div className="cn-page-hero">
        <div className="wd-container">
          <div className="cn-ph-badge">Đặt lịch tư vấn</div>
          <h1 className="cn-ph-title">Bắt đầu hành trình <em>niềng răng</em></h1>
          <p className="cn-ph-sub">Scan 3D và tư vấn kế hoạch điều trị hoàn toàn miễn phí — bác sĩ chuyên khoa phân tích trực tiếp ngay buổi đầu.</p>
        </div>
      </div>
      <Booking />
    </>
  )
}
