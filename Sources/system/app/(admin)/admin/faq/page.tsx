'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import { useRouter } from 'next/navigation'
import { FAQ_GROUP_LABELS } from '@/lib/faq'

interface FaqItem {
  id: number
  question: string
  answer: string
  groupKey: string
  sortOrder: number
  createdAt: string
}

export default function FaqListPage() {
  const router = useRouter()
  const [faqs, setFaqs] = useState<FaqItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState<number | null>(null)

  useEffect(() => {
    fetchFaqs()
  }, [])

  async function fetchFaqs() {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/faq')
      if (!res.ok) throw new Error('Không thể lấy dữ liệu FAQ')
      const data = await res.json()
      setFaqs(data.faqs || [])
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Bạn chắc chắn muốn xóa?')) return

    try {
      setDeleting(id)
      setError('')
      const res = await fetch(`/api/admin/faq/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Không thể xóa')
      }
      setFaqs(prev => prev.filter(f => f.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi xóa')
    } finally {
      setDeleting(null)
    }
  }

  const groupedFaqs = faqs.reduce((acc, faq) => {
    if (!acc[faq.groupKey]) acc[faq.groupKey] = []
    acc[faq.groupKey].push(faq)
    return acc
  }, {} as Record<string, FaqItem[]>)

  return (
    <AdminLayout title="Hỏi & Đáp">
      <div style={{ marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center' }}>
        <Link
          href="/admin/faq/create"
          style={{
            padding: '8px 16px',
            background: 'var(--accent)',
            color: '#fff',
            borderRadius: 8,
            textDecoration: 'none',
            fontSize: 13,
            fontFamily: 'var(--sans)',
            cursor: 'pointer',
            border: 'none',
          }}
        >
          + Thêm câu hỏi
        </Link>
        <span style={{ fontSize: 13, color: 'var(--text-2)', marginLeft: 'auto' }}>
          Tổng: <strong>{faqs.length}</strong>
        </span>
      </div>

      {error && (
        <div
          style={{
            padding: 12,
            background: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid var(--danger)',
            borderRadius: 8,
            marginBottom: 16,
            color: 'var(--danger)',
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-3)' }}>
          Đang tải...
        </div>
      ) : faqs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-3)' }}>
          Chưa có câu hỏi nào. <Link href="/admin/faq/create">Thêm câu hỏi đầu tiên</Link>
        </div>
      ) : (
        Object.entries(groupedFaqs).map(([groupKey, groupFaqs]) => (
          <div key={groupKey} style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text)' }}>
              {FAQ_GROUP_LABELS[groupKey] || groupKey}
            </h3>
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border-light)' }}>
                      <th
                        style={{
                          padding: '10px 16px',
                          textAlign: 'left',
                          fontSize: 11,
                          fontWeight: 600,
                          color: 'var(--text-3)',
                          textTransform: 'uppercase',
                          letterSpacing: '.4px',
                        }}
                      >
                        Câu hỏi
                      </th>
                      <th
                        style={{
                          padding: '10px 16px',
                          textAlign: 'left',
                          fontSize: 11,
                          fontWeight: 600,
                          color: 'var(--text-3)',
                          textTransform: 'uppercase',
                          letterSpacing: '.4px',
                          width: '80px',
                        }}
                      >
                        Thứ tự
                      </th>
                      <th
                        style={{
                          padding: '10px 16px',
                          textAlign: 'center',
                          fontSize: 11,
                          fontWeight: 600,
                          color: 'var(--text-3)',
                          textTransform: 'uppercase',
                          letterSpacing: '.4px',
                          width: '80px',
                        }}
                      >
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupFaqs.map(faq => (
                      <tr key={faq.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '11px 16px', fontSize: 13 }}>
                          <div
                            style={{
                              maxWidth: '600px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {faq.question}
                          </div>
                        </td>
                        <td style={{ padding: '11px 16px', fontSize: 13, textAlign: 'center' }}>
                          {faq.sortOrder}
                        </td>
                        <td
                          style={{
                            padding: '11px 16px',
                            fontSize: 13,
                            display: 'flex',
                            gap: 8,
                            justifyContent: 'center',
                          }}
                        >
                          <Link
                            href={`/admin/faq/${faq.id}/edit`}
                            style={{
                              color: 'var(--accent)',
                              textDecoration: 'none',
                              cursor: 'pointer',
                            }}
                            aria-label={`Chỉnh sửa: ${faq.question}`}
                          >
                            ✏️
                          </Link>
                          <button
                            onClick={() => handleDelete(faq.id)}
                            disabled={deleting === faq.id}
                            aria-label={`Xóa: ${faq.question}`}
                            title={deleting === faq.id ? 'Đang xóa...' : 'Xóa'}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--danger)',
                              cursor: deleting === faq.id ? 'not-allowed' : 'pointer',
                              fontSize: 13,
                              opacity: deleting === faq.id ? 0.6 : 1,
                            }}
                          >
                            {deleting === faq.id ? '⏳' : '🗑️'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))
      )}
    </AdminLayout>
  )
}
