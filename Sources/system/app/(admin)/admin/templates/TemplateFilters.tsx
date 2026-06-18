'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

interface Props {
  industries: { slug: string; name: string }[]
  total: number
  withWebsite: number
}

export default function TemplateFilters({ industries, total, withWebsite }: Props) {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const q        = searchParams.get('q')        ?? ''
  const category = searchParams.get('category') ?? ''
  const status   = searchParams.get('status')   ?? ''
  const industry = searchParams.get('industry') ?? ''
  const website  = searchParams.get('website')  ?? ''

  const update = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    router.replace(`/admin/templates?${params.toString()}`)
  }, [router, searchParams])

  const hasFilter = q || category || status || industry || website

  const selectStyle: React.CSSProperties = {
    padding: '7px 12px', borderRadius: 8, border: '1px solid var(--border)',
    fontSize: 13, fontFamily: 'inherit', background: 'var(--surface)', cursor: 'pointer',
  }

  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>

      {/* Search */}
      <input
        type="search"
        placeholder="Tìm tên template..."
        defaultValue={q}
        onChange={e => update('q', e.target.value)}
        style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, width: 200, outline: 'none', fontFamily: 'inherit' }}
      />

      {/* Category */}
      <select value={category} onChange={e => update('category', e.target.value)} style={selectStyle}>
        <option value="">Tất cả loại</option>
        <option value="web">Web template</option>
        <option value="admin">Admin template</option>
      </select>

      {/* Industry */}
      <select value={industry} onChange={e => update('industry', e.target.value)} style={selectStyle}>
        <option value="">Tất cả ngành</option>
        {industries.map(i => <option key={i.slug} value={i.slug}>{i.name}</option>)}
      </select>

      {/* Status */}
      <select value={status} onChange={e => update('status', e.target.value)} style={selectStyle}>
        <option value="">Tất cả trạng thái</option>
        <option value="published">Đang bán</option>
        <option value="draft">Nháp</option>
      </select>

      {/* Gói B */}
      <select value={website} onChange={e => update('website', e.target.value)}
        style={{ ...selectStyle, borderColor: website ? 'var(--accent)' : 'var(--border)', color: website ? 'var(--accent)' : 'inherit' }}>
        <option value="">Tất cả gói</option>
        <option value="yes">🌐 Có Gói B ({withWebsite})</option>
        <option value="no">Template only ({total - withWebsite})</option>
      </select>

      {/* Clear */}
      {hasFilter && (
        <button onClick={() => router.replace('/admin/templates')}
          style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 12, background: 'none', cursor: 'pointer', color: 'var(--text-2)', fontFamily: 'inherit' }}>
          ✕ Xoá filter
        </button>
      )}

      <span style={{ fontSize: 12, color: 'var(--text-3)', marginLeft: 'auto' }}>{total} kết quả</span>
    </div>
  )
}
