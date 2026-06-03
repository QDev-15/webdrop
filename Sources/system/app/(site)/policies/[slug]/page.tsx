import { notFound } from 'next/navigation'
import Footer from '@/components/site/Footer'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

// ── Fetch contact info ────────────────────────────────────────────────────────

async function getContact() {
  try {
    const rows = await prisma.setting.findMany({
      where: { key: { in: ['site_email', 'site_phone', 'social_zalo', 'site_name', 'working_hours'] } },
    })
    const m = Object.fromEntries(rows.map(r => [r.key, r.value ?? '']))
    const zalo = m['social_zalo'] || m['site_phone'] || ''
    return {
      email:   m['site_email']    || 'hello@webdrop.vn',
      phone:   m['site_phone']    || '',
      zalo,
      name:    m['site_name']     || 'webdrop.vn',
      hours:   m['working_hours'] || '8:00–18:00 · Thứ 2–Thứ 7',
    }
  } catch {
    return { email: 'hello@webdrop.vn', phone: '', zalo: '', name: 'webdrop.vn', hours: '8:00–18:00 · Thứ 2–Thứ 7' }
  }
}

// ── Policy content builder ────────────────────────────────────────────────────

type PolicyContent = { title: string; updated: string; sections: Section[] }
type Section = { heading: string; items: Item[] }
type Item =
  | { type: 'p';      text: string }
  | { type: 'check';  ok: boolean; text: string }
  | { type: 'step';   n: number;   text: string }
  | { type: 'bullet'; bold?: string; text: string }

function buildPolicies(c: Awaited<ReturnType<typeof getContact>>): Record<string, PolicyContent> {
  const contact = `Email: ${c.email}${c.zalo ? ` | Zalo: ${c.zalo}` : ''} | Giờ hỗ trợ: ${c.hours}`

  return {
    privacy: {
      title:   'Chính sách bảo mật',
      updated: '2026-06-03',
      sections: [
        {
          heading: '1. Thông tin chúng tôi thu thập',
          items: [
            { type: 'p', text: 'Khi bạn sử dụng dịch vụ của webdrop.vn, chúng tôi có thể thu thập các thông tin sau:' },
            { type: 'bullet', bold: 'Thông tin liên hệ', text: 'Họ tên, email, số điện thoại (khi bạn điền form đặt hàng hoặc liên hệ).' },
            { type: 'bullet', bold: 'Thông tin đơn hàng', text: 'Chi tiết giao dịch, sản phẩm/gói dịch vụ đặt mua.' },
            { type: 'bullet', bold: 'Thông tin kỹ thuật', text: 'Địa chỉ IP, loại trình duyệt, trang đã truy cập (thông qua Google Analytics nếu đã bật).' },
          ],
        },
        {
          heading: '2. Mục đích sử dụng thông tin',
          items: [
            { type: 'bullet', text: 'Xử lý đơn hàng và liên hệ tư vấn theo yêu cầu.' },
            { type: 'bullet', text: 'Gửi thông báo liên quan đến đơn hàng (không spam quảng cáo).' },
            { type: 'bullet', text: 'Cải thiện chất lượng sản phẩm và dịch vụ.' },
          ],
        },
        {
          heading: '3. Bảo mật dữ liệu',
          items: [
            { type: 'bullet', text: 'Dữ liệu được lưu trữ trên máy chủ bảo mật, kết nối HTTPS mã hóa.' },
            { type: 'bullet', text: 'Chúng tôi không bán, cho thuê hoặc chia sẻ thông tin cá nhân với bên thứ ba vì mục đích thương mại.' },
            { type: 'bullet', text: 'Chỉ nhân viên có thẩm quyền mới được truy cập dữ liệu khách hàng.' },
          ],
        },
        {
          heading: '4. Cookies',
          items: [
            { type: 'p', text: 'Website sử dụng cookies cần thiết để duy trì phiên đăng nhập admin. Không dùng cookies theo dõi hành vi marketing của người dùng.' },
          ],
        },
        {
          heading: '5. Quyền của bạn',
          items: [
            { type: 'p', text: 'Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân của mình bất kỳ lúc nào.' },
            { type: 'p', text: `Liên hệ: ${contact}` },
          ],
        },
      ],
    },

    terms: {
      title:   'Điều khoản sử dụng',
      updated: '2026-06-03',
      sections: [
        {
          heading: '1. Chấp thuận điều khoản',
          items: [
            { type: 'p', text: 'Khi sử dụng dịch vụ của webdrop.vn, bạn xác nhận đã đọc, hiểu và đồng ý tuân thủ các điều khoản này.' },
          ],
        },
        {
          heading: '2. Sản phẩm và dịch vụ',
          items: [
            { type: 'bullet', bold: 'Gói Template', text: 'Sau khi thanh toán, bạn nhận file ZIP và có quyền sử dụng cho 1 dự án thương mại. Không được bán lại, phân phối hoặc chia sẻ file template dưới bất kỳ hình thức nào.' },
            { type: 'bullet', bold: 'Gói Web cơ bản', text: 'Bàn giao website hoàn chỉnh theo mô tả gói đã chọn. Nội dung được điền theo brief khách cung cấp.' },
            { type: 'bullet', bold: 'Gói Theo Yêu cầu', text: 'Bàn giao theo checklist scope đã ký duyệt trước khi bắt đầu. Thay đổi ngoài scope tính phí riêng.' },
          ],
        },
        {
          heading: '3. Thanh toán',
          items: [
            { type: 'bullet', text: 'Chấp nhận thanh toán qua chuyển khoản ngân hàng.' },
            { type: 'bullet', text: 'Đơn hàng được xử lý sau khi xác nhận thanh toán trong vòng 2 giờ làm việc.' },
            { type: 'bullet', text: 'Giá niêm yết là giá cuối — không phát sinh thêm ngoài những gì đã thỏa thuận.' },
          ],
        },
        {
          heading: '4. Quyền sở hữu trí tuệ',
          items: [
            { type: 'bullet', text: 'Template và source code do webdrop.vn tạo ra — bản quyền thuộc về webdrop.vn.' },
            { type: 'bullet', text: 'Sau khi mua, bạn được cấp quyền sử dụng (license) cho 1 dự án — không phải chuyển nhượng bản quyền.' },
            { type: 'bullet', text: 'Source code Gói Theo Yêu cầu: bàn giao quyền sở hữu đầy đủ nếu hợp đồng ghi rõ.' },
          ],
        },
        {
          heading: '5. Giới hạn trách nhiệm',
          items: [
            { type: 'p', text: `${c.name} không chịu trách nhiệm về:` },
            { type: 'bullet', text: 'Nội dung bạn đăng lên website sau khi bàn giao.' },
            { type: 'bullet', text: 'Mất dữ liệu do lỗi hosting, điện, mạng phía khách hàng.' },
            { type: 'bullet', text: 'Yêu cầu thay đổi ngoài scope đã thỏa thuận.' },
            { type: 'bullet', text: 'Vi phạm pháp luật từ nội dung do khách hàng tự đăng tải.' },
          ],
        },
        {
          heading: '6. Cập nhật điều khoản',
          items: [
            { type: 'p', text: 'Chúng tôi có thể cập nhật điều khoản khi cần thiết. Phiên bản mới nhất luôn có tại trang này.' },
          ],
        },
        {
          heading: '7. Liên hệ',
          items: [
            { type: 'p', text: contact },
          ],
        },
      ],
    },

    refund: {
      title:   'Chính sách hoàn tiền',
      updated: '2026-06-03',
      sections: [
        {
          heading: 'Cam kết hoàn tiền 100% trong 7 ngày',
          items: [
            { type: 'p', text: 'Chúng tôi hoàn tiền toàn bộ nếu xảy ra các trường hợp sau:' },
            { type: 'check', ok: true,  text: 'Template/website không hiển thị đúng như mô tả hoặc demo.' },
            { type: 'check', ok: true,  text: 'Có lỗi kỹ thuật nghiêm trọng không thể khắc phục trong 48 giờ.' },
            { type: 'check', ok: true,  text: 'Bạn nhận nhầm sản phẩm so với đơn hàng đã đặt.' },
          ],
        },
        {
          heading: 'Trường hợp không được hoàn tiền',
          items: [
            { type: 'check', ok: false, text: 'Đã tải file về và chỉnh sửa nội dung.' },
            { type: 'check', ok: false, text: 'Yêu cầu tính năng ngoài mô tả sản phẩm.' },
            { type: 'check', ok: false, text: 'Lỗi phát sinh từ hosting/server/cấu hình phía khách hàng.' },
            { type: 'check', ok: false, text: 'Quá 7 ngày kể từ ngày mua.' },
            { type: 'check', ok: false, text: 'Gói Theo Yêu cầu đã hoàn thành Phase 1 (Design đã duyệt).' },
          ],
        },
        {
          heading: 'Quy trình yêu cầu hoàn tiền',
          items: [
            { type: 'step', n: 1, text: `Liên hệ qua Zalo hoặc email trong vòng 7 ngày kể từ ngày mua. (${contact})` },
            { type: 'step', n: 2, text: 'Mô tả vấn đề cụ thể, kèm ảnh chụp màn hình hoặc video nếu có.' },
            { type: 'step', n: 3, text: 'Chúng tôi xem xét yêu cầu trong vòng 24 giờ làm việc.' },
            { type: 'step', n: 4, text: 'Nếu hợp lệ, hoàn tiền 100% qua chuyển khoản ngân hàng trong 3–5 ngày làm việc.' },
          ],
        },
        {
          heading: 'Liên hệ',
          items: [
            { type: 'p', text: contact },
          ],
        },
      ],
    },
  }
}

// ── Renderer ──────────────────────────────────────────────────────────────────

function renderSection(section: Section, si: number) {
  return (
    <div key={si} style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border-light)', color: 'var(--text)' }}>
        {section.heading}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {section.items.map((item, ii) => {
          if (item.type === 'p') return (
            <p key={ii} style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.75, margin: 0 }}>{item.text}</p>
          )
          if (item.type === 'check') return (
            <div key={ii} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--text-2)', alignItems: 'flex-start' }}>
              <span style={{ color: item.ok ? 'var(--accent)' : '#dc2626', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{item.ok ? '✓' : '✗'}</span>
              <span>{item.text}</span>
            </div>
          )
          if (item.type === 'step') return (
            <div key={ii} style={{ display: 'flex', gap: 12, fontSize: 14, color: 'var(--text-2)', alignItems: 'flex-start' }}>
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent-light)', color: 'var(--accent)', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{item.n}</span>
              <span style={{ lineHeight: 1.65 }}>{item.text}</span>
            </div>
          )
          if (item.type === 'bullet') return (
            <div key={ii} style={{ display: 'flex', gap: 8, fontSize: 14, color: 'var(--text-2)', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 4 }}>·</span>
              <span style={{ lineHeight: 1.65 }}>{item.bold ? <><strong style={{ color: 'var(--text)' }}>{item.bold}</strong>: {item.text}</> : item.text}</span>
            </div>
          )
          return null
        })}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const contact  = await getContact()
  const policies = buildPolicies(contact)
  const policy   = policies[slug]
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
            <h1 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 600, color: '#fff', letterSpacing: '-.5px', marginBottom: 8 }}>{policy.title}</h1>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)' }}>Cập nhật lần cuối: {policy.updated}</div>
          </div>
        </section>

        <section className="sec-pad">
          <div className="wd-container" style={{ maxWidth: 760 }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 'clamp(24px,4vw,40px)' }}>
              {policy.sections.map((s, si) => renderSection(s, si))}
            </div>
            <div style={{ marginTop: 32, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link href="/" style={{ fontSize: 13, color: 'var(--text-2)', textDecoration: 'none' }}>← Về trang chủ</Link>
              <Link href="/policies/privacy" style={{ fontSize: 13, color: 'var(--text-3)', textDecoration: 'none' }}>Chính sách bảo mật</Link>
              <Link href="/policies/terms" style={{ fontSize: 13, color: 'var(--text-3)', textDecoration: 'none' }}>Điều khoản</Link>
              <Link href="/policies/refund" style={{ fontSize: 13, color: 'var(--text-3)', textDecoration: 'none' }}>Hoàn tiền</Link>
              <Link href="/contact" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none', marginLeft: 'auto' }}>Liên hệ nếu có thắc mắc →</Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
