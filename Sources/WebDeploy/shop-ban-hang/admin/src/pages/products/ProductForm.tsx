import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import GalleryField from '../../components/GalleryField'

// Phải khớp 100% với COLOR_SWATCHES ở website/src/pages/ProductsPage.tsx —
// bộ lọc "Màu sắc" trên site chỉ nhận diện đúng các tên này.
const COLOR_SWATCHES = [
  { name: 'Terracotta', hex: '#c4603a' },
  { name: 'Sage',       hex: '#6b8a7a' },
  { name: 'Kem',        hex: '#f7f3ee' },
  { name: 'Đen',        hex: '#1e1610' },
  { name: 'Trắng',      hex: '#ffffff' },
  { name: 'Nâu',        hex: '#8b6f5e' },
]

function parseColorNames(colors: string): string[] {
  return colors.split('|').map(c => c.split(':')[0]).filter(Boolean)
}

function serializeColors(names: string[]): string {
  return names
    .map(name => COLOR_SWATCHES.find(c => c.name === name))
    .filter((c): c is { name: string; hex: string } => Boolean(c))
    .map(c => `${c.name}:${c.hex}`)
    .join('|')
}

interface Category { id: number; name: string }
interface FormData {
  name: string
  category_id: string
  image: string
  price: string
  price_sale: string
  badge: string
  description: string
  material: string
  colors: string
  gallery: string
  rating: string
  in_stock: boolean
  is_featured: boolean
  is_new: boolean
  status: string
  sort_order: string
}

const EMPTY: FormData = {
  name: '', category_id: '', image: '', price: '', price_sale: '',
  badge: '', description: '', material: '', colors: '', gallery: '', rating: '5', in_stock: true,
  is_featured: false, is_new: false,
  status: 'published', sort_order: '0'
}

export default function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCats = api.get<Category[]>('/product-categories')
    const fetchProduct = isEdit
      ? api.get<Record<string, unknown>>(`/products/${id}`)
      : Promise.resolve(null)

    Promise.all([fetchCats, fetchProduct]).then(([cats, p]) => {
      setCats(cats)
      if (p) {
        setForm({
          name: String(p.name ?? ''),
          category_id: String(p.category_id ?? ''),
          image: String(p.image ?? ''),
          price: String(p.price ?? ''),
          price_sale: String(p.price_sale ?? ''),
          badge: String(p.badge ?? ''),
          description: String(p.description ?? ''),
          material: String(p.material ?? ''),
          colors: String(p.colors ?? ''),
          gallery: String(p.gallery ?? ''),
          rating: String(p.rating ?? '5'),
          in_stock: p.in_stock === undefined ? true : Boolean(p.in_stock),
          is_featured: Boolean(p.is_featured),
          is_new: Boolean(p.is_new),
          status: String(p.status ?? 'published'),
          sort_order: String(p.sort_order ?? '0'),
        })
      }
    }).catch(() => setError('Không tải được dữ liệu'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (k: keyof FormData, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  const selectedColors = parseColorNames(form.colors)
  const toggleColor = (name: string) => {
    const next = selectedColors.includes(name) ? selectedColors.filter(c => c !== name) : [...selectedColors, name]
    set('colors', serializeColors(next))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên sản phẩm không được để trống'); return }
    setSaving(true); setError('')
    const payload = {
      ...form,
      category_id: form.category_id ? Number(form.category_id) : null,
      price: Number(form.price) || 0,
      price_sale: Number(form.price_sale) || 0,
      rating: Math.max(0, Math.min(5, Number(form.rating) || 5)),
      in_stock: form.in_stock ? 1 : 0,
      sort_order: Number(form.sort_order) || 0,
    }
    try {
      if (isEdit) {
        await api.post(`/products/${id}/update`, payload)
      } else {
        await api.post('/products', payload)
      }
      navigate('/products')
    } catch {
      setError('Lưu thất bại, vui lòng thử lại')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading-box">Đang tải...</div>

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">{isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {error && <div className="form-error-banner">{error}</div>}

        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label>Tên sản phẩm <span className="req">*</span></label>
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="VD: Túi vải đay thủ công" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Danh mục</label>
            <select value={form.category_id} onChange={e => set('category_id', e.target.value)}>
              <option value="">-- Chọn danh mục --</option>
              {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>URL Ảnh</label>
          <input type="text" value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." />
          {form.image && <img src={form.image} alt="preview" style={{ marginTop: 8, height: 100, objectFit: 'cover', borderRadius: 8 }} />}
        </div>

        <div className="form-group">
          <label>Ảnh gallery</label>
          <GalleryField value={form.gallery} onChange={v => set('gallery', v)} />
          <small style={{ color: 'var(--text-3)', fontSize: 11 }}>Ảnh phụ hiển thị trong trang chi tiết sản phẩm.</small>
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Giá (VND)</label>
            <input type="number" value={form.price} onChange={e => set('price', e.target.value)} min={0} placeholder="VD: 299000" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Giá sale (VND)</label>
            <input type="number" value={form.price_sale} onChange={e => set('price_sale', e.target.value)} min={0} placeholder="VD: 249000" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Badge</label>
            <input type="text" value={form.badge} onChange={e => set('badge', e.target.value)} placeholder="VD: Bán chạy, Mới, -20%" />
          </div>
        </div>

        <div className="form-group">
          <label>Mô tả sản phẩm</label>
          <textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả chi tiết sản phẩm..." />
        </div>

        <div className="form-group">
          <label>Chất liệu</label>
          <input type="text" value={form.material} onChange={e => set('material', e.target.value)} placeholder="VD: Vải đay tự nhiên, cotton hữu cơ" />
        </div>

        <div className="form-group">
          <label>Màu sắc (dùng cho bộ lọc "Màu sắc" ở trang Sản phẩm)</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
            {COLOR_SWATCHES.map(c => {
              const active = selectedColors.includes(c.name)
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => toggleColor(c.name)}
                  title={c.name}
                  aria-pressed={active}
                  aria-label={`Màu ${c.name}`}
                  style={{
                    width: 30, height: 30, borderRadius: '50%', background: c.hex, padding: 0, cursor: 'pointer',
                    border: c.hex === '#ffffff' ? '1px solid #ddd' : 'none',
                    boxShadow: active ? '0 0 0 2px #fff, 0 0 0 4px var(--accent)' : 'none',
                    transition: 'box-shadow .15s',
                  }}
                />
              )
            })}
          </div>
          {selectedColors.length > 0 && (
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 8 }}>Đã chọn: {selectedColors.join(', ')}</p>
          )}
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Trạng thái</label>
            <select value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Nháp</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Đánh giá (0-5 sao)</label>
            <input type="number" value={form.rating} onChange={e => set('rating', e.target.value)} min={0} max={5} step={0.1} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Thứ tự sắp xếp</label>
            <input type="number" value={form.sort_order} onChange={e => set('sort_order', e.target.value)} min={0} />
          </div>
        </div>

        <div className="form-row" style={{ gap: 24 }}>
          <label className="form-check">
            <input type="checkbox" checked={form.in_stock} onChange={e => set('in_stock', e.target.checked)} />
            <span>Còn hàng</span>
          </label>
          <label className="form-check">
            <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} />
            <span>Sản phẩm nổi bật</span>
          </label>
          <label className="form-check">
            <input type="checkbox" checked={form.is_new} onChange={e => set('is_new', e.target.checked)} />
            <span>Sản phẩm mới</span>
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/products')}>Hủy</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
        </div>
      </form>
    </div>
  )
}
