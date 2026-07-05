import Contact from '../components/Contact'

export default function ContactPage() {
  return (
    <>
      <header className="at-page-hero">
        <div className="wd-container">
          <div className="at-ph-eyebrow">
            <span className="at-ph-line" aria-hidden="true" />
            Liên hệ
          </div>
          <h1 className="at-ph-title">
            Chúng tôi luôn<br />
            <em>sẵn lắng nghe</em>
          </h1>
          <p className="at-ph-sub">
            Có câu hỏi hay muốn đặt lịch tư vấn? Liên hệ với chúng tôi qua điện thoại, email, hoặc Zalo.
          </p>
        </div>
      </header>

      <section className="at-sec-pad">
        <div className="wd-container">
          <Contact />
        </div>
      </section>
    </>
  )
}
