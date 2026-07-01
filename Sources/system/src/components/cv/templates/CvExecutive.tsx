import type { CvDataType, CvExperience, CvEducation, CvSkill, CvProject, CvCertification, CvLanguage } from '@/types/cv'

interface Props {
  data: CvDataType
  isPrint?: boolean
}

const hasContent = (val: unknown[] | null | undefined): boolean =>
  Array.isArray(val) && val.length > 0

const LEVEL_LABELS = ['', 'Cơ bản', 'Trung bình', 'Khá', 'Tốt', 'Thành thạo']
const LANG_LEVELS: Record<string, string> = { native: 'Bản ngữ', fluent: 'Thành thạo', intermediate: 'Trung cấp', basic: 'Cơ bản' }

function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '')).toUpperCase()
}

export default function CvExecutive({ data, isPrint }: Props) {
  const experience = data.experience as CvExperience[] | null
  const education = data.education as CvEducation[] | null
  const skills = data.skills as CvSkill[] | null
  const projects = data.projects as CvProject[] | null
  const certs = data.certifications as CvCertification[] | null
  const languages = data.languages as CvLanguage[] | null

  const hasContact = data.email || data.phone || data.location || data.website || data.linkedin || data.github || data.twitter

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", color: '#1a2744', background: '#f8f6f0', minHeight: isPrint ? 'auto' : undefined }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        @media print {
          .cv-no-print { display: none !important; }
          .cv-section { page-break-inside: avoid; }
          .cv-header, .cv-sidebar { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>

      {/* Header — full-width navy */}
      <div className="cv-header" style={{ background: '#1a2744', padding: '40px 48px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 700, color: '#ffffff', letterSpacing: 1, textTransform: 'uppercase', lineHeight: 1.1 }}>
              {data.fullName || 'Họ và Tên'}
            </h1>
            <div style={{ fontSize: 14, color: '#b5860d', fontWeight: 500, marginTop: 8, letterSpacing: 0.5 }}>
              {data.jobTitle || 'Chức danh'}
            </div>
          </div>
          {data.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.avatarUrl}
              alt={data.fullName ?? ''}
              style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid #b5860d', flexShrink: 0 }}
            />
          ) : (
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(181,134,13,.15)', border: '3px solid #b5860d', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 24, fontWeight: 700, color: '#b5860d', letterSpacing: 1 }}>
              {getInitials(data.fullName)}
            </div>
          )}
        </div>

        {/* Contact inside header */}
        {hasContact && (
          <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: '6px 24px', borderTop: '1px solid rgba(255,255,255,.12)', paddingTop: 16 }}>
            {data.email && (
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.65)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#b5860d' }}>✉</span>
                {data.email}
              </span>
            )}
            {data.phone && (
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.65)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#b5860d' }}>☎</span>
                {data.phone}
              </span>
            )}
            {data.location && (
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.65)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#b5860d' }}>⌖</span>
                {data.location}
              </span>
            )}
            {data.website && (
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.65)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#b5860d' }}>⬡</span>
                {data.website}
              </span>
            )}
            {data.linkedin && (
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.65)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#b5860d' }}>in</span>
                {data.linkedin}
              </span>
            )}
            {data.github && (
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.65)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#b5860d' }}>gh</span>
                {data.github}
              </span>
            )}
            {data.twitter && (
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.65)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#b5860d' }}>tw</span>
                {data.twitter}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Body: Main left 60% + Sidebar right 40% */}
      <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', gap: 0 }}>
        {/* Main left */}
        <div style={{ padding: '32px 36px 40px 48px', background: '#ffffff', borderRight: '1px solid #d9d0be' }}>
          {/* Summary */}
          {data.summary && (
            <div className="cv-section" style={{ marginBottom: 28 }}>
              <p style={{ margin: 0, fontSize: 13, color: '#4a5568', lineHeight: 1.8, fontWeight: 300 }}>
                {data.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {hasContent(experience) && (
            <div className="cv-section" style={{ marginBottom: 28 }}>
              <div style={{ borderLeft: '3px solid #b5860d', paddingLeft: 10, marginBottom: 18 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#1a2744' }}>
                  Kinh nghiệm làm việc
                </span>
              </div>
              {(experience as CvExperience[]).map(exp => (
                <div key={exp.id} style={{ marginBottom: 22 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#1a2744' }}>{exp.role}</div>
                      <div style={{ fontSize: 13, color: '#b5860d', fontWeight: 500 }}>{exp.company}</div>
                    </div>
                    <div style={{ fontSize: 12, color: '#4a5568', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                      {exp.startDate} — {exp.isCurrent ? 'Hiện tại' : exp.endDate}
                    </div>
                  </div>
                  {exp.description && (
                    <p style={{ margin: '8px 0 0', fontSize: 13, color: '#4a5568', lineHeight: 1.7, fontWeight: 300 }}>
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {hasContent(education) && (
            <div className="cv-section" style={{ marginBottom: 28 }}>
              <div style={{ borderLeft: '3px solid #b5860d', paddingLeft: 10, marginBottom: 18 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#1a2744' }}>
                  Học vấn
                </span>
              </div>
              {(education as CvEducation[]).map(edu => (
                <div key={edu.id} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#1a2744' }}>{edu.school}</div>
                      <div style={{ fontSize: 13, color: '#4a5568' }}>
                        {[edu.degree, edu.field].filter(Boolean).join(', ')}
                      </div>
                      {edu.gpa && <div style={{ fontSize: 12, color: '#4a5568' }}>GPA: {edu.gpa}</div>}
                    </div>
                    <div style={{ fontSize: 12, color: '#4a5568', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                      {edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}
                    </div>
                  </div>
                  {edu.description && (
                    <p style={{ margin: '6px 0 0', fontSize: 13, color: '#4a5568', lineHeight: 1.7, fontWeight: 300 }}>
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {hasContent(projects) && (
            <div className="cv-section">
              <div style={{ borderLeft: '3px solid #b5860d', paddingLeft: 10, marginBottom: 18 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#1a2744' }}>
                  Dự án
                </span>
              </div>
              {(projects as CvProject[]).map(proj => (
                <div key={proj.id} style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#1a2744' }}>{proj.name}</div>
                  {proj.url && <div style={{ fontSize: 12, color: '#b5860d' }}>{proj.url}</div>}
                  {proj.description && (
                    <p style={{ margin: '6px 0 0', fontSize: 13, color: '#4a5568', lineHeight: 1.7, fontWeight: 300 }}>
                      {proj.description}
                    </p>
                  )}
                  {proj.tech && proj.tech.length > 0 && (
                    <div style={{ marginTop: 6, fontSize: 12, color: '#4a5568' }}>
                      {proj.tech.join(' · ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar right */}
        <div className="cv-sidebar" style={{ padding: '32px 32px 40px', background: '#f0ece2' }}>
          {/* Skills */}
          {hasContent(skills) && (
            <div className="cv-section" style={{ marginBottom: 28 }}>
              <div style={{ borderLeft: '3px solid #b5860d', paddingLeft: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#1a2744' }}>
                  Kỹ năng
                </span>
              </div>
              {(skills as CvSkill[]).map(skill => (
                <div key={skill.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                    <span style={{ fontWeight: 500, color: '#1a2744' }}>{skill.name}</span>
                    <span style={{ color: '#4a5568', fontSize: 11 }}>{LEVEL_LABELS[skill.level]}</span>
                  </div>
                  <div style={{ height: 4, background: '#d9d0be', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(skill.level / 5) * 100}%`, background: '#1a2744', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {hasContent(languages) && (
            <div className="cv-section" style={{ marginBottom: 28 }}>
              <div style={{ borderLeft: '3px solid #b5860d', paddingLeft: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#1a2744' }}>
                  Ngôn ngữ
                </span>
              </div>
              {(languages as CvLanguage[]).map(lang => (
                <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '6px 10px', background: '#fff', borderRadius: 6, border: '1px solid #d9d0be' }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#1a2744' }}>{lang.language}</span>
                  <span style={{ fontSize: 12, color: '#b5860d', fontWeight: 500 }}>{LANG_LEVELS[lang.level]}</span>
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {hasContent(certs) && (
            <div className="cv-section">
              <div style={{ borderLeft: '3px solid #b5860d', paddingLeft: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#1a2744' }}>
                  Chứng chỉ
                </span>
              </div>
              {(certs as CvCertification[]).map(cert => (
                <div key={cert.id} style={{ marginBottom: 14, padding: '10px 12px', background: '#fff', borderRadius: 6, border: '1px solid #d9d0be' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a2744' }}>{cert.name}</div>
                  <div style={{ fontSize: 12, color: '#b5860d', marginTop: 2 }}>{cert.issuer}</div>
                  <div style={{ fontSize: 11, color: '#4a5568', marginTop: 2 }}>{cert.date}</div>
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
