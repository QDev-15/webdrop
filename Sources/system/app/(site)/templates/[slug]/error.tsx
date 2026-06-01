'use client'
import Link from 'next/link'
import { useEffect } from 'react'

export default function TemplateError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error('[template-detail]', error) }, [error])

  return (
    <div style={{ paddingTop: 62 }}>
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 420 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 10 }}>Không thể tải template</h2>
          <p style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.7, marginBottom: 24 }}>
            Đã xảy ra lỗi. Vui lòng thử lại hoặc quay về danh sách mẫu.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/templates" style={{ padding: '10px 22px', borderRadius: 9, border: '1px solid var(--border)', color: 'var(--text-2)', fontSize: 13, textDecoration: 'none' }}>
              ← Thư viện mẫu
            </Link>
            <button onClick={reset} style={{ padding: '10px 22px', borderRadius: 9, background: 'var(--accent)', color: '#fff', border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--sans)' }}>
              Thử lại
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
