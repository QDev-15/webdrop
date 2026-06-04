import { useEffect, useRef, useState } from 'react'
import { api } from '../../api/client'

interface MediaItem { id: number; filename: string; filepath: string; filesize: number; filetype: string; created_at: string }

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const load = () => { api.get<MediaItem[]>('/media').then(setItems).catch(console.error).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      await api.upload('/media/upload', fd)
      load()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Upload thất bại.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const getUrl = (item: MediaItem) => {
    const base = window.location.origin + '/api/uploads/'
    return base + item.filepath
  }

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Media Library</div><div className="page-subtitle">Quản lý ảnh và tệp</div></div>
        <div>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
          <button onClick={() => fileInputRef.current?.click()} className="btn-accent" disabled={uploading}>
            {uploading ? 'Đang upload...' : '+ Upload ảnh'}
          </button>
        </div>
      </div>
      {loading ? <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div> :
        items.length === 0 ? <div className="empty-state"><div className="empty-state-icon">📸</div><div className="empty-state-text">Chưa có file nào. Upload ảnh đầu tiên.</div></div> : (
          <div className="media-grid">
            {items.map(item => (
              <div key={item.id} className="media-item" title={item.filename}>
                <img src={getUrl(item)} alt={item.filename} loading="lazy" />
                <div className="media-item-name">{item.filename}</div>
                <div style={{ display: 'flex', gap: '4px', padding: '4px 6px' }}>
                  <button onClick={() => navigator.clipboard.writeText(getUrl(item))} className="btn-ghost btn-sm" style={{ flex: 1, fontSize: '10px', padding: '3px' }}>Copy URL</button>
                  <button onClick={async () => { if (confirm('Xóa?')) { await api.delete(`/media/${item.id}`); load() } }} className="btn-danger btn-sm" style={{ fontSize: '10px', padding: '3px 6px' }}>×</button>
                </div>
              </div>
            ))}
          </div>
        )}
    </>
  )
}
