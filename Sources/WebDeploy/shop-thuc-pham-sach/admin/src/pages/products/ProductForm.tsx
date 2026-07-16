import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

// Tông màu nhóm thực phẩm (không phải màu sản phẩm thời trang) — dùng cho bộ lọc "Màu sắc"
// ở trang Sản phẩm (vd: rau lá → Xanh lá, thịt/cà chua → Đỏ, gia vị/mật ong → Cam, gạo/trứng/sữa → Vàng).
// Phải khớp 100% với COLOR_SWATCHES ở website/src/pages/ProductsPage.tsx.
const COLOR_SWATCHES = [
  { name: 'Xanh lá', hex: '#3f7d4a' },
  { name: 'Đỏ', hex: '#c0392b' },
  { name: 'Cam', hex: '#d97706' },
  { name: 'Vàng', hex: '#dbb42c' },
]

// Chứng nhận — chỉ nhận đúng 3 giá trị khớp bộ lọc "Chứng nhận" ở trang Sản phẩm (san-pham.html template gốc)
const CERT_OPTIONS = ['VietGAP', 'Organic', 'GlobalGAP']

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

function parseCerts(v: string): string[] { return v.split('|').filter(Boolean) }
function toggleInList(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter(v => v !== value) : [...list, value]
}

// gallery: pipe-separated string ↔ mảng dòng nhập trong textarea (mỗi dòng 1 giá trị)
function linesToText(v: string): string { return v.split('|').filter(Boolean).join('\n') }
function textToLines(v: string): string { return v.split('\n').map(s => s.trim()).filter(Boolean).join('|') }

// nutrition: pipe-separated "Tên:Giá trị" ↔ mỗi dòng "Tên:Giá trị"
function nutritionToText(v: string): string { return v.split('|').filter(Boolean).join('\n') }
function textToNutrition(v: string): string { return v.split('\n').map(s => s.trim()).filter(Boolean).join('|') }

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
  // ▼ Cột riêng shop-thuc-pham-sach
  unit: string
  certs: string
  gallery: string
  nutrition: string
  origin_farm: string
  harvest_note: string
  sold_count: string
  stock_qty: string
}

const EMPTY: FormData = {
  name: '', category_id: '', image: '', price: '', price_sale: '',
  badge: '', description: '', colors: '', rating: '5', in_stock: true,
  is_featured: false, is_new: false,
  status: 'published', sort_order: '0',
  unit: '', certs: '', gallery: '', nutrition: '', origin_farm: '', harvest_note: '', sold_count: '0', stock_qty: '0',
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
          unit: String(p.unit ?? ''),
          certs: String(p.certs ?? ''),
          gallery: String(p.gallery ?? ''),
          nutrition: String(p.nutrition ?? ''),
          origin_farm: String(p.origin_farm ?? ''),
          harvest_note: String(p.harvest_note ?? ''),
          sold_count: String(p.sold_count ?? '0'),
          stock_qty: String(p.stock_qty ?? '0'),
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

  const selectedCerts = parseCerts(form.certs)
  const toggleCert = (name: string) => set('certs', toggleInList(selectedCerts, name).join('|'))

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
      sold_count: Number(form.sold_count) || 0,
      stock_qty: Number(form.stock_qty) || 0,
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
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="VD: Rau muống hữu cơ" />
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
            <input type="number" value={form.price} onChange={e => set('price', e.target.value)} min={0} placeholder="VD: 18000" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Giá sale (VND)</label>
            <input type="number" value={form.price_sale} onChange={e => set('price_sale', e.target.value)} min={0} placeholder="VD: 15000" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Đơn vị</label>
            <input type="text" value={form.unit} onChange={e => set('unit', e.target.value)} placeholder="VD: bó 300g, kg, hộp 10 quả" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Badge</label>
            <input type="text" value={form.badge} onChange={e => set('badge', e.target.value)} placeholder="VD: Bán chạy, Mới, -15%" />
          </div>
        </div>

        <div className="form-group">
          <label>Mô tả sản phẩm</label>
          <textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả chi tiết sản phẩm..." />
        </div>

        <div className="form-group">
          <label>Ảnh gallery bổ sung (mỗi dòng 1 URL ảnh — hiển thị ở khối ảnh thu nhỏ trang chi tiết)</label>
          <textarea rows={3} value={linesToText(form.gallery)} onChange={e => set('gallery', textToLines(e.target.value))} placeholder={'https://...\nhttps://...'} />
        </div>

        <div className="form-group">
          <label>Thông tin dinh dưỡng (mỗi dòng "Tên:Giá trị" — hiển thị ở tab "Thông tin dinh dưỡng")</label>
          <textarea rows={4} value={nutritionToText(form.nutrition)} onChange={e => set('nutrition', textToNutrition(e.target.value))} placeholder={'Năng lượng:19 kcal / 100g\nVitamin C:55% nhu cầu hàng ngày'} />
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Nông trại / nguồn gốc (tab "Nguồn gốc")</label>
            <input type="text" value={form.origin_farm} onChange={e => set('origin_farm', e.target.value)} placeholder="VD: Nông trại hữu cơ Đà Lạt — mã NT-0182" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Ghi chú thu hoạch (tab "Nguồn gốc")</label>
            <input type="text" value={form.harvest_note} onChange={e => set('harvest_note', e.target.value)} placeholder="VD: Thu hoạch trong vòng 24 giờ trước khi giao" />
          </div>
        </div>

        <div className="form-group">
          <label>Chứng nhận (dùng cho bộ lọc "Chứng nhận" ở trang Sản phẩm)</label>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 4 }}>
            {CERT_OPTIONS.map(c => (
              <label className="form-check" key={c}>
                <input type="checkbox" checked={selectedCerts.includes(c)} onChange={() => toggleCert(c)} />
                <span>{c}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Màu sắc (nhóm thực phẩm — dùng cho bộ lọc "Màu sắc" ở trang Sản phẩm)</label>
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
            <label>Đã bán</label>
            <input type="number" value={form.sold_count} onChange={e => set('sold_count', e.target.value)} min={0} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Tồn kho (số lượng cụ thể)</label>
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
