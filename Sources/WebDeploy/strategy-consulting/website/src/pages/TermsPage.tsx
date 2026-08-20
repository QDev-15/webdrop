import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TermsPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Điều khoản sử dụng — ${settings.site_name || 'Strategy & Co'}`,
    description: 'Điều khoản sử dụng của ' + (settings.site_name || 'Strategy & Co'),
  })

  return (
    <>
      <section className="page-hero">
        <div className="wd-container">
          <h1 className="ph-title">Điều khoản <em>Sử dụng</em></h1>
        </div>
      </section>

      <section className="sc-sec-pad">
        <div className="wd-container sc-legal-content" style={{ maxWidth: 800 }}
          dangerouslySetInnerHTML={{ __html: settings.terms_content || '' }}
        />
      </section>
    </>
  )
}
