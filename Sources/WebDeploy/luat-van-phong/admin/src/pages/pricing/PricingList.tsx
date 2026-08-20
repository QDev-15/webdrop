import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface PricingPlan {
  id: number; name: string; price: string; description: string; features: string
  is_featured: number; cta_text: string; cta_link: string; sort_order: number; status: string
}

const DEFAULT_FORM = {
  name: '', price: '', description: '', features: '',
  is_featured: 0, cta_text: 'Nhận báo giá', cta_link: '/lien-he', sort_order: 0, status: 'published',
}

export default function PricingList() {
  const [items, setItems] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<PricingPlan[]>('/pricing-plans')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa gói giá này?')) return
    await api.delete(`/pricing-plans/${id}`)
    load()
  }

  function startAdd() {
    setEditId(null)
    setForm({ ...DEFAULT_FORM, sort_order: items.length + 1 })
    setAlert('')
  }

  function startEdit(p: PricingPlan) {
    setEditId(p.id)
    setForm({
      name: p.name, price: p.price, description: p.description || '', features: p.features || '',
      is_featured: p.is_featured || 0, cta_text: p.cta_text || 'Nhận báo giá', cta_link: p.cta_link || '/lien-he',
      sort_order: p.sort_order || 0, status: p.status,
    })
    setAlert('')
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.price) { setAlert('Tên gói và mức giá không được để trống'); return }
    setSaving(true)
    try {
      if (editId) await api.put(`/pricing-plans/${editId}`, form)
      else        await api.post('/pricing-plans', form)
      setEditId(null); load(); setAlert('')
    } catch (err: unknown) {
      setAlert(err instanceof Error ? err.message : 'Lỗi khi lưu')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="loading">Đang tải...</div>

  return (
    <>
      <div className="page-hdr">
        <h1>Bảng giá dịch vụ</h1>
        <button className="btn btn-primary" onClick={startAdd}>+ Thêm gói giá</button>
      </div>

      <div className="form-card" style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>{editId ? 'Sửa gói giá' : 'Thêm gói giá mới'}</h3>
        {alert && <div className="alert alert-error">{alert}</div>}
        <form onSubmit={handleSave}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tên gói *</label>
              <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Tư Vấn Theo Giờ" required />
            </div>
            <div className="form-group">
              <label className="form-label">Mức giá *</label>
              <input className="form-input" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="Từ 800.000đ /giờ" required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả ngắn</label>
            <textarea className="form-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
          </div>
          <div className="form-group">
            <label className="form-label">Danh sách quyền lợi (mỗi dòng 1 mục)</label>
            <textarea className="form-textarea" value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} rows={5} placeholder={'Tư vấn trực tiếp hoặc trực tuyến\nRà soát văn bản, hợp đồng đơn giản'} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Text nút CTA</label>
              <input className="form-input" value={form.cta_text} onChange={e => setForm(f => ({ ...f, cta_text: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Link nút CTA</label>
              <input className="form-input" value={form.cta_link} onChange={e => setForm(f => ({ ...f, cta_link: e.target.value }))} placeholder="/lien-he" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nổi bật (Phổ Biến Nhất)</label>
              <select className="form-select" value={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: Number(e.target.value) }))}>
                <option value={0}>Không</option>
                <option value={1}>Có</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input className="form-input" type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : (editId ? 'Cập nhật' : 'Thêm')}</button>
            {editId && <button type="button" className="btn btn-ghost" onClick={() => setEditId(null)}>Hủy</button>}
          </div>
        </form>
      </div>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Tên gói</th><th>Giá</th><th>Nổi bật</th><th>Thứ tự</th><th>Trạng thái</th><th>Thao tác</th></tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td style={{ fontWeight: 500 }}>{item.name}</td>
                <td style={{ color: 'var(--text-2)', fontSize: '12px' }}>{item.price}</td>
                <td>{Number(item.is_featured) === 1 ? 'Có' : '—'}</td>
                <td>{item.sort_order}</td>
                <td><span className={`badge badge-${item.status}`}>{item.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => startEdit(item)}>Sửa</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
