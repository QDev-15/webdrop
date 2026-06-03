import { useSite } from '../contexts/SiteContext'

export default function ZaloFloat() {
  const { settings } = useSite()
  const zaloUrl = settings.social_zalo
    ? `https://zalo.me/${settings.social_zalo}`
    : '#'

  return (
    <div className="zf">
      <div className="zf-tip">Chat Zalo ngay</div>
      <button
        className="zf-btn"
        onClick={() => zaloUrl !== '#' && window.open(zaloUrl, '_blank')}
        aria-label="Chat Zalo"
      >
        💬
      </button>
    </div>
  )
}
