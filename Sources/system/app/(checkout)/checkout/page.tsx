import { Suspense } from 'react'
import Link from 'next/link'
import CheckoutClient from './CheckoutClient'
import { prisma } from '@/lib/prisma'

async function getTemplateWebsiteFlag(slug: string): Promise<boolean> {
  if (!slug) return false
  try {
    const t = await prisma.template.findFirst({ where: { slug }, select: { hasWebsite: true } })
    return t?.hasWebsite ?? false
  } catch {
    return false
  }
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>
}) {
  const { slug = '' } = await searchParams
  const hasWebsite = await getTemplateWebsiteFlag(slug)

  return (
    <>
      <nav style={{ background: 'var(--dark)', borderBottom: '1px solid rgba(255,255,255,.06)', position: 'sticky', top: 0, zIndex: 200 }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 clamp(16px,4vw,48px)', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" className="logo">web<span>drop</span>.vn</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,.4)' }}>
            <span>🔒</span> Thanh toán bảo mật
          </div>
        </div>
      </nav>
      <Suspense fallback={<div className="checkout-body" style={{ paddingTop: 40, textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div>}>
        <CheckoutClient hasWebsite={hasWebsite} />
      </Suspense>
    </>
  )
}
