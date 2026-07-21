import HeroSlider from '../components/HeroSlider'
import About from '../components/About'
import Services from '../components/Services'
import Team from '../components/Team'
import Testimonials from '../components/Testimonials'
import { useSite } from '../contexts/SiteContext'
import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const PROCESS_STEPS = [
  { num: '01', title: 'Kham va chuan doan', text: 'Bac si tham kham, chup X-quang ky thuat so, danh gia toan dien tinh trang rang mieng va tu van phuong an dieu tri phu hop.' },
  { num: '02', title: 'Tu van ke hoach dieu tri', text: 'Giai thich ro rang phac do, thoi gian, chi phi — khong co phi an nua. Ban quyet dinh truoc khi bat dau dieu tri.' },
  { num: '03', title: 'Dieu tri chuyen nghiep', text: 'Bac si thuc hien dieu tri bang thiet bi hien dai, dam bao an toan tiet duc tuyet doi, han che dau don toi da.' },
  { num: '04', title: 'Theo doi & cham soc sau', text: 'Dat lich tai kham dinh ky, huong dan cham soc rang tai nha. Nu Cuoi Xua dong hanh lau dai cung ban.' },
]

export default function HomePage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: 'Nụ Cười Xưa — Nha Khoa Phong Cách Retro | Răng đẹp, Nụ cười đẹp',
    description: 'Phòng khám nha khoa phong cách retro-vintage tại Q.7, chuyên sâu răng thẩm mỹ, niềng răng, Implant với bài bí hiện đại. Đặt lịch khám ngay.',
  })

  const statCases    = settings.stat_cases           || '15.000+'
  const statDoctors  = settings.stat_doctors         || '8+'
  const statYears    = settings.stat_years           || '16+'
  const statSat      = settings.stat_satisfaction    || '98%'
  const statCasesL   = settings.stat_cases_label     || 'Khach hang tin tuong'
  const statDoctorsL = settings.stat_doctors_label   || 'Bac si chuyen khoa'
  const statYearsL   = settings.stat_years_label     || 'Nam kinh nghiem'
  const statSatL     = settings.stat_satisfaction_label || 'Hai long dich vu'

  return (
    <>
      <HeroSlider />
      <About />

      {/* Stat bar */}
      <div className="nc-stat-bar">
        <div className="wd-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {[
              { num: statCases, label: statCasesL },
              { num: statDoctors, label: statDoctorsL },
              { num: statYears, label: statYearsL },
              { num: statSat, label: statSatL },
            ].map((s, i) => (
              <div key={i} className="nc-stat-item" data-reveal data-delay={String(i + 1)}>
                <div className="nc-stat-num">{s.num}</div>
                <div className="nc-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Services />

      {/* Process section */}
      <section className="sec-pad" style={{ background: 'var(--bg-2)' }}>
        <div className="wd-container">
          <div style={{ textAlign: 'center', marginBottom: '52px' }} data-reveal>
            <div className="nc-eyebrow" style={{ display: 'inline-flex' }}>Quy trinh kham</div>
            <h2 className="nc-title" style={{ textAlign: 'center' }}>Don gian, ro rang, <span>khong lo lang</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '28px' }}>
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} data-reveal data-delay={String(i + 1)} style={{ background: 'var(--surface)', border: '2px dashed var(--text)', boxShadow: '5px 5px 0 var(--text)', padding: '28px 24px' }}>
                <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--mustard)', marginBottom: '12px' }}>{step.num}</div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: '10px' }}>{step.title}</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-2)', lineHeight: 1.7 }}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Team />
      <Testimonials />

      {/* CTA */}
      <div className="nc-cta">
        <div className="wd-container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div className="nc-eyebrow-dk" style={{ display: 'inline-flex' }} data-reveal>Bat dau ngay hom nay</div>
          <h2 className="nc-title-dk" style={{ textAlign: 'center' }} data-reveal>
            San sang co mot <span>nu cuoi dep</span>?
          </h2>
          <p className="nc-sub-dk" style={{ margin: '0 auto 36px', textAlign: 'center' }} data-reveal>
            Dat lich ngay hom nay — chung toi se lien he xac nhan trong vong 30 phut trong gio lam viec.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }} data-reveal>
            <Link to="/dat-lich" className="nc-btn">Dat lich kham ngay</Link>
            <Link to="/lien-he" className="nc-btn-dark-outline">Lien he tu van</Link>
          </div>
        </div>
      </div>
    </>
  )
}
