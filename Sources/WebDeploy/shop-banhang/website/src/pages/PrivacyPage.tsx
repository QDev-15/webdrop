import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PrivacyPage() {
  useDocumentMeta({ title: 'Chính sách bảo mật — POS Bán hàng', description: 'Chính sách bảo mật hệ thống POS Bán hàng.' })
  return (
    <div className="bp-page-content">
      <div className="bp-container" style={{ maxWidth: 780 }}>
        <h1>Chính sách bảo mật</h1>
        <p style={{ color: 'var(--text-2)' }}>Cập nhật lần cuối: 2026</p>

        <section className="bp-section" style={{ paddingTop: '1rem' }}>
          <h2>1. Dữ liệu được thu thập</h2>
          <p>Hệ thống POS Bán Hàng lưu trữ dữ liệu sản phẩm, đơn hàng, khách hàng, ca làm việc, phiếu nhập kho và trả hàng trong cơ sở dữ liệu trên máy chủ của cửa hàng — nhiều nhân viên có thể đăng nhập và sử dụng đồng thời từ nhiều thiết bị khác nhau.</p>
        </section>

        <section className="bp-section bg-light">
          <h2>2. Mục đích sử dụng dữ liệu</h2>
          <p>Dữ liệu được dùng để vận hành đầy đủ nghiệp vụ bán hàng: lập đơn, quản lý kho, chăm sóc khách hàng (tích điểm, hạng thành viên) và tạo báo cáo doanh thu/lợi nhuận phục vụ quản lý cửa hàng.</p>
        </section>

        <section className="bp-section">
          <h2>3. Lưu trữ &amp; bảo mật</h2>
          <p>Mật khẩu đăng nhập được mã hoá bằng thuật toán bcrypt, không lưu dưới dạng văn bản thuần. Mọi thao tác quản trị (quản lý sản phẩm, kho, khách hàng, báo cáo) đều yêu cầu đăng nhập đúng tài khoản có quyền phù hợp. Dữ liệu được lưu trữ tập trung trên máy chủ của cửa hàng, không bị mất khi xoá dữ liệu trình duyệt cá nhân.</p>
        </section>

        <section className="bp-section bg-light">
          <h2>4. Chia sẻ dữ liệu với bên thứ ba</h2>
          <p>Chúng tôi không chia sẻ, bán hoặc chuyển giao bất kỳ dữ liệu kinh doanh hoặc dữ liệu khách hàng nào cho bên thứ ba ngoài mục đích vận hành hệ thống.</p>
        </section>

        <section className="bp-section">
          <h2>5. Quyền của bạn</h2>
          <p>Chủ cửa hàng (tài khoản Quản lý) có toàn quyền xem, chỉnh sửa hoặc xoá dữ liệu sản phẩm/khách hàng thông qua trang quản trị. Vui lòng liên hệ quản trị viên hệ thống nếu cần hỗ trợ truy xuất hoặc xoá dữ liệu cá nhân của khách hàng.</p>
        </section>

        <section className="bp-section bg-light">
          <h2>6. Liên hệ</h2>
          <p>Nếu có thắc mắc về chính sách bảo mật, vui lòng <Link to="/lien-he">liên hệ với chúng tôi</Link>.</p>
        </section>
      </div>
    </div>
  )
}
