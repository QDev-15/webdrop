import { useSite } from '../contexts/SiteContext'

export default function CategoryGrid() {
  const { categories, loading } = useSite()

  if (loading) return null

  return (
    <div style={{ marginBottom: 28 }}>
      <div className="sec-header">
        <h2 className="sec-label">Danh muc</h2>
        <a href="#" className="sec-link">Xem tat ca →</a>
      </div>
      <div className="row g-2">
        {categories.map((cat, i) => (
          <div key={cat.id} className={`col-md-6 reveal reveal-d${(i % 3) + 1}`}>
            <a href="#" className="cat-card">
              <div className="cat-icon">{cat.icon || '📁'}</div>
              <div className="cat-info">
                <div className="cat-name">{cat.name}</div>
                <div className="cat-desc">{cat.description}</div>
              </div>
              <div className="cat-count">
                <strong>{cat.thread_count || 0}</strong>chu de
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
