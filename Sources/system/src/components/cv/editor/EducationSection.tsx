'use client'

import { useState } from 'react'
import { nanoid } from 'nanoid'
import type { CvDataType, CvEducation } from '@/types/cv'

interface Props {
  data: CvDataType
  onChange: (patch: Partial<CvDataType>) => void
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', border: '1px solid #e8e5df', borderRadius: 7,
  fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box', color: '#1a1917',
}

const empty = (): CvEducation => ({
  id: nanoid(), school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', description: '',
})

export default function EducationSection({ data, onChange }: Props) {
  const items: CvEducation[] = (data.education as CvEducation[]) ?? []
  const [expanded, setExpanded] = useState<string | null>(items[0]?.id ?? null)

  const update = (id: string, patch: Partial<CvEducation>) => {
    onChange({ education: items.map(i => i.id === id ? { ...i, ...patch } : i) })
  }

  const add = () => {
    const item = empty()
    onChange({ education: [...items, item] })
    setExpanded(item.id)
  }

  const remove = (id: string) => {
    onChange({ education: items.filter(i => i.id !== id) })
    if (expanded === id) setExpanded(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1917' }}>Học vấn</div>
        <button onClick={add} style={{ padding: '6px 12px', background: '#1a6b52', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>+ Thêm</button>
      </div>

      {items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 0', color: '#a09d97', fontSize: 13 }}>Chưa có học vấn. Nhấn &quot;+ Thêm&quot; để bắt đầu.</div>
      )}

      {items.map(item => (
        <div key={item.id} style={{ border: '1px solid #e8e5df', borderRadius: 10, marginBottom: 10, overflow: 'hidden' }}>
          <div
            onClick={() => setExpanded(expanded === item.id ? null : item.id)}
            style={{ padding: '12px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: expanded === item.id ? '#f5f0e8' : '#fff' }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1917' }}>{item.school || 'Trường học'}</div>
              <div style={{ fontSize: 12, color: '#6b6760' }}>{[item.degree, item.field].filter(Boolean).join(' — ') || 'Ngành học'}</div>
            </div>
            <span style={{ fontSize: 12, color: '#a09d97' }}>{expanded === item.id ? '▲' : '▼'}</span>
          </div>

          {expanded === item.id && (
            <div style={{ padding: '14px', borderTop: '1px solid #e8e5df', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input style={inputStyle} placeholder="Tên trường" value={item.school} onChange={e => update(item.id, { school: e.target.value })} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input style={inputStyle} placeholder="Bằng cấp (Cử nhân...)" value={item.degree} onChange={e => update(item.id, { degree: e.target.value })} />
                <input style={inputStyle} placeholder="Ngành học" value={item.field} onChange={e => update(item.id, { field: e.target.value })} />
                <input style={inputStyle} placeholder="Từ (yyyy)" value={item.startDate} onChange={e => update(item.id, { startDate: e.target.value })} />
                <input style={inputStyle} placeholder="Đến (yyyy)" value={item.endDate} onChange={e => update(item.id, { endDate: e.target.value })} />
              </div>
              <input style={inputStyle} placeholder="GPA (không bắt buộc)" value={item.gpa ?? ''} onChange={e => update(item.id, { gpa: e.target.value })} />
              <textarea
                placeholder="Mô tả thêm (không bắt buộc)"
                rows={2} value={item.description ?? ''}
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
