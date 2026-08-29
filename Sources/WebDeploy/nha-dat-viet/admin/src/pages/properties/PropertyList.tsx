import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import { PROPERTY_TYPE_LABELS, BADGE_LABELS } from '../../data/propertyOptions'

interface Property {
  id: number
  title: string
  slug: string
  listing_type: string
  property_type: string
  price: number
  price_unit: string
  area: number
  district: string
  badge: string
  agent_name: string | null
}

const PER_PAGE = 20

function formatPrice(value: number, unit: string): string {
  if (unit === 'tỷ') return (value / 1e9).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + ' tỷ'
  if (unit === 'triệu/tháng') return Math.round(value / 1e6).toLocaleString('vi-VN') + ' triệu/tháng'
  return value.toLocaleString('vi-VN') + ' đ'
}

export default function PropertyList() {
  const [items, setItems] = useState<Property[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback((p: number, search: string) => {
    setLoading(true)
    const qs = new URLSearchParams({ page: String(p), per_page: String(PER_PAGE) })
    if (search) qs.set('q', search)
    api.getPaged<Property[]>(`/properties?${qs.toString()}`)
      .then(({ data, total }) => { setItems(data); setTotal(total) })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load(page, q) }, [load, page])

  // Debounce tìm kiếm 400ms — reset về trang 1 mỗi lần đổi từ khóa
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); load(1, q) }, 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  async function handleDelete(id: number) {
    if (!confirm('Xóa tin đăng này?')) return
    await api.delete(`/properties/${id}`)
    load(page, q)
  }

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  const startIdx = total === 0 ? 0 : (page - 1) * PER_PAGE + 1
  const endIdx = Math.min(page * PER_PAGE, total)

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Tin đăng bất động sản</div>
          <div className="page-sub">{total} tin đăng</div>
        </div>
        <Link to="/properties/new" className="btn-accent">+ Thêm tin đăng</Link>
      </div>

      <div className="form-group" style={{ maxWidth: 360 }}>
        <input
          type="search"
          className="form-control"
          placeholder="Tìm theo tiêu đề hoặc đường..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="admin-loading">Đang tải...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏠</div>
          <div className="empty-state-text">
            {q ? `Không tìm thấy tin đăng nào khớp "${q}"` : 'Chưa có tin đăng nào. Thêm tin đăng đầu tiên!'}
          </div>
        </div>
      ) : (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tiêu đề</th><th>Loại hình</th><th>Nhu cầu</th><th>Giá</th><th>Diện tích</th><th>Môi giới</th><th>Nhãn</th><th></th>
                </tr>
              </thead>
              <tbody>
                {items.map(pr => (
                  <tr key={pr.id}>
                    <td style={{ fontWeight: 600, maxWidth: 260 }}>{pr.title}</td>
                    <td>{PROPERTY_TYPE_LABELS[pr.property_type] ?? pr.property_type}</td>
                    <td>{pr.listing_type === 'ban' ? 'Bán' : 'Cho thuê'}</td>
                    <td>{formatPrice(pr.price, pr.price_unit)}</td>
                    <td>{pr.area}m²</td>
                    <td>{pr.agent_name ?? '—'}</td>
                    <td>{pr.badge ? <span className="badge">{BADGE_LABELS[pr.badge] ?? pr.badge}</span> : '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <Link to={`/properties/${pr.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                        <button onClick={() => handleDelete(pr.id)} className="btn-danger btn-sm">Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="admin-pagination">
              <button className="admin-page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} className={'admin-page-btn' + (n === page ? ' active' : '')} onClick={() => setPage(n)}>{n}</button>
              ))}
              <button className="admin-page-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>›</button>
            </div>
          )}
          <div className="admin-pagination-info">Hiển thị {startIdx}–{endIdx} trong số {total} tin đăng</div>
        </>
      )}
    </div>
  )
}
