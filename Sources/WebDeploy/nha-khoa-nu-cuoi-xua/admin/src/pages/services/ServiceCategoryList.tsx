import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Category {
  id: number
  name: string
  description: string
  sort_order: number
  is_active: number
}

const EMPTY = { name: '', description: '', sort_order: 0, is_active: 1 }

export default function ServiceCategoryList() {
  const [items, setItems] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ ...EMPTY })
  const [editId, setEditId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const load = () => {
    api.get<Category[]>('/service-categories').then(setItems).catch(console.error).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const openNew = () => {
    setForm({ ...EMPTY })
    setEditId(null)
    setError('')
    setShowForm(true)
  }

  const openEdit = (c: Category) => {
    setForm({ name: c.name, description: c.description, sort_order: c.sort_order, is_active: c.is_active })
    setEditId(c.id)
    setError('')
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Vui long nhap ten nhom dich vu.'); return }
    setSaving(true); setError('')
    try {
      if (editId) {
        await api.put(`/service-categories/${editId}`, form)
      } else {
        await api.post('/service-categories', form)
      }
      setShowForm(false)
      load()
    } catch (err: any) {
      setError(err.message || 'Co loi xay ra')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xoa nhom dich vu nay?')) return
    await api.delete(`/service-categories/${id}`)
    load()
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Nhom dich vu</div>
          <div className="page-subtitle">Phan loai cac dich vu nha khoa</div>
        </div>
        <button className="btn-accent" onClick={openNew}>+ Them nhom</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-card" style={{ marginBottom: '24px' }}>
          <div className="page-title" style={{ fontSize: '16px', marginBottom: '16px' }}>
            {editId ? 'Sua nhom dich vu' : 'Them nhom dich vu moi'}
          </div>
          {error && <div className="form-error">{error}</div>}
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Ten nhom <span className="req">*</span></label>
              <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nha khoa tham my" required />
            </div>
            <div className="form-group">
              <label className="form-label">Thu tu</label>
              <input className="form-control" type="number" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Mo ta (tuy chon)</label>
            <input className="form-control" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mo ta ngan ve nhom dich vu" />
          </div>
          <div className="form-group">
            <label className="form-label">
              <input type="checkbox" checked={form.is_active === 1} onChange={e => set('is_active', e.target.checked ? 1 : 0)} style={{ marginRight: '8px' }} />
              Hien thi tren website
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Dang luu...' : 'Luu nhom'}</button>
            <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Huy</button>
          </div>
        </form>
      )}

      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Dang tai...</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Ten nhom</th>
                <th>Mo ta</th>
                <th>Thu tu</th>
                <th>Hien thi</th>
                <th>Hanh dong</th>
              </tr>
            </thead>
            <tbody>
              {items.map(c => (
                <tr key={c.id}>
                  <td style={{ color: 'var(--text-3)' }}>{c.id}</td>
                  <td style={{ fontWeight: 500 }}>{c.name}</td>
                  <td style={{ color: 'var(--text-2)', fontSize: '13px' }}>{c.description}</td>
                  <td style={{ color: 'var(--text-2)' }}>{c.sort_order}</td>
                  <td>{c.is_active ? <span style={{ color: 'var(--accent)' }}>Co</span> : <span style={{ color: 'var(--text-3)' }}>An</span>}</td>
                  <td>
                    <div className="td-actions">
                      <button onClick={() => openEdit(c)} className="btn-ghost btn-sm">Sua</button>
                      <button onClick={() => handleDelete(c.id)} className="btn-danger btn-sm">Xoa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '32px' }}>Chua co nhom dich vu nao</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
