import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

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

export default function Team() {
  const [doctors, setDoctors] = useState<Doctor[]>([])

  useEffect(() => {
    api.get<Doctor[]>('/public/doctors').then(data => setDoctors(data)).catch(() => {})
  }, [])

  const fallback: Doctor[] = [
    { id: 1, name: 'BS. Nguyễn Trung Hiếu', role: 'Trưởng khoa Implant', photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80', description: 'Hơn 15 năm kinh nghiệm trong lĩnh vực Implant nha khoa, đào tạo tại Straumann Institute (Thụy Sĩ).', experience_years: 15, specialties: 'Implant|All-on-4|Ghép xương', tag: 'Straumann Certified', sort_order: 1 },
    { id: 2, name: 'BS. Lê Phương Anh', role: 'Chuyên khoa phục hình', photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80', description: 'Chuyên gia thiết kế mão sứ CAD-CAM, phục hình thẩm mỹ cao cấp với công nghệ kỹ thuật số.', experience_years: 12, specialties: 'Mão sứ CAD-CAM|Digital Smile Design|Veneer', tag: 'ITI Fellow', sort_order: 2 },
    { id: 3, name: 'BS. Trần Minh Quân', role: 'Phẫu thuật hàm mặt', photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80', description: 'Chuyên gia phẫu thuật xương hàm mặt và ghép xương phức tạp, tốt nghiệp ĐH Y Dược TP.HCM.', experience_years: 10, specialties: 'Ghép xương|Phẫu thuật hàm mặt|Sinus Lift', tag: 'Oral Surgeon', sort_order: 3 },
    { id: 4, name: 'BS. Võ Thị Như Quỳnh', role: 'Chẩn đoán hình ảnh', photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80', description: 'Chuyên gia phân tích CBCT 3D, lập kế hoạch Implant kỹ thuật số và thiết kế máng phẫu thuật.', experience_years: 8, specialties: 'CBCT 3D|Surgical Guide|3D Planning', tag: 'CBCT Specialist', sort_order: 4 },
  ]

  const displayed = doctors.length > 0 ? doctors : fallback

  return (
    <section className="ft-team sec-pad" style={{ background: 'var(--surface-2)' }}>
      <div className="wd-container">
        <div className="ft-sec-header" data-reveal>
          <div className="ft-eyebrow">Đội ngũ chuyên gia</div>
          <h2 className="ft-sec-title">Bác sĩ <em>hàng đầu</em> chuyên Implant</h2>
          <p className="ft-sec-sub">Mỗi ca Implant tại Future Dental được thực hiện bởi đội ngũ bác sĩ chuyên sâu, được đào tạo tại các trung tâm Implant quốc tế uy tín.</p>
        </div>

        <div className="row g-4 mt-2">
          {displayed.slice(0, 4).map((doc, i) => {
            const specs = doc.specialties ? doc.specialties.split('|') : []
            return (
              <div key={doc.id} className="col-md-6 col-lg-3">
                <div className="ft-doctor-card" data-reveal style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="ft-doc-img-wrap">
                    <img src={doc.photo} alt={doc.name} loading="lazy" />
                    {doc.tag && <div className="ft-doc-tag">{doc.tag}</div>}
                  </div>
                  <div className="ft-doc-body">
                    <h3 className="ft-doc-name">{doc.name}</h3>
                    <div className="ft-doc-role">{doc.role}</div>
                    <p className="ft-doc-desc">{doc.description}</p>
                    {specs.length > 0 && (
                      <div className="ft-doc-specs">
                        {specs.map((s, si) => <span key={si} className="ft-spec-tag">{s}</span>)}
                      </div>
                    )}
                    <div className="ft-doc-exp">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-h)" strokeWidth="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      <span>{doc.experience_years}+ năm kinh nghiệm</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="ft-team-cta text-center mt-5" data-reveal>
          <Link to="/bac-si" className="ft-btn ft-btn-outline">Gặp gỡ toàn bộ đội ngũ →</Link>
        </div>
      </div>
    </section>
  )
}
