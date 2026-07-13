export default function BlogPostLoading() {
  return (
    <div style={{ paddingTop: 62 }}>
      {/* Hero — hầu hết bài đều có ảnh Unsplash tự động nên mô phỏng theo biến thể ảnh (chiều cao lớn),
          tránh giật layout khi content thật load xong (phần lớn không rơi vào biến thể dark-placeholder nữa) */}
      <div style={{ height: 'clamp(220px,30vw,420px)', background: 'var(--warm)' }} className="ld-sk" />

      {/* Content */}
      <div className="wd-container" style={{ padding: 'clamp(36px,6vw,64px) clamp(20px,5vw,80px)' }}>
        <div className="row g-4 g-lg-5">
          <div className="col-lg-8">
            {/* Breadcrumb */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
              {[50, 10, 40, 10, 120].map((w, i) => (
                <div key={i} style={{ height: 12, borderRadius: 3, background: 'var(--warm2)', width: w }} className="ld-sk" />
              ))}
            </div>
            {/* Meta: category + date + title */}
            <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ height: 11, width: 90, borderRadius: 3, background: 'var(--warm2)' }} className="ld-sk" />
              <div style={{ height: 28, width: '85%', borderRadius: 6, background: 'var(--warm2)' }} className="ld-sk" />
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

          {/* Sidebar skeleton */}
          <div className="col-lg-4">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ height: 44, borderRadius: 20, background: 'var(--warm2)' }} className="ld-sk" />
              <div style={{ border: '1px solid var(--border)', borderRadius: 14, padding: '20px 18px' }}>
                <div style={{ height: 11, width: 100, borderRadius: 3, background: 'var(--warm2)', marginBottom: 16 }} className="ld-sk" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ width: 56, height: 56, borderRadius: 10, background: 'var(--warm2)', flexShrink: 0 }} className="ld-sk" />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ height: 11, width: '90%', borderRadius: 3, background: 'var(--warm2)' }} className="ld-sk" />
                        <div style={{ height: 11, width: '60%', borderRadius: 3, background: 'var(--warm2)' }} className="ld-sk" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ height: 100, border: '1px dashed var(--border)', borderRadius: 14 }} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ld-sk { animation: ld-pulse 1.4s ease-in-out infinite; }
        @keyframes ld-pulse { 0%,100%{opacity:1} 50%{opacity:.45} }
      `}</style>
    </div>
  )
}
