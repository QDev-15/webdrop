import { useState, useEffect } from 'react'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface TeamMember {
  id: number
  name: string
  position: string
  bio: string
  avatar: string
  sort_order: number
  status: string
}

interface MemberForm {
  name: string
  position: string
  bio: string
  avatar: string
  sort_order: number
  status: string
}

const emptyForm: MemberForm = { name: '', position: '', bio: '', avatar: '', sort_order: 0, status: 'published' }

export default function TeamMemberPage() {
  const [items, setItems] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [form, setForm] = useState<MemberForm>(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<TeamMember[]>('/team-members')) }
    finally { setLoading(false) }
  }

  function openNew() { setEditing(null); setForm(emptyForm); setError(''); setShowForm(true) }

  function openEdit(item: TeamMember) {
    setEditing(item)
    setForm({ name: item.name, position: item.position ?? '', bio: item.bio ?? '', avatar: item.avatar ?? '', sort_order: item.sort_order ?? 0, status: item.status ?? 'published' })
    setError(''); setShowForm(true)
  }

  function set<K extends keyof MemberForm>(k: K, v: MemberForm[K]) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên là bắt buộc.'); return }
    setSaving(true); setError('')
    try {
      if (editing) { await api.put(`/team-members/${editing.id}`, form) }
      else { await api.post('/team-members', form) }
      setShowForm(false); load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa thành viên này?')) return
    await api.delete(`/team-members/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Đội ngũ</div>
          <div className="page-sub">{items.length} thành viên</div>
        </div>
        <button onClick={openNew} className="btn-accent">+ Thêm thành viên</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>{editing ? 'Chỉnh sửa thành viên' : 'Thêm thành viên mới'}</div>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Họ tên *</label>
                <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Văn A" required />
              </div>
              <div className="form-group">
                <label className="form-label">Chức vụ</label>
                <input type="text" className="form-control" value={form.position} onChange={e => set('position', e.target.value)} placeholder="Vd: Head Barista" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Mô tả ngắn</label>
              <textarea className="form-control" value={form.bio} onChange={e => set('bio', e.target.value)} rows={3} />
            </div>
            <div className="form-group">
              <ImageField label="Ảnh đại diện" value={form.avatar} onChange={v => set('avatar', v)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Thứ tự</label>
                <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
              </div>
              <div className="form-group">
                <label className="form-label">Trạng thái</label>
                <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                  <option value="published">Hiện thị</option>
                  <option value="draft">Ẩn</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Hủy</button>
              <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (editing ? 'Cập nhật' : 'Thêm mới')}</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(item => (
          <div key={item.id} className="card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            {item.avatar ? (
              <img src={item.avatar} alt={item.name} className="thumb" style={{ borderRadius: '50%' }} />
            ) : (
              <div className="thumb" style={{ borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👤</div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600 }}>{item.name}</div>
              <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, marginBottom: 4 }}>{item.position}</div>
              <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{item.bio}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
              <span className={`badge badge-${item.status}`}>{item.status === 'published' ? 'Hiện' : 'Ẩn'}</span>
              <button onClick={() => openEdit(item)} className="btn-ghost btn-sm">Sửa</button>
              <button onClick={() => handleDelete(item.id)} className="btn-danger btn-sm">Xóa</button>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <div className="empty-state"><div className="empty-state-icon">👥</div><div className="empty-state-text">Chưa có thành viên nào.</div></div>}
    </div>
  )
}
