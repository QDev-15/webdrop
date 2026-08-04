export default function HelpLoading() {
  return (
    <div style={{ paddingTop: 62, paddingBottom: 100 }}>
      {/* Hero skeleton */}
      <div style={{
        background: 'var(--accent-light)',
        borderBottom: '1px solid var(--border)',
        padding: 'clamp(40px, 8vw, 80px) 0',
        marginBottom: 'clamp(40px, 8vw, 60px)',
      }}>
        <div className="wd-container">
          <div style={{
            height: 40,
            background: 'var(--border)',
            borderRadius: 8,
            marginBottom: 12,
            animation: 'pulse 2s infinite',
          }} />
          <div style={{
            height: 20,
            background: 'var(--border)',
            borderRadius: 8,
            maxWidth: 400,
            animation: 'pulse 2s infinite',
            animationDelay: '0.2s',
          }} />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="wd-container">
        <div style={{ marginBottom: 40 }}>
          <div style={{
            height: 44,
            background: 'var(--border)',
            borderRadius: 8,
            animation: 'pulse 2s infinite',
          }} />
        </div>

        {/* Cards skeleton */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 18,
              background: 'var(--surface)',
              animation: `pulse 2s infinite`,
              animationDelay: `${i * 0.1}s`,
            }}>
              <div style={{
                height: 16,
                background: 'var(--border)',
                borderRadius: 4,
                marginBottom: 12,
                width: 80,
              }} />
              <div style={{
                height: 20,
                background: 'var(--border)',
                borderRadius: 4,
                marginBottom: 12,
              }} />
              <div style={{
                height: 16,
                background: 'var(--border)',
                borderRadius: 4,
                marginBottom: 12,
                opacity: 0.6,
              }} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6 }
          50% { opacity: 0.3 }
        }
      `}</style>
    </div>
  )
}
