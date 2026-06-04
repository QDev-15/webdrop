import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface ServiceData {
  name: string
  number: string
  description: string
  content: string
  icon: string
  tags: string
  price_text: string
  featured: number
  sort_order: number
  status: string
}

const EMPTY: ServiceData = { name: '', number: '', description: '', content: '', icon: '', tags: '', price_text: '', featured: 0, sort_order: 0, status: 'published' }

export default function ServiceForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState<ServiceData>(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<ServiceData & { id: number }>(`/services/${id}`)
      .then(d => setForm({ name: d.name, number: d.number || '', description: d.description || '', content: d.content || '', icon: d.icon || '', tags: d.tags || '', price_text: d.price_text || '', featured: d.featured, sort_order: d.sort_order, status: d.status }))
      .catch(() => setError('Không tìm thấy dịch vụ'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  function set(key: keyof ServiceData, val: string | number) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (isEdit) {
        await api.put(`/services/${id}`, form)
      } else {
        await api.post('/services', form)
      }
      navigate('/services')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi lưu dữ liệu')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ color: 'var(--text-3)', fontSize: '14px' }}>Đang tải...</div>

  return (
    <>
      <div className="page-hd">
        <h1 className="page-hd-title">{isEdit ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ'}</h1>
      </div>

      <div className="card">
        {error && <div className="login-err">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Tên dịch vụ *</label>
              <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Số thứ tự (01, 02, 03...)</label>
              <input type="text" className="form-control" value={form.number} onChange={e => set('number', e.target.value)} placeholder="01" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả ngắn</label>
            <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} rows={3} />
          </div>

          <div className="form-group">
            <label className="form-label">Tags (phân cách bằng dấu phẩy)</label>
            <input type="text" className="form-control" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="Logo Design, Brand Guidelines, Visual Identity" />
            <div className="form-hint">Các tag hiển thị dưới dịch vụ trong template</div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Giá tham khảo</label>
              <input type="text" className="form-control" value={form.price_text} onChange={e => set('price_text', e.target.value)} placeholder="Từ 15 triệu" />
            </div>
            <div className="form-group">
              <label className="form-label">Icon (emoji)</label>
              <input type="text" className="form-control" value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="◆" />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Thứ tự hiển thị</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', +e.target.value)} min={0} />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Hiển thị</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.featured === 1} onChange={e => set('featured', e.target.checked ? 1 : 0)} />
              <span className="form-label" style={{ margin: 0 }}>Nổi bật (hiển thị trên trang chủ)</span>
            </label>
          </div>

          <hr className="section-sep" />
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Đang lưu...' : (isEdit ? 'Lưu thay đổi' : 'Thêm dịch vụ')}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/services')}>Hủy</button>
          </div>
        </form>
      </div>
    </>
  )
}
