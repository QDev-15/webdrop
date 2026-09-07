import { useState, useEffect } from 'react'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Category {
  id: number
  name: string
  slug: string
  description: string
  image: string
  sort_order: number
  status: string
  item_count: number
}

interface CategoryForm {
  name: string
  description: string
  image: string
  sort_order: number
  status: string
}

const emptyForm: CategoryForm = { name: '', description: '', image: '', sort_order: 0, status: 'published' }

export default function MenuCategoryList() {
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState<CategoryForm>(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setCats(await api.get<Category[]>('/menu-categories')) }
    finally { setLoading(false) }
  }

  function openNew() {
    setEditing(null); setForm(emptyForm); setError(''); setShowForm(true)
  }

  function openEdit(cat: Category) {
    setEditing(cat)
    setForm({ name: cat.name, description: cat.description ?? '', image: cat.image ?? '', sort_order: cat.sort_order ?? 0, status: cat.status ?? 'published' })
    setError('')
    setShowForm(true)
  }

  function set<K extends keyof CategoryForm>(k: K, v: CategoryForm[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Ten danh muc la bat buoc.'); return }
    setSaving(true); setError('')
    try {
      if (editing) {
        await api.put(`/menu-categories/${editing.id}`, form)
      } else {
        await api.post('/menu-categories', form)
      }
      setShowForm(false); load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Luu that bai.')
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xoa danh muc nay? Cac mon an trong danh muc se khong bi xoa nhung se mat danh muc.')) return
    await api.delete(`/menu-categories/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Dang tai...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Danh muc thuc don</div>
          <div className="page-sub">{cats.length} danh muc</div>
        </div>
        <button onClick={openNew} className="btn-accent">+ Them danh muc</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>{editing ? 'Chinh sua danh muc' : 'Them danh muc moi'}</div>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Ten danh muc *</label>
                <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Vd: Entree" required />
              </div>
              <div className="form-group">
                <label className="form-label">Trang thai</label>
                <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                  <option value="published">Hien thi</option>
                  <option value="draft">An</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Mo ta</label>
              <input type="text" className="form-control" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mo ta ngan ve danh muc" />
            </div>
            <div className="form-group">
              <label className="form-label">Thu tu</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} style={{ maxWidth: 120 }} />
            </div>
            <div className="form-group">
              <ImageField label="Anh dai dien" value={form.image} onChange={v => set('image', v)} />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Huy</button>
              <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Dang luu...' : (editing ? 'Cap nhat' : 'Them moi')}</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Ten danh muc</th>
              <th>So luong mon</th>
              <th>Thu tu</th>
              <th>Trang thai</th>
              <th>Thao tac</th>
            </tr>
          </thead>
          <tbody>
            {cats.map(cat => (
              <tr key={cat.id}>
                <td>
                  <div style={{ fontWeight: 500 }}>{cat.name}</div>
                  {cat.description && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{cat.description}</div>}
                </td>
                <td>{cat.item_count} mon</td>
                <td>{cat.sort_order}</td>
                <td><span className={`badge badge-${cat.status}`}>{cat.status === 'published' ? 'Hien' : 'An'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit(cat)} className="btn-ghost btn-sm">Sua</button>
                    <button onClick={() => handleDelete(cat.id)} className="btn-danger btn-sm">Xoa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {cats.length === 0 && <div className="empty-state"><div className="empty-state-icon">📂</div><div className="empty-state-text">Chua co danh muc nao.</div></div>}
      </div>
    </div>
  )
}
