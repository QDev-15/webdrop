import { useState, useEffect } from 'react'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Category {
  id: number
  name: string
  slug: string
  icon: string
  description: string
  image: string
  sort_order: number
}

const empty: Omit<Category, 'id'> = { name: '', slug: '', icon: '', description: '', image: '', sort_order: 0 }

export default function ServiceCategoryList() {
  const [cats, setCats]         = useState<Category[]>([])
  const [loading, setLoading]   = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]   = useState<Category | null>(null)
  const [form, setForm]         = useState<Omit<Category, 'id'>>(empty)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setCats(await api.get<Category[]>('/service-categories')) }
    finally { setLoading(false) }
  }

  function openNew() { setEditing(null); setForm(empty); setError(''); setShowModal(true) }
  function openEdit(c: Category) {
    setEditing(c)
    setForm({ name: c.name, slug: c.slug, icon: c.icon, description: c.description, image: c.image, sort_order: c.sort_order })
    setError('')
    setShowModal(true)
  }
  function closeModal() { setShowModal(false); setEditing(null); setForm(empty) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError('')
    try {
      if (editing) {
        await api.put(`/service-categories/${editing.id}`, form)
      } else {
        await api.post('/service-categories', form)
      }
      closeModal(); load()
    } catch (err) { setError(err instanceof Error ? err.message : 'Lỗi lưu') }
    finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa danh mục này? Các dịch vụ thuộc danh mục sẽ mất liên kết.')) return
    await api.delete(`/service-categories/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Danh mục dịch vụ</div>
          <div className="page-sub">{cats.length} danh mục</div>
        </div>
        <button className="btn-accent" onClick={openNew}>+ Thêm danh mục</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Icon</th>
              <th>Tên danh mục</th>
              <th>Slug</th>
              <th>Thứ tự</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {cats.map(c => (
              <tr key={c.id}>
                <td style={{ fontSize: 20 }}>{c.icon}</td>
                <td style={{ fontWeight: 500 }}>{c.name}</td>
                <td style={{ color: 'var(--text-3)', fontSize: 12 }}>{c.slug}</td>
                <td>{c.sort_order}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-ghost btn-sm" onClick={() => openEdit(c)}>Sửa</button>
                    <button className="btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
            {cats.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>Chưa có danh mục nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div className="card" style={{ width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 20 }}>
              {editing ? 'Sửa danh mục' : 'Thêm danh mục'}
            </h2>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Tên danh mục *</label>
                <input className="form-control" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Slug</label>
                <input className="form-control" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} placeholder="tu-dong-tao-neu-bo-trong" />
              </div>
              <div className="form-group">
                <label className="form-label">Icon (emoji)</label>
                <input className="form-control" value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} placeholder="✂ 💅 💄 ✨" />
              </div>
              <div className="form-group">
                <label className="form-label">Mô tả</label>
                <textarea className="form-control" rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Ảnh đại diện</label>
                <ImageField value={form.image} onChange={v => setForm(p => ({ ...p, image: v }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Thứ tự hiển thị</label>
                <input className="form-control" type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: +e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
                <button type="button" className="btn-ghost" onClick={closeModal}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
