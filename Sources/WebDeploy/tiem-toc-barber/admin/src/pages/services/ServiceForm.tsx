import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Category {
  id: number
  name: string
}

interface ServiceFormState {
  category_id: number | ''
  name: string
  note: string
  description: string
  price_text: string
  image: string
  is_featured: boolean
  sort_order: number
  status: string
}

const empty: ServiceFormState = {
  category_id: '', name: '', note: '', description: '', price_text: '',
  image: '', is_featured: false, sort_order: 0, status: 'published',
}

export default function ServiceForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<ServiceFormState>(empty)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const cats = await api.get<Category[]>('/service-categories')
        setCategories(cats)
        if (id) {
          const d = await api.get<any>(`/services/${id}`)
          setForm({
            category_id: d.category_id, name: d.name, note: d.note ?? '',
            description: d.description ?? '', price_text: d.price_text ?? '',
            image: d.image ?? '', is_featured: !!d.is_featured,
            sort_order: d.sort_order ?? 0, status: d.status ?? 'published',
          })
        } else if (cats.length > 0) {
          setForm(f => ({ ...f, category_id: cats[0].id }))
        }
      } catch {
        setError('Không tìm thấy dịch vụ.')
      } finally { setLoading(false) }
    })()
  }, [id])

  function set<K extends keyof ServiceFormState>(k: K, v: ServiceFormState[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Tên dịch vụ là bắt buộc.'); return }
    if (!form.category_id) { setError('Vui lòng chọn danh mục.'); return }
    setSaving(true)
    try {
      const payload = { ...form, is_featured: form.is_featured ? 1 : 0 }
      if (isEdit) await api.put(`/services/${id}`, payload)
      else await api.post('/services', payload)
      navigate('/services')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}</div>
        </div>
        <button onClick={() => navigate('/services')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Danh mục *</label>
          <select className="form-control" value={form.category_id} onChange={e => set('category_id', parseInt(e.target.value))} required>
            <option value="">-- Chọn danh mục --</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Tên dịch vụ *</label>
          <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Cắt tóc cơ bản" required />
        </div>
        <div className="form-group">
          <label className="form-label">Ghi chú ngắn</label>
          <input className="form-control" value={form.note} onChange={e => set('note', e.target.value)} placeholder="Wash + cắt + sấy" />
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả (chỉ dùng cho card nổi bật trang chủ)</label>
          <textarea className="form-control" rows={2} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Cắt tạo kiểu, fade, undercut..." />
        </div>
        <div className="form-group">
          <label className="form-label">Giá hiển thị *</label>
          <input className="form-control" value={form.price_text} onChange={e => set('price_text', e.target.value)} placeholder="100.000đ hoặc 350.000đ–550.000đ" />
        </div>
        <div className="form-group">
          <ImageField label="Ảnh dịch vụ (chỉ dùng cho card nổi bật)" value={form.image} onChange={v => set('image', v)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Thứ tự hiển thị</label>
            <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
          </div>
          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="published">Đang hiện</option>
              <option value="draft">Ẩn</option>
            </select>
          </div>
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" id="is_featured" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} />
          <label htmlFor="is_featured" className="form-label" style={{ margin: 0 }}>Hiển thị làm dịch vụ nổi bật (card trang chủ)</label>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/services')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
