interface Amenity { id: number; name: string; description: string; image: string }

// Pattern bento layout — item 0 = wide+tall, item 3 = wide, còn lại 1x1 (giữ đúng thuật toán template gốc)
function bentoClass(i: number): string {
  if (i === 0) return 'b-wide b-tall'
  if (i === 3) return 'b-wide'
  return ''
}

export default function AmenitiesBento({ items, limit }: { items: Amenity[]; limit?: number }) {
  const list = limit ? items.slice(0, limit) : items
  return (
    <div className="gvr-bento" data-reveal>
      {list.map((a, i) => (
        <div className={`gvr-bento-item ${bentoClass(i)}`} key={a.id}>
          <img src={a.image} alt={a.name} loading="lazy" />
          <div className="gvr-bento-name">{a.name}</div>
          {a.description && <div className="gvr-bento-desc">{a.description}</div>}
        </div>
      ))}
    </div>
  )
}
