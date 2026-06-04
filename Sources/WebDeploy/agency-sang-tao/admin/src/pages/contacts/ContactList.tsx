import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  service: string
  budget: string
  status: string
  created_at: string
}

const STATUS_CLASS: Record<string, string> = { new: 'badge-new', read: 'badge-read', replied: 'badge-replied' }
const STATUS_LABEL: Record<string, string> = { new: 'Mới', read: 'Đã đọc', replied: 'Đã trả lời' }

export default function ContactList() {
  const [items, setItems] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => { load() }, [filter])

  async function load() {
    try {
      const url = filter ? `/contacts?status=${filter}` : '/contacts'
      setItems(await api.get<Contact[]>(url))
    } finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa liên hệ này?')) return
    await api.delete(`/contacts/${id}`)
    load()
  }

  if (loading) return <div style={{ color: 'var(--text-3)', fontSize: '14px' }}>Đang tải...</div>

  return (
    <>
      <div className="page-hd">
        <div>
          <h1 className="page-hd-title">Brief / Liên hệ</h1>
          <div className="page-hd-sub">{items.length} liên hệ</div>
        </div>
        <div className="d-flex gap-2">
          {['', 'new', 'read', 'replied'].map(s => (
            <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(s)}>
              {s === '' ? 'Tất cả' : STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Email</th>
                <th>Dịch vụ</th>
                <th>Ngân sách</th>
                <th>Trạng thái</th>
                <th>Ngày</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-3)' }}>Không có dữ liệu</td></tr>
              ) : items.map(item => (
                <tr key={item.id}>
                  <td className="td-name">{item.name}</td>
                  <td>{item.email || '—'}</td>
                  <td>{item.service || '—'}</td>
                  <td>{item.budget || '—'}</td>
                  <td><span className={`badge ${STATUS_CLASS[item.status] || 'badge-read'}`}>{STATUS_LABEL[item.status] || item.status}</span></td>
                  <td>{new Date(item.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/contacts/${item.id}`} className="btn btn-ghost btn-sm">Xem</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
