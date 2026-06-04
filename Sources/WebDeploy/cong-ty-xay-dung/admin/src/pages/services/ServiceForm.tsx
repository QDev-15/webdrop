import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../../api/client'

interface ServiceData {
  name: string
  number: string
  description: string
  content: string
  icon_svg: string
  image: string
  anchor_id: string
  featured: number
  sort_order: number
  status: string
}

const empty: ServiceData = {
  name: '', number: '', description: '', content: '',
  icon_svg: '', image: '', anchor_id: '', featured: 0, sort_order: 0, status: 'published',
}

export default function ServiceForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [data, setData] = useState<ServiceData>(empty)
  const [loading, setLoading] = useState(false)
  const [saveErr, setSaveErr] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<ServiceData>(`/services/${id}`).then(s => setData(s)).catch(() => navigate('/services'))
    }
  }, [id, isEdit, navigate])

  const f = (field: keyof ServiceData) => ({
    value: String(data[field]),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setData(p => ({ ...p, [field]: e.target.value })),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveErr('')
    setLoading(true)
    try {
      if (isEdit) {
        await api.put(`/services/${id}`, data)
      } else {
        await api.post('/services', data)
      }
      navigate('/services')
    } catch (err) {
      setSaveErr(err instanceof Error ? err.message : 'Lỗi lưu dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Link to="/services" className="btn btn-ghost btn-sm">← Quay lại</Link>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>{isEdit ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}</h1>
      </div>

      {saveErr && <div className="alert alert-error">{saveErr}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-2" style={{ gap: 24 }}>
          <div className="card">
            <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Thông tin cơ bản</h2>
            <div className="form-group">
              <label className="form-label">Tên dịch vụ *</label>
              <input className="form-input" required {...f('name')} />
            </div>
            <div className="form-group">
              <label className="form-label">Số thứ tự hiển thị (01, 02...)</label>
              <input className="form-input" placeholder="01" {...f('number')} />
            </div>
            <div className="form-group">
              <label className="form-label">Mô tả ngắn</label>
              <textarea className="form-textarea" rows={3} {...f('description')} />
            </div>
            <div className="form-group">
              <label className="form-label">Nội dung chi tiết</label>
              <textarea className="form-textarea" rows={6} {...f('content')} />
            </div>
          </div>

          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Hình ảnh & Icon</h2>
              <div className="form-group">
                <label className="form-label">URL ảnh đại diện</label>
                <input className="form-input" placeholder="https://..." {...f('image')} />
              </div>
              {data.image && <img src={data.image} className="img-preview" style={{ marginTop: 8, width: '100%', height: 140, borderRadius: 6 }} alt="" />}
              <div className="form-group" style={{ marginTop: 12 }}>
                <label className="form-label">Icon SVG path (d attribute)</label>
                <textarea className="form-textarea" rows={3} placeholder='<path d="M3 9l9-7..."/>' {...f('icon_svg')} />
              </div>
            </div>

            <div className="card" style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Cài đặt</h2>
              <div className="form-group">
                <label className="form-label">Anchor ID (cho link trang dịch vụ)</label>
                <input className="form-input" placeholder="dan-dung" {...f('anchor_id')} />
              </div>
              <div className="form-group">
                <label className="form-label">Thứ tự sắp xếp</label>
                <input className="form-input" type="number" min={0} {...f('sort_order')} />
              </div>
              <div className="form-group">
                <label className="form-label">Trạng thái</label>
                <select className="form-select" {...f('status')}>
                  <option value="published">Hiển thị</option>
                  <option value="draft">Nháp</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" id="featured" checked={!!data.featured}
                  onChange={e => setData(p => ({ ...p, featured: e.target.checked ? 1 : 0 }))} />
                <label htmlFor="featured" style={{ fontSize: 13, cursor: 'pointer' }}>Dịch vụ nổi bật (hiển thị trang chủ)</label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
                {loading ? 'Đang lưu...' : 'Lưu dịch vụ'}
              </button>
              <Link to="/services" className="btn btn-ghost">Hủy</Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
