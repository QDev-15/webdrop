import { useSite } from '../contexts/SiteContext'

interface AreaCardData {
  id: number
  title: string
  tag: string
  desc: string
  image: string
}

function parseArea(item: { id: number; title: string; description: string; image: string }): AreaCardData {
  const [tag, ...rest] = (item.description || '').split('\n')
  return { id: item.id, title: item.title, tag: tag || '', desc: rest.join(' ').trim(), image: item.image }
}

// Thứ tự cố định cho preview 3 thẻ trên trang chủ (khớp đúng index.html gốc — khác thứ tự
// hiển thị đầy đủ trên khong-gian.html) — LOCKED theo template, match theo title.
const HOME_PREVIEW_ORDER = ['Quầy Bar Espresso', 'Coding Corner', 'Phòng Học Nhóm']

interface Props {
  mode: 'preview' | 'areas' | 'photos'
}

export default function Gallery({ mode }: Props) {
  const { gallery } = useSite()
  const published = gallery.filter(g => g.status === 'published')
  const areas = published.filter(g => g.category === 'khu-vuc').map(parseArea)
  const photos = published.filter(g => g.category !== 'khu-vuc').sort((a, b) => a.sort_order - b.sort_order)

  if (mode === 'preview') {
    const byTitle = new Map(areas.map(a => [a.title, a]))
    const previewAreas = HOME_PREVIEW_ORDER.map(t => byTitle.get(t)).filter((a): a is AreaCardData => !!a)
    const list = previewAreas.length > 0 ? previewAreas : areas.slice(0, 3)
    return (
      <div className="row g-3">
        {list.map((a, i) => (
          <div className="col-md-4" key={a.id}>
            <div className={`space-card reveal reveal-d${Math.min(i + 1, 3)}`}>
              {a.image && <img src={a.image} alt={a.title} loading="lazy" />}
              <div className="sc-caption">
                <div className="sc-name">{a.title}</div>
                <div className="sc-sub">{a.tag}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (mode === 'areas') {
    return (
      <div className="row g-4">
        {areas.map((a, i) => (
          <div className="col-md-6" key={a.id}>
            <div className={`area-card reveal reveal-d${(i % 2) + 1}`}>
              {a.image && <img className="ac-img" src={a.image} alt={a.title} loading="lazy" />}
              <div className="ac-body">
                <div className="ac-name">{a.title}</div>
                <div className="ac-cap">{a.tag}</div>
                <div className="ac-desc">{a.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="gallery-masonry reveal">
      {photos.map(p => (
        <img key={p.id} src={p.image} alt={p.title || 'Ảnh NOX Coffee'} loading="lazy" />
      ))}
    </div>
  )
}
