import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import { api } from '../../api/client'

interface Faq {
  id: number
  question: string
  answer: string
  page: string
  sort_order: number
  status: string
}

export default function FaqsList() {
  const [items, setItems]     = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.get<Faq[]>('/faqs').then(setItems).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa câu hỏi này?')) return
    await api.delete(`/faqs/${id}`)
    load()
  }

  return (
    <AdminLayout title="FAQ">
      <div className="page-header">
        <div>
          <h1 className="page-title">FAQ — Câu hỏi thường gặp</h1>
          <p className="page-sub">Quản lý accordion FAQ hiển thị trên trang Dịch vụ</p>
        </div>
        <Link to="/faqs/new" className="btn-accent">+ Thêm câu hỏi</Link>
      </div>
      {loading ? (
        <div className="empty-state"><div className="empty-state-icon">⏳</div><div className="empty-state-text">Đang tải...</div></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Câu hỏi</th><th>Trang hiển thị</th><th>Thứ tự</th><th>Trạng thái</th><th>Thao tác</th></tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 500, maxWidth: 400 }}>{item.question}</td>
                  <td style={{ color: 'var(--text-2)', fontSize: 13 }}>{item.page}</td>
                  <td>{item.sort_order}</td>
                  <td>{item.status === 'published' ? 'Đã đăng' : 'Nháp'}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/faqs/${item.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '40px' }}>Chưa có câu hỏi nào</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
