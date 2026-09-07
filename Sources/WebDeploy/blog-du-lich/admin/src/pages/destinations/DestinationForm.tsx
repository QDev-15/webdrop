import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface DestinationForm {
  name: string
  category_label: string
  image: string
  sort_order: number
  status: string
}

const empty: DestinationForm = { name: '', category_label: '', image: '', sort_order: 0, status: 'published' }

export default function DestinationForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<DestinationForm>(empty)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    if (!id) return
    api.get<DestinationForm & { id: number }>(`/destinations/${id}`)
      .then(d => setForm({ name: d.name, category_label: d.category_label ?? '', image: d.image ?? '', sort_order: d.sort_order ?? 0, status: d.status ?? 'published' }))
      .catch(() => setError('Không tìm thấy điểm đến.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof DestinationForm>(k: K, v: DestinationForm[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Tên điểm đến là bắt buộc.'); return }
    setSaving(true)
    try {
      if (isEdit) {
        await api.put(`/destinations/${id}`, form)
      } else {
        await api.post('/destinations', form)
      }
      navigate('/destinations')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 560 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa điểm đến' : 'Thêm điểm đến mới'}</div>
        </div>
        <button onClick={() => navigate('/destinations')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Tên điểm đến *</label>
          <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Vd: Bali, Indonesia" required />
        </div>
        <div className="form-group">
          <label className="form-label">Nhãn chuyên mục</label>
          <input type="text" className="form-control" value={form.category_label} onChange={e => set('category_label', e.target.value)} placeholder="Điểm đến quốc tế / Điểm đến trong nước" />
        </div>
        <div className="form-group">
          <ImageField label="Ảnh" value={form.image} onChange={v => set('image', v)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Thứ tự hiển thị</label>
            <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
          </div>
          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="published">Đang hiện</option>
              <option value="draft">Ẩn</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/destinations')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
