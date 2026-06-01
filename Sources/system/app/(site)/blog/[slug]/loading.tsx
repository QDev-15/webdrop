export default function BlogPostLoading() {
  return (
    <div style={{ paddingTop: 62 }}>
      {/* Hero */}
      <div style={{ background: 'var(--dark2)', padding: 'clamp(48px,7vw,72px) 0 clamp(32px,5vw,48px)' }}>
        <div className="wd-container" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 80, height: 11, borderRadius: 4, background: 'rgba(255,255,255,.1)' }} className="ld-sk" />
          <div style={{ width: '60%', maxWidth: 480, height: 36, borderRadius: 6, background: 'rgba(255,255,255,.08)' }} className="ld-sk" />
          <div style={{ width: 80, height: 11, borderRadius: 4, background: 'rgba(255,255,255,.06)' }} className="ld-sk" />
        </div>
      </div>

      {/* Content */}
      <div className="wd-container" style={{ maxWidth: 760, padding: 'clamp(36px,6vw,64px) clamp(20px,5vw,80px)' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {[50, 10, 40, 10, 120].map((w, i) => (
            <div key={i} style={{ height: 12, borderRadius: 3, background: 'var(--warm2)', width: w }} className="ld-sk" />
          ))}
        </div>
        {/* Excerpt */}
        <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: 18, marginBottom: 32 }}>
          <div style={{ height: 14, borderRadius: 4, background: 'var(--warm2)', width: '95%', marginBottom: 8 }} className="ld-sk" />
          <div style={{ height: 14, borderRadius: 4, background: 'var(--warm2)', width: '75%' }} className="ld-sk" />
        </div>
        {/* Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[100, 95, 88, 0, 60, 100, 92, 85, 0, 65, 100, 90, 78].map((w, i) =>
            w === 0
              ? <div key={i} style={{ height: 8 }} />
              : <div key={i} style={{ height: w > 80 ? 13 : 18, borderRadius: w > 80 ? 3 : 5, background: 'var(--warm2)', width: `${w}%` }} className="ld-sk" />
          )}
        </div>
      </div>

      <style>{`
        .ld-sk { animation: ld-pulse 1.4s ease-in-out infinite; }
        @keyframes ld-pulse { 0%,100%{opacity:1} 50%{opacity:.45} }
      `}</style>
    </div>
  )
}
