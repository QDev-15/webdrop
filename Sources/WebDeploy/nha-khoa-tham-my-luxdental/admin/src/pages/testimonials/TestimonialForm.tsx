import { useEffect, useState, FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface FormData {
  author_name: string
  author_role: string
  author_avatar: string
  content: string
  stars: string
  is_featured: string
  sort_order: string
}

const empty: FormData = {
  author_name: '', author_role: '', author_avatar: '', content: '', stars: '5', is_featured: '1', sort_order: '0'
}

export default function TestimonialForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const nav = useNavigate()
  const [form, setForm] = useState<FormData>(empty)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<Record<string, string>>(`/testimonials/${id}`)
      .then(data => setForm({
        author_name:   data.author_name   ?? '',
        author_role:   data.author_role   ?? '',
        author_avatar: data.author_avatar ?? '',
        content:       data.content       ?? '',
        stars:         String(data.stars  ?? '5'),
        is_featured:   String(data.is_featured ?? '1'),
        sort_order:    String(data.sort_order  ?? '0'),
      }))
      .catch(() => setError('Không thể tải dữ liệu.'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (k: keyof FormData, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.author_name.trim()) { setError('Tên tác giả không được để trống.'); return }
    setSaving(true); setError('')
    try {
      const payload = { ...form, stars: parseInt(form.stars), is_featured: parseInt(form.is_featured), sort_order: parseInt(form.sort_order) }
      if (isEdit) await api.put(`/testimonials/${id}`, payload)
      else        await api.post('/testimonials', payload)
      nav('/testimonials')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi lưu dữ liệu.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => nav('/testimonials')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', fontSize: 13 }}>← Quay lại</button>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>{isEdit ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá'}</h1>
      </div>
      {error && <div style={{ background: '#fee2e2', color: 'var(--danger)', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}

      <form onSubmit={submit} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 24 }}>
        <F label="Tên tác giả *" value={form.author_name} onChange={v => set('author_name', v)} required />
        <F label="Vai trò / Dịch vụ đã dùng" value={form.author_role} onChange={v => set('author_role', v)} placeholder="Khách hàng Veneer sứ" />
        <F label="Nội dung đánh giá" value={form.content} onChange={v => set('content', v)} textarea />

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>Ảnh đại diện</label>
          <ImageField value={form.author_avatar} onChange={v => set('author_avatar', v)} placeholder="URL ảnh tác giả" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>Số sao</label>
            <select value={form.stars} onChange={e => set('stars', e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 7, fontSize: 13, background: 'var(--bg)' }}>
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} sao</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>Hiển thị</label>
            <select value={form.is_featured} onChange={e => set('is_featured', e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 7, fontSize: 13, background: 'var(--bg)' }}>
              <option value="1">Hiển thị</option>
              <option value="0">Ẩn</option>
            </select>
          </div>
          <F label="Thứ tự" value={form.sort_order} onChange={v => set('sort_order', v)} type="number" />
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button type="submit" disabled={saving}
            style={{ padding: '10px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
            {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
          <button type="button" onClick={() => nav('/testimonials')}
            style={{ padding: '10px 20px', background: 'var(--warm)', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
            Hủy
          </button>
        </div>
      </form>
    </div>
  )
}

function F({ label, value, onChange, required, textarea, type, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; textarea?: boolean; type?: string; placeholder?: string
}) {
  const style = { width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 7, fontSize: 13, fontFamily: 'inherit', background: 'var(--bg)' }
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={4} required={required} placeholder={placeholder} style={{ ...style, resize: 'vertical' }} />
        : <input type={type || 'text'} value={value} onChange={e => onChange(e.target.value)} required={required} placeholder={placeholder} style={style} />
      }
    </div>
  )
}
