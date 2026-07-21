import Contact from '../components/Contact'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function ContactPage() {
  useDocumentMeta({ title: 'Liên hệ — Nha Khoa An Tâm', description: 'Liên hệ Nha Khoa An Tâm để được tư vấn và đặt lịch khám.' })
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
