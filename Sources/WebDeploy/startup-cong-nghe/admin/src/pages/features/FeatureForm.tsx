import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface FeatureData { name: string; tag: string; icon: string; description: string; content: string; image: string; featured: number; sort_order: number; status: string }

const empty: FeatureData = { name: '', tag: '', icon: '', description: '', content: '', image: '', featured: 0, sort_order: 0, status: 'published' }

export default function FeatureForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<FeatureData>(empty)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<FeatureData>(`/features/${id}`).then(setForm).catch(() => setError('Không tìm thấy'))
    }
  }, [id, isEdit])

  const set = (field: keyof FeatureData, value: string | number) => setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isEdit) await api.put(`/features/${id}`, form)
      else await api.post('/features', form)
      navigate('/features')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Sửa tính năng' : 'Thêm tính năng'}</h1>
      </div>
      <div className="card" style={{ maxWidth: 760 }}>
        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: 'var(--danger)', borderRadius: 9, padding: '10px 14px', marginBottom: 16, fontSize: 13 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tên tính năng *</label>
              <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Tag (ví dụ: Automation)</label>
              <input type="text" className="form-control" value={form.tag} onChange={e => set('tag', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Icon (emoji)</label>
              <input type="text" className="form-control" value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="⚡" />
            </div>
            <div className="form-group">
              <label className="form-label">URL ảnh</label>
              <input type="text" className="form-control" value={form.image} onChange={e => set('image', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả ngắn</label>
            <textarea className="form-control" rows={2} value={form.description} onChange={e => set('description', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Nội dung chi tiết (mỗi dòng = 1 bullet)</label>
            <textarea className="form-control" rows={6} value={form.content} onChange={e => set('content', e.target.value)} placeholder="Kéo thả để tạo quy trình&#10;Hơn 100 template sẵn có&#10;..." />
            <p className="form-hint">Mỗi dòng sẽ hiển thị thành 1 mục trong danh sách</p>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nổi bật (hiển thị ở bento-grid trang chủ)</label>
              <select className="form-control" value={form.featured} onChange={e => set('featured', parseInt(e.target.value))}>
                <option value={0}>Không nổi bật</option>
                <option value={1}>Nổi bật</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="published">Hiển thị</option>
              <option value="draft">Ẩn</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/features')}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  )
}
