import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'
import { PROPERTY_TYPE_LABELS, DIRECTION_LABELS, LEGAL_LABELS, FURNISHING_LABELS, BADGE_LABELS, DISTRICTS } from '../../data/propertyOptions'

interface Agent { id: number; name: string }

interface FormData {
  title: string
  listing_type: string
  property_type: string
  price: number
  price_unit: string
  area: number
  bedrooms: number
  bathrooms: number
  direction: string
  legal_status: string
  furnishing: string
  district: string
  street: string
  lat: number
  lng: number
  badge: string
  posted_date: string
  agent_id: number | ''
  description: string
  featuresText: string
  images: string[]
}

const today = new Date().toISOString().slice(0, 10)

const empty: FormData = {
  title: '', listing_type: 'ban', property_type: 'chung-cu', price: 0, price_unit: 'tỷ', area: 0,
  bedrooms: 0, bathrooms: 0, direction: 'dong', legal_status: 'so-hong', furnishing: 'co-ban',
  district: 'quan-1', street: '', lat: 10.7756, lng: 106.7019, badge: '', posted_date: today,
  agent_id: '', description: '', featuresText: '', images: [''],
}

interface RawProperty {
  id: number
  title: string
  listing_type: string
  property_type: string
  price: number
  price_unit: string
  area: number
  bedrooms: number
  bathrooms: number
  direction: string
  legal_status: string
  furnishing: string
  district: string
  street: string
  lat: number
  lng: number
  badge: string
  posted_date: string
  agent_id: number | null
  description: string
  features: string
  images: string
}

export default function PropertyForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<FormData>(empty)
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<Agent[]>('/agents').then(setAgents).catch(() => {})
  }, [])

  useEffect(() => {
    if (!id) return
    api.get<RawProperty>(`/properties/${id}`)
      .then(d => setForm({
        title: d.title, listing_type: d.listing_type, property_type: d.property_type,
        price: d.price, price_unit: d.price_unit, area: d.area, bedrooms: d.bedrooms, bathrooms: d.bathrooms,
        direction: d.direction, legal_status: d.legal_status, furnishing: d.furnishing,
        district: d.district, street: d.street, lat: d.lat, lng: d.lng, badge: d.badge ?? '',
        posted_date: d.posted_date, agent_id: d.agent_id ?? '', description: d.description ?? '',
        featuresText: (d.features ?? '').split('|').filter(Boolean).join('\n'),
        images: (d.images ?? '').split('|').filter(Boolean).length ? (d.images ?? '').split('|').filter(Boolean) : [''],
      }))
      .catch(() => setError('Không tìm thấy tin đăng.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof FormData>(k: K, v: FormData[K]) { setForm(f => ({ ...f, [k]: v })) }

  function setImage(i: number, url: string) {
    setForm(f => { const images = [...f.images]; images[i] = url; return { ...f, images } })
  }
  function addImage() { setForm(f => ({ ...f, images: [...f.images, ''] })) }
  function removeImage(i: number) {
    setForm(f => { const images = f.images.filter((_, idx) => idx !== i); return { ...f, images: images.length ? images : [''] } })
  }

  // Đổi listing_type → tự đổi price_unit mặc định cho khớp (bán = tỷ, cho thuê = triệu/tháng)
  function onListingTypeChange(v: string) {
    setForm(f => ({ ...f, listing_type: v, price_unit: v === 'cho-thue' ? 'triệu/tháng' : 'tỷ' }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) { setError('Tiêu đề tin đăng là bắt buộc.'); return }
    setSaving(true)
    const payload = {
      ...form,
      agent_id: form.agent_id === '' ? null : form.agent_id,
      features: form.featuresText.split('\n').map(s => s.trim()).filter(Boolean).join('|'),
      images: form.images.map(s => s.trim()).filter(Boolean).join('|'),
    }
    try {
      if (isEdit) await api.put(`/properties/${id}`, payload)
      else await api.post('/properties', payload)
      navigate('/properties')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 820 }}>
      <div className="page-header">
        <div className="page-title">{isEdit ? 'Chỉnh sửa tin đăng' : 'Thêm tin đăng mới'}</div>
        <button onClick={() => navigate('/properties')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Tiêu đề tin đăng *</label>
          <input type="text" className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Vd: Căn hộ 2PN The Sun Avenue view sông Sài Gòn" required />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Nhu cầu</label>
            <select className="form-control" value={form.listing_type} onChange={e => onListingTypeChange(e.target.value)}>
              <option value="ban">Bán</option>
              <option value="cho-thue">Cho thuê</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Loại hình</label>
            <select className="form-control" value={form.property_type} onChange={e => set('property_type', e.target.value)}>
              {Object.entries(PROPERTY_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Nhãn tin đăng</label>
            <select className="form-control" value={form.badge} onChange={e => set('badge', e.target.value)}>
              {Object.entries(BADGE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Giá</label>
            <input type="number" className="form-control" value={form.price} onChange={e => set('price', Number(e.target.value) || 0)} min={0} />
          </div>
          <div className="form-group">
            <label className="form-label">Đơn vị giá</label>
            <select className="form-control" value={form.price_unit} onChange={e => set('price_unit', e.target.value)}>
              <option value="tỷ">tỷ</option>
              <option value="triệu/tháng">triệu/tháng</option>
              <option value="triệu">triệu</option>
              <option value="đ/tháng">đ/tháng</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Diện tích (m²)</label>
            <input type="number" className="form-control" value={form.area} onChange={e => set('area', Number(e.target.value) || 0)} min={0} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Phòng ngủ</label>
            <input type="number" className="form-control" value={form.bedrooms} onChange={e => set('bedrooms', Number(e.target.value) || 0)} min={0} />
          </div>
          <div className="form-group">
            <label className="form-label">Phòng tắm</label>
            <input type="number" className="form-control" value={form.bathrooms} onChange={e => set('bathrooms', Number(e.target.value) || 0)} min={0} />
          </div>
          <div className="form-group">
            <label className="form-label">Hướng nhà</label>
            <select className="form-control" value={form.direction} onChange={e => set('direction', e.target.value)}>
              {Object.entries(DIRECTION_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Pháp lý</label>
            <select className="form-control" value={form.legal_status} onChange={e => set('legal_status', e.target.value)}>
              {Object.entries(LEGAL_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Tình trạng nội thất</label>
            <select className="form-control" value={form.furnishing} onChange={e => set('furnishing', e.target.value)}>
              {Object.entries(FURNISHING_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Khu vực</label>
            <select className="form-control" value={form.district} onChange={e => set('district', e.target.value)}>
              {DISTRICTS.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Tên đường</label>
            <input type="text" className="form-control" value={form.street} onChange={e => set('street', e.target.value)} placeholder="Vd: Mai Chí Thọ" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Vĩ độ (lat)</label>
            <input type="number" step="0.0001" className="form-control" value={form.lat} onChange={e => set('lat', Number(e.target.value) || 0)} />
          </div>
          <div className="form-group">
            <label className="form-label">Kinh độ (lng)</label>
            <input type="number" step="0.0001" className="form-control" value={form.lng} onChange={e => set('lng', Number(e.target.value) || 0)} />
          </div>
          <div className="form-group">
            <label className="form-label">Ngày đăng</label>
            <input type="date" className="form-control" value={form.posted_date} onChange={e => set('posted_date', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Môi giới phụ trách</label>
            <select className="form-control" value={form.agent_id} onChange={e => set('agent_id', e.target.value ? Number(e.target.value) : '')}>
              <option value="">— Chưa gán —</option>
              {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Mô tả chi tiết</label>
          <textarea className="form-control" rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả chi tiết bất động sản..." />
        </div>

        <div className="form-group">
          <label className="form-label">Đặc điểm nổi bật</label>
          <textarea className="form-control" rows={4} value={form.featuresText} onChange={e => set('featuresText', e.target.value)} placeholder={'Mỗi dòng 1 đặc điểm, vd:\nView sông trực diện\nHồ bơi & gym nội khu'} />
          <div className="form-hint">Mỗi dòng là một đặc điểm hiển thị dạng thẻ ở trang chi tiết.</div>
        </div>

        <div className="form-group">
          <label className="form-label">Hình ảnh (ảnh đầu tiên là ảnh đại diện)</label>
          {form.images.map((img, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <ImageField value={img} onChange={v => setImage(i, v)} />
              </div>
              {form.images.length > 1 && (
                <button type="button" className="btn-ghost btn-sm" onClick={() => removeImage(i)} style={{ marginTop: 4 }}>Xóa</button>
              )}
            </div>
          ))}
          <button type="button" className="btn-ghost btn-sm" onClick={addImage}>+ Thêm ảnh</button>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/properties')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
