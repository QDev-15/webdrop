import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TermsPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Điều khoản sử dụng — ${settings.site_name || 'Lam Trúc Illustration'}`,
    description: 'Điều khoản sử dụng dịch vụ và quyền sử dụng thương mại tác phẩm minh họa của Lam Trúc Illustration Studio.',
  })

  return (
    <>
      <section className="pmh-page-hero">
        <div className="pmh-container inner">
          <div className="pmh-crumb"><Link to="/">Trang chủ</Link> / Điều khoản sử dụng</div>
          <h1>Điều khoản <em>sử dụng</em></h1>
          <p>Điều khoản hợp tác dịch vụ minh họa và quyền sử dụng tác phẩm giữa Lam Trúc Illustration Studio và khách hàng.</p>
        </div>
      </section>

      <section className="pmh-sec">
        <div className="pmh-container">
          <div className="pmh-legal" data-reveal>
            <p className="updated">Cập nhật lần cuối: {settings.legal_updated || '20/08/2026'}</p>
            <div dangerouslySetInnerHTML={{ __html: settings.terms_content || '' }} />
          </div>
        </div>
      </section>
    </>
  )
}
