import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PrivacyPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Chính sách bảo mật — ${settings.site_name || 'Digital Innovation'}`,
    description: 'Chính sách bảo mật của ' + (settings.site_name || 'Digital Innovation'),
  })

  return (
    <>
      <section className="page-hero">
        <div className="wd-container">
          <h1 className="ph-title">Chính sách <em>Bảo mật</em></h1>
        </div>
      </section>

      <section className="di-sec-pad">
        <div className="wd-container di-legal-content" style={{ maxWidth: 800 }}
          dangerouslySetInnerHTML={{ __html: settings.privacy_content || '' }}
        />
      </section>
    </>
  )
}
