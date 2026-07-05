import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Category {
  id: number
  name: string
}

export default function ServiceForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id

  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({
    name: '',
    description: '',
    icon: '🦷',
    tags: '',
    price: '',
    price_unit: 'VNĐ',
    category_id: '',
    is_featured: false,
    sort_order: '0',
  })
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<Category[]>('/service-categories').then(setCategories).catch(() => {})
    if (isEdit) {
      api.get<Record<string, unknown>>(`/services/${id}`)
        .then(data => {
          setForm({
            name: String(data.name ?? ''),
            description: String(data.description ?? ''),
            icon: String(data.icon ?? '🦷'),
            tags: String(data.tags ?? ''),
            price: String(data.price ?? ''),
            price_unit: String(data.price_unit ?? 'VNĐ'),
            category_id: String(data.category_id ?? ''),
            is_featured: Boolean(data.is_featured),
            sort_order: String(data.sort_order ?? '0'),
          })
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [id, isEdit])

  function set(key: string, val: string | boolean) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name) { setError('Tên dịch vụ là bắt buộc.'); return }
    setSaving(true); setError('')
    try {
      const payload = { ...form, category_id: form.category_id ? Number(form.category_id) : null, sort_order: Number(form.sort_order), is_featured: form.is_featured ? 1 : 0 }
      if (isEdit) {
        await api.put(`/services/${id}`, payload)
      } else {
        await api.post('/services', payload)
      }
      navigate('/services')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}</div>
          <div className="page-sub"><Link to="/services" style={{ color: 'var(--accent)' }}>← Danh sách dịch vụ</Link></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="svc-icon" className="form-label">Icon</label>
                <input id="svc-icon" type="text" className="form-control" value={form.icon} onChange={e => set('icon', e.target.value)} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="svc-name" className="form-label">Tên dịch vụ <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input id="svc-name" type="text" className="form-control" placeholder="Khám định kỳ" value={form.name} onChange={e => set('name', e.target.value)} required />
              </div>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="svc-desc" className="form-label">Mô tả</label>
              <textarea id="svc-desc" className="form-control" rows={3} value={form.description} onChange={e => set('description', e.target.value)} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="svc-tags" className="form-label">Tags (phân cách bằng |)</label>
              <input id="svc-tags" type="text" className="form-control" placeholder="6 tháng/lần|Không đau" value={form.tags} onChange={e => set('tags', e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="svc-price" className="form-label">Giá</label>
                <input id="svc-price" type="text" className="form-control" placeholder="200.000đ" value={form.price} onChange={e => set('price', e.target.value)} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="svc-price-unit" className="form-label">Đơn vị giá</label>
                <input id="svc-price-unit" type="text" className="form-control" placeholder="VNĐ / lần" value={form.price_unit} onChange={e => set('price_unit', e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="svc-cat" className="form-label">Nhóm dịch vụ</label>
                <select id="svc-cat" className="form-control" value={form.category_id} onChange={e => set('category_id', e.target.value)}>
                  <option value="">Không thuộc nhóm</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="svc-order" className="form-label">Thứ tự</label>
                <input id="svc-order" type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', e.target.value)} />
              </div>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} />
                <span className="form-label" style={{ margin: 0 }}>Dịch vụ nổi bật</span>
              </label>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className="btn-accent" disabled={saving}>
            {saving ? 'Đang lưu...' : isEdit ? '💾 Lưu thay đổi' : '+ Thêm dịch vụ'}
          </button>
          <Link to="/services" className="btn-ghost">Hủy</Link>
        </div>
      </form>
    </div>
  )
}
