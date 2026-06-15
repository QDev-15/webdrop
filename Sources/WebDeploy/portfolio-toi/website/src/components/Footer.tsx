import { Settings } from '../App'

interface Props {
  settings: Settings
}

export default function Footer({ settings }: Props) {
  const copyright = settings.footer_copyright || '© 2025 Portfolio Tôi. Made with ♥ in Vietnam.'

  return (
    <footer style={{ padding: '28px 0' }}>
      <div className="wd-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div className="ft-copy">{copyright}</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <a
              href="#home"
              style={{ fontSize: 12, color: 'rgba(255,255,255,.2)', textDecoration: 'none', transition: 'color .15s' }}
              onMouseOver={e => (e.currentTarget.style.color = 'rgba(255,255,255,.6)')}
              onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,.2)')}
            >
              ↑ Lên đầu
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
