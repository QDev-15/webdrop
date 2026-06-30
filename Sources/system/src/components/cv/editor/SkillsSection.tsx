'use client'

import { nanoid } from 'nanoid'
import type { CvDataType, CvSkill } from '@/types/cv'

interface Props {
  data: CvDataType
  onChange: (patch: Partial<CvDataType>) => void
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', border: '1px solid #e8e5df', borderRadius: 7,
  fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box', color: '#1a1917',
}

const LEVEL_LABELS = ['', 'Cơ bản', 'Trung bình', 'Khá', 'Tốt', 'Thành thạo']

export default function SkillsSection({ data, onChange }: Props) {
  const items: CvSkill[] = (data.skills as CvSkill[]) ?? []

  const update = (id: string, patch: Partial<CvSkill>) => {
    onChange({ skills: items.map(i => i.id === id ? { ...i, ...patch } : i) })
  }

  const add = () => {
    onChange({ skills: [...items, { id: nanoid(), name: '', level: 3, category: '' }] })
  }

  const remove = (id: string) => {
    onChange({ skills: items.filter(i => i.id !== id) })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1917' }}>Kỹ năng</div>
        <button onClick={add} style={{ padding: '6px 12px', background: '#1a6b52', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>+ Thêm</button>
      </div>

      {items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 0', color: '#a09d97', fontSize: 13 }}>Chưa có kỹ năng. Nhấn &quot;+ Thêm&quot; để bắt đầu.</div>
      )}

      {items.map(item => (
        <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px 32px', gap: 8, marginBottom: 10, alignItems: 'center' }}>
          <input style={inputStyle} placeholder="Kỹ năng (React, Figma...)" value={item.name} onChange={e => update(item.id, { name: e.target.value })} />
          <input style={inputStyle} placeholder="Nhóm (không bắt buộc)" value={item.category ?? ''} onChange={e => update(item.id, { category: e.target.value })} />
          <select
            value={item.level}
            onChange={e => update(item.id, { level: Number(e.target.value) })}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {[1, 2, 3, 4, 5].map(l => <option key={l} value={l}>{LEVEL_LABELS[l]}</option>)}
          </select>
          <button onClick={() => remove(item.id)} style={{ padding: '8px', background: 'none', border: '1px solid #e8e5df', borderRadius: 7, color: '#e24b4a', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}>×</button>
        </div>
      ))}

      {items.length > 0 && (
        <div style={{ marginTop: 8, fontSize: 12, color: '#a09d97' }}>
          Mức độ: 1=Cơ bản → 5=Thành thạo
        </div>
      )}
    </div>
  )
}
