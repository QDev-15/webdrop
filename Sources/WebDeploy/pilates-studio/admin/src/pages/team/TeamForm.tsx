import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface TeamMember {
  id: number; name: string; role: string; cert: string; bio: string
  image_url: string; tags: string; sort_order: number; is_active: number
}

type FormState = Omit<TeamMember, 'id'>

const emptyForm: FormState = {
  name: '', role: '', cert: '', bio: '', image_url: '', tags: '', sort_order: 0, is_active: 1,
}

export default function TeamForm() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm]     = useState<FormState>(emptyForm)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<TeamMember>(`/team/${id}`)
      .then(d => setForm({
        name: d.name, role: d.role ?? '', cert: d.cert ?? '', bio: d.bio ?? '',
        image_url: d.image_url ?? '', tags: d.tags ?? '',
        sort_order: d.sort_order, is_active: d.is_active,
      }))
      .catch(e => setError(e instanceof Error ? e.message : 'Không tải được dữ liệu.'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (k: keyof FormState, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên không được trống.'); return }
    setSaving(true); setError('')
    try {
      if (isEdit) {
        await api.put(`/team/${id}`, form)
      } else {
        await api.post('/team', form)
      }
      navigate('/team')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi lưu dữ liệu.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">{isEdit ? 'Chỉnh sửa huấn luyện viên' : 'Thêm huấn luyện viên'}</div></div>
        <button onClick={() => navigate('/team')} className="btn-ghost">← Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">Họ tên *</label>
                <input className="form-control" value={form.name}
                  onChange={e => set('name', e.target.value)} placeholder="Nguyễn Lan Anh" required />
              </div>
              <div className="form-group">
                <label className="form-label">Vai trò</label>
                <input className="form-control" value={form.role}
                  onChange={e => set('role', e.target.value)} placeholder="Head Instructor — Mat & Reformer" />
              </div>
              <div className="form-group">
                <label className="form-label">Chứng chỉ</label>
                <input className="form-control" value={form.cert}
                  onChange={e => set('cert', e.target.value)} placeholder="STOTT Pilates® Certified" />
              </div>
              <div className="form-group">
                <label className="form-label">Tiểu sử</label>
                <textarea className="form-control" rows={5} value={form.bio}
                  onChange={e => set('bio', e.target.value)}
                  placeholder="Mô tả kinh nghiệm và chuyên môn..." />
              </div>
              <div className="form-group">
                <label className="form-label">Tags chuyên môn (cách nhau bằng dấu phẩy)</label>
                <input className="form-control" value={form.tags}
                  onChange={e => set('tags', e.target.value)} placeholder="Mat Pilates,Prenatal,Spine Rehab" />
              </div>
            </div>
          </div>

          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">Ảnh đại diện</label>
                <ImageField value={form.image_url} onChange={url => set('image_url', url)} />
              </div>
              <div className="form-group">
                <label className="form-label">Thứ tự hiển thị</label>
                <input type="number" className="form-control" value={form.sort_order}
                  onChange={e => set('sort_order', +e.target.value)} />
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={!!form.is_active}
                    onChange={e => set('is_active', e.target.checked ? 1 : 0)} />
                  <span className="form-label" style={{ marginBottom: 0 }}>Hiển thị trên website</span>
                </label>
              </div>
            </div>
            <button type="submit" className="btn-accent" disabled={saving}
              style={{ width: '100%', justifyContent: 'center', padding: '11px 0' }}>
              {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm huấn luyện viên'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
