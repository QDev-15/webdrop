import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Color {
  id: number
  name: string
  hex: string
  sort_order: number
}

export default function ColorList() {
  const [colors, setColors] = useState<Color[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get<Color[]>('/product-colors')
      .then(setColors)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Xóa màu "${name}"? Các sản phẩm đang dùng màu này sẽ không bị ảnh hưởng.`)) return
    await api.post(`/product-colors/${id}/delete`, {})
    load()
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Màu sắc sản phẩm</h1>
          <p className="admin-page-sub">Định nghĩa các màu dùng cho bộ lọc và chọn màu khi nhập sản phẩm</p>
        </div>
        <Link to="/colors/new" className="btn btn-primary">+ Thêm màu</Link>
      </div>

      {loading ? <div className="admin-loading-box">Đang tải...</div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>Màu</th>
                <th>Tên màu</th>
                <th>Mã Hex</th>
                <th style={{ width: 80 }}>Thứ tự</th>
                <th style={{ width: 120 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {colors.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#aaa', padding: '32px 0' }}>
                    Chưa có màu nào — hãy thêm màu đầu tiên
                  </td>
                </tr>
              ) : colors.map(c => (
                <tr key={c.id}>
                  <td>
                    <span style={{
                      display: 'inline-block', width: 32, height: 32, borderRadius: '50%',
                      background: c.hex,
                      border: c.hex.toLowerCase() === '#ffffff' || c.hex.toLowerCase() === '#fff'
                        ? '1.5px solid #ddd' : '2px solid rgba(0,0,0,.08)',
                      boxShadow: '0 1px 4px rgba(0,0,0,.1)',
                    }} title={c.hex} />
                  </td>
                  <td><strong>{c.name}</strong></td>
                  <td>
                    <code style={{ fontSize: 13, background: '#f5f0e8', padding: '2px 8px', borderRadius: 4 }}>
                      {c.hex}
                    </code>
                  </td>
                  <td>{c.sort_order}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/colors/${c.id}/edit`} className="btn btn-sm btn-outline">Sửa</Link>
                      <button onClick={() => handleDelete(c.id, c.name)} className="btn btn-sm btn-danger">Xóa</button>
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
