import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useUnitTypes } from '../hooks/useUnitTypes'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import HeroSlider from '../components/HeroSlider'
import OverviewBar from '../components/OverviewBar'
import UnitCard from '../components/UnitCard'
import StatBar from '../components/StatBar'
import AmenitiesBento from '../components/AmenitiesBento'
import Testimonials from '../components/Testimonials'
import FaqAccordion from '../components/FaqAccordion'
import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface Amenity { id: number; name: string; description: string; image: string }

export default function HomePage() {
  useDocumentMeta({
    title: 'Green Valley Residence — Căn hộ cao cấp ven sông Sài Gòn | Thảo Điền, TP. Thủ Đức',
    description: 'Green Valley Residence — dự án căn hộ cao cấp ven sông Sài Gòn tại Thảo Điền, TP. Thủ Đức. 632 căn hộ từ 1PN đến Penthouse, sổ hồng lâu dài, bàn giao Quý 4/2027.',
  })

  const { settings } = useSite()
  const { units } = useUnitTypes()
  const [amenities, setAmenities] = useState<Amenity[]>([])

  useEffect(() => {
    api.get<Amenity[]>('/public/amenities').then(setAmenities).catch(() => {})
  }, [])

  const featured = units.filter(u => u.is_featured)
  const developerName = settings.developer_name || 'Tập đoàn Lộc Việt Land'
  const projectsDelivered = settings.developer_projects_delivered || '14'
  const towerCount = 2
  const tower1Floors = settings.tower1_floors || '35'

  return (
    <>
      {/* OVERVIEW BAR */}
      <HeroSlider />

      <section className="sec-pad-sm">
        <div className="wd-container">
          <OverviewBar items={[
            { label: 'Vị trí', value: settings.project_location || '—' },
            { label: 'Quy mô', value: `${towerCount} tháp, ${tower1Floors} tầng, ${settings.total_units || '—'} căn` },
            { label: 'Pháp lý', value: 'Sổ hồng lâu dài' },
            { label: 'Bàn giao', value: settings.handover || '—' },
          ]} />
        </div>
      </section>

      {/* ALTERNATING STRIP 1: Giới thiệu dự án */}
      <section className="sec-pad">
        <div className="wd-container">
          <div className="gvr-strip" data-reveal>
            <div className="gvr-strip-media">
              <img src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=900&auto=format&fit=crop&q=80" alt={`Vị trí ${settings.site_name || 'Green Valley Residence'} ven sông Sài Gòn`} />
            </div>
            <div className="gvr-strip-content">
              <div className="gvr-strip-num">Về dự án</div>
              <h2 className="sec-title">Không gian sống chuẩn <em>resort giữa lòng thành phố</em></h2>
              <p className="sec-sub" style={{ marginBottom: 24 }}>{settings.content_home_about}</p>
              <div className="gvr-feat" style={{ marginBottom: 18 }}>
                <div className="gvr-feat-icon">📍</div>
                <div><div className="gvr-feat-title">Vị trí đắt giá</div><div className="gvr-feat-desc">{settings.content_home_location_feature}</div></div>
              </div>
              <div className="gvr-feat">
                <div className="gvr-feat-icon">🏗️</div>
                <div><div className="gvr-feat-title">Chủ đầu tư uy tín</div><div className="gvr-feat-desc">{developerName} — {projectsDelivered} dự án đã bàn giao, gần {formatK(settings.developer_units_delivered)} căn hộ trên toàn quốc.</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALTERNATING STRIP 2 (rev): Tiến độ */}
      <section className="sec-pad" style={{ paddingTop: 0 }}>
        <div className="wd-container">
          <div className="gvr-strip rev" data-reveal>
            <div className="gvr-strip-media">
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&auto=format&fit=crop&q=80" alt="Tiến độ thi công" />
            </div>
            <div className="gvr-strip-content">
              <div className="gvr-strip-num">Tiến độ xây dựng</div>
              <h2 className="sec-title">Đang thi công <em>tầng {extractFloor(settings.progress_label)}/{tower1Floors}</em> — đúng tiến độ cam kết</h2>
              <p className="sec-sub" style={{ marginBottom: 20 }}>{settings.content_home_progress}</p>
              <div className="gvr-calc-label" style={{ color: 'var(--text-2)', marginBottom: 8 }}>Tiến độ tổng thể <b style={{ color: 'var(--accent)' }}>{settings.progress_percent || 0}%</b></div>
              <div className="gvr-progress-wrap" style={{ marginBottom: 20 }}><div className="gvr-progress-fill" style={{ width: `${settings.progress_percent || 0}%` }}></div></div>
              <Link to="/ve-chu-dau-tu" className="gvr-btn gvr-btn-ghost">Xem chi tiết tổng quan dự án →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* STAT BAR */}
      <section className="sec-dark sec-pad">
        <div className="wd-container">
          <StatBar items={[
            { value: Number(settings.total_units) || 0, label: 'Căn hộ toàn dự án' },
            { value: Number(tower1Floors) || 0, label: 'Tầng cao mỗi tháp' },
            { value: Number(settings.loan_support_percent) || 0, suffix: '%', label: 'Hỗ trợ vay ngân hàng' },
            { value: Number(projectsDelivered) || 0, label: `Dự án ${developerName} đã bàn giao` },
          ]} />
        </div>
      </section>

      {/* FEATURED UNIT TYPES */}
      {featured.length > 0 && (
        <section className="sec-pad">
          <div className="wd-container">
            <div className="sec-head-row" style={{ marginBottom: 40 }} data-reveal>
              <div>
                <div className="eyebrow">Loại căn nổi bật</div>
                <h2 className="sec-title">{featured.length} loại căn <em>bán chạy nhất</em> dự án</h2>
              </div>
              <Link to="/bang-gia" className="gvr-btn gvr-btn-ghost">Xem toàn bộ {units.length} loại căn →</Link>
            </div>
            <div className="row g-4">
              {featured.map(u => (
                <div className="col-lg-3 col-md-6" data-reveal key={u.id}>
                  <UnitCard unit={u} variant="featured" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* AMENITIES BENTO PREVIEW */}
      {amenities.length > 0 && (
        <section className="sec-pad sec-tint">
          <div className="wd-container">
            <div className="sec-head-row" style={{ marginBottom: 40 }} data-reveal>
              <div>
                <div className="eyebrow">Tiện ích nội khu</div>
                <h2 className="sec-title">Chuẩn sống <em>5 sao</em> mỗi ngày</h2>
              </div>
              <Link to="/tien-ich" className="gvr-btn gvr-btn-ghost">Xem tất cả tiện ích →</Link>
            </div>
            <AmenitiesBento items={amenities} limit={4} />
          </div>
        </section>
      )}

      <Testimonials />
      <FaqAccordion />

      {/* CTA BAND */}
      <section className="sec-dark sec-pad-sm">
        <div className="wd-container text-center">
          <h2 className="sec-title on-dark" style={{ marginBottom: 14 }} data-reveal>Nhận bảng giá &amp; chính sách bán hàng <em>mới nhất</em></h2>
          <p className="sec-sub on-dark" style={{ margin: '0 auto 28px' }} data-reveal>Để lại thông tin, {settings.sales_office_name || 'Phòng Kinh doanh dự án'} sẽ liên hệ tư vấn trong vòng 30 phút.</p>
          <Link to="/lien-he" className="gvr-btn gvr-btn-gold" data-reveal>Đăng ký nhận bảng giá ngay →</Link>
        </div>
      </section>
    </>
  )
}

function formatK(value: string | undefined): string {
  const n = Number(value)
  if (!n) return '0'
  return n.toLocaleString('vi-VN')
}

function extractFloor(label: string | undefined): string {
  if (!label) return '—'
  const m = label.match(/tầng\s*(\d+)/i)
  return m ? m[1] : '—'
}
