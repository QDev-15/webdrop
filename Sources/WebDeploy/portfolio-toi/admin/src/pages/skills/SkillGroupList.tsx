import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface SkillGroup {
  id: number
  name: string
  sort_order: number
  skills: { id: number; name: string }[]
}

export default function SkillGroupList() {
  const [groups, setGroups] = useState<SkillGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [addName, setAddName] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  const load = async () => {
    try { setGroups(await api.get<SkillGroup[]>('/skill-groups')) }
    finally { setLoading(false) }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addName.trim()) return
    setSaving(true)
    try {
      await api.post('/skill-groups', { name: addName, sort_order: groups.length })
      setAddName('')
      load()
    } finally { setSaving(false) }
  }

  const handleEdit = async (id: number) => {
    if (!editName.trim()) return
    setSaving(true)
    const group = groups.find(g => g.id === id)
    try {
      await api.put(`/skill-groups/${id}`, { name: editName, sort_order: group?.sort_order ?? 0 })
      setEditId(null)
      load()
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa nhóm này và tất cả kỹ năng trong nhóm?')) return
    try {
      await api.delete(`/skill-groups/${id}`)
      load()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Xóa thất bại.')
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Nhóm kỹ năng</div>
          <div className="page-sub">Phân nhóm các kỹ năng (Design, Frontend, Khác...)</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Thêm nhóm mới</div>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8 }}>
          <input
            type="text" className="form-control" placeholder="Tên nhóm kỹ năng"
            value={addName} onChange={e => setAddName(e.target.value)} style={{ maxWidth: 300 }}
          />
          <button type="submit" className="btn-accent" disabled={saving}>Thêm</button>
        </form>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-3)', fontSize: 14 }}>Đang tải...</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tên nhóm</th>
                <th>Số kỹ năng</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {groups.map(g => (
                <tr key={g.id}>
                  <td>
                    {editId === g.id ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          type="text" className="form-control" value={editName}
                          onChange={e => setEditName(e.target.value)} style={{ maxWidth: 200 }}
                        />
                        <button onClick={() => handleEdit(g.id)} className="btn-accent btn-sm" disabled={saving}>Lưu</button>
                        <button onClick={() => setEditId(null)} className="btn-ghost btn-sm">Hủy</button>
                      </div>
                    ) : (
                      <span style={{ fontWeight: 500 }}>{g.name}</span>
                    )}
                  </td>
                  <td style={{ fontSize: 13 }}>{g.skills?.length ?? 0} kỹ năng</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => { setEditId(g.id); setEditName(g.name) }} className="btn-ghost btn-sm">Sửa</button>
                      <button onClick={() => handleDelete(g.id)} className="btn-danger btn-sm">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
