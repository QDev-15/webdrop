import { useSite } from '../App'

export default function HeroSlider() {
  const { slides, settings, loading } = useSite()

  const sinceYear = settings['since_year'] || '2018'
  const city = settings['city'] || 'TP. Hồ Chí Minh'

  // Use first slide or fallback
  const slide = slides[0]
  const heroImage = slide?.image || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=60&auto=format&fit=crop'
  const heroTitle = slide?.title || "L'art de la\ncuisine française\nau cœur de Việt Nam."
  const heroSub = slide?.subtitle || 'Nghệ thuật ẩm thực Pháp — từng món ăn là một trải nghiệm, từng buổi tối là một kỷ niệm không quên.'
  const ctaText = slide?.cta_text || 'Réserver une table'
  const ctaUrl = slide?.cta_url || '/reservation'

  if (loading) return (
    <section className="hero">
      <div className="hero-bg" style={{ backgroundImage: `url('${heroImage}')` }} />
      <div className="hero-overlay" />
    </section>
  )

  // Render title with line breaks
  const titleLines = heroTitle.split('\n')

  return (
    <section className="hero">
      <div className="hero-bg" style={{ backgroundImage: `url('${heroImage}')` }} />
      <div className="hero-overlay" />
      <div className="wd-container w-100">
        <div className="hero-content">
          <div className="hero-pretitle">Depuis {sinceYear} · {city}, Việt Nam</div>
          <h1 className="hero-title">
            {titleLines.map((line, i) => (
              <span key={i}>
                {i === 1 ? <em>{line}</em> : line}
                {i < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h1>
          <div className="hero-ornament"><div className="ho-diamond" /></div>
          <p className="hero-sub">{heroSub}</p>
          <div className="hero-cta">
            <a href={ctaUrl} className="btn-accent">{ctaText}</a>
            <a href="/menu" className="btn-outline-dark">Notre Carte →</a>
          </div>
        </div>
      </div>
      <div className="hero-scroll">
        <div className="scroll-line" />
        <span>Découvrir</span>
      </div>
    </section>
  )
}
