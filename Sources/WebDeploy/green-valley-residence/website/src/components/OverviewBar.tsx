interface Item { label: string; value: string }

export default function OverviewBar({ items }: { items: Item[] }) {
  return (
    <div className="gvr-overview-bar" data-reveal>
      {items.map(item => (
        <div className="gvr-ov-item" key={item.label}>
          <div className="gvr-ov-label">{item.label}</div>
          <div className="gvr-ov-value">{item.value}</div>
        </div>
      ))}
    </div>
  )
}
