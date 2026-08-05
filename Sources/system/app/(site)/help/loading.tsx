export default function HelpLoading() {
  return (
    <main className="wd-help-page">
      <div className="help-hero">
        <div className="wd-container">
          <div className="skeleton" style={{ height: '40px', marginBottom: '20px', borderRadius: '8px' }} />
          <div className="skeleton" style={{ height: '60px', marginBottom: '30px', borderRadius: '8px' }} />
          <div className="skeleton" style={{ height: '50px', borderRadius: '8px' }} />
        </div>
      </div>
      <div className="wd-container sec-pad">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '240px', borderRadius: '12px' }} />
          ))}
        </div>
      </div>
    </main>
  );
}