import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Category { id: number; name: string }

interface FormData {
  category_id: string
  type: 'article' | 'recipe'
  title: string
  slug: string
  excerpt: string
  content: string
  pullquote: string
  image: string
  author_name: string
  author_avatar: string
  author_bio: string
  read_minutes: number
  tags: string
  featured: boolean
  status: string
  difficulty: string
  prep_time: string
  cook_time: string
  servings: string
  saved_count: number
  ingredients: string
  steps: string
  tip: string
  published_at: string
}

const empty: FormData = {
  category_id: '', type: 'article', title: '', slug: '', excerpt: '', content: '', pullquote: '',
  image: '', author_name: '', author_avatar: '', author_bio: '', read_minutes: 5, tags: '',
  featured: false, status: 'published', difficulty: 'Trung bình', prep_time: '', cook_time: '',
  servings: '', saved_count: 0, ingredients: '', steps: '', tip: '', published_at: '',
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

export default function PostForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<FormData>(empty)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<Category[]>('/post-categories').then(setCategories).catch(() => null)
    if (!id) return
    api.get<any>(`/posts/${id}`)
      .then(d => setForm({
        category_id: d.category_id ? String(d.category_id) : '',
        type: d.type === 'recipe' ? 'recipe' : 'article',
        title: d.title, slug: d.slug, excerpt: d.excerpt ?? '', content: d.content ?? '', pullquote: d.pullquote ?? '',
        image: d.image ?? '', author_name: d.author_name ?? '', author_avatar: d.author_avatar ?? '', author_bio: d.author_bio ?? '',
        read_minutes: d.read_minutes ?? 5, tags: d.tags ?? '', featured: !!d.featured, status: d.status ?? 'published',
        difficulty: d.difficulty ?? 'Trung bình', prep_time: d.prep_time ?? '', cook_time: d.cook_time ?? '',
        servings: d.servings ?? '', saved_count: d.saved_count ?? 0, ingredients: d.ingredients ?? '', steps: d.steps ?? '',
        tip: d.tip ?? '', published_at: (d.published_at ?? '').slice(0, 10),
      }))
      .catch(() => setError('Không thể tải bài viết.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: FormEvent) {
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
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Sửa bài viết' : 'Thêm bài viết / công thức mới'}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => navigate('/posts')} className="btn-ghost">Hủy</button>
          <button form="post-form" type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form id="post-form" onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
          {/* Nội dung chính */}
          <div style={{ display: 'grid', gap: 16 }}>
            <div className="card">
              <div className="form-group">
                <label className="form-label">Loại nội dung</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" onClick={() => set('type', 'article')}
                    className={form.type === 'article' ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'}>📰 Bài viết</button>
                  <button type="button" onClick={() => set('type', 'recipe')}
                    className={form.type === 'recipe' ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'}>🍲 Công thức nấu ăn</button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Tiêu đề *</label>
                <input className="form-control" value={form.title}
                  onChange={e => { const v = e.target.value; set('title', v); if (!isEdit) set('slug', slugify(v)) }}
                  required placeholder="Nhập tiêu đề bài viết" />
              </div>
              <div className="form-group">
                <label className="form-label">Slug URL</label>
                <input className="form-control" value={form.slug} onChange={e => set('slug', e.target.value)} />
                <div className="form-hint">URL: {form.type === 'recipe' ? '/cong-thuc-nau-an/' : '/bai-viet/'}{form.slug || 'slug-url'}</div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Tóm tắt (excerpt)</label>
                <textarea className="form-control" rows={2} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} placeholder="Mô tả ngắn hiển thị trên card" />
              </div>
            </div>

            {form.type === 'article' ? (
              <div className="card">
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Nội dung bài viết</div>
                <div className="form-group">
                  <label className="form-label">Nội dung (hỗ trợ HTML)</label>
                  <textarea className="form-control" rows={14} value={form.content} onChange={e => set('content', e.target.value)}
                    style={{ fontFamily: 'monospace', fontSize: 13 }} placeholder="<p>Đoạn văn...</p><h2>Tiêu đề phụ</h2>" />
                  <div className="form-hint">Hỗ trợ thẻ HTML cơ bản: &lt;p&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;ul&gt;&lt;li&gt;, &lt;img&gt;.</div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Trích dẫn nổi bật (pullquote) — không bắt buộc</label>
                  <textarea className="form-control" rows={2} value={form.pullquote} onChange={e => set('pullquote', e.target.value)} placeholder='"Câu trích dẫn hay..." — nguồn' />
                </div>
              </div>
            ) : (
              <div className="card">
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Thông tin công thức</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Độ khó</label>
                    <select className="form-control" value={form.difficulty} onChange={e => set('difficulty', e.target.value)}>
                      <option>Dễ</option><option>Trung bình</option><option>Khó</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Chuẩn bị</label>
                    <input className="form-control" value={form.prep_time} onChange={e => set('prep_time', e.target.value)} placeholder="30 phút" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Thời gian nấu</label>
                    <input className="form-control" value={form.cook_time} onChange={e => set('cook_time', e.target.value)} placeholder="8 giờ" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Khẩu phần</label>
                    <input className="form-control" value={form.servings} onChange={e => set('servings', e.target.value)} placeholder="4 người" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Nguyên liệu — mỗi dòng 1 nguyên liệu, định dạng: <code>số lượng|tên nguyên liệu</code></label>
                  <textarea className="form-control" rows={6} value={form.ingredients} onChange={e => set('ingredients', e.target.value)}
                    style={{ fontFamily: 'monospace', fontSize: 13 }} placeholder={'2kg|xương ống bò\n1 củ|gừng tươi'} />
                </div>
                <div className="form-group">
                  <label className="form-label">Các bước — mỗi dòng 1 bước, định dạng: <code>tiêu đề||mô tả||ảnh (tùy chọn)</code></label>
                  <textarea className="form-control" rows={6} value={form.steps} onChange={e => set('steps', e.target.value)}
                    style={{ fontFamily: 'monospace', fontSize: 13 }} placeholder={'Sơ chế nguyên liệu||Rửa sạch, để ráo.||'} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Mẹo từ Bếp Xanh</label>
                  <textarea className="form-control" rows={2} value={form.tip} onChange={e => set('tip', e.target.value)} />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'grid', gap: 16 }}>
            <div className="card">
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Xuất bản</div>
              <div className="form-group">
                <label className="form-label">Trạng thái</label>
                <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                  <option value="draft">Bản nháp</option>
                  <option value="published">Đã đăng</option>
                </select>
              </div>
              <div className="form-check" style={{ marginBottom: 16 }}>
                <input type="checkbox" id="featured" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
                <label htmlFor="featured">Đánh dấu bài nổi bật (hiển thị banner trang chủ)</label>
              </div>
              <div className="form-group">
                <label className="form-label">Ngày đăng</label>
                <input type="date" className="form-control" value={form.published_at} onChange={e => set('published_at', e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Thời gian đọc (phút)</label>
                <input type="number" min={1} className="form-control" value={form.read_minutes} onChange={e => set('read_minutes', parseInt(e.target.value) || 5)} />
              </div>
            </div>

            <div className="card">
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Chuyên mục</div>
              <select className="form-control" value={form.category_id} onChange={e => set('category_id', e.target.value)}>
                <option value="">-- Chọn chuyên mục --</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="card">
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Ảnh đại diện</div>
              <ImageField value={form.image} onChange={v => set('image', v)} />
            </div>

            <div className="card">
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Tác giả</div>
              <div className="form-group">
                <label className="form-label">Tên tác giả</label>
                <input className="form-control" value={form.author_name} onChange={e => set('author_name', e.target.value)} />
              </div>
              <div className="form-group">
                <ImageField label="Ảnh đại diện tác giả" value={form.author_avatar} onChange={v => set('author_avatar', v)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Giới thiệu ngắn (author box)</label>
                <textarea className="form-control" rows={3} value={form.author_bio} onChange={e => set('author_bio', e.target.value)} />
              </div>
            </div>

            {form.type === 'recipe' && (
              <div className="card">
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Lượt lưu</div>
                <input type="number" min={0} className="form-control" value={form.saved_count} onChange={e => set('saved_count', parseInt(e.target.value) || 0)} />
              </div>
            )}

            <div className="card">
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Thẻ (tags)</div>
              <input className="form-control" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="Phở|Review quán ăn" />
              <div className="form-hint">Ngăn cách bằng dấu |</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
