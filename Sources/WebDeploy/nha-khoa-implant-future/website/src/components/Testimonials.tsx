import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_role: string
  content: string
  rating: number
  avatar_url: string
  is_featured: number
  sort_order: number
}

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([])

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials').then(data => setItems(data)).catch(() => {})
  }, [])

  const fallback: Testimonial[] = [
    { id: 1, author_name: 'Nguyễn Văn Hùng', author_role: 'Kỹ sư xây dựng, 42 tuổi', content: 'Tôi đã mất 3 răng hàm từ 5 năm trước và sống với hàm tháo lắp rất bất tiện. Sau khi đặt Implant All-on-4 tại Future Dental, tôi ăn nhai bình thường ngay từ ngày đầu. Kết quả vượt xa mong đợi.', rating: 5, avatar_url: '', is_featured: 1, sort_order: 1 },
    { id: 2, author_name: 'Trần Thị Lan Anh', author_role: 'Giám đốc marketing, 38 tuổi', content: 'Công nghệ scan 3D và định vị phẫu thuật khiến tôi hoàn toàn yên tâm. Ca phẫu thuật diễn ra không đau, chính xác. Bác sĩ giải thích từng bước rất rõ ràng. Sẽ giới thiệu cho bạn bè và gia đình.', rating: 5, avatar_url: '', is_featured: 1, sort_order: 2 },
    { id: 3, author_name: 'Phạm Đức Thịnh', author_role: 'Chủ doanh nghiệp, 55 tuổi', content: 'Sau tai nạn mất 4 răng cửa, tôi cần phục hình thẩm mỹ gấp vì công việc tiếp khách nhiều. Future Dental hoàn thành trong 10 ngày với kết quả tự nhiên đến mức không ai biết là răng nhân tạo.', rating: 5, avatar_url: '', is_featured: 1, sort_order: 3 },
    { id: 4, author_name: 'Lê Minh Châu', author_role: 'Bác sĩ nội khoa, 47 tuổi', content: 'Là bác sĩ, tôi đặc biệt coi trọng quy trình kiểm soát nhiễm khuẩn và độ chính xác kỹ thuật. Future Dental đáp ứng tốt cả hai tiêu chí. Thiết bị CBCT và phần mềm lập kế hoạch rất ấn tượng.', rating: 5, avatar_url: '', is_featured: 1, sort_order: 4 },
  ]

  const displayed = items.length > 0 ? items : fallback

  return (
    <section className="ft-testimonials sec-pad">
      <div className="wd-container">
        <div className="ft-sec-header" data-reveal>
          <div className="ft-eyebrow">Khách hàng nói gì</div>
          <h2 className="ft-sec-title">Niềm tin từ <em>12.000+</em> ca Implant</h2>
        </div>

        <div className="ft-testi-scroll" data-reveal>
          {displayed.map(t => {
            const stars = Math.min(5, Math.max(1, t.rating || 5))
            return (
              <div key={t.id} className="ft-testi-card">
                <div className="ft-testi-stars">
                  {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
                </div>
                <blockquote className="ft-testi-text">"{t.content}"</blockquote>
                <div className="ft-testi-author">
                  {t.avatar_url ? (
                    <img src={t.avatar_url} alt={t.author_name} className="ft-testi-avatar" loading="lazy" />
                  ) : (
                    <div className="ft-testi-avatar ft-testi-avatar-initial">
                      {t.author_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="ft-testi-name">{t.author_name}</div>
                    <div className="ft-testi-role">{t.author_role}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
