import type { ReactNode } from 'react'

// Parse "text\n*nhấn*" -> <br/> + <em>nhấn</em> (quy ước dùng trong Database.php seed hero_slides.title)
export function renderTitle(text: string | undefined): ReactNode {
  if (!text) return null
  const lines = text.split('\n')
  return lines.map((line, li) => {
    const parts = line.split(/(\*[^*]+\*)/g)
    const rendered = parts.map((part, i) =>
      part.startsWith('*') && part.endsWith('*')
        ? <em key={i}>{part.slice(1, -1)}</em>
        : <span key={i}>{part}</span>
    )
    return (
      <span key={li}>
        {rendered}
        {li < lines.length - 1 && <br />}
      </span>
    )
  })
}

// Parse chuỗi nhiều dòng "value|label" (dùng cho settings home_stats, hours_stats...)
export function parsePairs(raw: string | undefined): Array<{ a: string; b: string }> {
  return (raw || '')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(line => {
      const [a, ...rest] = line.split('|')
      return { a: (a || '').trim(), b: rest.join('|').trim() }
    })
}

// Parse chuỗi nhiều dòng "icon|title|description" (dùng cho settings home_features, audience_features...)
export function parseTriples(raw: string | undefined): Array<{ icon: string; title: string; desc: string }> {
  return (raw || '')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(line => {
      const [icon, title, ...rest] = line.split('|')
      return { icon: (icon || '').trim(), title: (title || '').trim(), desc: rest.join('|').trim() }
    })
}

// Format giá tiền VND
export function formatVND(n: number | null | undefined): string {
  if (n == null) return ''
  return n.toLocaleString('vi-VN') + 'đ'
}
