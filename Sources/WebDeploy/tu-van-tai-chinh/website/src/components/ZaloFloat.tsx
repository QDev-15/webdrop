import { useSite } from '../contexts/SiteContext'

export default function ZaloFloat() {
  const { settings } = useSite()
  const zalo = settings.social_zalo || ''
  if (!zalo) return null
  return (
    <a
      href={`https://zalo.me/${zalo}`}
      className="tc-zalo-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat Zalo"
    >
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 5.92 2 10.74c0 2.84 1.5 5.37 3.86 7.02L5.25 21l3.6-1.5C10.07 20.11 11.02 20.3 12 20.3c5.52 0 10-3.91 10-8.74C22 6.74 17.52 2 12 2z"/>
      </svg>
    </a>
  )
}
