import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Category {
  id: number
  name: string
  slug: string
  description: string
  image: string
  sort_order: number
  status: string
  item_count?: number
}

interface CatForm {
  name: string
  description: string
  image: string
  sort_order: number
  status: string
}

const DEFAULT_FORM: CatForm = { name: '', description: '', image: '', sort_order: 0, status: 'published' }

export default function MenuCategoryList() {
  const [items, setItems] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Category | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<CatForm>(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Category[]>('/menu-categories')) }
    finally { setLoading(false) }
  }

  function openAdd() { setEditing(null); setForm(DEFAULT_FORM); setShowForm(true) }
  function openEdit(cat: Category) {
    setEditing(cat)
    setForm({ name: cat.name, description: cat.description, image: cat.image, sort_order: cat.sort_order, status: cat.status })
    setShowForm(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await api.put(`/menu-categories/${editing.id}`, form)
      } else {
        await api.post('/menu-categories', form)
      }
      setShowForm(false)
      load()
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa danh mục này? Các món ăn trong danh mục sẽ không bị xóa.')) return
    await api.delete(`/menu-categories/${id}`)
    load()
  }

  if (loading) return <div style={{ padding: 32, color: 'var(--text-3)' }}>Đang tải...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Danh mục thực đơn</h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>{items.length} danh mục</p>
        </div>
        <button onClick={openAdd} className="btn-accent">+ Thêm danh mục</button>
      </div>

      {showForm && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{editing ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h3>
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gap: 14 }}>
              <div>
                <label className="form-label">Tên danh mục *</label>
                <input className="form-control" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div>
                <label className="form-label">Mô tả</label>
                <textarea className="form-control" rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <ImageField label="Ảnh đại diện" value={form.image} onChange={v => setForm(p => ({ ...p, image: v }))} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="form-label">Thứ tự</label>
                  <input type="number" className="form-control" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} />
                </div>
                <div>
                  <label className="form-label">Trạng thái</label>
                  <select className="form-control" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                    <option value="published">Hiển thị</option>
                    <option value="draft">Ẩn</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontSize: 14, color: 'var(--text-2)' }}>Hủy</button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {items.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)', fontSize: 14 }}>Chưa có danh mục nào</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Danh mục', 'Số món', 'Trạng thái', 'Thứ tự', ''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {item.image && <img src={item.image} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />}
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{item.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-2)' }}>{item.item_count ?? 0} món</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: item.status === 'published' ? 'var(--accent-light)' : 'var(--warm)', color: item.status === 'published' ? 'var(--accent)' : 'var(--text-3)', fontWeight: 500 }}>
                      {item.status === 'published' ? 'Hiển thị' : 'Ẩn'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-3)' }}>{item.sort_order}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => openEdit(item)} style={{ fontSize: 12, padding: '5px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--text-2)' }}>Sửa</button>
                      <button onClick={() => handleDelete(item.id)} style={{ fontSize: 12, padding: '5px 12px', borderRadius: 6, border: '1px solid #fdd', background: '#fff0f0', color: 'var(--danger)', cursor: 'pointer' }}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
