import { useState, useEffect, useRef, useCallback } from 'react'
import { api } from '../api/client'

interface UnsplashPhoto {
  id: string
  thumb: string
  regular: string
  alt: string
  author: string
  authorUrl: string
  downloadLocation: string
}

interface Props {
  onSelect: (url: string) => void
  onClose: () => void
}

export default function UnsplashPicker({ onSelect, onClose }: Props) {
  const [query,      setQuery]      = useState('')
  const [results,    setResults]    = useState<UnsplashPhoto[]>([])
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')
  const [page,       setPage]       = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [hoveredId,  setHoveredId]  = useState<string | null>(null)
  const inputRef    = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [onClose])

  const search = useCallback(async (q: string, pg: number) => {
    if (!q.trim()) { setResults([]); setTotalPages(0); return }
    setLoading(true); setError('')
    try {
      const data = await api.get<{ results: UnsplashPhoto[]; total: number; total_pages: number }>(
        `/unsplash?q=${encodeURIComponent(q)}&page=${pg}`
      )
      setResults(pg === 1 ? data.results : prev => [...prev, ...data.results])
      setTotalPages(data.total_pages ?? 0)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi tìm kiếm')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleQueryChange = (val: string) => {
    setQuery(val); setPage(1)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(val, 1), 500)
  }

  const handleLoadMore = () => {
    const next = page + 1; setPage(next); search(query, next)
  }

  const handleSelect = (photo: UnsplashPhoto) => {
    onSelect(photo.regular)
    if (photo.downloadLocation) {
      api.post('/unsplash', { downloadLocation: photo.downloadLocation }).catch(() => {})
    }
    onClose()
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 780, maxHeight: '88vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,.25)' }}>
        {/* Header */}
        <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: '#9ca3af', pointerEvents: 'none' }}>🔍</span>
            <input ref={inputRef} value={query} onChange={e => handleQueryChange(e.target.value)}
              placeholder="Tìm ảnh Unsplash... (vd: agency, branding, design)"
              style={{ width: '100%', padding: '9px 12px 9px 38px', borderRadius: 9, border: '1px solid #e5e7eb', background: '#f9fafb', fontSize: 14, outline: 'none', color: '#111827' }} />
          </div>
          <button onClick={onClose} style={{ padding: '8px 10px', background: '#f3f4f6', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>✕</button>
        </div>
        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {!query && !loading && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🖼</div>
              <div style={{ fontSize: 13 }}>Nhập từ khóa để tìm ảnh miễn phí từ Unsplash</div>
              <div style={{ fontSize: 12, marginTop: 8 }}>Gợi ý: branding · agency · team · office · design</div>
            </div>
          )}
          {error && (
            <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, fontSize: 13, color: '#991b1b', marginBottom: 16 }}>{error}</div>
          )}
          {loading && results.length === 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} style={{ aspectRatio: '4/3', borderRadius: 8, background: '#f3f4f6', animation: `usp-pulse ${1.4 + i * 0.1}s ease-in-out infinite` }} />
              ))}
            </div>
          )}
          {results.length > 0 && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {results.map(photo => (
                  <div key={photo.id} onClick={() => handleSelect(photo)}
                    onMouseEnter={() => setHoveredId(photo.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: '2px solid transparent' }}
                  >
                    <img src={photo.thumb} alt={photo.alt || ''} loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: hoveredId === photo.id ? 1 : 0, transition: 'opacity .18s' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#1a6b52', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#fff', marginBottom: 8 }}>✓</div>
                      {photo.author && <div style={{ fontSize: 11, color: '#fff', textAlign: 'center', padding: '0 8px' }}>by {photo.author}</div>}
                    </div>
                  </div>
                ))}
              </div>
              {page < totalPages && (
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <button onClick={handleLoadMore} disabled={loading}
                    style={{ padding: '9px 24px', background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer', color: '#6b7280', opacity: loading ? .6 : 1 }}>
                    {loading ? 'Đang tải...' : 'Xem thêm'}
                  </button>
                </div>
              )}
              <div style={{ textAlign: 'center', marginTop: 14, fontSize: 11, color: '#9ca3af' }}>
                Ảnh từ <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" style={{ color: '#1a6b52', textDecoration: 'none' }}>Unsplash</a> — miễn phí cho mục đích thương mại
              </div>
            </>
          )}
          {!loading && query && results.length === 0 && !error && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af', fontSize: 13 }}>
              Không tìm thấy ảnh cho &ldquo;<strong>{query}</strong>&rdquo;. Thử từ khóa khác.
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes usp-pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  )
}
