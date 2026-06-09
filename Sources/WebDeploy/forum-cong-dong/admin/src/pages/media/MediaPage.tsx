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
  const [copied, setCopied] = useState<number | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<MediaItem[]>('/media')) }
    finally { setLoading(false) }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Upload thất bại')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa file này?')) return
    await api.delete(`/media/${id}`)
    load()
  }

  function copyUrl(item: MediaItem) {
    navigator.clipboard.writeText(item.filepath)
    setCopied(item.id)
    setTimeout(() => setCopied(null), 2000)
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(1) + ' MB'
  }

  const isImage = (t: string) => t?.startsWith('image/')

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Thư viện Media</div>
          <div className="page-sub">Quản lý ảnh và file đã upload</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleUpload}
          />
          <button className="btn-accent" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? 'Đang upload...' : '+ Upload ảnh'}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-3)' }}>Đang tải...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📸</div>
          <div className="empty-state-text">Chưa có file nào được upload</div>
          <button className="btn-accent" style={{ marginTop: 16 }} onClick={() => fileRef.current?.click()}>
            Upload ảnh đầu tiên
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {items.map(item => (
            <div key={item.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
              {isImage(item.filetype) ? (
                <img
                  src={item.filepath}
                  alt={item.alt_text || item.filename}
                  style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div style={{ width: '100%', height: 120, background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                  📄
                </div>
              )}
              <div style={{ padding: '8px 10px' }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>
                  {item.filename}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 8 }}>
                  {formatSize(item.filesize)}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    className="btn-ghost btn-sm"
                    style={{ flex: 1, fontSize: 10 }}
                    onClick={() => copyUrl(item)}
                  >
                    {copied === item.id ? 'Đã copy!' : 'Copy URL'}
                  </button>
                  <button
                    className="btn-danger btn-sm btn-icon"
                    onClick={() => handleDelete(item.id)}
                    title="Xóa"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
