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

  const load = () => {
    setLoading(true)
    api.get<MediaItem[]>('/media').then(setItems).catch(console.error).finally(() => setLoading(false))
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
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Upload thất bại')
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

  const copyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.filepath)
    setCopied(item.id)
    setTimeout(() => setCopied(null), 2000)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Media</div><div className="page-sub">Thư viện ảnh và file upload</div></div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {uploading && <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>Đang upload...</span>}
          <button className="btn-accent" onClick={() => fileRef.current?.click()} disabled={uploading}>Upload ảnh</button>
          <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleUpload} />
        </div>
      </div>

      {loading ? <div className="empty-state"><div className="empty-state-text">Đang tải...</div></div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
          {items.map(item => (
            <div key={item.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ aspectRatio: '1', overflow: 'hidden', background: 'var(--warm)' }}>
                <img src={item.filepath} alt={item.alt_text || item.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => (e.currentTarget.style.display = 'none')} />
              </div>
              <div style={{ padding: '8px 10px' }}>
                <div style={{ fontSize: '11.5px', fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '4px' }}>{item.filename}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '8px' }}>{formatSize(item.filesize)}</div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button className="btn-ghost btn-sm" style={{ flex: 1, fontSize: '11px', padding: '4px' }} onClick={() => copyUrl(item)}>
                    {copied === item.id ? 'Đã copy!' : 'Copy URL'}
                  </button>
                  <button className="btn-danger btn-sm btn-icon" onClick={() => handleDelete(item.id)} title="Xóa">✕</button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div style={{ gridColumn: '1/-1' }}>
              <div className="empty-state"><div className="empty-state-icon">📸</div><div className="empty-state-text">Chưa có file nào</div></div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
