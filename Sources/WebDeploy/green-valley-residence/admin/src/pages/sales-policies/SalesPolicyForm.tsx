import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface FormData { icon: string; title: string; description: string; sort_order: number }
const empty: FormData = { icon: '💸', title: '', description: '', sort_order: 0 }

export default function SalesPolicyForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<FormData>(empty)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api.get<FormData & { id: number }>(`/sales-policies/${id}`)
      .then(d => setForm({ icon: d.icon || '💸', title: d.title, description: d.description ?? '', sort_order: d.sort_order ?? 0 }))
      .catch(() => setError('Không tìm thấy chính sách.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof FormData>(k: K, v: FormData[K]) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) { setError('Tiêu đề chính sách là bắt buộc.'); return }
    setSaving(true)
    try {
      if (isEdit) await api.put(`/sales-policies/${id}`, form)
      else await api.post('/sales-policies', form)
      navigate('/sales-policies')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 560 }}>
      <div className="page-header">
        <div className="page-title">{isEdit ? 'Chỉnh sửa chính sách' : 'Thêm chính sách mới'}</div>
        <button onClick={() => navigate('/sales-policies')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Icon (emoji)</label>
          <input type="text" className="form-control" value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="💸" style={{ maxWidth: 100 }} />
        </div>
        <div className="form-group">
          <label className="form-label">Tiêu đề *</label>
          <input type="text" className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Vd: Chiết khấu 8%" required />
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả</label>
          <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Vd: Áp dụng khi thanh toán sớm 95% giá trị Hợp đồng mua bán." />
        </div>
        <div className="form-group">
          <label className="form-label">Thứ tự hiển thị</label>
          <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/sales-policies')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
