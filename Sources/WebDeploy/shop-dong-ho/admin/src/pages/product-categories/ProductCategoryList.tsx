import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Category {
  id: number
  name: string
  slug: string
  image: string
  sort_order: number
  product_count: number
}

export default function ProductCategoryList() {
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get<Category[]>('/product-categories')
      .then(setCats)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Xóa danh mục "${name}"?`)) return
    await api.post(`/product-categories/${id}/delete`, {})
    load()
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Danh mục sản phẩm</h1>
          <p className="admin-page-sub">Quản lý các danh mục sản phẩm của cửa hàng</p>
        </div>
        <Link to="/product-categories/new" className="btn btn-primary">+ Thêm danh mục</Link>
      </div>

      {loading ? <div className="admin-loading-box">Đang tải...</div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên danh mục</th>
                <th>Slug</th>
                <th>Số sản phẩm</th>
                <th>Thứ tự</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {cats.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#aaa' }}>Chưa có danh mục nào</td></tr>
              ) : cats.map(cat => (
                <tr key={cat.id}>
                  <td>
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} />
                    ) : (
                      <div style={{ width: 48, height: 48, background: '#f0ebe3', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📂</div>
                    )}
                  </td>
                  <td><strong>{cat.name}</strong></td>
                  <td><code style={{ fontSize: 12 }}>{cat.slug}</code></td>
                  <td>{cat.product_count ?? 0}</td>
                  <td>{cat.sort_order}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/product-categories/${cat.id}/edit`} className="btn btn-sm btn-outline">Sửa</Link>
                      <button onClick={() => handleDelete(cat.id, cat.name)} className="btn btn-sm btn-danger">Xóa</button>
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
