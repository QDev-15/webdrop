import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Tag {
  id: number
  name: string
  slug: string
  usage_count: number
}

interface FormData {
  name: string
  usage_count: number
}

export default function TagList() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<FormData>({ name: '', usage_count: 0 })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setTags(await api.get<Tag[]>('/forum-tags')) }
    finally { setLoading(false) }
  }

  function openNew() {
    setForm({ name: '', usage_count: 0 }); setEditId(null); setError(''); setShowForm(true)
  }

  function openEdit(t: Tag) {
    setForm({ name: t.name, usage_count: t.usage_count })
    setEditId(t.id); setError(''); setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      if (editId) await api.put(`/forum-tags/${editId}`, form)
      else await api.post('/forum-tags', form)
      setShowForm(false); setEditId(null); load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi lưu tag')
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa tag này?')) return
    await api.delete(`/forum-tags/${id}`)
    load()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Tags diễn đàn</div>
          <div className="page-sub">Quản lý tags phổ biến</div>
        </div>
        <button className="btn-accent" onClick={openNew}>+ Thêm tag</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24, maxWidth: 400 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
            {editId ? 'Sửa tag' : 'Thêm tag mới'}
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Tên tag *</label>
              <input className="form-control" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="vd: #javascript" required />
            </div>
            <div className="form-group">
              <label className="form-label">Số lần sử dụng</label>
              <input type="number" className="form-control" value={form.usage_count} onChange={e => setForm(p => ({ ...p, usage_count: +e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (editId ? 'Lưu' : 'Thêm')}</button>
              <button type="button" className="btn-ghost" onClick={() => { setShowForm(false); setEditId(null) }}>Hủy</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ color: 'var(--text-3)' }}>Đang tải...</div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {tags.map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }}>
              <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{t.name}</span>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{t.usage_count}</span>
              <button className="btn-ghost btn-sm btn-icon" onClick={() => openEdit(t)} title="Sua">✏</button>
              <button className="btn-danger btn-sm btn-icon" onClick={() => handleDelete(t.id)} title="Xoa">×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
