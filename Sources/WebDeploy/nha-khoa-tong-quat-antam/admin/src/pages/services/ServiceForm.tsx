import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface Category {
  id: number
  name: string
}

interface SvcForm {
  category_id: number | null
  number: string
  name: string
  description: string
  price: string
  price_unit: string
  is_featured: number
  sort_order: number
}

const EMPTY: SvcForm = {
  category_id: null,
  number: '', name: '', description: '',
  price: '', price_unit: '',
  is_featured: 0, sort_order: 0,
}

export default function ServiceForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<SvcForm>(EMPTY)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    api.get<Category[]>('/service-categories').then(setCategories).catch(() => {})
    if (!id) return
    api.get<SvcForm & { id: number }>(`/services/${id}`)
      .then(d => setForm({
        category_id: d.category_id,
        number: d.number ?? '',
        name: d.name ?? '',
        description: d.description ?? '',
        price: d.price ?? '',
        price_unit: d.price_unit ?? '',
        is_featured: d.is_featured ?? 0,
        sort_order: d.sort_order ?? 0,
      }))
      .catch(() => setError('Không tìm thấy dịch vụ.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof SvcForm>(k: K, v: SvcForm[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Tên dịch vụ là bắt buộc.'); return }
    setSaving(true)
    try {
      if (isEdit) {
        await api.put(`/services/${id}`, form)
      } else {
        await api.post('/services', form)
      }
      navigate('/services')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 680 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}</div>
        </div>
        <button onClick={() => navigate('/services')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="sf-cat" className="form-label">Nhóm dịch vụ</label>
            <select id="sf-cat" className="form-control"
              value={form.category_id ?? ''}
              onChange={e => set('category_id', e.target.value ? parseInt(e.target.value) : null)}>
              <option value="">— Không có nhóm —</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="sf-num" className="form-label">Số thứ tự (hiển thị)</label>
            <input id="sf-num" type="text" className="form-control" value={form.number}
              onChange={e => set('number', e.target.value)} placeholder="01, 02..." />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="sf-name" className="form-label">Tên dịch vụ *</label>
          <input id="sf-name" type="text" className="form-control" value={form.name}
            onChange={e => set('name', e.target.value)} required placeholder="Khám tổng quát & tư vấn" />
        </div>

        <div className="form-group">
          <label htmlFor="sf-desc" className="form-label">Mô tả</label>
          <textarea id="sf-desc" className="form-control" value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={3} placeholder="Mô tả ngắn về dịch vụ..." />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="sf-price" className="form-label">Giá</label>
            <input id="sf-price" type="text" className="form-control" value={form.price}
              onChange={e => set('price', e.target.value)} placeholder="Từ 200.000đ" />
          </div>
          <div className="form-group">
            <label htmlFor="sf-unit" className="form-label">Đơn vị</label>
            <input id="sf-unit" type="text" className="form-control" value={form.price_unit}
              onChange={e => set('price_unit', e.target.value)} placeholder="/ lượt, / răng, / hàm..." />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="sf-order" className="form-label">Thứ tự sắp xếp</label>
            <input id="sf-order" type="number" className="form-control" value={form.sort_order}
              onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 0 }}>
              <input type="checkbox" checked={form.is_featured === 1}
                onChange={e => set('is_featured', e.target.checked ? 1 : 0)}
                style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }} />
              Dịch vụ nổi bật
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/services')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>
            {saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}
          </button>
        </div>
      </form>
    </div>
  )
}
