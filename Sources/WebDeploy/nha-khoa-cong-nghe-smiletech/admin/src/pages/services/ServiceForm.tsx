import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Category { id: number; name: string }
interface Service {
  id?: number
  category_id: string
  name: string
  tag: string
  description: string
  image: string
  price: string
  sort_order: number
  is_active: number
}

const INIT: Service = {
  category_id: '', name: '', tag: '', description: '', image: '', price: '', sort_order: 0, is_active: 1,
}

export default function ServiceForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState<Service>(INIT)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<Category[]>('/service-categories').then(setCategories).catch(console.error)
    if (isEdit) {
      api.get<Service[]>('/services').then(list => {
        const found = list.find(s => s.id === Number(id))
        if (found) setForm({ ...found, category_id: String(found.category_id ?? '') })
      }).catch(console.error).finally(() => setLoading(false))
    }
  }, [id, isEdit])

  const set = (k: keyof Service, v: string | number) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên dịch vụ không được để trống.'); return }
    setSaving(true); setError('')
    try {
      if (isEdit) {
        await api.put(`/services/${id}`, form)
      } else {
        await api.post('/services', form)
      }
      navigate('/services')
    } catch (e: unknown) {
      setError((e as Error).message || 'Lỗi khi lưu.')
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="card form-card">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="form-grid">
          <div className="form-field">
            <label>Tên dịch vụ *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Invisalign AI" />
          </div>
          <div className="form-field">
            <label>Nhãn (tag)</label>
            <input value={form.tag} onChange={e => set('tag', e.target.value)} placeholder="Chỉnh nha" />
          </div>
          <div className="form-field">
            <label>Danh mục</label>
            <select value={form.category_id} onChange={e => set('category_id', e.target.value)}>
              <option value="">— Chọn danh mục —</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Giá</label>
            <input value={form.price} onChange={e => set('price', e.target.value)} placeholder="Từ 35.000.000đ" />
          </div>
        </div>

        <div className="form-field">
          <label>Mô tả</label>
          <textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả chi tiết dịch vụ..." />
        </div>

        <div className="form-field">
          <ImageField label="Ảnh đại diện" value={form.image} onChange={v => set('image', v)} />
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label>Thứ tự hiển thị</label>
            <input type="number" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} min={0} />
          </div>
          <div className="form-field">
            <label>Trạng thái</label>
            <select value={form.is_active} onChange={e => set('is_active', Number(e.target.value))}>
              <option value={1}>Hiển thị</option>
              <option value={0}>Ẩn</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/services')}>Huỷ</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm dịch vụ'}
          </button>
        </div>
      </form>
    </div>
  )
}
