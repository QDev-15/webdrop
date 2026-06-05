import { useSite } from '../contexts/SiteContext'

export default function ZaloFloat() {
  const { settings } = useSite()
  const zalo = settings.social_zalo || '#'

  return (
    <div className="zf">
      <div className="zf-tip">Liên hệ Zalo</div>
      <a
        href={zalo !== '#' ? `https://zalo.me/${zalo}` : '#'}
        className="zf-btn"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Zalo"
      >
        💬
      </a>
    </div>
  )
}
