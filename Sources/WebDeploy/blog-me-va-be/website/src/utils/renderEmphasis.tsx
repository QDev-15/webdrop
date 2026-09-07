import { Fragment } from 'react'

// Render text có cú pháp *từ* -> in nghiêng màu accent (dùng cho title/settings content)
// Đồng bộ với admin/README: "Dùng dấu *từ* để tô màu nhấn"
export function renderEmphasis(text: string) {
  const parts = (text || '').split(/(\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    return <Fragment key={i}>{part}</Fragment>
  })
}
