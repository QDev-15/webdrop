import { useState, useEffect, useRef } from 'react'
import { useSite, type ForumThread } from '../contexts/SiteContext'

function timeAgo(dateStr: string): string {
  if (!dateStr) return ''
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then
  const mins = Math.floor(diffMs / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  if (days > 6) return new Date(dateStr).toLocaleDateString('vi-VN')
  if (days >= 2) return `${days} ngay truoc`
  if (days === 1) return 'Hom qua'
  if (hours >= 1) return `${hours} gio truoc`
  if (mins >= 1) return `${mins} phut truoc`
  return 'Vua xong'
}

export default function ThreadList() {
  const { threads, loading, refetchThreads } = useSite()
  const [activeFilter, setActiveFilter] = useState<'latest' | 'hot' | 'unanswered'>('latest')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    void refetchThreads({ sort: activeFilter })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter])

  // Reveal animation after threads load
  useEffect(() => {
    const timer = setTimeout(() => {
      const els = listRef.current?.querySelectorAll<Element>('.reveal:not(.visible)')
      if (!els) return
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
        })
      }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [threads])

  return (
    <div ref={listRef}>
      <div className="sec-header" style={{ marginBottom: 14 }}>
        <h2 className="sec-label">Thao luan moi nhat</h2>
        <div className="filter-btns">
          <button
            className={`filter-btn${activeFilter === 'latest' ? ' active' : ''}`}
            onClick={() => setActiveFilter('latest')}
          >
            Moi nhat
          </button>
          <button
            className={`filter-btn${activeFilter === 'hot' ? ' active' : ''}`}
            onClick={() => setActiveFilter('hot')}
          >
            Hot
          </button>
          <button
            className={`filter-btn${activeFilter === 'unanswered' ? ' active' : ''}`}
            onClick={() => setActiveFilter('unanswered')}
          >
            Chua tra loi
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Dang tai...</div>
      ) : threads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-3)' }}>
          Chua co chu de nao
        </div>
      ) : (
        threads.map((t: ForumThread, i: number) => (
          <a
            key={t.id}
            href={`#thread-${t.id}`}
            className={`thread-row reveal${i > 0 ? ` reveal-d${(i % 3) + 1}` : ''}`}
            style={
              t.is_pinned
                ? { borderColor: 'var(--accent-light)', background: 'var(--accent-light)' }
                : undefined
            }
          >
            <div className="thread-avatar" style={{ background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
              {t.author_avatar ? (
                <img src={t.author_avatar} alt={t.author_name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              ) : (
                t.author_name?.[0]?.toUpperCase() || '?'
              )}
            </div>
            <div className="thread-main">
              <div className="thread-title">
                {t.is_pinned ? '📌 ' : ''}{t.is_hot ? '🔥 ' : ''}{t.title}
              </div>
              <div className="thread-meta">
                {t.category_name && (
                  <span className="thread-cat-tag">{t.category_icon} {t.category_name}</span>
                )}
                <span>{t.author_name}</span>
                <span>·</span>
                <span>{timeAgo(t.updated_at || t.created_at)}</span>
              </div>
            </div>
            <div className="thread-stats">
              <span className={`thread-replies${t.is_hot ? ' thread-hot' : ''}`}>
                {t.is_hot ? '🔥 ' : ''}{t.reply_count} tra loi
              </span>
              <span className="thread-time">
                {t.is_pinned ? 'Ghim' : timeAgo(t.updated_at || t.created_at)}
              </span>
            </div>
          </a>
        ))
      )}

      <div className="text-center mt-4">
        <button
          style={{ fontSize: 13, fontWeight: 500, padding: '10px 28px', borderRadius: 9, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-2)', cursor: 'pointer', fontFamily: 'var(--sans)', transition: 'all .15s' }}
          onMouseOver={e => ((e.target as HTMLElement).style.background = 'var(--warm)')}
          onMouseOut={e => ((e.target as HTMLElement).style.background = 'var(--surface)')}
        >
          Xem them chu de
        </button>
      </div>
    </div>
  )
}
