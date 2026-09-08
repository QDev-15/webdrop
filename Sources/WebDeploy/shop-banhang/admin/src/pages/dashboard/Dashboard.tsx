import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Tooltip, Legend, Filler,
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'
import { api } from '../../api/client'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler)

interface DashboardData {
  stats: { revenue: number; order_count: number; low_stock: number; new_customers: number }
  days: string[]
  revenue_series: number[]
  category_breakdown: { labels: string[]; values: number[] }
  top_products: { product_id: number; name: string; qty: number; revenue: number }[]
  recent_orders: { id: number; code: string; table_no: string; total: number; created_at: string; customer_name: string }[]
  open_shift: { id: number; cashier_name: string; opened_at: string } | null
}

function fmtVND(n: number): string {
  return Math.round(n).toLocaleString('vi-VN') + 'đ'
}

function fmtDateTime(iso: string): string {
  const d = new Date(iso.replace(' ', 'T'))
  if (isNaN(d.getTime())) return iso
  return d.toLocaleString('vi-VN')
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    api.get<DashboardData>('/reports/dashboard').then(setData).catch(() => {})
  }, [])

  const cards = [
    { label: 'Doanh thu hôm nay', value: data ? fmtVND(data.stats.revenue) : '—', icon: '💰', color: '#0f6d82' },
    { label: 'Số đơn hôm nay', value: data?.stats.order_count ?? '—', icon: '🧾', color: '#0f6d82' },
    { label: 'Sản phẩm sắp hết hàng', value: data?.stats.low_stock ?? '—', icon: '⚠', color: '#e24b4a', to: '/products' },
    { label: 'Khách hàng mới hôm nay', value: data?.stats.new_customers ?? '—', icon: '👥', color: '#0f6d82', to: '/customers' },
  ]

  const lineLabels = data?.days.map(d => { const p = d.split('-'); return `${p[2]}/${p[1]}` }) ?? []

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Bảng điều khiển quản lý</div>
          <div className="page-sub">Chào mừng đến hệ thống quản lý POS bán hàng</div>
        </div>
      </div>

      {data?.open_shift ? (
        <div className="card" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <span style={{ color: '#065f46', fontWeight: 600 }}>● Đang mở ca</span>
          — Nhân viên <strong>{data.open_shift.cashier_name}</strong>, mở lúc {fmtDateTime(data.open_shift.opened_at)}
        </div>
      ) : (
        <div className="card" style={{ marginBottom: 16, fontSize: 13, color: 'var(--text-2)' }}>○ Không có ca đang mở</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {cards.map(card => {
          const inner = (
            <div className="stat-card" style={{ cursor: card.to ? 'pointer' : 'default', transition: 'box-shadow .15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,.08)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'}>
              <div className="stat-card-icon">{card.icon}</div>
              <div className="stat-card-value" style={{ color: card.color }}>{card.value}</div>
              <div className="stat-card-label">{card.label}</div>
            </div>
          )
          return card.to
            ? <Link key={card.label} to={card.to} style={{ textDecoration: 'none' }}>{inner}</Link>
            : <div key={card.label}>{inner}</div>
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Doanh thu 7 ngày gần nhất</div>
          {data && (
            <Line
              data={{
                labels: lineLabels,
                datasets: [{ label: 'Doanh thu', data: data.revenue_series, borderColor: '#0f6d82', backgroundColor: 'rgba(15,109,130,0.12)', tension: 0.3, fill: true }],
              }}
              options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { callback: v => Number(v).toLocaleString('vi-VN') } } } }}
            />
          )}
        </div>
        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Doanh thu theo nhóm sản phẩm</div>
          {data && (
            <Doughnut
              data={{
                labels: data.category_breakdown.labels,
                datasets: [{ data: data.category_breakdown.values, backgroundColor: ['#0f6d82', '#eab308', '#a0714d', '#38bdf8', '#94a3b8'] }],
              }}
              options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
            />
          )}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Top 5 sản phẩm bán chạy (7 ngày)</div>
        <div className="table-wrap"><table>
          <thead><tr><th>Sản phẩm</th><th>Số lượng bán</th><th>Doanh thu</th></tr></thead>
          <tbody>
            {!data || data.top_products.length === 0 ? (
              <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-2)' }}>Chưa có dữ liệu</td></tr>
            ) : data.top_products.map(p => (
              <tr key={p.product_id}><td>{p.name}</td><td>{p.qty}</td><td>{fmtVND(p.revenue)}</td></tr>
            ))}
          </tbody>
        </table></div>
      </div>

      <div className="card">
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Hóa đơn gần đây</div>
        <div className="table-wrap"><table>
          <thead><tr><th>Mã hóa đơn</th><th>Số bàn</th><th>Khách hàng</th><th>Thành tiền</th><th>Thời gian</th></tr></thead>
          <tbody>
            {!data || data.recent_orders.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-2)' }}>Chưa có hóa đơn nào</td></tr>
            ) : data.recent_orders.map(o => (
              <tr key={o.id}><td><strong>{o.code}</strong></td><td>{o.table_no || '-'}</td><td>{o.customer_name}</td><td>{fmtVND(o.total)}</td><td>{fmtDateTime(o.created_at)}</td></tr>
            ))}
          </tbody>
        </table></div>
      </div>
    </div>
  )
}
