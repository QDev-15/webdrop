import { parseTriples } from '../utils/text'

interface Props {
  raw: string | undefined
}

// Grid 3 thẻ icon/tiêu đề/mô tả (dùng cho "Ai hay ghé NOX" trang chủ
// và "Đối tượng khách hàng" trang giới thiệu) — parse chuỗi "icon|tiêu đề|mô tả" mỗi dòng.
export default function FeatureCards({ raw }: Props) {
  const items = parseTriples(raw)
  if (items.length === 0) return null
  return (
    <div className="row g-4">
      {items.map((it, i) => (
        <div className="col-md-4" key={i}>
          <div className={`cdm-feat-card reveal reveal-d${Math.min(i + 1, 3)}`}>
            <div className="cdm-feat-icon">{it.icon}</div>
            <div className="cdm-feat-name">{it.title}</div>
            <div className="cdm-feat-desc">{it.desc}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
