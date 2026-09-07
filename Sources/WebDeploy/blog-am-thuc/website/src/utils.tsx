import { ReactNode, Fragment } from 'react'

// Title lưu dạng "Nấu ăn ngon *mỗi ngày* tại căn bếp" — phần giữa *…* render thành <em>
export function renderEmphasisTitle(title: string): ReactNode {
  const parts = title.split('*')
  if (parts.length < 3) return title
  return parts.map((part, i) => (i % 2 === 1 ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>))
}

// hero_slides.subtitle lưu dạng "label||desc" — core schema chỉ có 1 cột subtitle
export function splitHeroSubtitle(subtitle: string): { label: string; desc: string } {
  const idx = subtitle.indexOf('||')
  if (idx === -1) return { label: '', desc: subtitle }
  return { label: subtitle.slice(0, idx), desc: subtitle.slice(idx + 2) }
}

export interface Ingredient { qty: string; name: string }
export function parseIngredients(raw: string): Ingredient[] {
  return raw.split('\n').map(l => l.trim()).filter(Boolean).map(line => {
    const [qty, ...rest] = line.split('|')
    return { qty: qty ?? '', name: rest.join('|') || qty || '' }
  })
}

export interface RecipeStep { title: string; desc: string; image: string }
export function parseSteps(raw: string): RecipeStep[] {
  return raw.split('\n').map(l => l.trim()).filter(Boolean).map(line => {
    const [title = '', desc = '', image = ''] = line.split('||')
    return { title, desc, image }
  })
}

export function parseTags(raw: string): string[] {
  return raw.split('|').map(t => t.trim()).filter(Boolean)
}

export function formatSaved(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return String(n)
}

export function formatDate(iso: string): string {
  const d = new Date(iso.replace(' ', 'T'))
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('vi-VN')
}
