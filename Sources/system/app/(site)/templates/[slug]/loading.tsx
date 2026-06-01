export default function TemplateDetailLoading() {
  return (
    <>
      {/* Nav skeleton */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 62, background: 'rgba(250,249,247,.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)', zIndex: 100, display: 'flex', alignItems: 'center', padding: '0 clamp(20px,5vw,80px)' }}>
        <div style={{ maxWidth: 1100, width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ width: 110, height: 20, borderRadius: 6, background: 'var(--border)' }} className="sk" />
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 80, height: 14, borderRadius: 4, background: 'var(--border)' }} className="sk" />
            <div style={{ width: 80, height: 14, borderRadius: 4, background: 'var(--border)' }} className="sk" />
          </div>
          <div style={{ width: 90, height: 36, borderRadius: 9, background: 'var(--border)' }} className="sk" />
        </div>
      </div>

      <div style={{ paddingTop: 62 }}>
        <div className="wd-container" style={{ padding: 'clamp(32px,5vw,56px) clamp(20px,5vw,80px)' }}>
          <div className="row g-4">
            {/* Left: main content */}
            <div className="col-lg-8">
              {/* Main image */}
              <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 14, background: 'var(--warm2)', marginBottom: 24 }} className="sk" />
              {/* Tabs */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                {[80, 80, 90, 70].map((w, i) => (
                  <div key={i} style={{ width: w, height: 34, borderRadius: 8, background: 'var(--warm2)' }} className="sk" />
                ))}
              </div>
              {/* Text lines */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[100, 92, 96, 88, 94, 85].map((w, i) => (
                  <div key={i} style={{ width: `${w}%`, height: 14, borderRadius: 4, background: 'var(--warm2)' }} className="sk" />
                ))}
              </div>
            </div>

            {/* Right: sidebar */}
            <div className="col-lg-4">
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, position: 'sticky', top: 80 }}>
                {/* Price */}
                <div style={{ width: 120, height: 32, borderRadius: 6, background: 'var(--warm2)', marginBottom: 16 }} className="sk" />
                {/* Badge */}
                <div style={{ width: 80, height: 22, borderRadius: 20, background: 'var(--warm2)', marginBottom: 20 }} className="sk" />
                {/* Button */}
                <div style={{ width: '100%', height: 46, borderRadius: 9, background: 'var(--warm2)', marginBottom: 10 }} className="sk" />
                <div style={{ width: '100%', height: 46, borderRadius: 9, background: 'var(--warm2)', marginBottom: 24 }} className="sk" />
                {/* Info rows */}
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ width: '40%', height: 12, borderRadius: 4, background: 'var(--warm2)' }} className="sk" />
                    <div style={{ width: '40%', height: 12, borderRadius: 4, background: 'var(--warm2)' }} className="sk" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .sk { animation: pulse 1.4s ease-in-out infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .45; }
        }
      `}</style>
    </>
  )
}
