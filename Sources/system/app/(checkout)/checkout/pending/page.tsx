'use client'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useBankInfo } from '@/lib/hooks/useBankInfo'

function fmtPrice(n: number) { return n.toLocaleString('vi-VN') + 'đ' }

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button onClick={copy} style={{
      background: copied ? 'var(--accent)' : 'var(--warm2)',
      color: copied ? '#fff' : 'var(--text-2)',
      border: 'none', borderRadius: 6, padding: '3px 10px',
      fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all .15s', flexShrink: 0,
    }}>
      {copied ? '✓ Đã copy' : 'Copy'}
    </button>
  )
}

function BankRow({ label, value, copy }: { label: string; value: string; copy?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--border-light)', gap: 12 }}>
      <span style={{ fontSize: 13, color: 'var(--text-3)', flexShrink: 0 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', textAlign: 'right' }}>{value}</span>
        {copy && <CopyButton text={value} />}
      </div>
    </div>
  )
}

interface CvCredentials {
  email: string
  password: string | null
  existingUser: boolean
}

function CvSuccessPanel({ creds }: { creds: CvCredentials }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: 'var(--sans)' }}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        {/* Success header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--accent-light)', border: '2px solid var(--accent-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 32 }}>
            🎉
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
            {creds.existingUser ? 'CV đã được kích hoạt!' : 'Tài khoản CV đã sẵn sàng!'}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65, margin: 0 }}>
            {creds.existingUser
              ? 'CV Builder đã được thêm vào tài khoản hiện có của bạn. Đăng nhập bằng thông tin cũ.'
              : 'Thanh toán xác nhận thành công. Dưới đây là thông tin đăng nhập CV Manager của bạn.'}
          </p>
        </div>

        {/* Credentials box */}
        <div style={{ background: '#fff', border: '2px solid var(--accent-mid)', borderRadius: 14, padding: '24px', marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
            Thông tin đăng nhập
          </div>

          {/* Email */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5, marginBottom: 6 }}>Email</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--warm)', borderRadius: 8, padding: '10px 14px' }}>
              <span style={{ flex: 1, fontSize: 14, color: 'var(--text)', fontWeight: 500, wordBreak: 'break-all' }}>{creds.email}</span>
              <CopyButton text={creds.email} />
            </div>
          </div>

          {/* Password — chỉ hiện khi là user mới */}
          {!creds.existingUser && creds.password && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5, marginBottom: 6 }}>Mật khẩu tạm</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--accent-light)', borderRadius: 8, padding: '10px 14px', border: '1px solid var(--accent-mid)' }}>
                <span style={{ flex: 1, fontSize: 16, color: 'var(--accent)', fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace' }}>{creds.password}</span>
                <CopyButton text={creds.password} />
              </div>
            </div>
          )}

          <Link href="/cv-manager/login" style={{ display: 'block', padding: '13px', background: 'var(--accent)', color: '#fff', borderRadius: 9, fontSize: 14, fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>
            Đăng nhập CV Manager →
          </Link>
        </div>

        {/* Security note */}
        {!creds.existingUser && (
          <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 10, padding: '13px 16px', fontSize: 13, color: '#92400e', lineHeight: 1.65 }}>
            <strong>⚠️ Ghi lại mật khẩu ngay bây giờ</strong> — Trang này không hiển thị lại mật khẩu sau khi bạn rời đi. Đổi mật khẩu trong phần "Tài khoản" sau khi đăng nhập.
          </div>
        )}
      </div>
    </div>
  )
}

function PendingContent() {
  const searchParams = useSearchParams()
  const router       = useRouter()

  const code    = searchParams.get('code')   ?? ''
  const slug    = searchParams.get('slug')   ?? ''
  const amount  = parseInt(searchParams.get('amount') ?? '499000')
  const isCv    = searchParams.get('type') === 'cv'

  const [dots, setDots] = useState('.')
  const [cvCreds, setCvCreds] = useState<CvCredentials | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const bank = useBankInfo()

  const content = `WEBDROP ${code}`
  const qrUrl   = `https://img.vietqr.io/image/${bank.bankCode}-${bank.accountNo}-compact2.jpg?amount=${amount}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent(bank.accountName)}`

  // Animate dots
  useEffect(() => {
    const id = setInterval(() => setDots(d => d.length >= 3 ? '.' : d + '.'), 600)
    return () => clearInterval(id)
  }, [])

  // Poll status every 5s
  useEffect(() => {
    if (!code) return

    async function check() {
      try {
        const res  = await fetch(`/api/orders/${code}/status`)
        const data = await res.json()
        if (data.paid) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          if (data.type === 'cv') {
            // Hiển thị credentials ngay trên trang — không redirect
            setCvCreds({ email: data.email, password: data.password, existingUser: data.existingUser })
          } else if (data.token) {
            router.push(`/checkout/success?token=${encodeURIComponent(data.token)}&type=${data.type}&slug=${encodeURIComponent(data.slug ?? slug)}`)
          }
        }
      } catch { /* ignore */ }
    }

    check()
    intervalRef.current = setInterval(check, 5000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [code, router, slug])

  // Khi CV đã thanh toán — show credentials panel thay thế toàn bộ trang
  if (cvCreds) {
    return <CvSuccessPanel creds={cvCreds} />
  }

  // Đơn miễn phí (discount 100%) — hiện thông báo xử lý thay vì bank info
  if (amount === 0) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: 'var(--sans)' }}>
        <div style={{ textAlign: 'center', maxWidth: 360 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎁</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Đang kích hoạt miễn phí{dots}</h2>
          <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>
            Mã khuyến mại của bạn đang được xử lý. Trang tự động cập nhật trong vài giây.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: 'var(--sans)' }}>
      <div style={{ maxWidth: 520, width: '100%' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--warm)', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>
            💳
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.4px', marginBottom: 6 }}>Chờ xác nhận thanh toán</h1>
          {code && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--accent-light)', border: '1px solid var(--accent-mid)', borderRadius: 8, padding: '5px 14px', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Mã đơn:</span>
              <strong style={{ fontSize: 13.5, color: 'var(--accent)', letterSpacing: '.5px' }}>{code}</strong>
            </div>
          )}
          <p style={{ fontSize: 13.5, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.7, margin: '8px auto 0', maxWidth: 400 }}>
            Chuyển khoản theo thông tin bên dưới. Hệ thống tự động xác nhận {isCv
              ? 'và hiển thị thông tin đăng nhập CV Manager ngay trên trang này trong'
              : 'và chuyển bạn đến trang tải về trong'} <strong>vài giây</strong>.
          </p>
        </div>

        {/* QR + Bank info */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>

          {/* QR code */}
          <div style={{ background: 'var(--warm)', padding: '24px', display: 'flex', justifyContent: 'center', borderBottom: '1px solid var(--border-light)' }}>
            <img
              src={qrUrl}
              alt="QR chuyển khoản"
              width={200}
              height={200}
              style={{ borderRadius: 12, border: '3px solid #fff', boxShadow: '0 4px 16px rgba(0,0,0,.08)' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </div>

          {/* Bank info rows */}
          <div style={{ padding: '4px 20px 16px' }}>
            <BankRow label="Ngân hàng"     value={bank.bankName} />
            <BankRow label="Số tài khoản"  value={bank.accountNo}   copy />
            <BankRow label="Chủ tài khoản" value={bank.accountName} />
            <BankRow label="Số tiền"        value={fmtPrice(amount)} copy />
            <div style={{ padding: '9px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--text-3)', flexShrink: 0 }}>Nội dung CK</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--accent)', textAlign: 'right' }}>{content}</span>
                <CopyButton text={content} />
              </div>
            </div>
          </div>
        </div>

        {/* Polling status */}
        <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-mid)', borderRadius: 10, padding: '14px 18px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, animation: 'pulse 1.2s infinite' }} />
          <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>
            Đang chờ thanh toán{dots} trang tự động cập nhật
          </span>
        </div>

        {/* Note */}
        <div style={{ background: 'var(--warm)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.75 }}>
          <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 4 }}>⚠️ Lưu ý quan trọng</strong>
          Điền đúng nội dung chuyển khoản <strong style={{ color: 'var(--accent)' }}>{content}</strong> để hệ thống tự động xác nhận.
          Nếu quên điền nội dung, liên hệ Zalo để hỗ trợ thủ công.
        </div>

        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
      </div>
    </div>
  )
}

export default function CheckoutPendingPage() {
  return (
    <Suspense fallback={null}>
      <PendingContent />
    </Suspense>
  )
}
