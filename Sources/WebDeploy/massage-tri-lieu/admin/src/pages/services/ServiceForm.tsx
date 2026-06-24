import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Category { id: number; name: string }
interface Service {
  id: number; category_id: number; name: string; tag: string
  description: string; image: string; price_from: number
  duration: string; sort_order: number; featured: number; active: number
}

export default function ServiceForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id

  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({
    category_id: 1, name: '', tag: '', description: '',
    image: '', price_from: 0, duration: '', sort_order: 0, featured: 0, active: 1,
  })
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.get<Category[]>('/service-categories').then(setCategories).catch(() => {})
    if (isEdit) {
      api.get<Service[]>('/services').then(list => {
        const found = list.find(s => s.id === +id!)
        if (found) setForm({
          category_id: found.category_id, name: found.name, tag: found.tag,
          description: found.description, image: found.image,
          price_from: found.price_from, duration: found.duration,
          sort_order: found.sort_order, featured: found.featured, active: found.active,
        })
      }).catch(() => {}).finally(() => setLoading(false))
    }
  }, [id, isEdit])

  const set = (key: string, val: unknown) => setForm(f => ({ ...f, [key]: val }))

  const handleSave = async () => {
    if (!form.name) { setMsg('Vui lòng nhập tên dịch vụ.'); return }
    setSaving(true); setMsg('')
    try {
      if (isEdit) { await api.put(`/services/${id}`, form) }
      else { await api.post('/services', form) }
      navigate('/services')
    } catch (e) { setMsg(e instanceof Error ? e.message : 'Lỗi lưu'); setSaving(false) }
  }

  if (loading) return <div style={{ color: 'var(--text-3)', padding: 20 }}>Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới'}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-ghost" onClick={() => navigate('/services')}>Hủy</button>
          <button className="btn-accent" onClick={handleSave} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
        </div>
      </div>

      {msg && <div style={{ padding: '10px 16px', borderRadius: 8, marginBottom: 16, fontSize: 13, background: '#fff0f0', color: 'var(--danger)', border: '1px solid #fdd' }}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, maxWidth: 900 }}>
        <div className="card">
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Danh mục *</label>
            <select value={form.category_id} onChange={e => set('category_id', +e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13.5, fontFamily: 'var(--sans)' }}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          {[
            { key: 'name', label: 'Tên dịch vụ *', type: 'text' },
            { key: 'tag', label: 'Tag (Truyền thống, Nổi bật...)', type: 'text' },
            { key: 'duration', label: 'Thời lượng (ví dụ: 60 - 120 phút)', type: 'text' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>{f.label}</label>
              <input type={f.type} value={(form as any)[f.key] ?? ''} onChange={e => set(f.key, e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13.5, fontFamily: 'var(--sans)', outline: 'none' }} />
            </div>
          ))}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Mô tả</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13.5, fontFamily: 'var(--sans)', resize: 'vertical', outline: 'none' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 14 }}>Ảnh dịch vụ</div>
            <ImageField value={form.image} onChange={v => set('image', v)} placeholder="URL ảnh dịch vụ" />
          </div>
          <div className="card">
            <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 14 }}>Thông tin thêm</div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Giá từ (VND)</label>
              <input type="number" value={form.price_from} onChange={e => set('price_from', +e.target.value)} min={0}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13.5, fontFamily: 'var(--sans)', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Thứ tự</label>
              <input type="number" value={form.sort_order} onChange={e => set('sort_order', +e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13.5, fontFamily: 'var(--sans)', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.featured === 1} onChange={e => set('featured', e.target.checked ? 1 : 0)} />
                <span>Dịch vụ nổi bật</span>
              </label>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Trạng thái</label>
              <select value={form.active} onChange={e => set('active', +e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13.5, fontFamily: 'var(--sans)' }}>
                <option value={1}>Hiện thị</option>
                <option value={0}>Ẩn</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
