import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface FormData {
  name: string
  hex: string
  sort_order: string
}

const EMPTY: FormData = { name: '', hex: '#b5651d', sort_order: '0' }

// Bảng màu gợi ý nhanh
const QUICK_PICKS = [
  '#ffffff', '#f5f0e8', '#f5e6d3', '#ffd700',
  '#ffb347', '#ff6347', '#dc143c', '#c71585',
  '#b5651d', '#87a06b', '#7d4e2d', '#6b4f3b',
  '#4caf50', '#2196f3', '#9c27b0', '#607d8b',
  '#9e9e9e', '#424242', '#1e1e1e', '#000000',
]

export default function ColorForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState<FormData>(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<Record<string, unknown>>(`/product-colors/${id}`)
      .then(d => setForm({
        name: String(d.name ?? ''),
        hex: String(d.hex ?? '#000000'),
        sort_order: String(d.sort_order ?? '0'),
      }))
      .catch(() => setError('Không tải được dữ liệu'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên màu không được để trống'); return }
    setSaving(true); setError('')
    const payload = { ...form, sort_order: Number(form.sort_order) || 0 }
    try {
      if (isEdit) {
        await api.post(`/product-colors/${id}/update`, payload)
      } else {
        await api.post('/product-colors', payload)
      }
      navigate('/colors')
    } catch {
      setError('Lưu thất bại, vui lòng thử lại')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading-box">Đang tải...</div>

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">{isEdit ? 'Sửa màu sắc' : 'Thêm màu sắc mới'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {error && <div className="form-error-banner">{error}</div>}

        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label>Tên màu <span className="req">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="VD: Terracotta, Sage, Nâu đất..."
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Thứ tự sắp xếp</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={e => set('sort_order', e.target.value)}
              min={0}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Mã màu (Hex)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Preview lớn */}
            <span style={{
              display: 'inline-block', width: 48, height: 48, borderRadius: '50%',
              background: form.hex,
              border: '2px solid var(--border)',
              boxShadow: '0 2px 8px rgba(0,0,0,.12)',
              flexShrink: 0,
            }} />
            {/* Color picker native */}
            <input
              type="color"
              value={form.hex}
              onChange={e => set('hex', e.target.value)}
              style={{ width: 44, height: 44, padding: 2, border: '1.5px solid var(--border)', borderRadius: 8, cursor: 'pointer', background: 'none' }}
              title="Chọn màu"
            />
            {/* Nhập hex thủ công */}
            <input
              type="text"
              value={form.hex}
              onChange={e => {
                const v = e.target.value.trim()
                set('hex', v)
              }}
              placeholder="#b5651d"
              style={{ width: 120, fontFamily: 'monospace', fontSize: 14, letterSpacing: 1 }}
            />
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 8 }}>
            Dùng color picker hoặc nhập mã hex trực tiếp (VD: #b5651d)
          </p>
        </div>

        {/* Quick picks */}
        <div className="form-group">
          <label>Màu gợi ý nhanh</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
            {QUICK_PICKS.map(hex => (
              <button
                key={hex}
                type="button"
                onClick={() => set('hex', hex)}
                title={hex}
                style={{
                  width: 28, height: 28, borderRadius: '50%', background: hex, padding: 0, cursor: 'pointer',
                  border: form.hex.toLowerCase() === hex.toLowerCase()
                    ? '0 none' : hex === '#ffffff' ? '1.5px solid #ddd' : 'none',
                  boxShadow: form.hex.toLowerCase() === hex.toLowerCase()
                    ? '0 0 0 2px #fff, 0 0 0 4px var(--accent)'
                    : '0 1px 3px rgba(0,0,0,.2)',
                  transition: 'box-shadow .15s',
                }}
              />
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/colors')}>Hủy</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu màu sắc'}
          </button>
        </div>
      </form>
    </div>
  )
}
