'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Milestone {
  id: number; title: string; description: string | null
  status: string; dueAt: string | null; completedAt: string | null
}
interface Note {
  id: number; content: string; createdAt: string; author: string
}

const PROJECT_STATUSES = [
  { value: 'planning',   label: 'Lên kế hoạch', color: '#6b7280' },
  { value: 'designing',  label: 'Thiết kế',      color: '#9333ea' },
  { value: 'developing', label: 'Phát triển',    color: '#d97706' },
  { value: 'reviewing',  label: 'Review',         color: '#ea580c' },
  { value: 'delivered',  label: 'Đã bàn giao',   color: '#0369a1' },
  { value: 'done',       label: 'Hoàn thành',    color: 'var(--accent)' },
]

export default function ProjectDetailClient({
  projectId, currentStatus, milestones: initialMilestones, notes: initialNotes,
}: {
  projectId: number; currentStatus: string
  milestones: Milestone[]; notes: Note[]
}) {
  const router = useRouter()
  const [milestones, setMilestones] = useState(initialMilestones)
  const [notes, setNotes] = useState(initialNotes)
  const [status, setStatus] = useState(currentStatus)
  const [savingStatus, setSavingStatus] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [togglingId, setTogglingId] = useState<number | null>(null)
  const [newNote, setNewNote] = useState('')
  const [addingNote, setAddingNote] = useState(false)

  async function handleStatusSave() {
    setSavingStatus(true)
    setSaveError('')
    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) { setSaveError('Lỗi lưu trạng thái'); return }
      router.refresh()
    } catch { setSaveError('Lỗi kết nối') }
    finally { setSavingStatus(false) }
  }

  async function toggleMilestone(m: Milestone) {
    setTogglingId(m.id)
    const next = m.status === 'done' ? 'pending' : 'done'
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/milestones/${m.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      if (res.ok) {
        const updated = await res.json()
        setMilestones(ms => ms.map(x => x.id === m.id ? { ...x, status: updated.status, completedAt: updated.completedAt } : x))
      }
    } finally { setTogglingId(null) }
  }

  async function addNote() {
    if (!newNote.trim()) return
    setAddingNote(true)
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/notes`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote.trim() }),
      })
      if (res.ok) {
        const note = await res.json()
        setNotes(prev => [{ id: note.id, content: note.content, createdAt: note.createdAt, author: note.createdByUser?.name || 'Admin' }, ...prev])
        setNewNote('')
      }
    } finally { setAddingNote(false) }
  }

  const doneCount = milestones.filter(m => m.status === 'done').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Status update */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Cập nhật trạng thái</div>
        {saveError && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 7, padding: '7px 12px', marginBottom: 10, fontSize: 12, color: '#dc2626' }}>{saveError}</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {PROJECT_STATUSES.map(s => (
            <button key={s.value} type="button" onClick={() => setStatus(s.value)}
              style={{ fontSize: 12, padding: '6px 14px', borderRadius: 20, border: `1px solid ${status === s.value ? s.color : 'var(--border)'}`, background: status === s.value ? s.color + '18' : 'transparent', color: status === s.value ? s.color : 'var(--text-2)', cursor: 'pointer', fontFamily: 'var(--sans)', fontWeight: status === s.value ? 500 : 400, transition: 'all .12s' }}>
              {s.label}
            </button>
          ))}
        </div>
        <button onClick={handleStatusSave} disabled={savingStatus || status === currentStatus}
          style={{ padding: '8px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, fontFamily: 'var(--sans)', cursor: (savingStatus || status === currentStatus) ? 'not-allowed' : 'pointer', opacity: (savingStatus || status === currentStatus) ? .6 : 1 }}>
          {savingStatus ? 'Đang lưu...' : 'Lưu trạng thái'}
        </button>
      </div>

      {/* Milestones */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Milestones</div>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{doneCount}/{milestones.length} hoàn thành</span>
        </div>
        {milestones.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>Chưa có milestone nào</div>
        ) : (
          <div style={{ padding: '8px 0' }}>
            {milestones.map(m => (
              <div key={m.id}
                onClick={() => togglingId === null && toggleMilestone(m)}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 18px', cursor: 'pointer', opacity: togglingId === m.id ? .5 : 1, transition: 'background .12s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${m.status === 'done' ? 'var(--accent)' : 'var(--border)'}`, background: m.status === 'done' ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all .15s' }}>
                  {m.status === 'done' && <span style={{ color: '#fff', fontSize: 11, lineHeight: 1 }}>✓</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: m.status === 'done' ? 'var(--text-3)' : 'var(--text)', textDecoration: m.status === 'done' ? 'line-through' : 'none' }}>{m.title}</div>
                  {m.description && <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{m.description}</div>}
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3, display: 'flex', gap: 10 }}>
                    {m.dueAt && <span>Hạn: {new Date(m.dueAt).toLocaleDateString('vi-VN')}</span>}
                    {m.completedAt && <span style={{ color: 'var(--accent)' }}>✓ Xong: {new Date(m.completedAt).toLocaleDateString('vi-VN')}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Ghi chú nội bộ</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <textarea value={newNote} onChange={e => setNewNote(e.target.value)} rows={2} placeholder="Thêm ghi chú..."
              style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 13, fontFamily: 'var(--sans)', resize: 'none', outline: 'none', color: 'var(--text)' }} />
            <button onClick={addNote} disabled={addingNote || !newNote.trim()}
              style={{ padding: '8px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 500, fontFamily: 'var(--sans)', cursor: (addingNote || !newNote.trim()) ? 'not-allowed' : 'pointer', opacity: (addingNote || !newNote.trim()) ? .6 : 1, alignSelf: 'flex-end' }}>
              Thêm
            </button>
          </div>
        </div>
        <div style={{ padding: '8px 0', maxHeight: 280, overflowY: 'auto' }}>
          {notes.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>Chưa có ghi chú</div>
          ) : notes.map(n => (
            <div key={n.id} style={{ padding: '10px 18px', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 4 }}>{n.content}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{n.author} · {new Date(n.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
