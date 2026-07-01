'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

interface DiscountCode {
  id: number
  code: string
  type: 'percent' | 'fixed'
  value: number
  maxUses: number | null
  usedCount: number
  expiresAt: string | null
  isActive: boolean
  note: string | null
  createdAt: string
}

function fmtPrice(n: number) { return n.toLocaleString('vi-VN') + 'đ' }
function fmtDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: '#6b6760', display: 'block', marginBottom: 5 }
const inputStyle: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1px solid #e8e5df', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }

export default function DiscountsPage() {
  const [codes, setCodes] = useState<DiscountCode[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const [form, setForm] = useState({
    code: '', type: 'percent', value: '', maxUses: '', expiresAt: '', note: '',
  })

  useEffect(() => { loadCodes() }, [])

  async function loadCodes() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/discounts')
      const data = await res.json()
      if (res.ok) setCodes(data.codes)
    } finally { setLoading(false) }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!form.code.trim() || !form.value) { setSaveError('Nhập code và giá trị giảm'); return }
    setSaving(true); setSaveError('')
    try {
      const res = await fetch('/api/admin/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: form.code.trim().toUpperCase(),
          type: form.type,
          value: Number(form.value),
          maxUses: form.maxUses ? Number(form.maxUses) : null,
          expiresAt: form.expiresAt || null,
          note: form.note || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setSaveError(data.error || 'Lỗi tạo mã'); return }
      setShowCreate(false)
      setForm({ code: '', type: 'percent', value: '', maxUses: '', expiresAt: '', note: '' })
      await loadCodes()
    } finally { setSaving(false) }
  }

  async function toggleActive(id: number, current: boolean) {
    await fetch(`/api/admin/discounts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !current }),
    })
    await loadCodes()
  }

  async function deleteCode(id: number, code: string) {
    if (!confirm(`Xóa mã ${code}?`)) return
    await fetch(`/api/admin/discounts/${id}`, { method: 'DELETE' })
    await loadCodes()
  }

  return (
    <AdminLayout title="Mã khuyến mại">
      <div style={{ padding: '28px 32px', maxWidth: 900 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1917', margin: 0 }}>Mã khuyến mại</h1>
            <p style={{ fontSize: 13, color: '#6b6760', margin: '4px 0 0' }}>Quản lý mã giảm giá cho template và CV Builder</p>
          </div>
          <button
            onClick={() => { setShowCreate(true); setSaveError('') }}
            style={{ padding: '9px 18px', background: '#1a6b52', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            + Tạo mã mới
          </button>
        </div>

        {/* Create form */}
        {showCreate && (
          <div style={{ background: '#fff', border: '1px solid #e8e5df', borderRadius: 12, padding: '24px', marginBottom: 28 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1917', marginBottom: 20 }}>Tạo mã mới</div>
            <form onSubmit={handleCreate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Mã <span style={{ color: '#e24b4a' }}>*</span></label>
                  <input style={inputStyle} placeholder="VD: SALE50" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} />
                </div>
                <div>
                  <label style={labelStyle}>Loại <span style={{ color: '#e24b4a' }}>*</span></label>
                  <select style={inputStyle} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    <option value="percent">Phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định (đ)</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Giá trị <span style={{ color: '#e24b4a' }}>*</span></label>
                  <input style={inputStyle} type="number" min={1} max={form.type === 'percent' ? 100 : undefined}
                    placeholder={form.type === 'percent' ? 'VD: 50 (= 50%)' : 'VD: 59000'} value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Số lần dùng tối đa</label>
                  <input style={inputStyle} type="number" min={1} placeholder="Không giới hạn" value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Ngày hết hạn</label>
                  <input style={inputStyle} type="date" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Ghi chú</label>
                  <input style={inputStyle} placeholder="VD: Dành cho beta testers" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
                </div>
              </div>
              {saveError && <div style={{ fontSize: 12, color: '#dc2626', marginBottom: 12 }}>{saveError}</div>}
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" disabled={saving}
                  style={{ padding: '9px 20px', background: '#1a6b52', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: saving ? .7 : 1 }}>
                  {saving ? 'Đang tạo...' : '✓ Tạo mã'}
                </button>
                <button type="button" onClick={() => setShowCreate(false)}
                  style={{ padding: '9px 16px', background: '#f5f0e8', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div style={{ background: '#fff', border: '1px solid #e8e5df', borderRadius: 12, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#a09d97', fontSize: 13 }}>Đang tải...</div>
          ) : codes.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#a09d97', fontSize: 13 }}>
              Chưa có mã nào.
              <button onClick={() => setShowCreate(true)} style={{ background: 'none', border: 'none', color: '#1a6b52', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, marginLeft: 4 }}>Tạo mã đầu tiên →</button>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e8e5df', background: '#faf9f7' }}>
                  {['Mã', 'Giảm', 'Đã dùng', 'Hết hạn', 'Ghi chú', 'Trạng thái', ''].map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b6760', textTransform: 'uppercase', letterSpacing: .5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {codes.map(dc => (
                  <tr key={dc.id} style={{ borderBottom: '1px solid #f0ede8' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: 1, color: '#1a1917', fontFamily: 'monospace' }}>{dc.code}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>
                      {dc.type === 'percent'
                        ? <span style={{ color: '#1a6b52', fontWeight: 600 }}>{dc.value}%</span>
                        : <span style={{ color: '#1a6b52', fontWeight: 600 }}>{fmtPrice(dc.value)}</span>
                      }
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#6b6760' }}>
                      {dc.usedCount}{dc.maxUses !== null ? <span style={{ color: '#a09d97' }}>/{dc.maxUses}</span> : ''}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: dc.expiresAt && new Date(dc.expiresAt) < new Date() ? '#dc2626' : '#6b6760' }}>
                      {fmtDate(dc.expiresAt)}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#a09d97', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {dc.note || '—'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => toggleActive(dc.id, dc.isActive)}
                        style={{ padding: '3px 10px', borderRadius: 5, border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                          background: dc.isActive ? '#e8f4ef' : '#f5f0e8', color: dc.isActive ? '#1a6b52' : '#6b6760' }}>
                        {dc.isActive ? '● Đang bật' : '○ Tắt'}
                      </button>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => deleteCode(dc.id, dc.code)}
                        style={{ background: 'none', border: 'none', color: '#a09d97', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ marginTop: 16, fontSize: 12, color: '#a09d97', lineHeight: 1.8 }}>
          <strong>Phần trăm:</strong> value = 50 → giảm 50% giá gốc · <strong>Cố định:</strong> value = 59000 → giảm 59,000đ ·{' '}
          <strong>100% off:</strong> đặt type=fixed, value ≥ giá sản phẩm → miễn phí hoàn toàn, không cần chuyển khoản
        </div>
      </div>
    </AdminLayout>
  )
}
