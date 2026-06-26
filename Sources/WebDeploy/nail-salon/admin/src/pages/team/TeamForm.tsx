import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Member { id: number; name: string; role: string; image: string; specialty1: string; specialty2: string; sort_order: number }

const blank = { name: '', role: '', image: '', specialty1: '', specialty2: '', sort_order: '0' }

export default function TeamForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState(blank)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<Member[]>('/team').then(members => {
      const m = members.find(x => x.id === +id!)
      if (m) setForm({
        name: m.name, role: m.role, image: m.image,
        specialty1: m.specialty1, specialty2: m.specialty2,
        sort_order: m.sort_order.toString(),
      })
      setLoading(false)
    })
  }, [id, isEdit])

  function set(key: string, value: string) { setForm(f => ({ ...f, [key]: value })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError('')
    const payload = {
      name: form.name, role: form.role, image: form.image,
      specialty1: form.specialty1, specialty2: form.specialty2,
      sort_order: +form.sort_order,
    }
    try {
      if (isEdit) await api.put(`/team/${id}`, payload)
      else await api.post('/team', payload)
      navigate('/team')
    } catch (e) { setError(e instanceof Error ? e.message : 'Lỗi'); setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">{isEdit ? 'Chỉnh sửa thợ nail' : 'Thêm thợ nail mới'}</div></div>
        <button className="btn-ghost" onClick={() => navigate('/team')}>← Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <ImageField label="Ảnh đại diện" value={form.image} onChange={v => set('image', v)} placeholder="URL ảnh thợ" />
          </div>
          <div className="form-group">
            <label className="form-label">Họ tên *</label>
            <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="VD: Linh Nguyễn" />
          </div>
          <div className="form-group">
            <label className="form-label">Chức vụ / vai trò</label>
            <input className="form-control" value={form.role} onChange={e => set('role', e.target.value)} placeholder="VD: Nail Artist Cấp Senior" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Chuyên môn 1</label>
              <input className="form-control" value={form.specialty1} onChange={e => set('specialty1', e.target.value)} placeholder="VD: Nail Art 3D" />
            </div>
            <div className="form-group">
              <label className="form-label">Chuyên môn 2</label>
              <input className="form-control" value={form.specialty2} onChange={e => set('specialty2', e.target.value)} placeholder="VD: Gel" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Thứ tự sắp xếp</label>
            <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Lưu thay đổi' : 'Thêm thợ')}</button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/team')}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  )
}
