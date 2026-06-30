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

export default function CvMinimal({ data, isPrint }: Props) {
  const experience = data.experience as CvExperience[] | null
  const education = data.education as CvEducation[] | null
  const skills = data.skills as CvSkill[] | null
  const projects = data.projects as CvProject[] | null
  const certs = data.certifications as CvCertification[] | null
  const languages = data.languages as CvLanguage[] | null

  const hasContact = data.email || data.phone || data.location || data.website || data.linkedin || data.github || data.twitter

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#1f2937', background: '#ffffff', minHeight: isPrint ? 'auto' : undefined }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap');
        @media print {
          .cv-no-print { display: none !important; }
          .cv-section { page-break-inside: avoid; }
          .cv-header { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>

      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {/* Header */}
        <div className="cv-header" style={{ padding: '56px 56px 32px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ margin: 0, fontSize: 42, fontWeight: 300, letterSpacing: '-1px', color: '#111827', lineHeight: 1 }}>
                {data.fullName || 'Họ và Tên'}
              </h1>
              <div style={{ fontSize: 16, color: '#6b7280', fontStyle: 'italic', marginTop: 8 }}>
                {data.jobTitle || 'Chức danh'}
              </div>
            </div>
            {data.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.avatarUrl}
                alt={data.fullName ?? ''}
                style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
              />
            ) : (
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f3f4f6', border: '2px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22, fontWeight: 600, color: '#6b7280', letterSpacing: 1 }}>
                {getInitials(data.fullName)}
              </div>
            )}
          </div>
          {data.summary && (
            <p style={{ margin: '20px 0 0', fontSize: 14, color: '#374151', lineHeight: 1.8, maxWidth: 540, fontWeight: 300 }}>
              {data.summary}
            </p>
          )}
        </div>

        {/* Contact */}
        {hasContact && (
          <div style={{ padding: '20px 56px', borderBottom: '1px solid #e5e7eb', display: 'flex', flexWrap: 'wrap', gap: '8px 28px' }}>
            {data.email && (
              <span style={{ fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>email</span>
                {data.email}
              </span>
            )}
            {data.phone && (
              <span style={{ fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>tel</span>
                {data.phone}
              </span>
            )}
            {data.location && (
              <span style={{ fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>địa chỉ</span>
                {data.location}
              </span>
            )}
            {data.website && (
              <span style={{ fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>web</span>
                {data.website}
              </span>
            )}
            {data.linkedin && (
              <span style={{ fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>linkedin</span>
                {data.linkedin}
              </span>
            )}
            {data.github && (
              <span style={{ fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>github</span>
                {data.github}
              </span>
            )}
            {data.twitter && (
              <span style={{ fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>twitter</span>
                {data.twitter}
              </span>
            )}
          </div>
        )}

        {/* Body */}
        <div style={{ padding: '0 56px 56px' }}>
          {/* Experience */}
          {hasContent(experience) && (
            <div className="cv-section" style={{ marginTop: 40 }}>
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20, marginBottom: 24 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#111827' }}>
                  Kinh nghiệm làm việc
                </span>
              </div>
              {(experience as CvExperience[]).map(exp => (
                <div key={exp.id} style={{ marginBottom: 28, display: 'flex', gap: 24 }}>
                  <div style={{ minWidth: 140, paddingTop: 2 }}>
                    <div style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.6 }}>
                      {exp.startDate}
                    </div>
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>
                      {exp.isCurrent ? 'Hiện tại' : exp.endDate}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>{exp.role}</div>
                    <div style={{ fontSize: 13, color: '#4b5563', marginTop: 2 }}>{exp.company}</div>
                    {exp.description && (
                      <p style={{ margin: '8px 0 0', fontSize: 13, color: '#6b7280', lineHeight: 1.7, fontWeight: 300 }}>
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {hasContent(education) && (
            <div className="cv-section" style={{ marginTop: 40 }}>
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20, marginBottom: 24 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#111827' }}>
                  Học vấn
                </span>
              </div>
              {(education as CvEducation[]).map(edu => (
                <div key={edu.id} style={{ marginBottom: 20, display: 'flex', gap: 24 }}>
                  <div style={{ minWidth: 140, paddingTop: 2 }}>
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>
                      {edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>{edu.school}</div>
                    <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
                      {[edu.degree, edu.field].filter(Boolean).join(', ')}
                    </div>
                    {edu.gpa && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>GPA: {edu.gpa}</div>}
                    {edu.description && (
                      <p style={{ margin: '6px 0 0', fontSize: 13, color: '#6b7280', lineHeight: 1.7, fontWeight: 300 }}>
                        {edu.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {hasContent(skills) && (
            <div className="cv-section" style={{ marginTop: 40 }}>
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20, marginBottom: 24 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#111827' }}>
                  Kỹ năng
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 0' }}>
                {(skills as CvSkill[]).map((skill, i) => (
                  <span key={skill.id} style={{ fontSize: 13, color: '#4b5563' }}>
                    {skill.name}
                    <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 4 }}>({LEVEL_LABELS[skill.level]})</span>
                    {i < (skills as CvSkill[]).length - 1 && (
                      <span style={{ margin: '0 10px', color: '#d1d5db' }}>·</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {hasContent(projects) && (
            <div className="cv-section" style={{ marginTop: 40 }}>
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20, marginBottom: 24 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#111827' }}>
                  Dự án
                </span>
              </div>
              {(projects as CvProject[]).map(proj => (
                <div key={proj.id} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>{proj.name}</span>
                    {proj.url && (
                      <span style={{ fontSize: 12, color: '#9ca3af' }}>{proj.url}</span>
                    )}
                  </div>
                  {proj.description && (
                    <p style={{ margin: '6px 0 0', fontSize: 13, color: '#6b7280', lineHeight: 1.7, fontWeight: 300 }}>
                      {proj.description}
                    </p>
                  )}
                  {proj.tech && proj.tech.length > 0 && (
                    <div style={{ marginTop: 6, fontSize: 12, color: '#9ca3af' }}>
                      {proj.tech.join(' · ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {hasContent(certs) && (
            <div className="cv-section" style={{ marginTop: 40 }}>
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20, marginBottom: 24 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#111827' }}>
                  Chứng chỉ
                </span>
              </div>
              {(certs as CvCertification[]).map(cert => (
                <div key={cert.id} style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <span style={{ fontWeight: 500, fontSize: 13, color: '#111827' }}>{cert.name}</span>
                    <span style={{ fontSize: 13, color: '#6b7280', marginLeft: 8 }}>{cert.issuer}</span>
                  </div>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>{cert.date}</span>
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {hasContent(languages) && (
            <div className="cv-section" style={{ marginTop: 40 }}>
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20, marginBottom: 24 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#111827' }}>
                  Ngôn ngữ
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 0' }}>
                {(languages as CvLanguage[]).map((lang, i) => (
                  <span key={lang.id} style={{ fontSize: 13, color: '#4b5563' }}>
                    {lang.language}
                    <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 4 }}>({LANG_LEVELS[lang.level]})</span>
                    {i < (languages as CvLanguage[]).length - 1 && (
                      <span style={{ margin: '0 10px', color: '#d1d5db' }}>·</span>
                    )}
                  </span>
                ))}
              </div>
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
