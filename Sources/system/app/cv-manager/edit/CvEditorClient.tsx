'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { CvDataType, CvProfileType } from '@/types/cv'
import { CV_TEMPLATE_TYPES } from '@/types/cv'
import { CV_DEMO_PROFILES } from '@/data/cv-demo'
import PersonalSection from '@/components/cv/editor/PersonalSection'
import ExperienceSection from '@/components/cv/editor/ExperienceSection'
import EducationSection from '@/components/cv/editor/EducationSection'
import SkillsSection from '@/components/cv/editor/SkillsSection'
import AccountSection from '@/components/cv/editor/AccountSection'
import CvPreview from '@/components/cv/CvPreview'

interface Props {
  profile: CvProfileType
  initialData: Record<string, unknown> | null
}

type SectionId = 'personal' | 'experience' | 'education' | 'skills' | 'template' | 'account'

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'personal', label: 'Cá nhân' },
  { id: 'experience', label: 'Kinh nghiệm' },
  { id: 'education', label: 'Học vấn' },
  { id: 'skills', label: 'Kỹ năng' },
  { id: 'template', label: 'Mẫu CV' },
]

export default function CvEditorClient({ profile, initialData }: Props) {
  const [data, setData] = useState<CvDataType>((initialData as CvDataType) ?? {})
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null)
  const [activeSection, setActiveSection] = useState<SectionId>('personal')
  const [copied, setCopied] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState(profile.templateType)
  const [templateSaving, setTemplateSaving] = useState(false)
  const [showDemoMenu, setShowDemoMenu] = useState(false)
  const [demoLoadedLabel, setDemoLoadedLabel] = useState('')
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  // mobile: 'edit' | 'preview'
  const [mobilePanel, setMobilePanel] = useState<'edit' | 'preview'>('edit')
  const [isMobile, setIsMobile] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  // ── save ──────────────────────────────────────────────────
  const save = useCallback(async (updated: CvDataType) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      setSaveStatus('saving')
      try {
        const res = await fetch('/api/cv/data', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        })
        setSaveStatus(res.ok ? 'saved' : 'error')
      } catch { setSaveStatus('error') }
    }, 1500)
  }, [])

  const updateData = useCallback((patch: Partial<CvDataType>) => {
    setData(prev => { const next = { ...prev, ...patch }; save(next); return next })
  }, [save])

  // ── actions ───────────────────────────────────────────────
  function loadProfile(profileId: string) {
    const p = CV_DEMO_PROFILES.find(x => x.id === profileId)
    if (!p) return
    const hasData = data.fullName || (data.experience?.length ?? 0) > 0
    if (hasData && !confirm(`Dữ liệu hiện tại sẽ bị thay thế bằng dữ liệu mẫu "${p.label}". Tiếp tục?`)) return
    updateData(p.data)
    setShowDemoMenu(false)
    setDemoLoadedLabel(p.label)
    setTimeout(() => setDemoLoadedLabel(''), 3000)
  }

  async function handleExport(format: 'html' | 'pdf' | 'docx') {
    setShowExportMenu(false)
    setExporting(true)
    try {
      if (format === 'html') {
        const a = document.createElement('a'); a.href = '/api/cv/export?format=html'; a.click(); a.target = "_blank";
      } else {
        window.open(`/api/cv/export?format=${format}`, '_blank')
      }
    } finally { setTimeout(() => setExporting(false), 1500) }
  }

  async function handleChangeTemplate(type: string) {
    setCurrentTemplate(type); setTemplateSaving(true)
    try {
      await fetch('/api/cv/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ templateType: type }) })
    } finally { setTemplateSaving(false) }
  }

  const cvPath = `/cv/${profile.slug}`

  function handleCopy() {
    navigator.clipboard.writeText(window.location.origin + cvPath)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  async function handleLogout() {
    await fetch('/api/account/logout', { method: 'POST' })
    window.location.href = '/'
  }

  // ── shared styles ─────────────────────────────────────────
  const btnGhost: React.CSSProperties = {
    padding: '7px 12px', background: 'transparent',
    border: '1px solid rgba(255,255,255,.18)',
    color: 'rgba(255,255,255,.65)', borderRadius: 8,
    fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
    whiteSpace: 'nowrap',
  }

  // ── preview panel (shared between desktop right + mobile preview) ──
  const PreviewPanel = (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: isMobile ? '16px 12px 80px' : '32px 24px' }}>
      <div style={{ width: '100%', maxWidth: 740, background: '#fff', borderRadius: 12, boxShadow: '0 20px 52px rgba(0,0,0,.1)', overflow: 'hidden' }}>
        <CvPreview data={data} templateType={currentTemplate} />
      </div>
    </div>
  )

  // ── section tabs ──────────────────────────────────────────
  const SectionTabs = (
    <div style={{ position: 'relative', flexShrink: 0, borderBottom: '1px solid #e8e5df', background: '#faf9f7' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', paddingRight: 44 }}>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            style={{
              flex: '1 1 auto', padding: '11px 6px', fontSize: 12, fontWeight: 500,
              border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit',
              background: activeSection === s.id ? '#fff' : 'transparent',
              color: activeSection === s.id ? '#1a6b52' : '#6b6760',
              borderBottom: activeSection === s.id ? '2px solid #1a6b52' : '2px solid transparent',
              transition: 'color .15s',
            }}>
            {s.label}
          </button>
        ))}
      </div>
      <button onClick={() => setActiveSection('account')} title="Cài đặt tài khoản"
        style={{
          position: 'absolute', top: 0, right: 0, width: 44, height: 40,
          fontSize: 15, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          background: activeSection === 'account' ? '#fff' : 'transparent',
          color: activeSection === 'account' ? '#1a6b52' : '#a09d97',
          borderLeft: '1px solid #e8e5df',
          borderBottom: activeSection === 'account' ? '2px solid #1a6b52' : '2px solid transparent',
        }}>
        ⚙
      </button>
    </div>
  )

  // ── demo banner ───────────────────────────────────────────
  const DemoBanner = activeSection !== 'account' && (
    <div style={{ padding: '8px 16px', background: demoLoadedLabel ? '#e8f4ef' : '#faf9f7', borderBottom: '1px solid #e8e5df', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexShrink: 0, position: 'relative' }}>
      <span style={{ fontSize: 12, color: demoLoadedLabel ? '#1a6b52' : '#6b6760' }}>
        {demoLoadedLabel ? `✓ Đã tải: ${demoLoadedLabel}` : 'Muốn xem CV trông như thế nào?'}
      </span>
      {!demoLoadedLabel && (
        <button onClick={() => setShowDemoMenu(v => !v)}
          style={{ padding: '5px 10px', background: '#fff', border: '1px solid #e8e5df', borderRadius: 7, fontSize: 12, fontWeight: 600, color: '#1a1917', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0 }}>
          ✨ Dữ liệu mẫu ▾
        </button>
      )}
      {showDemoMenu && (
        <>
          <div onClick={() => setShowDemoMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />
          <div style={{ position: 'absolute', top: '100%', right: 16, zIndex: 100, background: '#fff', border: '1px solid #e8e5df', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,.1)', minWidth: 240, maxHeight: 320, overflowY: 'auto' }}>
            <div style={{ padding: '8px 14px 6px', fontSize: 11, fontWeight: 700, color: '#a09d97', textTransform: 'uppercase', letterSpacing: '.5px' }}>Chọn ngành nghề</div>
            {CV_DEMO_PROFILES.map(p => (
              <button key={p.id} onClick={() => loadProfile(p.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '8px 14px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f5f0e8')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                <span style={{ fontSize: 16, lineHeight: 1 }}>{p.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1917' }}>{p.label}</div>
                  <div style={{ fontSize: 11, color: '#a09d97' }}>{p.industry}</div>
                </div>
              </button>
            ))}
            <div style={{ height: 6 }} />
          </div>
        </>
      )}
    </div>
  )

  // ── form content ──────────────────────────────────────────
  const FormContent = (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', paddingBottom: isMobile ? 72 : 20 }}>
      {activeSection === 'personal' && <PersonalSection data={data} onChange={updateData} />}
      {activeSection === 'experience' && <ExperienceSection data={data} onChange={updateData} />}
      {activeSection === 'education' && <EducationSection data={data} onChange={updateData} />}
      {activeSection === 'skills' && <SkillsSection data={data} onChange={updateData} />}
      {activeSection === 'account' && <AccountSection />}
      {activeSection === 'template' && (
        <div>
          <div style={{ fontSize: 13, color: '#6b6760', marginBottom: 4, lineHeight: 1.6 }}>
            Chọn mẫu CV — đổi bất cứ lúc nào, dữ liệu không thay đổi.
          </div>
          {templateSaving && <div style={{ fontSize: 11, color: '#f59e0b', marginBottom: 12 }}>Đang lưu...</div>}
          {!templateSaving && <div style={{ marginBottom: 16 }} />}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {CV_TEMPLATE_TYPES.map(tpl => (
              <button key={tpl.value} onClick={() => handleChangeTemplate(tpl.value)}
                style={{
                  border: currentTemplate === tpl.value ? '2px solid #1a6b52' : '1px solid #e8e5df',
                  background: currentTemplate === tpl.value ? '#e8f4ef' : '#fff',
                  borderRadius: 10, padding: '12px', cursor: 'pointer',
                  textAlign: 'left', fontFamily: 'inherit', transition: 'all .15s',
                }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#1a1917' }}>{tpl.label}</div>
                <div style={{ fontSize: 11, color: '#6b6760', marginTop: 3, lineHeight: 1.4 }}>{tpl.desc}</div>
                {currentTemplate === tpl.value && (
                  <div style={{ fontSize: 10, color: '#1a6b52', marginTop: 5, fontWeight: 700 }}>✓ Đang dùng</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  // ── export dropdown ───────────────────────────────────────
  const ExportDropdown = (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setShowExportMenu(v => !v)} disabled={exporting} style={btnGhost}>
        {exporting ? '⏳' : '⬇ Export ▾'}
      </button>
      {showExportMenu && (
        <>
          <div onClick={() => setShowExportMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />
          <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 100, background: '#fff', border: '1px solid #e8e5df', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,.15)', minWidth: 180, overflow: 'hidden' }}>
            {[
              { format: 'html' as const, icon: '📄', label: 'Export HTML', sub: 'File .html tải về máy' },
              { format: 'pdf' as const, icon: '🖨️', label: 'Export PDF', sub: 'In → Save as PDF' },
              { format: 'docx' as const, icon: '📝', label: 'Export Word (.docx)', sub: 'Mở trong Microsoft Word' },
            ].map((item, i) => (
              <div key={item.format}>
                {i > 0 && <div style={{ height: 1, background: '#f0ede8', margin: '0 12px' }} />}
                <button onClick={() => handleExport(item.format)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f5f0e8')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1917' }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: '#a09d97' }}>{item.sub}</div>
                  </div>
                </button>
              </div>
            ))}
            <div style={{ height: 6 }} />
          </div>
        </>
      )}
    </div>
  )

  // ════════════════════════════════════════════════════════════
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', fontFamily: "'DM Sans', sans-serif", background: '#f5f0e8' }}>

      {/* ── Header ────────────────────────────────────────── */}
      <header style={{ background: '#0c0b09', padding: '0 16px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, zIndex: 20, gap: 8 }}>
        {/* Left: logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <a href="/" style={{ fontSize: 15, fontWeight: 700, color: '#fff', textDecoration: 'none' }}>
            webdrop<span style={{ color: '#4ade80' }}>.</span>store
          </a>
          {!isMobile && <span style={{ color: '#6b6760', fontSize: 12 }}>/ CV Editor</span>}
        </div>

        {/* Center: save status (desktop only) */}
        {!isMobile && (
          <span style={{ fontSize: 12, color: saveStatus === 'saving' ? '#f59e0b' : saveStatus === 'saved' ? '#4ade80' : saveStatus === 'error' ? '#e24b4a' : 'transparent' }}>
            {saveStatus === 'saving' ? 'Đang lưu...' : saveStatus === 'saved' ? '✓ Đã lưu' : saveStatus === 'error' ? '✗ Lỗi lưu' : '.'}
          </span>
        )}

        {/* Right: actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Mobile: save status */}
          {isMobile && (
            <span style={{ fontSize: 11, color: saveStatus === 'saving' ? '#f59e0b' : saveStatus === 'saved' ? '#4ade80' : 'transparent' }}>
              {saveStatus === 'saving' ? '...' : saveStatus === 'saved' ? '✓' : ''}
            </span>
          )}

          {/* Desktop: full buttons */}
          {!isMobile && (
            <>
              <button onClick={handleCopy} style={btnGhost}>
                {copied ? '✓ Đã copy' : 'Copy link'}
              </button>
              {ExportDropdown}
              <a href={cvPath} target="_blank" rel="noopener noreferrer"
                style={{ padding: '7px 13px', background: '#1a6b52', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                Xem CV ↗
              </a>
              <button onClick={handleLogout}
                style={{ ...btnGhost, border: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.4)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,.75)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.4)')}>
                Đăng xuất
              </button>
            </>
          )}

          {/* Mobile: "Xem trước" toggle + "⋯" menu */}
          {isMobile && (
            <>
              <button onClick={() => setMobilePanel(v => v === 'edit' ? 'preview' : 'edit')}
                style={{ padding: '6px 12px', background: mobilePanel === 'preview' ? '#1a6b52' : 'rgba(255,255,255,.1)', border: 'none', color: '#fff', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                {mobilePanel === 'edit' ? '👁 Xem trước' : '✏ Sửa CV'}
              </button>

              {/* ⋯ more menu */}
              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowMoreMenu(v => !v)}
                  style={{ padding: '6px 10px', background: 'transparent', border: '1px solid rgba(255,255,255,.18)', color: 'rgba(255,255,255,.65)', borderRadius: 7, fontSize: 16, cursor: 'pointer', lineHeight: 1 }}>
                  ⋯
                </button>
                {showMoreMenu && (
                  <>
                    <div onClick={() => setShowMoreMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />
                    <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 100, background: '#1a1917', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,.4)', minWidth: 180, overflow: 'hidden' }}>
                      <div style={{ height: 1, background: 'rgba(255,255,255,.08)', margin: '0 12px' }} />
                      <button onClick={() => { handleCopy(); setShowMoreMenu(false) }}
                        style={{ display: 'block', width: '100%', padding: '12px 16px', background: 'none', border: 'none', color: copied ? '#4ade80' : 'rgba(255,255,255,.8)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                        {copied ? '✓ Đã copy link' : '🔗 Copy link CV'}
                      </button>
                      <div style={{ height: 1, background: 'rgba(255,255,255,.08)', margin: '0 12px' }} />
                      {[
                        { format: 'html' as const, label: '📄 Export HTML' },
                        { format: 'pdf' as const, label: '🖨️ Export PDF' },
                        { format: 'docx' as const, label: '📝 Export Word' },
                      ].map(item => (
                        <button key={item.format} onClick={() => { handleExport(item.format); setShowMoreMenu(false) }}
                          style={{ display: 'block', width: '100%', padding: '12px 16px', background: 'none', border: 'none', color: 'rgba(255,255,255,.8)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                          {item.label}
                        </button>
                      ))}
                      <div style={{ height: 1, background: 'rgba(255,255,255,.08)', margin: '0 12px' }} />
                      <a href={cvPath} target="_blank" rel="noopener noreferrer"
                        onClick={() => setShowMoreMenu(false)}
                        style={{ display: 'block', padding: '12px 16px', color: '#4ade80', fontSize: 13, textDecoration: 'none' }}>
                        ↗ Xem CV
                      </a>
                      <div style={{ height: 1, background: 'rgba(255,255,255,.08)', margin: '0 12px' }} />
                      <button onClick={() => { handleLogout() }}
                        style={{ display: 'block', width: '100%', padding: '12px 16px', background: 'none', border: 'none', color: 'rgba(255,255,255,.4)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                        Đăng xuất
                      </button>
                      <div style={{ height: 4 }} />
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </header>

      {/* ── Body ──────────────────────────────────────────── */}
      {isMobile ? (
        /* ── Mobile: single panel ──────────────────────── */
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {mobilePanel === 'edit' ? (
            <>
              {SectionTabs}
              {DemoBanner}
              {FormContent}
            </>
          ) : (
            PreviewPanel
          )}
        </div>
      ) : (
        /* ── Desktop: 2 columns ────────────────────────── */
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left panel */}
          <div style={{ width: 420, flexShrink: 0, display: 'flex', flexDirection: 'column', background: '#fff', borderRight: '1px solid #e8e5df', overflow: 'hidden' }}>
            {SectionTabs}
            {DemoBanner}
            {FormContent}
          </div>

          {/* Right panel */}
          {activeSection === 'account' ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
              <div style={{ textAlign: 'center', color: '#a09d97' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>⚙</div>
                <div style={{ fontSize: 14 }}>Cài đặt tài khoản</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>
                  Link CV: <a href={cvPath} target="_blank" rel="noopener noreferrer" style={{ color: '#1a6b52' }}>/cv/{profile.slug}</a>
                </div>
              </div>
            </div>
          ) : PreviewPanel}
        </div>
      )}
    </div>
  )
}
