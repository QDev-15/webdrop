import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface FormData {
  name: string
  slug: string
  type_tag: string
  bedrooms: number
  bathrooms: number
  area: number
  price_from: number
  direction: string
  floor_range: string
  block: string
  view_desc: string
  status: string
  badge: string
  floor_plan_image: string
  gallery: string[]
  description: string
  features: string[]
  is_featured: boolean
  sort_order: number
}

const empty: FormData = {
  name: '', slug: '', type_tag: '1pn', bedrooms: 1, bathrooms: 1, area: 0, price_from: 0,
  direction: 'dong', floor_range: '', block: '', view_desc: '', status: 'con-hang', badge: '',
  floor_plan_image: '', gallery: [], description: '', features: [], is_featured: false, sort_order: 0,
}

const TYPE_OPTIONS = [
  { value: '1pn', label: '1PN' }, { value: '2pn', label: '2PN' }, { value: '3pn', label: '3PN' },
  { value: 'duplex', label: 'Duplex' }, { value: 'penthouse', label: 'Penthouse' },
]
const DIRECTION_OPTIONS = [
  { value: 'dong', label: 'Đông' }, { value: 'tay', label: 'Tây' }, { value: 'nam', label: 'Nam' }, { value: 'bac', label: 'Bắc' },
  { value: 'dong-nam', label: 'Đông Nam' }, { value: 'tay-nam', label: 'Tây Nam' },
  { value: 'dong-bac', label: 'Đông Bắc' }, { value: 'tay-bac', label: 'Tây Bắc' },
  { value: 'dong-nam-tay-bac', label: 'Đông Nam & Tây Bắc (2 mặt thoáng)' },
]
const STATUS_OPTIONS = [
  { value: 'con-hang', label: 'Còn hàng' }, { value: 'sap-mo-ban', label: 'Sắp mở bán' }, { value: 'het-hang', label: 'Hết hàng' },
]
const BADGE_OPTIONS = [
  { value: '', label: '— Không có —' }, { value: 'moi', label: 'Mới' }, { value: 'hot', label: 'Hot' }, { value: 'sap-mo-ban', label: 'Sắp mở bán' },
]

function slugify(text: string) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/[\s-]+/g, '-')
}

export default function UnitTypeForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<FormData>(empty)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [slugTouched, setSlugTouched] = useState(isEdit)

  useEffect(() => {
    if (!id) return
    api.get<FormData & { id: number }>(`/unit-types/${id}`)
      .then(d => setForm({
        name: d.name, slug: d.slug, type_tag: d.type_tag, bedrooms: d.bedrooms, bathrooms: d.bathrooms,
        area: d.area, price_from: d.price_from, direction: d.direction, floor_range: d.floor_range,
        block: d.block, view_desc: d.view_desc, status: d.status, badge: d.badge ?? '',
        floor_plan_image: d.floor_plan_image ?? '', gallery: d.gallery ?? [], description: d.description ?? '',
        features: d.features ?? [], is_featured: !!d.is_featured, sort_order: d.sort_order ?? 0,
      }))
      .catch(() => setError('Không tìm thấy loại căn.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof FormData>(k: K, v: FormData[K]) { setForm(f => ({ ...f, [k]: v })) }

  function onNameChange(v: string) {
    set('name', v)
    if (!slugTouched) set('slug', slugify(v))
  }

  function addGalleryImage() { set('gallery', [...form.gallery, '']) }
  function setGalleryImage(i: number, v: string) { const next = [...form.gallery]; next[i] = v; set('gallery', next) }
  function removeGalleryImage(i: number) { set('gallery', form.gallery.filter((_, idx) => idx !== i)) }

  function addFeature() { set('features', [...form.features, '']) }
  function setFeature(i: number, v: string) { const next = [...form.features]; next[i] = v; set('features', next) }
  function removeFeature(i: number) { set('features', form.features.filter((_, idx) => idx !== i)) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Tên loại căn là bắt buộc.'); return }
    setSaving(true)
    const payload = { ...form, gallery: form.gallery.filter(g => g.trim()), features: form.features.filter(f => f.trim()) }
    try {
      if (isEdit) await api.put(`/unit-types/${id}`, payload)
      else await api.post('/unit-types', payload)
      navigate('/unit-types')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 760 }}>
      <div className="page-header">
        <div className="page-title">{isEdit ? 'Chỉnh sửa loại căn' : 'Thêm loại căn mới'}</div>
        <button onClick={() => navigate('/unit-types')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Tên loại căn *</label>
            <input type="text" className="form-control" value={form.name} onChange={e => onNameChange(e.target.value)} placeholder="Vd: Garden View 2PN" required />
          </div>
          <div className="form-group">
            <label className="form-label">Slug (URL)</label>
            <input type="text" className="form-control" value={form.slug} onChange={e => { setSlugTouched(true); set('slug', e.target.value) }} placeholder="garden-view-2pn" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Loại căn</label>
            <select className="form-control" value={form.type_tag} onChange={e => set('type_tag', e.target.value)}>
              {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Phòng ngủ</label>
            <input type="number" className="form-control" value={form.bedrooms} onChange={e => set('bedrooms', parseInt(e.target.value) || 0)} min={0} />
          </div>
          <div className="form-group">
            <label className="form-label">Phòng tắm</label>
            <input type="number" className="form-control" value={form.bathrooms} onChange={e => set('bathrooms', parseInt(e.target.value) || 0)} min={0} />
          </div>
          <div className="form-group">
            <label className="form-label">Diện tích (m²)</label>
            <input type="number" className="form-control" value={form.area} onChange={e => set('area', parseFloat(e.target.value) || 0)} min={0} step={0.5} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Giá từ (VNĐ)</label>
            <input type="number" className="form-control" value={form.price_from} onChange={e => set('price_from', parseFloat(e.target.value) || 0)} min={0} step={1000000} />
          </div>
          <div className="form-group">
            <label className="form-label">Hướng</label>
            <select className="form-control" value={form.direction} onChange={e => set('direction', e.target.value)}>
              {DIRECTION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Tầng áp dụng</label>
            <input type="text" className="form-control" value={form.floor_range} onChange={e => set('floor_range', e.target.value)} placeholder="Vd: 8-30" />
          </div>
          <div className="form-group">
            <label className="form-label">Khối tháp</label>
            <input type="text" className="form-control" value={form.block} onChange={e => set('block', e.target.value)} placeholder="Vd: Tháp Aqua" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">View</label>
          <input type="text" className="form-control" value={form.view_desc} onChange={e => set('view_desc', e.target.value)} placeholder="Vd: View trực diện sông Sài Gòn" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Tình trạng</label>
            <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Badge</label>
            <select className="form-control" value={form.badge} onChange={e => set('badge', e.target.value)}>
              {BADGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <ImageField label="Ảnh mặt bằng minh họa" value={form.floor_plan_image} onChange={v => set('floor_plan_image', v)} />
        </div>

        <div className="form-group">
          <label className="form-label">Ảnh gallery ({form.gallery.length})</label>
          {form.gallery.map((g, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <ImageField value={g} onChange={v => setGalleryImage(i, v)} />
              </div>
              <button type="button" onClick={() => removeGalleryImage(i)} className="btn-danger btn-sm" style={{ marginTop: 4 }}>Xóa</button>
            </div>
          ))}
          <button type="button" onClick={addGalleryImage} className="btn-ghost btn-sm">+ Thêm ảnh</button>
        </div>

        <div className="form-group">
          <label className="form-label">Mô tả chi tiết</label>
          <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} rows={4} placeholder="Mô tả chi tiết loại căn hộ..." />
        </div>

        <div className="form-group">
          <label className="form-label">Đặc điểm nổi bật ({form.features.length})</label>
          {form.features.map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input type="text" className="form-control" value={f} onChange={e => setFeature(i, e.target.value)} placeholder="Vd: View sông trực diện không bị che chắn" />
              <button type="button" onClick={() => removeFeature(i)} className="btn-danger btn-sm">Xóa</button>
            </div>
          ))}
          <button type="button" onClick={addFeature} className="btn-ghost btn-sm">+ Thêm đặc điểm</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Thứ tự hiển thị</label>
            <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
          </div>
          <div className="form-group form-checkbox" style={{ display: 'flex', alignItems: 'center', paddingTop: 24 }}>
            <label>
              <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} />
              Hiển thị ở mục "Loại căn bán chạy" trang chủ
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/unit-types')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
