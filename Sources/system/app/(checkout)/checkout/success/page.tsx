'use client'
import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function DownloadButton({ href, label, icon, sub }: { href: string; label: string; icon: string; sub: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')

  function handleClick() {
    setState('loading')
    // Đặt lại sau 3s để có thể bấm lại nếu cần
    setTimeout(() => setState('done'), 3000)
  }

  return (
    <a
      href={href}
      download
      onClick={handleClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        background: state === 'done' ? 'var(--accent)' : 'var(--surface)',
        border: `1.5px solid ${state === 'done' ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 12, padding: '16px 20px',
        textDecoration: 'none', color: state === 'done' ? '#fff' : 'var(--text)',
        transition: 'all .2s', cursor: state === 'loading' ? 'wait' : 'pointer',
      }}
    >
      <span style={{ fontSize: 28, flexShrink: 0 }}>{state === 'done' ? '✓' : icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{label}</div>
        <div style={{ fontSize: 12, opacity: .65, marginTop: 2 }}>{state === 'loading' ? 'Đang chuẩn bị...' : state === 'done' ? 'Đã tải — nhấn lại nếu cần' : sub}</div>
      </div>
      <span style={{ fontSize: 18 }}>{state === 'loading' ? '⏳' : '↓'}</span>
    </a>
  )
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const type  = searchParams.get('type')  ?? 'template'
  const slug  = searchParams.get('slug')  ?? ''

  const isWebsite = type === 'website'
  const t = encodeURIComponent(token)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: 'var(--sans)' }}>
      <div style={{ maxWidth: 520, width: '100%' }}>

        {/* Success header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--accent-light)', border: '2px solid var(--accent-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 32 }}>
            ✅
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.5px', marginBottom: 8 }}>Thanh toán thành công!</h1>
          <p style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.7, maxWidth: 400, margin: '0 auto' }}>
            {isWebsite
              ? 'Tải xuống 2 file bên dưới, sau đó làm theo hướng dẫn để cài lên hosting.'
              : 'Tải xuống file template bên dưới và mở thẳng bằng trình duyệt.'}
          </p>
        </div>

        {/* Download section */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px', marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 16 }}>
            Tải xuống ngay
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {isWebsite ? (
              <>
                <DownloadButton
                  href={`/api/download?token=${t}&file=web`}
                  icon="🌐"
                  label="web.zip — Website public"
                  sub="React SPA + PHP API + SQLite · Upload lên public_html"
                />
                <DownloadButton
                  href={`/api/download?token=${t}&file=admin`}
                  icon="⚙"
                  label="admin.zip — Trang quản trị"
                  sub="React SPA + PHP API · Upload lên public_html/admin"
                />
              </>
            ) : (
              <DownloadButton
                href={`/api/download?token=${t}&file=template`}
                icon="📦"
                label={`${slug || 'template'}.zip — File template`}
                sub="HTML + CSS + JS · Mở thẳng bằng trình duyệt"
              />
            )}
          </div>

          {isWebsite && (
            <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--accent-light)', borderRadius: 8, fontSize: 12.5, color: 'var(--accent)', lineHeight: 1.7 }}>
              📖 Đọc file <strong>HUONG-DAN-CAI-DAT.html</strong> trong admin.zip trước khi cài đặt
            </div>
          )}

          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-3)', lineHeight: 1.6 }}>
            ⏱ Link tải có hiệu lực <strong>72 giờ</strong> · Dùng được tối đa <strong>5 lần</strong> · Link đã gửi qua email
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ padding: '10px 22px', borderRadius: 9, border: '1px solid var(--border)', background: 'transparent', fontSize: 13, color: 'var(--text-2)', textDecoration: 'none' }}>
            Về trang chủ
          </Link>
          <a href="https://zalo.me/0988632841" target="_blank" rel="noopener noreferrer"
            style={{ padding: '10px 22px', borderRadius: 9, background: '#0068FF', color: '#fff', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
            💬 Chat Zalo hỗ trợ
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
