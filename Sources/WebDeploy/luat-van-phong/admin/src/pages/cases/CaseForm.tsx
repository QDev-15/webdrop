import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

const CATEGORIES = ['Luật Doanh Nghiệp', 'Tranh Tụng', 'Bất Động Sản', 'Luật Lao Động', 'Hình Sự Kinh Tế', 'Sở Hữu Trí Tuệ']

interface CaseData { title: string; category: string; summary: string; outcome: string; year: number; location: string; sort_order: number; status: string }

export default function CaseForm() {
  const { id } = useParams()
  const nav = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState<CaseData>({ title: '', category: '', summary: '', outcome: '', year: new Date().getFullYear(), location: '', sort_order: 0, status: 'published' })
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<CaseData & { id: number }>(`/cases/${id}`).then(c => {
        setForm({ title: c.title, category: c.category || '', summary: c.summary || '', outcome: c.outcome || '', year: c.year || new Date().getFullYear(), location: c.location || '', sort_order: c.sort_order || 0, status: c.status })
      }).catch(() => {})
    }
  }, [id, isEdit])

  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title) { setAlert('Tiêu đề không được để trống'); return }
    setSaving(true); setAlert('')
    try {
      if (isEdit) await api.put(`/cases/${id}`, form)
      else        await api.post('/cases', form)
      nav('/cases')
    } catch (err: unknown) {
      setAlert(err instanceof Error ? err.message : 'Lỗi khi lưu')
    } finally { setSaving(false) }
  }

  return (
    <>
      <div className="page-hdr"><h1>{isEdit ? 'Sửa Vụ Việc' : 'Thêm Vụ Việc'}</h1></div>
      {alert && <div className="alert alert-error">{alert}</div>}
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tiêu đề vụ việc *</label>
            <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Danh mục</label>
              <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
                <option value="">-- Chọn danh mục --</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Năm</label>
              <input className="form-input" type="number" value={form.year} onChange={e => set('year', Number(e.target.value))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Địa điểm / Tòa án</label>
            <input className="form-input" value={form.location} onChange={e => set('location', e.target.value)} placeholder="Tòa án TP.HCM" />
          </div>
          <div className="form-group">
            <label className="form-label">Tóm tắt vụ việc</label>
            <textarea className="form-textarea" value={form.summary} onChange={e => set('summary', e.target.value)} rows={5} />
          </div>
          <div className="form-group">
            <label className="form-label">Kết quả</label>
            <textarea className="form-textarea" value={form.outcome} onChange={e => set('outcome', e.target.value)} rows={3} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input className="form-input" type="number" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
            <button type="button" className="btn btn-ghost" onClick={() => nav('/cases')}>Hủy</button>
          </div>
        </form>
      </div>
    </>
  )
}
