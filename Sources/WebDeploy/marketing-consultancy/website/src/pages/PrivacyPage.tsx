import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PrivacyPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Chính sách bảo mật — ${settings.site_name || 'Markco'}`,
    description: 'Chính sách bảo mật của ' + (settings.site_name || 'Markco'),
  })

  return (
    <>
      <section className="page-hero">
        <div className="wd-container">
          <h1 className="ph-title">Chính sách <em>Bảo mật</em></h1>
          <p className="ph-sub">Cập nhật lần cuối: Tháng 1 năm 2024</p>
        </div>
      </section>

      <section className="mc-sec-pad">
        <div className="wd-container mc-legal-content" style={{ maxWidth: 800 }}
          dangerouslySetInnerHTML={{ __html: settings.privacy_content || '' }}
        />
      </section>
    </>
  )
}
