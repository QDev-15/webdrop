import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../../api/client'

interface FormState { name: string; position: string; bio: string; experience: string; avatar: string; certificates: string; is_leader: number; sort_order: number; status: string }

const DEFAULT: FormState = { name: '', position: '', bio: '', experience: '', avatar: '', certificates: '', is_leader: 0, sort_order: 0, status: 'published' }

export default function TeamForm() {
  const { id } = useParams()
  const nav = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<FormState>(DEFAULT)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) api.get<FormState>(`/team-members/${id}`).then(m => setForm(m)).catch(() => nav('/team'))
  }, [id])

  const set = (k: keyof FormState, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name) { setError('Tên không được để trống.'); return }
    setLoading(true)
    try {
      if (isEdit) await api.put(`/team-members/${id}`, form)
      else await api.post('/team-members', form)
      nav('/team')
    } catch (err) { setError(err instanceof Error ? err.message : 'Lỗi.') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth: '640px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <Link to="/team" className="btn btn-ghost btn-sm">← Quay lại</Link>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)' }}>{isEdit ? 'Sửa chuyên gia' : 'Thêm chuyên gia'}</h1>
      </div>
      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Họ và tên *</label>
            <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Chức vụ</label>
            <input className="form-control" value={form.position} onChange={e => set('position', e.target.value)} placeholder="VD: Giám đốc Đầu tư" />
          </div>
          <div className="form-group">
            <label className="form-label">Kinh nghiệm (tóm tắt)</label>
            <input className="form-control" value={form.experience} onChange={e => set('experience', e.target.value)} placeholder="VD: 20 năm kinh nghiệm quản lý quỹ" />
          </div>
          <div className="form-group">
            <label className="form-label">Tiểu sử</label>
            <textarea className="form-control" value={form.bio} onChange={e => set('bio', e.target.value)} rows={4} />
          </div>
          <div className="form-group">
            <label className="form-label">Chứng chỉ (phân cách bằng dấu phẩy)</label>
            <input className="form-control" value={form.certificates} onChange={e => set('certificates', e.target.value)} placeholder="CFA, ACCA, CFP" />
          </div>
          <div className="form-group">
            <label className="form-label">URL Ảnh đại diện</label>
            <input className="form-control" type="url" value={form.avatar} onChange={e => set('avatar', e.target.value)} />
            {form.avatar && <img src={form.avatar} alt="" style={{ marginTop: '8px', width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Ban lãnh đạo</label>
              <select className="form-control" value={form.is_leader} onChange={e => set('is_leader', parseInt(e.target.value))}>
                <option value={0}>Không</option>
                <option value={1}>Có</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input className="form-control" type="number" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Hiển thị</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</button>
            <Link to="/team" className="btn btn-ghost">Hủy</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
