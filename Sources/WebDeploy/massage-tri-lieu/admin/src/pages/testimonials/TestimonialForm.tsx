import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Testimonial {
  id: number; author_name: string; author_info: string
  author_avatar: string; content: string; rating: number; sort_order: number; active: number
}

export default function TestimonialForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState({ author_name: '', author_info: '', author_avatar: '', content: '', rating: 5, sort_order: 0, active: 1 })
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<Testimonial[]>('/testimonials').then(list => {
      const found = list.find(t => t.id === +id!)
      if (found) setForm({ author_name: found.author_name, author_info: found.author_info, author_avatar: found.author_avatar, content: found.content, rating: found.rating, sort_order: found.sort_order, active: found.active })
    }).catch(() => {}).finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (key: string, val: unknown) => setForm(f => ({ ...f, [key]: val }))

  const handleSave = async () => {
    if (!form.author_name) { setMsg('Vui lòng nhập tên tác giả.'); return }
    setSaving(true); setMsg('')
    try {
      if (isEdit) { await api.put(`/testimonials/${id}`, form) }
      else { await api.post('/testimonials', form) }
      navigate('/testimonials')
    } catch (e) { setMsg(e instanceof Error ? e.message : 'Lỗi lưu'); setSaving(false) }
  }

  if (loading) return <div style={{ color: 'var(--text-3)', padding: 20 }}>Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">{isEdit ? 'Sửa đánh giá' : 'Thêm đánh giá mới'}</div></div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-ghost" onClick={() => navigate('/testimonials')}>Hủy</button>
          <button className="btn-accent" onClick={handleSave} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
        </div>
      </div>

      {msg && <div style={{ padding: '10px 16px', borderRadius: 8, marginBottom: 16, fontSize: 13, background: '#fff0f0', color: 'var(--danger)', border: '1px solid #fdd' }}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, maxWidth: 800 }}>
        <div className="card">
          {[
            { key: 'author_name', label: 'Tên tác giả *' },
            { key: 'author_info', label: 'Chức danh / Mô tả (ví dụ: Kỹ sư, TP.HCM)' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>{f.label}</label>
              <input type="text" value={(form as any)[f.key] ?? ''} onChange={e => set(f.key, e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13.5, fontFamily: 'var(--sans)', outline: 'none' }} />
            </div>
          ))}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Nội dung đánh giá</label>
            <textarea value={form.content} onChange={e => set('content', e.target.value)} rows={5}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13.5, fontFamily: 'var(--sans)', resize: 'vertical', outline: 'none' }} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 14 }}>Ảnh đại diện</div>
            <ImageField value={form.author_avatar} onChange={v => set('author_avatar', v)} placeholder="URL ảnh đại diện" />
          </div>
          <div className="card">
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Điểm đánh giá (1-5)</label>
              <select value={form.rating} onChange={e => set('rating', +e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13.5, fontFamily: 'var(--sans)' }}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} sao {'★'.repeat(n)}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Thứ tự</label>
              <input type="number" value={form.sort_order} onChange={e => set('sort_order', +e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13.5, fontFamily: 'var(--sans)', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Trạng thái</label>
              <select value={form.active} onChange={e => set('active', +e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13.5, fontFamily: 'var(--sans)' }}>
                <option value={1}>Hiện thị</option>
                <option value={0}>Ẩn</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
