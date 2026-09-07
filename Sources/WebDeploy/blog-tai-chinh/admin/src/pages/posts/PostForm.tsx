import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Category {
  id: number
  name: string
}

interface FormData {
  category_id: string
  title: string
  slug: string
  excerpt: string
  content: string
  thumbnail: string
  author_name: string
  author_avatar: string
  author_role: string
  author_bio: string
  tags: string
  read_time: number
  home_section: string
  home_order: number
  trending_order: number
  status: string
  published_at: string
}

const empty: FormData = {
  category_id: '', title: '', slug: '', excerpt: '', content: '', thumbnail: '',
  author_name: 'Đặng Minh Thư',
  author_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=78',
  author_role: 'Người sáng lập La Bàn Tài Chính',
  author_bio: '7 năm làm việc trong lĩnh vực phân tích tài chính ngân hàng trước khi chuyển sang viết lách toàn thời gian với mong muốn giúp người trẻ Việt Nam tiếp cận kiến thức tài chính dễ hiểu hơn.',
  tags: '', read_time: 5, home_section: '', home_order: 0, trending_order: 0,
  status: 'published', published_at: new Date().toISOString().slice(0, 10),
}

function toDateInput(v: unknown): string {
  const s = String(v ?? '')
  return s ? s.slice(0, 10) : new Date().toISOString().slice(0, 10)
}

export default function PostForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormData>(empty)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    api.get<Category[]>('/categories').then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    if (!id) return
    api.get<Record<string, unknown>>(`/posts/${id}`)
      .then(d => setForm({
        category_id: d.category_id != null ? String(d.category_id) : '',
        title: String(d.title ?? ''), slug: String(d.slug ?? ''),
        excerpt: String(d.excerpt ?? ''), content: String(d.content ?? ''), thumbnail: String(d.thumbnail ?? ''),
        author_name: String(d.author_name ?? ''), author_avatar: String(d.author_avatar ?? ''),
        author_role: String(d.author_role ?? ''), author_bio: String(d.author_bio ?? ''),
        tags: String(d.tags ?? ''), read_time: Number(d.read_time ?? 5),
        home_section: String(d.home_section ?? ''), home_order: Number(d.home_order ?? 0),
        trending_order: Number(d.trending_order ?? 0), status: String(d.status ?? 'published'),
        published_at: toDateInput(d.published_at),
      }))
      .catch(() => setError('Không tìm thấy bài viết.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) { setError('Tiêu đề là bắt buộc.'); return }
    setSaving(true)
    try {
      const payload = {
        ...form,
        category_id: form.category_id ? Number(form.category_id) : null,
        published_at: form.published_at + ' 09:00:00',
      }
      if (isEdit) await api.put(`/posts/${id}`, payload)
      else await api.post('/posts', payload)
      navigate('/posts')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 760 }}>
      <div className="page-header">
        <div><div className="page-title">{isEdit ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}</div></div>
        <button onClick={() => navigate('/posts')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label" htmlFor="title">Tiêu đề *</label>
          <input id="title" type="text" className="form-control" value={form.title} onChange={e => set('title', e.target.value)} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="slug">Slug (để trống sẽ tự tạo)</label>
            <input id="slug" type="text" className="form-control" value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="lai-kep-la-gi" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="category_id">Chuyên mục</label>
            <select id="category_id" className="form-control" value={form.category_id} onChange={e => set('category_id', e.target.value)}>
              <option value="">— Chưa phân loại —</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="excerpt">Mô tả ngắn (hiển thị ở card)</label>
          <textarea id="excerpt" className="form-control" rows={2} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} />
        </div>
        <div className="form-group">
          <ImageField label="Ảnh đại diện bài viết" value={form.thumbnail} onChange={v => set('thumbnail', v)} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="content">Nội dung bài viết (HTML — hỗ trợ &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;img class="btc-inline-img"&gt;...)</label>
          <textarea id="content" className="form-control" rows={12} value={form.content} onChange={e => set('content', e.target.value)} style={{ fontFamily: 'monospace', fontSize: 12.5 }} />
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', margin: '20px 0 10px' }}>Tác giả</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="author_name">Tên tác giả</label>
            <input id="author_name" type="text" className="form-control" value={form.author_name} onChange={e => set('author_name', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="author_role">Vai trò tác giả</label>
            <input id="author_role" type="text" className="form-control" value={form.author_role} onChange={e => set('author_role', e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <ImageField label="Ảnh đại diện tác giả" value={form.author_avatar} onChange={v => set('author_avatar', v)} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="author_bio">Tiểu sử ngắn tác giả (hiển thị trong khối cuối bài)</label>
          <textarea id="author_bio" className="form-control" rows={2} value={form.author_bio} onChange={e => set('author_bio', e.target.value)} />
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', margin: '20px 0 10px' }}>Hiển thị</div>
        <div className="form-group">
          <label className="form-label" htmlFor="tags">Thẻ (cách nhau bởi dấu phẩy)</label>
          <input id="tags" type="text" className="form-control" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="Lãi kép, Đầu tư dài hạn, Kiến thức cơ bản" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="read_time">Số phút đọc</label>
            <input id="read_time" type="number" className="form-control" min={1} value={form.read_time} onChange={e => set('read_time', parseInt(e.target.value) || 1)} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="published_at">Ngày đăng</label>
            <input id="published_at" type="date" className="form-control" value={form.published_at} onChange={e => set('published_at', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="status">Trạng thái</label>
            <select id="status" className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Bản nháp</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="home_section">Vị trí trang chủ</label>
            <select id="home_section" className="form-control" value={form.home_section} onChange={e => set('home_section', e.target.value)}>
              <option value="">— Không hiển thị đặc biệt —</option>
              <option value="bento_main">Bài viết nổi bật — Ô chính (chỉ 1 bài)</option>
              <option value="bento_side">Bài viết nổi bật — Ô phụ (tối đa 3 bài)</option>
              <option value="latest">Bài viết mới nhất (tối đa 4 bài)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="home_order">Thứ tự trong khối (nếu có nhiều bài)</label>
            <input id="home_order" type="number" className="form-control" min={0} value={form.home_order} onChange={e => set('home_order', parseInt(e.target.value) || 0)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="trending_order">Thứ tự trong "Đọc nhiều nhất tuần này" (0 = không hiển thị, 1-5 = thứ tự)</label>
          <input id="trending_order" type="number" className="form-control" min={0} max={5} value={form.trending_order} onChange={e => set('trending_order', parseInt(e.target.value) || 0)} style={{ maxWidth: 200 }} />
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)', marginTop: 8 }}>
          <button type="button" onClick={() => navigate('/posts')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
