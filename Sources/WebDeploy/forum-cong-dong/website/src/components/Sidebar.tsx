import { useSite } from '../contexts/SiteContext'

export default function Sidebar() {
  const { tags } = useSite()

  return (
    <div>
      {/* New post CTA */}
      <div className="new-post-cta">
        <div className="new-post-cta-icon">&#x270D;</div>
        <div className="new-post-cta-title">Tao chu de moi</div>
        <div className="new-post-cta-desc">Chia se cau hoi hoac kinh nghiem voi cong dong</div>
        <a href="/contact" className="new-post-cta-btn">Bat dau viet →</a>
      </div>

      {/* Online now */}
      <div className="side-panel">
        <div className="side-panel-title">Dang online (12)</div>
        <div className="online-avatars">
          {[
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&q=80&auto=format&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&q=80&auto=format&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&q=80&auto=format&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&q=80&auto=format&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&q=80&auto=format&fit=crop&crop=face',
          ].map((url, i) => (
            <img key={i} src={url} className="online-av" alt="Online user" />
          ))}
          <div className="online-more">+7</div>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="side-panel">
          <div className="side-panel-title">Tags pho bien</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {tags.map(tag => (
              <a key={tag.id} href="/" className="tag-link">
                {tag.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Top members */}
      <div className="side-panel">
        <div className="side-panel-title">Thanh vien tich cuc</div>
        {[
          { name: 'Admin Team', posts: '1,248 bai viet', badge: 'badge-admin', badgeLabel: 'Admin', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&q=80&auto=format&fit=crop&crop=face' },
          { name: 'Minh Tuan', posts: '842 bai viet', badge: 'badge-mod', badgeLabel: 'Mod', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80&auto=format&fit=crop&crop=face' },
          { name: 'Lan Anh', posts: '615 bai viet', badge: null, badgeLabel: null, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80&auto=format&fit=crop&crop=face' },
          { name: 'Quang Minh', posts: '504 bai viet', badge: null, badgeLabel: null, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&q=80&auto=format&fit=crop&crop=face' },
        ].map((m, i) => (
          <div key={i} className="member-item">
            <img src={m.avatar} className="member-av" alt={m.name} />
            <div className="member-info">
              <div className="member-name">{m.name}</div>
              <div className="member-posts">{m.posts}</div>
            </div>
            {m.badge && (
              <span className={`member-badge ${m.badge}`}>{m.badgeLabel}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
