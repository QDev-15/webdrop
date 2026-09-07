import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface FormData {
  year: string
  title: string
  description: string
  sort_order: number
}

const empty: FormData = { year: '', title: '', description: '', sort_order: 0 }

export default function TimelineForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<FormData>(empty)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api.get<FormData>(`/timeline/${id}`)
      .then(d => setForm({ ...empty, ...d }))
      .catch(() => setError('Không tìm thấy.'))
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
    <div style={{ maxWidth: 560 }}>
      <div className="page-header">
        <div className="page-title">{isEdit ? 'Sửa mốc thời gian' : 'Thêm mốc thời gian mới'}</div>
        <button onClick={() => navigate('/timeline')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Năm *</label>
            <input className="form-control" value={form.year} onChange={e => set('year', e.target.value)} placeholder="2018" required />
          </div>
          <div className="form-group">
            <label className="form-label">Tiêu đề *</label>
            <input className="form-control" value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả</label>
          <textarea className="form-control" rows={3} value={form.description} onChange={e => set('description', e.target.value)} />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Thứ tự</label>
          <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)', marginTop: 16 }}>
          <button type="button" onClick={() => navigate('/timeline')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
