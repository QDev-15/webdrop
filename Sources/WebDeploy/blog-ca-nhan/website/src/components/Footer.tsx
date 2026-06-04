import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'

export default function Footer() {
  const { settings, categories } = useSite()
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const siteName = settings.site_name ?? 'Blog'
  const copyright = settings.footer_copyright ?? `© 2025 ${siteName}.`
  const description = (settings.footer_description ?? settings.site_description) ?? ''
  const zalo = settings.social_zalo ?? ''

  async function handleNewsletter(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitting(true)
    try {
      const res = await api.post<{ message: string }>('/public/newsletter', { email })
      setMsg(res.message)
      setEmail('')
    } catch {
      setMsg('Có lỗi xảy ra, vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <footer style={{ padding: 'clamp(40px,6vw,64px) 0 0' }}>
        <div className="wd-container">
          <div className="row" style={{ paddingBottom: '32px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
            <div style={{ padding: '8px', width: '100%', maxWidth: '33.333%' }}>
              <div className="ft-logo">{siteName}<span>.</span></div>
              <p className="ft-desc">{description}</p>
            </div>
            <div style={{ padding: '8px', width: '50%', maxWidth: '16.666%' }}>
              <div className="ft-col-title">Chủ đề</div>
              <div className="ft-links">
                {categories.map(cat => (
                  <Link key={cat.id} to={`/danh-muc/${cat.slug}`}>{cat.name}</Link>
                ))}
              </div>
            </div>
            <div style={{ padding: '8px', width: '50%', maxWidth: '16.666%' }}>
              <div className="ft-col-title">Trang</div>
              <div className="ft-links">
                <Link to="/ve-toi">Về tôi</Link>
                <Link to="/tat-ca-bai-viet">Tất cả bài viết</Link>
                <Link to="/lien-he">Liên hệ</Link>
              </div>
            </div>
            <div style={{ padding: '8px', flex: 1 }}>
              <div className="ft-col-title">Đăng ký nhận bài</div>
              <form onSubmit={handleNewsletter} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  placeholder="Email của bạn"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    fontFamily: 'var(--sans)',
                    fontSize: '13px',
                    border: '1px solid rgba(255,255,255,.1)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    background: 'rgba(255,255,255,.05)',
                    color: '#fff',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '13px',
                    fontWeight: '500',
                    background: 'var(--accent)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {submitting ? '...' : 'Đăng ký'}
                </button>
              </form>
              {msg && (
                <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,.5)', marginTop: '8px' }}>
                  {msg}
                </div>
              )}
              {!msg && (
                <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,.2)', marginTop: '8px' }}>
                  Mỗi tuần 1 bài. Unsubscribe bất cứ lúc nào.
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="ft-bottom py-3" style={{ padding: '12px 0' }}>
          <div className="wd-container">
            <div className="ft-copy">{copyright}</div>
          </div>
        </div>
      </footer>

      {zalo && (
        <div className="zf">
          <div className="zf-tip">Nhắn tin qua Zalo</div>
          <a href={`https://zalo.me/${zalo}`} target="_blank" rel="noopener noreferrer" className="zf-btn" aria-label="Zalo">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 5.524 4.477 10 10 10s10-4.476 10-10S17.523 2 12 2z" fill="#fff"/>
              <text x="12" y="16" textAnchor="middle" fontSize="8" fontWeight="700" fill="#0068FF">Z</text>
            </svg>
          </a>
        </div>
      )}
    </>
  )
}
