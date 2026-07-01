import type { CvDataType, CvExperience, CvEducation, CvSkill } from '@/types/cv'

interface Props {
  data: CvDataType
  isPrint?: boolean
}

const LEVEL_LABELS = ['', 'Cơ bản', 'Trung bình', 'Khá', 'Tốt', 'Thành thạo']

function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '')).toUpperCase()
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#1a6b52', borderBottom: '2px solid #1a6b52', paddingBottom: 6, marginBottom: 14, marginTop: 28 }}>
      {children}
    </div>
  )
}

export default function CvClassic({ data, isPrint }: Props) {
  const hasContent = (val: unknown[] | null | undefined) => val && val.length > 0

  const experience = data.experience as CvExperience[] | null
  const education = data.education as CvEducation[] | null
  const skills = data.skills as CvSkill[] | null

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#1a1917', background: '#fff', minHeight: isPrint ? 'auto' : undefined }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
        @media print {
          .cv-header { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .cv-section { page-break-inside: avoid; }
        }
      `}</style>

      {/* Header */}
      <div className="cv-header" style={{ background: '#0c0b09', padding: '36px 40px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
            {data.fullName || 'Họ và Tên'}
          </h1>
          <div style={{ fontSize: 15, color: '#4ade80', fontWeight: 500, marginTop: 6 }}>
            {data.jobTitle || 'Chức danh'}
          </div>
          {data.summary && (
            <p style={{ margin: '12px 0 0', fontSize: 13, color: 'rgba(255,255,255,.65)', lineHeight: 1.7, maxWidth: 480 }}>
              {data.summary}
            </p>
          )}
        </div>
        {data.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.avatarUrl} alt={data.fullName ?? ''} style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,.15)', flexShrink: 0 }} />
        ) : (
          <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'rgba(26,107,82,.5)', border: '3px solid rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>
            {getInitials(data.fullName)}
          </div>
        )}
      </div>

      {/* Contact bar */}
      {(data.email || data.phone || data.location || data.website || data.linkedin || data.github) && (
        <div style={{ background: '#1a6b52', padding: '10px 40px', display: 'flex', flexWrap: 'wrap', gap: '6px 20px' }}>
          {[
            data.email && { icon: '✉', text: data.email },
            data.phone && { icon: '☎', text: data.phone },
            data.location && { icon: '⌖', text: data.location },
            data.website && { icon: '⬡', text: data.website },
            data.linkedin && { icon: 'in', text: data.linkedin },
            data.github && { icon: '⌥', text: data.github },
          ].filter(Boolean).map((item, i) => item && (
            <span key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,.85)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 10, opacity: .7 }}>{item.icon}</span>
              {item.text}
            </span>
          ))}
        </div>
      )}

      {/* Body: 2 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 0 }}>
        {/* Left column */}
        <div style={{ padding: '8px 32px 40px 40px', borderRight: '1px solid #e8e5df' }}>
          {hasContent(experience) && (
            <div className="cv-section">
              <SectionTitle>Kinh nghiệm làm việc</SectionTitle>
              {experience!.map(exp => (
                <div key={exp.id} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1917' }}>{exp.role}</div>
                      <div style={{ fontSize: 13, color: '#1a6b52', fontWeight: 500 }}>{exp.company}</div>
                    </div>
                    <div style={{ fontSize: 12, color: '#a09d97', whiteSpace: 'nowrap', marginLeft: 12 }}>
                      {exp.startDate} — {exp.isCurrent ? 'Hiện tại' : exp.endDate}
                    </div>
                  </div>
                  {exp.description && (
                    <p style={{ margin: '8px 0 0', fontSize: 13, color: '#6b6760', lineHeight: 1.7 }}>{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {hasContent(education) && (
            <div className="cv-section">
              <SectionTitle>Học vấn</SectionTitle>
              {(education as CvEducation[]).map(edu => (
                <div key={edu.id} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{edu.school}</div>
                      <div style={{ fontSize: 13, color: '#6b6760' }}>{[edu.degree, edu.field].filter(Boolean).join(', ')}</div>
                      {edu.gpa && <div style={{ fontSize: 12, color: '#a09d97' }}>GPA: {edu.gpa}</div>}
                    </div>
                    <div style={{ fontSize: 12, color: '#a09d97', whiteSpace: 'nowrap', marginLeft: 12 }}>
                      {edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ padding: '8px 32px 40px 28px' }}>
          {hasContent(skills) && (
            <div className="cv-section">
              <SectionTitle>Kỹ năng</SectionTitle>
              {(skills as CvSkill[]).map(skill => (
                <div key={skill.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                    <span style={{ fontWeight: 500 }}>{skill.name}</span>
                    <span style={{ color: '#a09d97', fontSize: 11 }}>{LEVEL_LABELS[skill.level]}</span>
                  </div>
                  <div style={{ height: 4, background: '#e8e5df', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(skill.level / 5) * 100}%`, background: '#1a6b52', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Empty state */}
      {!data.fullName && !hasContent(experience) && !hasContent(skills) && (
        <div style={{ padding: '60px 40px', textAlign: 'center', color: '#a09d97', fontSize: 14 }}>
          Điền thông tin ở panel bên trái để xem preview CV của bạn
        </div>
      )}
    </div>
  )
}
