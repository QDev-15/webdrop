import type { CvDataType } from '@/types/cv'
import CvClassic from './templates/CvClassic'
import CvMinimal from './templates/CvMinimal'
import CvCreative from './templates/CvCreative'
import CvDark from './templates/CvDark'
import CvExecutive from './templates/CvExecutive'
import CvProfessional from './templates/CvProfessional'
import CvElegant from './templates/CvElegant'
import CvTech from './templates/CvTech'
import CvBold from './templates/CvBold'
import CvTimeline from './templates/CvTimeline'
import CvModern from './templates/CvModern'
import CvAcademic from './templates/CvAcademic'
import CvCompact from './templates/CvCompact'
import CvRetro from './templates/CvRetro'
import CvGradient from './templates/CvGradient'
import CvMinimalist from './templates/CvMinimalist'
import CvSplit from './templates/CvSplit'
import CvNeon from './templates/CvNeon'
import CvPastel from './templates/CvPastel'
import CvMagazine from './templates/CvMagazine'

interface Props {
  data: CvDataType
  templateType: string
  isPrint?: boolean
}

const TEMPLATES: Record<string, React.ComponentType<{ data: CvDataType; isPrint?: boolean }>> = {
  classic:      CvClassic,
  minimal:      CvMinimal,
  creative:     CvCreative,
  dark:         CvDark,
  executive:    CvExecutive,
  professional: CvProfessional,
  elegant:      CvElegant,
  tech:         CvTech,
  bold:         CvBold,
  timeline:     CvTimeline,
  modern:       CvModern,
  academic:     CvAcademic,
  compact:      CvCompact,
  retro:        CvRetro,
  gradient:     CvGradient,
  minimalist:   CvMinimalist,
  split:        CvSplit,
  neon:         CvNeon,
  pastel:       CvPastel,
  magazine:     CvMagazine,
}

export default function CvPreview({ data, templateType, isPrint }: Props) {
  const Template = TEMPLATES[templateType] ?? CvClassic
  return <Template data={data} isPrint={isPrint} />
}
