import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface Product { id: number; name: string }
interface FormData {
  product_id: string
  author_name: string
  rating: string
  variant_note: string
  review_date: string
  content: string
}

const EMPTY: FormData = {
  product_id: '', author_name: '', rating: '5', variant_note: '',
  review_date: new Date().toISOString().slice(0, 10), content: '',
}

export default function ProductReviewForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProducts = api.get<Product[]>('/products')
    const fetchReview = isEdit
      ? api.get<Record<string, unknown>>(`/product-reviews/${id}`)
      : Promise.resolve(null)

    Promise.all([fetchProducts, fetchReview]).then(([products, r]) => {
      setProducts(products)
      if (r) {
        setForm({
          product_id: String(r.product_id ?? ''),
          author_name: String(r.author_name ?? ''),
          rating: String(r.rating ?? '5'),
          variant_note: String(r.variant_note ?? ''),
          review_date: String(r.review_date ?? ''),
          content: String(r.content ?? ''),
        })
      }
    }).catch(() => setError('Không tải được dữ liệu'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.product_id) { setError('Vui lòng chọn sản phẩm'); return }
    if (!form.author_name.trim()) { setError('Tên khách hàng không được để trống'); return }
    if (!form.content.trim()) { setError('Nội dung đánh giá không được để trống'); return }
    setSaving(true); setError('')
    const payload = { ...form, product_id: Number(form.product_id), rating: Number(form.rating) || 5 }
    try {
      if (isEdit) {
        await api.post(`/product-reviews/${id}/update`, payload)
      } else {
        await api.post('/product-reviews', payload)
      }
      navigate('/product-reviews')
    } catch {
      setError('Lưu thất bại, vui lòng thử lại')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading-box">Đang tải...</div>

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">{isEdit ? 'Sửa đánh giá' : 'Thêm đánh giá mới'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {error && <div className="form-error-banner">{error}</div>}

        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label>Sản phẩm <span className="req">*</span></label>
            <select value={form.product_id} onChange={e => set('product_id', e.target.value)}>
              <option value="">-- Chọn sản phẩm --</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Số sao</label>
            <select value={form.rating} onChange={e => set('rating', e.target.value)}>
              {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} sao {'★'.repeat(n)}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Tên khách hàng <span className="req">*</span></label>
            <input type="text" value={form.author_name} onChange={e => set('author_name', e.target.value)} placeholder="VD: Nguyễn Thị An" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Biến thể đã mua</label>
            <input type="text" value={form.variant_note} onChange={e => set('variant_note', e.target.value)} placeholder="VD: Size M — Màu Trắng" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Ngày đánh giá</label>
            <input type="date" value={form.review_date} onChange={e => set('review_date', e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label>Nội dung đánh giá <span className="req">*</span></label>
          <textarea rows={4} value={form.content} onChange={e => set('content', e.target.value)} placeholder="Nhập nội dung đánh giá của khách hàng..." />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/product-reviews')}>Hủy</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
        </div>
      </form>
    </div>
  )
}
