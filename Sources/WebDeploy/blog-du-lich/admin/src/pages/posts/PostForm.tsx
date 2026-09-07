import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Category {
  id: number
  name: string
}

interface PostFormData {
  category_id: number | ''
  title: string
  slug: string
  thumbnail: string
  excerpt: string
  content: string
  tags: string
  gallery_images: string
  read_time: number
  published_date: string
  updated_date: string
  featured: boolean
  sort_order: number
  status: string
}

const empty: PostFormData = {
  category_id: '', title: '', slug: '', thumbnail: '', excerpt: '', content: '',
  tags: '', gallery_images: '', read_time: 5, published_date: '', updated_date: '',
  featured: false, sort_order: 0, status: 'published',
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
    interface PostApi extends Omit<PostFormData, 'featured' | 'category_id'> {
      featured: number
      category_id: number | null
    }
    api.get<PostApi>(`/posts/${id}`)
      .then(d => setForm({
        category_id: d.category_id ?? '',
        title: d.title, slug: d.slug ?? '', thumbnail: d.thumbnail ?? '', excerpt: d.excerpt ?? '',
        content: d.content ?? '', tags: d.tags ?? '', gallery_images: d.gallery_images ?? '',
        read_time: d.read_time ?? 5, published_date: d.published_date ?? '', updated_date: d.updated_date ?? '',
        featured: !!d.featured, sort_order: d.sort_order ?? 0, status: d.status ?? 'published',
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
      const payload = { ...form, featured: form.featured ? 1 : 0 }
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

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Tiêu đề *</label>
          <input type="text" className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Tiêu đề bài viết" required />
        </div>
        <div className="form-group">
          <label className="form-label">Slug (để trống sẽ tự tạo từ tiêu đề)</label>
          <input type="text" className="form-control" value={form.slug} onChange={e => set('slug', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Chuyên mục</label>
            <select className="form-control" value={form.category_id} onChange={e => set('category_id', e.target.value ? parseInt(e.target.value) : '')}>
              <option value="">— Không chọn —</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Thời gian đọc (phút)</label>
            <input type="number" className="form-control" value={form.read_time} onChange={e => set('read_time', parseInt(e.target.value) || 0)} min={1} />
          </div>
        </div>
        <div className="form-group">
          <ImageField label="Ảnh đại diện" value={form.thumbnail} onChange={v => set('thumbnail', v)} />
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả ngắn (excerpt)</label>
          <textarea className="form-control" rows={2} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} placeholder="Hiển thị trong thẻ bài viết ở trang danh sách" />
        </div>
        <div className="form-group">
          <label className="form-label">Nội dung bài viết (hỗ trợ HTML: h2, p, ul/li, ol/li, blockquote, figure/figcaption)</label>
          <textarea className="form-control" rows={16} value={form.content} onChange={e => set('content', e.target.value)} style={{ fontFamily: 'monospace', fontSize: 12.5 }} />
        </div>
        <div className="form-group">
          <label className="form-label">Thẻ tag (cách nhau bởi dấu |)</label>
          <input type="text" className="form-control" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="Hà Giang|Phượt xe máy|Điểm đến trong nước" />
        </div>
        <div className="form-group">
          <label className="form-label">Ảnh gallery cuối bài (mỗi dòng 1 URL)</label>
          <textarea
            className="form-control"
            rows={4}
            value={form.gallery_images.split('|').filter(Boolean).join('\n')}
            onChange={e => set('gallery_images', e.target.value.split('\n').map(s => s.trim()).filter(Boolean).join('|'))}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Ngày đăng</label>
            <input type="date" className="form-control" value={form.published_date} onChange={e => set('published_date', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Cập nhật lần cuối (hiển thị, tự do)</label>
            <input type="text" className="form-control" value={form.updated_date} onChange={e => set('updated_date', e.target.value)} placeholder="20/08/2026" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Thứ tự hiển thị</label>
            <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
          </div>
          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="published">Đang hiện</option>
              <option value="draft">Nháp</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">&nbsp;</label>
            <label className="form-check" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <input type="checkbox" className="form-checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
              Bài viết nổi bật (cover story trang chủ)
            </label>
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
