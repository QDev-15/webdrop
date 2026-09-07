import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Category {
  id: number
  name: string
}

interface PostFormData {
  title: string
  slug: string
  category_id: string
  excerpt: string
  content: string
  thumbnail: string
  author_name: string
  author_avatar: string
  author_role: string
  author_bio: string
  tags: string
  featured: boolean
  read_time: number
  is_review: boolean
  review_score: string
  review_score_label: string
  review_category: string
  status: string
  meta_title: string
  meta_description: string
}

const empty: PostFormData = {
  title: '', slug: '', category_id: '', excerpt: '', content: '', thumbnail: '',
  author_name: '', author_avatar: '', author_role: '', author_bio: '', tags: '',
  featured: false, read_time: 5, is_review: false, review_score: '', review_score_label: '', review_category: '',
  status: 'published', meta_title: '', meta_description: '',
}

export default function PostForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<PostFormData>(empty)
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    api.get<any>(`/posts/${id}`)
      .then(d => setForm({
        title: d.title, slug: d.slug, category_id: d.category_id ? String(d.category_id) : '',
        excerpt: d.excerpt ?? '', content: d.content ?? '', thumbnail: d.thumbnail ?? '',
        author_name: d.author_name ?? '', author_avatar: d.author_avatar ?? '', author_role: d.author_role ?? '', author_bio: d.author_bio ?? '',
        tags: d.tags ?? '', featured: !!d.featured, read_time: d.read_time ?? 5,
        is_review: d.review_score !== null && d.review_score !== undefined,
        review_score: d.review_score !== null && d.review_score !== undefined ? String(d.review_score) : '',
        review_score_label: d.review_score_label ?? '', review_category: d.review_category ?? '',
        status: d.status ?? 'published', meta_title: d.meta_title ?? '', meta_description: d.meta_description ?? '',
      }))
      .catch(() => setError('Không tìm thấy bài viết.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof PostFormData>(k: K, v: PostFormData[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) { setError('Tiêu đề là bắt buộc.'); return }
    setSaving(true)
    try {
      const payload = {
        title: form.title, slug: form.slug, category_id: form.category_id || null,
        excerpt: form.excerpt, content: form.content, thumbnail: form.thumbnail,
        author_name: form.author_name, author_avatar: form.author_avatar, author_role: form.author_role, author_bio: form.author_bio,
        tags: form.tags, featured: form.featured, read_time: form.read_time,
        review_score: form.is_review ? form.review_score : '',
        review_score_label: form.is_review ? form.review_score_label : '',
        review_category: form.is_review ? form.review_category : '',
        status: form.status, meta_title: form.meta_title, meta_description: form.meta_description,
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
    <div style={{ maxWidth: 760 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}</div>
        </div>
        <button onClick={() => navigate('/posts')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div className="form-group">
          <label className="form-label">Tiêu đề *</label>
          <input type="text" className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Tiêu đề bài viết" required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Slug (để trống sẽ tự tạo)</label>
            <input type="text" className="form-control" value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="ten-bai-viet" />
          </div>
          <div className="form-group">
            <label className="form-label">Chuyên mục</label>
            <select className="form-control" value={form.category_id} onChange={e => set('category_id', e.target.value)}>
              <option value="">— Chọn chuyên mục —</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả ngắn (excerpt)</label>
          <textarea className="form-control" value={form.excerpt} onChange={e => set('excerpt', e.target.value)} placeholder="Tóm tắt hiển thị ở thẻ bài viết" rows={2} />
        </div>
        <div className="form-group">
          <label className="form-label">Nội dung (hỗ trợ HTML: &lt;h2&gt;, &lt;p&gt;, &lt;blockquote&gt;, &lt;ul&gt;...)</label>
          <textarea className="form-control" value={form.content} onChange={e => set('content', e.target.value)} placeholder="Nội dung đầy đủ bài viết" rows={12} style={{ fontFamily: 'monospace', fontSize: 13 }} />
        </div>
        <div className="form-group">
          <ImageField label="Ảnh đại diện bài viết" value={form.thumbnail} onChange={v => set('thumbnail', v)} />
        </div>

        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 16, marginTop: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Tác giả</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Tên tác giả</label>
              <input type="text" className="form-control" value={form.author_name} onChange={e => set('author_name', e.target.value)} placeholder="Đăng Khoa" />
            </div>
            <div className="form-group">
              <label className="form-label">Chức danh</label>
              <input type="text" className="form-control" value={form.author_role} onChange={e => set('author_role', e.target.value)} placeholder="Biên tập viên công nghệ" />
            </div>
          </div>
          <div className="form-group">
            <ImageField label="Ảnh đại diện tác giả" value={form.author_avatar} onChange={v => set('author_avatar', v)} />
          </div>
          <div className="form-group">
            <label className="form-label">Tiểu sử ngắn tác giả</label>
            <textarea className="form-control" value={form.author_bio} onChange={e => set('author_bio', e.target.value)} placeholder="Giới thiệu ngắn về tác giả, hiển thị ở cuối bài viết" rows={2} />
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 16, marginTop: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Thẻ (tags, phân cách bởi dấu phẩy)</label>
              <input type="text" className="form-control" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="AI, chip 2nm, bảo mật" />
            </div>
            <div className="form-group">
              <label className="form-label">Thời gian đọc (phút)</label>
              <input type="number" className="form-control" value={form.read_time} onChange={e => set('read_time', parseInt(e.target.value) || 5)} min={1} />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Đang hiện</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
          </div>
          <div className="form-check" style={{ marginBottom: 16 }}>
            <input type="checkbox" id="featured" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
            <label htmlFor="featured">Bài viết nổi bật (hiển thị ở khối "Bài viết đang được quan tâm" trang chủ)</label>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 16, marginTop: 8 }}>
          <div className="form-check" style={{ marginBottom: 16 }}>
            <input type="checkbox" id="is_review" checked={form.is_review} onChange={e => set('is_review', e.target.checked)} />
            <label htmlFor="is_review">Đây là bài đánh giá sản phẩm (hiển thị ở trang "Đánh giá sản phẩm" kèm điểm số)</label>
          </div>
          {form.is_review && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Điểm đánh giá (thang 10)</label>
                <input type="number" className="form-control" step="0.1" min={0} max={10} value={form.review_score} onChange={e => set('review_score', e.target.value)} placeholder="9.2" />
              </div>
              <div className="form-group">
                <label className="form-label">Nhãn xếp hạng</label>
                <input type="text" className="form-control" value={form.review_score_label} onChange={e => set('review_score_label', e.target.value)} placeholder="Xuất sắc" />
              </div>
              <div className="form-group">
                <label className="form-label">Nhóm sản phẩm</label>
                <input type="text" className="form-control" value={form.review_category} onChange={e => set('review_category', e.target.value)} placeholder="Laptop, Smartphone, Âm thanh..." />
              </div>
            </div>
          )}
        </div>

        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 16, marginTop: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>SEO</div>
          <div className="form-group">
            <label className="form-label">Meta title</label>
            <input type="text" className="form-control" value={form.meta_title} onChange={e => set('meta_title', e.target.value)} placeholder="Tiêu đề SEO" />
          </div>
          <div className="form-group">
            <label className="form-label">Meta description</label>
            <textarea className="form-control" value={form.meta_description} onChange={e => set('meta_description', e.target.value)} placeholder="Mô tả SEO" rows={2} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/posts')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
