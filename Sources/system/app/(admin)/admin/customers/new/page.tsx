'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'

export default function NewCustomerPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', address: '', note: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const s = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Vui lòng nhập tên khách hàng'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Lỗi tạo khách hàng'); return }
      const data = await res.json()
      router.push(`/admin/customers/${data.id}`)
    } catch { setError('Lỗi kết nối server') }
    finally { setSaving(false) }
  }

  const Field = ({ label, field, type = 'text', placeholder, req }: { label: string; field: keyof typeof form; type?: string; placeholder?: string; req?: boolean }) => (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 5 }}>
        {label}{req && <span style={{ color: 'var(--danger)', marginLeft: 3 }}>*</span>}
      </label>
      <input type={type} value={form[field]} onChange={s(field)} placeholder={placeholder}
        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 13, fontFamily: 'var(--sans)', outline: 'none', boxSizing: 'border-box' }} />
    </div>
  )

  return (
    <AdminLayout title="Thêm khách hàng">
      <div style={{ maxWidth: 600 }}>
        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#dc2626' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ gridColumn: '1/-1' }}><Field label="Họ và tên" field="name" placeholder="Nguyễn Văn A" req /></div>
            <Field label="Email" field="email" type="email" placeholder="email@example.com" />
            <Field label="Số điện thoại" field="phone" type="tel" placeholder="0901 234 567" />
            <div style={{ gridColumn: '1/-1' }}><Field label="Công ty / Doanh nghiệp" field="company" placeholder="Công ty ABC" /></div>
            <div style={{ gridColumn: '1/-1' }}><Field label="Địa chỉ" field="address" placeholder="Quận 1, TP.HCM" /></div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 5 }}>Ghi chú</label>
              <textarea value={form.note} onChange={s('note')} rows={3} placeholder="Ghi chú nội bộ về khách hàng..."
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 13, fontFamily: 'var(--sans)', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => router.back()}
              style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', fontSize: 13, fontFamily: 'var(--sans)', color: 'var(--text-2)', cursor: 'pointer' }}>Huỷ</button>
            <button type="submit" disabled={saving}
              style={{ padding: '10px 24px', borderRadius: 8, background: 'var(--accent)', border: 'none', fontSize: 13, fontWeight: 500, fontFamily: 'var(--sans)', color: '#fff', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .7 : 1 }}>
              {saving ? 'Đang lưu...' : 'Tạo khách hàng'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
