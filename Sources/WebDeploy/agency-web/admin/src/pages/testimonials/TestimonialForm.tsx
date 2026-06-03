import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface TsForm { author_name: string; author_title: string; author_avatar: string; content: string; rating: number; sort_order: number; status: string }
const EMPTY: TsForm = { author_name: '', author_title: '', author_avatar: '', content: '', rating: 5, sort_order: 0, status: 'published' }

export default function TestimonialForm() {
  const { id } = useParams(); const navigate = useNavigate(); const isEdit = Boolean(id)
  const [form, setForm] = useState<TsForm>(EMPTY)
  const [error, setError] = useState(''); const [saving, setSaving] = useState(false)

  useEffect(() => { if (!isEdit) return; api.get<TsForm & { id: number }>(`/testimonials/${id}`).then(t => setForm(t)).catch(() => {}) }, [id, isEdit])

  const set = (k: keyof TsForm, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const save = async (e: FormEvent) => {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      if (isEdit) await api.put(`/testimonials/${id}`, form)
      else await api.post('/testimonials', form)
      navigate('/testimonials')
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Lỗi lưu dữ liệu.') }
    finally { setSaving(false) }
  }

  return (
    <>
      <div className="page-hd">
        <h1 className="page-hd-title">{isEdit ? 'Chỉnh sửa Đánh giá' : 'Thêm Đánh giá mới'}</h1>
        <button onClick={() => navigate('/testimonials')} className="btn btn-ghost">← Quay lại</button>
      </div>
      <div className="card">
        {error && <div className="login-err">{error}</div>}
        <form onSubmit={save}>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Tên tác giả <span className="text-danger">*</span></label>
              <input className="form-control" value={form.author_name} onChange={e => set('author_name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Chức vụ / Công ty</label>
              <input className="form-control" value={form.author_title} onChange={e => set('author_title', e.target.value)} placeholder="CEO · Công ty ABC" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Avatar (URL)</label>
            <input className="form-control" value={form.author_avatar} onChange={e => set('author_avatar', e.target.value)} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label className="form-label">Nội dung đánh giá <span className="text-danger">*</span></label>
            <textarea className="form-control" value={form.content} onChange={e => set('content', e.target.value)} rows={4} required />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Rating (1-5)</label>
              <select className="form-select" value={form.rating} onChange={e => set('rating', +e.target.value)}>
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} sao {'★'.repeat(r)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input className="form-control" type="number" value={form.sort_order} onChange={e => set('sort_order', +e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Published</option><option value="draft">Draft</option>
              </select>
            </div>
          </div>
          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Tạo mới')}</button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/testimonials')}>Hủy</button>
          </div>
        </form>
      </div>
    </>
  )
}
