import { useState, useEffect } from 'react'
import { useSite } from '../contexts/SiteContext'

export default function Faq() {
  const { faqs } = useSite()
  const [openId, setOpenId] = useState<number | null>(null)

  useEffect(() => {
    if (faqs.length > 0 && openId === null) setOpenId(faqs[0].id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faqs])

  if (faqs.length === 0) return null

  return (
    <div>
      {faqs.map(f => (
        <div className={`cdm-faq-item${openId === f.id ? ' open' : ''}`} key={f.id}>
          <button className="cdm-faq-q" onClick={() => setOpenId(openId === f.id ? null : f.id)}>
            {f.question}<span className="cdm-faq-icon">+</span>
          </button>
          <div className="cdm-faq-a"><p>{f.answer}</p></div>
        </div>
      ))}
    </div>
  )
}
