import type { ReactNode } from 'react'

// Parse "text *nhấn* text" -> <em>nhấn</em>, hỗ trợ cả xuống dòng "\n" -> <br/>
// (quy ước dùng chung xuyên suốt Database.php seed data + Settings admin).
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

export function parseLines(raw: string | undefined): string[] {
  return (raw || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean)
}

export function paragraphs(raw: string | undefined): string[] {
  return (raw || '').split(/\r?\n\r?\n/).map(s => s.trim()).filter(Boolean)
}
