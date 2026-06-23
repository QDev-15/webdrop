import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Category {
  id: number
  name: string
}

interface ItemForm {
  category_id: number | ''
  name: string
  description: string
  price: string
  price_sale: string
  image: string
  badge: string
  allergens: string
  featured: number
  sort_order: number
  status: string
}

const emptyForm: ItemForm = {
  category_id: '', name: '', description: '', price: '', price_sale: '',
  image: '', badge: '', allergens: '', featured: 0, sort_order: 0, status: 'published',
}

export default function MenuItemForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<ItemForm>(emptyForm)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    const loadCats = api.get<Category[]>('/menu-categories')
    const loadItem = id ? api.get<Record<string, unknown>>(`/menu-items/${id}`) : Promise.resolve(null)
    Promise.all([loadCats, loadItem])
      .then(([cats, item]) => {
        setCategories(cats)
        if (item) {
          setForm({
            category_id: (item.category_id as number) ?? '',
            name: (item.name as string) ?? '',
            description: (item.description as string) ?? '',
            price: item.price != null ? String(item.price) : '',
            price_sale: item.price_sale != null ? String(item.price_sale) : '',
            image: (item.image as string) ?? '',
            badge: (item.badge as string) ?? '',
            allergens: (item.allergens as string) ?? '',
            featured: (item.featured as number) ?? 0,
            sort_order: (item.sort_order as number) ?? 0,
            status: (item.status as string) ?? 'published',
          })
        }
      })
      .catch(() => setError('Khong tai duoc du lieu.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof ItemForm>(k: K, v: ItemForm[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Ten mon an la bat buoc.'); return }
    setError(''); setSaving(true)
    const payload = {
      ...form,
      category_id: form.category_id === '' ? null : form.category_id,
      price: form.price !== '' ? parseFloat(form.price) : null,
      price_sale: form.price_sale !== '' ? parseFloat(form.price_sale) : null,
    }
    try {
      if (isEdit) { await api.put(`/menu-items/${id}`, payload) }
      else { await api.post('/menu-items', payload) }
      navigate('/menu-items')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Luu that bai.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Dang tai...</div>

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chinh sua mon an' : 'Them mon an moi'}</div>
        </div>
        <button onClick={() => navigate('/menu-items')} className="btn-ghost">Quay lai</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Ten mon an *</label>
            <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ten mon an" required />
          </div>
          <div className="form-group">
            <label className="form-label">Danh muc</label>
            <select className="form-control" value={String(form.category_id)} onChange={e => set('category_id', e.target.value === '' ? '' : parseInt(e.target.value))}>
              <option value="">-- Chon danh muc --</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Trang thai</label>
            <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="published">Hien thi</option>
              <option value="draft">An</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Gia (VND)</label>
            <input type="number" className="form-control" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0 = mien phi, bo trong = --" min={0} />
          </div>
          <div className="form-group">
            <label className="form-label">Gia khuyen mai (VND)</label>
            <input type="number" className="form-control" value={form.price_sale} onChange={e => set('price_sale', e.target.value)} placeholder="De trong neu khong co" min={0} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Mo ta mon an</label>
            <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mo ta nguyen lieu, cach che bien..." rows={3} />
          </div>
          <div className="form-group">
            <label className="form-label">Badge (vd: Chef Signature, Premium)</label>
            <input type="text" className="form-control" value={form.badge} onChange={e => set('badge', e.target.value)} placeholder="De trong neu khong can" />
          </div>
          <div className="form-group">
            <label className="form-label">Di ung thuc pham</label>
            <input type="text" className="form-control" value={form.allergens} onChange={e => set('allergens', e.target.value)} placeholder="Vd: Di ung: hai san, sua" />
          </div>
          <div className="form-group">
            <label className="form-label">Thu tu hien thi</label>
            <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 24 }}>
            <input type="checkbox" id="featured" checked={form.featured === 1} onChange={e => set('featured', e.target.checked ? 1 : 0)} style={{ width: 16, height: 16 }} />
            <label htmlFor="featured" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>Hien thi noi bat</label>
          </div>
        </div>
        <div className="form-group">
          <ImageField label="Anh mon an" value={form.image} onChange={v => set('image', v)} />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/menu-items')} className="btn-ghost">Huy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Dang luu...' : (isEdit ? 'Cap nhat' : 'Them moi')}</button>
        </div>
      </form>
    </div>
  )
}
