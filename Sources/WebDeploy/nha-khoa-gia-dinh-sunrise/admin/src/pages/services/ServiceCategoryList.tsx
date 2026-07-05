import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface ServiceCategory {
  id: number
  name: string
  description: string
  sort_order: number
  is_active: number
}

const EMPTY = { name: '', description: '', sort_order: 0, is_active: 1 }

export default function ServiceCategoryList() {
  const [items, setItems] = useState<ServiceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ ...EMPTY })
  const [editId, setEditId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = () => {
    api.get<ServiceCategory[]>('/service-categories').then(setItems).catch(console.error).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const set = (k: keyof typeof EMPTY, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name) { setError('Vui lòng nhập tên nhóm dịch vụ.'); return }
    setSaving(true); setError('')
    try {
      if (editId) {
        await api.put(`/service-categories/${editId}`, form)
      } else {
        await api.post('/service-categories', form)
      }
      setForm({ ...EMPTY })
      setEditId(null)
      load()
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (c: ServiceCategory) => {
    setEditId(c.id)
    setForm({ name: c.name, description: c.description, sort_order: c.sort_order, is_active: c.is_active })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa nhóm dịch vụ này? Các dịch vụ trong nhóm sẽ bị mất liên kết.')) return
    await api.delete(`/service-categories/${id}`)
    load()
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Nhóm dịch vụ</div>
          <div className="page-subtitle">Phân loại dịch vụ nha khoa theo nhóm</div>
        </div>
      </div>

      <form onSubmit={handleSave} className="form-card" style={{ marginBottom: '24px' }}>
        <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '12px', color: 'var(--text-2)' }}>
          {editId ? 'Chỉnh sửa nhóm dịch vụ' : 'Thêm nhóm dịch vụ'}
        </div>
        {error && <div className="form-error">{error}</div>}
        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Tên nhóm <span className="req">*</span></label>
            <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ví dụ: Nha khoa trẻ em" required />
          </div>
          <div className="form-group">
            <label className="form-label">Thứ tự</label>
            <input className="form-control" type="number" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả ngắn</label>
          <input className="form-control" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả ngắn về nhóm dịch vụ..." />
        </div>
        <div className="form-group">
          <label className="form-label">
            <input type="checkbox" checked={form.is_active === 1} onChange={e => set('is_active', e.target.checked ? 1 : 0)} style={{ marginRight: '8px' }} />
            Hiển thị trên website
          </label>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (editId ? 'Cập nhật' : 'Thêm nhóm')}</button>
          {editId && (
            <button type="button" className="btn-ghost" onClick={() => { setEditId(null); setForm({ ...EMPTY }) }}>Hủy</button>
          )}
        </div>
      </form>

      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tên nhóm</th>
                <th>Mô tả</th>
                <th>Thứ tự</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {items.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 500 }}>{c.name}</td>
                  <td style={{ color: 'var(--text-2)', fontSize: '13px' }}>{c.description}</td>
                  <td style={{ color: 'var(--text-3)' }}>{c.sort_order}</td>
                  <td>{c.is_active ? <span style={{ color: 'var(--accent)' }}>Hiển thị</span> : <span style={{ color: 'var(--text-3)' }}>Ẩn</span>}</td>
                  <td>
                    <div className="td-actions">
                      <button onClick={() => handleEdit(c)} className="btn-ghost btn-sm">Sửa</button>
                      <button onClick={() => handleDelete(c.id)} className="btn-danger btn-sm">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '32px' }}>Chưa có nhóm nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
