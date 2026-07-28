import { useState } from 'react'
import { api } from '../api/client'

// Component TĨNH — nhúng vào Settings.tsx của site (tab "💳 Thanh toán").
// Cách dùng trong Settings.tsx:
//   import PaymentSettingsTab from '../../components/PaymentSettingsTab'
//   { id: 'payment', label: '💳 Thanh toán' }  ← thêm vào mảng TABS
//   {activeTab === 'payment' && <PaymentSettingsTab val={val} set={set} />}
interface Props {
  val: (key: string) => string
  set: (key: string, value: string) => void
}

export default function PaymentSettingsTab({ val, set }: Props) {
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  const handleSyncSepay = async () => {
    const apiKey = (val('sepay_webhook_secret') || '').trim()
    if (!apiKey) {
      setSyncMsg({ type: 'error', text: 'Nhập SePay API Access trước khi đồng bộ' })
      return
    }
    setSyncing(true)
    setSyncMsg(null)
    try {
      const data = await api.post<{ ok: boolean; bank: { bank_code: string; account_no: string; account_name: string }; warning?: string }>(
        '/settings/sepay-sync', { api_key: apiKey }
      )
      set('sepay_bank_code', data.bank.bank_code)
      set('sepay_account_number', data.bank.account_no)
      set('sepay_account_name', data.bank.account_name)
      setSyncMsg({
        type: data.warning ? 'error' : 'ok',
        text: data.warning || '✓ Đã lấy thông tin tài khoản từ SePay — nhớ nhấn "Lưu cài đặt" để áp dụng',
      })
    } catch (err) {
      setSyncMsg({ type: 'error', text: err instanceof Error ? err.message : 'Đồng bộ thất bại' })
    } finally {
      setSyncing(false)
    }
  }

  return (
    <>
      <p style={{ color: '#888', fontSize: 13, marginBottom: 16 }}>Bật/tắt từng phương thức thanh toán hiển thị ở trang thanh toán của khách.</p>
      <div className="form-row" style={{ gap: 24, marginBottom: 20 }}>
        <label className="form-check">
          <input type="checkbox" checked={val('payment_cod_enabled') === '1'} onChange={e => set('payment_cod_enabled', e.target.checked ? '1' : '0')} />
          <span>Thanh toán khi nhận hàng (COD)</span>
        </label>
        <label className="form-check">
          <input type="checkbox" checked={val('payment_sepay_enabled') === '1'} onChange={e => set('payment_sepay_enabled', e.target.checked ? '1' : '0')} />
          <span>Chuyển khoản trước qua SePay</span>
        </label>
      </div>

      <div className="form-group">
        <label>SePay API Access</label>
        <input type="password" value={val('sepay_webhook_secret')} onChange={e => set('sepay_webhook_secret', e.target.value)} placeholder="Lấy tại my.sepay.vn → Cài đặt công ty → API Access" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', margin: '4px 0 20px' }}>
        <button type="button" className="btn btn-outline" onClick={handleSyncSepay} disabled={syncing}>
          {syncing ? 'Đang đồng bộ...' : '🔄 Đồng bộ tài khoản từ SePay'}
        </button>
        {syncMsg && (
          <span style={{ fontSize: 12.5, color: syncMsg.type === 'ok' ? 'var(--accent)' : 'var(--danger, #dc2626)' }}>
            {syncMsg.text}
          </span>
        )}
      </div>

      <p style={{ color: '#888', fontSize: 13, margin: '20px 0 8px' }}>Thông tin tài khoản nhận tiền (dùng để tạo mã QR VietQR khi khách chọn SePay) — điền tay hoặc dùng nút đồng bộ ở trên:</p>
      <div className="form-group">
        <label>Mã ngân hàng (VietQR)</label>
        <input type="text" value={val('sepay_bank_code')} onChange={e => set('sepay_bank_code', e.target.value)} placeholder="VD: MB, VCB, TCB, ACB" />
      </div>
      <div className="form-group">
        <label>Số tài khoản</label>
        <input type="text" value={val('sepay_account_number')} onChange={e => set('sepay_account_number', e.target.value)} placeholder="0123456789" />
      </div>
      <div className="form-group">
        <label>Tên chủ tài khoản</label>
        <input type="text" value={val('sepay_account_name')} onChange={e => set('sepay_account_name', e.target.value)} placeholder="NGUYEN VAN A" />
      </div>

      <p style={{ color: '#888', fontSize: 13, margin: '20px 0 8px' }}>Vận chuyển:</p>
      <div className="form-row">
        <div className="form-group" style={{ flex: 1 }}>
          <label>Phí vận chuyển (VND)</label>
          <input type="number" value={val('shipping_fee')} onChange={e => set('shipping_fee', e.target.value)} placeholder="30000" />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Miễn phí vận chuyển từ (VND)</label>
          <input type="number" value={val('free_shipping_threshold')} onChange={e => set('free_shipping_threshold', e.target.value)} placeholder="500000" />
        </div>
      </div>
    </>
  )
}
