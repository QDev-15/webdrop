import Contact from '../components/Contact'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function ContactPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Liên hệ — ${settings.site_name || 'Tâm Thư Massage'}`,
    description: 'Liên hệ Tâm Thư Massage để được tư vấn miễn phí về liệu trình massage trị liệu phù hợp với tình trạng sức khỏe của bạn.',
  })

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
