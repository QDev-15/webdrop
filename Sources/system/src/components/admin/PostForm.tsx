'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import ImageField from './ImageField'

const RichEditor = dynamic(() => import('./RichEditor'), { ssr: false })

interface Category { id: number; name: string }

interface PostFormProps {
  mode: 'new' | 'edit'
  id?: number
  categories: Category[]
  initial?: {
    title: string; slug: string; excerpt: string; content: string
    thumbnail: string; categoryId: string; status: string; featured: boolean
    metaTitle: string; metaDescription: string
  }
}

export default function PostForm({ mode, id, categories, initial }: PostFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    slug: initial?.slug ?? '',
    excerpt: initial?.excerpt ?? '',
    content: initial?.content ?? '',
    thumbnail: initial?.thumbnail ?? '',
    categoryId: initial?.categoryId ?? '',
    status: initial?.status ?? 'draft',
    featured: initial?.featured ?? false,
    metaTitle: initial?.metaTitle ?? '',
    metaDescription: initial?.metaDescription ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'content' | 'seo'>('content')

  function slugify(str: string) {
    return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
  }

  function set(key: string, value: string | boolean) {
    setForm(f => {
      const next = { ...f, [key]: value }
      if (key === 'title' && mode === 'new') next.slug = slugify(value as string)
      return next
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || !form.slug.trim()) { setError('Vui lòng nhập tiêu đề và slug'); return }
    setSaving(true)
    try {
      const payload = { ...form, categoryId: form.categoryId || null }
      const res = mode === 'new'
        ? await fetch('/api/admin/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        : await fetch(`/api/admin/posts/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })

      if (!res.ok) { const d = await res.json(); setError(d.error || 'Lỗi lưu bài viết'); return }
      router.push('/admin/posts')
      router.refresh()
    } catch { setError('Lỗi kết nối server') }
    finally { setSaving(false) }
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)',
    background: 'var(--bg)', fontSize: 13, fontFamily: 'var(--sans)', color: 'var(--text)',
    outline: 'none', boxSizing: 'border-box' as const,
  }
  const label = (text: string, req?: boolean) => (
    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 5 }}>
      {text}{req && <span style={{ color: 'var(--danger)', marginLeft: 3 }}>*</span>}
    </label>
  )

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#dc2626' }}>{error}</div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {(['content', 'seo'] as const).map(t => (
          <button key={t} type="button" onClick={() => setTab(t)}
            style={{ padding: '8px 18px', border: 'none', background: 'transparent', fontSize: 13, fontFamily: 'var(--sans)', cursor: 'pointer', borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent', color: tab === t ? 'var(--accent)' : 'var(--text-2)', fontWeight: tab === t ? 500 : 400, transition: 'all .15s' }}>
            {t === 'content' ? 'Nội dung' : 'SEO & Meta'}
          </button>
        ))}
      </div>

      {tab === 'content' && (
        <div style={{ display: 'grid', gap: 14 }}>
          <div>
            {label('Tiêu đề bài viết', true)}
            <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Tiêu đề bài viết..." style={inputStyle} />
          </div>
          <div className="row g-3">
            <div className="col-md-8">
              {label('Slug (URL)', true)}
              <input value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="tieu-de-bai-viet" style={inputStyle} />
            </div>
            <div className="col-md-4">
              {label('Trạng thái')}
              <select value={form.status} onChange={e => set('status', e.target.value)} style={inputStyle}>
                <option value="draft">Nháp</option>
                <option value="published">Đã đăng</option>
              </select>
            </div>
          </div>
          <div className="row g-3">
            <div className="col-md-8">
              <ImageField
                label="Thumbnail"
                value={form.thumbnail}
                onChange={v => set('thumbnail', v)}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
            <div className="col-md-4">
              {label('Danh mục')}
              <select value={form.categoryId} onChange={e => set('categoryId', e.target.value)} style={inputStyle}>
                <option value="">— Chọn danh mục —</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            {label('Tóm tắt (excerpt)')}
            <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)} rows={2}
              placeholder="Mô tả ngắn hiển thị ở trang danh sách..."
              style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div>
            {label('Nội dung bài viết')}
            <RichEditor
              value={form.content}
              onChange={v => set('content', v)}
              placeholder="Viết nội dung bài viết ở đây..."
            />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
            <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--accent)' }} />
            <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Bài viết nổi bật (hiển thị trên trang chủ)</span>
          </label>
        </div>
      )}

      {tab === 'seo' && (
        <div style={{ display: 'grid', gap: 14 }}>
          <div>
            {label('Meta Title')}
            <input value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)} placeholder="Tiêu đề SEO (≤ 60 ký tự)" style={inputStyle} />
            <div style={{ fontSize: 11, color: form.metaTitle.length > 60 ? 'var(--danger)' : 'var(--text-3)', marginTop: 4 }}>{form.metaTitle.length}/60</div>
          </div>
          <div>
            {label('Meta Description')}
            <textarea value={form.metaDescription} onChange={e => set('metaDescription', e.target.value)} rows={3}
              placeholder="Mô tả SEO (≤ 160 ký tự)"
              style={{ ...inputStyle, resize: 'vertical' }} />
            <div style={{ fontSize: 11, color: form.metaDescription.length > 160 ? 'var(--danger)' : 'var(--text-3)', marginTop: 4 }}>{form.metaDescription.length}/160</div>
          </div>
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 10 }}>Xem trước Google</div>
            <div style={{ fontSize: 18, color: '#1a0dab', fontWeight: 400, marginBottom: 2 }}>{form.metaTitle || form.title || 'Tiêu đề bài viết'}</div>
            <div style={{ fontSize: 13, color: '#006621', marginBottom: 4 }}>webdrop.vn/blog/{form.slug || 'slug-bai-viet'}</div>
            <div style={{ fontSize: 13, color: '#545454' }}>{form.metaDescription || form.excerpt || 'Mô tả bài viết sẽ hiển thị ở đây...'}</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
        <button type="button" onClick={() => router.back()}
          style={{ padding: '10px 22px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', fontSize: 13, fontFamily: 'var(--sans)', color: 'var(--text-2)', cursor: 'pointer' }}>
          Huỷ
        </button>
        <button type="submit" disabled={saving}
          style={{ padding: '10px 28px', borderRadius: 8, background: 'var(--accent)', border: 'none', fontSize: 13, fontWeight: 500, fontFamily: 'var(--sans)', color: '#fff', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .7 : 1 }}>
          {saving ? 'Đang lưu...' : mode === 'new' ? 'Đăng bài viết' : 'Lưu thay đổi'}
        </button>
      </div>
    </form>
  )
}
