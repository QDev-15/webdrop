import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Txn {
  id: number
  account_id: number
  account_name: string
  account_email: string
  type: string
  amount: number
  method: string
  note: string
  status: string
  created_at: string
}

const METHOD_LABELS: Record<string, string> = {
  sepay: 'SePay (QR chuyển khoản)',
  'chuyen-khoan-thu-cong': 'Chuyển khoản thủ công',
  'he-thong': 'Hệ thống (mua/gia hạn gói)',
}
const STATUS_LABELS: Record<string, string> = { pending: 'Chờ xác nhận', completed: 'Đã hoàn tất', rejected: 'Đã từ chối' }

export default function WalletTransactionList() {
  const [items, setItems] = useState<Txn[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('pending')

  useEffect(() => { load() }, [status])

  async function load() {
    setLoading(true)
    try {
      const q = status ? `?status=${status}` : ''
      setItems(await api.get<Txn[]>(`/wallet-transactions${q}`))
    } finally { setLoading(false) }
  }

  async function approve(id: number) {
    if (!confirm('Xác nhận đã nhận được tiền và cộng credit cho tài khoản này?')) return
    await api.post(`/wallet-transactions/${id}/approve`, {})
    load()
  }
  async function reject(id: number) {
    if (!confirm('Từ chối giao dịch này?')) return
    await api.post(`/wallet-transactions/${id}/reject`, {})
    load()
  }

  const tabs = [
    { v: 'pending', label: 'Chờ xác nhận' },
    { v: 'completed', label: 'Đã hoàn tất' },
    { v: 'rejected', label: 'Đã từ chối' },
    { v: '', label: 'Tất cả' },
  ]

  if (loading && items.length === 0) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Ví &amp; giao dịch credit</div>
          <div className="page-sub">Duyệt các yêu cầu nạp credit qua chuyển khoản thủ công</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {tabs.map(t => (
          <button key={t.v} onClick={() => setStatus(t.v)} className={status === t.v ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tài khoản</th>
              <th>Loại</th>
              <th>Số tiền</th>
              <th>Phương thức</th>
              <th>Ghi chú</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map(t => (
              <tr key={t.id}>
                <td>
                  <div>{t.account_name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{t.account_email}</div>
                </td>
                <td>{t.type === 'nap' ? 'Nạp' : 'Trừ'}</td>
                <td className={t.type === 'nap' ? '' : ''} style={{ fontWeight: 600, color: t.type === 'nap' ? 'var(--accent)' : 'var(--danger)' }}>
                  {t.type === 'nap' ? '+' : '-'}{t.amount.toLocaleString('vi-VN')}đ
                </td>
                <td style={{ fontSize: 12.5 }}>{METHOD_LABELS[t.method] ?? t.method}</td>
                <td style={{ fontSize: 12.5, color: 'var(--text-2)' }}>{t.note}</td>
                <td><span className={`status-badge ${t.status === 'pending' ? 'pending' : t.status === 'completed' ? 'confirmed' : 'cancelled'}`}>{STATUS_LABELS[t.status] ?? t.status}</span></td>
                <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{new Date(t.created_at).toLocaleString('vi-VN')}</td>
                <td>
                  {t.status === 'pending' && (
                    <>
                      <button onClick={() => approve(t.id)} className="btn-accent btn-sm" style={{ marginRight: 6 }}>Xác nhận</button>
                      <button onClick={() => reject(t.id)} className="btn-danger btn-sm">Từ chối</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <div className="empty-state"><div className="empty-state-icon">💳</div><div className="empty-state-text">Không có giao dịch nào.</div></div>}
      </div>
    </div>
  )
}
