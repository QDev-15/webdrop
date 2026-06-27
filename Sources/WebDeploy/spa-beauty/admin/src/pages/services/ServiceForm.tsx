import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Category { id: number; name: string; icon: string }

interface FormState {
  category_id: string; name: string; tag: string; description: string
  price: string; duration: string; image: string; featured: number; sort_order: number
}

const EMPTY: FormState = {
  category_id: '', name: '', tag: '', description: '', price: '', duration: '', image: '', featured: 0, sort_order: 0
}

export default function ServiceForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<FormState>(EMPTY)
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(key: keyof FormState, value: string | number) {
    setForm(f => ({ ...f, [key]: value }))
  }

  useEffect(() => {
    api.get<Category[]>('/service-categories').then(setCats).catch(() => {})
    if (isEdit) {
      api.get<FormState[]>('/services').then(list => {
        const svc = list.find((s: any) => String(s.id) === id)
        if (svc) {
          setForm({
            category_id: svc.category_id ? String(svc.category_id) : '',
            name: svc.name,
            tag: svc.tag,
            description: svc.description,
            price: svc.price,
            duration: svc.duration,
            image: svc.image,
            featured: svc.featured,
            sort_order: svc.sort_order,
          })
        }
        setLoading(false)
      }).catch(() => setLoading(false))
    }
  }, [id, isEdit])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const payload = { ...form, category_id: form.category_id || null, featured: Number(form.featured) }
      if (isEdit) {
        await api.put(`/services/${id}`, payload)
      } else {
        await api.post('/services', payload)
      }
      navigate('/services')
    } catch (e) { setError(e instanceof Error ? e.message : 'Lỗi lưu') }
    setSaving(false)
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">{isEdit ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}</div></div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={submit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div className="card">
            <div style={{ fontWeight: 600, marginBottom: 16 }}>Thông tin dịch vụ</div>

            <div className="form-group">
              <label className="form-label">Danh mục</label>
              <select className="form-control" value={form.category_id} onChange={e => set('category_id', e.target.value)}>
                <option value="">— Không có danh mục —</option>
                {cats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tên dịch vụ *</label>
              <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Massage Thụy Điển" required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Tag / Nhãn</label>
                <input className="form-control" value={form.tag} onChange={e => set('tag', e.target.value)} placeholder="Phổ biến" />
              </div>
              <div className="form-group">
                <label className="form-label">Thứ tự hiển thị</label>
                <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', +e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Giá</label>
                <input className="form-control" value={form.price} onChange={e => set('price', e.target.value)} placeholder="350.000đ" />
              </div>
              <div className="form-group">
                <label className="form-label">Thời gian</label>
                <input className="form-control" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="60 phút" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mô tả</label>
              <textarea className="form-control" rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả ngắn về dịch vụ..." />
            </div>

            <div className="form-group">
              <label className="form-label">Nổi bật</label>
              <select className="form-control" value={form.featured} onChange={e => set('featured', +e.target.value)}>
                <option value={0}>Không</option>
                <option value={1}>Có — Hiển thị trên trang chủ</option>
              </select>
            </div>
          </div>

          <div className="card">
            <div style={{ fontWeight: 600, marginBottom: 16 }}>Ảnh dịch vụ</div>
            <ImageField
              value={form.image}
              onChange={url => set('image', url)}
              label="Ảnh dịch vụ"
              hint="Tỷ lệ 4:3 hoặc 16:9, tối thiểu 600px chiều rộng"
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : '💾 Lưu dịch vụ'}</button>
          <button type="button" className="btn-ghost" onClick={() => navigate('/services')}>Hủy</button>
        </div>
      </form>
    </div>
  )
}
