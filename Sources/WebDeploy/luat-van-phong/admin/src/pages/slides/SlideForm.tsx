import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

export default function SlideForm() {
  const { id } = useParams()
  const nav = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState({ title: '', subtitle: '', button_text: '', button_link: '', image: '', sort_order: 0, status: 'published' })
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<Array<typeof form & { id: number }>>('/hero-slides').then(items => {
        const found = items.find(i => i.id === Number(id))
        if (found) setForm({ title: found.title, subtitle: found.subtitle || '', button_text: found.button_text || '', button_link: found.button_link || '', image: found.image || '', sort_order: found.sort_order || 0, status: found.status })
      }).catch(() => {})
    }
  }, [id, isEdit])

  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title) { setAlert('Tiêu đề không được để trống'); return }
    setSaving(true); setAlert('')
    try {
      if (isEdit) await api.put(`/hero-slides/${id}`, form)
      else        await api.post('/hero-slides', form)
      nav('/slides')
    } catch (err: unknown) {
      setAlert(err instanceof Error ? err.message : 'Lỗi khi lưu')
    } finally { setSaving(false) }
  }

  return (
    <>
      <div className="page-hdr">
        <h1>{isEdit ? 'Sửa Slide' : 'Thêm Slide'}</h1>
      </div>
      {alert && <div className="alert alert-error">{alert}</div>}
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tiêu đề *</label>
            <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Phụ đề</label>
            <textarea className="form-textarea" value={form.subtitle} onChange={e => set('subtitle', e.target.value)} rows={3} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Button Text</label>
              <input className="form-input" value={form.button_text} onChange={e => set('button_text', e.target.value)} placeholder="Tư Vấn Miễn Phí" />
            </div>
            <div className="form-group">
              <label className="form-label">Button Link</label>
              <input className="form-input" value={form.button_link} onChange={e => set('button_link', e.target.value)} placeholder="/lien-he" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">URL Hình ảnh</label>
            <input className="form-input" value={form.image} onChange={e => set('image', e.target.value)} />
            {form.image && <img src={form.image} alt="" style={{ marginTop: '8px', maxHeight: '120px', borderRadius: '6px' }} />}
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
            <button type="button" className="btn btn-ghost" onClick={() => nav('/slides')}>Hủy</button>
          </div>
        </form>
      </div>
    </>
  )
}
