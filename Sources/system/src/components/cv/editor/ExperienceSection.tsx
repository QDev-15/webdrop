'use client'

import { useState } from 'react'
import { nanoid } from 'nanoid'
import type { CvDataType, CvExperience } from '@/types/cv'

interface Props {
  data: CvDataType
  onChange: (patch: Partial<CvDataType>) => void
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', border: '1px solid #e8e5df', borderRadius: 7,
  fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box', color: '#1a1917',
}

const empty = (): CvExperience => ({
  id: nanoid(), company: '', role: '', startDate: '', endDate: '', isCurrent: false, description: '',
})

export default function ExperienceSection({ data, onChange }: Props) {
  const items: CvExperience[] = (data.experience as CvExperience[]) ?? []
  const [expanded, setExpanded] = useState<string | null>(items[0]?.id ?? null)

  const update = (id: string, patch: Partial<CvExperience>) => {
    onChange({ experience: items.map(i => i.id === id ? { ...i, ...patch } : i) })
  }

  const add = () => {
    const item = empty()
    onChange({ experience: [...items, item] })
    setExpanded(item.id)
  }

  const remove = (id: string) => {
    onChange({ experience: items.filter(i => i.id !== id) })
    if (expanded === id) setExpanded(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1917' }}>Kinh nghiệm làm việc</div>
        <button onClick={add} style={{ padding: '6px 12px', background: '#1a6b52', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>+ Thêm</button>
      </div>

      {items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 0', color: '#a09d97', fontSize: 13 }}>Chưa có kinh nghiệm. Nhấn &quot;+ Thêm&quot; để bắt đầu.</div>
      )}

      {items.map(item => (
        <div key={item.id} style={{ border: '1px solid #e8e5df', borderRadius: 10, marginBottom: 10, overflow: 'hidden' }}>
          <div
            onClick={() => setExpanded(expanded === item.id ? null : item.id)}
            style={{ padding: '12px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: expanded === item.id ? '#f5f0e8' : '#fff' }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1917' }}>{item.role || 'Chức vụ'}</div>
              <div style={{ fontSize: 12, color: '#6b6760' }}>{item.company || 'Công ty'}</div>
            </div>
            <span style={{ fontSize: 12, color: '#a09d97' }}>{expanded === item.id ? '▲' : '▼'}</span>
          </div>

          {expanded === item.id && (
            <div style={{ padding: '14px', borderTop: '1px solid #e8e5df', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input style={inputStyle} placeholder="Tên công ty" value={item.company} onChange={e => update(item.id, { company: e.target.value })} />
              <input style={inputStyle} placeholder="Chức vụ / Vị trí" value={item.role} onChange={e => update(item.id, { role: e.target.value })} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input style={inputStyle} placeholder="Từ (mm/yyyy)" value={item.startDate} onChange={e => update(item.id, { startDate: e.target.value })} />
                <input style={inputStyle} placeholder="Đến (mm/yyyy)" value={item.endDate} disabled={item.isCurrent} onChange={e => update(item.id, { endDate: e.target.value })} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#6b6760', cursor: 'pointer' }}>
                <input type="checkbox" checked={item.isCurrent} onChange={e => update(item.id, { isCurrent: e.target.checked, endDate: e.target.checked ? '' : item.endDate })} />
                Đang làm việc tại đây
              </label>
              <textarea
                placeholder="Mô tả công việc, thành tích..."
                rows={3} value={item.description}
                onChange={e => update(item.id, { description: e.target.value })}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
              />
              <button onClick={() => remove(item.id)} style={{ alignSelf: 'flex-start', padding: '5px 10px', background: 'none', border: '1px solid #e8e5df', borderRadius: 6, fontSize: 12, color: '#e24b4a', cursor: 'pointer', fontFamily: 'inherit' }}>Xóa</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
