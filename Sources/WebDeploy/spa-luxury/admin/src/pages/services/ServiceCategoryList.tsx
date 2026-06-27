import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface ServiceCategory {
  id: number
  name: string
  slug: string
  sort_order: number
}

interface EditRow {
  name: string
  slug: string
  sort_order: number
}

const emptyEdit: EditRow = { name: '', slug: '', sort_order: 0 }

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export default function ServiceCategoryList() {
  const [items, setItems] = useState<ServiceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState<number | null>(null)
  const [editRow, setEditRow] = useState<EditRow>(emptyEdit)
  const [showCreate, setShowCreate] = useState(false)
  const [createRow, setCreateRow] = useState<EditRow>(emptyEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<ServiceCategory[]>('/service-categories')) }
    finally { setLoading(false) }
  }

  function startEdit(item: ServiceCategory) {
    setEditId(item.id)
    setEditRow({ name: item.name, slug: item.slug, sort_order: item.sort_order })
    setError('')
  }

  function cancelEdit() {
    setEditId(null)
    setEditRow(emptyEdit)
  }

  async function saveEdit(id: number) {
    if (!editRow.name.trim()) { setError('Tên danh mục là bắt buộc.'); return }
    setSaving(true)
    setError('')
    try {
      await api.put(`/service-categories/${id}`, editRow)
      setEditId(null)
      load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally {
      setSaving(false)
    }
  }

  async function handleCreate() {
    if (!createRow.name.trim()) { setError('Tên danh mục là bắt buộc.'); return }
    setSaving(true)
    setError('')
    try {
      await api.post('/service-categories', createRow)
      setShowCreate(false)
      setCreateRow(emptyEdit)
      load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Tạo thất bại.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa danh mục này?')) return
    await api.delete(`/service-categories/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Danh mục dịch vụ</div>
          <div className="page-sub">{items.length} danh mục</div>
        </div>
        <button
          className="btn-accent"
          onClick={() => { setShowCreate(true); setCreateRow(emptyEdit); setError('') }}
        >
          + Thêm danh mục
        </button>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 16, padding: '10px 16px', borderRadius: 8, background: '#fff0f0', color: 'var(--danger)', border: '1px solid #fdd', fontSize: 13 }}>{error}</div>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tên danh mục</th>
              <th>Slug</th>
              <th>Thứ tự</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {/* Create row */}
            {showCreate && (
              <tr style={{ background: 'var(--accent-light)' }}>
                <td>
                  <input
                    className="form-control"
                    value={createRow.name}
                    autoFocus
                    onChange={e => {
                      const name = e.target.value
                      setCreateRow(r => ({ ...r, name, slug: slugify(name) }))
                    }}
                    placeholder="Tên danh mục"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    value={createRow.slug}
                    onChange={e => setCreateRow(r => ({ ...r, slug: e.target.value }))}
                    placeholder="slug-danh-muc"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    value={createRow.sort_order}
                    onChange={e => setCreateRow(r => ({ ...r, sort_order: parseInt(e.target.value) || 0 }))}
                    style={{ width: 80 }}
                  />
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-accent btn-sm" onClick={handleCreate} disabled={saving}>
                      {saving ? '...' : 'Lưu'}
                    </button>
                    <button className="btn-ghost btn-sm" onClick={() => { setShowCreate(false); setError('') }}>
                      Hủy
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {items.map(item => (
              <tr key={item.id}>
                {editId === item.id ? (
                  <>
                    <td>
                      <input
                        className="form-control"
                        value={editRow.name}
                        autoFocus
                        onChange={e => {
                          const name = e.target.value
                          setEditRow(r => ({ ...r, name, slug: slugify(name) }))
                        }}
                      />
                    </td>
                    <td>
                      <input
                        className="form-control"
                        value={editRow.slug}
                        onChange={e => setEditRow(r => ({ ...r, slug: e.target.value }))}
                      />
                    </td>
                    <td>
                      <input
                        className="form-control"
                        type="number"
                        value={editRow.sort_order}
                        onChange={e => setEditRow(r => ({ ...r, sort_order: parseInt(e.target.value) || 0 }))}
                        style={{ width: 80 }}
                      />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn-accent btn-sm" onClick={() => saveEdit(item.id)} disabled={saving}>
                          {saving ? '...' : 'Lưu'}
                        </button>
                        <button className="btn-ghost btn-sm" onClick={cancelEdit}>Hủy</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ fontWeight: 500 }}>{item.name}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'monospace' }}>{item.slug}</td>
                    <td style={{ color: 'var(--text-2)' }}>{item.sort_order}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn-ghost btn-sm" onClick={() => startEdit(item)}>Sửa</button>
                        <button className="btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Xóa</button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && !showCreate && (
          <div className="empty-state" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-3)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🗂️</div>
            <div>Chưa có danh mục nào. Thêm danh mục đầu tiên!</div>
          </div>
        )}
      </div>
    </div>
  )
}
