import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'
import GalleryField from '../../components/GalleryField'

// Site này (LUMIÈRE Beauty — mỹ phẩm) không có bộ lọc "Màu sắc" trong template gốc — thay vào đó
// dùng 2 dimension riêng: "Loại da" (skin_type) + "Chủ đề trang chủ" (theme). Không dùng COLOR_SWATCHES.
const SKIN_TYPES = [
  { slug: 'da-dau', label: 'Da dầu' },
  { slug: 'da-kho', label: 'Da khô' },
  { slug: 'da-hon-hop', label: 'Da hỗn hợp' },
  { slug: 'da-nhay-cam', label: 'Da nhạy cảm' },
  { slug: 'moi-loai-da', label: 'Mọi loại da' },
]
const THEME_OPTIONS = [
  { slug: 'ban-chay', label: 'Bán chạy nhất' },
  { slug: 'hang-moi', label: 'Hàng mới về' },
  { slug: 'giam-gia', label: 'Đang giảm giá' },
]

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
  rating: string
  in_stock: boolean
  is_featured: boolean
  is_new: boolean
  status: string
  sort_order: string
  // ▼ Cột riêng của shop-my-pham — khớp ProductController.php::BASE_FIELDS
  brand: string
  skin_type: string
  theme: string
  sold: string
  gallery: string
}

const EMPTY: FormData = {
  name: '', category_id: '', image: '', price: '', price_sale: '',
  badge: '', description: '', rating: '5', in_stock: true,
  is_featured: false, is_new: false,
  status: 'published', sort_order: '0',
  brand: '', skin_type: '', theme: '', sold: '0', gallery: '',
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
          rating: String(p.rating ?? '5'),
          in_stock: p.in_stock === undefined ? true : Boolean(p.in_stock),
          is_featured: Boolean(p.is_featured),
          is_new: Boolean(p.is_new),
          status: String(p.status ?? 'published'),
          sort_order: String(p.sort_order ?? '0'),
          brand: String(p.brand ?? ''),
          skin_type: String(p.skin_type ?? ''),
          theme: String(p.theme ?? ''),
          sold: String(p.sold ?? '0'),
          gallery: String(p.gallery ?? ''),
        })
      }
    }).catch(() => setError('Không tải được dữ liệu'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (k: keyof FormData, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  const selectedSkinTypes = parsePadded(form.skin_type)
  const toggleSkinType = (slug: string) => {
    const next = selectedSkinTypes.includes(slug) ? selectedSkinTypes.filter(s => s !== slug) : [...selectedSkinTypes, slug]
    set('skin_type', serializePadded(next))
  }

  const selectedThemes = parsePadded(form.theme)
  const toggleTheme = (slug: string) => {
    const next = selectedThemes.includes(slug) ? selectedThemes.filter(s => s !== slug) : [...selectedThemes, slug]
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
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="VD: Serum Vitamin C & Niacinamide" />
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
          <label>Ảnh gallery (bổ sung — hiển thị dạng thumbnail trong trang chi tiết)</label>
          <GalleryField value={form.gallery} onChange={v => set('gallery', v)} />
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Giá (VND)</label>
            <input type="number" value={form.price} onChange={e => set('price', e.target.value)} min={0} placeholder="VD: 580000" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Giá sale (VND)</label>
            <input type="number" value={form.price_sale} onChange={e => set('price_sale', e.target.value)} min={0} placeholder="VD: 460000" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Badge</label>
            <input type="text" value={form.badge} onChange={e => set('badge', e.target.value)} placeholder="hot / new / sale" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Thương hiệu</label>
            <input type="text" value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="VD: The Ordinary, CeraVe, Chanel..." />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Đã bán</label>
            <input type="number" value={form.sold} onChange={e => set('sold', e.target.value)} min={0} placeholder="VD: 248" />
          </div>
        </div>

        <div className="form-group">
          <label>Mô tả sản phẩm</label>
          <textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả chi tiết sản phẩm..." />
        </div>

        <div className="form-group">
          <label>Loại da phù hợp (dùng cho bộ lọc "Loại da" ở trang Sản phẩm)</label>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 4 }}>
            {SKIN_TYPES.map(s => (
              <label key={s.slug} className="form-check">
                <input type="checkbox" checked={selectedSkinTypes.includes(s.slug)} onChange={() => toggleSkinType(s.slug)} />
                <span>{s.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Chủ đề trang chủ (quyết định sản phẩm xuất hiện ở section nào)</label>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 4 }}>
            {THEME_OPTIONS.map(t => (
              <label key={t.slug} className="form-check">
                <input type="checkbox" checked={selectedThemes.includes(t.slug)} onChange={() => toggleTheme(t.slug)} />
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
