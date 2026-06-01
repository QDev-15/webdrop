export default function TemplatesLoading() {
  return (
    <div style={{ paddingTop: 62 }}>
      {/* Hero */}
      <div style={{ background: 'var(--dark2)', padding: 'clamp(48px,8vw,80px) 0 clamp(36px,6vw,56px)' }}>
        <div className="wd-container" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 100, height: 12, borderRadius: 4, background: 'rgba(255,255,255,.1)' }} className="ld-sk" />
          <div style={{ width: 360, height: 44, borderRadius: 8, background: 'rgba(255,255,255,.08)' }} className="ld-sk" />
          <div style={{ width: 440, height: 16, borderRadius: 4, background: 'rgba(255,255,255,.06)' }} className="ld-sk" />
        </div>
      </div>

      {/* Grid */}
      <div className="wd-container" style={{ padding: 'clamp(36px,6vw,64px) clamp(20px,5vw,80px)' }}>
        <div className="row g-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="col-md-6 col-lg-4">
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ height: 200, background: 'var(--warm2)' }} className="ld-sk" />
                <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ height: 12, borderRadius: 4, background: 'var(--warm2)', width: '45%' }} className="ld-sk" />
                  <div style={{ height: 16, borderRadius: 4, background: 'var(--warm2)', width: '75%' }} className="ld-sk" />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                    <div style={{ height: 20, borderRadius: 4, background: 'var(--warm2)', width: 80 }} className="ld-sk" />
                    <div style={{ height: 34, borderRadius: 8, background: 'var(--warm2)', width: 90 }} className="ld-sk" />
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
