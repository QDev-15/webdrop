import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Category { id: number; name: string; icon: string }
interface ServiceData {
  category_id: number | null
  name: string
  description: string
  price: string
  image: string
  badge: string
  sort_order: number
  is_featured: number
}

const empty: ServiceData = { category_id: null, name: '', description: '', price: '', image: '', badge: '', sort_order: 0, is_featured: 0 }

export default function ServiceForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit   = Boolean(id)

  const [form, setForm]   = useState<ServiceData>(empty)
  const [cats, setCats]   = useState<Category[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    api.get<Category[]>('/service-categories').then(setCats).catch(() => {})
    if (isEdit) {
      api.get<ServiceData & { id: number }>(`/services/${id}`)
        .then(d => setForm({ category_id: d.category_id, name: d.name, description: d.description, price: d.price, image: d.image, badge: d.badge, sort_order: d.sort_order, is_featured: d.is_featured }))
        .catch(() => setError('Không tải được dịch vụ.'))
        .finally(() => setLoading(false))
    }
  }, [id, isEdit])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError('')
    try {
      if (isEdit) {
        await api.put(`/services/${id}`, form)
      } else {
        await api.post('/services', form)
      }
      navigate('/services')
    } catch (err) { setError(err instanceof Error ? err.message : 'Lỗi lưu') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 680 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}</div>
        </div>
        <button className="btn-ghost" onClick={() => navigate('/services')}>← Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Danh mục</label>
            <select className="form-control" value={form.category_id ?? ''} onChange={e => setForm(p => ({ ...p, category_id: e.target.value ? +e.target.value : null }))}>
              <option value="">-- Chọn danh mục --</option>
              {cats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Tên dịch vụ *</label>
            <input className="form-control" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả</label>
            <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Giá dịch vụ</label>
            <input className="form-control" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="vd: 150.000 – 250.000đ" />
          </div>
          <div className="form-group">
            <label className="form-label">Badge (nhãn nổi bật)</label>
            <input className="form-control" value={form.badge} onChange={e => setForm(p => ({ ...p, badge: e.target.value }))} placeholder="vd: Hot, Mới, Best seller" />
          </div>
          <div className="form-group">
            <label className="form-label">Ảnh minh họa</label>
            <ImageField value={form.image} onChange={v => setForm(p => ({ ...p, image: v }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Thứ tự hiển thị</label>
              <input className="form-control" type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: +e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Dịch vụ nổi bật</label>
              <select className="form-control" value={form.is_featured} onChange={e => setForm(p => ({ ...p, is_featured: +e.target.value }))}>
                <option value={0}>Không</option>
                <option value={1}>Có — Hiển thị trang chủ</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu dịch vụ'}</button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/services')}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  )
}
