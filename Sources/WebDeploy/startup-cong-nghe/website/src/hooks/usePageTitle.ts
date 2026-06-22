import { useEffect } from 'react'
import { useSite } from '../contexts/SiteContext'

export function usePageTitle(pageTitle?: string) {
  const { settings } = useSite()

  useEffect(() => {
    const siteName = settings.site_name || 'Website'
    document.title = pageTitle ? `${pageTitle} | ${siteName}` : (settings.meta_title || siteName)
  }, [pageTitle, settings.site_name, settings.meta_title])
}
