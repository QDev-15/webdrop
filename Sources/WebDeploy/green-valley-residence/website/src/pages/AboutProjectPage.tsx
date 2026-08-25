import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { api } from '../api/client'
import OverviewBar from '../components/OverviewBar'
import ExtAmenitiesList from '../components/ExtAmenitiesList'
import SalesPoliciesGrid from '../components/SalesPoliciesGrid'
import StatBar from '../components/StatBar'

interface Policy { id: number; icon: string; title: string; description: string }

// Tách "Tập đoàn X" thành ["Tập đoàn ", "X"] để tô <em> phần tên riêng, giữ đúng cách trình bày template gốc
function splitDeveloperName(name: string): [string, string] {
  const m = name.match(/^(.*?\s)([^\s]+(?:\s[^\s]+)*)$/)
  if (name.startsWith('Tập đoàn ')) return ['Tập đoàn ', name.replace('Tập đoàn ', '')]
  if (m) return [m[1], m[2]]
  return ['', name]
}

export default function AboutProjectPage() {
  useDocumentMeta({
    title: 'Tổng quan dự án & Chủ đầu tư | Green Valley Residence',
    description: 'Tổng quan dự án Green Valley Residence — vị trí, quy mô, tiến độ xây dựng, pháp lý và thông tin Chủ đầu tư Tập đoàn Lộc Việt Land.',
  })

  const { settings } = useSite()
  const [policies, setPolicies] = useState<Policy[]>([])

  useEffect(() => {
    api.get<Policy[]>('/public/sales-policies').then(setPolicies).catch(() => {})
  }, [])

  const siteName = settings.site_name || 'Green Valley Residence'
  const developerName = settings.developer_name || 'Tập đoàn Lộc Việt Land'
  const mapSrc = `https://maps.google.com/maps?q=${settings.contact_map_lat || '10.8046'},${settings.contact_map_lng || '106.7350'}&hl=vi&z=15&output=embed`

  return (
    <>
      <header className="gvr-page-hero">
        <span className="blob blob-a"></span><span className="blob blob-b"></span>
        <div className="wd-container">
          <div className="gvr-crumb"><Link to="/">Trang chủ</Link> / Tổng quan dự án</div>
          <div className="eyebrow eyebrow-light">Vị trí · Quy mô · Tiến độ · Chủ đầu tư</div>
          <h1 className="sec-title on-dark" style={{ marginBottom: 12 }}>Tổng quan dự án {siteName}</h1>
          <p className="sec-sub on-dark">{settings.content_about_intro}</p>
        </div>
      </header>

      <section className="sec-pad-sm">
        <div className="wd-container">
          <OverviewBar items={[
            { label: 'Vị trí', value: settings.project_location || '—' },
            { label: 'Quy mô', value: `${settings.site_area ? Number(settings.site_area).toLocaleString('vi-VN') : '—'}m² · 2 tháp ${settings.tower1_floors || 35} tầng` },
            { label: 'Pháp lý', value: 'Sổ hồng lâu dài' },
            { label: 'Khởi công — Bàn giao', value: `${settings.groundbreaking || '—'} — ${settings.handover || '—'}` },
          ]} />
        </div>
      </section>

      {/* VỊ TRÍ */}
      <section className="sec-pad">
        <div className="wd-container">
          <div className="gvr-strip" data-reveal>
            <div className="gvr-strip-media">
              <div className="gvr-footer-maps" style={{ margin: 0, height: '100%', minHeight: 320 }}>
                <iframe src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`Vị trí ${siteName}`}></iframe>
              </div>
            </div>
            <div className="gvr-strip-content">
              <div className="gvr-strip-num">Vị trí đắt giá</div>
              <h2 className="sec-title">Trái tim <em>Thảo Điền</em>, liền kề sông Sài Gòn</h2>
              <p className="sec-sub" style={{ marginBottom: 22 }}>{settings.content_about_location}</p>
              <ExtAmenitiesList />
            </div>
          </div>
        </div>
      </section>

      {/* QUY MÔ DỰ ÁN */}
      <section className="sec-pad sec-tint" style={{ paddingTop: 0 }}>
        <div className="wd-container">
          <div className="eyebrow" data-reveal>Quy mô dự án</div>
          <h2 className="sec-title" style={{ marginBottom: 36 }} data-reveal>2 tháp căn hộ, <em>{settings.total_units || '—'} căn</em> tổng thể</h2>
          <div className="row g-4">
            {[
              { icon: '🏙️', title: '2 tòa tháp', desc: `${settings.tower1_name || 'Tháp Aqua'} & ${settings.tower2_name || 'Tháp Terra'}, mỗi tháp ${settings.tower1_floors || 35} tầng` },
              { icon: '🏠', title: `${settings.total_units || '—'} căn hộ`, desc: 'Từ Studio 1PN đến Penthouse 4PN' },
              { icon: '🌳', title: `${settings.site_area ? Number(settings.site_area).toLocaleString('vi-VN') : '—'}m²`, desc: `Tổng diện tích dự án, mật độ xây dựng ${settings.density || '—'}%` },
              { icon: '🅿️', title: '2 tầng hầm', desc: 'Bãi đậu xe ngầm đáp ứng 100% cư dân' },
            ].map((f, i) => (
              <div className="col-md-3 col-6" data-reveal key={f.title} {...(i > 0 ? { [`data-reveal-d${Math.min(i, 3)}`]: true } : {})}>
                <div className="gvr-feat"><div className="gvr-feat-icon">{f.icon}</div><div><div className="gvr-feat-title">{f.title}</div><div className="gvr-feat-desc">{f.desc}</div></div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIẾN ĐỘ XÂY DỰNG */}
      <section className="sec-pad">
        <div className="wd-container">
          <div className="gvr-strip rev" data-reveal>
            <div className="gvr-strip-media">
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&auto=format&fit=crop&q=80" alt={`Tiến độ thi công ${siteName}`} />
            </div>
            <div className="gvr-strip-content">
              <div className="gvr-strip-num">Tiến độ xây dựng — cập nhật {settings.progress_updated || '—'}</div>
              <h2 className="sec-title">{settings.progress_label || 'Đang thi công'}</h2>
              <p className="sec-sub" style={{ marginBottom: 20 }}>{settings.content_about_progress}</p>
              <div className="gvr-calc-label" style={{ color: 'var(--text-2)', marginBottom: 8 }}>Tiến độ tổng thể <b style={{ color: 'var(--accent)' }}>{settings.progress_percent || 0}%</b></div>
              <div className="gvr-progress-wrap" style={{ marginBottom: 24 }}><div className="gvr-progress-fill" style={{ width: `${settings.progress_percent || 0}%` }}></div></div>
              <div className="row g-3">
                <div className="col-6"><div className="gvr-feat-title" style={{ fontSize: 14 }}>Khởi công</div><div className="gvr-feat-desc">{settings.groundbreaking || '—'}</div></div>
                <div className="col-6"><div className="gvr-feat-title" style={{ fontSize: 14 }}>Dự kiến bàn giao</div><div className="gvr-feat-desc">{settings.handover || '—'}</div></div>
                <div className="col-6"><div className="gvr-feat-title" style={{ fontSize: 14 }}>Pháp lý</div><div className="gvr-feat-desc">{settings.legal_status || '—'}</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHÍNH SÁCH BÁN HÀNG */}
      {policies.length > 0 && (
        <section className="sec-pad sec-tint">
          <div className="wd-container">
            <div className="eyebrow" data-reveal>Chính sách bán hàng</div>
            <h2 className="sec-title" style={{ marginBottom: 36 }} data-reveal>Ưu đãi &amp; <em>hỗ trợ tài chính</em></h2>
            <SalesPoliciesGrid items={policies} />
            <div className="text-center" style={{ marginTop: 32 }} data-reveal>
              <Link to="/bang-gia" className="gvr-btn gvr-btn-accent">Xem bảng giá &amp; tính vay theo từng loại căn →</Link>
            </div>
          </div>
        </section>
      )}

      {/* CHỦ ĐẦU TƯ */}
      <section className="sec-dark sec-pad">
        <div className="wd-container">
          <div className="row g-4 align-items-center mb-5">
            <div className="col-lg-6" data-reveal>
              <div className="eyebrow eyebrow-light">Chủ đầu tư</div>
              <h2 className="sec-title on-dark" style={{ marginBottom: 16 }}>{splitDeveloperName(developerName).map((part, i) => i === 1 ? <em key={i}>{part}</em> : <span key={i}>{part}</span>)}</h2>
              <p className="sec-sub on-dark">{settings.developer_bio}</p>
            </div>
            <div className="col-lg-6" data-reveal data-reveal-d1>
              <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=900&auto=format&fit=crop&q=80" alt={`Các dự án đã bàn giao của ${developerName}`} style={{ borderRadius: 20, width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
            </div>
          </div>
          <StatBar items={[
            { value: Number(settings.developer_founded) || 0, label: 'Năm thành lập' },
            { value: Number(settings.developer_projects_delivered) || 0, label: 'Dự án đã bàn giao' },
            { value: Number(settings.developer_units_delivered) || 0, suffix: '+', label: 'Căn hộ đã bàn giao' },
            { value: Number(settings.developer_experience_years) || 0, label: 'Năm kinh nghiệm' },
          ]} />
        </div>
      </section>

      {/* CTA */}
      <section className="sec-pad-sm">
        <div className="wd-container text-center">
          <h2 className="sec-title" style={{ marginBottom: 14 }} data-reveal>Sẵn sàng tìm hiểu <em>căn hộ phù hợp</em> với bạn?</h2>
          <p className="sec-sub" style={{ margin: '0 auto 28px' }} data-reveal>Xem bảng giá 10 loại căn hoặc liên hệ trực tiếp Phòng Kinh doanh dự án.</p>
          <div className="d-flex justify-content-center gap-3 flex-wrap" data-reveal>
            <Link to="/bang-gia" className="gvr-btn gvr-btn-accent">Xem bảng giá →</Link>
            <Link to="/lien-he" className="gvr-btn gvr-btn-ghost">Liên hệ tư vấn</Link>
          </div>
        </div>
      </section>
    </>
  )
}
