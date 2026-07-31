import { useState } from 'react'

interface Props {
  value: string
  onChange: (url: string) => void
  label?: string
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

export default function VideoField({ value, onChange, label }: Props) {
  const [error, setError] = useState('')
  const youtubeId = extractYouTubeId(value)

  const handleChange = (url: string) => {
    setError('')
    if (url && !url.startsWith('http')) {
      setError('URL phải bắt đầu với http')
      return
    }
    onChange(url)
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text')
    if (pasted && !pasted.startsWith('http')) {
      setError('URL phải bắt đầu với http')
    }
  }

  return (
    <div>
      {label && <label className="form-label fw-semibold small">{label}</label>}

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={e => handleChange(e.target.value)}
        onPaste={handlePaste}
        placeholder="VD: https://www.youtube.com/watch?v=dQw4w9WgXcQ hoặc https://youtu.be/dQw4w9WgXcQ"
        style={{
          width: '100%',
          padding: '8px 12px',
          border: `1px solid ${error ? '#dc2626' : 'var(--border)'}`,
          borderRadius: '8px',
          fontFamily: 'var(--sans)',
          fontSize: '14px',
          marginBottom: '12px',
        }}
      />

      {/* Error */}
      {error && (
        <div className="alert alert-danger py-2 small mb-2">{error}</div>
      )}

      {/* Preview */}
      {youtubeId ? (
        <div>
          <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '8px', fontWeight: '500' }}>
            ▶️ Preview video
          </p>
          <div style={{
            position: 'relative',
            width: '100%',
            paddingBottom: '56.25%',
            backgroundColor: 'var(--warm)',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '12px',
          }}>
            <iframe
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title="Video preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            style={{
              padding: '6px 12px',
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Xóa video
          </button>
        </div>
      ) : (
        value && (
          <div style={{ padding: '12px', background: 'var(--warm)', borderRadius: '8px', fontSize: '13px', color: 'var(--text-2)' }}>
            ⚠️ URL không hợp lệ — vui lòng dán YouTube link đầy đủ
          </div>
        )
      )}

      <p style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '8px' }}>
        💡 Paste link YouTube hoặc youtu.be để hiển thị video demo trên trang chi tiết sản phẩm
      </p>
    </div>
  )
}
