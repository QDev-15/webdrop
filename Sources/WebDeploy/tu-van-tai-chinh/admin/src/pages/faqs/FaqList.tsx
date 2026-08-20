import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Faq { id: number; question: string; page: string; sort_order: number; status: string }

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
    await api.delete(`/faqs/${id}`); load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)' }}>Câu hỏi thường gặp (FAQ)</h1>
        <Link to="/faqs/new" className="btn btn-primary">+ Thêm câu hỏi</Link>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Câu hỏi</th><th>Trang hiển thị</th><th>Thứ tự</th><th>Trạng thái</th><th>Hành động</th></tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-3)' }}>Đang tải...</td></tr>
              : items.length === 0 ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-3)' }}>Chưa có câu hỏi nào.</td></tr>
              : items.map(f => (
                <tr key={f.id}>
                  <td style={{ fontWeight: '500', maxWidth: '420px' }}>{f.question}</td>
                  <td style={{ fontSize: '13px', color: 'var(--text-2)' }}>{f.page}</td>
                  <td style={{ fontSize: '13px' }}>{f.sort_order}</td>
                  <td><span className={`badge ${f.status === 'published' ? 'badge-success' : 'badge-muted'}`}>{f.status === 'published' ? 'Hiển thị' : 'Ẩn'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/faqs/${f.id}/edit`} className="btn btn-ghost btn-sm">Sửa</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(f.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
