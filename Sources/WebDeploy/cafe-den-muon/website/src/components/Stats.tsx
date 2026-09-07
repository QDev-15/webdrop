import { parsePairs } from '../utils/text'

interface Props {
  raw: string | undefined
}

// Grid thống kê 4 → 2 → 1 cột (dùng cho "Vì sao chọn giờ muộn" trang chủ
// và "Giờ mở cửa" trang giới thiệu) — parse chuỗi "giá trị|nhãn" mỗi dòng.
export default function Stats({ raw }: Props) {
  const items = parsePairs(raw)
  if (items.length === 0) return null
  return (
    <div className="cdm-stats-grid reveal">
      {items.map((it, i) => (
        <div className="cdm-stat-item" key={i}>
          <div className="cdm-stat-num">{it.a}</div>
          <div className="cdm-stat-label">{it.b}</div>
        </div>
      ))}
    </div>
  )
}
