import { Suspense } from 'react'
import Link from 'next/link'
import CheckoutClient from './CheckoutClient'
import { prisma } from '@/lib/prisma'

const FALLBACK_PLANS = [
  { id: 'starter', label: 'Starter', price: 1200000, desc: 'Source code + tài liệu hướng dẫn' },
  { id: 'standard', label: 'Standard', price: 2500000, desc: 'Cài đặt trọn gói · Hosting · Domain', hot: true },
  { id: 'premium', label: 'Premium', price: 12000000, desc: 'Thiết kế riêng theo yêu cầu' },
]

export default async function CheckoutPage() {
  let plans = FALLBACK_PLANS
  try {
    const pkgs = await prisma.servicePackage.findMany({
      where: { status: 'published' }, orderBy: { sortOrder: 'asc' },
    })
    if (pkgs.length > 0) {
      plans = pkgs.map((p, i) => ({
        id: p.code.toLowerCase().replace('goi_', ''),
        label: p.name.replace('Gói A — ', '').replace('Gói B — ', '').replace('Gói C — ', ''),
        price: Number(p.priceFrom || 0),
        desc: p.description || '',
        hot: i === 1,
      }))
    }
  } catch { /* fallback */ }

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
        <CheckoutClient plans={plans} />
      </Suspense>
    </>
  )
}
