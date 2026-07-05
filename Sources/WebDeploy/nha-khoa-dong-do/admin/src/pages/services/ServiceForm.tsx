import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface ServiceData {
  number: string
  name: string
  description: string
  features: string
  price: string
  image: string
  is_featured: boolean
  sort_order: number
}

const empty: ServiceData = { number: '', name: '', description: '', features: '', price: '', image: '', is_featured: false, sort_order: 0 }

export default function ServiceForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState<ServiceData>(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<unknown[]>(`/services`)
      .then(items => {
        const arr = items as Array<{ id: number; number: string; name: string; description: string; features: string; price: string; image: string; is_featured: number; sort_order: number }>
        const found = arr.find((s) => String(s.id) === id)
        if (found) setForm({ ...found, is_featured: Boolean(found.is_featured) })
      })
      .catch(console.error)
  }, [id, isEdit])

  const set = (k: keyof ServiceData, v: string | boolean | number) =>
    setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên dịch vụ là bắt buộc.'); return }
    setSaving(true)
    setError('')
    const body = { ...form, is_featured: form.is_featured ? 1 : 0 }
    try {
      if (isEdit) {
        await api.post(`/services/${id}/update`, body)
      } else {
        await api.post('/services', body)
      }
      navigate('/services')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi khi lưu.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        {error && <div className="form-error">{error}</div>}

        <div className="form-row">
          <div className="form-field">
            <label>Số thứ tự (01, 02...)</label>
            <input type="text" value={form.number} onChange={e => set('number', e.target.value)} placeholder="01" />
          </div>
          <div className="form-field">
            <label>Thứ tự hiển thị</label>
            <input type="number" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} />
          </div>
        </div>

        <div className="form-field">
          <label>Tên dịch vụ *</label>
          <input type="text" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Trồng răng Implant" />
        </div>

        <div className="form-field">
          <label>Mô tả</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Mô tả ngắn về dịch vụ..." />
        </div>

        <div className="form-field">
          <label>Tính năng / Điểm nổi bật</label>
          <textarea value={form.features} onChange={e => set('features', e.target.value)} rows={3}
            placeholder="Mỗi tính năng một dòng, phân cách bằng |&#10;VD: Trụ nhập khẩu bảo hành dài hạn|Định vị 3D chính xác" />
          <span className="form-hint">Phân cách các tính năng bằng ký tự |</span>
        </div>

        <div className="form-field">
          <label>Giá</label>
          <input type="text" value={form.price} onChange={e => set('price', e.target.value)} placeholder="Liên hệ để báo giá" />
        </div>

        <ImageField
          label="Ảnh dịch vụ"
          value={form.image}
          onChange={v => set('image', v)}
        />

        <div className="form-field form-checkbox">
          <label>
            <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} />
            Dịch vụ nổi bật (hiển thị ở trang chủ)
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-ghost" onClick={() => navigate('/services')}>Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>
            {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm mới'}
          </button>
        </div>
      </form>
    </>
  )
}
