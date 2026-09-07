import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PrivacyPage() {
  useDocumentMeta({
    title: 'Chính sách bảo mật — PIXEL. Blog Công Nghệ',
    description: 'Chính sách bảo mật của PIXEL. — cách chúng tôi thu thập, sử dụng và bảo vệ thông tin độc giả.',
  })

  const { settings } = useSite()

  return (
    <>
      <header className="bcn-page-hero">
        <div className="bcn-page-hero-grid" aria-hidden="true"></div>
        <div className="bcn-container bcn-page-hero-inner">
          <div className="bcn-hero-label" style={{ marginBottom: 18 }}>Pháp lý</div>
          <h1>Chính sách bảo mật</h1>
          <p>Cập nhật lần cuối: {settings.legal_updated}</p>
        </div>
      </header>

      <section className="bcn-sec">
        <div className="bcn-container" style={{ maxWidth: 820 }}>
          <div className="bcn-prose" data-reveal dangerouslySetInnerHTML={{ __html: settings.privacy_content || '' }} />
        </div>
      </section>
    </>
  )
}
