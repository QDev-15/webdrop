import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Contact { id: number; name: string; phone: string; email: string; service: string; subject: string; status: string; created_at: string }

function fmtDate(d: string) { return new Date(d).toLocaleDateString('vi-VN') }

export default function ContactList() {
  const [items, setItems] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const load = () => { setLoading(true); api.get<Contact[]>('/contacts').then(setItems).catch(() => {}).finally(() => setLoading(false)) }
  useEffect(load, [])

  const filtered = filter === 'all' ? items : items.filter(c => c.status === filter)

  return (
    <>
      <div className="page-hd">
        <div><h1 className="page-hd-title">Liên hệ</h1><div className="page-hd-sub">{items.filter(c => c.status === 'new').length} liên hệ mới</div></div>
        <div className="d-flex gap-2">
          {['all','new','read','replied'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`}>
              {s === 'all' ? 'Tất cả' : s}
            </button>
          ))}
        </div>
      </div>
      <div className="card">
        {loading ? <p className="text-muted">Đang tải...</p> : (
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>#</th><th>Tên</th><th>SĐT</th><th>Email</th><th>Dịch vụ</th><th>Trạng thái</th><th>Ngày</th><th></th></tr></thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td className="td-name"><Link to={`/contacts/${c.id}`} style={{ color: 'var(--accent)' }}>{c.name}</Link></td>
                    <td>{c.phone}</td>
                    <td>{c.email}</td>
                    <td>{c.service || c.subject || '—'}</td>
                    <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
                    <td>{fmtDate(c.created_at)}</td>
                    <td><Link to={`/contacts/${c.id}`} className="btn btn-ghost btn-sm">Xem</Link></td>
                  </tr>
                ))}
                {!filtered.length && <tr><td colSpan={8} className="text-center text-muted" style={{ padding: '32px' }}>Không có liên hệ.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
