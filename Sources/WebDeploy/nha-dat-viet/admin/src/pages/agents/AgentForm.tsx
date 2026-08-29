import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface FormData { name: string; title: string; phone: string; zalo: string; avatar: string; sort_order: number }
const empty: FormData = { name: '', title: '', phone: '', zalo: '', avatar: '', sort_order: 0 }

export default function AgentForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<FormData>(empty)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api.get<FormData & { id: number }>(`/agents/${id}`)
      .then(d => setForm({ name: d.name, title: d.title ?? '', phone: d.phone ?? '', zalo: d.zalo ?? '', avatar: d.avatar ?? '', sort_order: d.sort_order ?? 0 }))
      .catch(() => setError('Không tìm thấy môi giới.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof FormData>(k: K, v: FormData[K]) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Tên môi giới là bắt buộc.'); return }
    setSaving(true)
    try {
      if (isEdit) await api.put(`/agents/${id}`, form)
      else await api.post('/agents', form)
      navigate('/agents')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="page-header">
        <div className="page-title">{isEdit ? 'Chỉnh sửa môi giới' : 'Thêm môi giới mới'}</div>
        <button onClick={() => navigate('/agents')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Họ tên *</label>
            <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Vd: Nguyễn Minh Khôi" required />
          </div>
          <div className="form-group">
            <label className="form-label">Chức danh</label>
            <input type="text" className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Vd: Trưởng phòng kinh doanh" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Số điện thoại</label>
            <input type="text" className="form-control" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="Vd: 0909 123 456" />
          </div>
          <div className="form-group">
            <label className="form-label">Số Zalo</label>
            <input type="text" className="form-control" value={form.zalo} onChange={e => set('zalo', e.target.value)} placeholder="Vd: 0909123456" />
            <div className="form-hint">Chỉ nhập số, dùng để tạo link zalo.me</div>
          </div>
        </div>
        <div className="form-group">
          <ImageField label="Ảnh đại diện" value={form.avatar} onChange={v => set('avatar', v)} />
        </div>
        <div className="form-group">
          <label className="form-label">Thứ tự hiển thị</label>
          <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/agents')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
