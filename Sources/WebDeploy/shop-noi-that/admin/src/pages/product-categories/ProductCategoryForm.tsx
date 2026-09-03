import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface FormData {
  name: string
  image: string
  sort_order: number
}

const EMPTY: FormData = { name: '', image: '', sort_order: 0 }

export default function ProductCategoryForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<FormData & { id: number; slug: string }>(`/product-categories/${id}`)
      .then(d => setForm({ name: d.name, image: d.image ?? '', sort_order: d.sort_order ?? 0 }))
      .catch(() => setError('Không tải được danh mục'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (k: keyof FormData, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên danh mục không được để trống'); return }
    setSaving(true); setError('')
    try {
      if (isEdit) {
        await api.post(`/product-categories/${id}/update`, form)
      } else {
        await api.post('/product-categories', form)
      }
      navigate('/product-categories')
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
        <h1 className="admin-page-title">{isEdit ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {error && <div className="form-error-banner">{error}</div>}

        <div className="form-group">
          <label>Tên danh mục <span className="req">*</span></label>
          <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="VD: Thời Trang" />
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
          <button type="button" className="btn btn-outline" onClick={() => navigate('/product-categories')}>Hủy</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
        </div>
      </form>
    </div>
  )
}
