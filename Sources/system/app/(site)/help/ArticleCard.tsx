'use client'

import { useRouter } from 'next/navigation'

interface Article {
  id: number
  slug: string
  title: string
  excerpt: string | null
}

export default function ArticleCard({ article }: { article: Article }) {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push(`/help/articles/${article.slug}`)}
      style={{
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: 20,
        background: 'var(--surface)',
        cursor: 'pointer',
        transition: 'all .2s',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(-4px)'
        el.style.boxShadow = '0 10px 32px rgba(0,0,0,.07)'
        el.style.borderColor = 'var(--accent-mid)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'none'
        el.style.boxShadow = 'none'
        el.style.borderColor = 'var(--border)'
      }}
    >
      <span
        style={{
          display: 'inline-block',
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--accent)',
          marginBottom: 8,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        ❓ Hướng dẫn
      </span>
      <h3
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: 'var(--text)',
          marginBottom: 8,
          lineHeight: 1.4,
        }}
      >
        {article.title}
      </h3>
      <p
        style={{
          fontSize: 14,
          color: 'var(--text-2)',
          lineHeight: 1.5,
          flex: 1,
        }}
      >
        {article.excerpt}
      </p>
      <div
        style={{
          fontSize: 13,
          color: 'var(--accent)',
          marginTop: 12,
          fontWeight: 500,
        }}
      >
        Đọc thêm →
      </div>
    </div>
  )
}
