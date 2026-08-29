import { useRef, useState } from 'react'
import type { Faq } from '../types'

export default function FaqAccordion({ items }: { items: Faq[] }) {
  const [openId, setOpenId] = useState<number | null>(items[0]?.id ?? null)
  const refs = useRef<Record<number, HTMLDivElement | null>>({})

  if (items.length === 0) return null

  return (
    <div className="ndv-faq" data-reveal="">
      {items.map(f => {
        const isOpen = openId === f.id
        return (
          <div key={f.id} className={'ndv-faq-item' + (isOpen ? ' open' : '')}>
            <button className="ndv-faq-q" onClick={() => setOpenId(isOpen ? null : f.id)}>
              {f.question}<span className="ndv-faq-icon"></span>
            </button>
            <div className="ndv-faq-a" style={{ maxHeight: isOpen ? (refs.current[f.id]?.scrollHeight ?? 500) + 'px' : undefined }}>
              <div className="ndv-faq-a-in" ref={el => { refs.current[f.id] = el }}>{f.answer}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
