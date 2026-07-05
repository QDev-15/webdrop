import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Service {
  id: number
  number: string
  name: string
  description: string
  features: string
  price: string
  image: string
  is_featured: number
  sort_order: number
}

interface Props {
  featuredOnly?: boolean
}

export default function Services({ featuredOnly = false }: Props) {
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    api.get<Service[]>('/public/services').then(setServices).catch(() => {})
  }, [])

  const displayed = featuredOnly ? services.filter(s => s.is_featured) : services

  return (
    <div className="dd-grid">
      {displayed.map((s, i) => (
        <Link key={s.id} to="/dich-vu" className="dd-card" data-reveal={i % 3 === 1 ? 'd1' : i % 3 === 2 ? 'd2' : undefined}>
          <div className="dd-card-media">
            <img
              src={s.image || `https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=700&q=76&auto=format&fit=crop`}
              alt={s.name}
              loading="lazy"
            />
          </div>
          <div className="dd-card-num">{s.number || String(i + 1).padStart(2, '0')}</div>
          <h3 className="dd-card-title">{s.name}</h3>
          <p className="dd-card-desc">{s.description}</p>
          {s.price && <div className="dd-card-price">{s.price}</div>}
        </Link>
      ))}
    </div>
  )
}
