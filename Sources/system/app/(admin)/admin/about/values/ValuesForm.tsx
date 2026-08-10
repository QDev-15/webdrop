'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ValuesFormProps {
  value?: {
    id: number
    title: string
    description: string
    icon?: string | null
    sortOrder: number
  }
}

const ICON_SUGGESTIONS = ['⚡', '✨', '💪', '🤝', '🎯', '💡', '🚀', '🌟', '❤️', '🔥', '⭐', '🎨', '📱', '💼', '🏆']

export default function ValuesForm({ value }: ValuesFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [formData, setFormData] = useState({
    title: value?.title || '',
    description: value?.description || '',
    icon: value?.icon || '',
    sortOrder: value?.sortOrder || 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = value
        ? `/api/admin/about/values/${value.id}`
        : '/api/admin/about/values'

      const method = value ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save')
      }

      router.push('/admin/about?tab=values')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!value || !confirm('Bạn chắc chắn muốn xóa?')) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/about/values/${value.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete')
      }

      router.push('/admin/about?tab=values')
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
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Tiêu đề</label>
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
            placeholder="Ví dụ: Nhanh chóng"
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Mô tả</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
            placeholder="Nhập mô tả chi tiết..."
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Biểu tượng</label>
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid var(--border)',
                fontSize: 14,
                fontFamily: 'var(--sans)',
              }}
              placeholder="Emoji hoặc icon"
              onClick={() => setShowIconPicker(!showIconPicker)}
            />
            {showIconPicker && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                padding: 12,
                marginTop: 8,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(30px, 1fr))',
                gap: 8,
                zIndex: 10,
                width: '200px',
              }}>
                {ICON_SUGGESTIONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, icon })
                      setShowIconPicker(false)
                    }}
                    style={{
                      fontSize: 24,
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      borderRadius: 4,
                      padding: 6,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--accent)'
                      e.currentTarget.style.color = '#fff'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'inherit'
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
            Nhập emoji hoặc tên icon (ví dụ: ⚡, ✨, 💪)
          </div>
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
            {loading ? 'Đang lưu...' : value ? 'Cập nhật' : 'Tạo mới'}
          </button>
          <Link href="/admin/about?tab=values" style={{
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
          {value && (
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
