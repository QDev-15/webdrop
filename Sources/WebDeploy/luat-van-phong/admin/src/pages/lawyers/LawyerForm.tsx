import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface LawyerData { name: string; role: string; bio: string; speciality: string; avatar: string; tags: string; is_partner: number; sort_order: number; status: string }

export default function LawyerForm() {
  const { id } = useParams()
  const nav = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState<LawyerData>({ name: '', role: '', bio: '', speciality: '', avatar: '', tags: '', is_partner: 0, sort_order: 0, status: 'published' })
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<LawyerData & { id: number }>(`/lawyers/${id}`).then(l => {
        setForm({ name: l.name, role: l.role || '', bio: l.bio || '', speciality: l.speciality || '', avatar: l.avatar || '', tags: l.tags || '', is_partner: l.is_partner || 0, sort_order: l.sort_order || 0, status: l.status })
      }).catch(() => {})
    }
  }, [id, isEdit])

  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name) { setAlert('Tên luật sư không được để trống'); return }
    setSaving(true); setAlert('')
    try {
      if (isEdit) await api.put(`/lawyers/${id}`, form)
      else        await api.post('/lawyers', form)
      nav('/lawyers')
    } catch (err: unknown) {
      setAlert(err instanceof Error ? err.message : 'Lỗi khi lưu')
    } finally { setSaving(false) }
  }

  return (
    <>
      <div className="page-hdr"><h1>{isEdit ? 'Sửa Luật Sư' : 'Thêm Luật Sư'}</h1></div>
      {alert && <div className="alert alert-error">{alert}</div>}
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Họ và tên *</label>
              <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Chức vụ</label>
              <input className="form-input" value={form.role} onChange={e => set('role', e.target.value)} placeholder="Trưởng Văn Phòng" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Chuyên môn ngắn</label>
            <input className="form-input" value={form.speciality} onChange={e => set('speciality', e.target.value)} placeholder="Luật Doanh Nghiệp & M&A · 18 năm kinh nghiệm" />
          </div>
          <div className="form-group">
            <label className="form-label">Tiểu sử</label>
            <textarea className="form-textarea" value={form.bio} onChange={e => set('bio', e.target.value)} rows={5} />
          </div>
          <div className="form-group">
            <ImageField label="Ảnh đại diện" value={form.avatar} onChange={v => set('avatar', v)} placeholder="URL ảnh hoặc upload từ máy tính" />
          </div>
          <div className="form-group">
            <label className="form-label">Tags (phân cách bằng dấu phẩy)</label>
            <input className="form-input" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="Luật Doanh Nghiệp, M&A, Trọng Tài" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Loại</label>
              <select className="form-select" value={form.is_partner} onChange={e => set('is_partner', Number(e.target.value))}>
                <option value={0}>Luật sư thành viên</option>
                <option value={1}>Luật sư sáng lập/điều hành</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input className="form-input" type="number" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
            <button type="button" className="btn btn-ghost" onClick={() => nav('/lawyers')}>Hủy</button>
          </div>
        </form>
      </div>
    </>
  )
}
