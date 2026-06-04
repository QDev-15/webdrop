import { useSite } from '../contexts/SiteContext'

export default function ZaloFloat() {
  const { settings } = useSite()
  const zaloNum = settings.social_zalo || '#'
  const href = zaloNum !== '#' ? `https://zalo.me/${zaloNum.replace(/\D/g, '')}` : '#'

  return (
    <a
      href={href}
      className="ag-zalo-float"
      target={href !== '#' ? '_blank' : undefined}
      rel="noopener noreferrer"
      aria-label="Chat Zalo"
    >
      <span className="ag-zalo-float-label">Chat Zalo</span>
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect width="40" height="40" rx="0" fill="#0068FF"/>
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700" fontFamily="sans-serif">Z</text>
      </svg>
    </a>
  )
}
