import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface Doctor {
  id: number
  name: string
  role: string
  photo: string
  description: string
  experience_years: number
  specialties: string
  tag: string
  sort_order: number
}

const CREDENTIALS = [
  { num: '01', title: 'Straumann Institute', sub: 'Basel, Thụy Sĩ — Chứng chỉ Implant nâng cao' },
  { num: '02', title: 'ITI World Symposium', sub: 'Thành viên và diễn giả quốc tế' },
  { num: '03', title: 'Nobel Biocare Training', sub: 'Chứng chỉ All-on-4 & All-on-6' },
  { num: '04', title: 'Đại học Y Dược TP.HCM', sub: 'Đào tạo chuyên khoa răng hàm mặt' },
]

export default function TeamPage() {
  const { settings } = useSite()
  useDocumentMeta({ title: `Đội ngũ bác sĩ — ${settings.site_name || 'Nha khoa'}`, description: `Đội ngũ bác sĩ chuyên khoa Implant tại ${settings.site_name || 'nha khoa'}.` })
  const [doctors, setDoctors] = useState<Doctor[]>([])

  useEffect(() => {
    api.get<Doctor[]>('/public/doctors').then(data => setDoctors(data)).catch(() => {})
  }, [])

  const fallback: Doctor[] = [
    { id: 1, name: 'BS. Nguyễn Trung Hiếu', role: 'Trưởng khoa Implant', photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80', description: 'Hơn 15 năm kinh nghiệm trong lĩnh vực Implant nha khoa, đào tạo tại Straumann Institute (Thụy Sĩ). Chuyên gia hàng đầu về All-on-4, All-on-6 và các ca ghép xương phức tạp.', experience_years: 15, specialties: 'Implant|All-on-4|Ghép xương phức tạp', tag: 'Straumann Certified', sort_order: 1 },
    { id: 2, name: 'BS. Lê Phương Anh', role: 'Chuyên khoa phục hình', photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80', description: 'Chuyên gia thiết kế mão sứ CAD-CAM và phục hình thẩm mỹ. Tốt nghiệp ITI Fellowship — có kinh nghiệm hơn 12 năm về Digital Smile Design và Veneer sứ cao cấp.', experience_years: 12, specialties: 'Mão sứ CAD-CAM|Digital Smile Design|Veneer', tag: 'ITI Fellow', sort_order: 2 },
    { id: 3, name: 'BS. Trần Minh Quân', role: 'Phẫu thuật hàm mặt', photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80', description: 'Chuyên gia phẫu thuật xương hàm mặt và ghép xương phức tạp. 10 năm kinh nghiệm xử lý các ca Sinus Lift, ghép xương khối và tái tạo xương hàm sau chấn thương.', experience_years: 10, specialties: 'Ghép xương|Phẫu thuật hàm mặt|Sinus Lift', tag: 'Oral Surgeon', sort_order: 3 },
    { id: 4, name: 'BS. Võ Thị Như Quỳnh', role: 'Chẩn đoán hình ảnh', photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80', description: 'Chuyên gia phân tích CBCT 3D và lập kế hoạch Implant kỹ thuật số. Phụ trách toàn bộ quy trình thiết kế máng phẫu thuật và kiểm soát chất lượng ca lâm sàng.', experience_years: 8, specialties: 'CBCT 3D|Surgical Guide|3D Planning', tag: 'CBCT Specialist', sort_order: 4 },
  ]

  const displayed = doctors.length > 0 ? doctors : fallback

  return (
    <>
      {/* Page Header */}
      <section className="ft-page-header">
        <div className="wd-container">
          <div className="ft-ph-inner">
            <div className="ft-eyebrow ft-eyebrow-light">Đội ngũ bác sĩ</div>
            <h1 className="ft-ph-title">Chuyên gia <em>Implant hàng đầu</em></h1>
            <p className="ft-ph-sub">Được đào tạo tại các trung tâm Implant uy tín nhất thế giới — cam kết mang lại kết quả tốt nhất cho từng bệnh nhân.</p>
          </div>
        </div>
      </section>

      {/* Doctor Grid */}
      <section className="sec-pad">
        <div className="wd-container">
          <div className="row g-4">
            {displayed.map((doc, i) => {
              const specs = doc.specialties ? doc.specialties.split('|') : []
              return (
                <div key={doc.id} className="col-md-6">
                  <div className="ft-doctor-card-lg" data-reveal style={{ transitionDelay: `${i * 0.1}s` }}>
                    <div className="ft-doc-lg-img-col">
                      <img src={doc.photo} alt={doc.name} loading="lazy" />
                      {doc.tag && <div className="ft-doc-tag">{doc.tag}</div>}
                    </div>
                    <div className="ft-doc-lg-body">
                      <h2 className="ft-doc-name">{doc.name}</h2>
                      <div className="ft-doc-role">{doc.role}</div>
                      <p className="ft-doc-desc">{doc.description}</p>
                      {specs.length > 0 && (
                        <div className="ft-doc-specs">
                          {specs.map((s, si) => <span key={si} className="ft-spec-tag">{s}</span>)}
                        </div>
                      )}
                      <div className="ft-doc-exp">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-h)" strokeWidth="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        <span>{doc.experience_years}+ năm kinh nghiệm Implant</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Credentials Section */}
      <section className="ft-credentials-section sec-pad" style={{ background: 'var(--surface-2)' }}>
        <div className="wd-container">
          <div className="ft-sec-header" data-reveal>
            <div className="ft-eyebrow">Chứng chỉ quốc tế</div>
            <h2 className="ft-sec-title">Đào tạo tại các <em>viện uy tín</em></h2>
          </div>
          <div className="row g-3 mt-3">
            {CREDENTIALS.map((cred, i) => (
              <div key={i} className="col-md-6">
                <div className="ft-cred-card" data-reveal style={{ transitionDelay: `${i * 0.08}s` }}>
                  <div className="ft-cred-num">{cred.num}</div>
                  <div>
                    <div className="ft-cred-title">{cred.title}</div>
                    <div className="ft-cred-sub">{cred.sub}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ft-cta sec-pad">
        <div className="wd-container">
          <div className="ft-cta-inner" data-reveal>
            <h2 className="ft-cta-title">Đặt lịch gặp <em>bác sĩ chuyên khoa</em></h2>
            <p className="ft-cta-sub">Tư vấn trực tiếp với bác sĩ Implant — phân tích ca lâm sàng và đề xuất giải pháp phù hợp nhất.</p>
            <div className="ft-cta-actions">
              <Link to="/dat-lich" className="ft-btn ft-btn-neon">Đặt lịch tư vấn →</Link>
              <Link to="/lien-he" className="ft-btn ft-btn-ghost">Liên hệ với chúng tôi</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
