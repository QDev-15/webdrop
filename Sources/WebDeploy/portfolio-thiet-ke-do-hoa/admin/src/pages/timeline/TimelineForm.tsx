import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface FormData {
  year: string
  title: string
  description: string
  sort_order: number
  status: string
}

const empty: FormData = { year: '', title: '', description: '', sort_order: 0, status: 'published' }

export default function TimelineForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormData>(empty)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    if (!id) return
    api.get<Record<string, unknown>>(`/timeline/${id}`)
      .then(d => setForm({
        year: String(d.year ?? ''), title: String(d.title ?? ''), description: String(d.description ?? ''),
        sort_order: Number(d.sort_order ?? 0), status: String(d.status ?? 'published'),
      }))
      .catch(() => setError('Không tìm thấy mốc thời gian.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.year.trim() || !form.title.trim()) { setError('Năm và tiêu đề không được để trống.'); return }
    setSaving(true)
    try {
      if (isEdit) await api.put(`/timeline/${id}`, form)
      else await api.post('/timeline', form)
      navigate('/timeline')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa mốc thời gian' : 'Thêm mốc thời gian mới'}</div>
        </div>
        <button onClick={() => navigate('/timeline')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="year">Năm *</label>
            <input id="year" type="text" className="form-control" value={form.year} onChange={e => set('year', e.target.value)} placeholder="2014 – 2017" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="title">Tiêu đề *</label>
            <input id="title" type="text" className="form-control" value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="description">Mô tả</label>
          <textarea id="description" className="form-control" rows={3} value={form.description} onChange={e => set('description', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="sort_order">Thứ tự hiển thị</label>
            <input id="sort_order" type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="status">Trạng thái</label>
            <select id="status" className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="published">Đang hiện</option>
              <option value="draft">Ẩn</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/timeline')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
