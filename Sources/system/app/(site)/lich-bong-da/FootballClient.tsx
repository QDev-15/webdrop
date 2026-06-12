'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────
interface Team { id: number; name: string; shortName?: string; tla?: string; crest?: string }
interface Score { home: number | null; away: number | null }
type MatchStatus = 'SCHEDULED' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'POSTPONED' | 'CANCELLED'
interface Match {
  id: number
  utcDate: string
  status: MatchStatus
  minute?: number | null
  stage: string
  group?: string | null
  homeTeam: Team
  awayTeam: Team
  score: { fullTime: Score; halfTime: Score; winner?: string | null }
  venue?: string | null
}
interface StandingRow {
  position: number; team: Team; playedGames: number
  won: number; draw: number; lost: number
  points: number; goalsFor: number; goalsAgainst: number; goalDifference: number
}
interface StandingGroup { group: string; table: StandingRow[] }

// ── Constants ────────────────────────────────────────────────────────────────
const STATUS_ORDER: Record<MatchStatus, number> = {
  IN_PLAY: 0, PAUSED: 1, SCHEDULED: 2, FINISHED: 3, POSTPONED: 4, CANCELLED: 5,
}

const STAGE: Record<string, string> = {
  GROUP_STAGE: 'Vòng bảng', ROUND_OF_16: 'Vòng 1/8',
  QUARTER_FINALS: 'Tứ kết', SEMI_FINALS: 'Bán kết',
  THIRD_PLACE: 'Tranh hạng ba', FINAL: 'Chung kết',
}
const GROUP: Record<string, string> = {
  GROUP_A: 'Bảng A', GROUP_B: 'Bảng B', GROUP_C: 'Bảng C', GROUP_D: 'Bảng D',
  GROUP_E: 'Bảng E', GROUP_F: 'Bảng F', GROUP_G: 'Bảng G', GROUP_H: 'Bảng H',
  GROUP_I: 'Bảng I', GROUP_J: 'Bảng J', GROUP_K: 'Bảng K', GROUP_L: 'Bảng L',
}
const CHANNELS = [
  { name: 'VTV3', url: 'https://vtvgo.vn/xem-truc-tuyen.html' },
  { name: 'FPT Play', url: 'https://fptplay.vn' },
  { name: 'K+', url: 'https://kpluscdn.net' },
]

// ── Helpers ──────────────────────────────────────────────────────────────────
function toVNTime(utcDate: string) {
  const d = new Date(new Date(utcDate).getTime() + 7 * 3600000)
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`
}
function toUTCTime(utcDate: string) {
  const d = new Date(utcDate)
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`
}
function toVNDateKey(utcDate: string) {
  return new Date(new Date(utcDate).getTime() + 7 * 3600000).toISOString().slice(0, 10)
}
function todayVN() {
  return new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 10)
}
function extractYTId(input: string): string | null {
  if (!input) return null
  const m = input.match(/(?:youtube\.com\/(?:watch\?v=|live\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  if (m) return m[1]
  if (/^[A-Za-z0-9_-]{11}$/.test(input)) return input
  return null
}
function buildDateTabs() {
  return Array.from({ length: 10 }, (_, i) => {
    const d = new Date(Date.now() + 7 * 3600000)
    d.setUTCDate(d.getUTCDate() + i - 2)
    return d.toISOString().slice(0, 10)
  })
}
function dateLabel(key: string) {
  const today = todayVN()
  const yest = new Date(Date.now() + 7 * 3600000); yest.setUTCDate(yest.getUTCDate() - 1)
  const tom = new Date(Date.now() + 7 * 3600000); tom.setUTCDate(tom.getUTCDate() + 1)
  if (key === today) return 'Hôm nay'
  if (key === yest.toISOString().slice(0, 10)) return 'Hôm qua'
  if (key === tom.toISOString().slice(0, 10)) return 'Ngày mai'
  const d = new Date(key + 'T00:00:00Z')
  return `${d.getUTCDate()}/${d.getUTCMonth() + 1}`
}

// ── Sub-components ────────────────────────────────────────────────────────────
function TeamCrest({ team, size }: { team: Team; size: number }) {
  const [failed, setFailed] = useState(false)
  return (
    <div style={{ width: size, height: size, borderRadius: 4, border: '1px solid var(--border-light)', background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
      {!failed && team.crest
        ? <img src={team.crest} alt={team.name} width={size - 6} height={size - 6} onError={() => setFailed(true)} style={{ objectFit: 'contain' }} />
        : <span style={{ fontSize: size * 0.28, fontWeight: 700, color: 'var(--text-2)' }}>{(team.tla || team.name).slice(0, 3)}</span>
      }
    </div>
  )
}

function TeamBlock({ team, side }: { team: Team; side: 'home' | 'away' }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, flexDirection: side === 'away' ? 'row-reverse' : 'row' }}>
      <TeamCrest team={team} size={42} />
      <div style={{ textAlign: side === 'away' ? 'right' : 'left', minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {team.shortName || team.name}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.3px' }}>{team.tla}</div>
      </div>
    </div>
  )
}

function StatusBadge({ match }: { match: Match }) {
  if (match.status === 'IN_PLAY') return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fef2f2', border: '1.5px solid #f87171', borderRadius: 7, padding: '6px 16px' }}>
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite', display: 'inline-block', flexShrink: 0 }} />
      <span style={{ fontSize: 16, fontWeight: 800, color: '#dc2626', letterSpacing: '.5px' }}>TRỰC TIẾP</span>
    </div>
  )
  if (match.status === 'PAUSED') return (
    <div style={{ fontSize: 11, fontWeight: 600, color: '#92400e', background: '#fffbeb', border: '1px solid #f59e0b', borderRadius: 5, padding: '3px 9px' }}>⏸ Giải lao</div>
  )
  if (match.status === 'FINISHED') return (
    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', background: 'var(--warm2)', borderRadius: 5, padding: '3px 9px' }}>Kết thúc</div>
  )
  if (match.status === 'POSTPONED') return (
    <div style={{ fontSize: 11, fontWeight: 600, color: '#dc2626', background: '#fef2f2', borderRadius: 5, padding: '3px 9px' }}>Hoãn</div>
  )
  if (match.status === 'CANCELLED') return (
    <div style={{ fontSize: 11, fontWeight: 600, color: '#dc2626', background: '#fef2f2', borderRadius: 5, padding: '3px 9px' }}>Huỷ</div>
  )
  return null
}

function MatchCard({ match }: { match: Match }) {
  const isLive = match.status === 'IN_PLAY'
  const isPause = match.status === 'PAUSED'
  const isDone = match.status === 'FINISHED'
  const showScore = (isLive || isPause || isDone) && match.score.fullTime.home !== null

  const stageLabel = STAGE[match.stage] || match.stage
  const groupLabel = match.group ? GROUP[match.group] || '' : ''

  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 14,
      border: `1px solid ${(isLive || isPause) ? 'var(--accent-mid)' : 'var(--border)'}`,
      padding: '16px 18px', position: 'relative', overflow: 'hidden', transition: 'border-color .2s',
    }}>
      {/* Live top-border pulse */}
      {isLive && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--accent)', animation: 'pulse 1.5s infinite' }} />}

      {/* Stage + status row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isLive ? 10 : 14, flexWrap: 'wrap', gap: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
          {groupLabel ? `${stageLabel} · ${groupLabel}` : stageLabel}
        </span>
        {!isLive && <StatusBadge match={match} />}
      </div>
      {/* Centered live badge */}
      {isLive && (
        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <StatusBadge match={match} />
        </div>
      )}

      {/* Teams + score */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <TeamBlock team={match.homeTeam} side="home" />

        <div style={{ textAlign: 'center', flexShrink: 0, minWidth: 88 }}>
          {showScore ? (
            <>
              <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-1px', lineHeight: 1, color: (isLive || isPause) ? 'var(--accent)' : 'var(--text)' }}>
                {match.score.fullTime.home} – {match.score.fullTime.away}
              </div>
              {(isLive || isPause) && match.minute && (
                <div style={{ fontSize: 11, color: 'var(--accent-mid)', fontWeight: 500, marginTop: 3 }}>
                  {isPause ? 'HT' : `${match.minute}'`}
                </div>
              )}
              <div style={{ marginTop: 6, lineHeight: 1.6 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)' }}>{toVNTime(match.utcDate)} <span style={{ fontWeight: 400, color: 'var(--text-3)' }}>VNTime (GMT+7)</span></div>
                <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{toUTCTime(match.utcDate)} UTC</div>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-2)', lineHeight: 1.2 }}>
                {toVNTime(match.utcDate)}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>VNTime (GMT+7)</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>{toUTCTime(match.utcDate)} UTC</div>
            </>
          )}
        </div>

        <TeamBlock team={match.awayTeam} side="away" />
      </div>

      {/* Broadcast channels */}
      <div style={{ marginTop: 14, paddingTop: 11, borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, color: 'var(--text-3)', flexShrink: 0 }}>Xem tại:</span>
        {CHANNELS.map(ch => (
          <a key={ch.name} href={ch.url} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', textDecoration: 'none', padding: '2px 8px', borderRadius: 4, background: 'var(--accent-light)' }}>
            {ch.name}
          </a>
        ))}
      </div>
    </div>
  )
}

function StandingTable({ group }: { group: StandingGroup }) {
  const label = GROUP[group.group] || group.group
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: '11px 16px', background: 'var(--warm)', borderBottom: '1px solid var(--border-light)', fontSize: 12, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '.4px' }}>
        {label}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              {['Đội', 'Đ', 'T', 'H', 'B', 'GH', 'GT', 'HS', 'Đ'].map((h, i) => (
                <th key={i} style={{ padding: '7px 8px', textAlign: i === 0 ? 'left' : 'center', fontWeight: 600, color: 'var(--text-3)', minWidth: i === 0 ? 'auto' : 28, paddingLeft: i === 0 ? 14 : 8 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {group.table.map((row, i) => (
              <tr key={row.team.id} style={{ borderBottom: i < group.table.length - 1 ? '1px solid var(--border-light)' : 'none', background: i < 2 ? 'rgba(26,107,82,.04)' : 'transparent' }}>
                <td style={{ padding: '8px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-3)', minWidth: 14, fontWeight: 500 }}>{row.position}</span>
                    <TeamCrest team={row.team} size={22} />
                    <span style={{ fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap' }}>{row.team.shortName || row.team.name}</span>
                  </div>
                </td>
                {[row.playedGames, row.won, row.draw, row.lost, row.goalsFor, row.goalsAgainst,
                row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference].map((v, j) => (
                  <td key={j} style={{ padding: '8px', textAlign: 'center', color: 'var(--text-2)' }}>{v}</td>
                ))}
                <td style={{ padding: '8px', textAlign: 'center', fontWeight: 700, color: 'var(--accent)' }}>{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, height: 130, opacity: 0.6, animation: 'pulse 1.5s infinite' }} />
      ))}
    </div>
  )
}

function NoKeyBanner() {
  return (
    <div style={{ textAlign: 'center', padding: '52px 20px', border: '2px dashed var(--border)', borderRadius: 14, background: 'var(--warm)' }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>⚙️</div>
      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8, color: 'var(--text)' }}>Chưa cấu hình API key</div>
      <p style={{ fontSize: 13, color: 'var(--text-2)', maxWidth: 400, margin: '0 auto 16px', lineHeight: 1.75 }}>
        Vào <strong>Admin → Cài đặt → Tích hợp</strong> → dán API key từ{' '}
        <a href="https://www.football-data.org/account" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
          football-data.org
        </a>.<br />Đăng ký miễn phí, nhận key ngay lập tức.
      </p>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FootballClient({ youtubeEmbed }: { youtubeEmbed?: string }) {
  const [tab, setTab] = useState<'schedule' | 'standings'>('schedule')
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [noKey, setNoKey] = useState(false)
  const [standings, setStandings] = useState<StandingGroup[]>([])
  const [standingsLoaded, setStandingsLoaded] = useState(false)
  const [standingsLoading, setStandingsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(todayVN())
  const initialized = useRef(false)
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const ytId = extractYTId(youtubeEmbed || '')
  const dateTabs = buildDateTabs()

  const fetchMatches = useCallback(async () => {
    const from = dateTabs[0]
    const to = dateTabs[dateTabs.length - 1]
    try {
      const res = await fetch(`/api/football/matches?dateFrom=${from}&dateTo=${to}`)
      const data = await res.json()
      setNoKey(!!data.noKey)
      if (Array.isArray(data.matches)) setMatches(data.matches)
    } catch { /* ignore */ } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Initial fetch
  useEffect(() => { fetchMatches() }, [fetchMatches])

  // Auto-jump to nearest relevant date on first load
  useEffect(() => {
    if (initialized.current || matches.length === 0) return
    initialized.current = true
    const today = todayVN()
    const hasTodayMatches = matches.some(m => toVNDateKey(m.utcDate) === today)
    if (hasTodayMatches) return // keep today selected

    const live = matches.find(m => m.status === 'IN_PLAY' || m.status === 'PAUSED')
    if (live) { setSelectedDate(toVNDateKey(live.utcDate)); return }

    const upcoming = matches
      .filter(m => m.status === 'SCHEDULED')
      .sort((a, b) => a.utcDate.localeCompare(b.utcDate))[0]
    if (upcoming) setSelectedDate(toVNDateKey(upcoming.utcDate))
  }, [matches])

  // Polling: 30s if live match, 5min otherwise
  useEffect(() => {
    if (pollingRef.current) clearInterval(pollingRef.current)
    const hasLive = matches.some(m => m.status === 'IN_PLAY' || m.status === 'PAUSED')
    pollingRef.current = setInterval(fetchMatches, hasLive ? 30000 : 300000)
    return () => { if (pollingRef.current) clearInterval(pollingRef.current) }
  }, [matches, fetchMatches])

  async function loadStandings() {
    if (standingsLoaded) return
    setStandingsLoading(true)
    try {
      const res = await fetch('/api/football/standings')
      const data = await res.json()
      if (Array.isArray(data.standings)) {
        setStandings(data.standings.filter((g: StandingGroup) => g.table?.length > 0))
      }
      setStandingsLoaded(true)
    } catch { /* ignore */ } finally { setStandingsLoading(false) }
  }

  function handleTab(t: 'schedule' | 'standings') {
    setTab(t)
    if (t === 'standings') loadStandings()
  }

  const liveCount = matches.filter(m => m.status === 'IN_PLAY' || m.status === 'PAUSED').length
  const todayMatches = matches
    .filter(m => toVNDateKey(m.utcDate) === selectedDate)
    .sort((a, b) => {
      const so = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
      if (so !== 0) return so
      return a.utcDate.localeCompare(b.utcDate)
    })

  return (
    <>
      <div style={{ paddingTop: 62, minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--sans)' }}>

        {/* Hero */}
        <section style={{ background: 'var(--dark2)', padding: 'clamp(44px,7vw,76px) 0 clamp(32px,5vw,52px)', textAlign: 'center' }}>
          <div className="wd-container">
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent-mid)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12 }}>
              FIFA World Cup 2026
            </div>
            <h1 style={{ fontSize: 'clamp(26px,4vw,48px)', fontWeight: 700, color: '#fff', letterSpacing: '-1px', marginBottom: 10, lineHeight: 1.1 }}>
              Lịch thi đấu <em style={{ color: '#4ade80', fontStyle: 'italic', fontWeight: 300 }}>trực tiếp</em>
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.45)', fontWeight: 300, maxWidth: 440, margin: '0 auto 18px' }}>
              Cập nhật tỉ số realtime · Lịch trận · Bảng xếp hạng nhóm
            </p>
            {liveCount > 0 && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(74,222,128,.12)', border: '1px solid rgba(74,222,128,.3)', borderRadius: 20, padding: '5px 14px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', animation: 'pulse 1.2s infinite', display: 'inline-block' }} />
                <span style={{ fontSize: 12, color: '#4ade80', fontWeight: 600 }}>
                  {liveCount} trận đang diễn ra
                </span>
              </div>
            )}
          </div>
        </section>

        {/* YouTube Live Embed */}
        {ytId && (
          <div style={{ background: '#000', borderBottom: '1px solid #222' }}>
            <div style={{ maxWidth: 880, margin: '0 auto', padding: '20px clamp(16px,4vw,40px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f00', display: 'inline-block', animation: 'pulse 1.2s infinite' }} />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', fontWeight: 600, letterSpacing: '.5px' }}>XEM TRỰC TIẾP</span>
              </div>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 10, overflow: 'hidden' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1`}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="wd-container" style={{ paddingTop: 28, paddingBottom: 64 }}>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 2, borderBottom: '2px solid var(--border-light)', marginBottom: 24 }}>
            {(['schedule', 'standings'] as const).map(t => (
              <button key={t} onClick={() => handleTab(t)} style={{
                padding: '9px 20px', fontSize: 13.5, fontWeight: 500, border: 'none',
                background: 'transparent', cursor: 'pointer', fontFamily: 'var(--sans)',
                color: tab === t ? 'var(--accent)' : 'var(--text-2)',
                borderBottom: `2px solid ${tab === t ? 'var(--accent)' : 'transparent'}`,
                marginBottom: -2, transition: 'all .15s',
              }}>
                {t === 'schedule' ? '📅 Lịch thi đấu' : '📊 Bảng xếp hạng'}
              </button>
            ))}
          </div>

          {/* ── Schedule tab ── */}
          {tab === 'schedule' && (
            <>
              {/* Date selector */}
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 10, marginBottom: 20, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                {dateTabs.map(dk => {
                  const count = matches.filter(m => toVNDateKey(m.utcDate) === dk).length
                  const hasLive = matches.filter(m => toVNDateKey(m.utcDate) === dk).some(m => m.status === 'IN_PLAY' || m.status === 'PAUSED')
                  if (count === 0 && dk !== todayVN()) return null
                  const active = selectedDate === dk
                  return (
                    <button key={dk} onClick={() => setSelectedDate(dk)} style={{
                      flexShrink: 0, padding: '7px 14px', borderRadius: 8, fontSize: 12.5,
                      border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                      background: active ? 'var(--accent)' : 'var(--surface)',
                      color: active ? '#fff' : 'var(--text-2)',
                      cursor: 'pointer', fontFamily: 'var(--sans)', transition: 'all .15s',
                      fontWeight: active ? 600 : 400, position: 'relative',
                    }}>
                      {hasLive && (
                        <span style={{ position: 'absolute', top: -3, right: -3, width: 8, height: 8, borderRadius: '50%', background: '#4ade80', border: '1.5px solid var(--bg)' }} />
                      )}
                      {dateLabel(dk)}
                      {count > 0 && <span style={{ marginLeft: 5, opacity: .55, fontSize: 11 }}>({count})</span>}
                    </button>
                  )
                })}
              </div>

              {/* Match list */}
              {loading ? <Skeleton /> : noKey ? <NoKeyBanner /> : todayMatches.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '56px 20px', color: 'var(--text-3)', fontSize: 14 }}>
                  Không có trận đấu nào trong ngày này.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {todayMatches.map(m => <MatchCard key={m.id} match={m} />)}
                </div>
              )}
            </>
          )}

          {/* ── Standings tab ── */}
          {tab === 'standings' && (
            standingsLoading ? <Skeleton /> :
              !standingsLoaded ? null :
                noKey ? <NoKeyBanner /> :
                  standings.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-3)' }}>
                      Chưa có dữ liệu bảng xếp hạng.
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: 16 }}>
                      {standings.map(g => <StandingTable key={g.group} group={g} />)}
                    </div>
                  )
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
      `}</style>
    </>
  )
}
