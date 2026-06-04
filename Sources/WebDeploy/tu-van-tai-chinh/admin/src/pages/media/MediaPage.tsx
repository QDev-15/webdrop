import React, { useEffect, useRef, useState } from 'react'
import { api } from '../../api/client'

interface Media { id: number; filename: string; filepath: string; filesize: number; filetype: string; created_at: string }

const BASE = import.meta.env.DEV ? '/api' : window.location.origin + '/api'

export default function MediaPage() {
  const [items, setItems] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Media[]>('/media')) }
    finally { setLoading(false) }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      await api.post('/media/upload', fd)
      load()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload thất bại.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa file này?')) return
    await api.delete(`/media/${id}`); load()
  }

  function copyUrl(item: Media) {
    const url = `${BASE}/uploads/${item.filename}`
    navigator.clipboard.writeText(url).then(() => alert('Đã copy URL!'))
  }

  const formatSize = (n: number) => n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)}MB` : `${Math.round(n / 1024)}KB`

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)' }}>Thư viện Media</h1>
        <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
          {uploading ? 'Đang upload...' : '+ Upload ảnh'}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-3)' }}>Đang tải...</p>
      ) : (
        <div className="media-grid">
          {items.map(item => (
            <div key={item.id} className="media-item">
              <img src={`${BASE}/uploads/${item.filename}`} alt={item.filename} />
              <div className="media-item-overlay">
                <button className="btn btn-ghost btn-sm" onClick={() => copyUrl(item)}>Copy URL</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Xóa</button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-3)' }}>
              Chưa có file nào. Upload ảnh để bắt đầu.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
