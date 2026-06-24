import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Category { id: number; name: string }

interface FormState {
  category_id: string
  name: string
  image: string
  category_label: string
  description: string
  price: string
  duration: string
  sort_order: string
  is_active: string
}

export default function ServiceForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const navigate = useNavigate()

  const [cats, setCats] = useState<Category[]>([])
  const [form, setForm] = useState<FormState>({
    category_id: '', name: '', image: '', category_label: '',
    description: '', price: '', duration: '', sort_order: '0', is_active: '1',
  })
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<Category[]>('/service-categories').then(setCats).catch(() => {})
    if (isEdit) {
      api.get<Record<string, string>>(`/services/${id}`)
        .then(data => {
          setForm({
            category_id: String(data.category_id ?? ''),
            name: data.name ?? '',
            image: data.image ?? '',
            category_label: data.category_label ?? '',
            description: data.description ?? '',
            price: data.price ?? '',
            duration: data.duration ?? '',
            sort_order: String(data.sort_order ?? '0'),
            is_active: String(data.is_active ?? '1'),
          })
        })
        .finally(() => setLoading(false))
    }
  }, [id, isEdit])

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên dịch vụ là bắt buộc.'); return }
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, category_id: form.category_id || null, sort_order: Number(form.sort_order), is_active: Number(form.is_active) }
      if (isEdit) {
        await api.put(`/services/${id}`, payload)
      } else {
        await api.post('/services', payload)
      }
      navigate('/services')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Có lỗi xảy ra.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="page-loading">Đang tải...</div>

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}</h1>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/services')}>← Quay lại</button>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Tên dịch vụ *</label>
            <input className="form-input" value={form.name} onChange={set('name')} required placeholder="LED Blue Light — Diệt khuẩn mụn" />
          </div>
          <div className="form-group">
            <label className="form-label">Danh mục</label>
            <select className="form-input" value={form.category_id} onChange={set('category_id')}>
              <option value="">— Chọn danh mục —</option>
              {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Nhãn kỹ thuật (category_label)</label>
          <input className="form-input" value={form.category_label} onChange={set('category_label')} placeholder="LED Light Therapy" />
        </div>

        <div className="form-group">
          <ImageField
            label="Ảnh dịch vụ"
            value={form.image}
            onChange={url => setForm(f => ({ ...f, image: url }))}
            placeholder="https://..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Mô tả dịch vụ</label>
          <textarea className="form-input" rows={4} value={form.description} onChange={set('description')} placeholder="Mô tả chi tiết về dịch vụ..." />
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Giá (ví dụ: 350.000đ / buổi)</label>
            <input className="form-input" value={form.price} onChange={set('price')} placeholder="350.000đ / buổi" />
          </div>
          <div className="form-group">
            <label className="form-label">Thời gian (ví dụ: 30 phút · 6–10 buổi)</label>
            <input className="form-input" value={form.duration} onChange={set('duration')} placeholder="30 phút · 6–10 buổi" />
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Thứ tự</label>
            <input type="number" className="form-input" value={form.sort_order} onChange={set('sort_order')} />
          </div>
          <div className="form-group">
            <label className="form-label">Hiển thị</label>
            <select className="form-input" value={form.is_active} onChange={set('is_active')}>
              <option value="1">Có</option>
              <option value="0">Không</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/services')}>Hủy</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu dịch vụ'}</button>
        </div>
      </form>
    </div>
  )
}
