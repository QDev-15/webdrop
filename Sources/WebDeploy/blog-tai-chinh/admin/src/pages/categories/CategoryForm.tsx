import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface FormData {
  name: string
  slug: string
  show_on_home: boolean
  sort_order: number
}

const empty: FormData = { name: '', slug: '', show_on_home: true, sort_order: 0 }

export default function CategoryForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormData>(empty)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    if (!id) return
    api.get<Record<string, unknown>>(`/categories/${id}`)
      .then(d => setForm({
        name: String(d.name ?? ''), slug: String(d.slug ?? ''),
        show_on_home: Number(d.show_on_home ?? 1) === 1, sort_order: Number(d.sort_order ?? 0),
      }))
      .catch(() => setError('Không tìm thấy chuyên mục.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Tên chuyên mục là bắt buộc.'); return }
    setSaving(true)
    try {
      const payload = { name: form.name, slug: form.slug, show_on_home: form.show_on_home ? 1 : 0, sort_order: form.sort_order }
      if (isEdit) await api.put(`/categories/${id}`, payload)
      else await api.post('/categories', payload)
      navigate('/categories')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 560 }}>
      <div className="page-header">
        <div><div className="page-title">{isEdit ? 'Chỉnh sửa chuyên mục' : 'Thêm chuyên mục mới'}</div></div>
        <button onClick={() => navigate('/categories')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label" htmlFor="name">Tên chuyên mục *</label>
          <input id="name" type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Tiết kiệm" required />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="slug">Slug (để trống sẽ tự tạo từ tên)</label>
          <input id="slug" type="text" className="form-control" value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="tiet-kiem" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="sort_order">Thứ tự hiển thị</label>
          <input id="sort_order" type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
        </div>
        <div className="form-check">
          <input id="show_on_home" type="checkbox" checked={form.show_on_home} onChange={e => set('show_on_home', e.target.checked)} />
          <label htmlFor="show_on_home">Hiển thị trong khối "6 chuyên mục" ở trang chủ</label>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)', marginTop: 16 }}>
          <button type="button" onClick={() => navigate('/categories')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
