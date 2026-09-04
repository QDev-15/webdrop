import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function CollectionsPage() {
  useDocumentMeta({
    title: 'Bộ sưu tập — VIOLETTE Fine Jewelry',
    description: 'Khám phá các bộ sưu tập trang sức VIOLETTE: Cưới hỏi, Đá quý tự nhiên, Vàng 24K truyền thống, Dự tiệc sang trọng, Quà tặng ý nghĩa.',
  })

  return (
    <>
      <section className="tr-page-head">
        <div className="tr-container">
          <div className="tr-breadcrumb"><Link to="/">Trang chủ</Link> / <span>Bộ sưu tập</span></div>
          <h1>Bộ sưu tập</h1>
          <p className="tr-page-head-sub">Mỗi bộ sưu tập kể một câu chuyện riêng — chọn bộ sưu tập phù hợp với khoảnh khắc của bạn.</p>
        </div>
      </section>

      <section className="tr-pad">
        <div className="tr-container">
          <div className="tr-bento" data-reveal>
            <Link to="/san-pham?occasion=cuoi-hoi" className="tr-bento-item b-lg">
              <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&auto=format&fit=crop&q=80" alt="Bộ sưu tập cưới hỏi VIOLETTE" loading="lazy" />
              <div className="tr-bento-overlay"><div className="tr-bento-tag">Trọn đời hạnh phúc</div><div className="tr-bento-title">Cưới Hỏi</div><div className="tr-bento-desc">Nhẫn cưới, bộ trang sức vàng 24K truyền thống cho ngày trọng đại.</div></div>
            </Link>
            <Link to="/san-pham?material=da-quy" className="tr-bento-item">
              <img src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=700&auto=format&fit=crop&q=80" alt="Bộ sưu tập đá quý tự nhiên VIOLETTE" loading="lazy" />
              <div className="tr-bento-overlay"><div className="tr-bento-tag">Kiểm định rõ ràng</div><div className="tr-bento-title">Đá Quý Tự Nhiên</div></div>
            </Link>
            <Link to="/san-pham?occasion=du-tiec" className="tr-bento-item">
              <img src="https://images.unsplash.com/photo-1631982690223-8aa4be0a2497?w=700&auto=format&fit=crop&q=80" alt="Bộ sưu tập dự tiệc VIOLETTE" loading="lazy" />
              <div className="tr-bento-overlay"><div className="tr-bento-tag">Tỏa sáng mọi khoảnh khắc</div><div className="tr-bento-title">Dự Tiệc Sang Trọng</div></div>
            </Link>
            <Link to="/san-pham?theme=qua-tang" className="tr-bento-item">
              <img src="https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=700&auto=format&fit=crop&q=80" alt="Bộ sưu tập quà tặng VIOLETTE" loading="lazy" />
              <div className="tr-bento-overlay"><div className="tr-bento-tag">Trao gửi yêu thương</div><div className="tr-bento-title">Quà Tặng Ý Nghĩa</div></div>
            </Link>
            <Link to="/san-pham?occasion=hang-ngay" className="tr-bento-item">
              <img src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=700&auto=format&fit=crop&q=80" alt="Bộ sưu tập hàng ngày VIOLETTE" loading="lazy" />
              <div className="tr-bento-overlay"><div className="tr-bento-tag">Tối giản mỗi ngày</div><div className="tr-bento-title">Hàng Ngày</div></div>
            </Link>
          </div>
        </div>
      </section>

      <section className="tr-pad tr-theme-section">
        <div className="tr-container">
          <div className="tr-strip" data-reveal>
            <div className="tr-strip-img"><img src="https://images.unsplash.com/photo-1592317295760-5c1f677dfc78?w=900&auto=format&fit=crop&q=80" alt="Bộ sưu tập vàng hồng VIOLETTE" loading="lazy" /></div>
            <div className="tr-strip-text">
              <div className="tr-eyebrow">Bộ sưu tập nổi bật</div>
              <h3>Vàng Hồng 18K <em>Tối Giản</em></h3>
              <p>Lấy cảm hứng từ vẻ đẹp nhẹ nhàng, tinh tế của phụ nữ hiện đại, bộ sưu tập Vàng Hồng 18K mang đến những thiết kế tối giản nhưng không kém phần sang trọng — dễ dàng phối cùng mọi trang phục từ công sở đến dạo phố.</p>
              <Link to="/san-pham?category=bo-trang-suc" className="tr-btn tr-btn-fill" style={{ marginTop: 14 }}>Khám phá ngay</Link>
            </div>
          </div>
          <div className="tr-strip" data-reveal>
            <div className="tr-strip-img"><img src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=900&auto=format&fit=crop&q=80" alt="Bộ sưu tập đính đá cao cấp VIOLETTE" loading="lazy" /></div>
            <div className="tr-strip-text">
              <div className="tr-eyebrow">Bộ sưu tập nổi bật</div>
              <h3>Đính Đá CZ <em>Cao Cấp</em></h3>
              <p>Sử dụng đá Cubic Zirconia cao cấp với độ trong và độ cắt chuẩn kim cương, bộ sưu tập này mang lại vẻ lấp lánh sang trọng với mức giá hợp lý — lựa chọn hoàn hảo cho những dịp dự tiệc quan trọng.</p>
              <Link to="/san-pham?material=dinh-da" className="tr-btn tr-btn-fill" style={{ marginTop: 14 }}>Khám phá ngay</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
