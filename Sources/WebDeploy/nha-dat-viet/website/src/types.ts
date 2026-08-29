export interface Agent {
  id: number
  name: string
  title: string
  phone: string
  zalo: string
  avatar: string
}

export interface Property {
  id: number
  title: string
  slug: string
  listing_type: string
  property_type: string
  price: number
  price_unit: string
  area: number
  bedrooms: number
  bathrooms: number
  direction: string
  legal_status: string
  furnishing: string
  district: string
  street: string
  lat: number
  lng: number
  badge: string
  posted_date: string
  agent_id: number | null
  description: string
  features: string[]
  images: string[]
  agent: Agent | null
}

export interface ProjectItem {
  id: number
  title: string
  image: string
  status_label: string
  description: string
  investor: string
  price_label: string
  area_label: string
}

export interface Testimonial {
  id: number
  avatar: string
  name: string
  role: string
  content: string
}

export interface Faq {
  id: number
  question: string
  answer: string
}
