import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Pkg { tier: string; label: string; price: number; duration_days: number; benefits: string[]; sort_order: number }

export default function ListingPackageList() {
  const [items, setItems] = useState<Pkg[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState<Pkg | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Pkg[]>('/listing-packages')) }
    finally { setLoading(false) }
  }

  function startEdit(pkg: Pkg) {
    setEditing(pkg.tier)
    setDraft({ ...pkg, benefits: [...pkg.benefits] })
  }

  async function save() {
    if (!draft) return
    setSaving(true)
    try {
      await api.put(`/listing-packages/${draft.tier}`, draft)
      setEditing(null); setDraft(null)
      load()
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Gói tin VIP</div>
          <div className="page-sub">4 gói tin cố định — chỉnh giá / thời hạn / quyền lợi hiển thị ở trang Đăng tin</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {items.map(pkg => (
          <div key={pkg.tier} className="card">
            {editing === pkg.tier && draft ? (
              <>
                <div className="form-group">
                  <label className="form-label">Tên gói</label>
                  <input type="text" className="form-control" value={draft.label} onChange={e => setDraft({ ...draft, label: e.target.value })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Giá (đ)</label>
                    <input type="number" className="form-control" value={draft.price} onChange={e => setDraft({ ...draft, price: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Thời hạn (ngày)</label>
                    <input type="number" className="form-control" value={draft.duration_days} onChange={e => setDraft({ ...draft, duration_days: parseInt(e.target.value) || 1 })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Quyền lợi (mỗi dòng 1 quyền lợi)</label>
                  <textarea className="form-control" rows={4} value={draft.benefits.join('\n')}
                    onChange={e => setDraft({ ...draft, benefits: e.target.value.split('\n') })} />
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button className="btn-ghost btn-sm" onClick={() => { setEditing(null); setDraft(null) }}>Hủy</button>
                  <button className="btn-accent btn-sm" onClick={save} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{pkg.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>
                  {pkg.price === 0 ? 'Miễn phí' : pkg.price.toLocaleString('vi-VN') + 'đ'}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text-3)', marginBottom: 12 }}>Hiển thị {pkg.duration_days} ngày</div>
                <ul style={{ fontSize: 13, color: 'var(--text-2)', paddingLeft: 18, marginBottom: 14 }}>
                  {pkg.benefits.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
                <button className="btn-ghost btn-sm" onClick={() => startEdit(pkg)}>Chỉnh sửa</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
