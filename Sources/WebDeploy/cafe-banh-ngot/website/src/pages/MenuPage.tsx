import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { renderTitle } from '../utils/text'
import Menu from '../components/Menu'

export default function MenuPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: 'Thực Đơn — Rosette Bakery & Cafe',
    description: 'Thực đơn Rosette Bakery & Cafe — bánh kem, tart, macaron, croissant, cà phê specialty và trà trái cây với giá cả rõ ràng.',
  })

  return (
    <>
      <section className="cbn-page-hero">
        <div className="cbn-container">
          <div className="cbn-ph-eyebrow">Thực đơn</div>
          <h1 className="cbn-ph-title">{renderTitle(settings.menu_hero_title)}</h1>
          <p className="cbn-ph-sub">{settings.menu_hero_desc}</p>
        </div>
      </section>

      <section className="cbn-sec-pad" style={{ background: 'var(--bg)', paddingTop: 'clamp(48px,7vw,80px)' }}>
        <div className="cbn-container">
          <Menu variant="full" />
        </div>
      </section>

      <section className="cbn-sec-pad" style={{ background: 'var(--warm)', paddingTop: 'clamp(48px,6vw,72px)', paddingBottom: 'clamp(48px,6vw,72px)' }}>
        <div className="cbn-container">
          <div className="row align-items-center g-4">
            <div className="col-lg-8 cbn-reveal">
              <div className="cbn-eyebrow">{settings.menu_note_eyebrow}</div>
              <h2 className="cbn-sec-title" style={{ fontSize: 'clamp(22px,3vw,32px)' }}>{renderTitle(settings.menu_note_title)}</h2>
              <p className="cbn-sec-sub" style={{ maxWidth: 640 }}>{settings.menu_note_desc}</p>
            </div>
            <div className="col-lg-4 text-lg-end cbn-reveal cbn-reveal-d1">
              <Link to="/lien-he" className="cbn-btn-accent">Liên hệ đặt bánh →</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
