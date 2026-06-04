import { useState, useEffect, useRef } from 'react'
import { api } from '../../api/client'

interface MediaItem { id: number; filename: string; filepath: string; filesize: number; filetype: string; created_at: string }

export default function MediaPage() {
  const [items, setItems]   = useState<MediaItem[]>([])
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
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    try {
      await api.post('/media/upload', form)
      load()
    } catch (err) { alert(err instanceof Error ? err.message : 'Upload thất bại') }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = '' }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa file này?')) return
    await api.delete(`/media/${id}`)
    load()
  }

  function copyUrl(url: string, id: number) {
    navigator.clipboard.writeText(url).then(() => { setCopied(id); setTimeout(() => setCopied(null), 1500) })
  }

  if (loading) return <div className="loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Thư viện Media</h1><p className="page-sub">Quản lý ảnh và file</p></div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
          <button className="btn btn-primary" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? 'Đang upload...' : '+ Upload ảnh'}
          </button>
        </div>
      </div>
      {items.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="empty-state-icon">🖼</div><div className="empty-state-text">Chưa có file nào</div></div></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          {items.map(item => (
            <div key={item.id} className="card" style={{ padding: 12 }}>
              {item.filetype?.startsWith('image') && (
                <img src={item.filepath} alt={item.filename} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
              )}
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 8, wordBreak: 'break-all' }}>{item.filename}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => copyUrl(item.filepath, item.id)}>
                  {copied === item.id ? 'Đã copy!' : 'Copy URL'}
                </button>
                <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(item.id)}>×</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
