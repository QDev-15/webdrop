export default function BlogLoading() {
  return (
    <div style={{ paddingTop: 62 }}>
      {/* Hero */}
      <div style={{ background: 'var(--dark2)', padding: 'clamp(56px,8vw,88px) 0 clamp(40px,5vw,60px)' }}>
        <div className="wd-container" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 90, height: 11, borderRadius: 4, background: 'rgba(255,255,255,.1)' }} className="ld-sk" />
          <div style={{ width: 340, height: 42, borderRadius: 8, background: 'rgba(255,255,255,.08)' }} className="ld-sk" />
          <div style={{ width: 380, height: 14, borderRadius: 4, background: 'rgba(255,255,255,.06)' }} className="ld-sk" />
        </div>
      </div>

      {/* Posts grid */}
      <div className="wd-container" style={{ padding: 'clamp(48px,8vw,96px) clamp(20px,5vw,80px)' }}>
        <div className="row g-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="col-md-6 col-lg-4">
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', height: '100%' }}>
                <div style={{ height: 180, background: 'var(--warm2)' }} className="ld-sk" />
                <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ height: 11, borderRadius: 4, background: 'var(--warm2)', width: 60 }} className="ld-sk" />
                  <div style={{ height: 16, borderRadius: 4, background: 'var(--warm2)', width: '85%' }} className="ld-sk" />
                  <div style={{ height: 13, borderRadius: 4, background: 'var(--warm2)', width: '100%' }} className="ld-sk" />
                  <div style={{ height: 13, borderRadius: 4, background: 'var(--warm2)', width: '70%' }} className="ld-sk" />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <div style={{ height: 11, borderRadius: 4, background: 'var(--warm2)', width: 60 }} className="ld-sk" />
                    <div style={{ height: 11, borderRadius: 4, background: 'var(--warm2)', width: 70 }} className="ld-sk" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .ld-sk { animation: ld-pulse 1.4s ease-in-out infinite; }
        @keyframes ld-pulse { 0%,100%{opacity:1} 50%{opacity:.45} }
      `}</style>
    </div>
  )
}
