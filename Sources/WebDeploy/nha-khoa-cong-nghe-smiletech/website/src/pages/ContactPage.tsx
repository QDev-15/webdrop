import Contact from '../components/Contact'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function ContactPage() {
  useDocumentMeta({
    title: 'Liên hệ — SmileTech Nha Khoa Công Nghệ Cao',
    description: 'Gửi câu hỏi, yêu cầu tư vấn hoặc phản hồi tới SmileTech — đội ngũ sẽ phản hồi trong thời gian sớm nhất.',
  })

  return (
    <>
      <header className="st-page-header">
        <div className="wd-container">
          <div className="st-eyebrow st-center" data-reveal>Liên hệ</div>
          <h1 className="st-sec-title st-center" data-reveal>
            Liên hệ với <span className="st-grad-text">SmileTech</span>
          </h1>
          <p className="st-sec-sub st-center" data-reveal data-reveal-delay="1">
            Gửi câu hỏi, yêu cầu tư vấn hoặc phản hồi — đội ngũ SmileTech sẽ phản hồi trong thời gian sớm nhất trong giờ làm việc.
          </p>
          <div className="st-breadcrumb">
            <a href="/">Trang chủ</a> / <span>Liên hệ</span>
          </div>
        </div>
      </header>
      <section className="st-sec-pad" style={{ paddingTop: 0 }}>
        <Contact />
      </section>
    </>
  )
}
