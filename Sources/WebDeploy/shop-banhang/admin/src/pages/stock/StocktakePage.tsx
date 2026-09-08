import { useEffect, useMemo, useState } from 'react'
import { api } from '../../api/client'
import { useAuth } from '../../contexts/AuthContext'

interface Row { product_id: number; variant_sku: string | null; label: string; system_stock: number }
interface HistoryItem { id: number; stocktake_date: string; checked_by: string; discrepancies: number }

function rowKey(r: Row): string { return r.variant_sku ? `${r.product_id}::${r.variant_sku}` : String(r.product_id) }

export default function StocktakePage() {
  const { user } = useAuth()
  const [rows, setRows] = useState<Row[]>([])
  const [counted, setCounted] = useState<Record<string, string>>({})
  const [onlyDiff, setOnlyDiff] = useState(false)
  const [checkedBy, setCheckedBy] = useState('')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const [rs, hist] = await Promise.all([api.get<Row[]>('/stocktake/rows'), api.get<HistoryItem[]>('/stocktake/history')])
      setRows(rs); setHistory(hist)
      const initial: Record<string, string> = {}
      rs.forEach(r => { initial[rowKey(r)] = String(r.system_stock) })
      setCounted(initial)
    } finally { setLoading(false) }
  }

  const visibleRows = useMemo(() => {
    if (!onlyDiff) return rows
    return rows.filter(r => {
      const c = Number(counted[rowKey(r)]);
      return !isNaN(c) && c !== r.system_stock
    })
  }, [rows, onlyDiff, counted])

  async function handleConfirm() {
    setError(''); setSuccess('')
    try {
      const payload = rows.map(r => ({ product_id: r.product_id, variant_sku: r.variant_sku, counted: Number(counted[rowKey(r)]) }))
      const res = await api.post<{ discrepancies: number }>('/stocktake', { checked_by: checkedBy.trim() || user?.name, counted: payload })
      setSuccess(`Kiểm kê thành công! ${res.discrepancies} sản phẩm có chênh lệch, tồn kho đã được cập nhật.`)
      load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Kiểm kê thất bại.')
    }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Kiểm kê tồn kho</div>
          <div className="page-sub">So sánh tồn kho hệ thống với số lượng thực tế đếm được, sau đó xác nhận để cập nhật lại tồn kho.</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
          <input type="checkbox" checked={onlyDiff} onChange={e => setOnlyDiff(e.target.checked)} /> Chỉ hiện sản phẩm có chênh lệch
        </label>
        <input className="form-control" aria-label="Tên người kiểm kê" style={{ maxWidth: 220 }} placeholder="Tên người kiểm kê" value={checkedBy} onChange={e => setCheckedBy(e.target.value)} />
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Sản phẩm</th><th>Tồn kho hệ thống</th><th>Tồn kho thực tế</th><th>Chênh lệch</th></tr></thead>
            <tbody>
              {visibleRows.map(r => {
                const key = rowKey(r)
                const val = counted[key] ?? ''
                const diff = (Number(val) || 0) - r.system_stock
                return (
                  <tr key={key}>
                    <td>{r.label}</td>
                    <td>{r.system_stock}</td>
                    <td><input type="number" className="form-control" min={0} value={val} onChange={e => setCounted(c => ({ ...c, [key]: e.target.value }))} style={{ width: 100 }} /></td>
                    <td style={{ fontWeight: 600, color: diff === 0 ? 'var(--text-3)' : diff > 0 ? 'var(--accent)' : 'var(--danger)' }}>
                      {diff === 0 ? '0' : diff > 0 ? `+${diff}` : diff}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {error && <div className="alert alert-error" style={{ marginTop: 16 }}>{error}</div>}
        {success && <div className="alert alert-success" style={{ marginTop: 16 }}>{success}</div>}
        <button className="btn-accent" style={{ marginTop: 16 }} onClick={handleConfirm}>Xác nhận kiểm kê</button>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Lịch sử kiểm kê</div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Ngày</th><th>Người kiểm</th><th>Số SP lệch</th></tr></thead>
            <tbody>
              {history.length === 0 ? (
                <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-2)' }}>Chưa có lịch sử kiểm kê</td></tr>
              ) : history.map(h => (
                <tr key={h.id}><td>{new Date(h.stocktake_date).toLocaleDateString('vi-VN')}</td><td>{h.checked_by}</td><td>{h.discrepancies}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
