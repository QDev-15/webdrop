import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface NearbyAmenity { id: number; name: string; distance: string }

export default function ExtAmenitiesList() {
  const [items, setItems] = useState<NearbyAmenity[]>([])

  useEffect(() => {
    api.get<NearbyAmenity[]>('/public/nearby-amenities').then(setItems).catch(() => {})
  }, [])

  if (items.length === 0) return null

  return (
    <ul className="gvr-ext-list">
      {items.map(a => (
        <li key={a.id}>{a.name} <span className="d">{a.distance}</span></li>
      ))}
    </ul>
  )
}
