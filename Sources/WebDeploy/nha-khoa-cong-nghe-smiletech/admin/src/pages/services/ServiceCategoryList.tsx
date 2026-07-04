import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Category {
  id: number
  name: string
  slug: string
  sort_order: number
  service_count?: number
}

export default function ServiceCategoryList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)

  const load = () => {
    api.get<Category[]>('/service-categories')
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleAdd = async () => {
    if (!newName.trim()) return
    setAdding(true)
    try {
      await api.post('/service-categories', { name: newName, sort_order: categories.length })
      setNewName('')
      load()
    } catch (e: unknown) {
      alert((e as Error).message)
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Xoá danh mục "${name}"?`)) return
    try {
      await api.delete(`/service-categories/${id}`)
      load()
    } catch (e: unknown) {
      alert((e as Error).message)
    }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h1 className="page-title">Danh mục dịch vụ</h1>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header"><h2 className="card-title">Thêm danh mục mới</h2></div>
        <div style={{ display: 'flex', gap: 12, padding: '0 0 4px' }}>
          <input
            className="form-input"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Tên danh mục..."
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button className="btn btn-primary" onClick={handleAdd} disabled={adding || !newName.trim()}>
            {adding ? 'Đang thêm...' : 'Thêm'}
          </button>
        </div>
      </div>

      <div className="card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên danh mục</th>
              <th>Slug</th>
              <th>Số dịch vụ</th>
              <th>Thứ tự</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan={6} className="empty-row">Chưa có danh mục nào.</td></tr>
            ) : categories.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td className="fw-600">{c.name}</td>
                <td><code>{c.slug}</code></td>
                <td>{c.service_count ?? 0}</td>
                <td>{c.sort_order}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(c.id, c.name)}
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
