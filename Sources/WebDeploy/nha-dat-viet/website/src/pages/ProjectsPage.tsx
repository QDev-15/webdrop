import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useApiList } from '../hooks/useApiList'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import type { ProjectItem } from '../types'

export default function ProjectsPage() {
  useDocumentMeta({
    title: 'Dự án đang phân phối — Nhà Đất Việt',
    description: 'Nhà Đất Việt hợp tác phân phối các dự án chung cư, khu đô thị tại TP.HCM — cập nhật tiến độ, chính sách bán hàng, hỗ trợ vay ưu đãi từ chủ đầu tư.',
  })
  const { settings } = useSite()
  const { items, loading } = useApiList<ProjectItem>('/public/projects')
  const bannerImg = settings.banner_projects || 'https://images.unsplash.com/photo-1618221469555-7f3ad97540d6?w=1600&auto=format&fit=crop&q=80'

  return (
    <>
      <section className="ndv-page-header" style={{ backgroundImage: `url('${bannerImg}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="ndv-container ndv-page-header-in">
          <div className="ndv-breadcrumb"><Link to="/">Trang chủ</Link> / <span>Dự án</span></div>
          <h1>Dự án đang phân phối</h1>
          <p>Bên cạnh môi giới nhà đất cá nhân, {settings.site_name || 'Nhà Đất Việt'} còn hợp tác phân phối trực tiếp một số dự án chung cư, khu đô thị uy tín tại TP.HCM.</p>
        </div>
      </section>

      <section className="ndv-sec">
        <div className="ndv-container">
          <div className="ndv-sec-head" data-reveal="">
            <div>
              <div className="ndv-eyebrow">Hợp tác phân phối</div>
              <h2 className="ndv-title">Các dự án <em>đang mở bán</em></h2>
              <p className="ndv-sub">Thông tin tiến độ và chính sách bán hàng được cập nhật trực tiếp từ chủ đầu tư — liên hệ đội ngũ {settings.site_name || 'Nhà Đất Việt'} để nhận bảng giá và tư vấn chi tiết.</p>
            </div>
          </div>

          {loading ? (
            <div>Đang tải...</div>
          ) : (
            <div className="ndv-project-grid">
              {items.map(p => (
                <div className="ndv-project-card" key={p.id} data-reveal="">
                  <div className="ndv-project-img"><img src={p.image} alt={p.title} loading="lazy" /></div>
                  <div className="ndv-project-body">
                    <span className="ndv-project-status">{p.status_label}</span>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                    <div className="ndv-project-meta">
                      <span>Chủ đầu tư: {p.investor}</span>
                      <span>{p.price_label}</span>
                      <span>{p.area_label}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="ndv-sec-sm">
        <div className="ndv-container">
          <div className="ndv-cta-band" data-reveal="">
            <div>
              <h3>Cần bảng giá chi tiết và chính sách bán hàng?</h3>
              <p>Đội ngũ {settings.site_name || 'Nhà Đất Việt'} sẽ gửi bảng giá cập nhật và hỗ trợ tư vấn vay ngân hàng ưu đãi từ chủ đầu tư.</p>
            </div>
            <div className="ndv-cta-band-actions">
              <a href={`tel:${(settings.site_phone || '1900 6789').replace(/\s/g, '')}`} className="ndv-btn ndv-btn-primary">Gọi hotline {settings.site_phone || '1900 6789'}</a>
              <Link to="/lien-he" className="ndv-btn ndv-btn-outline-dark">Nhận bảng giá</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
