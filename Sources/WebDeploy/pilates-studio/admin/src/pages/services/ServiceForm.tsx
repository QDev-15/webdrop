import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Category { id: number; name: string }
interface Service {
  id: number; category_id: number | null; name: string; slug: string; description: string
  duration_min: number | null; max_students: number | null; level: string
  price_per_session: number | null; image_url: string; tag: string
  is_featured: number; sort_order: number
}

type FormState = Omit<Service, 'id'>

const emptyForm: FormState = {
  category_id: null, name: '', slug: '', description: '',
  duration_min: null, max_students: null, level: '',
  price_per_session: null, image_url: '', tag: '',
  is_featured: 0, sort_order: 0,
}

export default function ServiceForm() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm]         = useState<FormState>(emptyForm)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading]   = useState(isEdit)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => {
    api.get<Category[]>('/service-categories').then(setCategories).catch(console.error)
    if (isEdit) {
      api.get<Service>(`/services/${id}`)
        .then(d => setForm({
          category_id: d.category_id, name: d.name, slug: d.slug,
          description: d.description ?? '', duration_min: d.duration_min,
          max_students: d.max_students, level: d.level ?? '',
          price_per_session: d.price_per_session, image_url: d.image_url ?? '',
          tag: d.tag ?? '', is_featured: d.is_featured, sort_order: d.sort_order,
        }))
        .catch(e => setError(e instanceof Error ? e.message : 'Không tải được dữ liệu.'))
        .finally(() => setLoading(false))
    }
  }, [id, isEdit])

  const set = (k: keyof FormState, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên lớp học không được trống.'); return }
    setSaving(true); setError('')
    try {
      if (isEdit) {
        await api.put(`/services/${id}`, form)
      } else {
        await api.post('/services', form)
      }
      navigate('/services')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi lưu dữ liệu.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa lớp học' : 'Thêm lớp học mới'}</div>
        </div>
        <button onClick={() => navigate('/services')} className="btn-ghost">← Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
          {/* Main */}
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">Tên lớp học *</label>
                <input className="form-control" value={form.name}
                  onChange={e => set('name', e.target.value)} placeholder="Mat Pilates" required />
              </div>
              <div className="form-group">
                <label className="form-label">Slug</label>
                <input className="form-control" value={form.slug}
                  onChange={e => set('slug', e.target.value)} placeholder="mat-pilates" />
              </div>
              <div className="form-group">
                <label className="form-label">Mô tả</label>
                <textarea className="form-control" rows={5} value={form.description}
                  onChange={e => set('description', e.target.value)}
                  placeholder="Mô tả chi tiết về lớp học..." />
              </div>
            </div>
            <div className="card">
              <label className="form-label" style={{ marginBottom: 8 }}>Ảnh lớp học</label>
              <ImageField value={form.image_url} onChange={url => set('image_url', url)} />
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">Danh mục</label>
                <select className="form-control" value={form.category_id ?? ''}
                  onChange={e => set('category_id', e.target.value ? +e.target.value : null)}>
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tag hiển thị</label>
                <input className="form-control" value={form.tag}
                  onChange={e => set('tag', e.target.value)} placeholder="Phổ biến nhất" />
              </div>
              <div className="form-group">
                <label className="form-label">Cấp độ</label>
                <select className="form-control" value={form.level}
                  onChange={e => set('level', e.target.value)}>
                  <option value="">-- Chọn cấp độ --</option>
                  <option value="Tất cả">Tất cả</option>
                  <option value="Cơ bản">Cơ bản</option>
                  <option value="Trung cấp+">Trung cấp+</option>
                  <option value="Nâng cao">Nâng cao</option>
                  <option value="Nhẹ nhàng">Nhẹ nhàng</option>
                  <option value="Cá nhân hóa">Cá nhân hóa</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Thời lượng (phút)</label>
                <input type="number" className="form-control" value={form.duration_min ?? ''}
                  onChange={e => set('duration_min', e.target.value ? +e.target.value : null)} placeholder="60" />
              </div>
              <div className="form-group">
                <label className="form-label">Sĩ số tối đa</label>
                <input type="number" className="form-control" value={form.max_students ?? ''}
                  onChange={e => set('max_students', e.target.value ? +e.target.value : null)} placeholder="10" />
              </div>
              <div className="form-group">
                <label className="form-label">Giá / buổi (VNĐ)</label>
                <input type="number" className="form-control" value={form.price_per_session ?? ''}
                  onChange={e => set('price_per_session', e.target.value ? +e.target.value : null)} placeholder="180000" />
              </div>
              <div className="form-group">
                <label className="form-label">Thứ tự hiển thị</label>
                <input type="number" className="form-control" value={form.sort_order}
                  onChange={e => set('sort_order', +e.target.value)} />
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={!!form.is_featured}
                    onChange={e => set('is_featured', e.target.checked ? 1 : 0)} />
                  <span className="form-label" style={{ marginBottom: 0 }}>Nổi bật (hiển thị trang chủ)</span>
                </label>
              </div>
            </div>

            <button type="submit" className="btn-accent" disabled={saving}
              style={{ width: '100%', justifyContent: 'center', padding: '11px 0' }}>
              {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm lớp học'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
