import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface GalleryItemData {
  id: number
  title: string
  description: string
  image: string
  category: string
}

export default function Gallery() {
  const [items, setItems] = useState<GalleryItemData[]>([])

  useEffect(() => {
    api.get<GalleryItemData[]>('/public/gallery').then(setItems).catch(() => {})
  }, [])

  if (items.length === 0) return null

  return (
    <div className="cbn-gallery">
      {items.map(item => (
        <img key={item.id} src={item.image} alt={item.title || 'Ảnh Rosette Bakery & Cafe'} loading="lazy" />
      ))}
    </div>
  )
}
