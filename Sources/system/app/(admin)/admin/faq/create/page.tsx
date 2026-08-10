'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useRouter } from 'next/navigation'
import { FAQ_GROUPS, FAQ_GROUP_LABELS } from '@/lib/faq'

const FAQ_GROUP_OPTIONS = FAQ_GROUPS.map(group => ({
  value: group,
  label: FAQ_GROUP_LABELS[group],
}))

export default function CreateFaqPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    question: '',
    answer: '',
    groupKey: 'mua-tai-template',
    sortOrder: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'sortOrder' ? parseInt(value) || 0 : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Không thể tạo FAQ')
      }

      router.push('/admin/faq')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout title="Thêm câu hỏi mới">
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: '800px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 24,
        }}
      >
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

        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="question"
            style={{
              display: 'block',
              marginBottom: 6,
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--text)',
            }}
          >
            Câu hỏi *
          </label>
          <textarea
            id="question"
            name="question"
            value={form.question}
            onChange={handleChange}
            placeholder="Nhập câu hỏi..."
            minLength={10}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: 13,
              fontFamily: 'var(--sans)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              background: 'var(--bg)',
              outline: 'none',
              minHeight: '80px',
              resize: 'vertical',
            }}
            required
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="answer"
            style={{
              display: 'block',
              marginBottom: 6,
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--text)',
            }}
          >
            Câu trả lời *
          </label>
          <textarea
            id="answer"
            name="answer"
            value={form.answer}
            onChange={handleChange}
            placeholder="Nhập câu trả lời..."
            minLength={20}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: 13,
              fontFamily: 'var(--sans)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              background: 'var(--bg)',
              outline: 'none',
              minHeight: '120px',
              resize: 'vertical',
            }}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <label
              htmlFor="groupKey"
              style={{
                display: 'block',
                marginBottom: 6,
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--text)',
              }}
            >
              Nhóm *
            </label>
            <select
              id="groupKey"
              name="groupKey"
              value={form.groupKey}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: 13,
                fontFamily: 'var(--sans)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                background: 'var(--bg)',
                outline: 'none',
              }}
            >
              {FAQ_GROUP_OPTIONS.map(g => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="sortOrder"
              style={{
                display: 'block',
                marginBottom: 6,
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--text)',
              }}
            >
              Thứ tự
            </label>
            <input
              type="number"
              id="sortOrder"
              name="sortOrder"
              value={form.sortOrder}
              onChange={handleChange}
              min="0"
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: 13,
                fontFamily: 'var(--sans)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                background: 'var(--bg)',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => router.push('/admin/faq')}
            style={{
              padding: '8px 16px',
              background: 'var(--border)',
              color: 'var(--text)',
              border: 'none',
              borderRadius: 8,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'var(--sans)',
            }}
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '8px 16px',
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'var(--sans)',
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}
