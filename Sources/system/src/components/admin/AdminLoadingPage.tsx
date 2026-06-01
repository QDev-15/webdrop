const NAV_ITEMS = [
  { icon: '📊', label: 'Tổng quan' },
  { icon: '📋', label: 'Đơn hàng' },
  { icon: '👥', label: 'Khách hàng' },
  { icon: '🗂️', label: 'Dự án' },
  { icon: '🎨', label: 'Templates' },
  { icon: '📝', label: 'Blog' },
  { icon: '💬', label: 'Liên hệ' },
  { icon: '💰', label: 'Doanh thu' },
  { icon: '⚙️', label: 'Cài đặt' },
]

interface Props {
  /** Loại skeleton hiển thị trong content area */
  type?: 'table' | 'detail' | 'form' | 'cards' | 'chart'
  rows?: number
}

function SkRow({ w }: { w: number }) {
  return <div style={{ height: 13, borderRadius: 4, background: 'rgba(255,255,255,.06)', width: `${w}%` }} />
}

function ContentSkeleton({ type = 'table', rows = 8 }: { type?: Props['type']; rows: number }) {
  const sk = (w: string | number, h = 13, r = 4) => (
    <div style={{ height: h, borderRadius: r, background: 'var(--warm2)', width: typeof w === 'number' ? `${w}%` : w, flexShrink: 0 }} className="ld-sk" />
  )

  if (type === 'cards') return (
    <div className="row g-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="col-md-6 col-lg-4">
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ height: 160, background: 'var(--warm2)' }} className="ld-sk" />
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sk(70, 14)} {sk(50, 11)} {sk(40, 24, 6)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  if (type === 'detail') return (
    <div className="row g-3">
      <div className="col-lg-8" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sk(40, 18)} {sk(60, 12)} <div style={{ borderTop: '1px solid var(--border-light)', margin: '4px 0' }} />
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>{sk(30, 13)} {sk(35, 13)}</div>
          ))}
        </div>
      </div>
      <div className="col-lg-4">
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sk(50, 14)} {sk(70, 12)} {sk(80, 12)} {sk(60, 12)}
          <div style={{ height: 40, borderRadius: 8, background: 'var(--warm2)', marginTop: 8 }} className="ld-sk" />
        </div>
      </div>
    </div>
  )

  if (type === 'form') return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {sk(25, 11)} {sk(100, 36, 8)}
          </div>
        ))}
      </div>
    </div>
  )

  if (type === 'chart') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="row g-3" style={{ marginBottom: 8 }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="col-md-4">
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sk(40, 11)} {sk(55, 26, 6)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
        {sk(30, 13, 4)}
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 120, marginTop: 16 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ flex: 1, background: 'var(--warm2)', borderRadius: '3px 3px 0 0', height: `${30 + Math.sin(i) * 25 + 30}%` }} className="ld-sk" />
          ))}
        </div>
      </div>
    </div>
  )

  // default: table
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '10px 16px', background: 'var(--bg)', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: 8 }}>
        {[60, 80, 60, 90].map((w, i) => (
          <div key={i} style={{ height: 11, borderRadius: 4, background: 'var(--warm2)', width: w }} className="ld-sk" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ padding: '13px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ height: 13, borderRadius: 4, background: 'var(--warm2)', width: '30%' }} className="ld-sk" />
          <div style={{ height: 13, borderRadius: 4, background: 'var(--warm2)', width: '20%' }} className="ld-sk" />
          <div style={{ height: 13, borderRadius: 4, background: 'var(--warm2)', width: '15%' }} className="ld-sk" />
          <div style={{ height: 22, borderRadius: 20, background: 'var(--warm2)', width: 70 }} className="ld-sk" />
          <div style={{ height: 11, borderRadius: 4, background: 'var(--warm2)', width: 60, marginLeft: 'auto' }} className="ld-sk" />
        </div>
      ))}
    </div>
  )
}

export default function AdminLoadingPage({ type = 'table', rows = 8 }: Props) {
  return (
    <div className="admin-body">
      {/* Sidebar — static shell */}
      <div className="admin-sidebar">
        <div className="sb-logo">
          <span className="sb-logo-text">web<span>drop</span>.vn</span>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.2)', marginTop: 3, fontWeight: 300 }}>System Admin</div>
        </div>
        <nav className="sb-nav">
          <div className="sb-section">Menu</div>
          {NAV_ITEMS.map(item => (
            <div key={item.label} className="sb-link">
              <span className="sb-link-icon">{item.icon}</span>
              <SkRow w={60} />
            </div>
          ))}
          <div className="sb-section" style={{ marginTop: 20 }}>Hệ thống</div>
          <div className="sb-link"><span className="sb-link-icon">🌐</span><SkRow w={55} /></div>
          <div className="sb-link"><span className="sb-link-icon">🚪</span><SkRow w={45} /></div>
        </nav>
      </div>

      {/* Main */}
      <div className="admin-main">
        <div className="admin-topbar">
          <div style={{ width: 140, height: 14, borderRadius: 4, background: 'var(--warm2)' }} className="ld-sk" />
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--warm2)' }} className="ld-sk" />
        </div>
        <div className="admin-content">
          {/* Toolbar stub */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <div style={{ height: 34, borderRadius: 8, background: 'var(--warm2)', width: 220 }} className="ld-sk" />
            <div style={{ height: 34, borderRadius: 8, background: 'var(--warm2)', width: 80 }} className="ld-sk" />
            <div style={{ height: 34, borderRadius: 8, background: 'var(--warm2)', width: 90, marginLeft: 'auto' }} className="ld-sk" />
          </div>
          <ContentSkeleton type={type} rows={rows} />
        </div>
      </div>

      <style>{`
        .ld-sk { animation: ld-pulse 1.4s ease-in-out infinite; }
        @keyframes ld-pulse { 0%,100%{opacity:1} 50%{opacity:.45} }
      `}</style>
    </div>
  )
}
