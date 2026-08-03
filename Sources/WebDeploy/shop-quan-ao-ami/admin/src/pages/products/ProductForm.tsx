import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'
import GalleryField from '../../components/GalleryField'

// ▼ Palette thật của AMI Fashion (khớp COLOR_LABELS/COLOR_HEX trong products-data.js gốc).
// Phải khớp 100% với COLOR_OPTIONS ở website/src/pages/ProductsPage.tsx —
// bộ lọc "Màu sắc" trên site chỉ nhận diện đúng các tên khai báo ở đây.
const COLOR_SWATCHES = [
  { name: 'Trắng', hex: '#f5f5f3' },
  { name: 'Đen', hex: '#1a1916' },
  { name: 'Be', hex: '#e8d5b8' },
  { name: 'Xám', hex: '#9e9b95' },
  { name: 'Xanh Navy', hex: '#1e3a5f' },
  { name: 'Hồng', hex: '#f4a7b9' },
  { name: 'Vàng Kem', hex: '#f0d57c' },
]

// AMI Fashion: mỗi sản phẩm chỉ có ĐÚNG 1 màu (khác site khác cho phép nhiều swatch/sản phẩm) —
// vẫn lưu theo convention chung "Tên:#hex" (rule 24) để đồng bộ với ProductController whitelist,
// nhưng UI chỉ cho chọn 1 màu (radio-like, không phải multi-toggle).
function parseColorName(colors: string): string {
  return colors.split('|')[0]?.split(':')[0] ?? ''
}

function serializeColor(name: string): string {
  const c = COLOR_SWATCHES.find(x => x.name === name)
  return c ? `${c.name}:${c.hex}` : ''
}

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL']
const THEME_OPTIONS = [
  { value: 'hang-moi', label: 'Hàng mới về' },
  { value: 'ban-chay', label: 'Bán chạy nhất' },
  { value: 'giam-gia', label: 'Đang giảm giá' },
]

// Padded pipe "|XS|S|M|" — tránh substring lệch (vd "S" khớp nhầm trong "XS") khi filter ở backend.
function parsePadded(v: string): string[] {
  return v.split('|').map(s => s.trim()).filter(Boolean)
}
function serializePadded(items: string[]): string {
  return items.length ? '|' + items.join('|') + '|' : ''
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
  colors: string
  rating: string
  in_stock: boolean
  is_featured: boolean
  is_new: boolean
  status: string
  sort_order: string
  // ▼ EXTRA FIELDS (shop-quan-ao-ami): sizes/theme lưu padded pipe, sold là số nguyên.
  sizes: string
  theme: string
  sold: string
  gallery: string
}

const EMPTY: FormData = {
  name: '', category_id: '', image: '', price: '', price_sale: '',
  badge: '', description: '', colors: '', rating: '5', in_stock: true,
  is_featured: false, is_new: false,
  status: 'published', sort_order: '0',
  sizes: '', theme: '', sold: '0', gallery: '',
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
          colors: String(p.colors ?? ''),
          rating: String(p.rating ?? '5'),
          in_stock: p.in_stock === undefined ? true : Boolean(p.in_stock),
          is_featured: Boolean(p.is_featured),
          is_new: Boolean(p.is_new),
          status: String(p.status ?? 'published'),
          sort_order: String(p.sort_order ?? '0'),
          sizes: String(p.sizes ?? ''),
          theme: String(p.theme ?? ''),
          sold: String(p.sold ?? '0'),
          gallery: String(p.gallery ?? ''),
        })
      }
    }).catch(() => setError('Không tải được dữ liệu'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (k: keyof FormData, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  const selectedColor = parseColorName(form.colors)
  const chooseColor = (name: string) => set('colors', serializeColor(name))

  const selectedSizes = parsePadded(form.sizes)
  const toggleSize = (s: string) => {
    const next = selectedSizes.includes(s) ? selectedSizes.filter(x => x !== s) : [...selectedSizes, s]
    set('sizes', serializePadded(next))
  }

  const selectedThemes = parsePadded(form.theme)
  const toggleTheme = (t: string) => {
    const next = selectedThemes.includes(t) ? selectedThemes.filter(x => x !== t) : [...selectedThemes, t]
    set('theme', serializePadded(next))
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
          <label>Ảnh sản phẩm</label>
          <ImageField value={form.image} onChange={v => set('image', v)} />
        </div>

        <div className="form-group">
          <label>Ảnh gallery (ảnh bổ sung hiển thị trong trang chi tiết sản phẩm)</label>
          <GalleryField value={form.gallery} onChange={v => set('gallery', v)} />
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
          <label>Màu sắc (mỗi sản phẩm AMI chỉ có 1 màu — dùng cho bộ lọc "Màu sắc" ở trang Sản phẩm)</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
            {COLOR_SWATCHES.map(c => {
              const active = selectedColor === c.name
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => chooseColor(c.name)}
                  title={c.name}
                  aria-pressed={active}
                  aria-label={`Màu ${c.name}`}
                  style={{
                    width: 30, height: 30, borderRadius: '50%', background: c.hex, padding: 0, cursor: 'pointer',
                    border: c.hex === '#ffffff' || c.hex === '#f5f5f3' ? '1px solid #ddd' : 'none',
                    boxShadow: active ? '0 0 0 2px #fff, 0 0 0 4px var(--accent)' : 'none',
                    transition: 'box-shadow .15s',
                  }}
                />
              )
            })}
          </div>
          {selectedColor && (
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 8 }}>Đã chọn: {selectedColor}</p>
          )}
        </div>

        <div className="form-group">
          <label>Size có sẵn (dùng cho bộ lọc "Size" ở trang Sản phẩm)</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
            {SIZE_OPTIONS.map(s => {
              const active = selectedSizes.includes(s)
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSize(s)}
                  aria-pressed={active}
                  className={active ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </div>

        <div className="form-group">
          <label>Nhãn trang chủ (theme — quyết định sản phẩm xuất hiện ở section nào của Trang chủ)</label>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 4 }}>
            {THEME_OPTIONS.map(t => (
              <label key={t.value} className="form-check">
                <input type="checkbox" checked={selectedThemes.includes(t.value)} onChange={() => toggleTheme(t.value)} />
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
