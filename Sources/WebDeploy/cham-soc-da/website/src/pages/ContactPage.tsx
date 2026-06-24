import Contact from '../components/Contact'

export default function ContactPage() {
  return (
    <>
      <div className="csd-page-hero" style={{ paddingTop: 'calc(68px + clamp(40px,6vw,72px))' }}>
        <div className="wd-container">
          <div className="csd-ph-tag">Liên hệ</div>
          <h1 className="csd-ph-title">Liên hệ với<br /><em>DermaCare Clinic</em></h1>
          <p className="csd-ph-sub">Đặt câu hỏi, nhận tư vấn hoặc tìm đường đến phòng khám — chúng tôi luôn sẵn sàng hỗ trợ bạn.</p>
        </div>
      </div>
      <section className="csd-sec">
        <div className="wd-container">
          <Contact />
        </div>
      </section>
    </>
  )
}
