import { useEffect, useState, useRef } from 'react'
import { api, upload } from '../../api/client'

interface Media {
  id: number; filename: string; filepath: string
  filetype: string; filesize: number; alt_text: string; created_at: string
}

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + 'B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB'
  return (bytes / 1024 / 1024).toFixed(1) + 'MB'
}

export default function MediaList() {
  const [media, setMedia]   = useState<Media[]>([])
  const [loading, setLoad]  = useState(true)
  const [busy, setBusy]     = useState(false)
  const [toast, setToast]   = useState('')
  const [copied, setCopied] = useState('')
  const fileRef             = useRef<HTMLInputElement>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoad(true)
    try { setMedia(await api.get<Media[]>('/media')) }
    finally { setLoad(false) }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files?.length) return
    setBusy(true)
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData()
        fd.append('file', file)
        const m = await upload('/media', fd)
        setMedia(prev => [m, ...prev])
      }
      show('Upload thành công')
    } catch (err: unknown) {
      show(err instanceof Error ? err.message : 'Upload thất bại', true)
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function remove(id: number) {
    if (!confirm('Xóa file này?')) return
    try {
      await api.delete('/media/' + id)
      setMedia(m => m.filter(x => x.id !== id))
      show('Đã xóa')
    } catch (e: unknown) { show(e instanceof Error ? e.message : 'Lỗi', true) }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(url); setTimeout(() => setCopied(''), 2000)
    })
  }

  function show(msg: string, err = false) {
    setToast((err ? 'E:' : '') + msg); setTimeout(() => setToast(''), 3000)
  }

  return (
    <div>
      <div className="page-hd">
        <h2>Media</h2>
        <div className="d-flex gap-2">
          <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleUpload} />
          <button className="btn-accent" onClick={() => fileRef.current?.click()} disabled={busy}>
            {busy ? 'Đang upload...' : '+ Upload ảnh'}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-3)' }}>Đang tải...</div>
      ) : media.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">📸</div><p>Chưa có file nào. Nhấn Upload để thêm ảnh.</p></div>
      ) : (
        <div className="row g-3">
          {media.map(m => (
            <div className="col-6 col-md-3 col-lg-2" key={m.id}>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
                <img
                  src={m.filepath}
                  alt={m.alt_text || m.filename}
                  style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
                  loading="lazy"
                />
                <div style={{ padding: '8px 10px' }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {m.filename}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{formatSize(m.filesize)}</div>
                  <div className="d-flex gap-1 mt-1">
                    <button
                      className="btn-icon"
                      style={{ fontSize: 11, padding: '2px 5px', flex: 1, background: copied === m.filepath ? 'var(--accent-light)' : undefined }}
                      onClick={() => copyUrl(m.filepath)}
                      title="Copy URL"
                    >
                      {copied === m.filepath ? '✓' : '⧉'}
                    </button>
                    <button className="btn-icon" style={{ fontSize: 11, color: 'var(--danger)' }} onClick={() => remove(m.id)}>✕</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.startsWith('E:') ? 'toast-error' : 'toast-success'}`}>{toast.replace(/^E:/, '')}</div>
        </div>
      )}
    </div>
  )
}
