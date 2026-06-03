'use client'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface PackageItem {
  id: number
  name: string
  icon: string
  tagline: string
  price: string
  hot: boolean
  status: string
  stepsCount: number
  suitable: string[]
}

export default function HowItWorksReorder({ initialPackages }: { initialPackages: PackageItem[] }) {
  const [packages, setPackages] = useState(initialPackages)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  async function move(idx: number, dir: -1 | 1) {
    const newList = [...packages]
    const swapIdx = idx + dir
    if (swapIdx < 0 || swapIdx >= newList.length) return
    ;[newList[idx], newList[swapIdx]] = [newList[swapIdx], newList[idx]]
    setPackages(newList)
    await fetch('/api/admin/how-it-works/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: newList.map(p => p.id) }),
    })
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Xóa gói "${name}"? Tất cả bước quy trình cũng sẽ bị xóa.`)) return
    setDeleting(id)
    await fetch(`/api/admin/how-it-works/${id}`, { method: 'DELETE' })
    setPackages(prev => prev.filter(p => p.id !== id))
    setDeleting(null)
    startTransition(() => router.refresh())
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {packages.map((pkg, idx) => (
        <div key={pkg.id} style={{
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12,
          padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16,
        }}>
          {/* Reorder buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <button onClick={() => move(idx, -1)} disabled={idx === 0}
              style={{ width: 24, height: 22, border: '1px solid var(--border)', borderRadius: 5, background: 'var(--bg)', cursor: idx === 0 ? 'not-allowed' : 'pointer', fontSize: 11, opacity: idx === 0 ? .4 : 1 }}>▲</button>
            <button onClick={() => move(idx, 1)} disabled={idx === packages.length - 1}
              style={{ width: 24, height: 22, border: '1px solid var(--border)', borderRadius: 5, background: 'var(--bg)', cursor: idx === packages.length - 1 ? 'not-allowed' : 'pointer', fontSize: 11, opacity: idx === packages.length - 1 ? .4 : 1 }}>▼</button>
          </div>

          {/* Order number */}
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--warm)', fontSize: 12, fontWeight: 700, color: 'var(--text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {idx + 1}
          </div>

          {/* Icon */}
          <div style={{ fontSize: 28, flexShrink: 0 }}>{pkg.icon}</div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{pkg.name}</span>
              {pkg.hot && (
                <span style={{ fontSize: 10, fontWeight: 600, background: 'var(--accent)', color: '#fff', padding: '2px 8px', borderRadius: 10 }}>PHỔ BIẾN</span>
              )}
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: pkg.status === 'published' ? 'var(--accent-light)' : 'var(--warm)', color: pkg.status === 'published' ? 'var(--accent)' : 'var(--text-3)' }}>
                {pkg.status === 'published' ? 'Hiển thị' : 'Ẩn'}
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>{pkg.tagline}</div>
            <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-3)' }}>
              <span>💰 {pkg.price || '—'}</span>
              <span>📌 {pkg.stepsCount} bước</span>
              <span>✓ {pkg.suitable.length} mục "Phù hợp với"</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <Link href={`/admin/how-it-works/${pkg.id}/edit`}
              style={{ padding: '7px 16px', border: '1px solid var(--border)', borderRadius: 7, fontSize: 12, color: 'var(--text-2)', textDecoration: 'none' }}>
              Chỉnh sửa
            </Link>
            <button onClick={() => handleDelete(pkg.id, pkg.name)} disabled={deleting === pkg.id || isPending}
              style={{ padding: '7px 14px', border: '1px solid #fecaca', borderRadius: 7, fontSize: 12, color: '#dc2626', background: '#fef2f2', cursor: 'pointer', opacity: deleting === pkg.id ? .5 : 1 }}>
              {deleting === pkg.id ? '...' : 'Xóa'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
