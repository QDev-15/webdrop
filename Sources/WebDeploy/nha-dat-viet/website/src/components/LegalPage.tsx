import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

export default function LegalPage({ title, breadcrumb, banner, children }: { title: string; breadcrumb: string; banner?: string; children: ReactNode }) {
  return (
    <>
      <section className="ndv-page-header" style={banner ? { backgroundImage: `url('${banner}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
        <div className="ndv-container ndv-page-header-in">
          <div className="ndv-breadcrumb"><Link to="/">Trang chủ</Link> / <span>{breadcrumb}</span></div>
          <h1>{title}</h1>
        </div>
      </section>
      <section className="ndv-sec">
        <div className="ndv-container">
          <div className="ndv-legal-content">
            <p className="ndv-legal-updated">Cập nhật lần cuối: 01/08/2026</p>
            {children}
          </div>
        </div>
      </section>
    </>
  )
}
