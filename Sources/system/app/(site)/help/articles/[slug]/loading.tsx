export default function ArticleLoading() {
  return (
    <div style={{ paddingTop: 62, paddingBottom: 100 }}>
      {/* Breadcrumb skeleton */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        padding: '12px 0',
        marginBottom: 40,
      }}>
        <div className="wd-container">
          <div style={{
            height: 16,
            background: 'var(--border)',
            borderRadius: 4,
            maxWidth: 300,
            animation: 'pulse 2s infinite',
          }} />
        </div>
      </div>

      <div className="wd-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: 40,
        }}>
          {/* Main content skeleton */}
          <div>
            {/* Title */}
            <div style={{ marginBottom: 24 }}>
              <div style={{
                height: 12,
                background: 'var(--border)',
                borderRadius: 4,
                marginBottom: 16,
                maxWidth: 80,
                animation: 'pulse 2s infinite',
              }} />
              <div style={{
                height: 40,
                background: 'var(--border)',
                borderRadius: 8,
                marginBottom: 12,
                animation: 'pulse 2s infinite',
                animationDelay: '0.1s',
              }} />
              <div style={{
                height: 20,
                background: 'var(--border)',
                borderRadius: 4,
                marginBottom: 16,
                animation: 'pulse 2s infinite',
                animationDelay: '0.2s',
              }} />
            </div>

            {/* Meta skeleton */}
            <div style={{
              borderBottom: '1px solid var(--border-light)',
              paddingBottom: 20,
              marginBottom: 40,
              display: 'flex',
              gap: 20,
            }}>
              <div style={{
                height: 16,
                background: 'var(--border)',
                borderRadius: 4,
                minWidth: 150,
                animation: 'pulse 2s infinite',
              }} />
              <div style={{
                height: 16,
                background: 'var(--border)',
                borderRadius: 4,
                minWidth: 150,
                animation: 'pulse 2s infinite',
                animationDelay: '0.1s',
              }} />
            </div>

            {/* Content skeleton */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{
                height: 16,
                background: 'var(--border)',
                borderRadius: 4,
                marginBottom: 12,
                opacity: i % 3 === 2 ? 0.5 : 1,
                animation: 'pulse 2s infinite',
                animationDelay: `${i * 0.05}s`,
              }} />
            ))}
          </div>

          {/* Sidebar skeleton */}
          <div>
            <div style={{
              position: 'sticky',
              top: 90,
              display: 'flex',
              flexDirection: 'column',
              gap: 30,
            }}>
              {/* Related articles */}
              <div>
                <div style={{
                  height: 16,
                  background: 'var(--border)',
                  borderRadius: 4,
                  marginBottom: 16,
                  maxWidth: 120,
                  animation: 'pulse 2s infinite',
                }} />
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} style={{
                    height: 44,
                    background: 'var(--border)',
                    borderRadius: 8,
                    marginBottom: 12,
                    animation: 'pulse 2s infinite',
                    animationDelay: `${i * 0.1}s`,
                  }} />
                ))}
              </div>

              {/* Contact card */}
              <div style={{
                padding: 16,
                background: 'var(--warm)',
                borderRadius: 8,
                border: '1px solid var(--border-light)',
              }}>
                <div style={{
                  height: 16,
                  background: 'var(--border)',
                  borderRadius: 4,
                  marginBottom: 12,
                  maxWidth: 100,
                  animation: 'pulse 2s infinite',
                }} />
                <div style={{
                  height: 32,
                  background: 'var(--border)',
                  borderRadius: 6,
                  animation: 'pulse 2s infinite',
                  animationDelay: '0.1s',
                }} />
              </div>
            </div>
          </div>
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
