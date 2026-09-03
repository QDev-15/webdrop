import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Collection {
  id: number
  name: string
  slug: string
  description: string
  image: string
  sort_order: number
  product_count: number
}

export default function CollectionList() {
  const [items, setItems] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get<Collection[]>('/collections')
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Xóa bộ sưu tập "${name}"?`)) return
    await api.post(`/collections/${id}/delete`, {})
    load()
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Bộ sưu tập</h1>
          <p className="admin-page-sub">Quản lý các bộ sưu tập phong cách nội thất (trang "Bộ sưu tập")</p>
        </div>
        <Link to="/collections/new" className="btn btn-primary">+ Thêm bộ sưu tập</Link>
      </div>

      {loading ? <div className="admin-loading-box">Đang tải...</div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên bộ sưu tập</th>
                <th>Slug</th>
                <th>Số sản phẩm</th>
                <th>Thứ tự</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#aaa' }}>Chưa có bộ sưu tập nào</td></tr>
              ) : items.map(item => (
                <tr key={item.id}>
                  <td>
                    {item.image ? (
                      <img src={item.image} alt={item.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} />
                    ) : (
                      <div style={{ width: 48, height: 48, background: '#f0ebe3', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🗂</div>
                    )}
                  </td>
                  <td><strong>{item.name}</strong></td>
                  <td><code style={{ fontSize: 12 }}>{item.slug}</code></td>
                  <td>{item.product_count ?? 0}</td>
                  <td>{item.sort_order}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/collections/${item.id}/edit`} className="btn btn-sm btn-outline">Sửa</Link>
                      <button onClick={() => handleDelete(item.id, item.name)} className="btn btn-sm btn-danger">Xóa</button>
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
