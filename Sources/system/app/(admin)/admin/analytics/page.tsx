'use client'
import AdminLayout from '@/components/admin/AdminLayout'
import { useState, useEffect } from 'react'

type Period = '1' | '7' | '30'

interface AnalyticsData {
  summary: { today: number; week: number; period: number; unique: number }
  topPages: { path: string; count: number }[]
  topReferrers: { referrer: string; count: number }[]
  daily: { date: string; count: number }[]
  hourly: { hour: number; count: number }[]
  recent: { path: string; referrer: string | null; userAgent: string | null; createdAt: string }[]
}

function parseBrowser(ua: string | null): string {
  if (!ua) return '—'
  if (ua.includes('Edg/')) return 'Edge'
  if (ua.includes('OPR/') || ua.includes('Opera')) return 'Opera'
  if (ua.includes('Chrome/')) return 'Chrome'
  if (ua.includes('Firefox/')) return 'Firefox'
  if (ua.includes('Safari/') && !ua.includes('Chrome')) return 'Safari'
  if (ua.includes('Mobile')) return 'Mobile'
  return 'Other'
}

function parseDevice(ua: string | null): string {
  if (!ua) return '—'
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS'
  if (/Android/.test(ua)) return 'Android'
  if (/Windows/.test(ua)) return 'Windows'
  if (/Mac OS X/.test(ua)) return 'macOS'
  if (/Linux/.test(ua)) return 'Linux'
  return 'Other'
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 60000) return 'Vừa xong'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`
  return `${Math.floor(diff / 86400000)} ngày trước`
}

function cleanRef(ref: string | null): string {
  if (!ref) return 'Direct'
  try { return new URL(ref).hostname.replace(/^www\./, '') } catch { return ref.slice(0, 30) }
}

function formatDate(iso: string): string {
  const [, m, d] = iso.split('-')
  return `${d}/${m}`
}

function BarChart({ bars, label }: { bars: { label: string; count: number; title: string }[]; label?: string }) {
  const max = Math.max(...bars.map(b => b.count), 1)
  return (
    <div>
      {label && <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 8 }}>{label}</div>}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 80 }}>
        {bars.map((b, i) => (
          <div key={i} title={b.title}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', cursor: 'default' }}>
            <div style={{
              width: '100%', borderRadius: '2px 2px 0 0',
              background: b.count > 0 ? 'var(--accent)' : 'var(--border)',
              height: `${Math.max((b.count / max) * 100, b.count > 0 ? 4 : 1)}%`,
              transition: 'height .3s',
            }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 2, marginTop: 4 }}>
        {bars.map((b, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 9, color: 'var(--text-3)', overflow: 'hidden' }}>
            {b.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('30')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/analytics?days=${period}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [period])

  const periodLabel: Record<Period, string> = { '1': 'hôm nay', '7': '7 ngày qua', '30': '30 ngày qua' }

  const chartBars = period === '1'
    ? (data?.hourly || []).map(h => ({
        label: h.hour % 4 === 0 ? `${h.hour}h` : '',
        count: h.count,
        title: `${h.hour}:00 — ${h.count} lượt`,
      }))
    : (data?.daily || []).map(d => ({
        label: formatDate(d.date),
        count: d.count,
        title: `${d.date} — ${d.count} lượt`,
      }))

  const showEveryN = period === '7' ? 1 : 5
  const labeledBars = chartBars.map((b, i) => ({
    ...b,
    label: period === '1' ? b.label : (i % showEveryN === 0 ? b.label : ''),
  }))

  const maxPage = data?.topPages[0]?.count || 1
  const maxRef  = data?.topReferrers[0]?.count || 1

  return (
    <AdminLayout title="Thống kê truy cập">

      {/* Period tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {(['1', '7', '30'] as Period[]).map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            style={{
              padding: '7px 16px', borderRadius: 8, border: `1px solid ${period === p ? 'var(--accent)' : 'var(--border)'}`,
              background: period === p ? 'var(--accent-light)' : 'transparent',
              color: period === p ? 'var(--accent)' : 'var(--text-2)',
              fontSize: 13, fontWeight: period === p ? 600 : 400,
              fontFamily: 'var(--sans)', cursor: 'pointer', transition: 'all .15s',
            }}>
            {p === '1' ? 'Hôm nay' : p === '7' ? '7 ngày' : '30 ngày'}
          </button>
        ))}
        {loading && <span style={{ fontSize: 12, color: 'var(--text-3)', alignSelf: 'center', marginLeft: 8 }}>Đang tải...</span>}
      </div>

      {/* Summary cards */}
      <div className="row g-3 mb-4">
        {[
          { label: `Lượt xem ${periodLabel[period]}`, value: period === '1' ? data?.summary.today : period === '7' ? data?.summary.week : data?.summary.period },
          { label: 'Người dùng độc lập', value: data?.summary.unique },
          { label: 'Lượt xem hôm nay', value: data?.summary.today },
          { label: 'Lượt xem 7 ngày', value: data?.summary.week },
        ].map(s => (
          <div key={s.label} className="col-md-3 col-6">
            <div className="stat-card">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{loading ? '—' : (s.value ?? 0).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 16 }}>
          Lượt xem theo {period === '1' ? 'giờ' : 'ngày'}
        </div>
        {loading || !data ? (
          <div style={{ height: 96, background: 'var(--warm)', borderRadius: 8 }} />
        ) : (
          <BarChart bars={labeledBars} />
        )}
      </div>

      {/* Top pages + Top referrers */}
      <div className="row g-3 mb-3">
        <div className="col-lg-6">
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', height: '100%' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', fontSize: 14, fontWeight: 500 }}>
              Trang được xem nhiều nhất
            </div>
            {loading || !data?.topPages.length ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
                {loading ? 'Đang tải...' : 'Chưa có dữ liệu'}
              </div>
            ) : (
              <div style={{ padding: '8px 0' }}>
                {data.topPages.map((p, i) => (
                  <div key={i} style={{ padding: '10px 20px', borderBottom: i < data.topPages.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: 'var(--text)', fontFamily: 'monospace' }}
                        title={p.path}>
                        {p.path.length > 40 ? '…' + p.path.slice(-38) : p.path}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', flexShrink: 0, marginLeft: 8 }}>{p.count}</span>
                    </div>
                    <div style={{ height: 3, background: 'var(--border-light)', borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${(p.count / maxPage) * 100}%`, background: 'var(--accent)', borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', height: '100%' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', fontSize: 14, fontWeight: 500 }}>
              Nguồn truy cập
            </div>
            {loading || !data?.topReferrers.length ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
                {loading ? 'Đang tải...' : 'Chưa có dữ liệu (hoặc toàn bộ từ direct)'}
              </div>
            ) : (
              <div style={{ padding: '8px 0' }}>
                {data.topReferrers.map((r, i) => (
                  <div key={i} style={{ padding: '10px 20px', borderBottom: i < data.topReferrers.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 13, color: 'var(--text)' }}>{r.referrer}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', flexShrink: 0, marginLeft: 8 }}>{r.count}</span>
                    </div>
                    <div style={{ height: 3, background: 'var(--border-light)', borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${(r.count / maxRef) * 100}%`, background: 'var(--accent-mid)', borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent visits */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', fontSize: 14, fontWeight: 500 }}>
          Lượt truy cập gần đây
        </div>
        {loading || !data?.recent.length ? (
          <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
            {loading ? 'Đang tải...' : 'Chưa có lượt truy cập nào'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', background: 'var(--bg)' }}>
                  {['Thời gian', 'Trang', 'Nguồn', 'Trình duyệt', 'Thiết bị'].map(h => (
                    <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.recent.map((v, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{relativeTime(v.createdAt)}</td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text)', fontFamily: 'monospace' }}
                      title={v.path}>
                      {v.path.length > 40 ? '…' + v.path.slice(-38) : v.path}
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-2)' }}>{cleanRef(v.referrer)}</td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-2)' }}>{parseBrowser(v.userAgent)}</td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-2)' }}>{parseDevice(v.userAgent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </AdminLayout>
  )
}
