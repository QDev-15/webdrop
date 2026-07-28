import Link from 'next/link'
import type { Template } from '../../data/templates'
import { WebsiteBadge } from './TemplateGrid'
import DemoIframePreview from './DemoIframePreview'

// Tối đa 4 hàng/section. Grid 1 cột (xs) / 2 cột (sm-lg) / 4 cột (lg+)
// → hiện 4 / 8 / 16 item tương ứng để không vượt quá 4 hàng ở bất kỳ breakpoint nào.
const MAX_ITEMS = 16

function TemplateCard({ t, index }: { t: Template; index: number }) {
  const demoLink = t.deployUrl || t.demoUrl
  let colClass = 'col-12 col-sm-6 col-lg-3'
  if (index >= 8) colClass += ' d-none d-lg-block'
  else if (index >= 4) colClass += ' d-none d-sm-block'

  return (
    <div className={colClass}>
      <Link href={`/templates/${t.slug}`} style={{ textDecoration: 'none' }}>
        <div className={`tc reveal reveal-d${(index % 3) + 1}`}>
          <div className="tc-thumb">
            <img src={t.image} alt={t.name} loading="lazy" />
            {demoLink && <DemoIframePreview src={demoLink} title={t.name} />}
            {t.hasWebsite && <WebsiteBadge />}
          </div>
          <div className="tc-body">
            <div className="tc-name">{t.name}{t.badge && <span className="tc-badge">{t.badge}</span>}</div>
            <div className="tc-meta">
              <span className="tc-cat">{t.category}</span>
              <span className="tc-price">{t.price}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export interface TemplateSection {
  category: string
  templates: Template[]
}

export default function TemplateShowcase({ sections }: { sections: TemplateSection[] }) {
  if (sections.length === 0) return null

  return (
    <div id="templates">
      {sections.map((s, si) => (
        <section key={s.category} className="sec-pad" style={{ background: si % 2 === 0 ? 'var(--bg)' : 'var(--surface)' }}>
          <div className="wd-container">
            <div className="text-center reveal mb-4">
              <div className="eyebrow">{si === 0 ? 'Sản phẩm chủ đạo' : 'Mẫu thiết kế'}</div>
              <h2 className="sec-title">{s.category}</h2>
              <p className="sec-sub">
                {si === 0
                  ? 'Bộ sưu tập shop bán hàng đa dạng nhất — đầy đủ giỏ hàng, thanh toán, quản trị sản phẩm.'
                  : `${s.templates.length} mẫu ${s.category.toLowerCase()} sẵn sàng triển khai.`}
              </p>
            </div>

            <div className="row g-3">
              {s.templates.slice(0, MAX_ITEMS).map((t, i) => (
                <TemplateCard key={t.slug} t={t} index={i} />
              ))}
            </div>

            <div className="text-center mt-4 reveal">
              <Link href={`/templates?cat=${encodeURIComponent(s.category)}`} className="btn-more" style={{ display: 'inline-block', textDecoration: 'none' }}>
                Xem tất cả {s.templates.length} mẫu {s.category} →
              </Link>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
