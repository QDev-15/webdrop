import { Link } from 'react-router-dom'
import Team from '../components/Team'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TeamPage() {
  useDocumentMeta({ title: 'Đội ngũ bác sĩ — Nha Khoa An Tâm', description: 'Đội ngũ bác sĩ giàu kinh nghiệm, tận tâm của Nha Khoa An Tâm.' })
  return (
    <>
      <header className="at-page-hero">
        <div className="wd-container">
          <div className="at-ph-eyebrow">
            <span className="at-ph-line" aria-hidden="true" />
            Đội ngũ
          </div>
          <h1 className="at-ph-title">
            Bác sĩ của<br />
            <em>Nha Khoa An Tâm</em>
          </h1>
          <p className="at-ph-sub">
            Đội ngũ bác sĩ giàu kinh nghiệm, tận tâm lắng nghe và điều trị nhẹ nhàng — luôn đặt sự thoải mái của bệnh nhân lên hàng đầu.
          </p>
        </div>
      </header>

      <section className="at-sec-pad">
        <div className="wd-container">
          <Team layout="grid" />

          {/* CTA */}
          <div style={{ marginTop: 64, paddingTop: 48, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <div className="at-eyebrow" style={{ justifyContent: 'center' }}>
              <span className="at-eyebrow-line" />
              Đặt lịch cùng bác sĩ
            </div>
            <p className="at-sub" style={{ textAlign: 'center', margin: '0 auto 32px' }}>
              Chọn bác sĩ và đặt lịch trực tiếp — xác nhận trong vòng 2 giờ làm việc.
            </p>
            <Link to="/dat-lich" className="at-btn at-btn-accent at-btn-lg">
              Đặt lịch khám
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
