interface Policy { id: number; icon: string; title: string; description: string }

const DELAY_ATTRS = ['', 'data-reveal-d1', 'data-reveal-d2', 'data-reveal-d3'] as const

export default function SalesPoliciesGrid({ items }: { items: Policy[] }) {
  if (items.length === 0) return null
  return (
    <div className="row g-4">
      {items.map((p, i) => {
        const delayAttr = DELAY_ATTRS[Math.min(i, 3)]
        const extraProps = delayAttr ? { [delayAttr]: true } : {}
        return (
          <div className="col-md-4" data-reveal {...extraProps} key={p.id}>
            <div className="gvr-card gvr-card-solid p-4 h-100">
              <div className="gvr-feat-icon" style={{ marginBottom: 14 }}>{p.icon}</div>
              <div className="gvr-feat-title" style={{ marginBottom: 8 }}>{p.title}</div>
              <div className="gvr-feat-desc">{p.description}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
