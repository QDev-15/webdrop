export default function ArticleLoading() {
  return (
    <main className="wd-help-article-page">
      <div className="wd-container">
        <div className="skeleton" style={{ height: '40px', marginBottom: '30px', borderRadius: '8px' }} />
        <div className="skeleton" style={{ height: '60px', marginBottom: '40px', borderRadius: '8px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px' }}>
          <div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '100px', marginBottom: '16px', borderRadius: '8px' }} />
            ))}
          </div>
          <div className="skeleton" style={{ height: '300px', borderRadius: '8px' }} />
        </div>
      </div>
    </main>
  );
}