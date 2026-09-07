import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TermsPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Điều khoản sử dụng — ${settings.site_name || 'Cỏ Non Blog'}`,
    description: `Điều khoản sử dụng của ${settings.site_name || 'Cỏ Non Blog'} — quy định về bản quyền nội dung, bình luận và trách nhiệm khi truy cập blog.`,
  })

  return (
    <main>
      <section className="bmb-sec">
        <div className="bmb-container bmb-legal-body">
          <div className="bmb-eyebrow">📄 Pháp lý</div>
          <h1 className="bmb-sec-title">Điều khoản sử dụng</h1>
          <p className="bmb-sec-sub">Cập nhật lần cuối: {settings.legal_updated || ''}. Khi truy cập và sử dụng {settings.site_name || 'Cỏ Non Blog'}, bạn đồng ý với các điều khoản dưới đây.</p>
          <div dangerouslySetInnerHTML={{ __html: settings.terms_content || '' }} />
        </div>
      </section>
    </main>
  )
}
