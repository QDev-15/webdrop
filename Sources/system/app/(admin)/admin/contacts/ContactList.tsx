'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Contact {
  id: number; name: string; email: string | null; phone: string | null
  subject: string | null; message: string; status: string; createdAt: Date | string
}

interface Props {
  contacts: Contact[]
  total: number; page: number; pages: number
  currentStatus: string
  counts: { all: number; new: number; read: number; replied: number }
}

const STATUS_CONFIG = {
  new:     { label: 'Mới', bg: '#eff6ff', text: '#1d4ed8' },
  read:    { label: 'Đã đọc', bg: 'var(--warm)', text: 'var(--text-2)' },
  replied: { label: 'Đã trả lời', bg: 'var(--accent-light)', text: 'var(--accent)' },
}

export default function ContactList({ contacts, total, page, pages, currentStatus, counts }: Props) {
  const router = useRouter()
  const [expanded, setExpanded] = useState<number | null>(null)
  const [updating, setUpdating] = useState<number | null>(null)
  const [updateError, setUpdateError] = useState('')

  async function updateStatus(id: number, status: string) {
    if (updating !== null) return  // guard: prevent concurrent updates
    setUpdating(id)
    setUpdateError('')
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) { setUpdateError('Lỗi cập nhật trạng thái'); return }
      router.refresh()
    } catch { setUpdateError('Lỗi kết nối') }
    finally { setUpdating(null) }
  }

  const filterStatuses = [
    { key: 'all', label: `Tất cả (${counts.all})` },
    { key: 'new', label: `Mới (${counts.new})` },
    { key: 'read', label: `Đã đọc (${counts.read})` },
    { key: 'replied', label: `Đã trả lời (${counts.replied})` },
  ]

  return (
    <>
      {/* Filter bar */}
      {updateError && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 14px', marginBottom: 12, fontSize: 13, color: '#dc2626' }}>{updateError}</div>}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {filterStatuses.map(s => (
          <a key={s.key} href={`/admin/contacts?status=${s.key}`}
            style={{ fontSize: 12, padding: '6px 14px', borderRadius: 20, textDecoration: 'none', border: `1px solid ${currentStatus === s.key ? 'var(--accent)' : 'var(--border)'}`, background: currentStatus === s.key ? 'var(--accent)' : 'transparent', color: currentStatus === s.key ? '#fff' : 'var(--text-2)', whiteSpace: 'nowrap' }}>
            {s.label}
          </a>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-2)' }}>Tổng: <strong>{total}</strong></span>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {contacts.length === 0 ? (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '56px 20px', textAlign: 'center', color: 'var(--text-3)', fontSize: 14 }}>
            Không có liên hệ nào
          </div>
        ) : contacts.map(c => {
          const sc = STATUS_CONFIG[c.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.read
          const dateStr = c.createdAt instanceof Date
            ? c.createdAt.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            : String(c.createdAt)
          const isOpen = expanded === c.id

          return (
            <div key={c.id} style={{ background: 'var(--surface)', border: `1px solid ${c.status === 'new' ? 'rgba(29,78,216,.2)' : 'var(--border)'}`, borderRadius: 12, overflow: 'hidden', transition: 'border-color .15s' }}>
              {/* Header row */}
              <div
                onClick={() => { setExpanded(isOpen ? null : c.id); if (!isOpen && c.status === 'new' && updating === null) updateStatus(c.id, 'read') }}
                style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
              >
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-light)', border: '1px solid var(--accent-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: 'var(--accent)', flexShrink: 0 }}>
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: c.status === 'new' ? 600 : 400, color: 'var(--text)' }}>{c.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 500, color: sc.text, background: sc.bg, padding: '2px 8px', borderRadius: 20 }}>{sc.label}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {c.phone && <span>📞 {c.phone}</span>}
                    {c.email && <span>✉️ {c.email}</span>}
                    {c.subject && <span style={{ color: 'var(--text-2)' }}>{c.subject}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{dateStr}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-3)', transition: 'transform .2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
                </div>
              </div>

              {/* Expanded content */}
              {isOpen && (
                <div style={{ borderTop: '1px solid var(--border-light)', padding: '16px 18px' }}>
                  <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.75, marginBottom: 16, whiteSpace: 'pre-wrap' }}>{c.message}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {c.phone && (
                      <a href={`tel:${c.phone}`}
                        style={{ fontSize: 12, padding: '7px 14px', borderRadius: 8, background: '#0068FF', color: '#fff', textDecoration: 'none', fontWeight: 500 }}>
                        📞 Gọi {c.phone}
                      </a>
                    )}
                    {c.email && (
                      <a href={`mailto:${c.email}`}
                        style={{ fontSize: 12, padding: '7px 14px', borderRadius: 8, border: '1px solid var(--border)', color: 'var(--text-2)', textDecoration: 'none' }}>
                        ✉️ Gửi email
                      </a>
                    )}
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                      {['new', 'read', 'replied'].map(s => (
                        <button key={s} onClick={() => updateStatus(c.id, s)} disabled={c.status === s || updating === c.id}
                          style={{ fontSize: 11, padding: '6px 12px', borderRadius: 6, border: `1px solid ${c.status === s ? 'var(--accent)' : 'var(--border)'}`, background: c.status === s ? 'var(--accent)' : 'transparent', color: c.status === s ? '#fff' : 'var(--text-2)', cursor: c.status === s ? 'default' : 'pointer', fontFamily: 'var(--sans)', opacity: updating === c.id ? .5 : 1 }}>
                          {STATUS_CONFIG[s as keyof typeof STATUS_CONFIG].label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: 'flex', gap: 6, marginTop: 16, justifyContent: 'center' }}>
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <a key={p} href={`/admin/contacts?page=${p}&status=${currentStatus}`}
              style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, fontSize: 13, textDecoration: 'none', background: p === page ? 'var(--accent)' : 'var(--surface)', color: p === page ? '#fff' : 'var(--text-2)', border: `1px solid ${p === page ? 'var(--accent)' : 'var(--border)'}` }}>
              {p}
            </a>
          ))}
        </div>
      )}
    </>
  )
}
