import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Category {
  id: number
  name: string
}

interface FormData {
  category_id: number | null
  title: string
  content: string
  author_name: string
  author_email: string
  author_avatar: string
  reply_count: number
  is_pinned: number
  is_hot: number
  status: string
  sort_order: number
}

const defaults: FormData = {
  category_id: null, title: '', content: '', author_name: '',
  author_email: '', author_avatar: '', reply_count: 0,
  is_pinned: 0, is_hot: 0, status: 'published', sort_order: 0
}

export default function ThreadForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<FormData>(defaults)
  const [cats, setCats] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<Category[]>('/forum-categories').then(setCats).catch(() => {})
    if (isEdit) {
      api.get<FormData & { id: number }>(`/forum-threads/${id}`)
        .then(d => setForm({
          category_id: d.category_id, title: d.title, content: d.content ?? '',
          author_name: d.author_name, author_email: d.author_email ?? '',
          author_avatar: d.author_avatar ?? '', reply_count: d.reply_count,
          is_pinned: d.is_pinned, is_hot: d.is_hot, status: d.status, sort_order: d.sort_order
        }))
        .catch(() => setError('Không tìm thấy chủ đề'))
    }
  }, [id, isEdit])

  const set = (k: keyof FormData, v: string | number | null) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      if (isEdit) await api.put(`/forum-threads/${id}`, form)
      else await api.post('/forum-threads', form)
      navigate('/forum-threads')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi lưu chủ đề')
    } finally { setSaving(false) }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Sửa chủ đề' : 'Tạo chủ đề mới'}</div>
        </div>
        <button className="btn-ghost" onClick={() => navigate('/forum-threads')}>Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ maxWidth: 720 }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Tiêu đề *</label>
            <input className="form-control" value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Danh mục</label>
            <select className="form-control" value={form.category_id ?? ''} onChange={e => set('category_id', e.target.value ? +e.target.value : null)}>
              <option value="">-- Chọn danh mục --</option>
              {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Nội dung</label>
            <textarea className="form-control" rows={6} value={form.content} onChange={e => set('content', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Tên tác giả *</label>
              <input className="form-control" value={form.author_name} onChange={e => set('author_name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email tác giả</label>
              <input type="email" className="form-control" value={form.author_email} onChange={e => set('author_email', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <ImageField label="Avatar tác giả" value={form.author_avatar} onChange={v => set('author_avatar', v)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Số trả lời</label>
              <input type="number" className="form-control" value={form.reply_count} onChange={e => set('reply_count', +e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Ghim</label>
              <select className="form-control" value={form.is_pinned} onChange={e => set('is_pinned', +e.target.value)}>
                <option value={0}>Không</option>
                <option value={1}>Có</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Hot</label>
              <select className="form-control" value={form.is_hot} onChange={e => set('is_hot', +e.target.value)}>
                <option value={0}>Không</option>
                <option value={1}>Có</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Hiển thị</option>
                <option value="draft">Nháp</option>
                <option value="hidden">Ẩn</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Lưu thay đổi' : 'Tạo chủ đề')}</button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/forum-threads')}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  )
}
