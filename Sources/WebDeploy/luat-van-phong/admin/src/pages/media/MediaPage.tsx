import { useEffect, useRef, useState } from 'react'
import { api } from '../../api/client'

interface MediaItem { id: number; filename: string; filepath: string; filesize: number; filetype: string; created_at: string }

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<MediaItem[]>('/media')) }
    finally { setLoading(false) }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    setUploading(true)
    try {
      await api.post('/media/upload', fd)
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

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url)
    alert('Đã copy URL')
  }

  if (loading) return <div className="loading">Đang tải...</div>

  const images = items.filter(i => i.filetype?.startsWith('image/'))
  const others = items.filter(i => !i.filetype?.startsWith('image/'))

  return (
    <>
      <div className="page-hdr">
        <h1>Media Library</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={handleUpload} accept="image/*,.pdf" />
          <button className="btn btn-primary" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? 'Đang upload...' : '+ Upload file'}
          </button>
        </div>
      </div>

      {images.length > 0 && (
        <>
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-2)', marginBottom: '12px' }}>Hình ảnh ({images.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px,1fr))', gap: '12px', marginBottom: '24px' }}>
            {images.map(item => (
              <div key={item.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                <img src={item.filepath} alt={item.filename} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                <div style={{ padding: '8px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '6px' }}>{item.filename}</div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => copyUrl(item.filepath)}>Copy</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>×</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {others.length > 0 && (
        <>
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-2)', marginBottom: '12px' }}>Files khác</h3>
          <div className="table-wrap">
            <table className="admin-table">
              <thead><tr><th>Tên file</th><th>Loại</th><th>Kích thước</th><th>Thao tác</th></tr></thead>
              <tbody>
                {others.map(item => (
                  <tr key={item.id}>
                    <td>{item.filename}</td>
                    <td style={{ fontSize: '12px', color: 'var(--text-3)' }}>{item.filetype}</td>
                    <td style={{ fontSize: '12px' }}>{item.filesize ? Math.round(item.filesize / 1024) + ' KB' : '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => copyUrl(item.filepath)}>Copy URL</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {items.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📸</div>
          <div className="empty-state-title">Chưa có file nào</div>
          <div className="empty-state-desc">Upload file để bắt đầu sử dụng</div>
        </div>
      )}
    </>
  )
}
