'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'

const UnsplashPicker = dynamic(() => import('./UnsplashPicker'), { ssr: false })

interface Props {
  value: string
  onChange: (url: string) => void
  label?: string
  placeholder?: string
  hint?: string
}

export default function ImageField({ value, onChange, label, placeholder, hint }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false)

  return (
    <div>
      {label && (
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>
          {label}
        </label>
      )}
      {hint && (
        <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 6 }}>{hint}</div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder || 'https://images.unsplash.com/...'}
          style={{
            flex: 1, padding: '9px 12px', borderRadius: 8,
            border: '1px solid var(--border)', background: 'var(--bg)',
            fontSize: 13, fontFamily: 'var(--sans)', outline: 'none',
            color: 'var(--text)',
          }}
        />
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          title="Tìm ảnh Unsplash"
          style={{
            padding: '9px 13px', borderRadius: 8, border: '1px solid var(--border)',
            background: 'var(--warm)', cursor: 'pointer', fontSize: 13,
            color: 'var(--text-2)', fontFamily: 'var(--sans)', whiteSpace: 'nowrap',
            transition: 'all .15s', flexShrink: 0,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--warm2)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--warm)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)' }}
        >
          🔍 Unsplash
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            title="Xóa ảnh"
            style={{
              padding: '9px 11px', borderRadius: 8, border: '1px solid var(--border)',
              background: 'transparent', cursor: 'pointer', fontSize: 14,
              color: 'var(--text-3)', lineHeight: 1, flexShrink: 0,
            }}
          >✕</button>
        )}
      </div>

      {value && (
        <div style={{ marginTop: 8, position: 'relative', display: 'inline-block' }}>
          <img
            key={value}
            src={value}
            alt="preview"
            style={{ height: 80, maxWidth: '100%', borderRadius: 7, objectFit: 'cover', border: '1px solid var(--border)', display: 'block' }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
        </div>
      )}

      {pickerOpen && (
        <UnsplashPicker
          onSelect={url => { onChange(url); setPickerOpen(false) }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  )
}
