import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Product {
  id: number
  name: string
  slug: string
  category_name: string
  brand: string
  image: string
  price: number
  price_sale: number
  badge: string
  is_featured: number
  is_new: number
  status: string
  sort_order: number
}

const PER_PAGE = 20

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const firstLoad = useRef(true)

  const load = () => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('per_page', String(PER_PAGE))
    if (search) params.set('q', search)
    api.getPaged<Product[]>(`/products?${params.toString()}`)
      .then(({ data, total }) => { setProducts(data); setTotal(total) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [page, search])

  // Debounce ô tìm kiếm 400ms — reset về trang 1 mỗi lần đổi từ khóa
  useEffect(() => {
    if (firstLoad.current) { firstLoad.current = false; return }
    const t = setTimeout(() => { setSearch(searchInput); setPage(1) }, 400)
    return () => clearTimeout(t)
  }, [searchInput])

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Xóa sản phẩm "${name}"?`)) return
    await api.post(`/products/${id}/delete`, {})
    load()
  }

  const fmt = (n: number) => n ? n.toLocaleString('vi-VN') + 'đ' : '—'
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  const startIdx = total === 0 ? 0 : (page - 1) * PER_PAGE + 1
  const endIdx = Math.min(page * PER_PAGE, total)

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Sản phẩm</h1>
          <p className="admin-page-sub">Quản lý danh sách sản phẩm của cửa hàng</p>
        </div>
        <Link to="/products/new" className="btn btn-primary">+ Thêm sản phẩm</Link>
      </div>

      <div className="form-group" style={{ maxWidth: 340, marginBottom: 16 }}>
        <input
          type="search"
          className="form-control"
          placeholder="Tìm theo tên, mô tả, thương hiệu..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />
      </div>

      {loading ? <div className="admin-loading-box">Đang tải...</div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Thương hiệu</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Giá sale</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: '#aaa' }}>
                  {search ? `Không tìm thấy sản phẩm nào khớp "${search}"` : 'Chưa có sản phẩm nào'}
                </td></tr>
              ) : products.map(p => (
                <tr key={p.id}>
                  <td>
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} />
                    ) : (
                      <div style={{ width: 48, height: 48, background: '#f0ebe3', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⌚</div>
                    )}
                  </td>
                  <td>
                    <strong>{p.name}</strong>
                    <div style={{ fontSize: 11, color: '#aaa' }}>
                      {p.is_featured ? '⭐ Nổi bật ' : ''}{p.is_new ? '🆕 Mới' : ''}
                    </div>
                  </td>
                  <td>{p.brand || '—'}</td>
                  <td>{p.category_name ?? '—'}</td>
                  <td>{fmt(p.price)}</td>
                  <td style={{ color: p.price_sale ? 'var(--accent)' : undefined }}>{fmt(p.price_sale)}</td>
                  <td>
                    <span className={`status-badge ${p.status === 'published' ? 'done' : 'brief'}`}>
                      {p.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/products/${p.id}/edit`} className="btn btn-sm btn-outline">Sửa</Link>
                      <button onClick={() => handleDelete(p.id, p.name)} className="btn btn-sm btn-danger">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {total > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, flexWrap: 'wrap', gap: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--text-3, #888)' }}>Hiển thị {startIdx}–{endIdx} trong số {total} sản phẩm</span>
              {totalPages > 1 && (
                <div className="admin-pagination" style={{ display: 'flex', gap: 6 }}>
                  <button className="admin-page-btn" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button key={n} className={'admin-page-btn' + (n === page ? ' active' : '')} onClick={() => setPage(n)}>{n}</button>
                  ))}
                  <button className="admin-page-btn" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>›</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <style>{`
        .admin-page-btn { min-width: 30px; height: 30px; border: 1px solid var(--border, #e5e5e5); background: #fff; border-radius: 6px; cursor: pointer; font-size: 13px; }
        .admin-page-btn.active { background: var(--accent); color: #fff; border-color: var(--accent); }
        .admin-page-btn:disabled { opacity: .4; cursor: not-allowed; }
      `}</style>
    </div>
  )
}
