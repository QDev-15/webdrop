import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

// ▼ Khớp 100% với bộ lọc "Màu sắc" ở san-pham.html / website/src/pages/ProductsPage.tsx —
// mỗi sản phẩm chỉ có ĐÚNG 1 màu cố định (không phải chọn nhiều biến thể như site khác),
// nên colors lưu 1 giá trị slug thô (không phải "Tên:#hex" pipe-separated).
const COLOR_OPTIONS = [
  { slug: 'den', label: 'Đen' },
  { slug: 'trang', label: 'Trắng' },
  { slug: 'xanh', label: 'Xanh' },
  { slug: 'tim', label: 'Tím' },
  { slug: 'vang', label: 'Vàng' },
  { slug: 'bac', label: 'Bạc' },
]

// ▼ Khớp bộ lọc "Thương hiệu" ở san-pham.html
const BRAND_OPTIONS = [
  { slug: 'apple', label: 'Apple' },
  { slug: 'samsung', label: 'Samsung' },
  { slug: 'xiaomi', label: 'Xiaomi' },
  { slug: 'oppo', label: 'OPPO' },
  { slug: 'sony', label: 'Sony' },
  { slug: 'jbl', label: 'JBL' },
  { slug: 'anker', label: 'Anker' },
]

// ▼ Khớp các section trang chủ (mb-scroll-row/mb-prod-grid theo theme) + link "Xem tất cả" (?theme=)
const THEME_OPTIONS = [
  { slug: 'noi-bat', label: 'Điện thoại nổi bật (trang chủ)' },
  { slug: 'phu-kien', label: 'Phụ kiện hot (trang chủ)' },
  { slug: 'moi-ve', label: 'Hàng mới về (trang chủ)' },
  { slug: 'giam-gia', label: 'Đang giảm giá (trang chủ + Khuyến mãi)' },
]

const BADGE_OPTIONS = [
  { value: '', label: '-- Không có --' },
  { value: 'hot', label: 'HOT' },
  { value: 'sale', label: 'SALE' },
  { value: 'new', label: 'MỚI' },
]

interface Category { id: number; name: string }
interface FormData {
  name: string
  category_id: string
  image: string
  price: string
  price_sale: string
  badge: string
  description: string
  colors: string
  rating: string
  in_stock: boolean
  is_featured: boolean
  is_new: boolean
  status: string
  sort_order: string
  // ▼ Mở rộng riêng cho shop-ami-mobile — đã thêm tương ứng vào ProductController.php::BASE_FIELDS
  brand: string
  theme: string[]
  sold: string
}

const EMPTY: FormData = {
  name: '', category_id: '', image: '', price: '', price_sale: '',
  badge: '', description: '', colors: 'den', rating: '5', in_stock: true,
  is_featured: false, is_new: false,
  status: 'published', sort_order: '0',
  brand: '', theme: [], sold: '0',
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
          colors: String(p.colors ?? 'den'),
          rating: String(p.rating ?? '5'),
          in_stock: p.in_stock === undefined ? true : Boolean(p.in_stock),
          is_featured: Boolean(p.is_featured),
          is_new: Boolean(p.is_new),
          status: String(p.status ?? 'published'),
          sort_order: String(p.sort_order ?? '0'),
          brand: String(p.brand ?? ''),
          theme: String(p.theme ?? '').split(',').map(t => t.trim()).filter(Boolean),
          sold: String(p.sold ?? '0'),
        })
      }
    }).catch(() => setError('Không tải được dữ liệu'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (k: keyof FormData, v: string | boolean | string[]) => setForm(f => ({ ...f, [k]: v }))

  const toggleTheme = (slug: string) => {
    set('theme', form.theme.includes(slug) ? form.theme.filter(t => t !== slug) : [...form.theme, slug])
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
      theme: form.theme.join(','),
      sold: Number(form.sold) || 0,
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
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="VD: iPhone 16 Pro Max 256GB Natural Titanium" />
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
          <label>Ảnh sản phẩm</label>
          <ImageField value={form.image} onChange={v => set('image', v)} />
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Giá (VND)</label>
            <input type="number" value={form.price} onChange={e => set('price', e.target.value)} min={0} placeholder="VD: 49990000" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Giá sale (VND, để trống nếu không giảm)</label>
            <input type="number" value={form.price_sale} onChange={e => set('price_sale', e.target.value)} min={0} placeholder="VD: 37990000" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Badge</label>
            <select value={form.badge} onChange={e => set('badge', e.target.value)}>
              {BADGE_OPTIONS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Mô tả sản phẩm</label>
          <textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả chi tiết sản phẩm..." />
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Thương hiệu (dùng cho bộ lọc "Thương hiệu")</label>
            <select value={form.brand} onChange={e => set('brand', e.target.value)}>
              <option value="">-- Chọn thương hiệu --</option>
              {BRAND_OPTIONS.map(b => <option key={b.slug} value={b.slug}>{b.label}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Màu sắc (dùng cho bộ lọc "Màu sắc")</label>
            <select value={form.colors} onChange={e => set('colors', e.target.value)}>
              {COLOR_OPTIONS.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Hiển thị ở section trang chủ (có thể chọn nhiều)</label>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 4 }}>
            {THEME_OPTIONS.map(t => (
              <label key={t.slug} className="form-check">
                <input type="checkbox" checked={form.theme.includes(t.slug)} onChange={() => toggleTheme(t.slug)} />
                <span>{t.label}</span>
              </label>
            ))}
          </div>
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
            <label>Đã bán</label>
            <input type="number" value={form.sold} onChange={e => set('sold', e.target.value)} min={0} />
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
