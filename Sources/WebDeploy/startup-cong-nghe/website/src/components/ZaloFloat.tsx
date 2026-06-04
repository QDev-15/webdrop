import { useSite } from '../contexts/SiteContext'

export default function ZaloFloat() {
  const { settings } = useSite()
  const zalo = settings.social_zalo || settings.site_phone_2 || settings.site_phone || ''
  if (!zalo) return null

  return (
    <a
      href={`https://zalo.me/${zalo.replace(/\s/g, '')}`}
      className="st-zalo-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Liên hệ qua Zalo"
    >
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="40" height="40" rx="20" fill="#0068FF"/>
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700" fontFamily="sans-serif">Zalo</text>
      </svg>
    </a>
  )
}
