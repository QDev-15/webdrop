'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface TeamFormProps {
  member?: {
    id: number
    name: string
    title: string
    bio: string
    image?: string | null
    sortOrder: number
  }
}

export default function TeamForm({ member }: TeamFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: member?.name || '',
    title: member?.title || '',
    bio: member?.bio || '',
    image: member?.image || '',
    sortOrder: member?.sortOrder || 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = member
        ? `/api/admin/about/team/${member.id}`
        : '/api/admin/about/team'

      const method = member ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save')
      }

      router.push('/admin/about?tab=team')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!member || !confirm('Bạn chắc chắn muốn xóa?')) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/about/team/${member.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete')
      }

      router.push('/admin/about?tab=team')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <div style={{
          padding: 12,
          marginBottom: 20,
          borderRadius: 6,
          background: 'var(--danger)',
          color: '#fff',
          fontSize: 13,
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{
        background: 'var(--surface)',
        borderRadius: 8,
        border: '1px solid var(--border)',
        padding: 24,
      }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Họ tên</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              fontSize: 14,
              fontFamily: 'var(--sans)',
            }}
            placeholder="Nhập họ tên"
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Chức vụ</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              fontSize: 14,
              fontFamily: 'var(--sans)',
            }}
            placeholder="Ví dụ: Founder & Developer"
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Tiểu sử</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            required
            rows={4}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              fontSize: 14,
              fontFamily: 'var(--sans)',
              resize: 'vertical',
            }}
            placeholder="Nhập tiểu sử, kinh nghiệm..."
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>URL ảnh đại diện</label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              fontSize: 14,
              fontFamily: 'var(--sans)',
            }}
            placeholder="https://..."
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Thứ tự hiển thị</label>
          <input
            type="number"
            value={formData.sortOrder}
            onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              fontSize: 14,
              fontFamily: 'var(--sans)',
            }}
            placeholder="0"
          />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              borderRadius: 6,
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Đang lưu...' : member ? 'Cập nhật' : 'Tạo mới'}
          </button>
          <Link href="/admin/about?tab=team" style={{
            padding: '10px 20px',
            borderRadius: 6,
            background: 'var(--warm)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            fontSize: 14,
            fontWeight: 600,
            textDecoration: 'none',
            display: 'inline-block',
          }}>
            Hủy
          </Link>
          {member && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              style={{
                marginLeft: 'auto',
                padding: '10px 20px',
                borderRadius: 6,
                background: 'transparent',
                color: 'var(--danger)',
                border: '1px solid var(--danger)',
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
            >
              Xóa
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
