import { useSite } from '../contexts/SiteContext'

export default function HeroBanner() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'Forum Cong Dong'
  const tagline = settings.forum_tagline || 'Noi ket noi'
  const description = settings.forum_description || 'Cung nhau thao luan, chia se kinh nghiem va giai quyet van de. Cong dong than thien.'
  const rulesUrl = settings.forum_rules_url || '#'

  const statMembers = settings.forum_stat_members || '12,840'
  const statThreads = settings.forum_stat_threads || '3,250'
  const statPosts = settings.forum_stat_posts || '48,900'

  return (
    <div className="hero-section">
      <div className="hero-radial" />
      <div className="hero-content">
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Cong dong dang hoat dong
            </div>
            <h1 className="hero-title">
              {siteName} — <em>{tagline}</em> cong dong
            </h1>
            <p className="hero-desc">{description}</p>
            <div className="d-flex gap-3 flex-wrap">
              <a href="#" className="hero-btn-primary">Tao chu de moi +</a>
              <a href={rulesUrl} className="hero-btn-ghost">Quy tac cong dong</a>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="row g-2">
              <div className="col-6">
                <div className="stat-card">
                  <div className="stat-num">{statMembers}</div>
                  <div className="stat-label">Thanh vien</div>
                </div>
              </div>
              <div className="col-6">
                <div className="stat-card">
                  <div className="stat-num">{statThreads}</div>
                  <div className="stat-label">Chu de</div>
                </div>
              </div>
              <div className="col-6">
                <div className="stat-card">
                  <div className="stat-num" style={{ color: '#4ade80' }}>128</div>
                  <div className="stat-label">Online hom nay</div>
                </div>
              </div>
              <div className="col-6">
                <div className="stat-card">
                  <div className="stat-num">{statPosts}</div>
                  <div className="stat-label">Bai viet</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
