import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface PostFormData { title: string; excerpt: string; content: string; thumbnail: string; category: string; status: string; featured: number; meta_title: string; meta_description: string }
const EMPTY: PostFormData = { title: '', excerpt: '', content: '', thumbnail: '', category: '', status: 'draft', featured: 0, meta_title: '', meta_description: '' }

export default function PostForm() {
  const { id } = useParams(); const navigate = useNavigate(); const isEdit = Boolean(id)
  const [form, setForm] = useState<PostFormData>(EMPTY)
  const [error, setError] = useState(''); const [saving, setSaving] = useState(false)

  useEffect(() => { if (!isEdit) return; api.get<PostFormData & { id: number }>(`/posts/${id}`).then(p => setForm(p)).catch(() => {}) }, [id, isEdit])

  const set = (k: keyof PostFormData, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const save = async (e: FormEvent) => {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      if (isEdit) await api.put(`/posts/${id}`, form)
      else await api.post('/posts', form)
      navigate('/posts')
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Lỗi lưu dữ liệu.') }
    finally { setSaving(false) }
  }

  return (
    <>
      <div className="page-hd">
        <h1 className="page-hd-title">{isEdit ? 'Chỉnh sửa Bài viết' : 'Viết bài mới'}</h1>
        <button onClick={() => navigate('/posts')} className="btn btn-ghost">← Quay lại</button>
      </div>
      <div className="card">
        {error && <div className="login-err">{error}</div>}
        <form onSubmit={save}>
          <div className="form-group">
            <label className="form-label">Tiêu đề <span className="text-danger">*</span></label>
            <input className="form-control" value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Tóm tắt</label>
            <textarea className="form-control" value={form.excerpt} onChange={e => set('excerpt', e.target.value)} rows={2} />
          </div>
          <div className="form-group">
            <label className="form-label">Nội dung</label>
            <textarea className="form-control" value={form.content} onChange={e => set('content', e.target.value)} rows={10} />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Ảnh đại diện (URL)</label>
              <input className="form-control" value={form.thumbnail} onChange={e => set('thumbnail', e.target.value)} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label className="form-label">Danh mục</label>
              <input className="form-control" value={form.category} onChange={e => set('category', e.target.value)} placeholder="Tin tức, Chia sẻ..." />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Meta title</label>
            <input className="form-control" value={form.meta_title} onChange={e => set('meta_title', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Meta description</label>
            <textarea className="form-control" value={form.meta_description} onChange={e => set('meta_description', e.target.value)} rows={2} />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Nổi bật</label>
              <select className="form-select" value={form.featured} onChange={e => set('featured', +e.target.value)}>
                <option value={0}>Không</option><option value={1}>Có</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="draft">Draft</option><option value="published">Published</option>
              </select>
            </div>
          </div>
          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Đăng bài')}</button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/posts')}>Hủy</button>
          </div>
        </form>
      </div>
    </>
  )
}
