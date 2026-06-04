import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Faq { id: number; question: string; answer: string; sort_order: number; status: string }

export default function FaqList() {
  const [items, setItems]     = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Faq[]>('/faqs')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa câu hỏi này?')) return
    await api.delete(`/faqs/${id}`)
    load()
  }

  if (loading) return <div className="loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">FAQ</h1><p className="page-sub">Câu hỏi thường gặp</p></div>
        <Link to="/faqs/new" className="btn btn-primary">+ Thêm câu hỏi</Link>
      </div>
      <div className="card">
        {items.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">❓</div><div className="empty-state-text">Chưa có câu hỏi nào</div></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Câu hỏi</th><th>Trạng thái</th><th></th></tr></thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={item.id}>
                    <td className="td-muted">{i + 1}</td>
                    <td><strong>{item.question}</strong><div className="td-muted" style={{ fontSize: 12, marginTop: 2 }}>{item.answer.slice(0, 80)}...</div></td>
                    <td><span className={`badge badge-${item.status}`}>{item.status === 'published' ? 'Hiển thị' : 'Ẩn'}</span></td>
                    <td style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/faqs/${item.id}/edit`} className="btn btn-ghost btn-sm">Sửa</Link>
                      <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
