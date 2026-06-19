import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Category {
  id: number
  name: string
}

interface ProductForm {
  category_id: number | ''
  name: string
  description: string
  price: string
  price_note: string
  image: string
  tag: string
  featured: number
  sort_order: number
  status: string
}

const emptyForm: ProductForm = {
  category_id: '', name: '', description: '', price: '', price_note: '',
  image: '', tag: '', featured: 0, sort_order: 0, status: 'published',
}

export default function MenuItemForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    const loadCats = api.get<Category[]>('/product-categories')
    const loadItem = id ? api.get<Record<string, unknown>>(`/products/${id}`) : Promise.resolve(null)
    Promise.all([loadCats, loadItem])
      .then(([cats, item]) => {
        setCategories(cats)
        if (item) {
          setForm({
            category_id: (item.category_id as number) ?? '',
            name: (item.name as string) ?? '',
            description: (item.description as string) ?? '',
            price: item.price != null && item.price !== 0 ? String(item.price) : '',
            price_note: (item.price_note as string) ?? '',
            image: (item.image as string) ?? '',
            tag: (item.tag as string) ?? '',
            featured: (item.featured as number) ?? 0,
            sort_order: (item.sort_order as number) ?? 0,
            status: (item.status as string) ?? 'published',
          })
        }
      })
      .catch(() => setError('Không tải được dữ liệu.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof ProductForm>(k: K, v: ProductForm[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên sản phẩm là bắt buộc.'); return }
    setError(''); setSaving(true)
    const payload = {
      ...form,
      category_id: form.category_id === '' ? null : form.category_id,
      price: form.price !== '' ? parseFloat(form.price) : 0,
    }
    try {
      if (isEdit) { await api.put(`/products/${id}`, payload) }
      else { await api.post('/products', payload) }
      navigate('/products')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</div>
        </div>
        <button onClick={() => navigate('/products')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Tên sản phẩm *</label>
            <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Vd: Bánh Kem Vani Pháp" required />
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
            <label className="form-label">Giá (VND)</label>
            <input type="number" className="form-control" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" min={0} />
          </div>
          <div className="form-group">
            <label className="form-label">Ghi chú giá (hiển thị)</label>
            <input type="text" className="form-control" value={form.price_note} onChange={e => set('price_note', e.target.value)} placeholder="Vd: từ 350.000đ, 45.000đ/cái" />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Mô tả sản phẩm</label>
            <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả nguyên liệu, hương vị..." rows={3} />
          </div>
          <div className="form-group">
            <label className="form-label">Tag</label>
            <select className="form-control" value={form.tag} onChange={e => set('tag', e.target.value)}>
              <option value="">-- Không có --</option>
              <option value="bestseller">★ Bestseller</option>
              <option value="new">✦ Mới</option>
              <option value="seasonal">🌸 Theo mùa</option>
              <option value="custom">🎨 Custom</option>
            </select>
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
          <ImageField label="Ảnh sản phẩm" value={form.image} onChange={v => set('image', v)} />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/products')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
