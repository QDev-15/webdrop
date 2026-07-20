import { useEffect } from 'react'
import { useSite } from '../contexts/SiteContext'

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function usePageTitle(pageTitle?: string, description?: string) {
  const { settings } = useSite()

  useEffect(() => {
    const siteName = settings.site_name || 'Website'
    const title = pageTitle ? `${pageTitle} | ${siteName}` : (settings.meta_title || siteName)
    document.title = title

    const desc = description || settings.meta_description
    if (desc) {
      upsertMeta('name', 'description', desc)
      upsertMeta('property', 'og:description', desc)
      upsertMeta('name', 'twitter:description', desc)
    }
    upsertMeta('property', 'og:title', title)
    upsertMeta('name', 'twitter:title', title)

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', window.location.origin + window.location.pathname)
  }, [pageTitle, description, settings.site_name, settings.meta_title, settings.meta_description])
}
