import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PrivacyPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Chính sách bảo mật — ${settings.site_name || 'Đăng Photography'}`,
    description: `Chính sách bảo mật của ${settings.site_name || 'Đăng Photography'} — cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân, hình ảnh của khách hàng.`,
  })

  return (
    <main>
      <section className="pna-page-hero">
        <div className="wd-container">
          <div className="pna-ph-tag" data-reveal>Pháp lý</div>
          <h1 className="pna-ph-title" data-reveal>Chính sách <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>bảo mật</em></h1>
        </div>
      </section>

      <section className="sec-pad" style={{ background: 'var(--surface)' }}>
        <div className="wd-container" style={{ maxWidth: 800 }}>
          <div className="pna-legal-body" data-reveal>
            <p className="pna-updated">Cập nhật lần cuối: {settings.legal_updated || '01/07/2026'}</p>
            <div dangerouslySetInnerHTML={{ __html: settings.privacy_content || '' }} />
          </div>
        </div>
      </section>
    </main>
  )
}
