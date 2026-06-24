import { useSite } from '../contexts/SiteContext'

export default function About() {
  const { settings } = useSite()

  const statCases = settings['stat_cases'] || '3.000+'
  const statDoctors = settings['stat_doctors'] || '8 BS'
  const statSatisfied = settings['stat_satisfied'] || '98%'
  const statYears = settings['stat_years'] || '10 năm'

  return (
    <section className="csd-stat-bar">
      <div className="wd-container">
        <div className="row g-0">
          {[
            { num: statCases,     label: 'Ca điều trị thành công' },
            { num: statDoctors,   label: 'Bác sĩ chuyên khoa' },
            { num: statSatisfied, label: 'Bệnh nhân hài lòng' },
            { num: statYears,     label: 'Kinh nghiệm' },
          ].map((s, i) => (
            <div key={i} className="col-6 col-md-3" data-reveal data-delay={i > 0 ? String(i) : undefined}
              style={i < 3 ? { borderRight: '1px solid rgba(255,255,255,.12)' } : undefined}>
              <div className="csd-stat-item">
                <div className="csd-stat-num">{s.num}</div>
                <div className="csd-stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
