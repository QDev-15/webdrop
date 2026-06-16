import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface ItemForm {
  author_name: string
  author_title: string
  author_avatar: string
  content: string
  rating: number
  sort_order: number
  status: string
}

const emptyForm: ItemForm = {
  author_name: '', author_title: '', author_avatar: '', content: '',
  rating: 5, sort_order: 0, status: 'published',
}

export default function TestimonialForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<ItemForm>(emptyForm)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    if (!id) return
    api.get<ItemForm & { id: number }>(`/testimonials/${id}`)
      .then(d => setForm({ author_name: d.author_name, author_title: d.author_title ?? '', author_avatar: d.author_avatar ?? '', content: d.content, rating: d.rating ?? 5, sort_order: d.sort_order ?? 0, status: d.status ?? 'published' }))
      .catch(() => setError('Khong tim thay.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof ItemForm>(k: K, v: ItemForm[K]) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.author_name.trim() || !form.content.trim()) { setError('Ten va noi dung la bat buoc.'); return }
    setError(''); setSaving(true)
    try {
      if (isEdit) { await api.put(`/testimonials/${id}`, form) }
      else { await api.post('/testimonials', form) }
      navigate('/testimonials')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Luu that bai.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Dang tai...</div>

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chinh sua danh gia' : 'Them danh gia moi'}</div>
        </div>
        <button onClick={() => navigate('/testimonials')} className="btn-ghost">Quay lai</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Ten tac gia *</label>
            <input type="text" className="form-control" value={form.author_name} onChange={e => set('author_name', e.target.value)} placeholder="Vd: Nguyen Van An" required />
          </div>
          <div className="form-group">
            <label className="form-label">Chuc vu / Cong ty</label>
            <input type="text" className="form-control" value={form.author_title} onChange={e => set('author_title', e.target.value)} placeholder="Vd: CEO · Cong ty ABC" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Noi dung danh gia *</label>
          <textarea className="form-control" value={form.content} onChange={e => set('content', e.target.value)} placeholder="Noi dung danh gia..." rows={4} required />
        </div>
        <div className="form-group">
          <ImageField label="Anh dai dien" value={form.author_avatar} onChange={v => set('author_avatar', v)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">So sao</label>
            <select className="form-control" value={form.rating} onChange={e => set('rating', parseInt(e.target.value))}>
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} sao</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Thu tu</label>
            <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
          </div>
          <div className="form-group">
            <label className="form-label">Trang thai</label>
            <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="published">Hien thi</option>
              <option value="draft">An</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/testimonials')} className="btn-ghost">Huy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Dang luu...' : (isEdit ? 'Cap nhat' : 'Them moi')}</button>
        </div>
      </form>
    </div>
  )
}
