import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Listing {
  id: number
  title: string
  slug: string
  listing_type: string
  property_type: string
  price: number
  area: number
  district: string
  city: string
  tier: string
  status: string
  account_name: string
  account_email: string
  account_phone: string
  images: string
  description: string
  created_at: string
}

const STATUS_LABELS: Record<string, string> = { pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Từ chối' }
const TIER_LABELS: Record<string, string> = { thuong: 'Tin thường', 'vip-bac': 'VIP Bạc', 'vip-vang': 'VIP Vàng', 'vip-kim-cuong': 'VIP Kim Cương' }

function formatPrice(n: number): string {
  if (n >= 1e9) return (n / 1e9).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + ' tỷ'
  return Math.round(n / 1e6) + ' triệu'
}

export default function ListingList() {
  const [items, setItems] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('pending')
  const [detail, setDetail] = useState<Listing | null>(null)

  useEffect(() => { load() }, [status])

  async function load() {
    setLoading(true)
    try {
      const q = status ? `?status=${status}` : ''
      setItems(await api.get<Listing[]>(`/listings${q}`))
    } finally { setLoading(false) }
  }

  async function approve(id: number) {
    await api.post(`/listings/${id}/approve`, {})
    setDetail(null); load()
  }
  async function reject(id: number) {
    if (!confirm('Từ chối tin đăng này?')) return
    await api.post(`/listings/${id}/reject`, {})
    setDetail(null); load()
  }
  async function remove(id: number) {
    if (!confirm('Xóa vĩnh viễn tin đăng này?')) return
    await api.delete(`/listings/${id}`)
    setDetail(null); load()
  }

  const tabs = [
    { v: 'pending', label: 'Chờ duyệt' },
    { v: 'approved', label: 'Đã duyệt' },
    { v: 'rejected', label: 'Từ chối' },
    { v: '', label: 'Tất cả' },
  ]

  if (loading && items.length === 0) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Tin đăng bất động sản</div>
          <div className="page-sub">{items.length} tin trong bộ lọc hiện tại</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {tabs.map(t => (
          <button key={t.v} onClick={() => setStatus(t.v)} className={status === t.v ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: detail ? '1fr 420px' : '1fr', gap: 16 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Người đăng</th>
                <th>Giá</th>
                <th>Gói tin</th>
                <th>Trạng thái</th>
                <th>Ngày đăng</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map(l => (
                <tr key={l.id} onClick={() => setDetail(l)} style={{ cursor: 'pointer', background: detail?.id === l.id ? 'var(--accent-light)' : undefined }}>
                  <td style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</td>
                  <td style={{ fontSize: 12.5 }}>{l.account_name}</td>
                  <td>{formatPrice(l.price)}</td>
                  <td><span className="badge badge-confirmed">{TIER_LABELS[l.tier] ?? l.tier}</span></td>
                  <td><span className={`status-badge ${l.status === 'pending' ? 'pending' : l.status === 'approved' ? 'confirmed' : 'cancelled'}`}>{STATUS_LABELS[l.status] ?? l.status}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{new Date(l.created_at).toLocaleDateString('vi-VN')}</td>
                  <td onClick={e => e.stopPropagation()}>
                    {l.status === 'pending' && (
                      <>
                        <button onClick={() => approve(l.id)} className="btn-accent btn-sm" style={{ marginRight: 6 }}>Duyệt</button>
                        <button onClick={() => reject(l.id)} className="btn-danger btn-sm">Từ chối</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <div className="empty-state"><div className="empty-state-icon">🏠</div><div className="empty-state-text">Không có tin đăng nào.</div></div>}
        </div>

        {detail && (
          <div className="card" style={{ alignSelf: 'start', position: 'sticky', top: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Chi tiết tin đăng</div>
              <button onClick={() => setDetail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
            {detail.images && (
              <img src={detail.images.split('|')[0]} alt={detail.title} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} />
            )}
            <div style={{ fontWeight: 600, marginBottom: 8 }}>{detail.title}</div>
            {[
              ['Loại nhu cầu', detail.listing_type === 'ban' ? 'Bán' : 'Cho thuê'],
              ['Giá', formatPrice(detail.price)],
              ['Diện tích', detail.area + 'm²'],
              ['Khu vực', `${detail.district}, ${detail.city}`],
              ['Gói tin', TIER_LABELS[detail.tier] ?? detail.tier],
              ['Người đăng', detail.account_name],
              ['Email', detail.account_email],
              ['SĐT', detail.account_phone],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-3)', width: 110, flexShrink: 0 }}>{label}</div>
                <div style={{ fontSize: 13, flex: 1 }}>{value}</div>
              </div>
            ))}
            <div style={{ marginTop: 12, padding: 12, background: 'var(--bg)', borderRadius: 8, fontSize: 13, lineHeight: 1.7, color: 'var(--text-2)' }}>
              {detail.description}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
              {detail.status === 'pending' && (
                <>
                  <button onClick={() => approve(detail.id)} className="btn-accent btn-sm">Duyệt tin</button>
                  <button onClick={() => reject(detail.id)} className="btn-danger btn-sm">Từ chối</button>
                </>
              )}
              {detail.status === 'approved' && (
                <button onClick={() => reject(detail.id)} className="btn-danger btn-sm">Gỡ tin (từ chối)</button>
              )}
              <button onClick={() => remove(detail.id)} className="btn-ghost btn-sm">Xóa vĩnh viễn</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
