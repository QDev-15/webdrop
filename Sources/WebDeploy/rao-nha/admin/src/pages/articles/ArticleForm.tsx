import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface ArticleForm {
  title: string; category: string; thumbnail: string; excerpt: string; content: string; author: string;
  published_at: string; regenerate_slug?: boolean
}
const empty: ArticleForm = {
  title: '', category: 'Kinh nghiệm', thumbnail: '', excerpt: '', content: '',
  author: 'Đội ngũ biên tập RaoNhà', published_at: new Date().toISOString().slice(0, 10),
}
const CATEGORIES = ['Kinh nghiệm', 'Pháp lý', 'Thị trường', 'Đầu tư', 'Hướng dẫn']

export default function ArticleFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<ArticleForm>(empty)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    if (!id) return
    api.get<ArticleForm & { id: number; published_at: string }>(`/articles/${id}`)
      .then(d => setForm({
        title: d.title, category: d.category ?? 'Kinh nghiệm', thumbnail: d.thumbnail ?? '',
        excerpt: d.excerpt ?? '', content: d.content ?? '', author: d.author ?? 'Đội ngũ biên tập RaoNhà',
        published_at: (d.published_at ?? '').slice(0, 10) || new Date().toISOString().slice(0, 10),
      }))
      .catch(() => setError('Không tìm thấy bài viết.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof ArticleForm>(k: K, v: ArticleForm[K]) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) { setError('Tiêu đề là bắt buộc.'); return }
    setSaving(true)
    try {
      const payload = { ...form, published_at: form.published_at + ' 08:00:00' }
      if (isEdit) await api.put(`/articles/${id}`, payload)
      else await api.post('/articles', payload)
      navigate('/articles')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="page-header">
        <div className="page-title">{isEdit ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}</div>
        <button onClick={() => navigate('/articles')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Tiêu đề *</label>
          <input type="text" className="form-control" value={form.title} onChange={e => set('title', e.target.value)} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Chuyên mục</label>
            <select className="form-control" value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Tác giả</label>
            <input type="text" className="form-control" value={form.author} onChange={e => set('author', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Ngày đăng</label>
            <input type="date" className="form-control" value={form.published_at} onChange={e => set('published_at', e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <ImageField label="Ảnh đại diện" value={form.thumbnail} onChange={v => set('thumbnail', v)} />
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả ngắn</label>
          <textarea className="form-control" rows={2} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Nội dung (mỗi đoạn cách nhau 1 dòng trống)</label>
          <textarea className="form-control" rows={12} value={form.content} onChange={e => set('content', e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/articles')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Đăng bài')}</button>
        </div>
      </form>
    </div>
  )
}
