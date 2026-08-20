import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

const CATEGORIES = ['Luật Doanh Nghiệp', 'Tranh Tụng', 'Bất Động Sản', 'Luật Lao Động', 'Hình Sự Kinh Tế', 'Sở Hữu Trí Tuệ']

interface CaseData {
  title: string; category: string; summary: string; outcome: string; year: number; location: string; sort_order: number; status: string
  client_name: string; practice_area: string; duration_text: string; scope_text: string; result_headline: string
  challenge: string; solution: string; gallery_images: string; stats: string
  testimonial_content: string; testimonial_author: string; testimonial_title: string
}

const DEFAULT: CaseData = {
  title: '', category: '', summary: '', outcome: '', year: new Date().getFullYear(), location: '', sort_order: 0, status: 'published',
  client_name: '', practice_area: '', duration_text: '', scope_text: '', result_headline: '',
  challenge: '', solution: '', gallery_images: '', stats: '',
  testimonial_content: '', testimonial_author: '', testimonial_title: '',
}

export default function CaseForm() {
  const { id } = useParams()
  const nav = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState<CaseData>(DEFAULT)
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<CaseData & { id: number; slug?: string }>(`/cases/${id}`).then(c => {
        setForm({
          title: c.title, category: c.category || '', summary: c.summary || '', outcome: c.outcome || '',
          year: c.year || new Date().getFullYear(), location: c.location || '', sort_order: c.sort_order || 0, status: c.status,
          // Cột case-study có thể là NULL (case seed từ trước hoặc chưa từng điền) — ép về '' để input luôn controlled
          client_name: c.client_name || '',
          practice_area: c.practice_area || '',
          duration_text: c.duration_text || '',
          scope_text: c.scope_text || '',
          result_headline: c.result_headline || '',
          challenge: c.challenge || '',
          solution: c.solution || '',
          gallery_images: c.gallery_images || '',
          stats: c.stats || '',
          testimonial_content: c.testimonial_content || '',
          testimonial_author: c.testimonial_author || '',
          testimonial_title: c.testimonial_title || '',
        })
      }).catch(() => {})
    }
  }, [id, isEdit])

  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title) { setAlert('Tiêu đề không được để trống'); return }
    setSaving(true); setAlert('')
    try {
      if (isEdit) await api.put(`/cases/${id}`, form)
      else        await api.post('/cases', form)
      nav('/cases')
    } catch (err: unknown) {
      setAlert(err instanceof Error ? err.message : 'Lỗi khi lưu')
    } finally { setSaving(false) }
  }

  return (
    <>
      <div className="page-hdr"><h1>{isEdit ? 'Sửa Vụ Việc' : 'Thêm Vụ Việc'}</h1></div>
      {alert && <div className="alert alert-error">{alert}</div>}
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tiêu đề vụ việc *</label>
            <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Danh mục</label>
              <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
                <option value="">-- Chọn danh mục --</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Năm</label>
              <input className="form-input" type="number" value={form.year} onChange={e => set('year', Number(e.target.value))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Địa điểm / Tòa án</label>
            <input className="form-input" value={form.location} onChange={e => set('location', e.target.value)} placeholder="Tòa án TP.HCM" />
          </div>
          <div className="form-group">
            <label className="form-label">Tóm tắt vụ việc</label>
            <textarea className="form-textarea" value={form.summary} onChange={e => set('summary', e.target.value)} rows={5} />
          </div>
          <div className="form-group">
            <label className="form-label">Kết quả</label>
            <textarea className="form-textarea" value={form.outcome} onChange={e => set('outcome', e.target.value)} rows={3} />
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

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '20px 0 16px' }} />
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Case Study — Trang chi tiết vụ việc</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '16px' }}>
            Điền các mục dưới đây để trang chi tiết vụ việc (bấm vào card ở trang Vụ Việc) hiển thị đầy đủ case study — bỏ trống thì trang chi tiết chỉ hiển thị overview cơ bản.
          </p>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Thân chủ</label>
              <input className="form-input" value={form.client_name} onChange={e => set('client_name', e.target.value)} placeholder="Nhóm cổ đông thiểu số (giấu tên theo bảo mật nghề nghiệp)" />
            </div>
            <div className="form-group">
              <label className="form-label">Lĩnh vực pháp lý (overview bar)</label>
              <input className="form-input" value={form.practice_area} onChange={e => set('practice_area', e.target.value)} placeholder="M&A & Quản trị doanh nghiệp" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Thời gian xử lý (overview bar)</label>
              <input className="form-input" value={form.duration_text} onChange={e => set('duration_text', e.target.value)} placeholder="5 tháng" />
            </div>
            <div className="form-group">
              <label className="form-label">Phạm vi công việc (overview bar)</label>
              <input className="form-input" value={form.scope_text} onChange={e => set('scope_text', e.target.value)} placeholder="Tư vấn chiến lược, đàm phán, tố tụng khẩn cấp" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Kết quả chính (overview bar)</label>
            <input className="form-input" value={form.result_headline} onChange={e => set('result_headline', e.target.value)} placeholder="+40% giá mua lại cổ phần" />
          </div>
          <div className="form-group">
            <label className="form-label">Bối cảnh &amp; Thách thức</label>
            <textarea className="form-textarea" value={form.challenge} onChange={e => set('challenge', e.target.value)} rows={4} placeholder="Đoạn văn mô tả tình huống thực tế của thân chủ trước khi hợp tác... (cách nhau 1 dòng trống để xuống đoạn mới)" />
          </div>
          <div className="form-group">
            <label className="form-label">Chiến lược / Giải pháp pháp lý</label>
            <textarea className="form-textarea" value={form.solution} onChange={e => set('solution', e.target.value)} rows={5} placeholder={'Đoạn mô tả chung...\n\n- Đầu việc 1 — mô tả\n- Đầu việc 2 — mô tả\n(mỗi đoạn cách nhau 1 dòng trống; đoạn toàn dòng bắt đầu bằng "-" sẽ hiển thị dạng danh sách)'} />
          </div>
          <div className="form-group">
            <label className="form-label">Ảnh gallery (mỗi dòng 1 link ảnh, tối thiểu 3 ảnh)</label>
            <textarea className="form-textarea" value={form.gallery_images} onChange={e => set('gallery_images', e.target.value)} rows={3} placeholder={'https://...anh-1.jpg\nhttps://...anh-2.jpg\nhttps://...anh-3.jpg'} />
          </div>
          <div className="form-group">
            <label className="form-label">Số liệu kết quả (mỗi dòng: giá trị|hậu tố|nhãn)</label>
            <textarea className="form-textarea" value={form.stats} onChange={e => set('stats', e.target.value)} rows={4} placeholder={'40|%|Tăng giá mua lại cổ phần\n5| tháng|Thời gian xử lý toàn bộ vụ việc\n100|%|Quyền biểu quyết được bảo toàn'} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Testimonial — Tên người phát biểu</label>
              <input className="form-input" value={form.testimonial_author} onChange={e => set('testimonial_author', e.target.value)} placeholder="Đại diện nhóm cổ đông thiểu số" />
            </div>
            <div className="form-group">
              <label className="form-label">Testimonial — Chức danh · Vụ việc</label>
              <input className="form-input" value={form.testimonial_title} onChange={e => set('testimonial_title', e.target.value)} placeholder="Thương vụ M&A tập đoàn bán lẻ — 2023" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Testimonial — Nội dung</label>
            <textarea className="form-textarea" value={form.testimonial_content} onChange={e => set('testimonial_content', e.target.value)} rows={3} placeholder="Trích dẫn đánh giá của thân chủ về vụ việc này..." />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
            <button type="button" className="btn btn-ghost" onClick={() => nav('/cases')}>Hủy</button>
          </div>
        </form>
      </div>
    </>
  )
}
