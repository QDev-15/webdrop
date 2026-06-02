import { useEffect, useState, FormEvent } from 'react'
import { api } from '../../api/client'

interface Category {
  id: number; name: string; slug: string
  description?: string; parent_id?: number
  parent_name: string | null; post_count: number
}

const empty = { id: 0, name: '', slug: '', description: '', parent_id: '' }

export default function CategoryList() {
  const [cats, setCats]     = useState<Category[]>([])
  const [loading, setLoad]  = useState(true)
  const [form, setForm]     = useState(empty)
  const [editing, setEdit]  = useState<number | null>(null)
  const [busy, setBusy]     = useState(false)
  const [toast, setToast]   = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoad(true)
    try { setCats(await api.get<Category[]>('/categories')) }
    finally { setLoad(false) }
  }

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true)
    try {
      const body = { ...form, parent_id: form.parent_id ? parseInt(form.parent_id) : null }
      if (editing) await api.put('/categories/' + editing, body)
      else await api.post('/categories', body)
      await load()
      setForm(empty); setEdit(null)
      show('Đã lưu danh mục')
    } catch (err: unknown) {
      show(err instanceof Error ? err.message : 'Lưu thất bại', true)
    } finally { setBusy(false) }
  }

  async function remove(id: number, name: string) {
    if (!confirm(`Xóa danh mục "${name}"? Các bài viết sẽ bị bỏ danh mục.`)) return
    try { await api.delete('/categories/' + id); await load(); show('Đã xóa') }
    catch (e: unknown) { show(e instanceof Error ? e.message : 'Xóa thất bại', true) }
  }

  function startEdit(c: Category) {
    setEdit(c.id)
    setForm({ id: c.id, name: c.name, slug: c.slug, description: c.description ?? '', parent_id: c.parent_id ? String(c.parent_id) : '' })
  }

  function show(msg: string, err = false) {
    setToast((err ? 'E:' : '') + msg); setTimeout(() => setToast(''), 3000)
  }

  const parents = cats.filter(c => c.id !== editing)

  return (
    <div className="row g-3">
      <div className="col-md-8">
        <div className="admin-card" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div>
          ) : cats.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">📂</div><p>Chưa có danh mục.</p></div>
          ) : (
            <table className="admin-table">
              <thead><tr><th>Tên</th><th>Danh mục cha</th><th>Bài viết</th><th></th></tr></thead>
              <tbody>
                {cats.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{c.name}</div>
                      <div className="text-muted">{c.slug}</div>
                    </td>
                    <td>{c.parent_name || <span className="text-muted">—</span>}</td>
                    <td>{c.post_count}</td>
                    <td>
                      <button className="btn-icon" onClick={() => startEdit(c)} title="Sửa">✎</button>
                      <button className="btn-icon" onClick={() => remove(c.id, c.name)} style={{ color: 'var(--danger)' }}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="col-md-4">
        <div className="admin-card">
          <h6 style={{ fontWeight: 600, marginBottom: 16 }}>{editing ? 'Sửa danh mục' : 'Thêm danh mục'}</h6>
          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label">Tên *</label>
              <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Slug</label>
              <input className="form-input" value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="Tự tạo từ tên" />
            </div>
            <div className="mb-3">
              <label className="form-label">Danh mục cha</label>
              <select className="form-select" value={form.parent_id} onChange={e => set('parent_id', e.target.value)}>
                <option value="">— Không có —</option>
                {parents.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="d-flex gap-2">
              <button className="btn-accent" type="submit" disabled={busy} style={{ flex: 1 }}>
                {busy ? '...' : editing ? 'Lưu' : 'Thêm'}
              </button>
              {editing && (
                <button type="button" className="btn-ghost" onClick={() => { setEdit(null); setForm(empty) }}>Hủy</button>
              )}
            </div>
          </form>
        </div>
      </div>

      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.startsWith('E:') ? 'toast-error' : 'toast-success'}`}>
            {toast.replace(/^E:/, '')}
          </div>
        </div>
      )}
    </div>
  )
}
