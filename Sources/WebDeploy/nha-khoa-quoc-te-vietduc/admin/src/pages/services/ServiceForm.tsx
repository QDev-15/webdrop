import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Category { id: number; name: string }

interface ServiceData {
  category_id: number | null
  image: string
  tag: string
  name: string
  description: string
  price: string
  price_unit: string
  sort_order: number
  is_active: number
}

const empty: ServiceData = {
  category_id: null, image: '', tag: '', name: '', description: '',
  price: '', price_unit: 'VND/răng', sort_order: 0, is_active: 1,
}

export default function ServiceForm() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const [form, setForm]   = useState<ServiceData>(empty)
  const [cats, setCats]   = useState<Category[]>([])
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const isEdit = !!id

  useEffect(() => {
    api.get<Category[]>('/service-categories').then(setCats).catch(() => {})
    if (!id) return
    api.get<ServiceData & { id: number }>(`/services/${id}`)
      .then(d => setForm({
        category_id: d.category_id,
        image: d.image ?? '',
        tag: d.tag ?? '',
        name: d.name,
        description: d.description ?? '',
        price: d.price ?? '',
        price_unit: d.price_unit ?? 'VND/răng',
        sort_order: d.sort_order ?? 0,
        is_active: d.is_active ?? 1,
      }))
      .catch(() => setError('Không tìm thấy dịch vụ.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof ServiceData>(k: K, v: ServiceData[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Tên dịch vụ là bắt buộc.'); return }
    setSaving(true)
    try {
      if (isEdit) {
        await api.put(`/services/${id}`, form)
      } else {
        await api.post('/services', form)
      }
      navigate('/services')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="adm-loading">Đang tải...</div>

  return (
    <div className="adm-page" style={{ maxWidth: 680 }}>
      <div className="adm-page-header">
        <h1 className="adm-page-title">{isEdit ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}</h1>
        <button onClick={() => navigate('/services')} className="adm-btn-ghost">Quay lại</button>
      </div>

      {error && <div className="adm-alert adm-alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="adm-form">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="adm-field">
            <label className="adm-label" htmlFor="s-cat">Nhóm dịch vụ</label>
            <select id="s-cat" className="adm-input" value={form.category_id ?? ''} onChange={e => set('category_id', e.target.value ? parseInt(e.target.value) : null)}>
              <option value="">-- Chọn nhóm --</option>
              {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="adm-field">
            <label className="adm-label" htmlFor="s-tag">Tag</label>
            <input id="s-tag" className="adm-input" value={form.tag} onChange={e => set('tag', e.target.value)} placeholder="Vd: Cao Cấp" />
          </div>
        </div>

        <div className="adm-field">
          <label className="adm-label" htmlFor="s-name">Tên dịch vụ *</label>
          <input id="s-name" className="adm-input" value={form.name} onChange={e => set('name', e.target.value)} required />
        </div>

        <div className="adm-field">
          <label className="adm-label" htmlFor="s-desc">Mô tả</label>
          <textarea id="s-desc" className="adm-input" rows={4} value={form.description} onChange={e => set('description', e.target.value)} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="adm-field">
            <label className="adm-label" htmlFor="s-price">Giá</label>
            <input id="s-price" className="adm-input" value={form.price} onChange={e => set('price', e.target.value)} placeholder="Vd: 15.000.000" />
          </div>
          <div className="adm-field">
            <label className="adm-label" htmlFor="s-unit">Đơn vị</label>
            <input id="s-unit" className="adm-input" value={form.price_unit} onChange={e => set('price_unit', e.target.value)} placeholder="Vd: VND/răng" />
          </div>
        </div>

        <div className="adm-field">
          <ImageField label="Ảnh dịch vụ" value={form.image} onChange={v => set('image', v)} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="adm-field">
            <label className="adm-label" htmlFor="s-order">Thứ tự</label>
            <input id="s-order" type="number" className="adm-input" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} />
          </div>
          <div className="adm-field">
            <label className="adm-label" htmlFor="s-active">Trạng thái</label>
            <select id="s-active" className="adm-input" value={form.is_active} onChange={e => set('is_active', parseInt(e.target.value))}>
              <option value={1}>Hiển thị</option>
              <option value={0}>Ẩn</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => navigate('/services')} className="adm-btn-ghost">Hủy</button>
          <button type="submit" className="adm-btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
