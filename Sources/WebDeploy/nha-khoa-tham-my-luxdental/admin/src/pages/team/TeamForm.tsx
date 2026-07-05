import { useEffect, useState, FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface FormData {
  name: string
  role: string
  photo: string
  description: string
  experience_years: string
  credentials: string
  tag: string
  sort_order: string
}

const empty: FormData = {
  name: '', role: '', photo: '', description: '', experience_years: '0', credentials: '', tag: '', sort_order: '0'
}

export default function TeamForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const nav = useNavigate()
  const [form, setForm] = useState<FormData>(empty)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<Record<string, string>>(`/team/${id}`)
      .then(data => setForm({
        name:             data.name             ?? '',
        role:             data.role             ?? '',
        photo:            data.photo            ?? '',
        description:      data.description      ?? '',
        experience_years: String(data.experience_years ?? '0'),
        credentials:      data.credentials      ?? '',
        tag:              data.tag              ?? '',
        sort_order:       String(data.sort_order ?? '0'),
      }))
      .catch(() => setError('Không thể tải dữ liệu.'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (k: keyof FormData, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên bác sĩ không được để trống.'); return }
    setSaving(true); setError('')
    try {
      const payload = { ...form, experience_years: parseInt(form.experience_years), sort_order: parseInt(form.sort_order) }
      if (isEdit) await api.put(`/team/${id}`, payload)
      else        await api.post('/team', payload)
      nav('/team')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi lưu dữ liệu.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => nav('/team')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', fontSize: 13 }}>← Quay lại</button>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>{isEdit ? 'Chỉnh sửa bác sĩ' : 'Thêm bác sĩ'}</h1>
      </div>
      {error && <div style={{ background: '#fee2e2', color: 'var(--danger)', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}

      <form onSubmit={submit} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 24 }}>
        <F label="Tên bác sĩ *" value={form.name} onChange={v => set('name', v)} required placeholder="BS. Nguyễn Văn A" />
        <F label="Chuyên khoa / Vai trò" value={form.role} onChange={v => set('role', v)} placeholder="Thẩm mỹ nha khoa" />
        <F label="Tag / Chức danh" value={form.tag} onChange={v => set('tag', v)} placeholder="Trưởng khoa, Chuyên gia..." />

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>Ảnh bác sĩ</label>
          <ImageField value={form.photo} onChange={v => set('photo', v)} placeholder="URL ảnh bác sĩ" />
        </div>

        <F label="Mô tả ngắn" value={form.description} onChange={v => set('description', v)} textarea placeholder="Giới thiệu ngắn về bác sĩ..." />
        <F label="Bằng cấp / Chứng chỉ (ngăn cách bằng |)" value={form.credentials} onChange={v => set('credentials', v)} textarea placeholder="Thạc sĩ RHM — ĐH Y HN | 3.500+ ca Veneer" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <F label="Số năm kinh nghiệm" value={form.experience_years} onChange={v => set('experience_years', v)} type="number" />
          <F label="Thứ tự hiển thị" value={form.sort_order} onChange={v => set('sort_order', v)} type="number" />
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button type="submit" disabled={saving}
            style={{ padding: '10px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
            {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
          <button type="button" onClick={() => nav('/team')}
            style={{ padding: '10px 20px', background: 'var(--warm)', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
            Hủy
          </button>
        </div>
      </form>
    </div>
  )
}

function F({ label, value, onChange, required, textarea, type, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; textarea?: boolean; type?: string; placeholder?: string
}) {
  const style = { width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 7, fontSize: 13, fontFamily: 'inherit', background: 'var(--bg)' }
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} required={required} placeholder={placeholder} style={{ ...style, resize: 'vertical' }} />
        : <input type={type || 'text'} value={value} onChange={e => onChange(e.target.value)} required={required} placeholder={placeholder} style={style} />
      }
    </div>
  )
}
