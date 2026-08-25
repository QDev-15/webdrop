import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface UnitType {
  id: number
  name: string
  slug: string
  type_tag: string
  bedrooms: number
  bathrooms: number
  area: number
  price_from: number
  status: string
  badge: string
  floor_plan_image: string
  gallery: string[]
  is_featured: number
  sort_order: number
}

const TYPE_LABELS: Record<string, string> = { '1pn': '1PN', '2pn': '2PN', '3pn': '3PN', duplex: 'Duplex', penthouse: 'Penthouse' }
const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  'con-hang': { label: 'Còn hàng', cls: 'badge-published' },
  'sap-mo-ban': { label: 'Sắp mở bán', cls: 'badge-pending' },
  'het-hang': { label: 'Hết hàng', cls: 'badge-draft' },
}

function formatVND(v: number) {
  if (v >= 1e9) { const t = Math.round((v / 1e9) * 100) / 100; return (t % 1 === 0 ? t.toFixed(0) : t.toFixed(2).replace(/0$/, '')) + ' tỷ' }
  if (v >= 1e6) return Math.round(v / 1e6) + ' triệu'
  return v.toLocaleString('vi-VN') + ' đ'
}

export default function UnitTypeList() {
  const [items, setItems] = useState<UnitType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<UnitType[]>('/unit-types')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa loại căn hộ này?')) return
    await api.delete(`/unit-types/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Loại căn hộ</div>
          <div className="page-sub">{items.length} loại căn · {items.filter(u => u.status === 'con-hang').length} còn hàng</div>
        </div>
        <Link to="/unit-types/new" className="btn-accent">+ Thêm loại căn</Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏢</div>
          <div className="empty-state-text">Chưa có loại căn nào. Thêm loại căn đầu tiên!</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ảnh</th><th>Tên loại căn</th><th>Loại</th><th>DT / PN</th><th>Giá từ</th><th>Tình trạng</th><th>Nổi bật</th><th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map(u => (
                <tr key={u.id}>
                  <td>{u.gallery?.[0] ? <img src={u.gallery[0]} alt={u.name} className="thumb" /> : '—'}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{u.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>/{u.slug}</div>
                  </td>
                  <td>{TYPE_LABELS[u.type_tag] ?? u.type_tag}</td>
                  <td style={{ fontSize: 13 }}>{u.area}m² · {u.bedrooms}PN</td>
                  <td style={{ fontWeight: 600, color: 'var(--accent)' }}>{formatVND(u.price_from)}</td>
                  <td><span className={`badge ${STATUS_LABELS[u.status]?.cls ?? ''}`}>{STATUS_LABELS[u.status]?.label ?? u.status}</span></td>
                  <td>{u.is_featured ? '⭐' : '—'}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/unit-types/${u.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                    <button onClick={() => handleDelete(u.id)} className="btn-danger btn-sm">Xóa</button>
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
