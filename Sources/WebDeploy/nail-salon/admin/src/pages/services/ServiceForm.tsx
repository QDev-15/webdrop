import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Category { id: number; name: string; icon: string }
interface Service {
  id: number; category_id: number | null; name: string; tag: string
  description: string; price: string; image: string; featured: number; sort_order: number
}

const blank = { category_id: '', name: '', tag: '', description: '', price: '', image: '', featured: '0', sort_order: '0' }

export default function ServiceForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState(blank)
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<Category[]>('/service-categories').then(setCats)
    if (isEdit) {
      api.get<Service[]>('/services').then(services => {
        const s = services.find(x => x.id === +id!)
        if (s) setForm({
          category_id: s.category_id?.toString() ?? '',
          name: s.name, tag: s.tag, description: s.description,
          price: s.price, image: s.image,
          featured: s.featured.toString(), sort_order: s.sort_order.toString(),
        })
        setLoading(false)
      })
    }
  }, [id, isEdit])

  function set(key: string, value: string) { setForm(f => ({ ...f, [key]: value })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError('')
    const payload = {
      category_id: form.category_id ? +form.category_id : null,
      name: form.name, tag: form.tag, description: form.description,
      price: form.price, image: form.image,
      featured: +form.featured, sort_order: +form.sort_order,
    }
    try {
      if (isEdit) await api.put(`/services/${id}`, payload)
      else await api.post('/services', payload)
      navigate('/services')
    } catch (e) { setError(e instanceof Error ? e.message : 'Lỗi'); setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}</div>
        </div>
        <button className="btn-ghost" onClick={() => navigate('/services')}>← Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ maxWidth: 720 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Danh mục</label>
            <select className="form-control" value={form.category_id} onChange={e => set('category_id', e.target.value)}>
              <option value="">-- Không phân loại --</option>
              {cats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Tên dịch vụ *</label>
            <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="VD: Nail Gel 1 màu" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Tag (nhãn hiển thị)</label>
              <input className="form-control" value={form.tag} onChange={e => set('tag', e.target.value)} placeholder="VD: Phổ biến, Hot" />
            </div>
            <div className="form-group">
              <label className="form-label">Giá</label>
              <input className="form-control" value={form.price} onChange={e => set('price', e.target.value)} placeholder="VD: Từ 150.000đ" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả</label>
            <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả ngắn về dịch vụ..." />
          </div>
          <div className="form-group">
            <ImageField label="Ảnh đại diện" value={form.image} onChange={v => set('image', v)} placeholder="URL ảnh dịch vụ" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Nổi bật trên trang chủ</label>
              <select className="form-control" value={form.featured} onChange={e => set('featured', e.target.value)}>
                <option value="0">Không</option>
                <option value="1">Có — hiển thị trang chủ</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Thứ tự sắp xếp</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Lưu thay đổi' : 'Thêm dịch vụ')}</button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/services')}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  )
}
