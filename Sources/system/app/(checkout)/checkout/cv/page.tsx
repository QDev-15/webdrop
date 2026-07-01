import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import CvCheckoutClient from './CvCheckoutClient'

export const metadata: Metadata = {
  title: 'Đăng ký CV Builder — webdrop.store',
  description: 'Tạo CV online chuyên nghiệp. 5 mẫu thiết kế, link chia sẻ, export PDF/DOCX. Chỉ 59,000đ trọn gói.',
}

export default function CvCheckoutPage() {
  return (
    <>
      <nav style={{ background: 'var(--dark)', borderBottom: '1px solid rgba(255,255,255,.06)', position: 'sticky', top: 0, zIndex: 200 }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 clamp(16px,4vw,48px)', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" className="logo">web<span>drop</span>.store</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/cvs" style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', textDecoration: 'none' }}>← Xem mẫu CV</Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,.4)' }}>
              <span>🔒</span> Thanh toán bảo mật
            </div>
          </div>
        </div>
      </nav>
      <Suspense fallback={<div className="checkout-body" style={{ paddingTop: 40, textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div>}>
        <CvCheckoutClient />
      </Suspense>
    </>
  )
}
