import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

// ▼ Khớp 100% với COLOR_SWATCHES ở website/src/pages/ProductsPage.tsx —
// bộ lọc "Màu thân máy" trên site chỉ nhận diện đúng các tên khai báo ở đây.
// Nguồn: san-pham.html sidebar "Màu thân máy".
const COLOR_SWATCHES = [
  { name: 'Đen', hex: '#1c1c1c' },
  { name: 'Bạc', hex: '#c7c9cb' },
  { name: 'Trắng', hex: '#f2f1ec' },
  { name: 'Xanh rêu', hex: '#5c6650' },
]

// ▼ Khớp bộ lọc "Thương hiệu" ở san-pham.html — chỉ áp dụng cho thân máy/ống kính,
// phụ kiện (tripod, flash, thẻ nhớ, balo...) để trống.
const BRAND_OPTIONS = ['Sony', 'Canon', 'Fujifilm', 'Nikon']

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
  colors: string
  rating: string
  in_stock: boolean
  is_featured: boolean
  is_new: boolean
  status: string
  sort_order: string
  // ▼ Mở rộng riêng cho shop-may-anh — đã thêm tương ứng vào ProductController.php::BASE_FIELDS
  brand: string
  gallery: string
  bundle_options: string
  specs: string
  review_count: string
  sold_count: string
}

const EMPTY: FormData = {
  name: '', category_id: '', image: '', price: '', price_sale: '',
  badge: '', description: '', colors: '', rating: '5', in_stock: true,
  is_featured: false, is_new: false,
  status: 'published', sort_order: '0',
  brand: '', gallery: '', bundle_options: '', specs: '', review_count: '0', sold_count: '0',
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
          brand: String(p.brand ?? ''),
          gallery: String(p.gallery ?? ''),
          bundle_options: String(p.bundle_options ?? ''),
          specs: String(p.specs ?? ''),
          review_count: String(p.review_count ?? '0'),
          sold_count: String(p.sold_count ?? '0'),
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
      review_count: Number(form.review_count) || 0,
      sold_count: Number(form.sold_count) || 0,
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
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="VD: Sony Alpha A7 IV (Thân máy)" />
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
            <input type="number" value={form.price} onChange={e => set('price', e.target.value)} min={0} placeholder="VD: 56990000" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Giá sale (VND, để trống nếu không giảm)</label>
            <input type="number" value={form.price_sale} onChange={e => set('price_sale', e.target.value)} min={0} placeholder="VD: 52990000" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Badge</label>
            <input type="text" value={form.badge} onChange={e => set('badge', e.target.value)} placeholder="VD: Bán chạy, Mới, -12%" />
          </div>
        </div>

        <div className="form-group">
          <label>Mô tả sản phẩm</label>
          <textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả chi tiết sản phẩm..." />
        </div>

        <div className="form-group">
          <label>Ảnh gallery phụ (trang chi tiết) — mỗi URL cách nhau dấu | </label>
          <textarea
            rows={2}
            value={form.gallery}
            onChange={e => set('gallery', e.target.value)}
            placeholder="https://...anh2.jpg|https://...anh3.jpg|https://...anh4.jpg"
          />
        </div>

        <div className="form-group">
          <label>Gói phụ kiện — mỗi lựa chọn cách nhau dấu |</label>
          <input
            type="text"
            value={form.bundle_options}
            onChange={e => set('bundle_options', e.target.value)}
            placeholder="Chỉ thân máy|Kèm ống kính kit 28-70mm|Full-box phụ kiện (thẻ nhớ + túi + pin)"
          />
          <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6 }}>Để trống nếu sản phẩm không có gói phụ kiện (vd tripod, thẻ nhớ).</p>
        </div>

        <div className="form-group">
          <label>Thông số kỹ thuật — mỗi dòng dạng "Nhãn:Giá trị", cách nhau dấu |</label>
          <textarea
            rows={3}
            value={form.specs}
            onChange={e => set('specs', e.target.value)}
            placeholder="Cảm biến:Exmor R CMOS full-frame 33MP|Chip xử lý:BIONZ XR|Bảo hành:24 tháng chính hãng"
          />
        </div>

        <div className="form-group">
          <label>Màu thân máy (dùng cho bộ lọc "Màu thân máy" ở trang Sản phẩm)</label>
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
                    border: c.hex === '#f2f1ec' ? '1px solid #ddd' : 'none',
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
          <label>Thương hiệu (chỉ áp dụng thân máy/ống kính — dùng cho bộ lọc "Thương hiệu")</label>
          <select value={form.brand} onChange={e => set('brand', e.target.value)}>
            <option value="">-- Không áp dụng (phụ kiện) --</option>
            {BRAND_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
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
            <label>Số lượt đánh giá</label>
            <input type="number" value={form.review_count} onChange={e => set('review_count', e.target.value)} min={0} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Đã bán</label>
            <input type="number" value={form.sold_count} onChange={e => set('sold_count', e.target.value)} min={0} />
          </div>
        </div>

        <div className="form-group" style={{ maxWidth: 160 }}>
          <label>Thứ tự sắp xếp</label>
          <input type="number" value={form.sort_order} onChange={e => set('sort_order', e.target.value)} min={0} />
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
