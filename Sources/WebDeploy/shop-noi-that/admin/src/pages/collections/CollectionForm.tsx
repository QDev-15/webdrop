import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface FormData {
  name: string
  description: string
  image: string
  sort_order: number
}

const EMPTY: FormData = { name: '', description: '', image: '', sort_order: 0 }

export default function CollectionForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<FormData & { id: number; slug: string }>(`/collections/${id}`)
      .then(d => setForm({ name: d.name, description: d.description ?? '', image: d.image ?? '', sort_order: d.sort_order ?? 0 }))
      .catch(() => setError('Không tải được bộ sưu tập'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (k: keyof FormData, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên bộ sưu tập không được để trống'); return }
    setSaving(true); setError('')
    try {
      if (isEdit) {
        await api.post(`/collections/${id}/update`, form)
      } else {
        await api.post('/collections', form)
      }
      navigate('/collections')
    } catch {
      setError('Lưu thất bại, vui lòng thử lại')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading-box">Đang tải...</div>

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">{isEdit ? 'Sửa bộ sưu tập' : 'Thêm bộ sưu tập mới'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {error && <div className="form-error-banner">{error}</div>}

        <div className="form-group">
          <label>Tên bộ sưu tập <span className="req">*</span></label>
          <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="VD: Bắc Âu tối giản" />
        </div>

        <div className="form-group">
          <label>Mô tả</label>
          <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Đường nét thanh gọn, gỗ sáng màu và tông trung tính..." />
        </div>

        <div className="form-group">
          <label>Ảnh đại diện</label>
          <ImageField value={form.image} onChange={v => set('image', v)} />
        </div>

        <div className="form-group">
          <label>Thứ tự sắp xếp</label>
          <input type="number" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} min={0} />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/collections')}>Hủy</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
        </div>
      </form>
    </div>
  )
}
