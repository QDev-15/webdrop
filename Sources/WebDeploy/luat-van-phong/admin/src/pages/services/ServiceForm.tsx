import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface ServiceData { id?: number; name: string; tag: string; description: string; content: string; sort_order: number; status: string; items: string[] }

export default function ServiceForm() {
  const { id } = useParams()
  const nav = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState<ServiceData>({ name: '', tag: '', description: '', content: '', sort_order: 0, status: 'published', items: [] })
  const [newItem, setNewItem] = useState('')
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<ServiceData & { id: number }>(`/services/${id}`).then(s => {
        setForm({ name: s.name, tag: s.tag || '', description: s.description || '', content: s.content || '', sort_order: s.sort_order || 0, status: s.status, items: s.items || [] })
      }).catch(() => {})
    }
  }, [id, isEdit])

  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  function addItem() {
    if (!newItem.trim()) return
    setForm(f => ({ ...f, items: [...f.items, newItem.trim()] }))
    setNewItem('')
  }

  function removeItem(i: number) {
    setForm(f => ({ ...f, items: f.items.filter((_, j) => j !== i) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name) { setAlert('Tên lĩnh vực không được để trống'); return }
    setSaving(true); setAlert('')
    try {
      if (isEdit) await api.put(`/services/${id}`, form)
      else        await api.post('/services', form)
      nav('/services')
    } catch (err: unknown) {
      setAlert(err instanceof Error ? err.message : 'Lỗi khi lưu')
    } finally { setSaving(false) }
  }

  return (
    <>
      <div className="page-hdr"><h1>{isEdit ? 'Sửa Lĩnh Vực' : 'Thêm Lĩnh Vực'}</h1></div>
      {alert && <div className="alert alert-error">{alert}</div>}
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tên lĩnh vực *</label>
              <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Tag (tiếng Anh)</label>
              <input className="form-input" value={form.tag} onChange={e => set('tag', e.target.value)} placeholder="Corporate & M&A" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả ngắn</label>
            <textarea className="form-textarea" value={form.description} onChange={e => set('description', e.target.value)} rows={3} />
          </div>
          <div className="form-group">
            <label className="form-label">Các dịch vụ trong lĩnh vực</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
              {form.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ flex: 1, fontSize: '13px', padding: '7px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px' }}>{item}</span>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => removeItem(i)}>×</button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input className="form-input" value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="Thêm dịch vụ..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem())} />
              <button type="button" className="btn btn-ghost" onClick={addItem}>Thêm</button>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input className="form-input" type="number" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
            <button type="button" className="btn btn-ghost" onClick={() => nav('/services')}>Hủy</button>
          </div>
        </form>
      </div>
    </>
  )
}
