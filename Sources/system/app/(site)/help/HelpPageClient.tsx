'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Category {
  id: number
  name: string
  slug: string
  icon?: string | null
  articleCount: number
  description?: string | null
  sortOrder?: number
  status?: string
  createdAt?: Date
  updatedAt?: Date
}

interface Article {
  id: number
  title: string
  slug: string
  excerpt?: string
  metaTitle?: string
  metaDescription?: string
  status: string
  sortOrder: number
  category: { id: number; name: string; slug: string }
}

interface PaginationData {
  data: Article[]
  pagination: { total: number; page: number; limit: number; pages: number }
}

export default function HelpPageClient({ categories }: { categories: Category[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [articles, setArticles] = useState<Article[]>([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, pages: 1 })
  const [loading, setLoading] = useState(false)

  const fetchArticles = async (page = 1, categoryId: string | null = null, query = '') => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (query) params.append('q', query)
      if (categoryId) {
        const cat = categories.find(c => c.slug === categoryId)
        if (cat) params.append('category', categoryId)
      }
      params.append('page', page.toString())
      params.append('limit', '12')

      const res = await fetch(`/api/help/articles?${params}`)
      const data: PaginationData = await res.json()
      setArticles(data.data)
      setPagination(data.pagination)
    } catch (err) {
      console.error('Error fetching articles:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchArticles(1, selectedCategory, searchQuery)
    }, 400)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery, selectedCategory])

  return (
    <div>
      {/* Search Bar */}
      <div style={{
        marginBottom: 40,
        display: 'flex',
        gap: 12,
      }}>
        <input
          type="text"
          placeholder="🔍 Tìm kiếm bài viết..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            padding: '12px 16px',
            border: '1px solid var(--border)',
            borderRadius: 8,
            fontSize: 14,
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'border-color .2s',
          }}
          onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
          onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
        />
      </div>

      {/* Category Filter */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
            Danh mục
          </h3>
        </div>
        <div style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
        }}>
          <button
            onClick={() => setSelectedCategory(null)}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              border: selectedCategory === null ? 'none' : '1px solid var(--border)',
              background: selectedCategory === null ? 'var(--accent)' : 'transparent',
              color: selectedCategory === null ? '#fff' : 'var(--text-2)',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              transition: 'all .2s',
            }}
          >
            Tất cả
          </button>
          {categories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              style={{
                padding: '8px 16px',
                borderRadius: 20,
                border: selectedCategory === cat.slug ? 'none' : '1px solid var(--border)',
                background: selectedCategory === cat.slug ? 'var(--accent)' : 'transparent',
                color: selectedCategory === cat.slug ? '#fff' : 'var(--text-2)',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                transition: 'all .2s',
              }}
              onMouseEnter={e => !selectedCategory?.includes(cat.slug) && (e.currentTarget.style.borderColor = 'var(--accent)')}
              onMouseLeave={e => !selectedCategory?.includes(cat.slug) && (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              {cat.name} ({cat.articleCount})
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {articles.length > 0 ? (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 20,
            marginBottom: 40,
          }}>
            {articles.map(article => (
              <Link
                key={article.id}
                href={`/help/articles/${article.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: 18,
                  background: 'var(--surface)',
                  cursor: 'pointer',
                  transition: 'all .2s',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.borderColor = 'var(--accent-mid)'
                  e.currentTarget.style.boxShadow = '0 10px 32px rgba(0,0,0,.07)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                >
                  <span style={{
                    display: 'inline-block',
                    fontSize: 10,
                    fontWeight: 600,
                    background: 'var(--accent-light)',
                    color: 'var(--accent)',
                    padding: '3px 8px',
                    borderRadius: 3,
                    marginBottom: 10,
                    width: 'fit-content',
                  }}>
                    {article.category.name}
                  </span>
                  <h4 style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: 'var(--text)',
                    marginBottom: 6,
                    flex: 1,
                    lineHeight: 1.4,
                  }}>
                    {article.title}
                  </h4>
                  {article.excerpt && (
                    <p style={{
                      fontSize: 12,
                      color: 'var(--text-2)',
                      lineHeight: 1.5,
                      marginBottom: 10,
                      flex: 1,
                    }}>
                      {article.excerpt.substring(0, 80)}...
                    </p>
                  )}
                  <div style={{
                    fontSize: 12,
                    color: 'var(--accent)',
                    fontWeight: 500,
                  }}>
                    Đọc →
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 40,
            }}>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => {
                    fetchArticles(page, selectedCategory, searchQuery)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: 'none',
                    background: pagination.page === page ? 'var(--accent)' : 'var(--border)',
                    color: pagination.page === page ? '#fff' : 'var(--text)',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: pagination.page === page ? 600 : 400,
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--text-3)',
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 14 }}>
            {loading ? 'Đang tải...' : 'Không tìm thấy bài viết nào'}
          </div>
        </div>
      )}
    </div>
  )
}
