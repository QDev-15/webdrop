import Contact from '../components/Contact'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function ContactPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Liên hệ — ${settings.site_name}`,
    description: 'Liên hệ với studio để được tư vấn về lớp học, thiết bị Reformer hoặc đặt buổi tư vấn cá nhân.',
  })

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
