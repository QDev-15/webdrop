'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Template } from '@/data/templates'

const galleryImages = [
  'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1558655146-d09347e92766?w=1200&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1553484771-371a605b060b?w=1200&q=80&auto=format&fit=crop',
]

const features = [
  { icon: '📱', title: 'Responsive hoàn toàn', desc: 'Hiển thị đẹp trên mọi thiết bị từ mobile 320px đến màn hình 4K' },
  { icon: '⚡', title: 'PageSpeed 90+', desc: 'Tối ưu tốc độ tải, lazy loading ảnh, minified CSS/JS' },
  { icon: '🔍', title: 'SEO chuẩn', desc: 'Semantic HTML, meta tags đầy đủ, structured data sẵn sàng' },
  { icon: '🎨', title: 'Dễ tùy chỉnh', desc: 'CSS variables cho màu sắc, font chữ chỉnh trong 1 chỗ' },
  { icon: '🌐', title: 'Bootstrap 5.3', desc: 'Grid system linh hoạt, components sẵn có, không jQuery' },
  { icon: '📦', title: 'Source code sạch', desc: 'Code có comment, cấu trúc rõ ràng, dễ đọc và maintain' },
]

const pages = [
  { icon: '🏠', name: 'Trang chủ', detail: 'Hero, dịch vụ, về chúng tôi, testimonials' },
  { icon: '💼', name: 'Dịch vụ', detail: 'Danh sách dịch vụ, pricing, FAQ' },
  { icon: '👥', name: 'Về chúng tôi', detail: 'Story, team, giá trị cốt lõi' },
  { icon: '🗂️', name: 'Dự án / Portfolio', detail: 'Grid dự án, filter theo loại' },
  { icon: '📞', name: 'Liên hệ', detail: 'Form liên hệ, bản đồ, thông tin' },
]

const techGroups = [
  { title: 'Frontend', tags: ['HTML5', 'CSS3', 'Bootstrap 5.3.3', 'Vanilla JS'] },
  { title: 'Font', tags: ['DM Sans (Google Fonts)'] },
  { title: 'Icons', tags: ['Bootstrap Icons', 'Emoji'] },
  { title: 'Yêu cầu', tags: ['Không cần server', 'Mở thẳng trên browser'] },
]

const tabs = ['Tính năng', 'Các trang', 'Kỹ thuật', 'Đánh giá']

export default function TemplateDetailClient({ template }: { template: Template }) {
  const [activeImg, setActiveImg] = useState(0)
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="page-wrap">
      <div className="row g-4 g-xl-5">
        {/* Main content */}
        <div className="col-lg-8">
          {/* Title block */}
          <div className="mb-4">
            <div className="title-tags">
              <span className="ttag green">{template.category}</span>
              {template.badge && <span className="ttag green">{template.badge}</span>}
              <span className="ttag">Multi-page</span>
              <span className="ttag">Bootstrap 5.3</span>
            </div>
            <h1 className="page-title">{template.name} — <em>webdrop.vn</em></h1>
            <p className="page-sub">Template HTML/CSS thuần, responsive hoàn toàn. Mở thẳng trên trình duyệt, không cần server, không cần build.</p>
            <div className="rating-row">
              <span className="rv-stars" style={{ color: '#f59e0b', fontSize: 13, letterSpacing: 1 }}>★★★★★</span>
              <span className="rv-score">4.9</span>
              <span className="rv-count">(18 đánh giá)</span>
              <span className="sales-ct">Đã bán 47 lần</span>
            </div>
          </div>

          {/* Gallery */}
          <div className="gallery-hero">
            <img src={galleryImages[activeImg]} alt={template.name} />
            <div className="gallery-overlay" />
            <div className="preview-label">Xem live demo →</div>
          </div>
          <div className="thumbs">
            {galleryImages.map((img, i) => (
              <div key={i} className={`thumb${activeImg === i ? ' active' : ''}`} onClick={() => setActiveImg(i)}>
                <img src={img} alt={`Preview ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="wd-tabs">
            {tabs.map((tab, i) => (
              <button key={tab} className={`wd-tab${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>
                {tab}
              </button>
            ))}
          </div>

          {/* Tab: Tính năng */}
          <div className={`tab-panel${activeTab === 0 ? ' active' : ''}`}>
            <div className="row g-2">
              {features.map(f => (
                <div key={f.title} className="col-md-6">
                  <div className="feat-item">
                    <div className="feat-icon">{f.icon}</div>
                    <div>
                      <div className="feat-title">{f.title}</div>
                      <div className="feat-desc">{f.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tab: Các trang */}
          <div className={`tab-panel${activeTab === 1 ? ' active' : ''}`}>
            {pages.map(p => (
              <div key={p.name} className="page-row">
                <div className="page-row-left">
                  <div className="page-icon">{p.icon}</div>
                  {p.name}
                </div>
                <span className="page-detail">{p.detail}</span>
              </div>
            ))}
          </div>

          {/* Tab: Kỹ thuật */}
          <div className={`tab-panel${activeTab === 2 ? ' active' : ''}`}>
            <div className="row g-4">
              {techGroups.map(g => (
                <div key={g.title} className="col-md-6">
                  <div className="tech-group-title">{g.title}</div>
                  <div className="d-flex flex-wrap gap-2">
                    {g.tags.map(t => <span key={t} className="tech-tag">{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tab: Đánh giá */}
          <div className={`tab-panel${activeTab === 3 ? ' active' : ''}`}>
            <div className="d-flex gap-3 align-items-center mb-4">
              <div>
                <div style={{ fontSize: 48, fontWeight: 600, color: 'var(--text)', lineHeight: 1, letterSpacing: -1 }}>4.9</div>
                <div style={{ color: '#f59e0b', fontSize: 16, letterSpacing: 2 }}>★★★★★</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>18 đánh giá</div>
              </div>
              <div className="flex-1" style={{ flex: 1 }}>
                {[5,4,3,2,1].map(star => (
                  <div key={star} className="d-flex align-items-center gap-2 mb-1">
                    <span style={{ fontSize: 12, color: 'var(--text-3)', width: 8 }}>{star}</span>
                    <div style={{ flex: 1, height: 5, background: 'var(--warm)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: '#f59e0b', borderRadius: 3, width: star === 5 ? '88%' : star === 4 ? '10%' : '2%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 300 }}>Chưa có đánh giá bằng văn bản. Mua và để lại đánh giá đầu tiên!</div>
          </div>
        </div>

        {/* Buy Sidebar */}
        <div className="col-lg-4">
          <div className="buy-card">
            <div className="buy-price">{template.price}</div>
            <div className="buy-price-sub">Thanh toán một lần · Dùng mãi mãi</div>
            <Link href={`/checkout?slug=${template.slug}`} className="buy-btn-p d-block text-center text-decoration-none">
              Đặt mua ngay →
            </Link>
            {template.demoUrl && (
              <a href={template.demoUrl} target="_blank" rel="noopener noreferrer" className="buy-btn-g d-block text-center text-decoration-none mt-2">
                Xem demo live
              </a>
            )}
            <div className="buy-includes">
              {[
                ['📁', 'Source code HTML/CSS/JS đầy đủ'],
                ['📄', 'Tài liệu hướng dẫn PDF tiếng Việt'],
                ['🔄', 'Cập nhật miễn phí trọn đời'],
                ['💬', 'Hỗ trợ qua Zalo 30 ngày'],
                ['↩️', 'Hoàn tiền 7 ngày nếu không hài lòng'],
              ].map(([icon, text]) => (
                <div key={text as string} className="buy-inc">
                  <span className="buy-inc-icon">{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
