import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Product {
  id: number
  name: string
  slug: string
  category_name: string
  collection_name: string
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
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const load = (p: number, q: string) => {
    setLoading(true)
    api.getPaged<Product[]>(`/products?page=${p}&per_page=${PER_PAGE}&q=${encodeURIComponent(q)}`)
      .then(({ data, total }) => { setProducts(data); setTotal(total) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load(page, search) }, [page, search])

  // Debounce ô tìm kiếm 400ms — về trang 1 mỗi khi từ khóa đổi
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => { setSearch(searchInput); setPage(1) }, 400)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [searchInput])

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Xóa sản phẩm "${name}"?`)) return
    await api.post(`/products/${id}/delete`, {})
    if (products.length === 1 && page > 1) setPage(page - 1)
    else load(page, search)
  }

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  const startIdx = total === 0 ? 0 : (page - 1) * PER_PAGE + 1

  const fmt = (n: number) => n ? n.toLocaleString('vi-VN') + 'đ' : '—'

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Sản phẩm</h1>
          <p className="admin-page-sub">Quản lý danh sách sản phẩm của cửa hàng</p>
        </div>
        <Link to="/products/new" className="btn btn-primary">+ Thêm sản phẩm</Link>
      </div>

      <div style={{ marginBottom: 16, maxWidth: 320 }}>
        <input
          type="search"
          className="form-control"
          placeholder="Tìm theo tên sản phẩm..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          aria-label="Tìm kiếm sản phẩm"
        />
      </div>

      {loading ? <div className="admin-loading-box">Đang tải...</div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Bộ sưu tập</th>
                <th>Giá</th>
                <th>Giá sale</th>
                <th>Badge</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', color: '#aaa' }}>{search ? `Không tìm thấy sản phẩm nào khớp "${search}"` : 'Chưa có sản phẩm nào'}</td></tr>
              ) : products.map(p => (
                <tr key={p.id}>
                  <td>
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} />
                    ) : (
                      <div style={{ width: 48, height: 48, background: '#f0ebe3', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛋</div>
                    )}
                  </td>
                  <td>
                    <strong>{p.name}</strong>
                    <div style={{ fontSize: 11, color: '#aaa' }}>
                      {p.is_featured ? '⭐ Nổi bật ' : ''}{p.is_new ? '🆕 Mới' : ''}
                    </div>
                  </td>
                  <td>{p.category_name ?? '—'}</td>
                  <td>{p.collection_name ?? '—'}</td>
                  <td>{fmt(p.price)}</td>
                  <td style={{ color: p.price_sale ? 'var(--accent)' : undefined }}>{fmt(p.price_sale)}</td>
                  <td>{p.badge || '—'}</td>
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
        </div>
      )}

      {!loading && totalPages > 1 && (
        <>
          <nav className="admin-pagination" aria-label="Phân trang sản phẩm">
            <button className="admin-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)} aria-label="Trang trước">‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                className={`admin-page-btn${n === page ? ' active' : ''}`}
                onClick={() => setPage(n)}
                aria-current={n === page ? 'page' : undefined}
              >
                {n}
              </button>
            ))}
            <button className="admin-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} aria-label="Trang sau">›</button>
          </nav>
          <div className="admin-pagination-info">Hiển thị {startIdx}–{Math.min(page * PER_PAGE, total)} trong số {total} sản phẩm</div>
        </>
      )}
    </div>
  )
}
