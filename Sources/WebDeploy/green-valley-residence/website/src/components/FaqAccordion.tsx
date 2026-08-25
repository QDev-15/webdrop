import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface Faq { id: number; question: string; answer: string }

export default function FaqAccordion() {
  const [items, setItems] = useState<Faq[]>([])

  useEffect(() => {
    api.get<Faq[]>('/public/faqs').then(setItems).catch(() => {})
  }, [])

  if (items.length === 0) return null

  return (
    <section className="sec-pad sec-tint">
      <div className="wd-container" style={{ maxWidth: 820 }}>
        <div className="eyebrow" data-reveal>Câu hỏi thường gặp</div>
        <h2 className="sec-title" style={{ marginBottom: 36 }} data-reveal>Giải đáp thắc mắc về <em>Green Valley Residence</em></h2>
        <div data-reveal>
          {items.map((f, i) => (
            <details className="gvr-faq-item" key={f.id} open={i === 0}>
              <summary>{f.question} <span className="gvr-faq-icon">+</span></summary>
              <div className="gvr-faq-a">{f.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
