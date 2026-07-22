import Services from '../components/Services'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function ServicesPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Lớp học & Dịch vụ — ${settings.site_name}`,
    description: 'Chọn lớp pilates phù hợp với bạn — từ mat pilates, reformer đến clinical pilates, đủ mọi trình độ.',
  })

  return (
    <>
      <section className="ps-page-hero">
        <div className="wd-container">
          <div className="reveal">
            <div className="ps-page-hero-label">Lớp học & Dịch vụ</div>
            <h1 className="ps-page-hero-title">Chọn lớp<br />phù hợp với bạn.</h1>
            <p className="ps-page-hero-sub">Từ cơ bản đến nâng cao — chúng tôi có đủ lớp học cho mọi trình độ, mọi nhu cầu.</p>
          </div>
        </div>
      </section>
      <Services />
    </>
  )
}
