import Contact from '../components/Contact'

export default function ContactPage() {
  return (
    <>
      <section className="ps-page-hero">
        <div className="wd-container">
          <div className="reveal">
            <div className="ps-page-hero-label">Liên hệ</div>
            <h1 className="ps-page-hero-title">Liên hệ với studio.</h1>
            <p className="ps-page-hero-sub">Câu hỏi về lớp học, thiết bị Reformer hay muốn đặt buổi tư vấn cá nhân? Đội ngũ của chúng tôi sẵn sàng hỗ trợ.</p>
          </div>
        </div>
      </section>
      <Contact />
    </>
  )
}
