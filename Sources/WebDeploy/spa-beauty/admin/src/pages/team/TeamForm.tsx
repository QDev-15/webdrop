import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface FormState {
  name: string; role: string; image: string
  experience: string; specialty1: string; specialty2: string; sort_order: number
}

const EMPTY: FormState = {
  name: '', role: '', image: '', experience: '', specialty1: '', specialty2: '', sort_order: 0
}

export default function TeamForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<FormState>(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(key: keyof FormState, value: string | number) {
    setForm(f => ({ ...f, [key]: value }))
  }

  useEffect(() => {
    if (isEdit) {
      api.get<FormState[]>('/team').then(list => {
        const item = list.find((m: any) => String(m.id) === id)
        if (item) setForm(item)
        setLoading(false)
      }).catch(() => setLoading(false))
    }
  }, [id, isEdit])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      if (isEdit) {
        await api.put(`/team/${id}`, form)
      } else {
        await api.post('/team', form)
      }
      navigate('/team')
    } catch (e) { setError(e instanceof Error ? e.message : 'Lỗi lưu') }
    setSaving(false)
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">{isEdit ? 'Sửa chuyên viên' : 'Thêm chuyên viên'}</div></div>
      </div>
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={submit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div className="card">
            <div style={{ fontWeight: 600, marginBottom: 16 }}>Thông tin chuyên viên</div>

            <div className="form-group">
              <label className="form-label">Họ và tên *</label>
              <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Hoa Ly" required />
            </div>
            <div className="form-group">
              <label className="form-label">Vai trò / Chức vụ</label>
              <input className="form-control" value={form.role} onChange={e => set('role', e.target.value)} placeholder="Senior Therapist" />
            </div>
            <div className="form-group">
              <label className="form-label">Kinh nghiệm</label>
              <input className="form-control" value={form.experience} onChange={e => set('experience', e.target.value)} placeholder="8 năm kinh nghiệm" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Chuyên môn 1</label>
                <input className="form-control" value={form.specialty1} onChange={e => set('specialty1', e.target.value)} placeholder="Massage Thụy Điển" />
              </div>
              <div className="form-group">
                <label className="form-label">Chuyên môn 2</label>
                <input className="form-control" value={form.specialty2} onChange={e => set('specialty2', e.target.value)} placeholder="Đá nóng" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Thứ tự hiển thị</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', +e.target.value)} />
            </div>
          </div>

          <div className="card">
            <div style={{ fontWeight: 600, marginBottom: 16 }}>Ảnh chân dung</div>
            <ImageField
              value={form.image}
              onChange={url => set('image', url)}
              label="Ảnh chân dung"
              hint="Ảnh khuôn mặt rõ nét, tỷ lệ 3:4"
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : '💾 Lưu chuyên viên'}</button>
          <button type="button" className="btn-ghost" onClick={() => navigate('/team')}>Hủy</button>
        </div>
      </form>
    </div>
  )
}
