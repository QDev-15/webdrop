import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Variant { sku: string; size: string; color: string; stock: number }
interface Product { id: number; name: string; cost_price: number; has_variants: boolean; variants: Variant[] }
interface Supplier { id: number; name: string }
interface ImportLine { product_id: number; variant_sku: string; quantity: number; unit_cost: number }
interface ImportHistoryItem { product_name: string; quantity: number; unit_cost: number }
interface ImportRecord { id: number; supplier: string; import_date: string; total_cost: number; items: ImportHistoryItem[] }

function fmtVND(n: number): string { return Math.round(n).toLocaleString('vi-VN') + 'đ' }

export default function StockImportPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [history, setHistory] = useState<ImportRecord[]>([])
  const [supplierValue, setSupplierValue] = useState('')
  const [newSupplier, setNewSupplier] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [lines, setLines] = useState<ImportLine[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const [ps, sups, hist] = await Promise.all([
        api.get<Product[]>('/pos/products'), api.get<Supplier[]>('/suppliers'), api.get<ImportRecord[]>('/stock-imports'),
      ])
      setProducts(ps); setSuppliers(sups); setHistory(hist)
      if (sups.length && !supplierValue) setSupplierValue(sups[0].name)
      if (ps.length && lines.length === 0) addLine(ps)
    } finally { setLoading(false) }
  }

  function addLine(list = products) {
    const first = list[0]
    setLines(ls => [...ls, {
      product_id: first?.id ?? 0, variant_sku: '', quantity: 1, unit_cost: first?.cost_price ?? 0,
    }])
  }

  function updateLine(idx: number, patch: Partial<ImportLine>) {
    setLines(ls => ls.map((l, i) => {
      if (i !== idx) return l
      const next = { ...l, ...patch }
      if (patch.product_id !== undefined) {
        const prod = products.find(p => p.id === patch.product_id)
        next.variant_sku = ''
        next.unit_cost = prod?.cost_price ?? 0
      }
      return next
    }))
  }

  function removeLine(idx: number) { setLines(ls => ls.filter((_, i) => i !== idx)) }

  async function handleAddSupplier() {
    const name = newSupplier.trim()
    if (!name) return
    const updated = await api.post<Supplier[]>('/suppliers', { name })
    setSuppliers(updated)
    setSupplierValue(name)
    setNewSupplier('')
  }

  async function handleConfirm() {
    setError(''); setSuccess('')
    try {
      await api.post('/stock-imports', {
        supplier: supplierValue, date,
        lines: lines.map(l => ({ product_id: l.product_id, variant_sku: l.variant_sku || null, quantity: l.quantity, unit_cost: l.unit_cost })),
      })
      setSuccess('Nhập kho thành công! Tồn kho đã được cập nhật.')
      setLines([])
      addLine()
      const hist = await api.get<ImportRecord[]>('/stock-imports')
      setHistory(hist)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Nhập kho thất bại.')
    }
  }

  const importTotal = lines.reduce((s, l) => s + l.quantity * l.unit_cost, 0)

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header"><div><div className="page-title">Nhập kho</div></div></div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Tạo phiếu nhập</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="si-supplier">Nhà cung cấp</label>
            <select id="si-supplier" className="form-control" value={supplierValue} onChange={e => setSupplierValue(e.target.value)}>
              {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="si-new-supplier">Hoặc thêm nhà cung cấp mới</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input id="si-new-supplier" className="form-control" value={newSupplier} onChange={e => setNewSupplier(e.target.value)} placeholder="Tên nhà cung cấp mới" />
              <button type="button" className="btn-ghost btn-sm" onClick={handleAddSupplier}>+ Thêm</button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="si-date">Ngày nhập</label>
            <input id="si-date" type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead><tr><th>Sản phẩm</th><th>Biến thể</th><th>Số lượng</th><th>Đơn giá nhập</th><th>Thành tiền</th><th></th></tr></thead>
            <tbody>
              {lines.map((l, idx) => {
                const prod = products.find(p => p.id === l.product_id)
                return (
                  <tr key={idx}>
                    <td>
                      <select className="form-control" value={l.product_id} onChange={e => updateLine(idx, { product_id: Number(e.target.value) })}>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </td>
                    <td>
                      {prod?.has_variants ? (
                        <select className="form-control" value={l.variant_sku} onChange={e => updateLine(idx, { variant_sku: e.target.value })}>
                          <option value="">-- chọn --</option>
                          {prod.variants.map(v => <option key={v.sku} value={v.sku}>{v.size}/{v.color} (tồn {v.stock})</option>)}
                        </select>
                      ) : <span style={{ color: 'var(--text-3)' }}>—</span>}
                    </td>
                    <td><input type="number" className="form-control" min={1} value={l.quantity} onChange={e => updateLine(idx, { quantity: Number(e.target.value) || 1 })} style={{ width: 90 }} /></td>
                    <td><input type="number" className="form-control" min={0} value={l.unit_cost} onChange={e => updateLine(idx, { unit_cost: Number(e.target.value) || 0 })} style={{ width: 120 }} /></td>
                    <td>{fmtVND(l.quantity * l.unit_cost)}</td>
                    <td><button type="button" className="btn-ghost btn-sm" onClick={() => removeLine(idx)}>✕</button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <button type="button" className="btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => addLine()}>+ Thêm dòng sản phẩm</button>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: 16, margin: '16px 0' }}>
          <span>Tổng tiền nhập:</span><span>{fmtVND(importTotal)}</span>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <button className="btn-accent" onClick={handleConfirm} disabled={lines.length === 0}>Xác nhận nhập kho</button>
      </div>

      <div className="card">
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Lịch sử phiếu nhập</div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Ngày</th><th>Nhà cung cấp</th><th>Số mặt hàng</th><th>Tổng tiền</th></tr></thead>
            <tbody>
              {history.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-2)' }}>Chưa có phiếu nhập nào</td></tr>
              ) : history.map(h => (
                <tr key={h.id}><td>{new Date(h.import_date).toLocaleDateString('vi-VN')}</td><td>{h.supplier}</td><td>{h.items.length}</td><td>{fmtVND(h.total_cost)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
