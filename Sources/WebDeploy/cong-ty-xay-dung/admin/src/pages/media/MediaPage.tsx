import { useEffect, useRef, useState } from 'react'
import { api, uploadMedia } from '../../api/client'

interface Media {
  id: number; filename: string; filepath: string; filetype: string; alt_text: string; created_at: string
}

export default function MediaPage() {
  const [items, setItems] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { load() }, [])
  async function load() {
    try { setItems(await api.get('/media')) }
    finally { setLoading(false) }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await uploadMedia(file)
      load()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload lỗi')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa ảnh này?')) return
    await api.delete(`/media/${id}`)
    load()
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(url)
      setTimeout(() => setCopied(''), 2000)
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Thư viện Media</h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Quản lý ảnh upload — tối đa 5MB, JPG/PNG/WebP</p>
        </div>
        <div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
          <button className="btn btn-primary" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? 'Đang upload...' : '+ Upload ảnh'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card"><p style={{ color: 'var(--text-3)' }}>Đang tải...</p></div>
      ) : items.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon">🖼</div>
          <div className="empty-state-text">Chưa có ảnh nào. Upload ảnh đầu tiên.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {items.map(m => (
            <div key={m.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ position: 'relative', paddingTop: '75%' }}>
                <img src={m.filepath} alt={m.alt_text} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '8px 10px' }}>
                <div style={{ fontSize: 11, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 6 }}>{m.filename}</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: 11 }} onClick={() => copyUrl(m.filepath)}>
                    {copied === m.filepath ? '✓ Đã copy' : 'Copy URL'}
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m.id)} style={{ padding: '5px 8px' }}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
