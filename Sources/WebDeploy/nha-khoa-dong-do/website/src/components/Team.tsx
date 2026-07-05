import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Doctor {
  id: number
  name: string
  role: string
  photo: string
  description: string
  experience_years: number
  specialties: string
  tag: string
}

interface Props {
  limit?: number
}

export default function Team({ limit }: Props) {
  const [doctors, setDoctors] = useState<Doctor[]>([])

  useEffect(() => {
    api.get<Doctor[]>('/public/doctors').then(setDoctors).catch(() => {})
  }, [])

  const displayed = limit ? doctors.slice(0, limit) : doctors

  return (
    <div className="dd-grid">
      {displayed.map((d, i) => (
        <Link key={d.id} to="/doi-ngu-bac-si" className="dd-card dd-doctor-card" data-reveal={i % 3 === 1 ? 'd1' : i % 3 === 2 ? 'd2' : undefined}>
          <div className="dd-card-media">
            <img
              src={d.photo || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=700&q=78&auto=format&fit=crop'}
              alt={d.name}
              loading="lazy"
            />
          </div>
          <h3 className="dd-doctor-name">{d.name}</h3>
          <div className="dd-doctor-title">{d.role}</div>
        </Link>
      ))}
    </div>
  )
}
