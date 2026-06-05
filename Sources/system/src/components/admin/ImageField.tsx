'use client'
import { useState, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'

const UnsplashPicker = dynamic(() => import('./UnsplashPicker'), { ssr: false })

interface Props {
  value: string
  onChange: (url: string) => void
  label?: string
  placeholder?: string
  hint?: string
}

async function uploadFile(file: File): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Upload thất bại')
  return data.url as string
}

export default function ImageField({ value, onChange, label, placeholder, hint }: Props) {
  const [pickerOpen,  setPickerOpen]  = useState(false)
  const [uploading,   setUploading]   = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [dragOver,    setDragOver]    = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) { setUploadError('Chỉ hỗ trợ file ảnh.'); return }
    setUploading(true); setUploadError('')
    try {
      const url = await uploadFile(file)
      onChange(url)
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload thất bại')
    } finally {
      setUploading(false)
    }
  }, [onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  return (
    <div>
      {label && (
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>
          {label}
        </label>
      )}
      {hint && <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 6 }}>{hint}</div>}

      {/* Drop zone + preview */}
      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => !value && fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? 'var(--accent)' : value ? 'transparent' : 'var(--border)'}`,
          borderRadius: 10,
          background: dragOver ? 'var(--accent-light)' : value ? 'transparent' : 'var(--warm)',
          transition: 'all .15s',
          cursor: value ? 'default' : 'pointer',
          overflow: 'hidden',
          marginBottom: 8,
        }}
      >
        {value ? (
          <div style={{ position: 'relative' }}>
            <img
              key={value}
              src={value}
              alt="preview"
              style={{ width: '100%', maxHeight: 180, objectFit: 'cover', display: 'block', borderRadius: 8 }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
            />
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onChange('') }}
              title="Xoá ảnh"
              style={{
                position: 'absolute', top: 8, right: 8,
                width: 28, height: 28, borderRadius: '50%',
                background: 'rgba(0,0,0,.5)', border: 'none',
                color: '#fff', fontSize: 14, cursor: 'pointer', lineHeight: 1,
              }}
            >✕</button>
          </div>
        ) : (
          <div style={{ padding: '20px 16px', textAlign: 'center' }}>
            {uploading ? (
              <div style={{ fontSize: 13, color: 'var(--accent)' }}>⏳ Đang upload...</div>
            ) : (
              <>
                <div style={{ fontSize: 24, marginBottom: 6 }}>⬆️</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 500 }}>Kéo ảnh vào đây để upload</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>hoặc click để chọn file · JPG, PNG, WEBP, GIF, ICO · tối đa 10MB</div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Upload progress bar */}
      {uploading && (
        <div style={{ height: 3, background: 'var(--border)', borderRadius: 2, marginBottom: 8, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'var(--accent)', width: '60%', animation: 'upload-progress 1.2s ease-in-out infinite' }} />
        </div>
      )}

      {/* Error */}
      {uploadError && (
        <div style={{ fontSize: 12, color: 'var(--danger)', marginBottom: 8, padding: '6px 10px', background: '#fef2f2', borderRadius: 6, border: '1px solid #fecaca' }}>
          {uploadError}
        </div>
      )}

      {/* URL input row */}
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          type="text"
          value={value}
          onChange={e => { setUploadError(''); onChange(e.target.value) }}
          placeholder={placeholder || 'https://... hoặc upload ảnh bên trên'}
          style={{
            flex: 1, padding: '8px 11px', borderRadius: 8,
            border: '1px solid var(--border)', background: 'var(--bg)',
            fontSize: 12, fontFamily: 'var(--sans)', outline: 'none', color: 'var(--text)',
          }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          title="Upload từ máy tính"
          style={{
            padding: '8px 11px', borderRadius: 8, border: '1px solid var(--border)',
            background: 'var(--warm)', cursor: uploading ? 'not-allowed' : 'pointer',
            fontSize: 13, color: uploading ? 'var(--text-3)' : 'var(--text-2)',
            fontFamily: 'var(--sans)', whiteSpace: 'nowrap', flexShrink: 0,
            opacity: uploading ? .6 : 1,
          }}
        >
          {uploading ? '⏳' : '⬆️'} Upload
        </button>
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          title="Tìm ảnh Unsplash"
          style={{
            padding: '8px 11px', borderRadius: 8, border: '1px solid var(--border)',
            background: 'var(--warm)', cursor: 'pointer', fontSize: 13,
            color: 'var(--text-2)', fontFamily: 'var(--sans)', whiteSpace: 'nowrap', flexShrink: 0,
          }}
        >
          🔍 Unsplash
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/x-icon,image/vnd.microsoft.icon,.ico"
        style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }}
      />

      {pickerOpen && (
        <UnsplashPicker
          onSelect={url => { onChange(url); setPickerOpen(false) }}
          onClose={() => setPickerOpen(false)}
        />
      )}

      <style href="image-field-styles" precedence="default">{`
        @keyframes upload-progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  )
}
