import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useAccount } from '../contexts/AccountContext'
import { api } from '../api/client'
import { formatFullVND } from '../lib/listings'

interface PaymentMethods { sepay_enabled: boolean; manual_enabled: boolean; bank_name: string; account_number: string; account_name: string }
interface TopupResult { ok: boolean; ref: string; amount: number; bank: { bank_name: string; account_number: string; account_name: string; content: string }; message: string }

const AMOUNTS = [100000, 200000, 500000, 1000000, 2000000]

export default function TopupPage() {
  useDocumentMeta({ title: 'Nạp credit | RaoNhà', description: 'Nạp credit vào ví RaoNhà để mua và gia hạn các gói tin VIP Bạc, VIP Vàng, VIP Kim Cương.' })
  const { account, loading, refresh } = useAccount()
  const [methods, setMethods] = useState<PaymentMethods | null>(null)
  const [amount, setAmount] = useState(200000)
  const [customAmount, setCustomAmount] = useState('')
  const [method, setMethod] = useState<'sepay' | 'chuyen-khoan-thu-cong'>('chuyen-khoan-thu-cong')
  const [result, setResult] = useState<TopupResult | null>(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get<PaymentMethods>('/public/payment-methods').then(m => {
      setMethods(m)
      setMethod(m.manual_enabled ? 'chuyen-khoan-thu-cong' : 'sepay')
    }).catch(() => {})
  }, [])

  const finalAmount = customAmount ? parseInt(customAmount) || 0 : amount

  async function confirmTopup() {
    setError('')
    if (finalAmount < 20000) { setError('Số tiền nạp tối thiểu là 20.000đ.'); return }
    setSubmitting(true)
    try {
      const res = await api.post<TopupResult>('/public/wallet/topup', { amount: finalAmount, method })
      setResult(res)
      await refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Yêu cầu nạp credit thất bại.')
    } finally { setSubmitting(false) }
  }

  if (loading) return <div style={{ padding: '160px 0', textAlign: 'center' }}>Đang tải...</div>

  return (
    <>
      <section className="rn-page-hero" style={{ paddingBottom: 32 }}>
        <div className="rn-container">
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Ví RaoNhà</div>
          <h1 className="sec-title">Nạp credit vào ví</h1>
          <p className="sec-sub" style={{ margin: '0 auto' }}>Credit dùng để mua và gia hạn các gói tin VIP Bạc, VIP Vàng, VIP Kim Cương bất cứ lúc nào.</p>
        </div>
      </section>

      <section className="sec-pad" style={{ paddingTop: 24 }}>
        <div className="rn-container" style={{ maxWidth: 720 }}>
          {!account ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ fontSize: 16, marginBottom: 16 }}>Bạn chưa đăng nhập. Vui lòng đăng nhập để nạp credit vào ví.</p>
              <Link to="/dang-nhap" className="btn-rn btn-rn-primary">Đăng nhập ngay</Link>
            </div>
          ) : result ? (
            <div>
              <div className="rn-wallet-box" style={{ marginBottom: 28 }}>
                <div><div className="lbl">Số dư hiện tại</div><div className="val">{formatFullVND(account.credit_balance)}</div></div>
                <Link to="/tai-khoan" className="btn-rn btn-rn-white">← Về tài khoản</Link>
              </div>
              <div style={{ padding: 20, borderRadius: 'var(--radius-lg)', background: 'var(--accent-light)', textAlign: 'center' }}>
                <p style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: 8 }}>✓ Yêu cầu nạp credit đã được ghi nhận!</p>
                <p style={{ fontSize: 13.5, color: 'var(--text-2)', marginBottom: 12 }}>{result.message}</p>
                <div style={{ background: '#fff', borderRadius: 10, padding: 16, textAlign: 'left', fontSize: 13.5, marginBottom: 16 }}>
                  <div>Ngân hàng: <b>{result.bank.bank_name}</b></div>
                  <div>Chủ tài khoản: <b>{result.bank.account_name}</b></div>
                  <div>Số tài khoản: <b>{result.bank.account_number}</b></div>
                  <div>Số tiền: <b>{formatFullVND(result.amount)}</b></div>
                  <div>Nội dung chuyển khoản: <b>{result.bank.content}</b></div>
                </div>
                <Link to="/tai-khoan" className="btn-rn btn-rn-primary">Về trang Tài khoản của tôi</Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="rn-wallet-box" style={{ marginBottom: 28 }}>
                <div><div className="lbl">Số dư hiện tại</div><div className="val">{formatFullVND(account.credit_balance)}</div></div>
                <Link to="/tai-khoan" className="btn-rn btn-rn-white">← Về tài khoản</Link>
              </div>

              {error && <div className="alert-danger" style={{ marginBottom: 16 }}>{error}</div>}

              <h3 style={{ fontSize: 15, marginBottom: 6 }}>1. Chọn số tiền muốn nạp</h3>
              <div className="rn-topup-grid">
                {AMOUNTS.map(a => (
                  <div key={a} className={'rn-topup-chip' + (!customAmount && amount === a ? ' selected' : '')}
                    onClick={() => { setAmount(a); setCustomAmount('') }}>{a.toLocaleString('vi-VN')}đ</div>
                ))}
              </div>
              <div className="rn-form-group" style={{ maxWidth: 280 }}>
                <label htmlFor="topup-custom-amount">Hoặc nhập số tiền khác (đ)</label>
                <input id="topup-custom-amount" type="number" min={20000} step={10000} value={customAmount} onChange={e => setCustomAmount(e.target.value)} placeholder="Vd: 350000" />
              </div>

              <h3 style={{ fontSize: 15, margin: '26px 0 12px' }}>2. Chọn phương thức</h3>
              {!methods?.sepay_enabled && !methods?.manual_enabled ? (
                <div className="alert-danger">Hiện tại RaoNhà tạm ngừng nhận nạp credit online. Vui lòng liên hệ hotline để được hỗ trợ.</div>
              ) : (
                <div className="rn-need-radio" style={{ marginBottom: 20 }}>
                  {methods?.manual_enabled && (
                    <label className={method === 'chuyen-khoan-thu-cong' ? 'checked' : ''}>
                      <input type="radio" checked={method === 'chuyen-khoan-thu-cong'} onChange={() => setMethod('chuyen-khoan-thu-cong')} />
                      <span>🏦 Chuyển khoản ngân hàng (admin xác nhận thủ công)</span>
                    </label>
                  )}
                  {methods?.sepay_enabled && (
                    <label className={method === 'sepay' ? 'checked' : ''}>
                      <input type="radio" checked={method === 'sepay'} onChange={() => setMethod('sepay')} />
                      <span>⚡ SePay — tự động cộng credit qua QR</span>
                    </label>
                  )}
                </div>
              )}

              {(methods?.sepay_enabled || methods?.manual_enabled) && (
                <button type="button" className="btn-rn btn-rn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting} onClick={confirmTopup}>
                  {submitting ? 'Đang xử lý...' : `Xác nhận nạp ${finalAmount > 0 ? finalAmount.toLocaleString('vi-VN') + 'đ' : ''}`}
                </button>
              )}
              <div className="rn-auth-note">Sau khi xác nhận, hệ thống sẽ hiển thị thông tin chuyển khoản. Với phương thức chuyển khoản thủ công, credit sẽ được cộng sau khi admin xác nhận giao dịch — thường trong vài giờ làm việc.</div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
