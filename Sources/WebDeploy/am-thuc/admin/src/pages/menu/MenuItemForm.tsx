import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Category { id: number; name: string }
interface ItemForm {
  category_id: string
  name: string
  description: string
  price: string
  price_sale: string
  image: string
  featured: number
  sort_order: number
  status: string
}
interface ItemRaw {
  id: number
  category_id: number | null
  name: string
  description: string
  price: number
  price_sale: number | null
  image: string
  featured: number
  sort_order: number
  status: string
}

const DEFAULT: ItemForm = {
  category_id: '',
  name: '',
  description: '',
  price: '',
  price_sale: '',
  image: '',
  featured: 0,
  sort_order: 0,
  status: 'published',
}

export default function MenuItemForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<ItemForm>(DEFAULT)
  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<Category[]>('/menu-categories').then(setCategories).catch(() => {})
    if (isEdit) {
      api.get<ItemRaw[]>('/menu-items')
        .then(items => {
          const found = items.find(i => i.id === parseInt(id!))
          if (found) {
            setForm({
              category_id: found.category_id != null ? String(found.category_id) : '',
              name: found.name,
              description: found.description ?? '',
              price: found.price != null ? String(found.price) : '',
              price_sale: found.price_sale != null ? String(found.price_sale) : '',
              image: found.image ?? '',
              featured: found.featured ?? 0,
              sort_order: found.sort_order ?? 0,
              status: found.status ?? 'published',
            })
          }
        })
        .catch(() => {})
    }
  }, [id, isEdit])

  function set(key: keyof ItemForm, value: string | number) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name) { setError('Tên món không được để trống.'); return }
    setSaving(true)
    try {
      const payload = {
        ...form,
        category_id: form.category_id ? parseInt(form.category_id) : null,
        price: parseFloat(form.price) || 0,
        price_sale: form.price_sale ? parseFloat(form.price_sale) : null,
      }
      if (isEdit) {
        await api.put(`/menu-items/${id}`, payload)
      } else {
        await api.post('/menu-items', payload)
      }
      navigate('/menu-items')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
          {isEdit ? 'Sửa món ăn' : 'Thêm món ăn mới'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label className="form-label">Tên món ăn *</label>
            <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Phở Bò Đặc Biệt" required />
          </div>
          <div>
            <label className="form-label">Danh mục</label>
            <select className="form-control" value={form.category_id} onChange={e => set('category_id', e.target.value)}>
              <option value="">-- Chọn danh mục --</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Mô tả</label>
            <textarea className="form-control" rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả ngắn về món ăn..." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Giá (VND) *</label>
              <input type="number" className="form-control" value={form.price} onChange={e => set('price', e.target.value)} placeholder="85000" min={0} />
            </div>
            <div>
              <label className="form-label">Giá gốc (nếu đang sale)</label>
              <input type="number" className="form-control" value={form.price_sale} onChange={e => set('price_sale', e.target.value)} placeholder="100000" min={0} />
            </div>
          </div>
          <ImageField label="Ảnh món ăn" value={form.image} onChange={v => set('image', v)} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Thứ tự</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
            </div>
            <div>
              <label className="form-label">Nổi bật</label>
              <select className="form-control" value={form.featured} onChange={e => set('featured', parseInt(e.target.value))}>
                <option value={0}>Không</option>
                <option value={1}>Có</option>
              </select>
            </div>
            <div>
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Hiển thị</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
          </div>
          {error && <div style={{ padding: '10px 14px', borderRadius: 8, background: '#fff0f0', color: 'var(--danger)', fontSize: 13, border: '1px solid #fdd' }}>{error}</div>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm món'}</button>
            <button type="button" onClick={() => navigate('/menu-items')} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontSize: 14, color: 'var(--text-2)' }}>Hủy</button>
          </div>
        </div>
      </form>
    </div>
  )
}
