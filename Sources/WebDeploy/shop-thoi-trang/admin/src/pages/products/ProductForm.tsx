import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

// Phải khớp với bộ màu dùng ở website/src/pages/ProductsPage.tsx (filter "Màu sắc")
const COLOR_SWATCHES = [
  { name: 'Trắng',      hex: '#ffffff' },
  { name: 'Đen',        hex: '#0a0a0a' },
  { name: 'Xanh dương', hex: '#0052ff' },
  { name: 'Đỏ hồng',    hex: '#e11d48' },
  { name: 'Vàng bơ',    hex: '#d4a027' },
  { name: 'Xanh lá',    hex: '#16a34a' },
  { name: 'Tím',        hex: '#7c3aed' },
  { name: 'Cam',        hex: '#ea580c' },
  { name: 'Xám',        hex: '#6b7280' },
  { name: 'Kem',        hex: '#f0ead6' },
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

interface SpecRow { label: string; value: string }

function parseSpecs(json: string): SpecRow[] {
  try {
    const arr = JSON.parse(json || '[]')
    if (Array.isArray(arr)) return arr.map((r: unknown) => Array.isArray(r) ? { label: String(r[0] ?? ''), value: String(r[1] ?? '') } : { label: '', value: '' })
  } catch { /* ignore */ }
  return []
}

function serializeSpecs(rows: SpecRow[]): string {
  const filtered = rows.filter(r => r.label.trim() || r.value.trim())
  return JSON.stringify(filtered.map(r => [r.label, r.value]))
}

interface Category { id: number; name: string }
interface FormData {
  name: string
  brand: string
  category_id: string
  image: string
  gallery: string
  price: string
  price_sale: string
  badge: string
  description: string
  features: string
  specsJson: string
  material: string
  origin: string
  colors: string
  sizes: string
  rating: string
  review_count: string
  sold_count: string
  stock_qty: string
  in_stock: boolean
  is_featured: boolean
  is_new: boolean
  status: string
  sort_order: string
}

const EMPTY: FormData = {
  name: '', brand: 'Nova Store', category_id: '', image: '', gallery: '',
  price: '', price_sale: '', badge: '', description: '', features: '', specsJson: '[]',
  material: '', origin: 'Việt Nam', colors: '', sizes: '',
  rating: '5', review_count: '0', sold_count: '0', stock_qty: '50', in_stock: true,
  is_featured: false, is_new: false,
  status: 'published', sort_order: '0',
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
          brand: String(p.brand ?? ''),
          category_id: String(p.category_id ?? ''),
          image: String(p.image ?? ''),
          gallery: String(p.gallery ?? ''),
          price: String(p.price ?? ''),
          price_sale: String(p.price_sale ?? ''),
          badge: String(p.badge ?? ''),
          description: String(p.description ?? ''),
          features: String(p.features ?? ''),
          specsJson: String(p.specs ?? '[]'),
          material: String(p.material ?? ''),
          origin: String(p.origin ?? 'Việt Nam'),
          colors: String(p.colors ?? ''),
          sizes: String(p.sizes ?? ''),
          rating: String(p.rating ?? '5'),
          review_count: String(p.review_count ?? '0'),
          sold_count: String(p.sold_count ?? '0'),
          stock_qty: String(p.stock_qty ?? '0'),
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

  const galleryUrls = form.gallery.split('|').map(s => s.trim()).filter(Boolean)
  const setGalleryAt = (idx: number, url: string) => {
    const next = [...galleryUrls]
    if (url) next[idx] = url; else next.splice(idx, 1)
    set('gallery', next.filter(Boolean).join('|'))
  }
  const addGallerySlot = () => set('gallery', [...galleryUrls, ''].join('|'))

  const specRows = parseSpecs(form.specsJson)
  const setSpecRow = (idx: number, patch: Partial<SpecRow>) => {
    const next = specRows.map((r, i) => i === idx ? { ...r, ...patch } : r)
    set('specsJson', serializeSpecs(next))
  }
  const removeSpecRow = (idx: number) => set('specsJson', serializeSpecs(specRows.filter((_, i) => i !== idx)))
  const addSpecRow = () => set('specsJson', serializeSpecs([...specRows, { label: '', value: '' }]))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên sản phẩm không được để trống'); return }
    setSaving(true); setError('')
    const payload = {
      name: form.name,
      brand: form.brand,
      category_id: form.category_id ? Number(form.category_id) : null,
      image: form.image,
      gallery: form.gallery,
      price: Number(form.price) || 0,
      price_sale: form.price_sale ? Number(form.price_sale) : '',
      badge: form.badge,
      description: form.description,
      features: form.features,
      specs: form.specsJson,
      material: form.material,
      origin: form.origin,
      colors: form.colors,
      sizes: form.sizes,
      rating: Math.max(0, Math.min(5, Number(form.rating) || 5)),
      review_count: Math.max(0, Number(form.review_count) || 0),
      sold_count: Math.max(0, Number(form.sold_count) || 0),
      stock_qty: Math.max(0, Number(form.stock_qty) || 0),
      in_stock: form.in_stock ? 1 : 0,
      is_featured: form.is_featured ? 1 : 0,
      is_new: form.is_new ? 1 : 0,
      status: form.status,
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

      <form onSubmit={handleSubmit} className="admin-form" style={{ maxWidth: 880 }}>
        {error && <div className="form-error-banner">{error}</div>}

        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label>Tên sản phẩm <span className="req">*</span></label>
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="VD: Áo Blouse Crinkle Tay Phồng" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Danh mục</label>
            <select value={form.category_id} onChange={e => set('category_id', e.target.value)}>
              <option value="">-- Chọn danh mục --</option>
              {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Thương hiệu</label>
            <input type="text" value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="VD: Nova Store" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Xuất xứ</label>
            <input type="text" value={form.origin} onChange={e => set('origin', e.target.value)} placeholder="VD: Việt Nam" />
          </div>
        </div>

        <div className="form-group">
          <ImageField label="Ảnh chính" value={form.image} onChange={v => set('image', v)} />
        </div>

        <div className="form-group">
          <label>Ảnh phụ (gallery — hiển thị dạng thumbnail ở trang chi tiết)</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {galleryUrls.map((url, i) => (
              <ImageField key={i} value={url} onChange={v => setGalleryAt(i, v)} />
            ))}
          </div>
          <button type="button" className="btn btn-sm btn-outline" style={{ marginTop: 8 }} onClick={addGallerySlot}>+ Thêm ảnh phụ</button>
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Giá (VND)</label>
            <input type="number" value={form.price} onChange={e => set('price', e.target.value)} min={0} placeholder="VD: 425000" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Giá sale (VND)</label>
            <input type="number" value={form.price_sale} onChange={e => set('price_sale', e.target.value)} min={0} placeholder="VD: 350000" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Badge</label>
            <input type="text" value={form.badge} onChange={e => set('badge', e.target.value)} placeholder="VD: Mới, Hot, -20%" />
          </div>
        </div>

        <div className="form-group">
          <label>Mô tả ngắn</label>
          <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả ngắn gọn về sản phẩm..." />
        </div>

        <div className="form-group">
          <label>Điểm nổi bật (mỗi dòng 1 gạch đầu dòng — hiển thị ở tab "Mô tả")</label>
          <textarea rows={4} value={form.features} onChange={e => set('features', e.target.value)} placeholder={'Chất liệu cao cấp...\nForm dáng thoải mái...'} />
        </div>

        <div className="form-group">
          <label>Chất liệu</label>
          <input type="text" value={form.material} onChange={e => set('material', e.target.value)} placeholder="VD: Cotton 100%" />
        </div>

        <div className="form-group">
          <label>Màu sắc (dùng cho bộ lọc "Màu sắc" ở trang Bộ sưu tập)</label>
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

        <div className="form-group">
          <label>Size (cách nhau bằng dấu | — dùng cho bộ lọc "Size" ở trang Bộ sưu tập)</label>
          <input type="text" value={form.sizes} onChange={e => set('sizes', e.target.value)} placeholder="VD: XS|S|M|L|XL|XXL hoặc 38|39|40|41|42" />
        </div>

        <div className="form-group">
          <label>Thông số kỹ thuật (hiển thị ở tab "Thông số")</label>
          {specRows.map((row, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input type="text" value={row.label} onChange={e => setSpecRow(i, { label: e.target.value })} placeholder="Nhãn (VD: Form dáng)" style={{ flex: 1 }} />
              <input type="text" value={row.value} onChange={e => setSpecRow(i, { value: e.target.value })} placeholder="Giá trị" style={{ flex: 2 }} />
              <button type="button" className="btn btn-sm btn-danger" onClick={() => removeSpecRow(i)}>Xóa</button>
            </div>
          ))}
          <button type="button" className="btn btn-sm btn-outline" onClick={addSpecRow}>+ Thêm thông số</button>
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
            <label>Đánh giá (0–5 sao)</label>
            <input type="number" value={form.rating} onChange={e => set('rating', e.target.value)} min={0} max={5} step={0.1} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Số lượt đánh giá</label>
            <input type="number" value={form.review_count} onChange={e => set('review_count', e.target.value)} min={0} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Đã bán</label>
            <input type="number" value={form.sold_count} onChange={e => set('sold_count', e.target.value)} min={0} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Tồn kho</label>
            <input type="number" value={form.stock_qty} onChange={e => set('stock_qty', e.target.value)} min={0} />
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
