import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface Settings {
  tagline: string
  description: string
  [key: string]: string
}

export default function About() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<{ [key: string]: string }>('/public/settings').then(data => {
      setSettings({
        tagline: data.site_tagline || data.tagline || 'Không gian bình yên',
        description: data.site_description || data.description || 'Mỗi buổi tập là một hành trình trở về với chính mình.',
        ...data
      })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <section className="sec-pad"><div className="text-center">Đang tải...</div></section>

  return (
    <section className="sec-pad yw-strip" style={{ background: 'var(--sage-pale)' }}>
      <div className="wd-container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6" data-reveal>
            <div className="yw-about-img-wrap" style={{ borderRadius: '20px', overflow: 'hidden', aspectRatio: '1/1', background: 'linear-gradient(135deg, var(--accent-light), var(--warm2))' }}>
              <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80&auto=format&fit=crop" alt="Yoga Studio" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>

          <div className="col-lg-6" data-reveal>
            <h2 className="yw-title mb-3">Về Yoga <em>Wellness</em></h2>
            <p className="yw-sub mb-4">{settings?.tagline}</p>
            <p style={{ fontSize: '15px', fontWeight: 300, color: 'var(--text-2)', lineHeight: '1.8', marginBottom: '24px' }}>
              {settings?.description}
            </p>

            <div className="mb-4">
              <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>Tại sao chọn chúng tôi?</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  '🧘 Giáo viên chuyên nghiệp, có chứng chỉ quốc tế',
                  '💚 Không gian yoga thanh tịnh và yên tĩnh',
                  '👥 Cộng đồng yoga tích cực, hỗ trợ',
                  '🎯 Lớp học linh hoạt cho mọi trình độ'
                ].map((item, i) => (
                  <li key={i} style={{ fontSize: '14px', color: 'var(--text-2)', marginBottom: '10px' }}>{item}</li>
                ))}
              </ul>
            </div>

            <a href="/dat-lich" className="yw-btn">Đăng ký lớp học hôm nay</a>
          </div>
        </div>
      </div>
    </section>
  )
}
