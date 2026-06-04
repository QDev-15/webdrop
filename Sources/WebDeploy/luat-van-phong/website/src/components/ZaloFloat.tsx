import { useSite } from '../contexts/SiteContext'

export default function ZaloFloat() {
  const { settings } = useSite()
  const zalo = settings.social_zalo?.trim()

  if (!zalo) return null

  return (
    <a
      href={`https://zalo.me/${zalo}`}
      className="lv-zalo-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat Zalo với văn phòng luật"
    >
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="48" height="48" rx="24" fill="#0068FF"/>
        <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize="15" fontFamily="Arial, sans-serif" fontWeight="700">Zalo</text>
      </svg>
    </a>
  )
}
