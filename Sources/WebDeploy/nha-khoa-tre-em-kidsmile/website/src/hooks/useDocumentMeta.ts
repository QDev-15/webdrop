import { useEffect } from 'react'

interface DocumentMeta {
  title: string
  description?: string
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

// Đặt title + meta description + canonical + OG cho ĐÚNG trang hiện tại — gọi ở đầu
// mỗi page component: useDocumentMeta({ title: '...', description: '...' }).
export function useDocumentMeta({ title, description }: DocumentMeta) {
  useEffect(() => {
    document.title = title
    if (description) {
      upsertMeta('name', 'description', description)
      upsertMeta('property', 'og:description', description)
      upsertMeta('name', 'twitter:description', description)
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
  }, [title, description])
}
