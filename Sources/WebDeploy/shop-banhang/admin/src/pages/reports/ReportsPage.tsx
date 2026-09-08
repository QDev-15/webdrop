import { useEffect, useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { api } from '../../api/client'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

interface Category { id: number; name: string }
interface Staff { id: number; name: string; email: string }
interface ReportRow { date: string; order_count: number; qty: number; revenue: number; profit: number }
interface TopProduct { product_id: number; name: string; qty: number; revenue: number }
interface StaffReportRow { user_id: number; name: string; order_count: number; revenue: number }
interface PeriodReport {
  total_orders: number; total_revenue?: number; total_profit?: number; avg_revenue?: number;
  rows?: ReportRow[]; top_products?: TopProduct[]; staff_report?: StaffReportRow[]
}

function fmtVND(n: number): string { return Math.round(n).toLocaleString('vi-VN') + 'đ' }
function todayISO(): string { return new Date().toISOString().slice(0, 10) }
function firstDayOfMonthISO(): string {
  const d = new Date(); d.setDate(1)
  return d.toISOString().slice(0, 10)
}

export default function ReportsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [from, setFrom] = useState(firstDayOfMonthISO())
  const [to, setTo] = useState(todayISO())
  const [categoryId, setCategoryId] = useState('')
  const [staffId, setStaffId] = useState('')
  const [report, setReport] = useState<PeriodReport | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.get<Category[]>('/categories'), api.get<Staff[]>('/users')])
      .then(([cats, users]) => { setCategories(cats); setStaff(users) })
  }, [])

  async function generateReport() {
    setError('')
    if (!from || !to) { setError('Vui lòng chọn khoảng thời gian.'); return }
    if (from > to) { setError('"Từ ngày" phải trước hoặc bằng "Đến ngày".'); return }
    try {
      const qs = new URLSearchParams({ from, to })
      if (categoryId) qs.set('category_id', categoryId)
      if (staffId) qs.set('staff_id', staffId)
      const res = await api.get<PeriodReport>(`/reports/period?${qs.toString()}`)
      setReport(res)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Không lấy được báo cáo.')
    }
  }

  function resetFilter() {
    setFrom(firstDayOfMonthISO()); setTo(todayISO()); setCategoryId(''); setStaffId(''); setReport(null); setError('')
  }

  const hasData = report && report.total_orders > 0

  return (
    <div>
      <div className="page-header"><div><div className="page-title">Thống kê doanh thu</div></div></div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Bộ lọc báo cáo</div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ minWidth: 160 }}>
            <label className="form-label" htmlFor="rp-from">Từ ngày</label>
            <input id="rp-from" type="date" className="form-control" value={from} onChange={e => setFrom(e.target.value)} />
          </div>
          <div className="form-group" style={{ minWidth: 160 }}>
            <label className="form-label" htmlFor="rp-to">Đến ngày</label>
            <input id="rp-to" type="date" className="form-control" value={to} onChange={e => setTo(e.target.value)} />
          </div>
          <div className="form-group" style={{ minWidth: 160 }}>
            <label className="form-label" htmlFor="rp-category">Nhóm (tuỳ chọn)</label>
            <select id="rp-category" className="form-control" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
              <option value="">Tất cả</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ minWidth: 160 }}>
            <label className="form-label" htmlFor="rp-staff">Nhân viên (tuỳ chọn)</label>
            <select id="rp-staff" className="form-control" value={staffId} onChange={e => setStaffId(e.target.value)}>
              <option value="">Tất cả</option>
              {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <button className="btn-accent" onClick={generateReport}>Xem báo cáo</button>
            <button className="btn-ghost" style={{ marginLeft: 8 }} onClick={resetFilter}>Đặt lại</button>
          </div>
        </div>
        {error && <div className="alert alert-error" style={{ marginTop: 16 }}>{error}</div>}
      </div>

      {report && !hasData && (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-2)' }}>Không có dữ liệu trong khoảng thời gian này</div>
      )}
      {!report && (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-2)' }}>Vui lòng chọn khoảng thời gian để xem báo cáo</div>
      )}

      {hasData && report && (
        <>
          <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Tóm tắt</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
              {[
                ['Số hóa đơn', String(report.total_orders)],
                ['Tổng doanh thu', fmtVND(report.total_revenue ?? 0)],
                ['Tổng lợi nhuận', fmtVND(report.total_profit ?? 0)],
                ['Doanh thu TB/đơn', fmtVND(report.avg_revenue ?? 0)],
              ].map(([label, value]) => (
                <div key={label} style={{ padding: 16, background: 'var(--bg)', borderRadius: 8 }}>
                  <div style={{ color: 'var(--text-2)', fontSize: 13 }}>{label}</div>
                  <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--accent)' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Doanh thu theo ngày</div>
            <Bar
              data={{
                labels: (report.rows ?? []).map(r => { const p = r.date.split('-'); return `${p[2]}/${p[1]}` }),
                datasets: [{ label: 'Doanh thu', data: (report.rows ?? []).map(r => r.revenue), backgroundColor: '#0f6d82' }],
              }}
              options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }}
            />
          </div>

          <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Chi tiết theo ngày</div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Ngày</th><th>Số hóa đơn</th><th>Số lượng</th><th>Doanh thu</th><th>Lợi nhuận</th></tr></thead>
                <tbody>
                  {(report.rows ?? []).map(r => (
                    <tr key={r.date}><td>{new Date(r.date).toLocaleDateString('vi-VN')}</td><td>{r.order_count}</td><td>{r.qty}</td><td>{fmtVND(r.revenue)}</td><td>{fmtVND(r.profit)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Top sản phẩm bán chạy trong kỳ</div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Sản phẩm</th><th>Số lượng bán</th><th>Doanh thu</th></tr></thead>
                <tbody>
                  {(report.top_products ?? []).map(p => (
                    <tr key={p.product_id}><td>{p.name}</td><td>{p.qty}</td><td>{fmtVND(p.revenue)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Báo cáo theo nhân viên</div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Nhân viên</th><th>Số hóa đơn</th><th>Doanh thu</th></tr></thead>
                <tbody>
                  {(report.staff_report ?? []).map(s => (
                    <tr key={s.user_id}><td>{s.name}</td><td>{s.order_count}</td><td>{fmtVND(s.revenue)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <button className="btn-accent" onClick={() => window.print()}>🖨️ In báo cáo</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
