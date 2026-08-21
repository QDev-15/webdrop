import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PrivacyPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Chính sách bảo mật — ${settings.site_name || 'Tuấn Đặng Studio'}`,
    description: `Chính sách bảo mật thông tin khách hàng của ${settings.site_name || 'Tuấn Đặng Studio'}.`,
  })

  return (
    <main>
      <section className="pkt-page-hero sec-light">
        <div className="pkt-container">
          <div className="pkt-eyebrow" data-reveal>Pháp lý</div>
          <h1 data-reveal>Chính sách <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>bảo mật</em></h1>
          <p data-reveal data-reveal-d1>Cập nhật lần cuối: {settings.legal_updated || '—'}</p>
        </div>
      </section>

      <section className="sec-pad sec-light" style={{ paddingTop: 0 }}>
        <div
          className="pkt-container-narrow"
          data-reveal
          style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.95 }}
          dangerouslySetInnerHTML={{ __html: settings.privacy_content || '' }}
        />
      </section>
    </main>
  )
}
