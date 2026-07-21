import Contact from '../components/Contact'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function ContactPage() {
  const { settings } = useSite()
  useDocumentMeta({ title: `Liên hệ — ${settings.site_name || 'Nha khoa'}`, description: `Liên hệ ${settings.site_name || 'nha khoa'} để được tư vấn Implant.` })
  return (
    <>
      {/* Page Header */}
      <section className="ft-page-header">
        <div className="wd-container">
          <div className="ft-ph-inner">
            <div className="ft-eyebrow ft-eyebrow-light">Liên hệ</div>
            <h1 className="ft-ph-title">Chúng tôi <em>luôn sẵn sàng</em></h1>
            <p className="ft-ph-sub">Liên hệ trực tiếp qua điện thoại hoặc gửi tin nhắn — đội ngũ chúng tôi sẽ phản hồi trong vòng 24 giờ.</p>
          </div>
        </div>
      </section>

      <section className="sec-pad">
        <div className="wd-container">
          <Contact />
        </div>
      </section>
    </>
  )
}
