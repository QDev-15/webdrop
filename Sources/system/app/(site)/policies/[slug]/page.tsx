import { notFound } from 'next/navigation'
import Footer from '@/components/site/Footer'
import Link from 'next/link'

const policies: Record<string, { title: string; content: string }> = {
  privacy: {
    title: 'Chính sách bảo mật',
    content: `
## 1. Thông tin chúng tôi thu thập

Khi bạn sử dụng dịch vụ của webdrop.vn, chúng tôi có thể thu thập:
- **Thông tin liên hệ**: Họ tên, email, số điện thoại (khi bạn điền form)
- **Thông tin đơn hàng**: Chi tiết giao dịch, sản phẩm đặt mua
- **Thông tin kỹ thuật**: Địa chỉ IP, loại trình duyệt, trang đã truy cập (thông qua analytics)

## 2. Cách chúng tôi sử dụng thông tin

- Xử lý đơn hàng và liên hệ tư vấn
- Cải thiện chất lượng dịch vụ
- Gửi thông báo về đơn hàng (không spam quảng cáo)

## 3. Bảo mật dữ liệu

- Dữ liệu được lưu trữ trên máy chủ bảo mật
- Chúng tôi không bán hoặc chia sẻ thông tin cá nhân với bên thứ ba
- Kết nối website dùng HTTPS mã hóa

## 4. Cookies

Website sử dụng cookies cần thiết để đăng nhập admin. Chúng tôi không dùng cookies theo dõi marketing.

## 5. Quyền của bạn

Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân. Liên hệ: hello@webdrop.vn

## 6. Liên hệ

Email: hello@webdrop.vn | Zalo: 0901 234 567
    `,
  },
  terms: {
    title: 'Điều khoản sử dụng',
    content: `
## 1. Điều khoản chung

Khi sử dụng dịch vụ webdrop.vn, bạn đồng ý tuân thủ các điều khoản này.

## 2. Sản phẩm và dịch vụ

- **Gói A (Template)**: Sau khi thanh toán, bạn nhận file ZIP và có quyền sử dụng cho 1 dự án. Không được bán lại template.
- **Gói B/C (Website)**: Bàn giao theo thỏa thuận scope ban đầu.

## 3. Thanh toán

- Giá niêm yết đã bao gồm VAT (nếu có)
- Chấp nhận thanh toán qua chuyển khoản ngân hàng, Momo, ZaloPay
- Đơn hàng được xử lý sau khi xác nhận thanh toán

## 4. Chính sách hoàn tiền

Xem chi tiết tại trang Chính sách hoàn tiền.

## 5. Giới hạn trách nhiệm

webdrop.vn không chịu trách nhiệm về:
- Nội dung bạn đưa lên website sau khi bàn giao
- Mất dữ liệu do lỗi hosting phía khách hàng
- Thay đổi theo yêu cầu ngoài scope đã thỏa thuận

## 6. Thay đổi điều khoản

Chúng tôi có thể cập nhật điều khoản. Thay đổi được thông báo qua email (nếu có).

## 7. Liên hệ

Email: hello@webdrop.vn | Zalo: 0901 234 567
    `,
  },
  refund: {
    title: 'Chính sách hoàn tiền',
    content: `
## Hoàn tiền 100% trong 7 ngày

Chúng tôi cam kết hoàn tiền **100%** nếu:

✓ Template không hiển thị đúng như mô tả/demo
✓ Có lỗi nghiêm trọng không thể sửa được trong 48h
✓ Bạn nhận nhầm sản phẩm so với đơn hàng

## Không được hoàn tiền nếu

✗ Bạn đã download và sử dụng file
✗ Yêu cầu thay đổi tính năng ngoài mô tả sản phẩm
✗ Lỗi do hosting/server phía khách hàng
✗ Quá 7 ngày kể từ ngày mua

## Quy trình hoàn tiền

1. Liên hệ qua Zalo hoặc email trong vòng 7 ngày
2. Mô tả vấn đề cụ thể (kèm ảnh chụp màn hình nếu có)
3. Chúng tôi xem xét trong 24h
4. Nếu hợp lệ, hoàn tiền qua phương thức thanh toán ban đầu trong 3–5 ngày làm việc

## Liên hệ

Email: hello@webdrop.vn | Zalo: 0901 234 567
    `,
  },
}

function renderMarkdown(text: string) {
  const lines = text.trim().split('\n')
  return lines.map((line, i) => {
    if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: 18, fontWeight: 600, marginTop: 28, marginBottom: 10, color: 'var(--text)' }}>{line.replace('## ', '')}</h2>
    if (line.startsWith('✓')) return <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 6, fontSize: 14, color: 'var(--text-2)' }}><span style={{ color: 'var(--accent)', fontWeight: 600 }}>✓</span>{line.replace('✓', '').trim()}</div>
    if (line.startsWith('✗')) return <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 6, fontSize: 14, color: 'var(--text-2)' }}><span style={{ color: '#dc2626', fontWeight: 600 }}>✗</span>{line.replace('✗', '').trim()}</div>
    if (line.startsWith('- **')) {
      const match = line.match(/- \*\*(.+?)\*\*: (.+)/)
      if (match) return <li key={i} style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 6, lineHeight: 1.6 }}><strong>{match[1]}</strong>: {match[2]}</li>
    }
    if (line.startsWith('- ')) return <li key={i} style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 6, lineHeight: 1.6 }}>{line.replace('- ', '')}</li>
    if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') || line.startsWith('4.')) return <div key={i} style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 6, lineHeight: 1.6 }}>{line}</div>
    if (line === '') return <div key={i} style={{ height: 6 }} />
    return <p key={i} style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.75, marginBottom: 8 }}>{line}</p>
  })
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const policy = policies[slug]
  if (!policy) notFound()

  return (
    <>
      <div style={{ paddingTop: 62 }}>
        <section style={{ background: 'var(--dark2)', padding: 'clamp(48px,7vw,72px) 0 clamp(32px,4vw,48px)' }}>
          <div className="wd-container">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 13 }}>
              <Link href="/" style={{ color: 'rgba(255,255,255,.4)', textDecoration: 'none' }}>Trang chủ</Link>
              <span style={{ color: 'rgba(255,255,255,.2)' }}>›</span>
              <span style={{ color: 'rgba(255,255,255,.5)' }}>{policy.title}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 600, color: '#fff', letterSpacing: '-.5px' }}>{policy.title}</h1>
          </div>
        </section>

        <section className="sec-pad">
          <div className="wd-container" style={{ maxWidth: 760 }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 'clamp(24px,4vw,40px)' }}>
              {renderMarkdown(policy.content)}
            </div>
            <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
              <Link href="/" style={{ fontSize: 13, color: 'var(--text-2)', textDecoration: 'none' }}>← Về trang chủ</Link>
              <span style={{ color: 'var(--border)' }}>·</span>
              <Link href="/contact" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>Liên hệ nếu có thắc mắc</Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
