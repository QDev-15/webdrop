import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Faq { id: number; question: string; answer: string; page: string; sort_order: number; status: string }

export default function FaqList() {
  const [items, setItems] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)
  const load = () => { api.get<Faq[]>('/faqs').then(setItems).catch(console.error).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">FAQ</div><div className="page-subtitle">Quản lý accordion câu hỏi thường gặp hiển thị trên trang Dịch vụ</div></div>
        <Link to="/faqs/new" className="btn-accent">+ Thêm câu hỏi</Link>
      </div>
      {loading ? <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div> :
        items.length === 0 ? <div className="empty-state"><div className="empty-state-icon">❓</div><div className="empty-state-text">Chưa có câu hỏi nào.</div></div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Câu hỏi</th><th>Trang hiển thị</th><th>Thứ tự</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 500, maxWidth: '380px' }}>{item.question}</td>
                    <td style={{ color: 'var(--text-2)' }}>{item.page}</td>
                    <td>{item.sort_order}</td>
                    <td><span className={`badge badge-${item.status}`}><span className="badge-dot" />{item.status === 'published' ? 'Hiển thị' : 'Ẩn'}</span></td>
                    <td><div className="td-actions">
                      <Link to={`/faqs/${item.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button onClick={async () => { if (confirm('Xóa?')) { await api.delete(`/faqs/${item.id}`); load() } }} className="btn-danger btn-sm">Xóa</button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </>
  )
}
