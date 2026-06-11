'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import ImageField from './ImageField'

interface Industry { id: number; name: string; slug: string }

interface TemplateFormProps {
  mode: 'new' | 'edit'
  id?: number
  industries: Industry[]
  initial?: {
    name: string; slug: string; description: string; thumbnail: string
    demoUrl: string; price: string; websitePrice: string; customPrice: string
    category: string; industryId: string; status: string
    hasWebsite: boolean
  }
}

export default function TemplateForm({ mode, id, industries, initial }: TemplateFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    slug: initial?.slug ?? '',
    description: initial?.description ?? '',
    thumbnail: initial?.thumbnail ?? '',
    demoUrl: initial?.demoUrl ?? '',
    price: initial?.price ?? '',
    websitePrice: initial?.websitePrice ?? '',
    customPrice: initial?.customPrice ?? '',
    category:   initial?.category   ?? 'web',
    industryId: initial?.industryId ?? '',
    status:     initial?.status     ?? 'draft',
  })
  const [hasWebsite, setHasWebsite] = useState(initial?.hasWebsite ?? false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function slugify(str: string) {
    return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
  }

  function set(key: string, value: string) {
    setForm(f => {
      const next = { ...f, [key]: value }
      if (key === 'name' && mode === 'new') next.slug = slugify(value)
      return next
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name || !form.slug || !form.price) { setError('Vui lòng điền đầy đủ thông tin bắt buộc'); return }
    setSaving(true)
    try {
      const payload = {
        ...form,
        price:        parseFloat(form.price.replace(/[^0-9.]/g, '')),
        websitePrice: form.websitePrice ? parseFloat(form.websitePrice.replace(/[^0-9.]/g, '')) : null,
        customPrice:  form.customPrice  ? parseFloat(form.customPrice.replace(/[^0-9.]/g, ''))  : null,
        industryId:   form.industryId ? parseInt(form.industryId) : null,
        hasWebsite,
      }
      const res = mode === 'new'
        ? await fetch('/api/admin/templates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        : await fetch(`/api/admin/templates/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })

      if (!res.ok) { const d = await res.json(); setError(d.error || 'Lỗi lưu template'); return }
      router.push('/admin/templates')
      router.refresh()
    } catch { setError('Lỗi kết nối server') }
    finally { setSaving(false) }
  }

  const label = (text: string, req?: boolean) => (
    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 5 }}>
      {text}{req && <span style={{ color: 'var(--danger)', marginLeft: 3 }}>*</span>}
    </label>
  )

  const input = (key: keyof typeof form, props?: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      {...props}
      value={form[key]}
      onChange={e => set(key, e.target.value)}
      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 13, fontFamily: 'var(--sans)', color: 'var(--text)', outline: 'none', boxSizing: 'border-box' }}
    />
  )

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#dc2626' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ gridColumn: '1/-1' }}>
          {label('Tên template', true)}
          {input('name', { placeholder: 'Công ty dịch vụ Pro' })}
        </div>
        <div>
          {label('Slug (URL)', true)}
          {input('slug', { placeholder: 'cong-ty-dich-vu-pro' })}
        </div>
        <div>
          {label('Giá file template HTML/CSS (VNĐ)', true)}
          {input('price', { placeholder: '2500000', type: 'number', min: '0' })}
        </div>
        <div style={{ gridColumn: '1/-1' }}>
          {label('Mô tả ngắn')}
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={3} placeholder="Mô tả template, tính năng chính..."
            style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 13, fontFamily: 'var(--sans)', color: 'var(--text)', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ gridColumn: '1/-1' }}>
          <ImageField
            label="Thumbnail"
            value={form.thumbnail}
            onChange={v => set('thumbnail', v)}
            placeholder="https://images.unsplash.com/..."
          />
        </div>
        <div style={{ gridColumn: '1/-1' }}>
          {label('Demo URL')}
          {input('demoUrl', { placeholder: 'https://demo.webdrop.vn/...' })}
        </div>
        <div>
          {label('Loại template')}
          <select value={form.category} onChange={e => set('category', e.target.value)}
            style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 13, fontFamily: 'var(--sans)', color: 'var(--text)', outline: 'none' }}>
            <option value="web">Web template</option>
            <option value="admin">Admin template</option>
          </select>
        </div>
        <div>
          {label('Ngành')}
          <select value={form.industryId} onChange={e => set('industryId', e.target.value)}
            style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 13, fontFamily: 'var(--sans)', color: 'var(--text)', outline: 'none' }}>
            <option value="">— Chọn ngành —</option>
            {industries.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
        </div>
        <div>
          {label('Trạng thái')}
          <select value={form.status} onChange={e => set('status', e.target.value)}
            style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 13, fontFamily: 'var(--sans)', color: 'var(--text)', outline: 'none' }}>
            <option value="draft">Nháp</option>
            <option value="published">Đang bán</option>
          </select>
        </div>

        {/* Phiên bản Website */}
        <div style={{ gridColumn: '1/-1' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
            <input type="checkbox" checked={hasWebsite} onChange={e => setHasWebsite(e.target.checked)}
              style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--accent)' }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Có phiên bản Website đầy đủ (Gói B)</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                Khi bật — khách có thể chọn mua website React + PHP + Admin thay vì chỉ file template
              </div>
            </div>
          </label>
        </div>

        {/* Giá website và custom — chỉ hiện khi hasWebsite = true */}
        {hasWebsite && (
          <>
            <div>
              {label('Giá website chuẩn - Gói B (VNĐ)')}
              <div style={{ position: 'relative' }}>
                {input('websitePrice', { placeholder: '5000000', type: 'number', min: '0' })}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
                Giá mua website React + PHP + Admin theo template này. Để trống nếu chưa xác định.
              </div>
            </div>
            <div>
              {label('Giá khởi điểm custom - Gói C (VNĐ)')}
              <div style={{ position: 'relative' }}>
                {input('customPrice', { placeholder: '15000000', type: 'number', min: '0' })}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
                Giá tham khảo cho website làm theo yêu cầu dựa trên template này. Để trống nếu không áp dụng.
              </div>
            </div>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
        <button type="button" onClick={() => router.back()}
          style={{ padding: '10px 22px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', fontSize: 13, fontFamily: 'var(--sans)', color: 'var(--text-2)', cursor: 'pointer' }}>
          Huỷ
        </button>
        <button type="submit" disabled={saving}
          style={{ padding: '10px 28px', borderRadius: 8, background: 'var(--accent)', border: 'none', fontSize: 13, fontWeight: 500, fontFamily: 'var(--sans)', color: '#fff', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .7 : 1 }}>
          {saving ? 'Đang lưu...' : mode === 'new' ? 'Tạo template' : 'Lưu thay đổi'}
        </button>
      </div>
    </form>
  )
}
