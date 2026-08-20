import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TermsPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Điều khoản sử dụng — ${settings.site_name || 'Markco'}`,
    description: 'Điều khoản sử dụng của ' + (settings.site_name || 'Markco'),
  })

  return (
    <>
      <section className="page-hero">
        <div className="wd-container">
          <h1 className="ph-title">Điều khoản <em>Sử dụng</em></h1>
          <p className="ph-sub">Cập nhật lần cuối: Tháng 1 năm 2024</p>
        </div>
      </section>

      <section className="mc-sec-pad">
        <div className="wd-container mc-legal-content" style={{ maxWidth: 800 }}
          dangerouslySetInnerHTML={{ __html: settings.terms_content || '' }}
        />
      </section>
    </>
  )
}
