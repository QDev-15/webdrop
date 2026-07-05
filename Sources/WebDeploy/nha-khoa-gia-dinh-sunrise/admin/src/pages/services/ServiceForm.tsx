import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface ServiceCategory { id: number; name: string }

interface ServiceFormData {
  category_id: number | null
  image: string
  tag: string
  name: string
  description: string
  price: string
  price_unit: string
  sort_order: number
  is_active: number
}

const EMPTY: ServiceFormData = { category_id: null, image: '', tag: '', name: '', description: '', price: '', price_unit: '', sort_order: 0, is_active: 1 }

export default function ServiceForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<ServiceFormData>(EMPTY)
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<ServiceCategory[]>('/service-categories').then(setCategories).catch(console.error)
    if (!isEdit) return
    api.get<(ServiceFormData & { id: number })[]>('/services').then((items: any) => {
      const found = Array.isArray(items) ? items.find((s: any) => s.id === Number(id)) : null
      if (found) setForm(found)
    }).catch(console.error)
  }, [id, isEdit])

  const set = (k: keyof ServiceFormData, v: string | number | null) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name) { setError('Vui lòng nhập tên dịch vụ.'); return }
    setSaving(true); setError('')
    try {
      if (isEdit) {
        await api.put(`/services/${id}`, form)
      } else {
        await api.post('/services', form)
      }
      navigate('/services')
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}</div>
          <div className="page-subtitle">Quản lý dịch vụ nha khoa gia đình</div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="form-card">
        {error && <div className="form-error">{error}</div>}
        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Tên dịch vụ <span className="req">*</span></label>
            <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Khám tổng quát định kỳ" required />
          </div>
          <div className="form-group">
            <label className="form-label">Tag (hiển thị trên card)</label>
            <input className="form-control" value={form.tag} onChange={e => set('tag', e.target.value)} placeholder="Phòng ngừa" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Nhóm dịch vụ</label>
          <select
            className="form-control"
            value={form.category_id ?? ''}
            onChange={e => set('category_id', e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">— Chọn nhóm —</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Ảnh minh họa</label>
          <ImageField value={form.image} onChange={v => set('image', v)} placeholder="URL ảnh dịch vụ" />
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả dịch vụ</label>
          <textarea className="form-control" rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả ngắn gọn về dịch vụ..." />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Giá (ví dụ: 150.000đ)</label>
            <input className="form-control" value={form.price} onChange={e => set('price', e.target.value)} placeholder="150.000đ" />
          </div>
          <div className="form-group">
            <label className="form-label">Đơn vị (ví dụ: / lượt)</label>
            <input className="form-control" value={form.price_unit} onChange={e => set('price_unit', e.target.value)} placeholder="/ lượt" />
          </div>
          <div className="form-group">
            <label className="form-label">Thứ tự</label>
            <input className="form-control" type="number" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">
            <input type="checkbox" checked={form.is_active === 1} onChange={e => set('is_active', e.target.checked ? 1 : 0)} style={{ marginRight: '8px' }} />
            Hiển thị trên website
          </label>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu dịch vụ'}</button>
          <button type="button" className="btn-ghost" onClick={() => navigate('/services')}>Hủy</button>
        </div>
      </form>
    </>
  )
}
