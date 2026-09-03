import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

// Template gốc không có bộ lọc "Màu sắc" (rượu vang không có biến thể màu) — thay bằng
// Xuất xứ/Nồng độ cồn/Dịp dùng, khớp đúng toolbar filter thật của index.html.
const ORIGIN_OPTIONS = [
  { value: 'phap', label: 'Pháp' },
  { value: 'y', label: 'Ý' },
  { value: 'chile', label: 'Chile' },
  { value: 'tay-ban-nha', label: 'Tây Ban Nha' },
  { value: 'argentina', label: 'Argentina' },
  { value: 'uc', label: 'Úc' },
  { value: 'my', label: 'Mỹ' },
  { value: 'duc', label: 'Đức' },
  { value: 'nam-phi', label: 'Nam Phi' },
]

const OCCASION_OPTIONS = [
  { value: 'qua-tang', label: 'Quà tặng' },
  { value: 'tiec-tung', label: 'Tiệc tùng' },
  { value: 'suu-tam', label: 'Sưu tầm' },
  { value: 'khai-vi', label: 'Khai vị' },
  { value: 'hang-ngay', label: 'Dùng hàng ngày' },
]

function parseOccasions(csv: string): string[] {
  return csv.split(',').map(s => s.trim()).filter(Boolean)
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
  origin: string
  abv: string
  volume: string
  occasion: string
  rating: string
  in_stock: boolean
  is_featured: boolean
  is_new: boolean
  status: string
  sort_order: string
}

const EMPTY: FormData = {
  name: '', category_id: '', image: '', price: '', price_sale: '',
  badge: '', description: '', origin: 'phap', abv: '13', volume: '750', occasion: '',
  rating: '5', in_stock: true,
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
          origin: String(p.origin ?? 'phap'),
          abv: String(p.abv ?? '13'),
          volume: String(p.volume ?? '750'),
          occasion: String(p.occasion ?? ''),
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

  const selectedOccasions = parseOccasions(form.occasion)
  const toggleOccasion = (value: string) => {
    const next = selectedOccasions.includes(value) ? selectedOccasions.filter(o => o !== value) : [...selectedOccasions, value]
    set('occasion', next.join(','))
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
      abv: Number(form.abv) || 0,
      volume: Number(form.volume) || 750,
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
            <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="VD: Château Rousillon Bordeaux 2018" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Danh mục</label>
            <select className="form-control" value={form.category_id} onChange={e => set('category_id', e.target.value)}>
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
            <input type="number" className="form-control" value={form.price} onChange={e => set('price', e.target.value)} min={0} placeholder="VD: 620000" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Giá sale (VND)</label>
            <input type="number" className="form-control" value={form.price_sale} onChange={e => set('price_sale', e.target.value)} min={0} placeholder="VD: 459000" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Badge</label>
            <select className="form-control" value={form.badge} onChange={e => set('badge', e.target.value)}>
              <option value="">Không</option>
              <option value="new">Mới</option>
              <option value="sale">Giảm giá</option>
              <option value="hot">Bán chạy</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Mô tả sản phẩm</label>
          <textarea rows={4} className="form-control" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả chi tiết sản phẩm..." />
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Xuất xứ</label>
            <select className="form-control" value={form.origin} onChange={e => set('origin', e.target.value)}>
              {ORIGIN_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Nồng độ cồn (%)</label>
            <input type="number" className="form-control" value={form.abv} onChange={e => set('abv', e.target.value)} min={0} max={25} step={0.5} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Dung tích (ml)</label>
            <input type="number" className="form-control" value={form.volume} onChange={e => set('volume', e.target.value)} min={0} step={50} placeholder="750" />
          </div>
        </div>

        <div className="form-group">
          <label>Dịp dùng (dùng cho bộ lọc "Dịp dùng" ở trang chủ)</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
            {OCCASION_OPTIONS.map(o => {
              const active = selectedOccasions.includes(o.value)
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => toggleOccasion(o.value)}
                  aria-pressed={active}
                  className="btn btn-sm"
                  style={{
                    background: active ? 'var(--accent)' : 'transparent',
                    color: active ? '#fff' : 'var(--text)',
                    border: '1px solid ' + (active ? 'var(--accent)' : 'var(--border, #ddd)'),
                    borderRadius: 999,
                  }}
                >
                  {o.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Trạng thái</label>
            <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Nháp</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Đánh giá (0-5 sao)</label>
            <input type="number" className="form-control" value={form.rating} onChange={e => set('rating', e.target.value)} min={0} max={5} step={0.1} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Thứ tự sắp xếp</label>
            <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', e.target.value)} min={0} />
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
