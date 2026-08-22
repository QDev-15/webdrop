import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TermsPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Điều khoản dịch vụ — KHOA Design Studio`,
    description: 'Điều khoản dịch vụ của KHOA Design Studio — Trần Minh Khoa.',
  })

  return (
    <main>
      <section className="ptk-page-hero">
        <div className="ptk-container">
          <div className="ptk-crumb"><Link to="/">Trang chủ</Link> / Điều khoản dịch vụ</div>
          <h1 className="ptk-page-title">Điều khoản<br /><em>dịch vụ.</em></h1>
          <p className="ptk-page-sub">Cập nhật lần cuối: {settings.legal_updated || '—'}</p>
        </div>
      </section>

      <section className="ptk-sec">
        <div className="ptk-container" style={{ maxWidth: 820 }}>
          <div dangerouslySetInnerHTML={{ __html: settings.terms_content || '' }} />
        </div>
      </section>
    </main>
  )
}
