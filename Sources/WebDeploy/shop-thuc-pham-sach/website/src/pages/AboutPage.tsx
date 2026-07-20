import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const CERTS = [
  {
    icon: 'award',
    title: 'Chứng nhận VietGAP',
    desc: 'Toàn bộ nông trại đối tác đều đạt chứng nhận VietGAP, kiểm định định kỳ.',
  },
  {
    icon: 'qr-code',
    title: 'Truy xuất nguồn gốc',
    desc: 'Mỗi sản phẩm đều có mã QR truy xuất nguồn gốc từ nông trại đến kệ hàng.',
  },
  {
    icon: 'snow',
    title: 'Chuỗi lạnh khép kín',
    desc: 'Bảo quản lạnh xuyên suốt từ thu hoạch đến giao hàng, giữ trọn độ tươi ngon.',
  },
]

const STATS = [
  { num: '120', suffix: '+', label: 'Nông trại liên kết' },
  { num: '500', suffix: '+', label: 'Sản phẩm sạch' },
  { num: '4', suffix: ' năm', label: 'Kinh nghiệm' },
  { num: '20000', suffix: '+', label: 'Khách hàng tin dùng' },
]

export default function AboutPage() {
  useDocumentMeta({
    title: 'Về Chúng Tôi — Tươi Mỗi Ngày',
    description: 'Câu chuyện, cam kết chất lượng và hành trình mang thực phẩm sạch, truy xuất nguồn gốc đến từng bữa ăn gia đình bạn.',
  })
  const { settings } = useSite()
  const siteName = settings.site_name || 'Tươi Mỗi Ngày'

  return (
    <>
      <div className="tp-container tp-contact-wrap">
        <div className="tp-breadcrumb" style={{ marginBottom: 24 }}>
          <Link to="/">Trang chủ</Link>
          <i className="bi bi-chevron-right" style={{ fontSize: 10 }} />
          <span>Về chúng tôi</span>
        </div>
        <h1 style={{ fontSize: 'clamp(28px,3.6vw,42px)', fontWeight: 700, marginBottom: 12 }}>
          Về <em style={{ color: 'var(--accent)', fontStyle: 'normal' }}>Chúng Tôi</em>
        </h1>
        <p style={{ color: 'var(--text-2)', maxWidth: 560 }}>
          Hành trình mang thực phẩm sạch, có nguồn gốc rõ ràng đến từng bữa ăn gia đình.
        </p>
      </div>

      <main>
        <section className="tp-sec" style={{ paddingTop: 24 }}>
          <div className="tp-container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }} data-reveal>
              <div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '4/3' }}>
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80"
                  alt="Nông trại đối tác cung cấp thực phẩm sạch"
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <div className="tp-eyebrow"><i className="bi bi-leaf" /> Nguồn gốc</div>
                <h2 className="tp-sec-title">Từ nông trại <em>đến niềm tin</em></h2>
                <p style={{ color: 'var(--text-2)', lineHeight: 1.75, maxWidth: 460 }}>
                  {siteName} bắt đầu từ mong muốn đơn giản: mỗi gia đình đều xứng đáng được ăn thực phẩm sạch, an
                  toàn, có nguồn gốc rõ ràng. Chúng tôi liên kết trực tiếp với các nông trại đạt chuẩn, kiểm định
                  chất lượng từng lô hàng trước khi đến tay khách hàng, và cam kết truy xuất nguồn gốc minh bạch
                  cho từng sản phẩm.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="tp-sec" style={{ background: 'var(--surface)' }} aria-labelledby="cert-heading">
          <div className="tp-container">
            <div className="tp-eyebrow"><i className="bi bi-patch-check" /> Chứng nhận</div>
            <h2 className="tp-sec-title" id="cert-heading">Cam kết <em>chất lượng</em></h2>
            <div className="row g-4" style={{ marginTop: 24 }}>
              {CERTS.map((c, i) => (
                <div className="col-md-4" data-reveal data-delay={i > 0 ? String(i) : undefined} key={c.title}>
                  <div style={{ height: '100%', padding: 28, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16 }}>
                    <i className={`bi bi-${c.icon}`} style={{ fontSize: 26, color: 'var(--accent)' }} />
                    <h3 style={{ fontSize: 18, fontWeight: 600, margin: '14px 0 8px' }}>{c.title}</h3>
                    <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="tp-stats" aria-label="Số liệu">
          <div className="tp-container">
            <div className="tp-stats-grid" data-reveal>
              {STATS.map(s => (
                <div className="tp-stat" key={s.label}>
                  <div className="tp-stat-num"><span>{Number(s.num).toLocaleString('vi-VN')}{s.suffix}</span></div>
                  <div className="tp-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
