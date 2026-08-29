import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface FormData {
  title: string; image: string; status_label: string; description: string;
  investor: string; price_label: string; area_label: string; sort_order: number
}
const empty: FormData = { title: '', image: '', status_label: 'Đang mở bán', description: '', investor: '', price_label: '', area_label: '', sort_order: 0 }

export default function ProjectForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<FormData>(empty)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api.get<FormData & { id: number }>(`/projects/${id}`)
      .then(d => setForm({
        title: d.title, image: d.image ?? '', status_label: d.status_label ?? 'Đang mở bán', description: d.description ?? '',
        investor: d.investor ?? '', price_label: d.price_label ?? '', area_label: d.area_label ?? '', sort_order: d.sort_order ?? 0,
      }))
      .catch(() => setError('Không tìm thấy dự án.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof FormData>(k: K, v: FormData[K]) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) { setError('Tên dự án là bắt buộc.'); return }
    setSaving(true)
    try {
      if (isEdit) await api.put(`/projects/${id}`, form)
      else await api.post('/projects', form)
      navigate('/projects')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 680 }}>
      <div className="page-header">
        <div className="page-title">{isEdit ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'}</div>
        <button onClick={() => navigate('/projects')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Tên dự án *</label>
          <input type="text" className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Vd: Vinhomes Grand Park — Phân khu The Beverly" required />
        </div>
        <div className="form-group">
          <ImageField label="Ảnh đại diện" value={form.image} onChange={v => set('image', v)} />
        </div>
        <div className="form-group">
          <label className="form-label">Trạng thái</label>
          <select className="form-control" value={form.status_label} onChange={e => set('status_label', e.target.value)}>
            <option value="Đang mở bán">Đang mở bán</option>
            <option value="Sắp bàn giao">Sắp bàn giao</option>
            <option value="Đã bàn giao">Đã bàn giao</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả</label>
          <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Mô tả ngắn về dự án..." />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Chủ đầu tư</label>
            <input type="text" className="form-control" value={form.investor} onChange={e => set('investor', e.target.value)} placeholder="Vd: Vinhomes" />
          </div>
          <div className="form-group">
            <label className="form-label">Giá từ</label>
            <input type="text" className="form-control" value={form.price_label} onChange={e => set('price_label', e.target.value)} placeholder="Vd: Giá từ 2.6 tỷ" />
          </div>
          <div className="form-group">
            <label className="form-label">Khu vực</label>
            <input type="text" className="form-control" value={form.area_label} onChange={e => set('area_label', e.target.value)} placeholder="Vd: TP. Thủ Đức" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Thứ tự hiển thị</label>
          <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/projects')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
