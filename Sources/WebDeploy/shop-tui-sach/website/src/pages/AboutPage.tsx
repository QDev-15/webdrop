import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const VALUE_ITEMS = [
  { icon: 'gem', title: 'Chất liệu thượng hạng', desc: 'Chỉ sử dụng da bò thật 100%, chọn lọc kỹ càng từ các xưởng thuộc da uy tín.' },
  { icon: 'hand-index-thumb', title: 'Thủ công tỉ mỉ', desc: 'Mỗi chiếc túi đều được nghệ nhân chế tác hoàn toàn thủ công, tỉ mỉ từng đường kim mũi chỉ.' },
  { icon: 'shield-check', title: 'Bảo hành trọn đời', desc: 'Cam kết bảo hành trọn đời cho mọi sản phẩm — sửa chữa, bảo dưỡng miễn phí.' },
]

export default function AboutPage() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'Maison Cuir'

  useDocumentMeta({
    title: 'Về chúng tôi — Maison Cuir',
    description: 'Câu chuyện thương hiệu Maison Cuir — túi da thủ công cao cấp, chế tác tỉ mỉ từ da bò thật, cam kết chất lượng và bảo hành trọn đời.',
  })

  const stats = [1, 2, 3, 4].map(i => ({
    num: settings[`stat${i}_num`] || '',
    suffix: settings[`stat${i}_suffix`] || '',
    label: settings[`stat${i}_label`] || '',
  })).filter(s => s.label)

  return (
    <>
      <section className="ts-page-header">
        <div className="ts-container">
          <h1>Về chúng tôi</h1>
          <div className="ts-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <span className="current">Về chúng tôi</span>
          </div>
        </div>
      </section>

      <section className="ts-sec">
        <div className="ts-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }} data-reveal>
            <div style={{ borderRadius: 2, overflow: 'hidden', aspectRatio: '4/3' }}>
              <img src="https://images.unsplash.com/photo-1524498730609-99616b2af61a?w=800&auto=format&fit=crop&q=80" alt="Xưởng chế tác túi da thủ công" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div className="ts-eyebrow">Hành trình</div>
              <h2 className="ts-sec-title">Sinh ra từ <em>tình yêu</em> da thật</h2>
              <p style={{ color: 'var(--text-2)', lineHeight: 1.75, maxWidth: 460 }}>
                {siteName} khởi nguồn từ tình yêu với nghề thủ công truyền thống và mong muốn mang đến những sản phẩm da thật
                bền đẹp theo năm tháng. Từ một xưởng nhỏ với vài nghệ nhân tâm huyết, chúng tôi đã không ngừng trau dồi kỹ
                thuật, chọn lọc nguồn da chất lượng để xây dựng nên một thương hiệu túi da thủ công cao cấp được nhiều khách
                hàng tin chọn.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="ts-sec" style={{ background: 'var(--surface)' }} aria-labelledby="values-heading">
        <div className="ts-container">
          <div className="ts-eyebrow">Giá trị cốt lõi</div>
          <h2 className="ts-sec-title" id="values-heading">Điều chúng tôi <em>theo đuổi</em></h2>
          <div className="row g-4" style={{ marginTop: 24 }}>
            {VALUE_ITEMS.map((v, i) => (
              <div className="col-md-4" data-reveal key={v.title} data-reveal-d1={i === 1 ? '' : undefined} data-reveal-d2={i === 2 ? '' : undefined}>
                <div style={{ height: '100%', padding: '32px 28px', background: 'var(--bg)', border: '1px solid var(--border)' }}>
                  <i className={`bi bi-${v.icon}`} style={{ fontSize: 26, color: 'var(--accent)' }} />
                  <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontStyle: 'italic', fontSize: 22, margin: '16px 0 10px' }}>{v.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {stats.length > 0 && (
        <section className="ts-stats">
          <div className="ts-container">
            <div className="ts-stats-row">
              {stats.map((s, i) => (
                <div className="ts-stat-item" data-reveal key={i}>
                  <div className="num">{s.num}{s.suffix}</div>
                  <div className="label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
