import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Variant { sku: string; size: string; color: string; stock: number; price: number }
interface Product {
  id: number; name: string; category_id: number | null; price: number; cost_price: number;
  unit: string; barcode: string | null; stock: number; min_stock: number; has_variants: boolean;
  image: string; variants: Variant[]
}
interface Category { id: number; name: string }

const emptyForm = {
  name: '', category_id: 0, price: '', cost_price: '', unit: '', barcode: '',
  stock: '', min_stock: '', has_variants: false, image: '',
}

function fmtVND(n: number): string { return Math.round(n).toLocaleString('vi-VN') + 'đ' }
function totalStock(p: Product): number {
  return p.has_variants ? p.variants.reduce((s, v) => s + (Number(v.stock) || 0), 0) : p.stock
}
function isLowStock(p: Product): boolean { return totalStock(p) <= p.min_stock }
function minPrice(p: Product): number {
  return p.has_variants && p.variants.length ? Math.min(...p.variants.map(v => v.price)) : p.price
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [variants, setVariants] = useState<Variant[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const [ps, cats] = await Promise.all([api.get<Product[]>('/products'), api.get<Category[]>('/categories')])
      setProducts(ps); setCategories(cats)
      if (!form.category_id && cats.length) setForm(f => ({ ...f, category_id: cats[0].id }))
    } finally { setLoading(false) }
  }

  function set<K extends keyof typeof emptyForm>(k: K, v: typeof emptyForm[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  function addVariantRow() {
    setVariants(v => [...v, { sku: '', size: '', color: '', stock: 0, price: Number(form.price) || 0 }])
  }
  function updateVariant(idx: number, patch: Partial<Variant>) {
    setVariants(v => v.map((row, i) => i === idx ? { ...row, ...patch } : row))
  }
  function removeVariant(idx: number) {
    setVariants(v => v.filter((_, i) => i !== idx))
  }

  function resetForm() {
    setEditingId(null)
    setForm({ ...emptyForm, category_id: categories[0]?.id ?? 0 })
    setVariants([])
    setSearch('')
    setError('')
  }

  function editProduct(p: Product) {
    setEditingId(p.id)
    setForm({
      name: p.name, category_id: p.category_id ?? 0, price: String(p.price), cost_price: String(p.cost_price),
      unit: p.unit, barcode: p.barcode ?? '', stock: String(p.stock), min_stock: String(p.min_stock),
      has_variants: p.has_variants, image: p.image,
    })
    setVariants(p.variants.map(v => ({ ...v })))
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setSuccess('')

    const payload = {
      name: form.name.trim(), category_id: Number(form.category_id) || null,
      price: Number(form.price), cost_price: Number(form.cost_price), unit: form.unit.trim(),
      barcode: form.barcode.trim(), stock: Number(form.stock) || 0, min_stock: Number(form.min_stock) || 0,
      has_variants: form.has_variants, image: form.image,
      variants: form.has_variants ? variants.filter(v => v.size || v.color) : [],
    }

    try {
      if (editingId) await api.put(`/products/${editingId}`, payload)
      else await api.post('/products', payload)
      setSuccess('Lưu sản phẩm thành công')
      resetForm()
      load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Bạn chắc chắn muốn xóa sản phẩm này?')) return
    try {
      await api.delete(`/products/${id}`)
      setSuccess('Xóa sản phẩm thành công')
      if (editingId === id) resetForm()
      load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Xóa thất bại.')
    }
  }

  const filtered = products.filter(p => {
    const q = search.toLowerCase().trim()
    if (!q) return true
    return p.name.toLowerCase().includes(q) || (p.barcode ?? '').includes(q) ||
      (p.has_variants && p.variants.some(v => v.sku.toLowerCase().includes(q)))
  })

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Quản lý menu</div>
          <div className="page-sub">{products.length} sản phẩm</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>{editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="pf-name">Tên sản phẩm</label>
              <input id="pf-name" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nhập tên sản phẩm" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="pf-category">Nhóm</label>
              <select id="pf-category" className="form-control" value={form.category_id} onChange={e => set('category_id', Number(e.target.value))} required>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="pf-price">Giá bán (đ)</label>
              <input id="pf-price" type="number" className="form-control" value={form.price} onChange={e => set('price', e.target.value)} min={0} placeholder="Nhập giá bán" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="pf-cost">Giá vốn (đ)</label>
              <input id="pf-cost" type="number" className="form-control" value={form.cost_price} onChange={e => set('cost_price', e.target.value)} min={0} placeholder="Nhập giá vốn" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="pf-unit">Đơn vị</label>
              <input id="pf-unit" className="form-control" value={form.unit} onChange={e => set('unit', e.target.value)} placeholder="VD: suất, ly, cái" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="pf-barcode">Mã vạch</label>
              <input id="pf-barcode" className="form-control" value={form.barcode} onChange={e => set('barcode', e.target.value)} placeholder="VD: 8938501234501" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="pf-stock">Tồn kho</label>
              <input id="pf-stock" type="number" className="form-control" value={form.stock} onChange={e => set('stock', e.target.value)} min={0} disabled={form.has_variants} placeholder="Số lượng tồn kho" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="pf-min-stock">Tồn kho tối thiểu</label>
              <input id="pf-min-stock" type="number" className="form-control" value={form.min_stock} onChange={e => set('min_stock', e.target.value)} min={0} placeholder="Ngưỡng cảnh báo" />
            </div>
          </div>

          <div className="form-group">
            <ImageField label="Ảnh sản phẩm" value={form.image} onChange={v => set('image', v)} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0' }}>
            <label className="form-check" htmlFor="pf-has-variants">
              <input id="pf-has-variants" type="checkbox" checked={form.has_variants} onChange={e => {
                set('has_variants', e.target.checked)
                if (e.target.checked && variants.length === 0) addVariantRow()
              }} />
            </label>
            <label htmlFor="pf-has-variants" style={{ margin: 0, cursor: 'pointer', fontSize: 13 }}>Có biến thể (size / màu)</label>
          </div>

          {form.has_variants && (
            <div style={{ border: '1px dashed var(--border)', borderRadius: 8, padding: 16, marginBottom: 12, background: 'var(--bg)' }}>
              {variants.map((v, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  <input className="form-control" placeholder="Size (S/M/L)" value={v.size} onChange={e => updateVariant(idx, { size: e.target.value })} />
                  <input className="form-control" placeholder="Màu/Loại" value={v.color} onChange={e => updateVariant(idx, { color: e.target.value })} />
                  <input className="form-control" placeholder="SKU" value={v.sku} onChange={e => updateVariant(idx, { sku: e.target.value })} />
                  <input type="number" className="form-control" placeholder="Tồn kho" min={0} value={v.stock} onChange={e => updateVariant(idx, { stock: Number(e.target.value) || 0 })} />
                  <input type="number" className="form-control" placeholder="Giá" min={0} value={v.price} onChange={e => updateVariant(idx, { price: Number(e.target.value) || 0 })} />
                  <button type="button" className="btn-ghost btn-sm" onClick={() => removeVariant(idx)}>✕</button>
                </div>
              ))}
              <button type="button" className="btn-ghost btn-sm" onClick={addVariantRow}>+ Thêm biến thể</button>
            </div>
          )}

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn-accent">Lưu</button>
            <button type="button" className="btn-ghost" onClick={resetForm}>Hủy</button>
          </div>
        </form>
      </div>

      <div className="form-group">
        <input className="form-control" placeholder="Tìm sản phẩm theo tên/SKU..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>Tên</th><th>Nhóm</th><th>Giá bán</th><th>Tồn kho</th><th>Biến thể</th><th>Hành động</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-2)' }}>Không tìm thấy sản phẩm nào</td></tr>
            ) : filtered.map(p => {
              const cat = categories.find(c => c.id === p.category_id)
              const low = isLowStock(p)
              return (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{cat?.name ?? 'N/A'}</td>
                  <td>{p.has_variants ? 'Từ ' + fmtVND(minPrice(p)) : fmtVND(p.price)}</td>
                  <td>{totalStock(p)}{low && <span className="badge badge-cancelled" style={{ marginLeft: 6 }}>⚠ Thấp</span>}</td>
                  <td>{p.has_variants ? `${p.variants.length} biến thể` : '—'}</td>
                  <td>
                    <button className="btn-ghost btn-sm" onClick={() => editProduct(p)}>Sửa</button>
                    <button className="btn-ghost btn-sm" onClick={() => handleDelete(p.id)}>Xóa</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
