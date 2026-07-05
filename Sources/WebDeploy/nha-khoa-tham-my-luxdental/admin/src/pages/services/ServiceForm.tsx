import { useEffect, useState, FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Category { id: number; name: string }

interface FormData {
  name: string
  description: string
  image: string
  tag: string
  price: string
  price_unit: string
  category_id: string
  is_featured: string
  sort_order: string
}

const empty: FormData = {
  name: '', description: '', image: '', tag: '', price: '', price_unit: '',
  category_id: '', is_featured: '0', sort_order: '0',
}

export default function ServiceForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const nav = useNavigate()
  const [form, setForm] = useState<FormData>(empty)
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<Category[]>('/service-categories').then(setCats)
    if (isEdit) {
      api.get<Record<string, string>>(`/services/${id}`)
        .then(data => setForm({
          name:        data.name         ?? '',
          description: data.description  ?? '',
          image:       data.image        ?? '',
          tag:         data.tag          ?? '',
          price:       data.price        ?? '',
          price_unit:  data.price_unit   ?? '',
          category_id: data.category_id  ?? '',
          is_featured: String(data.is_featured ?? '0'),
          sort_order:  String(data.sort_order  ?? '0'),
        }))
        .catch(() => setError('Không thể tải dữ liệu.'))
        .finally(() => setLoading(false))
    }
  }, [id, isEdit])

  const set = (k: keyof FormData, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên dịch vụ không được để trống.'); return }
    setSaving(true); setError('')
    try {
      const payload = {
        ...form,
        category_id: form.category_id || null,
        is_featured: parseInt(form.is_featured),
        sort_order:  parseInt(form.sort_order),
      }
      if (isEdit) await api.put(`/services/${id}`, payload)
      else        await api.post('/services', payload)
      nav('/services')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi lưu dữ liệu.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => nav('/services')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', fontSize: 13 }}>← Quay lại</button>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>{isEdit ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ'}</h1>
      </div>
      {error && <div style={{ background: '#fee2e2', color: 'var(--danger)', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}

      <form onSubmit={submit} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 24 }}>
        <F label="Tên dịch vụ *" value={form.name} onChange={v => set('name', v)} required />
        <F label="Tag / Nhãn" value={form.tag} onChange={v => set('tag', v)} placeholder="Bán chạy nhất, Nổi bật..." />
        <F label="Mô tả" value={form.description} onChange={v => set('description', v)} textarea />

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>Ảnh đại diện</label>
          <ImageField value={form.image} onChange={v => set('image', v)} placeholder="URL ảnh dịch vụ" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <F label="Giá" value={form.price} onChange={v => set('price', v)} placeholder="5.000.000đ" />
          <F label="Đơn vị giá" value={form.price_unit} onChange={v => set('price_unit', v)} placeholder="/ răng, / liệu trình..." />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>Nhóm dịch vụ</label>
          <select value={form.category_id} onChange={e => set('category_id', e.target.value)}
            style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 7, fontSize: 13, background: 'var(--bg)' }}>
            <option value="">-- Không phân nhóm --</option>
            {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>Hiển thị nổi bật</label>
            <select value={form.is_featured} onChange={e => set('is_featured', e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 7, fontSize: 13, background: 'var(--bg)' }}>
              <option value="0">Thường</option>
              <option value="1">Nổi bật</option>
            </select>
          </div>
          <F label="Thứ tự hiển thị" value={form.sort_order} onChange={v => set('sort_order', v)} type="number" />
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button type="submit" disabled={saving}
            style={{ padding: '10px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
            {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
          <button type="button" onClick={() => nav('/services')}
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
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} required={required} placeholder={placeholder} style={{ ...style, resize: 'vertical' }} />
        : <input type={type || 'text'} value={value} onChange={e => onChange(e.target.value)} required={required} placeholder={placeholder} style={style} />
      }
    </div>
  )
}
