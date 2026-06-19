import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Category {
  id: number
  name: string
}

interface ItemForm {
  category_id: number | ''
  name: string
  description: string
  price: string
  price_sale: string
  price_note: string
  image: string
  badge: string
  featured: number
  sort_order: number
  status: string
}

const emptyForm: ItemForm = {
  category_id: '', name: '', description: '', price: '', price_sale: '',
  price_note: '', image: '', badge: '', featured: 0, sort_order: 0, status: 'published',
}

export default function MenuItemForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<ItemForm>(emptyForm)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    const loadCats = api.get<Category[]>('/menu-categories')
    const loadItem = id ? api.get<Record<string, unknown>>(`/menu-items/${id}`) : Promise.resolve(null)
    Promise.all([loadCats, loadItem])
      .then(([cats, item]) => {
        setCategories(cats)
        if (item) {
          setForm({
            category_id: (item.category_id as number) ?? '',
            name: (item.name as string) ?? '',
            description: (item.description as string) ?? '',
            price: item.price != null ? String(item.price) : '',
            price_sale: item.price_sale != null ? String(item.price_sale) : '',
            image: (item.image as string) ?? '',
            badge: (item.badge as string) ?? '',
            price_note: (item.price_note as string) ?? '',
            featured: (item.featured as number) ?? 0,
            sort_order: (item.sort_order as number) ?? 0,
            status: (item.status as string) ?? 'published',
          })
        }
      })
      .catch(() => setError('Không tải được dữ liệu.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof ItemForm>(k: K, v: ItemForm[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên món ăn là bắt buộc.'); return }
    setError(''); setSaving(true)
    const payload = {
      ...form,
      category_id: form.category_id === '' ? null : form.category_id,
      price: form.price !== '' ? parseFloat(form.price) : null,
      price_sale: form.price_sale !== '' ? parseFloat(form.price_sale) : null,
    }
    try {
      if (isEdit) { await api.put(`/menu-items/${id}`, payload) }
      else { await api.post('/menu-items', payload) }
      navigate('/menu-items')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}</div>
        </div>
        <button onClick={() => navigate('/menu-items')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Tên món ăn *</label>
            <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Tên món ăn" required />
          </div>
          <div className="form-group">
            <label className="form-label">Danh mục</label>
            <select className="form-control" value={String(form.category_id)} onChange={e => set('category_id', e.target.value === '' ? '' : parseInt(e.target.value))}>
              <option value="">-- Chọn danh mục --</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="published">Hiển thị</option>
              <option value="draft">Ẩn</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Giá (VNĐ)</label>
            <input type="number" className="form-control" value={form.price} onChange={e => set('price', e.target.value)} placeholder="Vd: 25000" min={0} />
          </div>
          <div className="form-group">
            <label className="form-label">Giá khuyến mãi (VNĐ)</label>
            <input type="number" className="form-control" value={form.price_sale} onChange={e => set('price_sale', e.target.value)} placeholder="Để trống nếu không có" min={0} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Mô tả món ăn</label>
            <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả nguyên liệu, cách chế biến..." rows={3} />
          </div>
          <div className="form-group">
            <label className="form-label">Badge (vd: Bán chạy, Mới)</label>
            <input type="text" className="form-control" value={form.badge} onChange={e => set('badge', e.target.value)} placeholder="Để trống nếu không cần" />
          </div>
          <div className="form-group">
            <label className="form-label">Ghi chú giá (vd: Tô thường / Tô lớn)</label>
            <input type="text" className="form-control" value={form.price_note} onChange={e => set('price_note', e.target.value)} placeholder="Vd: Tô thường / Tô lớn" />
          </div>
          <div className="form-group">
            <label className="form-label">Thứ tự hiển thị</label>
            <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 24 }}>
            <input type="checkbox" id="featured" checked={form.featured === 1} onChange={e => set('featured', e.target.checked ? 1 : 0)} style={{ width: 16, height: 16 }} />
            <label htmlFor="featured" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>Hiển thị nổi bật</label>
          </div>
        </div>
        <div className="form-group">
          <ImageField label="Ảnh món ăn" value={form.image} onChange={v => set('image', v)} />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/menu-items')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
