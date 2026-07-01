import type { CvDataType, CvExperience, CvEducation, CvSkill, CvProject, CvCertification, CvLanguage } from '@/types/cv'

interface Props {
  data: CvDataType
  isPrint?: boolean
}

const hasContent = (val: unknown[] | null | undefined): boolean =>
  Array.isArray(val) && val.length > 0

const LANG_LEVELS: Record<string, string> = { native: 'Bản ngữ', fluent: 'Thành thạo', intermediate: 'Trung cấp', basic: 'Cơ bản' }

const PASTEL_BG = ['#fce7f3', '#dbeafe', '#dcfce7', '#fef9c3', '#ede9fe', '#ffedd5']

export default function CvPastel({ data, isPrint }: Props) {
  const experience = data.experience as CvExperience[] | null
  const education = data.education as CvEducation[] | null
  const skills = data.skills as CvSkill[] | null
  const projects = data.projects as CvProject[] | null
  const certs = data.certifications as CvCertification[] | null
  const languages = data.languages as CvLanguage[] | null

  return (
    <div style={{ fontFamily: "'Quicksand', sans-serif", color: '#374151', background: '#fef9ff', minHeight: isPrint ? 'auto' : undefined }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
        @media print {
          .cv-no-print { display: none !important; }
          .cv-section { page-break-inside: avoid; }
          .cv-header { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>

      {/* Header — lavender */}
      <div className="cv-header" style={{ background: '#f3e8ff', padding: '40px 48px 32px', borderRadius: '0 0 32px 32px', display: 'flex', alignItems: 'center', gap: 24, marginBottom: 8 }}>
        {data.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.avatarUrl} alt={data.fullName ?? ''} style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '4px solid #e9d5ff', flexShrink: 0 }} />
        ) : (
          <div style={{ width: 90, height: 90, borderRadius: '50%', background: '#ede9fe', border: '4px solid #e9d5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 32, fontWeight: 700, color: '#9333ea' }}>
            {(data.fullName ?? '?').charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 700, color: '#6b21a8', lineHeight: 1.2 }}>
            {data.fullName || 'Họ và Tên'}
          </h1>
          <div style={{ fontSize: 15, color: '#9333ea', fontWeight: 600, marginTop: 5 }}>
            {data.jobTitle || 'Chức danh'}
          </div>
          {data.summary && (
            <p style={{ margin: '10px 0 0', fontSize: 13, color: '#6b7280', lineHeight: 1.7, maxWidth: 480, fontWeight: 400 }}>
              {data.summary}
            </p>
          )}
        </div>
      </div>

      {/* Contact — pill chips with emoji */}
      {(data.email || data.phone || data.location || data.website || data.linkedin || data.github) && (
        <div style={{ padding: '16px 48px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            data.email && { emoji: '✉️', text: data.email },
            data.phone && { emoji: '📞', text: data.phone },
            data.location && { emoji: '📍', text: data.location },
            data.website && { emoji: '🌐', text: data.website },
            data.linkedin && { emoji: '💼', text: data.linkedin },
            data.github && { emoji: '⚙️', text: data.github },
          ].filter(Boolean).map((item, i) => item && (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#ede9fe', color: '#7c3aed', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
              <span>{item.emoji}</span>
              {item.text}
            </span>
          ))}
        </div>
      )}

      <div style={{ padding: '8px 48px 40px' }}>
        {/* Experience */}
        {hasContent(experience) && (
          <div className="cv-section" style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#9333ea', marginBottom: 12 }}>
              Kinh nghiệm làm việc
            </div>
            {experience!.map((exp, idx) => (
              <div key={exp.id} style={{ marginBottom: 12, background: PASTEL_BG[idx % 2 === 0 ? 0 : 1], borderRadius: 12, padding: '14px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#374151' }}>{exp.role}</div>
                    <div style={{ fontSize: 13, color: '#9333ea', fontWeight: 600 }}>{exp.company}</div>
                  </div>
                  <div style={{ fontSize: 11, color: '#6b7280', background: 'rgba(255,255,255,0.6)', padding: '2px 8px', borderRadius: 8 }}>
                    {exp.startDate} — {exp.isCurrent ? 'Hiện tại' : exp.endDate}
                  </div>
                </div>
                {exp.description && (
                  <p style={{ margin: '8px 0 0', fontSize: 13, color: '#4b5563', lineHeight: 1.65 }}>{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {hasContent(education) && (
          <div className="cv-section" style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#9333ea', marginBottom: 12 }}>
              Học vấn
            </div>
            {education!.map((edu, idx) => (
              <div key={edu.id} style={{ marginBottom: 12, background: PASTEL_BG[(idx % 2 === 0 ? 2 : 1)], borderRadius: 12, padding: '14px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#374151' }}>{edu.school}</div>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>{[edu.degree, edu.field].filter(Boolean).join(', ')}</div>
                    {edu.gpa && <div style={{ fontSize: 12, color: '#9ca3af' }}>GPA: {edu.gpa}</div>}
                  </div>
                  <div style={{ fontSize: 11, color: '#6b7280', background: 'rgba(255,255,255,0.6)', padding: '2px 8px', borderRadius: 8 }}>
                    {edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills — pastel pill tags */}
        {hasContent(skills) && (
          <div className="cv-section" style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#9333ea', marginBottom: 12 }}>
              Kỹ năng
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {skills!.map((skill, idx) => (
                <span key={skill.id} style={{ background: PASTEL_BG[idx % PASTEL_BG.length], color: '#374151', padding: '5px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {hasContent(projects) && (
          <div className="cv-section" style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#9333ea', marginBottom: 12 }}>
              Dự án
            </div>
            {projects!.map((proj, idx) => (
              <div key={proj.id} style={{ marginBottom: 12, background: PASTEL_BG[(idx + 3) % PASTEL_BG.length], borderRadius: 12, padding: '14px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#374151' }}>
                  {proj.name}
                  {proj.url && <span style={{ fontSize: 11, color: '#9333ea', fontWeight: 400, marginLeft: 8 }}>{proj.url}</span>}
                </div>
                {proj.description && <p style={{ margin: '6px 0 6px', fontSize: 13, color: '#4b5563', lineHeight: 1.6 }}>{proj.description}</p>}
                {proj.tech && proj.tech.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {proj.tech.map((t, i) => (
                      <span key={i} style={{ fontSize: 11, background: 'rgba(255,255,255,0.7)', color: '#7c3aed', padding: '2px 8px', borderRadius: 8, fontWeight: 600 }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certs + Languages */}
        {(hasContent(certs) || hasContent(languages)) && (
          <div style={{ display: 'grid', gridTemplateColumns: hasContent(certs) && hasContent(languages) ? '1fr 1fr' : '1fr', gap: 24 }}>
            {hasContent(certs) && (
              <div className="cv-section">
                <div style={{ fontSize: 14, fontWeight: 700, color: '#9333ea', marginBottom: 12 }}>
                  Chứng chỉ
                </div>
                {certs!.map((cert, idx) => (
                  <div key={cert.id} style={{ marginBottom: 10, background: PASTEL_BG[(idx + 4) % PASTEL_BG.length], borderRadius: 10, padding: '10px 14px' }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#374151' }}>{cert.name}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{cert.issuer}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{cert.date}</div>
                  </div>
                ))}
              </div>
            )}
            {hasContent(languages) && (
              <div className="cv-section">
                <div style={{ fontSize: 14, fontWeight: 700, color: '#9333ea', marginBottom: 12 }}>
                  Ngôn ngữ
                </div>
                {languages!.map((lang, idx) => (
                  <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, background: PASTEL_BG[(idx + 2) % PASTEL_BG.length], borderRadius: 10, padding: '8px 14px', fontSize: 13 }}>
                    <span style={{ fontWeight: 600, color: '#374151' }}>{lang.language}</span>
                    <span style={{ color: '#6b7280' }}>{LANG_LEVELS[lang.level]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {!data.fullName && !hasContent(experience) && !hasContent(skills) && (
        <div style={{ padding: '60px 40px', textAlign: 'center', color: '#a09d97', fontSize: 14 }}>
          Điền thông tin ở panel bên trái để xem preview CV của bạn
        </div>
      )}
    </div>
  )
}
