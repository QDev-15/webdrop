import { useEffect, useRef, useState } from 'react'
import { api, uploadFile } from '../../api/client'

interface Media { id: number; filename: string; filepath: string; filetype: string; filesize: number; alt_text: string; created_at: string }

function fmtSize(n: number) { return n > 1024*1024 ? (n/(1024*1024)).toFixed(1)+'MB' : (n/1024).toFixed(0)+'KB' }

export default function MediaPage() {
  const [items, setItems] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selected, setSelected] = useState<Media | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => { setLoading(true); api.get<Media[]>('/media').then(setItems).catch(() => {}).finally(() => setLoading(false)) }
  useEffect(load, [])

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return
    setUploading(true)
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('alt_text', file.name)
      await uploadFile('/media', fd).catch(() => {})
    }
    setUploading(false)
    load()
  }

  const del = async (id: number) => {
    if (!confirm('Xóa file này?')) return
    await api.delete(`/media/${id}`)
    if (selected?.id === id) setSelected(null)
    load()
  }

  return (
    <>
      <div className="page-hd">
        <div><h1 className="page-hd-title">Media Library</h1><div className="page-hd-sub">{items.length} files</div></div>
        <div className="d-flex gap-2">
          <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => handleUpload(e.target.files)} />
          <button className="btn btn-primary" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? 'Đang upload...' : '+ Upload ảnh'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 280px' : '1fr', gap: '20px' }}>
        <div className="card">
          {loading ? <p className="text-muted">Đang tải...</p> : (
            <div className="media-grid">
              {items.map(m => (
                <div key={m.id} className={`media-item${selected?.id === m.id ? ' border border-accent' : ''}`} onClick={() => setSelected(m)}>
                  <img src={m.filepath} alt={m.alt_text} className="media-thumb" />
                  <div className="media-name">{m.filename}</div>
                </div>
              ))}
              {!items.length && <p className="text-muted">Chưa có file nào.</p>}
            </div>
          )}
        </div>

        {selected && (
          <div className="card" style={{ alignSelf: 'start' }}>
            <img src={selected.filepath} alt={selected.alt_text} style={{ width: '100%', borderRadius: '8px', marginBottom: '14px' }} />
            <div className="form-label">Tên file</div>
            <div style={{ fontSize: '13px', marginBottom: '12px', wordBreak: 'break-all' }}>{selected.filename}</div>
            <div className="form-label">URL</div>
            <input className="form-control mb-3" readOnly value={selected.filepath} onClick={e => (e.target as HTMLInputElement).select()} />
            <div className="form-label">Kích thước</div>
            <div style={{ fontSize: '13px', marginBottom: '12px' }}>{fmtSize(selected.filesize)}</div>
            <div className="d-flex gap-2 mt-3">
              <button onClick={() => navigator.clipboard.writeText(selected.filepath)} className="btn btn-ghost btn-sm" style={{ flex: 1 }}>Copy URL</button>
              <button onClick={() => del(selected.id)} className="btn btn-danger btn-sm">Xóa</button>
            </div>
            <button onClick={() => setSelected(null)} className="btn btn-ghost btn-sm mt-3" style={{ width: '100%' }}>Đóng</button>
          </div>
        )}
      </div>
    </>
  )
}
