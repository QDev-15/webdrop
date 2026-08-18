import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface ServiceForm {
  icon: string
  title: string
  description: string
  sort_order: number
  status: string
}

const empty: ServiceForm = {
  icon: '⚙️', title: '', description: '', sort_order: 0, status: 'published',
}

const ICON_SUGGESTIONS = ['🤖', '⚙️', '📊', '🔗', '🛡️', '📚', '🚀', '☁️', '🔒', '💡']

export default function ServiceForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<ServiceForm>(empty)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    if (!id) return
    api.get<ServiceForm & { id: number }>(`/services/${id}`)
      .then(d => setForm({ icon: d.icon ?? '', title: d.title, description: d.description ?? '', sort_order: d.sort_order ?? 0, status: d.status ?? 'published' }))
      .catch(() => setError('Không tìm thấy dịch vụ.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof ServiceForm>(k: K, v: ServiceForm[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) { setError('Tiêu đề là bắt buộc.'); return }
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

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}</div>
        </div>
        <button onClick={() => navigate('/services')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Icon (emoji)</label>
          <input type="text" className="form-control" value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="🤖" style={{ maxWidth: 120 }} />
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {ICON_SUGGESTIONS.map(ic => (
              <button type="button" key={ic} onClick={() => set('icon', ic)}
                style={{ fontSize: 18, padding: '4px 8px', border: '1px solid var(--border)', borderRadius: 6, background: form.icon === ic ? 'var(--accent-light)' : 'var(--surface)', cursor: 'pointer' }}>
                {ic}
              </button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Tiêu đề *</label>
          <input type="text" className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Vd: AI SOLUTIONS" required />
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả</label>
          <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả ngắn gọn về dịch vụ" rows={4} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Thứ tự hiển thị</label>
            <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
          </div>
          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="published">Đang hiện</option>
              <option value="draft">Ẩn</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/services')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
