import { useEffect, useState, useRef } from 'react'
import { api } from '../../api/client'

interface MediaItem {
  id: number
  filename: string
  filepath: string
  filesize: number
  filetype: string
  alt_text: string
  created_at: string
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setItems(await api.get<MediaItem[]>('/media'))
    } finally {
      setLoading(false)
    }
  }

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true); setError('')
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData()
        fd.append('file', file)
        await api.upload('/media/upload', fd)
      }
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload thất bại')
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa file này?')) return
    await api.delete(`/media/${id}`)
    load()
  }

  function copyUrl(filepath: string) {
    navigator.clipboard.writeText(filepath).then(() => alert('Đã copy URL!'))
  }

  function formatSize(bytes: number) {
    if (!bytes) return '—'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(1) + ' MB'
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Thư viện Media</div>
          <div className="page-sub">Quản lý hình ảnh và file đã upload</div>
        </div>
        <button className="btn-accent" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? 'Đang upload...' : '+ Upload ảnh'}
        </button>
      </div>

      <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: 'none' }}
        onChange={e => handleUpload(e.target.files)} />

      {error && <div className="alert alert-error">{error}</div>}

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📸</div>
          <div className="empty-state-text">Chưa có file nào. Click "Upload ảnh" để thêm.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {items.map(item => (
            <div key={item.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ aspectRatio: '1', overflow: 'hidden', background: 'var(--warm)' }}>
                {item.filetype?.startsWith('image/') ? (
                  <img src={item.filepath} alt={item.alt_text || item.filename}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>📄</div>
                )}
              </div>
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: 11, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>{item.filename}</div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 8 }}>{formatSize(item.filesize)}</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn-ghost btn-sm" style={{ flex: 1, fontSize: 11 }} onClick={() => copyUrl(item.filepath)}>Copy URL</button>
                  <button className="btn-danger btn-sm" onClick={() => handleDelete(item.id)}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
