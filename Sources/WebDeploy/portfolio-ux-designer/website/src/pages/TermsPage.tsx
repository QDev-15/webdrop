import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TermsPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Điều khoản sử dụng — ${settings.site_name || 'Đỗ Khánh Linh'}`,
    description: `Điều khoản sử dụng dịch vụ của ${settings.site_name || 'Đỗ Khánh Linh'}.`,
  })

  return (
    <main>
      <section className="pux-page-hero" style={{ padding: '150px 0 60px' }}>
        <span className="blob blob-a"></span>
        <span className="blob blob-b"></span>
        <div className="wd-container">
          <div className="pux-crumb">Trang chủ / Điều khoản sử dụng</div>
          <div className="eyebrow eyebrow-light" data-reveal>Pháp lý</div>
          <h1 className="sec-title on-dark" style={{ maxWidth: 640 }} data-reveal>Điều khoản <em>sử dụng.</em></h1>
          <p className="sec-sub on-dark" data-reveal data-reveal-d1>Cập nhật lần cuối: {settings.legal_updated || '—'}</p>
        </div>
      </section>

      <section className="sec-pad">
        <div className="wd-container">
          <div className="row justify-content-center">
            <div
              className="col-lg-8"
              data-reveal
              style={{ fontSize: 14.5, lineHeight: 1.85, color: 'var(--text-2)' }}
              dangerouslySetInnerHTML={{ __html: settings.terms_content || '' }}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
