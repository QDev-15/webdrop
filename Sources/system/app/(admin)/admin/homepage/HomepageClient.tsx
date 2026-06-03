'use client'
import { useState } from 'react'

// ── Defaults ──────────────────────────────────────────────────
const DEFAULTS: Record<string, string> = {
  hp_show_howitworks: 'true', hp_show_whyus: 'true', hp_show_pricing: 'true',
  hp_show_reviews: 'true', hp_show_clients: 'true', hp_show_cta: 'true',
  hp_show_banner: 'true', hp_show_templates: 'true',

  hp_howitworks_eyebrow: 'Quy trình', hp_howitworks_title: 'Đơn giản từ',
  hp_howitworks_title_em: 'đầu đến cuối',
  hp_howitworks_subtitle: 'Bạn chỉ cần cung cấp nội dung. Chúng tôi lo toàn bộ phần kỹ thuật còn lại.',
  hp_howitworks_image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80&auto=format&fit=crop',
  hp_howitworks_steps: JSON.stringify([
    { num: '01', title: 'Chọn mẫu yêu thích', desc: 'Duyệt qua hơn 30 mẫu theo ngành nghề. Xem live demo trực tiếp, không cần cài đặt gì.' },
    { num: '02', title: 'Thanh toán & điền brief', desc: 'Đặt hàng online. Nhận form điền thông tin: logo, nội dung, màu sắc, phong cách mong muốn.' },
    { num: '03', title: 'Chúng tôi triển khai', desc: 'Setup hosting, domain, SSL. Cài mẫu, điền nội dung, tùy chỉnh màu và logo theo brand.' },
    { num: '04', title: 'Nhận website hoàn chỉnh', desc: 'Xem link preview, chỉnh sửa tối đa 2 vòng, bàn giao. Website live trong 3–5 ngày làm việc.' },
  ]),

  hp_whyus_eyebrow: 'Tại sao chọn chúng tôi', hp_whyus_title: 'Không cần biết',
  hp_whyus_title_em: 'kỹ thuật',
  hp_whyus_subtitle: 'Chúng tôi lo toàn bộ. Bạn chỉ cần cung cấp nội dung và nhận website.',
  hp_whyus_image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80&auto=format&fit=crop',
  hp_whyus_caption: 'Đội ngũ chuyên nghiệp, tận tâm',
  hp_whyus_caption_sub: 'Hỗ trợ trực tiếp qua Zalo — không chatbot',
  hp_whyus_items: JSON.stringify([
    { num: '01', icon: '⚡', title: 'Nhanh chóng', desc: 'Bàn giao trong 3–5 ngày làm việc, không kéo dài hàng tháng như agency truyền thống' },
    { num: '02', icon: '💎', title: 'Chất lượng cao', desc: 'Mẫu thiết kế bởi chuyên gia, responsive hoàn toàn, PageSpeed 90+, chuẩn SEO' },
    { num: '03', icon: '🛡️', title: 'An tâm tuyệt đối', desc: 'Hoàn tiền 100% trong 7 ngày nếu không hài lòng. Hỗ trợ 30 ngày sau bàn giao' },
    { num: '04', icon: '📈', title: 'Đồng hành lâu dài', desc: 'Gói duy trì hàng tháng, gia hạn hosting, cập nhật nội dung — mọi thứ bạn cần' },
  ]),

  hp_reviews_eyebrow: 'Khách hàng nói gì', hp_reviews_title: '127 khách hàng',
  hp_reviews_title_em: 'đã tin tưởng',
  hp_reviews_subtitle: 'Không phải lời quảng cáo — đây là trải nghiệm thật từ khách hàng thật.',
  hp_reviews_items: JSON.stringify([
    { text: 'Mẫu rất đẹp và chuyên nghiệp. Anh bên này cài đặt nhanh, chỉ 3 ngày là có website hoàn chỉnh. Khách hàng tôi ai cũng khen.', name: 'Trần Hoàng Minh', role: 'Công ty tư vấn · TP.HCM', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&auto=format&fit=crop&crop=face' },
    { text: 'Tôi không biết gì về web nhưng mọi thứ được lo hết rồi. Form brief rõ ràng, chỉ cần điền thông tin là xong. Rất hài lòng.', name: 'Nguyễn Lan Anh', role: 'Spa & Beauty · Hà Nội', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&auto=format&fit=crop&crop=face' },
    { text: 'Source code sạch, cấu trúc rõ ràng, tùy chỉnh dễ. Tôi mua để dùng lại cho khách hàng của mình — đáng đồng tiền.', name: 'Phạm Đức Toàn', role: 'Freelancer · Đà Nẵng', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&auto=format&fit=crop&crop=face' },
  ]),

  hp_clients_title: 'Tin tưởng bởi các doanh nghiệp',
  hp_clients_items: JSON.stringify([
    { name: 'Spa Lavender', icon: '💆' }, { name: 'Nhà hàng Phú Quý', icon: '🍜' },
    { name: 'Beauty Studio', icon: '💄' }, { name: 'Coffee House', icon: '☕' },
    { name: 'Luật Minh Tâm', icon: '⚖️' }, { name: 'Kiến trúc ARC', icon: '🏛️' },
  ]),

  hp_cta_title: 'Sẵn sàng có website đẹp?',
  hp_cta_subtitle: 'Bắt đầu ngay hôm nay. Bàn giao trong 3–5 ngày làm việc.',
  hp_cta_btn1_label: 'Xem mẫu thiết kế →', hp_cta_btn1_target: 'templates',
  hp_cta_btn2_label: 'Tư vấn miễn phí', hp_cta_btn2_target: 'pricing',

  hp_banner_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80&auto=format&fit=crop',
  hp_banner_subtitle: 'READY TO START?',
  hp_banner_title: 'Website đẹp, bàn giao trong 3–5 ngày',
}

const TABS = [
  { key: 'visibility', label: '👁 Hiển thị', icon: '👁' },
  { key: 'howitworks', label: '📌 Quy trình', icon: '📌' },
  { key: 'whyus', label: '💎 Tại sao chọn', icon: '💎' },
  { key: 'reviews', label: '⭐ Đánh giá', icon: '⭐' },
  { key: 'clients', label: '🤝 Khách hàng', icon: '🤝' },
  { key: 'cta', label: '🚀 CTA & Banner', icon: '🚀' },
]

const SECTIONS = [
  { key: 'howitworks', label: 'Quy trình (How It Works)', icon: '📌' },
  { key: 'templates',  label: 'Thư viện mẫu (Templates)', icon: '🎨' },
  { key: 'whyus',      label: 'Tại sao chọn chúng tôi', icon: '💎' },
  { key: 'pricing',    label: 'Bảng giá (Pricing)',      icon: '💰' },
  { key: 'reviews',    label: 'Đánh giá khách hàng',     icon: '⭐' },
  { key: 'clients',    label: 'Dải khách hàng',          icon: '🤝' },
  { key: 'banner',     label: 'Banner ảnh nền',          icon: '🖼️' },
  { key: 'cta',        label: 'CTA cuối trang',          icon: '🚀' },
]

const inp: React.CSSProperties = { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 13, fontFamily: 'var(--sans)', outline: 'none', color: 'var(--text)', boxSizing: 'border-box' }
const lbl: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }
const card: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 22px', marginBottom: 16 }

// ── Helper: safe JSON parse ───────────────────────────────────
function parseJSON<T>(str: string, fallback: T): T {
  try { return JSON.parse(str) as T } catch { return fallback }
}

// ── Dynamic list editor ───────────────────────────────────────
type ListItem = Record<string, string>

function ListEditor({ value, onChange, fields, emptyItem }: {
  value: string
  onChange: (v: string) => void
  fields: { key: string; label: string; multiline?: boolean; placeholder?: string }[]
  emptyItem: ListItem
}) {
  const items: ListItem[] = parseJSON(value, [])

  function update(idx: number, key: string, val: string) {
    const next = items.map((it, i) => i === idx ? { ...it, [key]: val } : it)
    onChange(JSON.stringify(next))
  }
  function add() { onChange(JSON.stringify([...items, { ...emptyItem }])) }
  function remove(idx: number) { onChange(JSON.stringify(items.filter((_, i) => i !== idx))) }
  function move(idx: number, dir: -1 | 1) {
    const next = [...items]
    const swap = idx + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    onChange(JSON.stringify(next))
  }

  return (
    <div>
      {items.map((item, idx) => (
        <div key={idx} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '14px', marginBottom: 8, background: 'var(--bg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)' }}>#{idx + 1}</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={() => move(idx, -1)} disabled={idx === 0} style={{ width: 24, height: 22, border: '1px solid var(--border)', borderRadius: 4, background: 'var(--bg)', cursor: idx === 0 ? 'not-allowed' : 'pointer', fontSize: 11, opacity: idx === 0 ? .4 : 1 }}>▲</button>
              <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} style={{ width: 24, height: 22, border: '1px solid var(--border)', borderRadius: 4, background: 'var(--bg)', cursor: idx === items.length - 1 ? 'not-allowed' : 'pointer', fontSize: 11, opacity: idx === items.length - 1 ? .4 : 1 }}>▼</button>
              <button onClick={() => remove(idx)} style={{ padding: '2px 8px', border: '1px solid #fecaca', borderRadius: 5, fontSize: 11, color: '#dc2626', background: '#fef2f2', cursor: 'pointer' }}>✕ Xóa</button>
            </div>
          </div>
          <div className="row g-2">
            {fields.map(f => (
              <div key={f.key} className={fields.length > 2 && !f.multiline ? 'col-md-6' : 'col-12'}>
                <label style={lbl}>{f.label}</label>
                {f.multiline
                  ? <textarea rows={2} style={{ ...inp, resize: 'vertical' }} value={item[f.key] ?? ''} onChange={e => update(idx, f.key, e.target.value)} placeholder={f.placeholder} />
                  : <input style={inp} value={item[f.key] ?? ''} onChange={e => update(idx, f.key, e.target.value)} placeholder={f.placeholder} />
                }
              </div>
            ))}
          </div>
        </div>
      ))}
      <button onClick={add} style={{ width: '100%', padding: '9px', border: '1px dashed var(--border)', borderRadius: 9, fontSize: 13, color: 'var(--text-2)', background: 'transparent', cursor: 'pointer' }}>+ Thêm mục</button>
    </div>
  )
}

// ── Toggle ────────────────────────────────────────────────────
function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: checked ? 'var(--accent-light)' : 'var(--bg)', border: `1px solid ${checked ? 'var(--accent-mid)' : 'var(--border)'}`, borderRadius: 9, cursor: 'pointer', transition: 'all .15s' }} onClick={() => onChange(!checked)}>
      <div style={{ width: 44, height: 24, borderRadius: 12, background: checked ? 'var(--accent)' : 'var(--border)', position: 'relative', flexShrink: 0, transition: 'background .2s' }}>
        <div style={{ position: 'absolute', top: 3, left: checked ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: checked ? 'var(--accent)' : 'var(--text)' }}>{label}</div>
        {hint && <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>{hint}</div>}
      </div>
      <div style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 600, color: checked ? 'var(--accent)' : 'var(--text-3)' }}>{checked ? 'Hiển thị' : 'Ẩn'}</div>
    </div>
  )
}

// ── Section header ────────────────────────────────────────────
function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{title}</div>
      {hint && <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{hint}</div>}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function HomepageClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [s, setS] = useState<Record<string, string>>({ ...DEFAULTS, ...initialSettings })
  const [tab, setTab] = useState('visibility')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [savingVis, setSavingVis] = useState(false)

  const get = (k: string) => s[k] ?? DEFAULTS[k] ?? ''
  const set = (k: string, v: string) => setS(prev => ({ ...prev, [k]: v }))
  const isOn = (k: string) => get(`hp_show_${k}`) !== 'false'

  async function saveAll() {
    setSaving(true)
    await fetch('/api/admin/settings', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings: s }),
    })
    setSaved(true); setTimeout(() => setSaved(false), 3000); setSaving(false)
  }

  async function toggleSection(key: string, val: boolean) {
    const newVal = val ? 'true' : 'false'
    setS(prev => ({ ...prev, [`hp_show_${key}`]: newVal }))
    setSavingVis(true)
    await fetch('/api/admin/settings', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings: { [`hp_show_${key}`]: newVal } }),
    })
    setSavingVis(false)
  }

  const tabBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 16px', borderRadius: 8, fontSize: 12.5, fontWeight: active ? 600 : 400,
    background: active ? 'var(--text)' : 'transparent',
    color: active ? '#fff' : 'var(--text-2)',
    border: active ? 'none' : '1px solid var(--border)',
    cursor: 'pointer', fontFamily: 'var(--sans)', whiteSpace: 'nowrap',
  })

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-600">Trang Chủ</h4>
          <p className="text-muted small mb-0">Bật/tắt section và chỉnh nội dung từng phần trên trang chủ</p>
        </div>
        <a href="/" target="_blank" style={{ fontSize: 12, color: 'var(--text-3)', textDecoration: 'none' }}>🌐 Xem trang chủ ↗</a>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
        {TABS.map(t => (
          <button key={t.key} style={tabBtnStyle(tab === t.key)} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>

      {/* ── Visibility tab ── */}
      {tab === 'visibility' && (
        <div>
          <div style={{ ...card, marginBottom: 8 }}>
            <SectionHeader title="Bật / Tắt từng section" hint={`${savingVis ? 'Đang lưu...' : 'Thay đổi được lưu ngay lập tức'}`} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SECTIONS.map(sec => (
                <Toggle key={sec.key}
                  checked={isOn(sec.key)}
                  onChange={v => toggleSection(sec.key, v)}
                  label={`${sec.icon} ${sec.label}`}
                  hint={sec.key === 'templates' ? 'Template grid (dữ liệu quản lý tại /admin/templates)' : sec.key === 'pricing' ? 'Pricing section (dữ liệu quản lý tại /admin/pricing)' : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── HowItWorks tab ── */}
      {tab === 'howitworks' && (
        <div>
          <div style={card}>
            <SectionHeader title="Section header" />
            <div className="row g-3">
              <div className="col-md-4"><label style={lbl}>Eyebrow label</label><input style={inp} value={get('hp_howitworks_eyebrow')} onChange={e => set('hp_howitworks_eyebrow', e.target.value)} /></div>
              <div className="col-md-4"><label style={lbl}>Tiêu đề</label><input style={inp} value={get('hp_howitworks_title')} onChange={e => set('hp_howitworks_title', e.target.value)} /></div>
              <div className="col-md-4"><label style={lbl}>Phần in nghiêng <em style={{ color: 'var(--accent)' }}>xanh</em></label><input style={inp} value={get('hp_howitworks_title_em')} onChange={e => set('hp_howitworks_title_em', e.target.value)} /></div>
              <div className="col-12"><label style={lbl}>Subtitle</label><textarea rows={2} style={{ ...inp, resize: 'vertical' }} value={get('hp_howitworks_subtitle')} onChange={e => set('hp_howitworks_subtitle', e.target.value)} /></div>
              <div className="col-12"><label style={lbl}>URL ảnh bên phải</label><input style={inp} value={get('hp_howitworks_image')} onChange={e => set('hp_howitworks_image', e.target.value)} placeholder="https://..." /></div>
            </div>
          </div>
          <div style={card}>
            <SectionHeader title="Các bước quy trình" hint="Thêm/xóa/sắp xếp các bước" />
            <ListEditor
              value={get('hp_howitworks_steps')}
              onChange={v => set('hp_howitworks_steps', v)}
              fields={[
                { key: 'num', label: 'Số thứ tự', placeholder: '01' },
                { key: 'title', label: 'Tiêu đề bước', placeholder: 'Chọn mẫu yêu thích' },
                { key: 'desc', label: 'Mô tả', multiline: true, placeholder: 'Duyệt qua hơn 30 mẫu...' },
              ]}
              emptyItem={{ num: '05', title: '', desc: '' }}
            />
          </div>
        </div>
      )}

      {/* ── Why Us tab ── */}
      {tab === 'whyus' && (
        <div>
          <div style={card}>
            <SectionHeader title="Section header" />
            <div className="row g-3">
              <div className="col-md-4"><label style={lbl}>Eyebrow</label><input style={inp} value={get('hp_whyus_eyebrow')} onChange={e => set('hp_whyus_eyebrow', e.target.value)} /></div>
              <div className="col-md-4"><label style={lbl}>Tiêu đề</label><input style={inp} value={get('hp_whyus_title')} onChange={e => set('hp_whyus_title', e.target.value)} /></div>
              <div className="col-md-4"><label style={lbl}>Phần <em style={{ color: 'var(--accent)' }}>in nghiêng</em></label><input style={inp} value={get('hp_whyus_title_em')} onChange={e => set('hp_whyus_title_em', e.target.value)} /></div>
              <div className="col-12"><label style={lbl}>Subtitle</label><textarea rows={2} style={{ ...inp, resize: 'vertical' }} value={get('hp_whyus_subtitle')} onChange={e => set('hp_whyus_subtitle', e.target.value)} /></div>
            </div>
          </div>
          <div style={card}>
            <SectionHeader title="Ảnh banner nền (dark section)" />
            <div className="row g-3">
              <div className="col-12"><label style={lbl}>URL ảnh</label><input style={inp} value={get('hp_whyus_image')} onChange={e => set('hp_whyus_image', e.target.value)} placeholder="https://..." /></div>
              <div className="col-md-6"><label style={lbl}>Caption chính (overlay)</label><input style={inp} value={get('hp_whyus_caption')} onChange={e => set('hp_whyus_caption', e.target.value)} /></div>
              <div className="col-md-6"><label style={lbl}>Caption phụ</label><input style={inp} value={get('hp_whyus_caption_sub')} onChange={e => set('hp_whyus_caption_sub', e.target.value)} /></div>
            </div>
          </div>
          <div style={card}>
            <SectionHeader title="Danh sách lợi ích (4 items)" />
            <ListEditor
              value={get('hp_whyus_items')}
              onChange={v => set('hp_whyus_items', v)}
              fields={[
                { key: 'num', label: 'Số', placeholder: '01' },
                { key: 'icon', label: 'Icon', placeholder: '⚡' },
                { key: 'title', label: 'Tiêu đề', placeholder: 'Nhanh chóng' },
                { key: 'desc', label: 'Mô tả', multiline: true, placeholder: 'Bàn giao trong 3–5 ngày...' },
              ]}
              emptyItem={{ num: '05', icon: '✨', title: '', desc: '' }}
            />
          </div>
        </div>
      )}

      {/* ── Reviews tab ── */}
      {tab === 'reviews' && (
        <div>
          <div style={card}>
            <SectionHeader title="Section header" />
            <div className="row g-3">
              <div className="col-md-4"><label style={lbl}>Eyebrow</label><input style={inp} value={get('hp_reviews_eyebrow')} onChange={e => set('hp_reviews_eyebrow', e.target.value)} /></div>
              <div className="col-md-4"><label style={lbl}>Tiêu đề</label><input style={inp} value={get('hp_reviews_title')} onChange={e => set('hp_reviews_title', e.target.value)} /></div>
              <div className="col-md-4"><label style={lbl}>Phần <em style={{ color: 'var(--accent)' }}>in nghiêng</em></label><input style={inp} value={get('hp_reviews_title_em')} onChange={e => set('hp_reviews_title_em', e.target.value)} /></div>
              <div className="col-12"><label style={lbl}>Subtitle</label><textarea rows={2} style={{ ...inp, resize: 'vertical' }} value={get('hp_reviews_subtitle')} onChange={e => set('hp_reviews_subtitle', e.target.value)} /></div>
            </div>
          </div>
          <div style={card}>
            <SectionHeader title="Danh sách đánh giá" hint="Mỗi review cần: nội dung, tên, vai trò, URL ảnh avatar" />
            <ListEditor
              value={get('hp_reviews_items')}
              onChange={v => set('hp_reviews_items', v)}
              fields={[
                { key: 'text', label: 'Nội dung đánh giá', multiline: true, placeholder: 'Mẫu rất đẹp...' },
                { key: 'name', label: 'Tên khách hàng', placeholder: 'Nguyễn Văn A' },
                { key: 'role', label: 'Vai trò / Địa điểm', placeholder: 'Chủ spa · Hà Nội' },
                { key: 'avatar', label: 'URL ảnh avatar', placeholder: 'https://...' },
              ]}
              emptyItem={{ text: '', name: '', role: '', avatar: '' }}
            />
          </div>
        </div>
      )}

      {/* ── Clients tab ── */}
      {tab === 'clients' && (
        <div>
          <div style={card}>
            <SectionHeader title="Dải khách hàng" />
            <div className="row g-3 mb-4">
              <div className="col-12"><label style={lbl}>Tiêu đề dải</label><input style={inp} value={get('hp_clients_title')} onChange={e => set('hp_clients_title', e.target.value)} placeholder="Tin tưởng bởi các doanh nghiệp" /></div>
            </div>
            <SectionHeader title="Danh sách khách hàng" hint="Icon dùng emoji" />
            <ListEditor
              value={get('hp_clients_items')}
              onChange={v => set('hp_clients_items', v)}
              fields={[
                { key: 'icon', label: 'Icon (emoji)', placeholder: '💆' },
                { key: 'name', label: 'Tên', placeholder: 'Spa Lavender' },
              ]}
              emptyItem={{ icon: '🏢', name: '' }}
            />
          </div>
        </div>
      )}

      {/* ── CTA & Banner tab ── */}
      {tab === 'cta' && (
        <div>
          <div style={card}>
            <SectionHeader title="CTA cuối trang" hint="Section kêu gọi hành động màu xanh đậm" />
            <div className="row g-3">
              <div className="col-12"><label style={lbl}>Tiêu đề</label><input style={inp} value={get('hp_cta_title')} onChange={e => set('hp_cta_title', e.target.value)} /></div>
              <div className="col-12"><label style={lbl}>Subtitle</label><textarea rows={2} style={{ ...inp, resize: 'vertical' }} value={get('hp_cta_subtitle')} onChange={e => set('hp_cta_subtitle', e.target.value)} /></div>
              <div className="col-md-6">
                <label style={lbl}>Nút 1 — Nhãn</label>
                <input style={inp} value={get('hp_cta_btn1_label')} onChange={e => set('hp_cta_btn1_label', e.target.value)} placeholder="Xem mẫu thiết kế →" />
              </div>
              <div className="col-md-6">
                <label style={lbl}>Nút 1 — Scroll đến section ID</label>
                <input style={inp} value={get('hp_cta_btn1_target')} onChange={e => set('hp_cta_btn1_target', e.target.value)} placeholder="templates" />
              </div>
              <div className="col-md-6">
                <label style={lbl}>Nút 2 — Nhãn</label>
                <input style={inp} value={get('hp_cta_btn2_label')} onChange={e => set('hp_cta_btn2_label', e.target.value)} placeholder="Tư vấn miễn phí" />
              </div>
              <div className="col-md-6">
                <label style={lbl}>Nút 2 — Scroll đến section ID</label>
                <input style={inp} value={get('hp_cta_btn2_target')} onChange={e => set('hp_cta_btn2_target', e.target.value)} placeholder="pricing" />
              </div>
            </div>
          </div>
          <div style={card}>
            <SectionHeader title="Banner ảnh nền (trước footer)" hint="Ảnh phủ full width với text overlay" />
            <div className="row g-3">
              <div className="col-12"><label style={lbl}>URL ảnh</label><input style={inp} value={get('hp_banner_image')} onChange={e => set('hp_banner_image', e.target.value)} placeholder="https://..." /></div>
              <div className="col-md-6"><label style={lbl}>Text nhỏ phía trên</label><input style={inp} value={get('hp_banner_subtitle')} onChange={e => set('hp_banner_subtitle', e.target.value)} placeholder="READY TO START?" /></div>
              <div className="col-md-6"><label style={lbl}>Tiêu đề chính</label><input style={inp} value={get('hp_banner_title')} onChange={e => set('hp_banner_title', e.target.value)} placeholder="Website đẹp, bàn giao trong 3–5 ngày" /></div>
            </div>
          </div>
        </div>
      )}

      {/* Save bar (except visibility tab) */}
      {tab !== 'visibility' && (
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 12, alignItems: 'center' }}>
          {saved && <span style={{ fontSize: 13, color: 'var(--accent)' }}>✓ Đã lưu</span>}
          <button onClick={saveAll} disabled={saving} style={{ padding: '10px 28px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, fontFamily: 'var(--sans)', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .7 : 1 }}>
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      )}
    </div>
  )
}
