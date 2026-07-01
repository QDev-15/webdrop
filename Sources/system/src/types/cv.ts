export interface CvExperience {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string
  isCurrent: boolean
  description: string
}

export interface CvEducation {
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa?: string
  description?: string
}

export interface CvSkill {
  id: string
  name: string
  level: number // 1-5
  category?: string
}

export interface CvProject {
  id: string
  name: string
  description: string
  url?: string
  tech: string[]
}

export interface CvCertification {
  id: string
  name: string
  issuer: string
  date: string
  credentialUrl?: string
}

export interface CvLanguage {
  id: string
  language: string
  level: 'native' | 'fluent' | 'intermediate' | 'basic'
}

export interface CvDataType {
  id?: number
  cvId?: number
  fullName?: string | null
  jobTitle?: string | null
  avatarUrl?: string | null
  summary?: string | null
  email?: string | null
  phone?: string | null
  location?: string | null
  website?: string | null
  linkedin?: string | null
  github?: string | null
  twitter?: string | null
  experience?: CvExperience[] | null
  education?: CvEducation[] | null
  skills?: CvSkill[] | null
  projects?: CvProject[] | null
  certifications?: CvCertification[] | null
  languages?: CvLanguage[] | null
}

export interface CvProfileType {
  id: number
  userId: number
  templateType: string
  slug: string
  isPublic: boolean
  data?: CvDataType | null
}

export const CV_TEMPLATE_TYPES = [
  { value: 'classic', label: 'Classic', desc: '2 cột, trắng sạch' },
  { value: 'minimal', label: 'Minimal', desc: 'Typography-first, tối giản' },
  { value: 'creative', label: 'Creative', desc: 'Màu sắc nổi bật' },
  { value: 'dark', label: 'Dark', desc: 'Nền tối, neon accent' },
  { value: 'executive', label: 'Executive', desc: 'Formal, elegant' },
  { value: 'professional', label: 'Professional', desc: 'Corporate blue, 2 cột' },
  { value: 'elegant', label: 'Elegant', desc: 'Rose & blush, serif' },
  { value: 'tech', label: 'Tech', desc: 'Terminal green, monospace' },
  { value: 'bold', label: 'Bold', desc: 'High contrast, yellow accent' },
  { value: 'timeline', label: 'Timeline', desc: 'Clean timeline layout' },
] as const
