import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Account {
  id: number
  name: string
  email: string
  phone: string
  role: string
  credit_balance: number
  status: string
  listing_count: number
  created_at: string
}

const ROLE_LABELS: Record<string, string> = {
  'chinh-chu': 'Chính chủ',
  'moi-gioi-tu-do': 'Môi giới tự do',
  'cong-ty-moi-gioi': 'Công ty môi giới',
}

export default function AccountList() {
  const [items, setItems] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Account[]>('/accounts')) }
    finally { setLoading(false) }
  }

  async function toggleStatus(a: Account) {
    const next = a.status === 'banned' ? 'active' : 'banned'
    if (next === 'banned' && !confirm(`Khóa tài khoản "${a.name}"?`)) return
    await api.post(`/accounts/${a.id}/update-status`, { status: next })
    load()
  }

  const filtered = items.filter(a =>
    !q || a.name.toLowerCase().includes(q.toLowerCase()) || a.email.toLowerCase().includes(q.toLowerCase())
  )

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Tài khoản đăng tin</div>
          <div className="page-sub">{items.length} tài khoản đã đăng ký trên sàn</div>
        </div>
      </div>

      <div className="form-group" style={{ maxWidth: 320 }}>
        <input type="search" className="form-control" placeholder="Tìm theo tên hoặc email..." value={q} onChange={e => setQ(e.target.value)} />
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Liên hệ</th>
              <th>Vai trò</th>
              <th>Số dư ví</th>
              <th>Tin đăng</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td style={{ fontSize: 12.5 }}>
                  <div>{a.email}</div>
                  <div style={{ color: 'var(--text-3)' }}>{a.phone}</div>
                </td>
                <td>{ROLE_LABELS[a.role] ?? a.role}</td>
                <td>{a.credit_balance.toLocaleString('vi-VN')}đ</td>
                <td>{a.listing_count}</td>
                <td>
                  <span className={`badge ${a.status === 'active' ? 'badge-published' : 'badge-cancelled'}`}>
                    {a.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                  </span>
                </td>
                <td>
                  <button onClick={() => toggleStatus(a)} className={a.status === 'active' ? 'btn-danger btn-sm' : 'btn-accent btn-sm'}>
                    {a.status === 'active' ? 'Khóa' : 'Mở khóa'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty-state"><div className="empty-state-icon">👤</div><div className="empty-state-text">Không tìm thấy tài khoản nào.</div></div>}
      </div>
    </div>
  )
}
