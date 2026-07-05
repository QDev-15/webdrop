import { useEffect, useState, useRef } from 'react'
import { api } from '../../api/client'

interface MediaItem {
  id: number
  filename: string
  filepath: string
  filesize: number
  filetype: string
  created_at: string
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { load() }, [])

  const load = async () => {
    try { setItems(await api.get<MediaItem[]>('/media')) }
    finally { setLoading(false) }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData()
        fd.append('file', file)
        await api.upload('/media/upload', fd)
      }
      load()
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa file này?')) return
    await api.delete(`/media/${id}`)
    load()
  }

  const fmtSize = (bytes: number) => {
    if (!bytes) return '—'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1048576).toFixed(1) + ' MB'
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Media</div>
          <div className="page-sub">Quản lý ảnh và file đã upload</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => fileRef.current?.click()} className="btn-accent" disabled={uploading}>
            {uploading ? '⏳ Đang upload...' : '⬆️ Upload ảnh'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleUpload} />
        </div>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-3)', fontSize: 14 }}>Đang tải...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📸</div>
          <div className="empty-state-text">Chưa có file nào. Upload ảnh để bắt đầu.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {items.map(item => (
            <div key={item.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ aspectRatio: '1', overflow: 'hidden', background: 'var(--bg)' }}>
                <img
                  src={item.filepath}
                  alt={item.filename}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />
              </div>
              <div style={{ padding: '8px 10px' }}>
                <div style={{ fontSize: 11, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>{item.filename}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 6 }}>{fmtSize(item.filesize)}</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    onClick={() => { navigator.clipboard.writeText(item.filepath) }}
                    className="btn-ghost btn-sm"
                    title="Copy URL"
                    style={{ fontSize: 11 }}
                  >
                    Copy
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="btn-danger btn-sm" style={{ fontSize: 11 }}>Xóa</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
