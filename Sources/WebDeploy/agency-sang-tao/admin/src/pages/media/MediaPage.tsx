import { useEffect, useState, type ChangeEvent } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
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
  const [items, setItems]       = useState<MediaItem[]>([])
  const [loading, setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)

  const load = () => {
    setLoading(true)
    api.get<MediaItem[]>('/media').then(setItems).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      await api.upload('/media/upload', fd)
      load()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload thất bại')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa file này?')) return
    await api.delete(`/media/${id}`)
    load()
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => alert('Đã copy URL!'))
  }

  return (
    <AdminLayout title="Media">
      <div className="page-header">
        <div>
          <h1 className="page-title">Thư viện Media</h1>
          <p className="page-sub">Quản lý file ảnh đã upload</p>
        </div>
        <label className="btn-accent" style={{ cursor: 'pointer' }}>
          {uploading ? 'Đang upload...' : '+ Upload ảnh'}
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
      {loading ? (
        <div className="empty-state"><div className="empty-state-icon">⏳</div><div className="empty-state-text">Đang tải...</div></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {items.map(item => (
            <div key={item.id} style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'var(--surface)' }}>
              <div style={{ aspectRatio: '1', overflow: 'hidden', background: 'var(--warm)' }}>
                <img src={item.filepath} alt={item.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '8px' }}>
                <div style={{ fontSize: 11, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.filename}</div>
                <div className="d-flex gap-1 mt-2">
                  <button className="btn-ghost btn-sm" onClick={() => copyToClipboard(item.filepath)} title="Copy URL">📋</button>
                  <button className="btn-danger btn-sm" onClick={() => handleDelete(item.id)} title="Xóa">🗑</button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: 'var(--text-3)' }}>
              Chưa có file nào. Upload ảnh để bắt đầu.
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  )
}
