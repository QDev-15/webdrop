import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface FormData {
  name: string
  level_label: string
  level_percent: number
  sort_order: number
  status: string
}

const empty: FormData = { name: '', level_label: 'Thành thạo', level_percent: 80, sort_order: 0, status: 'published' }

export default function ToolSkillForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormData>(empty)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    if (!id) return
    api.get<Record<string, unknown>>(`/tools-skills/${id}`)
      .then(d => setForm({
        name: String(d.name ?? ''), level_label: String(d.level_label ?? ''),
        level_percent: Number(d.level_percent ?? 80), sort_order: Number(d.sort_order ?? 0), status: String(d.status ?? 'published'),
      }))
      .catch(() => setError('Không tìm thấy công cụ.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Tên công cụ không được để trống.'); return }
    setSaving(true)
    try {
      if (isEdit) await api.put(`/tools-skills/${id}`, form)
      else await api.post('/tools-skills', form)
      navigate('/tools')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 560 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa công cụ' : 'Thêm công cụ mới'}</div>
        </div>
        <button onClick={() => navigate('/tools')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label" htmlFor="name">Tên công cụ *</label>
          <input id="name" type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Illustrator" required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="level_label">Mức độ</label>
            <select id="level_label" className="form-control" value={form.level_label} onChange={e => set('level_label', e.target.value)}>
              <option value="Thành thạo">Thành thạo</option>
              <option value="Khá">Khá</option>
              <option value="Cơ bản">Cơ bản</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="level_percent">% thanh tiến trình</label>
            <input id="level_percent" type="number" className="form-control" value={form.level_percent} onChange={e => set('level_percent', parseInt(e.target.value) || 0)} min={0} max={100} />
          </div>
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
          <button type="button" onClick={() => navigate('/tools')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
