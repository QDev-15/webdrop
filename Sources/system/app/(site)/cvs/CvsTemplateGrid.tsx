'use client'

import { useState } from 'react'
import Link from 'next/link'
import CvPreview from '@/components/cv/CvPreview'
import { CV_DEMO_DATA as DEMO_DATA } from '@/data/cv-demo'

interface TemplateInfo {
  type: string
  name: string
  desc: string
  tags: string[]
  thumbBg: string
  thumbAccent: string
  thumbSidebar?: string
  layout: 'header-2col' | 'sidebar-main' | 'clean-single' | 'dark-full' | 'elegant-top' | 'bold-sidebar' | 'timeline-dots'
}

const ALL_TEMPLATES: TemplateInfo[] = [
  { type: 'classic',      name: 'Classic',      desc: '2 cột rõ ràng, nền trắng sạch — phù hợp mọi ngành',         tags: ['Văn phòng', 'Kế toán', 'HR'],         thumbBg: '#0c0b09', thumbAccent: '#1a6b52', layout: 'header-2col' },
  { type: 'minimal',      name: 'Minimal',      desc: 'Typography làm chủ đạo, tinh tế, nhiều khoảng trắng',        tags: ['Developer', 'Research', 'Academic'],   thumbBg: '#ffffff', thumbAccent: '#e5e7eb', layout: 'clean-single' },
  { type: 'creative',     name: 'Creative',     desc: 'Sidebar tím nổi bật, bố cục bất đối xứng, cá tính',          tags: ['Designer', 'Marketing', 'Creative'],   thumbBg: '#4c1d95', thumbAccent: '#7c3aed', layout: 'sidebar-main' },
  { type: 'dark',         name: 'Dark',         desc: 'Nền tối, accent cyan neon — đúng chất dev & tech',            tags: ['Dev', 'DevOps', 'Game Dev'],           thumbBg: '#0f172a', thumbAccent: '#06b6d4', layout: 'dark-full' },
  { type: 'executive',    name: 'Executive',    desc: 'Sang trọng, formal — senior & leadership',                    tags: ['C-Level', 'Senior', 'Manager'],        thumbBg: '#1a2744', thumbAccent: '#b5860d', layout: 'header-2col' },
  { type: 'professional', name: 'Professional', desc: 'Corporate navy, 2 cột chuẩn mực — chuyên nghiệp',             tags: ['Business', 'Finance', 'Sales'],        thumbBg: '#1e3a5f', thumbAccent: '#2563eb', layout: 'header-2col' },
  { type: 'elegant',      name: 'Elegant',      desc: 'Rose & blush, serif — tinh tế, thanh lịch',                   tags: ['Fashion', 'Education', 'Healthcare'],  thumbBg: '#fff1f2', thumbAccent: '#9f1239', layout: 'elegant-top' },
  { type: 'tech',         name: 'Tech',         desc: 'Terminal green, monospace — developer thuần túy',              tags: ['Backend', 'Fullstack', 'Data Eng'],    thumbBg: '#0a0e1a', thumbAccent: '#00d084', layout: 'dark-full' },
  { type: 'bold',         name: 'Bold',         desc: 'Sidebar đen, yellow accent — cá tính & nổi bật',              tags: ['Creative Dir', 'Brand', 'UX'],        thumbBg: '#111827', thumbAccent: '#f59e0b', layout: 'bold-sidebar', thumbSidebar: '#111827' },
  { type: 'timeline',     name: 'Timeline',     desc: 'Timeline dọc teal — sạch sẽ, dễ đọc theo trình tự',           tags: ['PM', 'Operations', 'Consulting'],      thumbBg: '#f0fdf9', thumbAccent: '#0d9488', layout: 'timeline-dots' },
]

function Thumbnail({ tpl }: { tpl: TemplateInfo }) {
  const { thumbBg, thumbAccent, layout } = tpl
  const isLight = layout === 'clean-single' || layout === 'elegant-top' || layout === 'timeline-dots'

  if (layout === 'sidebar-main') {
    return (
      <div style={{ height: 200, display: 'flex', overflow: 'hidden' }}>
        <div style={{ width: '34%', background: thumbBg, padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.25)', border: '2px solid rgba(255,255,255,.4)', marginBottom: 4 }} />
          {[70, 55, 80, 60].map((w, i) => <div key={i} style={{ height: 4, width: `${w}%`, background: 'rgba(255,255,255,.3)', borderRadius: 2 }} />)}
        </div>
        <div style={{ flex: 1, background: '#fff', padding: '14px 12px' }}>
          <div style={{ height: 10, width: '80%', background: '#1e1b4b', borderRadius: 2, marginBottom: 5 }} />
          <div style={{ height: 7, width: '50%', background: thumbAccent, borderRadius: 2, marginBottom: 12 }} />
          {[100, 85, 70, 90, 65].map((w, i) => <div key={i} style={{ height: 4, width: `${w}%`, background: '#ede9fe', borderRadius: 2, marginBottom: 5 }} />)}
        </div>
      </div>
    )
  }

  if (layout === 'bold-sidebar') {
    return (
      <div style={{ height: 200, display: 'flex', overflow: 'hidden' }}>
        <div style={{ width: '36%', background: thumbBg, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,.2)', marginBottom: 5 }} />
          <div style={{ height: 10, width: '90%', background: '#fff', borderRadius: 2 }} />
          <div style={{ height: 6, width: '70%', background: thumbAccent, borderRadius: 2, marginBottom: 6 }} />
          {[70, 55, 80].map((w, i) => <div key={i} style={{ height: 4, width: `${w}%`, background: 'rgba(255,255,255,.2)', borderRadius: 10 }} />)}
        </div>
        <div style={{ flex: 1, background: '#fff', padding: '14px 12px' }}>
          <div style={{ height: 12, width: '70%', background: '#111827', borderRadius: 2, marginBottom: 4 }} />
          <div style={{ width: 32, height: 3, background: thumbAccent, borderRadius: 2, marginBottom: 10 }} />
          {[100, 90, 75, 85, 60].map((w, i) => <div key={i} style={{ height: 4, width: `${w}%`, background: '#f3f4f6', borderRadius: 2, marginBottom: 5 }} />)}
          <div style={{ height: 4, width: '60%', borderLeft: `3px solid ${thumbAccent}`, paddingLeft: 4, background: '#fefce8', marginTop: 8 }} />
        </div>
      </div>
    )
  }

  if (layout === 'clean-single') {
    return (
      <div style={{ height: 200, background: '#fff', padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ height: 16, width: '55%', background: '#111827', borderRadius: 2, marginBottom: 6 }} />
        <div style={{ height: 9, width: '35%', background: '#9ca3af', borderRadius: 2, marginBottom: 16 }} />
        <div style={{ height: 1, background: '#e5e7eb', marginBottom: 12 }} />
        {[90, 75, 85, 60, 70, 50].map((w, i) => <div key={i} style={{ height: 4, width: `${w}%`, background: '#f3f4f6', borderRadius: 2, marginBottom: 7 }} />)}
      </div>
    )
  }

  if (layout === 'elegant-top') {
    return (
      <div style={{ height: 200, background: '#fff1f2', padding: '22px 24px', textAlign: 'center' as const }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fecdd3', border: '2px solid #9f1239', margin: '0 auto 10px' }} />
        <div style={{ height: 14, width: '60%', background: '#9f1239', borderRadius: 2, margin: '0 auto 5px' }} />
        <div style={{ height: 7, width: '40%', background: '#fda4af', borderRadius: 2, margin: '0 auto 14px' }} />
        <div style={{ height: 1, background: '#fecdd3', marginBottom: 2 }} />
        <div style={{ height: 1, background: '#fecdd3', marginBottom: 12 }} />
        {[80, 65, 75].map((w, i) => <div key={i} style={{ height: 4, width: `${w}%`, background: '#ffe4e6', borderRadius: 2, margin: `0 auto ${i < 2 ? '6px' : '0'}` }} />)}
      </div>
    )
  }

  if (layout === 'timeline-dots') {
    return (
      <div style={{ height: 200, background: thumbBg, padding: '16px 20px', position: 'relative' as const }}>
        <div style={{ height: 10, width: '55%', background: thumbAccent, borderRadius: 2, marginBottom: 5 }} />
        <div style={{ height: 6, width: '35%', background: '#99f6e4', borderRadius: 2, marginBottom: 14 }} />
        {[0, 1, 2].map(i => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: thumbAccent, flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ height: 6, width: 80 - i * 10, background: '#134e4a', borderRadius: 2, marginBottom: 4 }} />
              <div style={{ height: 4, width: 60 - i * 8, background: '#99f6e4', borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (layout === 'dark-full') {
    return (
      <div style={{ height: 200, background: thumbBg, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px 12px', borderBottom: `1px solid rgba(${tpl.type === 'tech' ? '0,208,132' : '6,182,212'},.2)` }}>
          <div style={{ height: 12, width: '55%', background: thumbAccent, borderRadius: 2, marginBottom: 5 }} />
          <div style={{ height: 7, width: '35%', background: 'rgba(255,255,255,.3)', borderRadius: 2 }} />
        </div>
        <div style={{ padding: '12px 20px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          <div>
            {[90, 70, 80, 55].map((w, i) => <div key={i} style={{ height: 4, width: `${w}%`, background: 'rgba(255,255,255,.12)', borderRadius: 2, marginBottom: 7 }} />)}
          </div>
          <div>
            {[70, 85, 60, 75].map((w, i) => <div key={i} style={{ height: 4, width: `${w}%`, background: thumbAccent, opacity: .35, borderRadius: 2, marginBottom: 9 }} />)}
          </div>
        </div>
      </div>
    )
  }

  // Default: header-2col (classic, executive, professional)
  return (
    <div style={{ height: 200, background: isLight ? '#fff' : thumbBg, overflow: 'hidden' }}>
      <div style={{ background: thumbBg, padding: '14px 20px' }}>
        <div style={{ width: 120, height: 12, background: 'rgba(255,255,255,.85)', borderRadius: 3, marginBottom: 5 }} />
        <div style={{ width: 80, height: 8, background: thumbAccent, borderRadius: 2 }} />
      </div>
      <div style={{ height: 8, background: thumbAccent }} />
      <div style={{ flex: 1, padding: '12px 20px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, background: '#fff' }}>
        <div>
          {[90, 70, 85, 55, 75].map((w, i) => <div key={i} style={{ height: 4, width: `${w}%`, background: '#f1f5f9', borderRadius: 2, marginBottom: 6 }} />)}
        </div>
        <div>
          {[80, 65, 90, 55].map((w, i) => <div key={i} style={{ height: 4, width: `${w}%`, background: '#e2e8f0', borderRadius: 2, marginBottom: 8 }} />)}
        </div>
      </div>
    </div>
  )
}

export default function CvsTemplateGrid() {
  const [preview, setPreview] = useState<string | null>(null)
  const previewTpl = ALL_TEMPLATES.find(t => t.type === preview)

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24, marginBottom: 48 }}>
        {ALL_TEMPLATES.map(tpl => (
          <div key={tpl.type} className="reveal" style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8e5df', overflow: 'hidden', transition: 'box-shadow .25s, transform .25s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 52px rgba(0,0,0,.1)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.transform = 'none' }}
          >
            <div style={{ position: 'relative' as const }}>
              <Thumbnail tpl={tpl} />
              <div style={{ position: 'absolute' as const, top: 10, right: 10, background: tpl.thumbAccent, color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                {tpl.name}
              </div>
            </div>
            <div style={{ padding: '18px 20px' }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: '#1a1917', marginBottom: 5 }}>{tpl.name}</div>
              <div style={{ fontSize: 13, color: '#6b6760', lineHeight: 1.6, marginBottom: 12 }}>{tpl.desc}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6, marginBottom: 14 }}>
                {tpl.tags.map(tag => (
                  <span key={tag} style={{ fontSize: 11, fontWeight: 500, padding: '3px 9px', background: '#e8f4ef', color: '#1a6b52', borderRadius: 20 }}>{tag}</span>
                ))}
              </div>
              <button onClick={() => setPreview(tpl.type)}
                style={{ width: '100%', padding: '9px 0', background: '#f5f0e8', border: '1px solid #e8e5df', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#1a1917', cursor: 'pointer', fontFamily: 'inherit', transition: 'background .2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#ede8df' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f5f0e8' }}
              >
                Xem demo ↗
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="reveal" style={{ textAlign: 'center' as const }}>
        <Link href="/checkout/cv" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 40px', background: '#1a6b52', color: '#fff', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
          Đăng ký dùng tất cả 10 mẫu
          <span style={{ background: 'rgba(255,255,255,.18)', padding: '3px 12px', borderRadius: 20, fontSize: 14 }}>59,000đ</span>
        </Link>
        <div style={{ marginTop: 12, fontSize: 13, color: '#a09d97' }}>Thanh toán một lần · Không gia hạn</div>
      </div>

      {/* Demo Modal */}
      {preview && (
        <div
          onClick={() => setPreview(null)}
          style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backdropFilter: 'blur(4px)' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: 840, maxHeight: '90vh', background: '#fff', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 40px 80px rgba(0,0,0,.4)' }}
          >
            {/* Modal header */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #e8e5df', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1917' }}>Demo — {previewTpl?.name}</span>
                <span style={{ fontSize: 12, color: '#a09d97' }}>Dữ liệu mẫu minh hoạ</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {ALL_TEMPLATES.map(t => (
                  <button key={t.type} onClick={() => setPreview(t.type)}
                    style={{ padding: '4px 10px', background: preview === t.type ? '#1a6b52' : '#f5f0e8', color: preview === t.type ? '#fff' : '#6b6760', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {t.name}
                  </button>
                ))}
                <button onClick={() => setPreview(null)}
                  style={{ width: 32, height: 32, borderRadius: '50%', background: '#f5f0e8', border: 'none', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 4 }}>
                  ✕
                </button>
              </div>
            </div>
            {/* Preview area */}
            <div style={{ flex: 1, overflowY: 'auto', background: '#f5f0e8', padding: '24px' }}>
              <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,.12)' }}>
                <CvPreview data={DEMO_DATA} templateType={preview} />
              </div>
            </div>
            {/* Modal footer */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid #e8e5df', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#faf9f7' }}>
              <span style={{ fontSize: 13, color: '#6b6760' }}>Đăng ký 1 lần — dùng được tất cả {ALL_TEMPLATES.length} mẫu</span>
              <Link href="/checkout/cv"
                style={{ padding: '9px 24px', background: '#1a6b52', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Đăng ký — 59,000đ ↗
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
