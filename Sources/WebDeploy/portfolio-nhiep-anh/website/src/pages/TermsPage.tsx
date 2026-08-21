import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TermsPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Điều khoản dịch vụ — ${settings.site_name || 'Đăng Photography'}`,
    description: `Điều khoản dịch vụ của ${settings.site_name || 'Đăng Photography'} — quy định về đặt lịch, thanh toán, huỷ/dời lịch và bản quyền hình ảnh chụp ảnh cưới.`,
  })

  return (
    <main>
      <section className="pna-page-hero">
        <div className="wd-container">
          <div className="pna-ph-tag" data-reveal>Pháp lý</div>
          <h1 className="pna-ph-title" data-reveal>Điều khoản <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>dịch vụ</em></h1>
        </div>
      </section>

      <section className="sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="wd-container" style={{ maxWidth: 800 }}>
          <div className="pna-legal-body" data-reveal>
            <p className="pna-updated">Cập nhật lần cuối: {settings.legal_updated || '01/07/2026'}</p>
            <div dangerouslySetInnerHTML={{ __html: settings.terms_content || '' }} />
          </div>
        </div>
      </section>
    </main>
  )
}
