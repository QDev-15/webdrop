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
  badgeColor: string
}

const ALL_TEMPLATES: TemplateInfo[] = [
  { type: 'classic',     name: 'Classic',     desc: '2 cột rõ ràng, nền trắng sạch — phù hợp mọi ngành',          tags: ['Văn phòng', 'Kế toán', 'HR'],          badgeColor: '#1a6b52' },
  { type: 'minimal',     name: 'Minimal',     desc: 'Typography làm chủ đạo, tinh tế, nhiều khoảng trắng',         tags: ['Developer', 'Research', 'Academic'],    badgeColor: '#374151' },
  { type: 'creative',    name: 'Creative',    desc: 'Sidebar tím nổi bật, bố cục bất đối xứng, cá tính',           tags: ['Designer', 'Marketing', 'Creative'],    badgeColor: '#7c3aed' },
  { type: 'dark',        name: 'Dark',        desc: 'Nền tối, accent cyan neon — đúng chất dev & tech',             tags: ['Dev', 'DevOps', 'Game Dev'],            badgeColor: '#06b6d4' },
  { type: 'executive',   name: 'Executive',   desc: 'Sang trọng, formal — senior & leadership',                     tags: ['C-Level', 'Senior', 'Manager'],         badgeColor: '#b5860d' },
  { type: 'professional',name: 'Professional',desc: 'Corporate navy, 2 cột chuẩn mực — chuyên nghiệp',              tags: ['Business', 'Finance', 'Sales'],         badgeColor: '#2563eb' },
  { type: 'elegant',     name: 'Elegant',     desc: 'Rose & blush, serif — tinh tế, thanh lịch',                    tags: ['Fashion', 'Education', 'Healthcare'],   badgeColor: '#9f1239' },
  { type: 'tech',        name: 'Tech',        desc: 'Terminal green, monospace — developer thuần túy',               tags: ['Backend', 'Fullstack', 'Data Eng'],     badgeColor: '#00d084' },
  { type: 'bold',        name: 'Bold',        desc: 'Sidebar đen, yellow accent — cá tính & nổi bật',               tags: ['Creative Dir', 'Brand', 'UX'],          badgeColor: '#f59e0b' },
  { type: 'timeline',    name: 'Timeline',    desc: 'Timeline dọc teal — sạch sẽ, dễ đọc theo trình tự',            tags: ['PM', 'Operations', 'Consulting'],       badgeColor: '#0d9488' },
  { type: 'modern',      name: 'Modern',      desc: 'Emerald gradient tươi mới, 2 cột chuyên nghiệp',               tags: ['Kỹ sư', 'Thiết kế', 'IT'],             badgeColor: '#059669' },
  { type: 'academic',    name: 'Academic',    desc: 'Học thuật navy, đơn cột — nghiên cứu & giảng dạy',             tags: ['Nghiên cứu', 'Giảng viên', 'PhD'],      badgeColor: '#1e3a5f' },
  { type: 'compact',     name: 'Compact',     desc: '3 cột dày đặc, orange accent — pack nhiều thông tin 1 trang',  tags: ['Tech Lead', 'Senior Dev', 'Multi-role'],badgeColor: '#ea580c' },
  { type: 'retro',       name: 'Retro',       desc: 'Giấy da vintage, typewriter font — phong cách hoài cổ',         tags: ['Copywriter', 'Journalist', 'Art Dir'],  badgeColor: '#b45309' },
  { type: 'gradient',    name: 'Gradient',    desc: 'Sidebar tím→indigo→cyan, màu sắc rực rỡ, sáng tạo',            tags: ['UI/UX', 'Freelance', 'Creative'],       badgeColor: '#7c3aed' },
  { type: 'minimalist',  name: 'Minimalist',  desc: 'Đen trắng thuần, editorial — tối giản đến cực đoan',           tags: ['Writer', 'Architect', 'Researcher'],    badgeColor: '#111827' },
  { type: 'split',       name: 'Split',       desc: '50/50 nền tối-sáng đối lập, pink accent nổi bật',              tags: ['Designer', 'Photo', 'Social Media'],    badgeColor: '#ec4899' },
  { type: 'neon',        name: 'Neon',        desc: 'Cyberpunk tối với neon xanh phát sáng — gaming & tech',         tags: ['Game Dev', 'Security', 'Blockchain'],   badgeColor: '#39ff14' },
  { type: 'pastel',      name: 'Pastel',      desc: 'Lavender & pastel cards, friendly — ngành dịch vụ & giáo dục', tags: ['Teacher', 'Nurse', 'Social Work'],       badgeColor: '#9333ea' },
  { type: 'magazine',    name: 'Magazine',    desc: 'Editorial tối, gold accent — phong cách tạp chí sang trọng',   tags: ['Editor', 'Art Dir', 'PR'],              badgeColor: '#f0a500' },
]

const SCALE = 0.36

function LiveThumbnail({ templateType }: { templateType: string }) {
  return (
    <div style={{ height: 210, overflow: 'hidden', position: 'relative', background: '#f5f5f5' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${(1 / SCALE) * 100}%`,
          transformOrigin: 'top left',
          transform: `scale(${SCALE})`,
          pointerEvents: 'none',
        }}
      >
        <CvPreview data={DEMO_DATA} templateType={templateType} />
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
          <div
            key={tpl.type}
            className="reveal"
            style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8e5df', overflow: 'hidden', transition: 'box-shadow .25s, transform .25s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 52px rgba(0,0,0,.1)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.transform = 'none' }}
          >
            <div style={{ position: 'relative' }}>
              <LiveThumbnail templateType={tpl.type} />
              <div style={{ position: 'absolute', top: 10, right: 10, background: tpl.badgeColor, color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, boxShadow: '0 2px 8px rgba(0,0,0,.25)' }}>
                {tpl.name}
              </div>
            </div>
            <div style={{ padding: '18px 20px' }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: '#1a1917', marginBottom: 5 }}>{tpl.name}</div>
              <div style={{ fontSize: 13, color: '#6b6760', lineHeight: 1.6, marginBottom: 12 }}>{tpl.desc}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {tpl.tags.map(tag => (
                  <span key={tag} style={{ fontSize: 11, fontWeight: 500, padding: '3px 9px', background: '#e8f4ef', color: '#1a6b52', borderRadius: 20 }}>{tag}</span>
                ))}
              </div>
              <button
                onClick={() => setPreview(tpl.type)}
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

      <div className="reveal" style={{ textAlign: 'center' }}>
        <Link href="/checkout/cv" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 40px', background: '#1a6b52', color: '#fff', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
          Đăng ký dùng tất cả 20 mẫu
          <span style={{ background: 'rgba(255,255,255,.18)', padding: '3px 12px', borderRadius: 20, fontSize: 14 }}>59,000đ</span>
        </Link>
        <div style={{ marginTop: 12, fontSize: 13, color: '#a09d97' }}>Thanh toán một lần · Không gia hạn</div>
      </div>

      {/* Demo Modal */}
      {preview && (
        <div
          onClick={() => setPreview(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backdropFilter: 'blur(4px)' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: 900, maxHeight: '92vh', background: '#fff', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 40px 80px rgba(0,0,0,.4)' }}
          >
            {/* Modal header */}
            <div style={{ borderBottom: '1px solid #e8e5df', flexShrink: 0 }}>
              <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1917' }}>Demo — {previewTpl?.name}</span>
                  <span style={{ fontSize: 12, color: '#a09d97' }}>Dữ liệu mẫu minh hoạ</span>
                </div>
                <button
                  onClick={() => setPreview(null)}
                  style={{ width: 32, height: 32, borderRadius: '50%', background: '#f5f0e8', border: 'none', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                >
                  ✕
                </button>
              </div>
              {/* Template tabs — scrollable row */}
              <div style={{ padding: '0 20px 12px', display: 'flex', gap: 6, flexWrap: 'wrap', maxHeight: 80, overflowY: 'auto' }}>
                {ALL_TEMPLATES.map(t => (
                  <button
                    key={t.type}
                    onClick={() => setPreview(t.type)}
                    style={{ padding: '5px 12px', background: preview === t.type ? t.badgeColor : '#f5f0e8', color: preview === t.type ? '#fff' : '#6b6760', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background .15s', flexShrink: 0 }}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
            {/* Preview area — full size */}
            <div style={{ flex: 1, overflowY: 'auto', background: '#f5f0e8', padding: '24px' }}>
              <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,.12)' }}>
                <CvPreview data={DEMO_DATA} templateType={preview} />
              </div>
            </div>
            {/* Modal footer */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid #e8e5df', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#faf9f7' }}>
              <span style={{ fontSize: 13, color: '#6b6760' }}>Đăng ký 1 lần — dùng được tất cả {ALL_TEMPLATES.length} mẫu</span>
              <Link href="/checkout/cv" style={{ padding: '9px 24px', background: '#1a6b52', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Đăng ký — 59,000đ ↗
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
