import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface Category {
  id: number
  name: string
}

interface Tag {
  id: number
  name: string
  slug: string
}

interface PostDetail {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  thumbnail: string
  status: string
  featured: number
  read_time: number
  category_id: number | null
  meta_title: string
  meta_description: string
  tags?: Tag[]
}

export default function PostForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    thumbnail: '',
    status: 'draft',
    featured: false,
    read_time: 5,
    category_id: '',
    meta_title: '',
    meta_description: '',
  })
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    api.get<Category[]>('/post-categories').then(setCategories).catch(() => null)
    api.get<Tag[]>('/tags').then(setTags).catch(() => null)
    if (isEdit && id) {
      api.get<PostDetail>(`/posts/${id}`)
        .then(post => {
          setForm({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt ?? '',
            content: post.content ?? '',
            thumbnail: post.thumbnail ?? '',
            status: post.status,
            featured: Boolean(post.featured),
            read_time: post.read_time ?? 5,
            category_id: post.category_id ? String(post.category_id) : '',
            meta_title: post.meta_title ?? '',
            meta_description: post.meta_description ?? '',
          })
          setSelectedTags(post.tags?.map(t => t.id) ?? [])
        })
        .catch(() => setError('Khong the tai bai viet.'))
        .finally(() => setLoading(false))
    }
  }, [id, isEdit])

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked })
    } else {
      setForm({ ...form, [name]: value })
      if (name === 'title' && !isEdit) {
        setForm(f => ({ ...f, slug: slugify(value) }))
      }
    }
  }

  function slugify(text: string) {
    return text.toLowerCase()
      .replace(/[àáảãạăằắẳẵặâầấẩẫậ]/g, 'a')
      .replace(/[èéẻẽẹêềếểễệ]/g, 'e')
      .replace(/[ìíỉĩị]/g, 'i')
      .replace(/[òóỏõọôồốổỗộơờớởỡợ]/g, 'o')
      .replace(/[ùúủũụưừứửữự]/g, 'u')
      .replace(/[ỳýỷỹỵ]/g, 'y')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s-]+/g, '-')
      .trim()
  }

  function toggleTag(tagId: number) {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(tid => tid !== tagId) : [...prev, tagId]
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = {
        ...form,
        category_id: form.category_id ? parseInt(form.category_id) : null,
        featured: form.featured ? 1 : 0,
        read_time: parseInt(String(form.read_time)) || 5,
        tags: selectedTags,
      }
      if (isEdit && id) {
        await api.put(`/posts/${id}`, payload)
        setSuccess('Da luu thanh cong!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const res = await api.post<{ id: number }>('/posts', payload)
        navigate(`/posts/${res.id}/edit`)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Luu that bai.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <div className="page-title">Dang tai...</div>
        </div>
        <div className="skeleton" style={{ height: '400px' }} />
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Sua bai viet' : 'Tao bai viet moi'}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" onClick={() => navigate('/posts')} className="btn btn-ghost">Huy</button>
          <button form="post-form" type="submit" className="btn btn-accent" disabled={saving}>
            {saving ? 'Dang luu...' : (isEdit ? 'Luu thay doi' : 'Tao bai viet')}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form id="post-form" onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 300px', alignItems: 'start' }}>
          {/* Main content */}
          <div style={{ display: 'grid', gap: '16px' }}>
            <div className="form-card">
              <div className="form-group">
                <label className="form-label">Tieu de <span className="req">*</span></label>
                <input name="title" className="form-control" value={form.title} onChange={handleChange} required placeholder="Nhap tieu de bai viet" style={{ fontSize: '16px' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Slug URL</label>
                <input name="slug" className="form-control" value={form.slug} onChange={handleChange} placeholder="slug-url-bai-viet" />
                <div className="form-hint">URL: /bai-viet/{form.slug || 'slug-url'}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Tom tat</label>
                <textarea name="excerpt" className="form-control" value={form.excerpt} onChange={handleChange} rows={3} placeholder="Mo ta ngan ve bai viet (hien thi o trang chu)" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Noi dung bai viet <span className="req">*</span></label>
                <textarea name="content" className="form-control" value={form.content} onChange={handleChange} rows={16} placeholder="Noi dung bai viet (ho tro HTML)" style={{ fontFamily: 'monospace', fontSize: '13px' }} />
                <div className="form-hint">Ho tro HTML. Nhap the &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;blockquote&gt; v.v.</div>
              </div>
            </div>

            {/* SEO */}
            <div className="form-card">
              <div className="form-section-title">SEO</div>
              <div className="form-group">
                <label className="form-label">Meta title</label>
                <input name="meta_title" className="form-control" value={form.meta_title} onChange={handleChange} placeholder="Tieu de SEO (de trong = dung tieu de bai)" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Meta description</label>
                <textarea name="meta_description" className="form-control" value={form.meta_description} onChange={handleChange} rows={2} placeholder="Mo ta SEO (de trong = dung tom tat)" />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'grid', gap: '16px' }}>
            {/* Publish */}
            <div className="form-card">
              <div className="form-section-title">Xuat ban</div>
              <div className="form-group">
                <label className="form-label">Trang thai</label>
                <select name="status" className="form-control" value={form.status} onChange={handleChange}>
                  <option value="draft">Ban nhap</option>
                  <option value="published">Xuat ban</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label htmlFor="featured" style={{ fontSize: '13px', color: 'var(--text-2)', cursor: 'pointer' }}>
                  Danh dau la bai noi bat
                </label>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Thoi gian doc (phut)</label>
                <input name="read_time" type="number" min="1" max="60" className="form-control" value={form.read_time} onChange={handleChange} />
              </div>
            </div>

            {/* Category */}
            <div className="form-card">
              <div className="form-section-title">Danh muc</div>
              <select name="category_id" className="form-control" value={form.category_id} onChange={handleChange}>
                <option value="">-- Chon danh muc --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Thumbnail */}
            <div className="form-card">
              <div className="form-section-title">Anh dai dien</div>
              <input name="thumbnail" className="form-control" value={form.thumbnail} onChange={handleChange} placeholder="https://..." />
              {form.thumbnail && (
                <img src={form.thumbnail} alt="Preview" style={{ width: '100%', borderRadius: '8px', marginTop: '10px', aspectRatio: '16/9', objectFit: 'cover' }} />
              )}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="form-card">
                <div className="form-section-title">Tags</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {tags.map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        border: '1px solid',
                        fontFamily: 'var(--sans)',
                        background: selectedTags.includes(tag.id) ? 'var(--accent)' : 'var(--warm)',
                        color: selectedTags.includes(tag.id) ? '#fff' : 'var(--text-2)',
                        borderColor: selectedTags.includes(tag.id) ? 'var(--accent)' : 'var(--border)',
                        transition: 'all .15s',
                      }}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
