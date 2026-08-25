import { Link } from 'react-router-dom'

interface Section { title: string; content: string }

export default function LegalPage({ title, updatedAt, sections }: { title: string; updatedAt: string; sections: Section[] }) {
  return (
    <>
      <header className="gvr-page-hero" style={{ padding: '150px 0 60px' }}>
        <span className="blob blob-a"></span><span className="blob blob-b"></span>
        <div className="wd-container">
          <div className="gvr-crumb"><Link to="/">Trang chủ</Link> / {title}</div>
          <h1 className="sec-title on-dark">{title}</h1>
        </div>
      </header>

      <section className="sec-pad">
        <div className="wd-container" style={{ maxWidth: 820 }}>
          <p style={{ color: 'var(--text-2)', fontSize: 13.5, marginBottom: 32 }}>Cập nhật lần cuối: {updatedAt}</p>
          {sections.map((s, i) => (
            <div key={i}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{s.title}</h2>
              <p style={{ color: 'var(--text-2)', lineHeight: 1.8, marginBottom: i === sections.length - 1 ? 0 : 24 }}>{s.content}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
