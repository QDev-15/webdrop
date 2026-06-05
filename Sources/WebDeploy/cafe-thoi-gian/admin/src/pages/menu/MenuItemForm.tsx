import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface MenuCategory { id: number; name: string }
interface FormData {
  category_id: number | ''
  name: string
  description: string
  price: number
  image: string
  featured: number
  sort_order: number
  status: string
}

export default function MenuItemForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [form, setForm] = useState<FormData>({ category_id: '', name: '', description: '', price: 0, image: '', featured: 0, sort_order: 0, status: 'published' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<MenuCategory[]>('/menu-categories').then(setCategories).catch(console.error)
    if (isEdit) {
      api.get<FormData & { id: number }>(`/menu-items/${id}`)
        .then(data => setForm({ category_id: data.category_id || '', name: data.name, description: data.description || '', price: data.price, image: data.image || '', featured: data.featured, sort_order: data.sort_order, status: data.status }))
        .catch(() => navigate('/menu-items'))
    }
  }, [id, isEdit, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      if (isEdit) { await api.put(`/menu-items/${id}`, form) }
      else { await api.post('/menu-items', form) }
      navigate('/menu-items')
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Lỗi lưu') }
    finally { setSaving(false) }
  }

  return (
    <div style={{ maxWidth: '640px' }}>
      <div className="page-header">
        <div><div className="page-title">{isEdit ? 'Sửa món' : 'Thêm món'}</div></div>
        <button className="btn-ghost btn-sm" onClick={() => navigate('/menu-items')}>← Quay lại</button>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Danh mục</label>
            <select className="form-control" value={form.category_id} onChange={e => setForm(p => ({ ...p, category_id: e.target.value ? parseInt(e.target.value) : '' }))}>
              <option value="">-- Không có danh mục --</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Tên món *</label>
            <input className="form-control" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả</label>
            <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Giá (VND)</label>
              <input className="form-control" type="number" min={0} step={1000} value={form.price} onChange={e => setForm(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input className="form-control" type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">URL ảnh</label>
            <input className="form-control" type="url" value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} placeholder="https://..." />
            {form.image && <img src={form.image} style={{ marginTop: '8px', maxHeight: '100px', borderRadius: '8px', objectFit: 'cover' }} alt="preview" onError={e => (e.currentTarget.style.display = 'none')} />}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Nổi bật</label>
              <select className="form-control" value={form.featured} onChange={e => setForm(p => ({ ...p, featured: parseInt(e.target.value) }))}>
                <option value={0}>Không</option>
                <option value={1}>Nổi bật</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                <option value="published">Công khai</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu món'}</button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/menu-items')}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  )
}
