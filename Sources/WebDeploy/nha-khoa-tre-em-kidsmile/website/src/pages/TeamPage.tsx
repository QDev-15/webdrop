import { Link } from 'react-router-dom'
import Team from '../components/Team'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TeamPage() {
  useDocumentMeta({ title: 'Đội ngũ bác sĩ — KidSmile', description: 'Đội ngũ bác sĩ chuyên khoa Nhi giàu kinh nghiệm tại KidSmile — nhẹ nhàng, tận tâm với các bé.' })
  return (
    <>
      {/* Page header */}
      <div className="ks-page-head">
        <div className="wd-container">
          <div className="ks-crumb">
            <Link to="/">Trang chủ</Link>
            <span>›</span>
            Đội ngũ bác sĩ
          </div>
          <h1 className="ks-title" style={{ fontSize: 'clamp(30px,4.5vw,50px)' }}>
            Đội ngũ bác sĩ <strong>chuyên khoa Nhi</strong>
          </h1>
          <p className="ks-sub ks-mx-auto" style={{ textAlign: 'center', marginTop: 12 }}>
            Mỗi bác sĩ tại KidSmile đều được đào tạo chuyên sâu về nha khoa trẻ em và tâm lý giao tiếp với bé nhỏ.
          </p>
        </div>
      </div>

      <section className="ks-sec-pad" aria-label="Danh sách bác sĩ">
        <div className="wd-container">
          <Team mode="grid" />
        </div>
      </section>
    </>
  )
}
