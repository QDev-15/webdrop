import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface SkillGroup {
  id: number
  name: string
}

interface Skill {
  id: number
  group_id: number
  group_name: string
  name: string
  sort_order: number
  status: string
}

const emptyForm = { name: '', group_id: 0, sort_order: 0, status: 'published' }

export default function SkillList() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [groups, setGroups] = useState<SkillGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  const load = async () => {
    try {
      const [s, g] = await Promise.all([
        api.get<Skill[]>('/skills'),
        api.get<SkillGroup[]>('/skill-groups'),
      ])
      setSkills(s)
      setGroups(g)
      if (g.length > 0 && !form.group_id) {
        setForm(f => ({ ...f, group_id: g[0].id }))
      }
    } finally { setLoading(false) }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    try {
      await api.post('/skills', form)
      setForm(f => ({ ...f, name: '' }))
      load()
    } finally { setSaving(false) }
  }

  const handleEdit = async (id: number) => {
    setSaving(true)
    try {
      await api.put(`/skills/${id}`, editForm)
      setEditId(null)
      load()
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa kỹ năng này?')) return
    try {
      await api.delete(`/skills/${id}`)
      load()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Xóa thất bại.')
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Kỹ năng</div>
          <div className="page-sub">Quản lý các kỹ năng trong từng nhóm</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Thêm kỹ năng mới</div>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label className="form-label">Nhóm</label>
            <select
              className="form-control"
              value={form.group_id}
              onChange={e => setForm(f => ({ ...f, group_id: parseInt(e.target.value) }))}
              style={{ minWidth: 140 }}
            >
              {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Tên kỹ năng</label>
            <input
              type="text" className="form-control" placeholder="Figma, React..."
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              style={{ minWidth: 200 }}
            />
          </div>
          <button type="submit" className="btn-accent" disabled={saving} style={{ alignSelf: 'flex-end', marginBottom: 0 }}>Thêm</button>
        </form>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-3)', fontSize: 14 }}>Đang tải...</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Kỹ năng</th>
                <th>Nhóm</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {skills.map(s => (
                <tr key={s.id}>
                  <td>
                    {editId === s.id ? (
                      <input
                        type="text" className="form-control" value={editForm.name}
                        onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                        style={{ maxWidth: 200 }}
                      />
                    ) : (
                      <span style={{ fontWeight: 500 }}>{s.name}</span>
                    )}
                  </td>
                  <td style={{ fontSize: 13 }}>
                    {editId === s.id ? (
                      <select
                        className="form-control"
                        value={editForm.group_id}
                        onChange={e => setEditForm(f => ({ ...f, group_id: parseInt(e.target.value) }))}
                        style={{ maxWidth: 140 }}
                      >
                        {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                      </select>
                    ) : s.group_name}
                  </td>
                  <td>
                    {editId === s.id ? (
                      <select
                        className="form-control"
                        value={editForm.status}
                        onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                        style={{ maxWidth: 120 }}
                      >
                        <option value="published">Hiển thị</option>
                        <option value="draft">Ẩn</option>
                      </select>
                    ) : (
                      <span className={`badge badge-${s.status}`}>{s.status === 'published' ? 'Hiển thị' : 'Ẩn'}</span>
                    )}
                  </td>
                  <td>
                    {editId === s.id ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => handleEdit(s.id)} className="btn-accent btn-sm" disabled={saving}>Lưu</button>
                        <button onClick={() => setEditId(null)} className="btn-ghost btn-sm">Hủy</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => { setEditId(s.id); setEditForm({ name: s.name, group_id: s.group_id, sort_order: s.sort_order, status: s.status }) }} className="btn-ghost btn-sm">Sửa</button>
                        <button onClick={() => handleDelete(s.id)} className="btn-danger btn-sm">Xóa</button>
                      </div>
                    )}
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
