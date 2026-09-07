import { useState, useRef, useCallback } from 'react'
import { api } from '../api/client'
import UnsplashPicker from './UnsplashPicker'

interface Props {
  value: string
  onChange: (url: string) => void
  label?: string
  placeholder?: string
}

export default function ImageField({ value, onChange, label, placeholder }: Props) {
  const [pickerOpen,  setPickerOpen]  = useState(false)
  const [uploading,   setUploading]   = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [dragOver,    setDragOver]    = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) { setUploadError('Chỉ hỗ trợ file ảnh.'); return }
    setUploading(true); setUploadError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const data = await api.upload<{ url: string }>('/upload', fd)
      onChange(data.url)
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload thất bại')
    } finally { setUploading(false) }
  }, [onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  return (
    <div>
      {label && <label className="form-label fw-semibold small">{label}</label>}

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => !value && fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? '#1a6b52' : value ? 'transparent' : '#d1d5db'}`,
          borderRadius: 10, background: dragOver ? '#e8f4ef' : value ? 'transparent' : '#f9fafb',
          transition: 'all .15s', cursor: value ? 'default' : 'pointer',
          overflow: 'hidden', marginBottom: 8,
        }}
      >
        {value ? (
          <div style={{ position: 'relative' }}>
            <img key={value} src={value} alt="preview"
              style={{ width: '100%', maxHeight: 180, objectFit: 'cover', display: 'block', borderRadius: 8 }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
            <button type="button" onClick={e => { e.stopPropagation(); onChange('') }}
              style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,.5)', border: 'none', color: '#fff', fontSize: 14, cursor: 'pointer', lineHeight: 1 }}>✕</button>
          </div>
        ) : (
          <div style={{ padding: '20px 16px', textAlign: 'center' }}>
            {uploading ? (
              <div style={{ fontSize: 13, color: '#1a6b52' }}>⏳ Đang upload...</div>
            ) : (
              <>
                <div style={{ fontSize: 24, marginBottom: 6 }}>⬆️</div>
                <div style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>Kéo ảnh vào đây để upload</div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>hoặc click để chọn file · JPG, PNG, WEBP, SVG, ICO · tối đa 10MB</div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Progress */}
      {uploading && (
        <div style={{ height: 3, background: '#e5e7eb', borderRadius: 2, marginBottom: 8, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#1a6b52', width: '60%', animation: 'upload-progress 1.2s ease-in-out infinite' }} />
        </div>
      )}

      {/* Error */}
      {uploadError && (
        <div className="alert alert-danger py-2 small mb-2">{uploadError}</div>
      )}

      {/* URL input row */}
      <div className="input-group input-group-sm">
        <input type="text" className="form-control" value={value}
          onChange={e => { setUploadError(''); onChange(e.target.value) }}
          placeholder={placeholder || 'https://... hoặc upload ảnh bên trên'} />
        <button type="button" className="btn btn-outline-secondary" disabled={uploading}
          onClick={() => fileInputRef.current?.click()} title="Upload từ máy tính">
          {uploading ? '⏳' : '⬆️'}
        </button>
        <button type="button" className="btn btn-outline-secondary"
          onClick={() => setPickerOpen(true)} title="Tìm ảnh Unsplash">🔍</button>
      </div>

      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/x-icon,image/vnd.microsoft.icon,.ico"
        style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }} />

      {pickerOpen && (
        <UnsplashPicker
          onSelect={url => { onChange(url); setPickerOpen(false) }}
          onClose={() => setPickerOpen(false)}
        />
      )}

      <style>{`@keyframes upload-progress{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}`}</style>
    </div>
  )
}
