import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Review {
  id: number
  product_id: number
  product_name: string
  author_name: string
  rating: number
  variant_note: string
  review_date: string
  content: string
}

export default function ProductReviewList() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get<Review[]>('/product-reviews')
      .then(setReviews)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Xóa đánh giá của "${name}"?`)) return
    await api.post(`/product-reviews/${id}/delete`, {})
    load()
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Đánh giá sản phẩm</h1>
          <p className="admin-page-sub">Đánh giá hiển thị ở tab "Đánh giá" trên trang chi tiết sản phẩm — điểm trung bình tự tính lại mỗi khi thêm/sửa/xóa</p>
        </div>
        <Link to="/product-reviews/new" className="btn btn-primary">+ Thêm đánh giá</Link>
      </div>

      {loading ? <div className="admin-loading-box">Đang tải...</div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Khách hàng</th>
                <th>Sao</th>
                <th>Biến thể mua</th>
                <th>Ngày</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#aaa' }}>Chưa có đánh giá nào</td></tr>
              ) : reviews.map(r => (
                <tr key={r.id}>
                  <td>{r.product_name ?? '—'}</td>
                  <td><strong>{r.author_name}</strong></td>
                  <td>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</td>
                  <td>{r.variant_note || '—'}</td>
                  <td>{r.review_date || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/product-reviews/${r.id}/edit`} className="btn btn-sm btn-outline">Sửa</Link>
                      <button onClick={() => handleDelete(r.id, r.author_name)} className="btn btn-sm btn-danger">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
