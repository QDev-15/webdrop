import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface ColorSwatch { id: number; name: string; hex: string }
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
  // Extra fields
  material: string
  specs: string
  theme: string
  sold: string
  gallery: string
  video_url: string
}

const EMPTY: FormData = {
  name: '', category_id: '', image: '', price: '', price_sale: '',
  badge: '', description: '', colors: '', rating: '5', in_stock: true,
  is_featured: false, is_new: false, status: 'published', sort_order: '0',
  material: '', specs: '', theme: '', sold: '0', gallery: '', video_url: '',
}

const THEME_OPTIONS = [
  { value: 'ban-chay', label: '🔥 Bán chạy' },
  { value: 'moi-ve',   label: '🆕 Mới về' },
  { value: 'giam-gia', label: '🏷 Giảm giá' },
]

function parseThemes(theme: string): string[] {
  return theme.split(',').map(t => t.trim()).filter(Boolean)
}

function parseColorNames(colors: string): string[] {
  return colors.split('|').map(c => c.split(':')[0]).filter(Boolean)
}

function serializeColors(names: string[], swatches: ColorSwatch[]): string {
  return names
    .map(name => swatches.find(c => c.name === name))
    .filter((c): c is ColorSwatch => Boolean(c))
    .map(c => `${c.name}:${c.hex}`)
    .join('|')
}

export default function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [cats, setCats] = useState<Category[]>([])
  const [colorSwatches, setColorSwatches] = useState<ColorSwatch[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCats    = api.get<Category[]>('/product-categories')
    const fetchColors  = api.get<ColorSwatch[]>('/product-colors')
    const fetchProduct = isEdit
      ? api.get<Record<string, unknown>>(`/products/${id}`)
      : Promise.resolve(null)

    Promise.all([fetchCats, fetchColors, fetchProduct]).then(([cats, swatches, p]) => {
      setCats(cats)
      setColorSwatches(swatches)
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
          in_stock: p.in_stock === undefined ? true : Boolean(Number(p.in_stock)),
          is_featured: Boolean(Number(p.is_featured)),
          is_new: Boolean(Number(p.is_new)),
          status: String(p.status ?? 'published'),
          sort_order: String(p.sort_order ?? '0'),
          material: String(p.material ?? ''),
          specs: String(p.specs ?? ''),
          theme: String(p.theme ?? ''),
          sold: String(p.sold ?? '0'),
          gallery: String(p.gallery ?? ''),
          video_url: String(p.video_url ?? ''),
        })
      }
    }).catch(() => setError('Không tải được dữ liệu'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (k: keyof FormData, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  const selectedColors = parseColorNames(form.colors)
  const toggleColor = (name: string) => {
    const next = selectedColors.includes(name)
      ? selectedColors.filter(c => c !== name)
      : [...selectedColors, name]
    set('colors', serializeColors(next, colorSwatches))
  }

  const selectedThemes = parseThemes(form.theme)
  const toggleTheme = (val: string) => {
    const next = selectedThemes.includes(val)
      ? selectedThemes.filter(t => t !== val)
      : [...selectedThemes, val]
    set('theme', next.join(','))
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
      is_featured: form.is_featured ? 1 : 0,
      is_new: form.is_new ? 1 : 0,
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
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="VD: Nồi đất nung cao cấp 2.5L" />
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
            <input type="number" value={form.price} onChange={e => set('price', e.target.value)} min={0} placeholder="VD: 299000" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Giá sale (VND)</label>
            <input type="number" value={form.price_sale} onChange={e => set('price_sale', e.target.value)} min={0} placeholder="VD: 249000" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Badge</label>
            <select value={form.badge} onChange={e => set('badge', e.target.value)}>
              <option value="">-- Không có --</option>
              <option value="hot">🔥 Hot</option>
              <option value="new">🆕 Mới</option>
              <option value="sale">🏷 Sale</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Mô tả sản phẩm</label>
          <textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả chi tiết sản phẩm..." />
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label>Chất liệu</label>
            <input type="text" value={form.material} onChange={e => set('material', e.target.value)} placeholder="VD: Gốm sứ cao cấp, Tre tự nhiên, Gỗ teak..." />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Số lượng đã bán</label>
            <input type="number" value={form.sold} onChange={e => set('sold', e.target.value)} min={0} placeholder="0" />
          </div>
        </div>

        {/* Màu sắc — fetch từ API product-colors */}
        <div className="form-group">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <label style={{ margin: 0 }}>Màu sắc sản phẩm</label>
            <a href="/colors/new" target="_blank" style={{ fontSize: 12, color: 'var(--accent)' }}>
              + Thêm màu mới
            </a>
          </div>
          {colorSwatches.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-3)', margin: 0 }}>
              Chưa có màu nào — <a href="/colors/new" target="_blank" style={{ color: 'var(--accent)' }}>thêm màu sắc</a> trước
            </p>
          ) : (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
              {colorSwatches.map(c => {
                const active = selectedColors.includes(c.name)
                const isWhite = c.hex.toLowerCase() === '#ffffff' || c.hex.toLowerCase() === '#fff'
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleColor(c.name)}
                    title={c.name}
                    aria-pressed={active}
                    aria-label={`Màu ${c.name}`}
                    style={{
                      width: 32, height: 32, borderRadius: '50%', background: c.hex, padding: 0, cursor: 'pointer',
                      border: isWhite ? '1px solid #ddd' : 'none',
                      boxShadow: active
                        ? '0 0 0 2px #fff, 0 0 0 4px var(--accent)'
                        : '0 1px 4px rgba(0,0,0,.15)',
                      transition: 'box-shadow .15s',
                      position: 'relative',
                    }}
                  >
                    {active && (
                      <svg style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isWhite ? '#333' : '#fff'} strokeWidth={3}>
                        <path d="M5 13l4 4L19 7"/>
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          )}
          {selectedColors.length > 0 && (
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 8 }}>
              Đã chọn: {selectedColors.join(', ')}
            </p>
          )}
        </div>

        {/* Chủ đề hiển thị trên trang chủ */}
        <div className="form-group">
          <label>Hiển thị ở section trang chủ</label>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 6 }}>
            {THEME_OPTIONS.map(opt => (
              <label key={opt.value} className="form-check" style={{ margin: 0 }}>
                <input
                  type="checkbox"
                  checked={selectedThemes.includes(opt.value)}
                  onChange={() => toggleTheme(opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          <small style={{ color: 'var(--text-3)', fontSize: 11, marginTop: 4, display: 'block' }}>
            Chọn section(s) sản phẩm này sẽ xuất hiện trên trang chủ
          </small>
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

        {/* Thông tin mở rộng */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginTop: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 16 }}>Thông tin mở rộng</div>

          <div className="form-group">
            <label>Ảnh gallery (JSON array URL)</label>
            <textarea
              rows={3}
              value={form.gallery}
              onChange={e => set('gallery', e.target.value)}
              placeholder={'["https://images.unsplash.com/photo-xxx?w=800", "https://..."]'}
              style={{ fontFamily: 'monospace', fontSize: 12 }}
            />
            <small style={{ color: 'var(--text-3)', fontSize: 11 }}>JSON array các URL ảnh phụ. Để trống nếu chỉ dùng 1 ảnh chính.</small>
          </div>

          <div className="form-group">
            <label>Video URL (YouTube)</label>
            <input type="url" value={form.video_url} onChange={e => set('video_url', e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
          </div>

          <div className="form-group">
            <label>Thông số kỹ thuật (JSON object)</label>
            <textarea
              rows={4}
              value={form.specs}
              onChange={e => set('specs', e.target.value)}
              placeholder={'{"Xuất xứ": "Việt Nam", "Kích thước": "20 x 15 cm", "Trọng lượng": "500g"}'}
              style={{ fontFamily: 'monospace', fontSize: 12 }}
            />
            <small style={{ color: 'var(--text-3)', fontSize: 11 }}>JSON object cặp "Tên thông số": "Giá trị". Để trống nếu không cần hiển thị specs.</small>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/products')}>Hủy</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
        </div>
      </form>
    </div>
  )
}
