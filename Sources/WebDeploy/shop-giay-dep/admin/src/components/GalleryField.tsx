import { useState } from 'react'
import ImageField from './ImageField'

interface Props {
  value: string  // JSON array string, hoặc rỗng
  onChange: (v: string) => void
}

function parseUrls(raw: string): string[] {
  if (!raw.trim()) return []
  try {
    const p = JSON.parse(raw)
    return Array.isArray(p) ? (p as unknown[]).filter((x): x is string => typeof x === 'string' && x.trim() !== '') : []
  } catch {
    return []
  }
}

function serializeUrls(arr: string[]): string {
  return arr.length > 0 ? JSON.stringify(arr) : ''
}

export default function GalleryField({ value, onChange }: Props) {
  const [adding, setAdding]   = useState(false)
  const [newUrl, setNewUrl]   = useState('')

  const images = parseUrls(value)

  const update = (arr: string[]) => onChange(serializeUrls(arr))

  const remove = (i: number) => update(images.filter((_, idx) => idx !== i))

  const confirmAdd = () => {
    const url = newUrl.trim()
    if (!url) return
    update([...images, url])
    setNewUrl('')
    setAdding(false)
  }

  const cancelAdd = () => {
    setAdding(false)
    setNewUrl('')
  }

  return (
    <div>
      {/* Grid thumbnails hiện có */}
      {images.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
          {images.map((url, i) => (
            <div
              key={i}
              style={{
                position: 'relative',
                width: 100,
                height: 100,
                borderRadius: 8,
                overflow: 'hidden',
                border: '1px solid var(--border)',
                background: 'var(--warm)',
                flexShrink: 0,
              }}
            >
              <img
                src={url}
                alt={`Gallery ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.25' }}
              />
              {/* Label số thứ tự */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'rgba(0,0,0,.45)', color: '#fff',
                fontSize: 10, textAlign: 'center', padding: '2px 0', lineHeight: 1.6,
              }}>
                Ảnh {i + 1}
              </div>
              {/* Nút xóa */}
              <button
                type="button"
                onClick={() => remove(i)}
                title="Xóa ảnh này"
                style={{
                  position: 'absolute', top: 4, right: 4,
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'rgba(0,0,0,.6)', border: 'none', color: '#fff',
                  fontSize: 11, cursor: 'pointer', lineHeight: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: 0,
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 10, marginTop: 2 }}>
          Chưa có ảnh gallery — chỉ ảnh chính được hiển thị trong trang chi tiết.
        </p>
      )}

      {/* Panel thêm ảnh mới */}
      {adding ? (
        <div style={{
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: 16,
          background: 'var(--bg)',
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 12 }}>
            Thêm ảnh vào gallery
          </div>
          <ImageField value={newUrl} onChange={setNewUrl} />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!newUrl.trim()}
              onClick={confirmAdd}
              style={{ fontSize: 13 }}
            >
              ＋ Thêm vào gallery
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={cancelAdd}
              style={{ fontSize: 13 }}
            >
              Hủy
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '7px 14px',
            border: '1.5px dashed var(--border)', borderRadius: 8,
            background: 'transparent', color: 'var(--text-2)',
            fontSize: 13, cursor: 'pointer', transition: 'border-color .15s, color .15s',
          }}
          onMouseEnter={e => {
            const b = e.currentTarget
            b.style.borderColor = 'var(--accent)'
            b.style.color = 'var(--accent)'
          }}
          onMouseLeave={e => {
            const b = e.currentTarget
            b.style.borderColor = 'var(--border)'
            b.style.color = 'var(--text-2)'
          }}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>＋</span>
          Thêm ảnh gallery
        </button>
      )}

      {images.length > 0 && (
        <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 8, marginBottom: 0 }}>
          {images.length} ảnh · Nhấn ✕ để xóa từng ảnh
        </p>
      )}
    </div>
  )
}
