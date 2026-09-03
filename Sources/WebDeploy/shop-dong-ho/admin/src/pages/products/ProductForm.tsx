import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

// Template shop-dong-ho (đồng hồ) không có bộ lọc "Màu sắc" — bỏ UI colors swatch (khác base scaffold),
// cột `colors` vẫn giữ trong schema (base shop) nhưng luôn để rỗng, không hiển thị/lọc ở website.
const BRANDS = ['CASIO', 'SEIKO', 'CITIZEN', 'ORIENT', 'TISSOT', 'FOSSIL', 'MVMT', 'TIMEX', 'LONGINES', 'DANIEL WELLINGTON']
const MATERIALS = [
  { value: 'da', label: 'Dây da' },
  { value: 'kim-loai', label: 'Dây kim loại' },
  { value: 'cao-su', label: 'Dây cao su' },
  { value: 'vai', label: 'Dây vải (NATO)' },
]
const STYLES = [
  { value: 'co-dien', label: 'Cổ điển' },
  { value: 'the-thao', label: 'Thể thao' },
  { value: 'sang-trong', label: 'Sang trọng' },
  { value: 'smartwatch', label: 'Smartwatch' },
]

interface Category { id: number; name: string }
interface FormData {
  name: string
  category_id: string
  image: string
  gallery: string
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
  // ▼ Field riêng shop-dong-ho (đồng hồ)
  brand: string
  material: string
  style: string
  warranty: string
  movement: string
  water_resist: string
  diameter: string
  sold: string
  limited: boolean
}

const EMPTY: FormData = {
  name: '', category_id: '', image: '', gallery: '', price: '', price_sale: '',
  badge: '', description: '', rating: '5', in_stock: true,
  is_featured: false, is_new: false,
  status: 'published', sort_order: '0',
  brand: '', material: '', style: '', warranty: '2 năm chính hãng', movement: '', water_resist: '', diameter: '40', sold: '0', limited: false,
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
          gallery: String(p.gallery ?? ''),
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
          material: String(p.material ?? ''),
          style: String(p.style ?? ''),
          warranty: String(p.warranty ?? ''),
          movement: String(p.movement ?? ''),
          water_resist: String(p.water_resist ?? ''),
          diameter: String(p.diameter ?? '40'),
          sold: String(p.sold ?? '0'),
          limited: Boolean(p.limited),
        })
      }
    }).catch(() => setError('Không tải được dữ liệu'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (k: keyof FormData, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

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
      diameter: Number(form.diameter) || 0,
      sold: Number(form.sold) || 0,
      limited: form.limited ? 1 : 0,
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
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="VD: CASIO Edifice Chronograph EFR-556" />
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
            <select value={form.brand} onChange={e => set('brand', e.target.value)}>
              <option value="">-- Chọn thương hiệu --</option>
              {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Chất liệu dây</label>
            <select value={form.material} onChange={e => set('material', e.target.value)}>
              <option value="">-- Chọn chất liệu --</option>
              {MATERIALS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Phong cách</label>
            <select value={form.style} onChange={e => set('style', e.target.value)}>
              <option value="">-- Chọn phong cách --</option>
              {STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Ảnh sản phẩm chính</label>
          <ImageField value={form.image} onChange={v => set('image', v)} />
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Ảnh phụ #1 (thư viện ảnh chi tiết)</label>
            <ImageField value={form.gallery.split('|')[0] || ''} onChange={v => set('gallery', [v, form.gallery.split('|')[1] || ''].join('|'))} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Ảnh phụ #2</label>
            <ImageField value={form.gallery.split('|')[1] || ''} onChange={v => set('gallery', [form.gallery.split('|')[0] || '', v].join('|'))} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Giá (VND)</label>
            <input type="number" value={form.price} onChange={e => set('price', e.target.value)} min={0} placeholder="VD: 3290000" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Giá sale (VND)</label>
            <input type="number" value={form.price_sale} onChange={e => set('price_sale', e.target.value)} min={0} placeholder="VD: 2790000" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Badge</label>
            <input type="text" value={form.badge} onChange={e => set('badge', e.target.value)} placeholder="new | sale | hot" />
          </div>
        </div>

        <div className="form-group">
          <label>Mô tả sản phẩm</label>
          <textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả chi tiết sản phẩm..." />
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Bảo hành</label>
            <input type="text" value={form.warranty} onChange={e => set('warranty', e.target.value)} placeholder="VD: 2 năm chính hãng" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Bộ máy</label>
            <input type="text" value={form.movement} onChange={e => set('movement', e.target.value)} placeholder="VD: Automatic (Cơ tự động)" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Khả năng chống nước</label>
            <input type="text" value={form.water_resist} onChange={e => set('water_resist', e.target.value)} placeholder="VD: 100-200m" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Đường kính mặt (mm)</label>
            <input type="number" value={form.diameter} onChange={e => set('diameter', e.target.value)} min={0} />
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
          <label className="form-check">
            <input type="checkbox" checked={form.limited} onChange={e => set('limited', e.target.checked)} />
            <span>Phiên bản giới hạn (Limited Edition)</span>
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
