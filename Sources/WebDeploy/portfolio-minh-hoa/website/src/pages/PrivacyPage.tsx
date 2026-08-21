import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PrivacyPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Chính sách bảo mật — ${settings.site_name || 'Lam Trúc Illustration'}`,
    description: 'Chính sách bảo mật thông tin khách hàng của Lam Trúc Illustration Studio.',
  })

  return (
    <>
      <section className="pmh-page-hero">
        <div className="pmh-container inner">
          <div className="pmh-crumb"><Link to="/">Trang chủ</Link> / Chính sách bảo mật</div>
          <h1>Chính sách <em>bảo mật</em></h1>
          <p>Cách Lam Trúc Illustration Studio thu thập, sử dụng và bảo vệ thông tin của bạn.</p>
        </div>
      </section>

      <section className="pmh-sec">
        <div className="pmh-container">
          <div className="pmh-legal" data-reveal>
            <p className="updated">Cập nhật lần cuối: {settings.legal_updated || '20/08/2026'}</p>
            <div dangerouslySetInnerHTML={{ __html: settings.privacy_content || '' }} />
          </div>
        </div>
      </section>
    </>
  )
}
