import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface Slide {
  title: string; subtitle: string; badge_text: string
  button_text: string; button_link: string; button2_text: string; button2_link: string
  image: string; stat1_num: string; stat1_label: string; stat2_num: string; stat2_label: string
  stat3_num: string; stat3_label: string; sort_order: number; status: string
}

const EMPTY: Slide = {
  title: '', subtitle: '', badge_text: '',
  button_text: '', button_link: '', button2_text: '', button2_link: '',
  image: '', stat1_num: '', stat1_label: '', stat2_num: '', stat2_label: '',
  stat3_num: '', stat3_label: '', sort_order: 0, status: 'published',
}

export default function SlideForm() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const isEdit    = Boolean(id)
  const [form, setForm]     = useState<Slide>(EMPTY)
  const [error, setError]   = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    api.get<Slide & { id: number }>(`/hero-slides/${id}`).then(s => setForm(s)).catch(() => {})
  }, [id, isEdit])

  const set = (k: keyof Slide, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const save = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (isEdit) await api.put(`/hero-slides/${id}`, form)
      else await api.post('/hero-slides', form)
      navigate('/slides')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi lưu dữ liệu.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="page-hd">
        <h1 className="page-hd-title">{isEdit ? 'Chỉnh sửa Slide' : 'Thêm Slide mới'}</h1>
        <button onClick={() => navigate('/slides')} className="btn btn-ghost">← Quay lại</button>
      </div>

      <div className="card">
        {error && <div className="login-err">{error}</div>}
        <form onSubmit={save}>
          <div className="form-group">
            <label className="form-label">Tiêu đề <span className="text-danger">*</span></label>
            <input className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Chúng tôi tạo ra <em>kết quả</em> thực sự." required />
            <div className="form-hint">Hỗ trợ HTML: dùng &lt;em&gt; cho chữ nghiêng màu xanh</div>
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả phụ</label>
            <textarea className="form-control" value={form.subtitle} onChange={e => set('subtitle', e.target.value)} rows={3} />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Badge text</label>
              <input className="form-control" value={form.badge_text} onChange={e => set('badge_text', e.target.value)} placeholder="Đối tác chiến lược..." />
            </div>
            <div className="form-group">
              <label className="form-label">Ảnh nền (URL)</label>
              <input className="form-control" value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Nút 1 text</label>
              <input className="form-control" value={form.button_text} onChange={e => set('button_text', e.target.value)} placeholder="Khám phá dịch vụ →" />
            </div>
            <div className="form-group">
              <label className="form-label">Nút 1 link</label>
              <input className="form-control" value={form.button_link} onChange={e => set('button_link', e.target.value)} placeholder="/dich-vu" />
            </div>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Nút 2 text</label>
              <input className="form-control" value={form.button2_text} onChange={e => set('button2_text', e.target.value)} placeholder="Xem dự án" />
            </div>
            <div className="form-group">
              <label className="form-label">Nút 2 link</label>
              <input className="form-control" value={form.button2_link} onChange={e => set('button2_link', e.target.value)} placeholder="/du-an" />
            </div>
          </div>

          <hr className="section-sep" />
          <div style={{ marginBottom: '12px', fontWeight: 600, fontSize: '13px' }}>Thống kê (hiển thị dưới hero)</div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Stat 1 — Số</label>
              <input className="form-control" value={form.stat1_num} onChange={e => set('stat1_num', e.target.value)} placeholder="120+" />
            </div>
            <div className="form-group">
              <label className="form-label">Stat 1 — Label</label>
              <input className="form-control" value={form.stat1_label} onChange={e => set('stat1_label', e.target.value)} placeholder="Dự án hoàn thành" />
            </div>
            <div className="form-group">
              <label className="form-label">Stat 2 — Số</label>
              <input className="form-control" value={form.stat2_num} onChange={e => set('stat2_num', e.target.value)} placeholder="8 năm" />
            </div>
            <div className="form-group">
              <label className="form-label">Stat 2 — Label</label>
              <input className="form-control" value={form.stat2_label} onChange={e => set('stat2_label', e.target.value)} placeholder="Kinh nghiệm" />
            </div>
            <div className="form-group">
              <label className="form-label">Stat 3 — Số</label>
              <input className="form-control" value={form.stat3_num} onChange={e => set('stat3_num', e.target.value)} placeholder="98%" />
            </div>
            <div className="form-group">
              <label className="form-label">Stat 3 — Label</label>
              <input className="form-control" value={form.stat3_label} onChange={e => set('stat3_label', e.target.value)} placeholder="Khách hàng hài lòng" />
            </div>
          </div>

          <hr className="section-sep" />
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input className="form-control" type="number" value={form.sort_order} onChange={e => set('sort_order', +e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Tạo mới')}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/slides')}>Hủy</button>
          </div>
        </form>
      </div>
    </>
  )
}
