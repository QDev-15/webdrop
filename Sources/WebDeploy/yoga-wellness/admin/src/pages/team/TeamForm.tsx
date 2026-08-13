import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface TeamMember {
  id?: number
  name: string
  role: string
  image: string
  experience: string
  cert?: string
  specialties?: string
}

export default function TeamForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState<TeamMember>({ name: '', role: '', image: '', experience: '', cert: '', specialties: '' })
  const [loading, setLoading] = useState(!!id)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      api.get<TeamMember>(`/team/${id}`)
        .then(setForm)
        .catch(err => setError((err as Error).message))
        .finally(() => setLoading(false))
    }
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      if (id) {
        await api.put(`/team/${id}`, form)
      } else {
        await api.post('/team', form)
      }
      navigate('/admin/team')
    } catch (err) {
      setError((err as Error).message)
    }
  }

  if (loading) return <div style={{ padding: '48px', textAlign: 'center' }}>Đang tải...</div>

  return (
    <>
      <div style={{ marginBottom: '24px' }}>
        <button onClick={() => navigate('/admin/team')} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--accent)', fontSize: '14px' }}>← Quay lại</button>
      </div>

      <div className="form-card">
        <h2 className="page-title">{id ? 'Sửa thành viên' : 'Thêm thành viên mới'}</h2>

        {error && <div style={{ color: 'var(--danger)', padding: '12px', background: '#ffe4e4', borderRadius: '8px', marginBottom: '16px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label className="form-label">Tên *</label>
            <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div>
            <label className="form-label">Chức vụ *</label>
            <input className="form-control" name="role" value={form.role} onChange={handleChange} placeholder="VD: Yoga Master, Instructor" required />
          </div>

          <div>
            <label className="form-label">Kinh nghiệm</label>
            <textarea className="form-control" name="experience" value={form.experience} onChange={handleChange} />
          </div>

          <div>
            <label className="form-label">Chuyên môn</label>
            <input className="form-control" name="specialties" value={form.specialties} onChange={handleChange} placeholder="VD: Hatha, Vinyasa, Thiền định" />
          </div>

          <div>
            <label className="form-label">Chứng chỉ</label>
            <input className="form-control" name="cert" value={form.cert} onChange={handleChange} placeholder="VD: RYT-200, YACEP" />
          </div>

          <div>
            <label className="form-label">Ảnh URL</label>
            <input className="form-control" name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button type="submit" className="btn-accent">Lưu</button>
            <button type="button" onClick={() => navigate('/admin/team')} className="btn-ghost">Hủy</button>
          </div>
        </form>
      </div>
    </>
  )
}
