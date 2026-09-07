import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TermsPage() {
  useDocumentMeta({
    title: 'Điều khoản sử dụng — PIXEL. Blog Công Nghệ',
    description: 'Điều khoản sử dụng của PIXEL. — quy định về bản quyền nội dung, tính chính xác thông tin và trách nhiệm khi sử dụng blog.',
  })

  const { settings } = useSite()

  return (
    <>
      <header className="bcn-page-hero">
        <div className="bcn-page-hero-grid" aria-hidden="true"></div>
        <div className="bcn-container bcn-page-hero-inner">
          <div className="bcn-hero-label" style={{ marginBottom: 18 }}>Pháp lý</div>
          <h1>Điều khoản sử dụng</h1>
          <p>Cập nhật lần cuối: {settings.legal_updated}</p>
        </div>
      </header>

      <section className="bcn-sec">
        <div className="bcn-container" style={{ maxWidth: 820 }}>
          <div className="bcn-prose" data-reveal dangerouslySetInnerHTML={{ __html: settings.terms_content || '' }} />
        </div>
      </section>
    </>
  )
}
