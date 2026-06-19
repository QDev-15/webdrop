import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_title: string
  author_avatar: string
  content: string
  rating: number
  source: string
}

const FALLBACK: Testimonial[] = [
  { id: 1, author_name: 'Nguyễn Văn Hùng', author_title: 'Khách quen 5 năm', author_avatar: '', content: 'Ăn ở đây cả chục năm rồi mà vẫn không chán. Nước phở ngọt tự nhiên, thịt bò tươi, giá hợp lý. Sáng nào cũng ghé trước khi đi làm.', rating: 5, source: 'Google Maps' },
  { id: 2, author_name: 'Trần Thị Lan', author_title: 'Nhân viên văn phòng gần đây', author_avatar: '', content: 'Bữa trưa mà có cơm tấm ở đây thì ngon số một. Cơm vừa chín tới, sườn không quá mềm không quá cứng, nước mắm pha đúng vị. Mình và đồng nghiệp hay ghé lắm.', rating: 5, source: 'Google Maps' },
  { id: 3, author_name: 'Lê Minh Tuấn', author_title: 'Sinh viên đại học gần đó', author_avatar: '', content: 'Là sinh viên thì tìm chỗ ăn ngon rẻ khó lắm. May mà có quán này. 25k một tô bún bò mà no đến chiều. Chủ quán cũng vui tính, hay cho thêm rau.', rating: 5, source: 'Google Maps' },
]

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>(FALLBACK)

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials').then(d => {
      if (d.length > 0) setItems(d)
    }).catch(() => {})
  }, [])

  const stars = (n: number) => '★'.repeat(Math.min(5, Math.max(1, n)))

  return (
    <div className="row g-3">
      {items.map((item, i) => (
        <div key={item.id} className={`col-md-4 reveal${i > 0 ? ` reveal-d${i}` : ''}`}>
          <div className="rv">
            <div className="rv-head">
              {item.author_avatar ? (
                <img src={item.author_avatar} className="rv-av" alt={item.author_name} />
              ) : (
                <div className="rv-av" style={{ background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>
                  {item.author_name.charAt(0)}
                </div>
              )}
              <div className="rv-meta">
                <div className="rv-name">{item.author_name}</div>
                <div className="rv-src">{item.author_title || item.source || 'Google Maps'}</div>
              </div>
              <div style={{ fontSize: 20 }}>G</div>
            </div>
            <div className="rv-stars">{stars(item.rating)}</div>
            <div className="rv-text">"{item.content}"</div>
          </div>
        </div>
      ))}
    </div>
  )
}
