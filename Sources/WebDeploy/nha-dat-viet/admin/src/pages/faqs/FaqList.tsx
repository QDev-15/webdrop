import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Faq {
  id: number
  question: string
  answer: string
  sort_order: number
}

export default function FaqList() {
  const [items, setItems] = useState<Faq[]>([])
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

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Câu hỏi thường gặp</div>
          <div className="page-sub">{items.length} câu hỏi</div>
        </div>
        <Link to="/faqs/new" className="btn-accent">+ Thêm câu hỏi</Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">❓</div>
          <div className="empty-state-text">Chưa có câu hỏi nào. Thêm câu hỏi đầu tiên!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(f => (
            <div key={f.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{f.question}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{f.answer}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'flex-start' }}>
                  <Link to={`/faqs/${f.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                  <button onClick={() => handleDelete(f.id)} className="btn-danger btn-sm">Xóa</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
