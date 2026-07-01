'use client'

import { useRef, useState } from 'react'
import type { CvDataType } from '@/types/cv'

interface Props {
  data: CvDataType
  onChange: (patch: Partial<CvDataType>) => void
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b6760', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 11px', border: '1px solid #e8e5df', borderRadius: 8,
  fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box', color: '#1a1917',
}

function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '')).toUpperCase()
}

export default function PersonalSection({ data, onChange }: Props) {
  const v = (key: keyof CvDataType) => (data[key] as string) ?? ''
  const set = (key: keyof CvDataType) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange({ [key]: e.target.value })

  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState('')

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    // Reset input so same file can be re-picked
    e.target.value = ''

    setUploading(true)
    setUploadError('')
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/cv/avatar', { method: 'POST', body: form })
      const data2 = await res.json()
      if (!res.ok) {
        setUploadError(data2.error || 'Upload thất bại')
        return
      }
      onChange({ avatarUrl: data2.url })
    } catch {
      setUploadError('Lỗi kết nối, vui lòng thử lại')
    } finally {
      setUploading(false)
    }
  }

  function applyUrl() {
    if (!urlInput.trim()) return
    onChange({ avatarUrl: urlInput.trim() })
    setUrlInput('')
    setShowUrlInput(false)
  }

  function removeAvatar() {
    onChange({ avatarUrl: null })
  }

  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1917', marginBottom: 20 }}>Thông tin cá nhân</div>

      {/* Avatar upload */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b6760', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 10 }}>
          Ảnh đại diện
        </label>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Avatar preview */}
          <div
            onClick={() => !uploading && fileRef.current?.click()}
            style={{
              width: 80, height: 80, borderRadius: '50%', flexShrink: 0,
              cursor: uploading ? 'wait' : 'pointer',
              position: 'relative', overflow: 'hidden',
              border: '2px dashed #e8e5df',
              background: data.avatarUrl ? 'transparent' : '#f5f0e8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {data.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.avatarUrl}
                alt="avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              />
            ) : (
              <span style={{ fontSize: 22, fontWeight: 700, color: '#a09d97', letterSpacing: 1 }}>
                {getInitials(data.fullName)}
              </span>
            )}

            {/* Hover overlay */}
            {!uploading && (
              <div style={{
                position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0, transition: 'opacity .15s', borderRadius: '50%',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = '1' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = '0' }}
              >
                <span style={{ fontSize: 20 }}>📷</span>
              </div>
            )}

            {uploading && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div style={{ flex: 1 }}>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              style={{ display: 'block', width: '100%', padding: '8px 12px', background: '#fff', border: '1px solid #e8e5df', borderRadius: 8, fontSize: 13, cursor: uploading ? 'wait' : 'pointer', fontFamily: 'inherit', color: '#1a1917', textAlign: 'left', marginBottom: 6, opacity: uploading ? .6 : 1 }}
            >
              {uploading ? '⏳ Đang upload...' : '📁 Chọn ảnh từ máy'}
            </button>
            <button
              onClick={() => setShowUrlInput(v => !v)}
              style={{ display: 'block', width: '100%', padding: '8px 12px', background: '#fff', border: '1px solid #e8e5df', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#6b6760', textAlign: 'left', marginBottom: data.avatarUrl ? 6 : 0 }}
            >
              🔗 Dùng link URL
            </button>
            {data.avatarUrl && (
              <button
                onClick={removeAvatar}
                style={{ display: 'block', width: '100%', padding: '8px 12px', background: '#fff', border: '1px solid #fecaca', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#dc2626', textAlign: 'left' }}
              >
                ✕ Xóa ảnh
              </button>
            )}
          </div>
        </div>

        {/* URL input */}
        {showUrlInput && (
          <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
            <input
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && applyUrl()}
              placeholder="https://example.com/photo.jpg"
              style={{ ...inputStyle, flex: 1, fontSize: 13 }}
            />
            <button
              onClick={applyUrl}
              style={{ padding: '8px 14px', background: '#1a6b52', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
            >
              Áp dụng
            </button>
          </div>
        )}

        {uploadError && (
          <div style={{ marginTop: 8, fontSize: 12, color: '#dc2626' }}>{uploadError}</div>
        )}

        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" style={{ display: 'none' }} onChange={handleFileChange} />
      </div>

      <Field label="Họ và tên">
        <input style={inputStyle} value={v('fullName')} onChange={set('fullName')} placeholder="Nguyễn Văn A" />
      </Field>
      <Field label="Chức danh">
        <input style={inputStyle} value={v('jobTitle')} onChange={set('jobTitle')} placeholder="Frontend Developer" />
      </Field>
      <Field label="Giới thiệu bản thân">
        <textarea
          value={v('summary')} onChange={set('summary')}
          placeholder="Mô tả ngắn về bản thân, điểm mạnh và mục tiêu nghề nghiệp..."
          rows={4}
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
        />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Email">
          <input style={inputStyle} type="email" value={v('email')} onChange={set('email')} placeholder="email@example.com" />
        </Field>
        <Field label="Số điện thoại">
          <input style={inputStyle} value={v('phone')} onChange={set('phone')} placeholder="0901 234 567" />
        </Field>
        <Field label="Địa chỉ / Thành phố">
          <input style={inputStyle} value={v('location')} onChange={set('location')} placeholder="TP. Hồ Chí Minh" />
        </Field>
        <Field label="Website / Portfolio">
          <input style={inputStyle} value={v('website')} onChange={set('website')} placeholder="https://..." />
        </Field>
        <Field label="LinkedIn">
          <input style={inputStyle} value={v('linkedin')} onChange={set('linkedin')} placeholder="linkedin.com/in/..." />
        </Field>
        <Field label="GitHub">
          <input style={inputStyle} value={v('github')} onChange={set('github')} placeholder="github.com/..." />
        </Field>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
