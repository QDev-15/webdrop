import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface Service {
  id?: number
  name: string
  description: string
  duration: number
  level: string
  image: string
  max_capacity: number
  status: string
}

export default function ServiceForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState<Service>({ name: '', description: '', duration: 60, level: '', image: '', max_capacity: 15, status: 'published' })
  const [loading, setLoading] = useState(!!id)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      api.get<Service>(`/services/${id}`)
        .then(setForm)
        .catch(err => setError((err as Error).message))
        .finally(() => setLoading(false))
    }
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: name === 'duration' || name === 'max_capacity' ? parseInt(value) : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      if (id) {
        await api.put(`/services/${id}`, form)
      } else {
        await api.post('/services', form)
      }
      navigate('/services')
    } catch (err) {
      setError((err as Error).message)
    }
  }

  if (loading) return <div style={{ padding: '48px', textAlign: 'center' }}>Đang tải...</div>

  return (
    <>
      <div style={{ marginBottom: '24px' }}>
        <button onClick={() => navigate('/services')} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--accent)', fontSize: '14px' }}>← Quay lại</button>
      </div>

      <div className="form-card">
        <h2 className="page-title">{id ? 'Sửa dịch vụ' : 'Thêm dịch vụ yoga'}</h2>

        {error && <div style={{ color: 'var(--danger)', padding: '12px', background: '#ffe4e4', borderRadius: '8px', marginBottom: '16px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label className="form-label">Tên dịch vụ *</label>
            <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div>
            <label className="form-label">Mô tả *</label>
            <textarea className="form-control" name="description" value={form.description} onChange={handleChange} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">Thời gian (phút) *</label>
              <input className="form-control" type="number" name="duration" value={form.duration} onChange={handleChange} required />
            </div>
            <div>
              <label className="form-label">Cấp độ *</label>
              <input className="form-control" name="level" value={form.level} onChange={handleChange} placeholder="VD: Người mới, Trung cấp" required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">Sức chứa tối đa *</label>
              <input className="form-control" type="number" name="max_capacity" value={form.max_capacity} onChange={handleChange} required />
            </div>
            <div>
              <label className="form-label">Ảnh URL</label>
              <input className="form-control" name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
            </div>
          </div>

          <div>
            <label className="form-label">Trạng thái</label>
            <select className="form-control" name="status" value={form.status} onChange={handleChange}>
              <option value="published">Hiển thị</option>
              <option value="draft">Ẩn</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button type="submit" className="btn-accent">Lưu</button>
            <button type="button" onClick={() => navigate('/services')} className="btn-ghost">Hủy</button>
          </div>
        </form>
      </div>
    </>
  )
}
