import { useEffect, useState, useRef, type ChangeEvent } from 'react'
import { api } from '../../api/client'

interface MediaItem {
  id: number
  filename: string
  filepath: string
  filesize?: number
  filetype?: string
  alt_text?: string
  created_at: string
}

interface MediaResponse {
  data: MediaItem[]
  total: number
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selected, setSelected] = useState<MediaItem | null>(null)
  const [copied, setCopied] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    api.get<MediaResponse>('/media?limit=48')
      .then(res => { setItems(res.data); setTotal(res.total) })
      .catch(() => null)
      .finally(() => setLoading(false))
  }

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files?.length) return
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData()
        fd.append('file', file)
        await api.post('/media/upload', fd)
      }
      load()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Upload thất bại')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function handleDelete(item: MediaItem) {
    if (!confirm(`Xóa file "${item.filename}"?`)) return
    await api.delete(`/media/${item.id}`)
    setSelected(null)
    load()
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function formatSize(bytes?: number) {
    if (!bytes) return '—'
    if (bytes < 1024) return bytes + 'B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB'
    return (bytes / (1024 * 1024)).toFixed(1) + 'MB'
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Thư viện ảnh</div>
          <div className="page-sub">{total} files</div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {uploading && <span style={{ fontSize: '13px', color: 'var(--text-3)' }}>Đang upload...</span>}
          <label className="btn btn-accent" style={{ cursor: 'pointer' }}>
            + Upload ảnh
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleUpload}
            />
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Grid */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px,1fr))', gap: '10px' }}>
              {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="skeleton" style={{ aspectRatio: '1', borderRadius: '8px' }} />)}
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🖼</div>
              <p>Chưa có ảnh nào. Upload ảnh để bắt đầu.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px,1fr))', gap: '10px' }}>
              {items.map(item => (
                <div
                  key={item.id}
                  onClick={() => setSelected(item === selected ? null : item)}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selected?.id === item.id ? '2px solid var(--accent)' : '2px solid transparent',
                    position: 'relative',
                    background: 'var(--warm)',
                  }}
                >
                  <img
                    src={item.filepath}
                    alt={item.alt_text ?? item.filename}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Panel chi tiết */}
        {selected && (
          <div style={{ width: '240px', flexShrink: 0 }}>
            <div className="form-card">
              <img
                src={selected.filepath}
                alt={selected.filename}
                style={{ width: '100%', borderRadius: '8px', marginBottom: '12px', aspectRatio: '4/3', objectFit: 'cover' }}
              />
              <div style={{ fontSize: '12px', wordBreak: 'break-all', marginBottom: '8px', fontWeight: '500', color: 'var(--text)' }}>
                {selected.filename}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '12px' }}>
                {formatSize(selected.filesize)} · {selected.filetype?.split('/')[1]?.toUpperCase() ?? ''}
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>URL</div>
                <div style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  fontSize: '11px',
                  wordBreak: 'break-all',
                  color: 'var(--text-2)',
                  marginBottom: '6px',
                }}>
                  {selected.filepath}
                </div>
                <button
                  onClick={() => copyUrl(selected.filepath)}
                  className="btn btn-ghost btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {copied ? 'Đã sao chép!' : 'Sao chép URL'}
                </button>
              </div>
              <button
                onClick={() => handleDelete(selected)}
                className="btn btn-sm"
                style={{ width: '100%', justifyContent: 'center', background: '#fff0f0', color: 'var(--danger)', border: '1px solid #fdd' }}
              >
                Xóa file
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
