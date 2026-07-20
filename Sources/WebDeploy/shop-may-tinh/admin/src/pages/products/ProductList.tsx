import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Product {
  id: number
  name: string
  slug: string
  category_name: string
  image: string
  price: number
  price_sale: number
  badge: string
  is_featured: number
  is_new: number
  status: string
  sort_order: number
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get<Product[]>('/products')
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Xóa sản phẩm "${name}"?`)) return
    await api.post(`/products/${id}/delete`, {})
    load()
  }

  const fmt = (n: number) => n ? n.toLocaleString('vi-VN') + 'đ' : '—'

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Sản phẩm</h1>
          <p className="admin-page-sub">Quản lý danh sách sản phẩm của cửa hàng</p>
        </div>
        <Link to="/products/new" className="btn btn-primary">+ Thêm sản phẩm</Link>
      </div>

      {loading ? <div className="admin-loading-box">Đang tải...</div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Giá sale</th>
                <th>Badge</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: '#aaa' }}>Chưa có sản phẩm nào</td></tr>
              ) : products.map(p => (
                <tr key={p.id}>
                  <td>
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} />
                    ) : (
                      <div style={{ width: 48, height: 48, background: '#f0ebe3', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛍</div>
                    )}
                  </td>
                  <td>
                    <strong>{p.name}</strong>
                    <div style={{ fontSize: 11, color: '#aaa' }}>
                      {p.is_featured ? '⭐ Nổi bật ' : ''}{p.is_new ? '🆕 Mới' : ''}
                    </div>
                  </td>
                  <td>{p.category_name ?? '—'}</td>
                  <td>{fmt(p.price)}</td>
                  <td style={{ color: p.price_sale ? 'var(--accent)' : undefined }}>{fmt(p.price_sale)}</td>
                  <td>{p.badge || '—'}</td>
                  <td>
                    <span className={`status-badge ${p.status === 'published' ? 'done' : 'brief'}`}>
                      {p.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/products/${p.id}/edit`} className="btn btn-sm btn-outline">Sửa</Link>
                      <button onClick={() => handleDelete(p.id, p.name)} className="btn btn-sm btn-danger">Xóa</button>
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
