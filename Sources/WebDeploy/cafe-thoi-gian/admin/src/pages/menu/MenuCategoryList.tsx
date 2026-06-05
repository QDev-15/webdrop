import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface MenuCategory {
  id: number
  name: string
  slug: string
  icon: string
  description: string
  sort_order: number
  status: string
  item_count: number
}

export default function MenuCategoryList() {
  const [cats, setCats] = useState<MenuCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', icon: '', description: '', sort_order: 0, status: 'published' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  const load = () => {
    setLoading(true)
    api.get<MenuCategory[]>('/menu-categories').then(setCats).catch(console.error).finally(() => setLoading(false))
  }

  const handleEdit = (cat: MenuCategory) => {
    setEditing(cat.id)
    setForm({ name: cat.name, icon: cat.icon || '', description: cat.description || '', sort_order: cat.sort_order, status: cat.status })
  }

  const handleSave = async (id: number) => {
    setSaving(true)
    try {
      await api.put(`/menu-categories/${id}`, form)
      setEditing(null)
      load()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Lỗi lưu')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa danh mục này? Các món trong danh mục sẽ mất liên kết.')) return
    await api.delete(`/menu-categories/${id}`)
    load()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Danh mục thực đơn</div>
          <div className="page-sub">Quản lý các nhóm trong menu</div>
        </div>
      </div>

      {loading ? <div className="empty-state"><div className="empty-state-text">Đang tải...</div></div> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Icon</th><th>Tên danh mục</th><th>Số món</th><th>Thứ tự</th><th>Trạng thái</th><th></th></tr></thead>
            <tbody>
              {cats.map(cat => (
                <tr key={cat.id}>
                  {editing === cat.id ? (
                    <>
                      <td><input className="form-control" style={{ width: '60px' }} value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} /></td>
                      <td>
                        <input className="form-control" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={{ marginBottom: '4px' }} />
                        <input className="form-control" placeholder="Mô tả..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ fontSize: '12px' }} />
                      </td>
                      <td>{cat.item_count}</td>
                      <td><input className="form-control" type="number" style={{ width: '70px' }} value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} /></td>
                      <td>
                        <select className="form-control" style={{ fontSize: '12px' }} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                          <option value="published">Công khai</option>
                          <option value="draft">Ẩn</option>
                        </select>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn-accent btn-sm" onClick={() => handleSave(cat.id)} disabled={saving}>Lưu</button>
                          <button className="btn-ghost btn-sm" onClick={() => setEditing(null)}>Hủy</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ fontSize: '18px' }}>{cat.icon}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{cat.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{cat.description}</div>
                      </td>
                      <td>{cat.item_count} món</td>
                      <td>{cat.sort_order}</td>
                      <td><span className={`badge ${cat.status === 'published' ? 'badge-published' : 'badge-draft'}`}>{cat.status === 'published' ? 'Công khai' : 'Ẩn'}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn-ghost btn-sm" onClick={() => handleEdit(cat)}>Sửa</button>
                          <button className="btn-danger btn-sm" onClick={() => handleDelete(cat.id)}>Xóa</button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
