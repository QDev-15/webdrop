import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Category {
  id: number
  name: string
}

interface FormState {
  category_id: string
  name: string
  description: string
  price_from: string
  price_unit: string
  duration: string
  recovery: string
  image: string
  is_featured: boolean
  sort_order: string
  status: string
}

const EMPTY: FormState = {
  category_id: '',
  name: '',
  description: '',
  price_from: '',
  price_unit: 'ca điều trị',
  duration: '',
  recovery: '',
  image: '',
  is_featured: false,
  sort_order: '0',
  status: 'published',
}

export default function ServiceForm() {
  const { id }        = useParams<{ id: string }>()
  const navigate      = useNavigate()
  const isEdit        = Boolean(id)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    api.get<Category[]>('/service-categories').then(setCategories).catch(() => {})
    if (isEdit) {
      api.get<Record<string, unknown>>(`/services/${id}`)
        .then(d => setForm({
          category_id: String(d.category_id ?? ''),
          name:        String(d.name ?? ''),
          description: String(d.description ?? ''),
          price_from:  String(d.price_from ?? ''),
          price_unit:  String(d.price_unit ?? 'ca điều trị'),
          duration:    String(d.duration ?? ''),
          recovery:    String(d.recovery ?? ''),
          image:       String(d.image ?? ''),
          is_featured: Boolean(d.is_featured),
          sort_order:  String(d.sort_order ?? '0'),
          status:      String(d.status ?? 'published'),
        }))
        .catch(() => setError('Không thể tải dữ liệu dịch vụ.'))
        .finally(() => setLoading(false))
    }
  }, [id, isEdit])

  const set = (k: keyof FormState, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên dịch vụ không được để trống.'); return }
    setSaving(true); setError('')
    const payload = {
      ...form,
      price_from:  form.price_from ? Number(form.price_from) : 0,
      sort_order:  Number(form.sort_order),
      is_featured: form.is_featured ? 1 : 0,
      category_id: form.category_id ? Number(form.category_id) : null,
    }
    try {
      if (isEdit) {
        await api.put(`/services/${id}`, payload)
      } else {
        await api.post('/services', payload)
      }
      navigate('/services')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi lưu dịch vụ.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Sửa dịch vụ' : 'Thêm dịch vụ niềng răng mới'}</div>
          <div className="page-sub">Điền thông tin dịch vụ chỉnh nha</div>
        </div>
        <button onClick={() => navigate('/services')} className="btn-ghost">← Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
          {/* Main column */}
          <div className="card" style={{ display: 'grid', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Tên dịch vụ *</label>
              <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="VD: Invisalign — Khay trong suốt cao cấp" required />
            </div>
            <div className="form-group">
              <label className="form-label">Danh mục</label>
              <select className="form-control" value={form.category_id} onChange={e => set('category_id', e.target.value)}>
                <option value="">-- Chọn danh mục --</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Mô tả</label>
              <textarea className="form-control" rows={5} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả chi tiết dịch vụ, ưu điểm, đối tượng phù hợp..." />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Giá từ (VNĐ)</label>
                <input className="form-control" type="number" value={form.price_from} onChange={e => set('price_from', e.target.value)} placeholder="VD: 25000000 (để 0 = miễn phí)" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Đơn vị giá</label>
                <input className="form-control" value={form.price_unit} onChange={e => set('price_unit', e.target.value)} placeholder="ca điều trị / lần / liệu trình" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Thời gian điều trị</label>
                <input className="form-control" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="VD: 12–24 tháng" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Ghi chú / Lưu ý</label>
                <input className="form-control" value={form.recovery} onChange={e => set('recovery', e.target.value)} placeholder="VD: Không, Tái khám định kỳ..." />
              </div>
            </div>
          </div>

          {/* Side column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card" style={{ display: 'grid', gap: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Trạng thái</label>
                <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                  <option value="published">Hiển thị</option>
                  <option value="draft">Ẩn</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Thứ tự hiển thị</label>
                <input className="form-control" type="number" value={form.sort_order} onChange={e => set('sort_order', e.target.value)} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={form.is_featured}
                  onChange={e => set('is_featured', e.target.checked)}
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                <label htmlFor="is_featured" style={{ fontSize: 14, cursor: 'pointer' }}>Dịch vụ nổi bật (hiển thị trang chủ)</label>
              </div>
            </div>

            <div className="card">
              <label className="form-label">Ảnh dịch vụ</label>
              <ImageField value={form.image} onChange={v => set('image', v)} />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" disabled={saving} className="btn-accent" style={{ flex: 1 }}>
                {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm dịch vụ'}
              </button>
              <button type="button" onClick={() => navigate('/services')} className="btn-ghost">Huỷ</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
