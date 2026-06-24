import Contact from '../components/Contact'

export default function ContactPage() {
  return (
    <>
      {/* Page hero */}
      <div className="mrt-page-hero">
        <div className="wd-container">
          <div className="mrt-ph-label">Liên hệ</div>
          <h1 className="mrt-ph-title">Chúng tôi luôn <em>sẵn sàng</em><br />phục vụ bạn</h1>
          <p className="mrt-ph-sub">
            Hãy liên hệ để được tư vấn miễn phí về liệu trình phù hợp với tình trạng sức khỏe của bạn.
          </p>
        </div>
      </div>
      <Contact />
    </>
  )
}
