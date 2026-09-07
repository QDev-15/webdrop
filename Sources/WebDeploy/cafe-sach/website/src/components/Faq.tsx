import { useEffect, useRef, useState } from 'react'
import { api } from '../api/client'

interface FaqItem {
  id: number
  question: string
  answer: string
}

export default function Faq() {
  const [items, setItems] = useState<FaqItem[]>([])
  const [openId, setOpenId] = useState<number | null>(null)
  const answerRefs = useRef<Record<number, HTMLDivElement | null>>({})

  useEffect(() => {
    api.get<FaqItem[]>('/public/faqs')
      .then(list => {
        setItems(list)
        if (list.length > 0) setOpenId(list[0].id)
      })
      .catch(() => {/* dùng danh sách rỗng */})
  }, [])

  if (items.length === 0) return null

  return (
    <section className="sec-pad sec-bg">
      <div className="csa-container-narrow">
        <div className="csa-sec-head center" data-reveal>
          <div className="csa-eyebrow center">Câu hỏi thường gặp</div>
          <h2 className="csa-sec-title">Trước khi bạn <em>ghé thăm</em></h2>
        </div>
        <div data-reveal data-reveal-d1>
          {items.map(item => {
            const isOpen = item.id === openId
            return (
              <div className={`csa-faq-item${isOpen ? ' open' : ''}`} key={item.id}>
                <button className="csa-faq-q" aria-expanded={isOpen} onClick={() => setOpenId(isOpen ? null : item.id)}>
                  {item.question}
                  <span className="csa-faq-icon"></span>
                </button>
                <div
                  className="csa-faq-a"
                  ref={el => { answerRefs.current[item.id] = el }}
                  style={{ maxHeight: isOpen ? (answerRefs.current[item.id]?.scrollHeight ?? 500) : 0 }}
                >
                  <div className="csa-faq-a-inner">{item.answer}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
