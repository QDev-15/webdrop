import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PrivacyPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Chính sách bảo mật — KHOA Design Studio`,
    description: 'Chính sách bảo mật thông tin khách hàng của KHOA Design Studio — Trần Minh Khoa.',
  })

  return (
    <main>
      <section className="ptk-page-hero">
        <div className="ptk-container">
          <div className="ptk-crumb"><Link to="/">Trang chủ</Link> / Chính sách bảo mật</div>
          <h1 className="ptk-page-title">Chính sách<br /><em>bảo mật.</em></h1>
          <p className="ptk-page-sub">Cập nhật lần cuối: {settings.legal_updated || '—'}</p>
        </div>
      </section>

      <section className="ptk-sec">
        <div className="ptk-container" style={{ maxWidth: 820 }}>
          <div dangerouslySetInnerHTML={{ __html: settings.privacy_content || '' }} />
        </div>
      </section>
    </main>
  )
}
