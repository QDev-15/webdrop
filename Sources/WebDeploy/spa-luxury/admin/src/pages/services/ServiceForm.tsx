import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface ServiceCategory {
  id: number
  name: string
}

interface ServiceFormData {
  name: string
  description: string
  category_id: string
  duration_minutes: number
  price: number
  price_unit: string
  is_featured: boolean
  image: string
  sort_order: number
}

const empty: ServiceFormData = {
  name: '',
  description: '',
  category_id: '',
  duration_minutes: 60,
  price: 0,
  price_unit: 'người',
  is_featured: false,
  image: '',
  sort_order: 0,
}

export default function ServiceForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState<ServiceFormData>(empty)
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cats = await api.get<ServiceCategory[]>('/service-categories')
        setCategories(cats)
        if (id) {
          const d = await api.get<{ id: number; name: string; description: string; category_id: number | null; duration_minutes: number; price: number; price_unit: string; is_featured: number; image: string; sort_order: number }>(`/services/${id}`)
          setForm({
            name: d.name ?? '',
            description: d.description ?? '',
            category_id: d.category_id ? String(d.category_id) : '',
            duration_minutes: d.duration_minutes ?? 60,
            price: d.price ?? 0,
            price_unit: d.price_unit ?? 'người',
            is_featured: Boolean(d.is_featured),
            image: d.image ?? '',
            sort_order: d.sort_order ?? 0,
          })
        }
      } catch {
        setError('Không tải được dữ liệu.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  function set<K extends keyof ServiceFormData>(k: K, v: ServiceFormData[K]) {
    setForm(f => ({ ...f, [k]: v }))
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên dịch vụ là bắt buộc.'); return }
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        category_id: form.category_id ? parseInt(form.category_id) : null,
        is_featured: form.is_featured ? 1 : 0,
      }
      if (isEdit) {
        await api.put(`/services/${id}`, payload)
      } else {
        await api.post('/services', payload)
      }
      navigate('/services')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 700 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}</div>
        </div>
        <button onClick={() => navigate('/services')} className="btn-ghost">Quay lại</button>
      </div>

      {error && (
        <div style={{ padding: '10px 16px', borderRadius: 8, background: '#fff0f0', color: 'var(--danger)', border: '1px solid #fdd', fontSize: 13, marginBottom: 20 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        <div style={{ display: 'grid', gap: 20 }}>

          <div className="form-group">
            <label className="form-label">Tên dịch vụ *</label>
            <input
              type="text"
              className="form-control"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Massage toàn thân"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả</label>
            <textarea
              className="form-control"
              rows={4}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Mô tả chi tiết về dịch vụ..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Danh mục</label>
            <select
              className="form-control"
              value={form.category_id}
              onChange={e => set('category_id', e.target.value)}
            >
              <option value="">— Chọn danh mục —</option>
              {categories.map(c => (
                <option key={c.id} value={String(c.id)}>{c.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Thời gian (phút)</label>
              <input
                type="number"
                className="form-control"
                value={form.duration_minutes}
                onChange={e => set('duration_minutes', parseInt(e.target.value) || 0)}
                min={0}
                placeholder="60"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Thứ tự hiển thị</label>
              <input
                type="number"
                className="form-control"
                value={form.sort_order}
                onChange={e => set('sort_order', parseInt(e.target.value) || 0)}
                min={0}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Giá</label>
              <input
                type="number"
                className="form-control"
                value={form.price}
                onChange={e => set('price', parseFloat(e.target.value) || 0)}
                min={0}
                placeholder="500000"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Đơn vị tính</label>
              <select
                className="form-control"
                value={form.price_unit}
                onChange={e => set('price_unit', e.target.value)}
              >
                <option value="người">người</option>
                <option value="cặp">cặp</option>
                <option value="miễn phí">miễn phí</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <ImageField
              label="Ảnh dịch vụ"
              value={form.image}
              onChange={v => set('image', v)}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={e => set('is_featured', e.target.checked)}
                style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }}
              />
              <span style={{ fontSize: 14 }}>Dịch vụ nổi bật (hiển thị trên trang chủ)</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
            <button type="button" onClick={() => navigate('/services')} className="btn-ghost">Hủy</button>
            <button type="submit" className="btn-accent" disabled={saving}>
              {saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm dịch vụ')}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
