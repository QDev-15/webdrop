import { useEffect, useRef, useState } from 'react'
import { api } from '../../api/client'

interface MediaItem {
  id: number
  filename: string
  filepath: string
  filetype: string
  filesize: number
  alt_text: string
  created_at: string
}

const BASE = import.meta.env.DEV ? '/api' : (window.location.origin + '/api')

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
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      await fetch(`${BASE}/media`, { method: 'POST', credentials: 'include', body: form })
      load()
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa file này?')) return
    await api.delete(`/media/${id}`)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function copyUrl(item: MediaItem) {
    navigator.clipboard.writeText(item.filepath)
    setCopied(item.id)
    setTimeout(() => setCopied(null), 2000)
  }

  if (loading) return <div style={{ color: 'var(--text-3)', fontSize: '14px' }}>Đang tải...</div>

  return (
    <>
      <div className="page-hd">
        <div>
          <h1 className="page-hd-title">Media Library</h1>
          <div className="page-hd-sub">{items.length} file</div>
        </div>
        <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
          {uploading ? 'Đang upload...' : '+ Upload ảnh'}
          <input type="file" ref={fileRef} style={{ display: 'none' }} accept="image/*" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {items.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-3)' }}>
          Chưa có file nào. Click "Upload ảnh" để bắt đầu.
        </div>
      ) : (
        <div className="media-grid">
          {items.map(item => (
            <div key={item.id} className="media-item">
              <img src={item.filepath} alt={item.alt_text || item.filename} className="media-thumb" />
              <div className="media-name">{item.filename}</div>
              <div style={{ padding: '0 8px 8px', display: 'flex', gap: '4px' }}>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: '10px', padding: '4px 8px' }} onClick={() => copyUrl(item)}>
                  {copied === item.id ? '✓ Copied' : 'Copy URL'}
                </button>
                <button className="btn btn-danger btn-sm" style={{ fontSize: '10px', padding: '4px 8px' }} onClick={() => handleDelete(item.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
