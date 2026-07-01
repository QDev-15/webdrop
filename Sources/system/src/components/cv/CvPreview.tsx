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
}

export default function CvPreview({ data, templateType, isPrint }: Props) {
  const Template = TEMPLATES[templateType] ?? CvClassic
  return <Template data={data} isPrint={isPrint} />
}
