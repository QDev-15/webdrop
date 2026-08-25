interface Phase { id: number; phase: string; percent: number; milestone: string }

export default function PaymentTimeline({ items }: { items: Phase[] }) {
  if (items.length === 0) return null
  return (
    <div className="gvr-timeline">
      {items.map((p, i) => (
        <div className="gvr-tl-item" key={p.id}>
          <div className="gvr-tl-dot">{i + 1}</div>
          <div className="gvr-tl-head">
            <div className="gvr-tl-title">{p.phase}</div>
            <div className="gvr-tl-percent">{p.percent}%</div>
          </div>
          <div className="gvr-tl-desc">{p.milestone}</div>
        </div>
      ))}
    </div>
  )
}
