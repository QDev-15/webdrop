import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PrivacyPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Chính sách bảo mật — ${settings.site_name || 'Cỏ Non Blog'}`,
    description: 'Chính sách bảo mật của Cỏ Non Blog — cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.',
  })

  return (
    <main>
      <section className="bmb-sec">
        <div className="bmb-container bmb-legal-body">
          <div className="bmb-eyebrow">🔒 Pháp lý</div>
          <h1 className="bmb-sec-title">Chính sách bảo mật</h1>
          <p className="bmb-sec-sub">Cập nhật lần cuối: {settings.legal_updated || ''}. {settings.site_name || 'Cỏ Non Blog'} tôn trọng quyền riêng tư của bạn — chính sách này giải thích rõ chúng tôi thu thập, sử dụng và bảo vệ thông tin như thế nào.</p>
          <div dangerouslySetInnerHTML={{ __html: settings.privacy_content || '' }} />
        </div>
      </section>
    </main>
  )
}
