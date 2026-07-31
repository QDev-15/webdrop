import { useState, useRef, useCallback } from 'react'
import { api } from '../api/client'
import UnsplashPicker from './UnsplashPicker'

interface Props {
  value: string  // JSON array string
  onChange: (jsonStr: string) => void
  label?: string
}

export default function GalleryField({ value, onChange, label }: Props) {
  const [urlInput, setUrlInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Parse JSON array
  const parseGallery = useCallback((jsonStr: string): string[] => {
    if (!jsonStr) return []
    try {
      const parsed = JSON.parse(jsonStr)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }, [])

  const gallery = parseGallery(value)

  // Add URL to gallery
  const addUrl = useCallback((url: string) => {
    const trimmed = url.trim()
    if (!trimmed) { setError('URL không được để trống'); return }
    if (!trimmed.startsWith('http')) { setError('URL phải bắt đầu với http'); return }

    const newGallery = [...gallery, trimmed]
    onChange(JSON.stringify(newGallery))
    setUrlInput('')
    setError('')
  }, [gallery, onChange])

  // Add from file upload
  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Chỉ hỗ trợ file ảnh'); return }
    setUploading(true); setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const data = await api.upload<{ url: string }>('/upload', fd)
      addUrl(data.url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload thất bại')
    } finally {
      setUploading(false)
    }
  }, [addUrl])

  // Remove from gallery
  const removeUrl = useCallback((idx: number) => {
    const newGallery = gallery.filter((_, i) => i !== idx)
    onChange(JSON.stringify(newGallery))
  }, [gallery, onChange])

  return (
    <div>
      {label && <label className="form-label fw-semibold small">{label}</label>}

      {/* Input Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', marginBottom: '12px' }}>
        <input
          type="text"
          value={urlInput}
          onChange={e => { setUrlInput(e.target.value); setError('') }}
          placeholder="Paste URL ảnh hoặc click + để tìm kiếm từ Unsplash..."
          style={{
            padding: '8px 12px',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            fontFamily: 'var(--sans)',
            fontSize: '14px',
          }}
          onKeyDown={e => e.key === 'Enter' && addUrl(urlInput)}
        />
        <button
          type="button"
          onClick={() => addUrl(urlInput)}
          disabled={uploading}
          title="Thêm URL ảnh"
          style={{
            padding: '8px 16px',
            background: 'var(--accent)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '14px',
          }}
        >
          + Thêm
        </button>
      </div>

      {/* Button Group */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontWeight: '500',
            fontSize: '14px',
            opacity: uploading ? 0.6 : 1,
          }}
          title="Upload ảnh từ máy tính"
        >
          {uploading ? '⏳ Đang upload...' : '⬆️ Upload'}
        </button>
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          style={{
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '14px',
          }}
          title="Tìm ảnh từ Unsplash"
        >
          🔍 Unsplash
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }}
      />

      {/* Error */}
      {error && (
        <div className="alert alert-danger py-2 small mb-2">{error}</div>
      )}

      {/* Gallery List */}
      {gallery.length > 0 && (
        <div>
          <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '8px', fontWeight: '500' }}>
            📸 Đã thêm {gallery.length} ảnh
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: '8px',
            marginBottom: '12px',
          }}>
            {gallery.map((url, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--warm)',
                }}
              >
                <img
                  src={url}
                  alt={`Gallery ${idx + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                  onError={e => {
                    const img = e.target as HTMLImageElement
                    img.style.display = 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeUrl(idx)}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,.6)',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title={`Xóa ảnh ${idx + 1}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Picker Modal */}
      {pickerOpen && (
        <UnsplashPicker
          onSelect={url => { addUrl(url); setPickerOpen(false) }}
          onClose={() => setPickerOpen(false)}
        />
      )}

      <p style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '8px' }}>
        💡 Thêm tối đa 5 ảnh mô tả sản phẩm từ nhiều góc (trước, sau, chi tiết, size, etc)
      </p>
    </div>
  )
}
