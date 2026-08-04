'use client'

import { useMemo } from 'react'

interface ArticleDetailClientProps {
  content: string
}

function renderMarkdown(content: string) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let currentParagraph: string[] = []

  const flush = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join('\n').trim()
      if (text) {
        elements.push(
          <p key={elements.length} style={{
            fontSize: 15,
            lineHeight: 1.7,
            color: 'var(--text)',
            marginBottom: 16,
          }}>
            {text.split(/\*\*([^*]+)\*\*/g).map((part, idx) =>
              idx % 2 === 0 ? part : <strong key={idx}>{part}</strong>
            )}
          </p>
        )
      }
      currentParagraph = []
    }
  }

  lines.forEach((line, idx) => {
    const trimmed = line.trim()

    // H2 heading
    if (trimmed.startsWith('## ')) {
      flush()
      elements.push(
        <h2 key={elements.length} style={{
          fontSize: 24,
          fontWeight: 600,
          color: 'var(--text)',
          marginTop: 40,
          marginBottom: 16,
          lineHeight: 1.3,
        }}>
          {trimmed.substring(3)}
        </h2>
      )
    }
    // H3 heading
    else if (trimmed.startsWith('### ')) {
      flush()
      elements.push(
        <h3 key={elements.length} style={{
          fontSize: 18,
          fontWeight: 600,
          color: 'var(--text)',
          marginTop: 32,
          marginBottom: 12,
          lineHeight: 1.3,
        }}>
          {trimmed.substring(4)}
        </h3>
      )
    }
    // Unordered list item
    else if (trimmed.startsWith('- ')) {
      flush()
      const listItems: string[] = []
      let i = idx
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        listItems.push(lines[i].trim().substring(2))
        i++
      }
      elements.push(
        <ul key={elements.length} style={{
          marginBottom: 16,
          paddingLeft: 24,
        }}>
          {listItems.map((item, i) => (
            <li key={i} style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: 'var(--text)',
              marginBottom: 6,
            }}>
              {item}
            </li>
          ))}
        </ul>
      )
    }
    // Code block
    else if (trimmed.startsWith('```')) {
      flush()
      const codeLines: string[] = []
      let i = idx + 1
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      elements.push(
        <pre key={elements.length} style={{
          background: 'var(--warm2)',
          border: '1px solid var(--border-light)',
          borderRadius: 8,
          padding: 16,
          fontSize: 13,
          lineHeight: 1.6,
          color: 'var(--text)',
          overflow: 'auto',
          marginBottom: 16,
          fontFamily: 'monospace',
        }}>
          {codeLines.join('\n')}
        </pre>
      )
      // Skip to end of code block
      lines.splice(idx + 1, i - idx)
    }
    // Blockquote
    else if (trimmed.startsWith('> ')) {
      flush()
      elements.push(
        <blockquote key={elements.length} style={{
          borderLeft: '4px solid var(--accent)',
          paddingLeft: 16,
          marginLeft: 0,
          marginBottom: 16,
          color: 'var(--text-2)',
          fontStyle: 'italic',
          fontSize: 15,
          lineHeight: 1.7,
        }}>
          {trimmed.substring(2)}
        </blockquote>
      )
    }
    // Empty line = paragraph break
    else if (!trimmed) {
      flush()
    }
    // Regular paragraph
    else {
      currentParagraph.push(trimmed)
    }
  })

  flush()
  return elements
}

export default function ArticleDetailClient({ content }: ArticleDetailClientProps) {
  const rendered = useMemo(() => renderMarkdown(content), [content])

  return (
    <article style={{
      fontSize: 15,
      lineHeight: 1.7,
      color: 'var(--text)',
    }}>
      {rendered}
    </article>
  )
}
