'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function SuccessContent() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: 'var(--sans)' }}>
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--accent-light)', border: '2px solid var(--accent-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 32 }}>
          ✅
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-.5px', marginBottom: 10 }}>Đặt hàng thành công!</h1>
        {code && (
          <div style={{ display: 'inline-block', background: 'var(--accent-light)', border: '1px solid var(--accent-mid)', borderRadius: 8, padding: '6px 16px', marginBottom: 16 }}>
            <span style={{ fontSize: 12, color: 'var(--text-3)', marginRight: 6 }}>Mã đơn hàng:</span>
            <strong style={{ fontSize: 14, color: 'var(--accent)', letterSpacing: '.5px' }}>{code}</strong>
          </div>
        )}
        <p style={{ fontSize: 15, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.7, marginBottom: 32 }}>
          Chúng tôi đã nhận được yêu cầu của bạn và sẽ liên hệ qua Zalo/Email trong vòng <strong>2 giờ làm việc</strong> (8:00–18:00, Thứ 2–Thứ 7).
        </p>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px', marginBottom: 28, textAlign: 'left' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 14 }}>Các bước tiếp theo</div>
          {[
            { n: '1', text: 'Chúng tôi xác nhận đơn và tư vấn chi tiết qua Zalo' },
            { n: '2', text: 'Ký xác nhận yêu cầu (qua Zalo hoặc email)' },
            { n: '3', text: 'Tiến hành thiết kế và phát triển (3–7 ngày)' },
            { n: '4', text: 'Bàn giao, chỉnh sửa miễn phí trong 7 ngày' },
          ].map(step => (
            <div key={step.n} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent-light)', border: '1px solid var(--accent-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'var(--accent)', flexShrink: 0 }}>{step.n}</div>
              <div style={{ fontSize: 13, color: 'var(--text-2)', paddingTop: 3 }}>{step.text}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ padding: '11px 24px', borderRadius: 9, border: '1px solid var(--border)', background: 'transparent', fontSize: 13, color: 'var(--text-2)', textDecoration: 'none' }}>
            Về trang chủ
          </Link>
          <a href="https://zalo.me/0900000000" target="_blank" rel="noopener noreferrer"
            style={{ padding: '11px 24px', borderRadius: 9, background: '#0068FF', color: '#fff', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
            💬 Chat Zalo ngay
          </a>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  )
}
