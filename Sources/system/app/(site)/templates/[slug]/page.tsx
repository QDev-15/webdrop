import { notFound } from 'next/navigation'
import Link from 'next/link'
import { templates } from '@/data/templates'
import TemplateDetailClient from './TemplateDetailClient'

export function generateStaticParams() {
  return templates.map(t => ({ slug: t.slug }))
}

export default function TemplateDetailPage({ params }: { params: { slug: string } }) {
  const template = templates.find(t => t.slug === params.slug)
  if (!template) notFound()

  return (
    <>
      <nav className="wd-nav">
        <div className="wd-container nav-inner">
          <Link href="/" className="logo">web<span>drop</span>.vn</Link>
          <div className="breadcrumb-wd d-none d-md-flex">
            <Link href="/">Trang chủ</Link>
            <span className="bc-sep">›</span>
            <Link href="/#templates">Mẫu thiết kế</Link>
            <span className="bc-sep">›</span>
            <span style={{ color: 'var(--text)' }}>{template.name}</span>
          </div>
          <Link href={`/checkout?slug=${template.slug}`} className="btn-primary-wd">Đặt mua →</Link>
        </div>
      </nav>
      <TemplateDetailClient template={template} />
    </>
  )
}
