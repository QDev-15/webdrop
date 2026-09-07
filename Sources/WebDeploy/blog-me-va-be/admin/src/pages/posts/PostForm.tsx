import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Category {
  id: number
  name: string
  slug: string
}

interface FormData {
  title: string
  slug: string
  excerpt: string
  content: string
  thumbnail: string
  category_slug: string
  author_name: string
  author_avatar: string
  author_role: string
  read_time: number
  tags: string
  featured: boolean
  popular: boolean
  saved: boolean
  status: string
  published_at: string
}

const empty: FormData = {
  title: '', slug: '', excerpt: '', content: '', thumbnail: '', category_slug: '',
  author_name: 'Hạ Vy', author_avatar: '', author_role: 'Mẹ của Kem & Sữa',
  read_time: 5, tags: '', featured: false, popular: false, saved: false,
  status: 'published', published_at: '',
}

function toDateTimeLocal(v: string): string {
  if (!v) return ''
  // "2026-08-20 08:00:00" -> "2026-08-20T08:00"
  return v.replace(' ', 'T').slice(0, 16)
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
        title: String(d.title ?? ''),
        slug: String(d.slug ?? ''),
        excerpt: String(d.excerpt ?? ''),
        content: String(d.content ?? ''),
        thumbnail: String(d.thumbnail ?? ''),
        category_slug: String(d.category_slug ?? ''),
        author_name: String(d.author_name ?? 'Hạ Vy'),
        author_avatar: String(d.author_avatar ?? ''),
        author_role: String(d.author_role ?? ''),
        read_time: Number(d.read_time ?? 5),
        tags: String(d.tags ?? ''),
        featured: !!d.featured,
        popular: !!d.popular,
        saved: !!d.saved,
        status: String(d.status ?? 'published'),
        published_at: toDateTimeLocal(String(d.published_at ?? '')),
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
        published_at: form.published_at ? form.published_at.replace('T', ' ') + ':00' : '',
      }
      if (isEdit) {
        await api.put(`/posts/${id}`, payload)
      } else {
        await api.post('/posts', payload)
      }
      navigate('/posts')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 820 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}</div>
        </div>
        <button onClick={() => navigate('/posts')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Tiêu đề *</label>
          <input type="text" className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Vd: Ăn dặm kiểu Nhật hay BLW?" required />
        </div>
        <div className="form-group">
          <label className="form-label">Slug (để trống sẽ tự tạo từ tiêu đề)</label>
          <input type="text" className="form-control" value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="an-dam-kieu-nhat-hay-blw" />
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả ngắn (excerpt)</label>
          <textarea className="form-control" rows={2} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} placeholder="Hiển thị ở card danh sách bài viết" />
        </div>
        <div className="form-group">
          <label className="form-label">Nội dung bài viết (HTML)</label>
          <textarea className="form-control" rows={12} value={form.content} onChange={e => set('content', e.target.value)} placeholder="<p>...</p><h2>...</h2><ul><li>...</li></ul>" style={{ fontFamily: 'monospace', fontSize: 12.5 }} />
          <div className="form-hint">Hỗ trợ thẻ HTML: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;&lt;li&gt;, &lt;strong&gt;, &lt;div class="bmb-article-quote"&gt;...&lt;/div&gt; (trích dẫn nổi bật), &lt;div class="bmb-article-img"&gt;&lt;img src="..."&gt;&lt;/div&gt; (ảnh minh họa giữa bài).</div>
        </div>
        <div className="form-group">
          <ImageField label="Ảnh đại diện bài viết" value={form.thumbnail} onChange={v => set('thumbnail', v)} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Chuyên mục</label>
            <select className="form-control" value={form.category_slug} onChange={e => set('category_slug', e.target.value)}>
              <option value="">— Chọn chuyên mục —</option>
              {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Thời gian đọc (phút)</label>
            <input type="number" className="form-control" value={form.read_time} onChange={e => set('read_time', parseInt(e.target.value) || 0)} min={1} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Tên tác giả</label>
            <input type="text" className="form-control" value={form.author_name} onChange={e => set('author_name', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Vai trò tác giả</label>
            <input type="text" className="form-control" value={form.author_role} onChange={e => set('author_role', e.target.value)} placeholder="Mẹ của Kem & Sữa" />
          </div>
          <div className="form-group">
            <ImageField label="Ảnh đại diện tác giả" value={form.author_avatar} onChange={v => set('author_avatar', v)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Thẻ tag (phân cách bằng dấu phẩy)</label>
          <input type="text" className="form-control" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="ăn dặm, ăn dặm kiểu Nhật, BLW" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Ngày đăng</label>
            <input type="datetime-local" className="form-control" value={form.published_at} onChange={e => set('published_at', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="published">Đang hiện</option>
              <option value="draft">Nháp</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Hiển thị ở mục</label>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div className="form-check">
              <input type="checkbox" id="featured" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
              <label htmlFor="featured">🌟 Bài viết nổi bật (trang chủ)</label>
            </div>
            <div className="form-check">
              <input type="checkbox" id="popular" checked={form.popular} onChange={e => set('popular', e.target.checked)} />
              <label htmlFor="popular">🔥 Được đọc nhiều nhất (trang chủ)</label>
            </div>
            <div className="form-check">
              <input type="checkbox" id="saved" checked={form.saved} onChange={e => set('saved', e.target.checked)} />
              <label htmlFor="saved">💾 Được lưu nhiều nhất (trang cẩm nang)</label>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/posts')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Đăng bài')}</button>
        </div>
      </form>
    </div>
  )
}
