import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TermsPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Điều khoản sử dụng — ${settings.site_name || 'Tuấn Đặng Studio'}`,
    description: `Điều khoản sử dụng dịch vụ thiết kế kiến trúc của ${settings.site_name || 'Tuấn Đặng Studio'}.`,
  })

  return (
    <main>
      <section className="pkt-page-hero sec-light">
        <div className="pkt-container">
          <div className="pkt-eyebrow" data-reveal>Pháp lý</div>
          <h1 data-reveal>Điều khoản <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>sử dụng</em></h1>
          <p data-reveal data-reveal-d1>Cập nhật lần cuối: {settings.legal_updated || '—'}</p>
        </div>
      </section>

      <section className="sec-pad sec-light" style={{ paddingTop: 0 }}>
        <div
          className="pkt-container-narrow"
          data-reveal
          style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.95 }}
          dangerouslySetInnerHTML={{ __html: settings.terms_content || '' }}
        />
      </section>
    </main>
  )
}
