import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

// 6 màu chuẩn của template gốc (assets/js/products-data.js — mảng COLORS).
// Phải khớp 100% với COLOR_SWATCHES ở website/src/data/filters.ts —
// bộ lọc "Màu sắc" trên site chỉ nhận diện đúng các tên khai báo ở đây.
// Mỗi sản phẩm chỉ có ĐÚNG 1 màu (khác pattern multi-color của site khác) — chọn 1 swatch là đủ.
const COLOR_SWATCHES = [
  { name: 'Nâu gỗ', hex: '#8b5e3c' },
  { name: 'Trắng kem', hex: '#f3ece1' },
  { name: 'Đen', hex: '#242424' },
  { name: 'Xám', hex: '#9a9691' },
  { name: 'Be', hex: '#d8c7ac' },
  { name: 'Xanh rêu', hex: '#5c6b4f' },
]

const MATERIALS = [
  { value: 'go-tu-nhien', label: 'Gỗ tự nhiên' },
  { value: 'go-cong-nghiep', label: 'Gỗ công nghiệp' },
  { value: 'kim-loai', label: 'Kim loại' },
  { value: 'vai-boc', label: 'Vải bọc' },
  { value: 'da', label: 'Da' },
  { value: 'may-tre', label: 'Mây tre đan' },
  { value: 'khac', label: 'Khác' },
]

const ROOMS = [
  { value: 'phong-khach', label: 'Phòng khách' },
  { value: 'phong-an', label: 'Phòng ăn' },
  { value: 'phong-ngu', label: 'Phòng ngủ' },
  { value: 'phong-lam-viec', label: 'Phòng làm việc' },
  { value: 'ban-cong-san-vuon', label: 'Ban công & sân vườn' },
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
interface Collection { id: number; name: string }
interface FormData {
  name: string
  category_id: string
  collection_id: string
  image: string
  price: string
  price_sale: string
  badge: string
  description: string
  colors: string
  material: string
  room: string
  rating: string
  sold: string
  in_stock: boolean
  is_featured: boolean
  is_new: boolean
  status: string
  sort_order: string
}

const EMPTY: FormData = {
  name: '', category_id: '', collection_id: '', image: '', price: '', price_sale: '',
  badge: '', description: '', colors: '', material: '', room: '', rating: '5', sold: '0',
  in_stock: true, is_featured: false, is_new: false,
  status: 'published', sort_order: '0'
}

export default function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [cats, setCats] = useState<Category[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCats = api.get<Category[]>('/product-categories')
    const fetchCollections = api.get<Collection[]>('/collections')
    const fetchProduct = isEdit
      ? api.get<Record<string, unknown>>(`/products/${id}`)
      : Promise.resolve(null)

    Promise.all([fetchCats, fetchCollections, fetchProduct]).then(([cats, collections, p]) => {
      setCats(cats)
      setCollections(collections)
      if (p) {
        setForm({
          name: String(p.name ?? ''),
          category_id: String(p.category_id ?? ''),
          collection_id: String(p.collection_id ?? ''),
          image: String(p.image ?? ''),
          price: String(p.price ?? ''),
          price_sale: String(p.price_sale ?? ''),
          badge: String(p.badge ?? ''),
          description: String(p.description ?? ''),
          colors: String(p.colors ?? ''),
          material: String(p.material ?? ''),
          room: String(p.room ?? ''),
          rating: String(p.rating ?? '5'),
          sold: String(p.sold ?? '0'),
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
    // Mỗi sản phẩm chỉ có 1 màu theo template — chọn swatch mới sẽ thay thế màu cũ.
    const next = selectedColors.includes(name) ? [] : [name]
    set('colors', serializeColors(next))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên sản phẩm không được để trống'); return }
    setSaving(true); setError('')
    const payload = {
      ...form,
      category_id: form.category_id ? Number(form.category_id) : null,
      collection_id: form.collection_id ? Number(form.collection_id) : null,
      price: Number(form.price) || 0,
      price_sale: Number(form.price_sale) || 0,
      rating: Math.max(0, Math.min(5, Number(form.rating) || 5)),
      sold: Number(form.sold) || 0,
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
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="VD: Sofa băng vải bố 3 chỗ ngồi Rustic" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Danh mục</label>
            <select value={form.category_id} onChange={e => set('category_id', e.target.value)}>
              <option value="">-- Chọn danh mục --</option>
              {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Bộ sưu tập</label>
            <select value={form.collection_id} onChange={e => set('collection_id', e.target.value)}>
              <option value="">-- Không thuộc bộ sưu tập --</option>
              {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
            <input type="number" value={form.price} onChange={e => set('price', e.target.value)} min={0} placeholder="VD: 8900000" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Giá sale (VND)</label>
            <input type="number" value={form.price_sale} onChange={e => set('price_sale', e.target.value)} min={0} placeholder="VD: 7490000" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Badge</label>
            <select value={form.badge} onChange={e => set('badge', e.target.value)}>
              <option value="">Không có</option>
              <option value="sale">Giảm giá</option>
              <option value="new">Mới về</option>
              <option value="hot">Bán chạy</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Chất liệu</label>
            <select value={form.material} onChange={e => set('material', e.target.value)}>
              <option value="">-- Chọn chất liệu --</option>
              {MATERIALS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Không gian phù hợp</label>
            <select value={form.room} onChange={e => set('room', e.target.value)}>
              <option value="">-- Chọn không gian --</option>
              {ROOMS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Mô tả sản phẩm</label>
          <textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả chi tiết sản phẩm..." />
        </div>

        <div className="form-group">
          <label>Màu sắc (dùng cho bộ lọc "Màu sắc" ở trang chủ)</label>
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
                    border: c.hex === '#ffffff' || c.hex === '#f3ece1' ? '1px solid #ddd' : 'none',
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
            <label>Đã bán (số lượng)</label>
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
