import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface SvcForm {
  name: string; description: string; content: string; icon: string
  image: string; price_text: string; features: string; featured: number; sort_order: number; status: string
}
const EMPTY: SvcForm = { name: '', description: '', content: '', icon: '', image: '', price_text: '', features: '[]', featured: 0, sort_order: 0, status: 'published' }

export default function ServiceForm() {
  const { id } = useParams(); const navigate = useNavigate(); const isEdit = Boolean(id)
  const [form, setForm] = useState<SvcForm>(EMPTY)
  const [error, setError] = useState(''); const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    api.get<SvcForm & { id: number }>(`/services/${id}`).then(s => setForm(s)).catch(() => {})
  }, [id, isEdit])

  const set = (k: keyof SvcForm, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const save = async (e: FormEvent) => {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      if (isEdit) await api.put(`/services/${id}`, form)
      else await api.post('/services', form)
      navigate('/services')
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Lỗi lưu dữ liệu.') }
    finally { setSaving(false) }
  }

  return (
    <>
      <div className="page-hd">
        <h1 className="page-hd-title">{isEdit ? 'Chỉnh sửa Dịch vụ' : 'Thêm Dịch vụ mới'}</h1>
        <button onClick={() => navigate('/services')} className="btn btn-ghost">← Quay lại</button>
      </div>
      <div className="card">
        {error && <div className="login-err">{error}</div>}
        <form onSubmit={save}>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Tên dịch vụ <span className="text-danger">*</span></label>
              <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Icon (emoji)</label>
              <input className="form-control" value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="🖥️" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả ngắn</label>
            <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} rows={3} />
          </div>
          <div className="form-group">
            <label className="form-label">Nội dung chi tiết</label>
            <textarea className="form-control" value={form.content} onChange={e => set('content', e.target.value)} rows={5} />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Giá / Mô tả giá</label>
              <input className="form-control" value={form.price_text} onChange={e => set('price_text', e.target.value)} placeholder="Từ 15.000.000đ" />
            </div>
            <div className="form-group">
              <label className="form-label">Ảnh đại diện (URL)</label>
              <input className="form-control" value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Tính năng (JSON array)</label>
            <textarea className="form-control" value={form.features} onChange={e => set('features', e.target.value)} rows={3} placeholder='["Tính năng 1","Tính năng 2"]' />
            <div className="form-hint">Format: ["Tính năng 1", "Tính năng 2", ...]</div>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Nổi bật</label>
              <select className="form-select" value={form.featured} onChange={e => set('featured', +e.target.value)}>
                <option value={0}>Không</option><option value={1}>Có</option>
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
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/services')}>Hủy</button>
          </div>
        </form>
      </div>
    </>
  )
}
