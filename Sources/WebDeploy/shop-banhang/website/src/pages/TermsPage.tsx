import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TermsPage() {
  useDocumentMeta({ title: 'Điều khoản sử dụng — POS Bán hàng', description: 'Điều khoản sử dụng hệ thống POS Bán hàng.' })
  return (
    <div className="bp-page-content">
      <div className="bp-container" style={{ maxWidth: 780 }}>
        <h1>Điều khoản sử dụng</h1>
        <p style={{ color: 'var(--text-2)' }}>Cập nhật lần cuối: 2026</p>

        <section className="bp-section" style={{ paddingTop: '1rem' }}>
          <h2>1. Phạm vi hệ thống</h2>
          <p>Đây là hệ thống quản lý bán hàng POS (Gói B — React + PHP + SQLite) dành cho nhà hàng, quán ăn, café và cửa hàng bán lẻ, vận hành trên máy chủ thật với cơ sở dữ liệu tập trung.</p>
        </section>

        <section className="bp-section bg-light">
          <h2>2. Vận hành đa nhân viên</h2>
          <p>Nhiều nhân viên thu ngân có thể đăng nhập và lập đơn đồng thời từ nhiều thiết bị. Toàn bộ giao dịch (thanh toán, nhập kho, kiểm kê, trả hàng) đều được ghi nhận tức thì vào cơ sở dữ liệu chung — không phụ thuộc vào bộ nhớ cục bộ của từng trình duyệt.</p>
        </section>

        <section className="bp-section">
          <h2>3. Tài khoản đăng nhập</h2>
          <p>Tài khoản Quản lý (vai trò <code>superadmin</code>) có toàn quyền quản trị hệ thống. Tài khoản Thu ngân (vai trò <code>user</code>) chỉ được phép lập đơn, trả hàng và quản lý ca làm việc của chính mình. Vui lòng đổi mật khẩu mặc định ngay sau khi triển khai và không chia sẻ thông tin đăng nhập cho người không có thẩm quyền.</p>
        </section>

        <section className="bp-section bg-light">
          <h2>4. Trách nhiệm vận hành</h2>
          <p>Chủ cửa hàng chịu trách nhiệm sao lưu định kỳ cơ sở dữ liệu trên máy chủ hosting và bảo mật thông tin đăng nhập quản trị. Chúng tôi khuyến nghị đổi mật khẩu mặc định và giới hạn quyền truy cập máy chủ ngay sau khi triển khai.</p>
        </section>

        <section className="bp-section">
          <h2>5. Bản quyền &amp; sử dụng thương mại</h2>
          <p>Hệ thống này được bán như một sản phẩm Gói B trên webdrop.store. Sau khi mua, khách hàng được quyền sử dụng, tuỳ chỉnh mã nguồn cho website của mình. Không được bán lại nguyên bản mã nguồn dưới danh nghĩa sản phẩm của bên thứ ba.</p>
        </section>

        <section className="bp-section bg-light">
          <h2>6. Thay đổi điều khoản</h2>
          <p>Chúng tôi có thể cập nhật điều khoản sử dụng theo thời gian. Phiên bản mới nhất luôn được đăng tải tại trang này.</p>
        </section>

        <section className="bp-section">
          <h2>7. Liên hệ</h2>
          <p>Nếu có thắc mắc về điều khoản sử dụng, vui lòng <Link to="/lien-he">liên hệ với chúng tôi</Link>.</p>
        </section>
      </div>
    </div>
  )
}
