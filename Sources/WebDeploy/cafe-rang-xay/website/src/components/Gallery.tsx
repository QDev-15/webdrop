import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface GalleryItemData {
  id: number
  title: string
  image: string
}

export default function Gallery() {
  const [items, setItems] = useState<GalleryItemData[]>([])

  useEffect(() => {
    api.get<GalleryItemData[]>('/public/gallery').then(setItems).catch(() => {})
  }, [])

  if (items.length === 0) return null

  return (
    <div className="crx-gallery-masonry" data-reveal data-reveal-d1>
      {items.map(item => (
        <img key={item.id} src={item.image} alt={item.title || 'Ảnh xưởng rang'} loading="lazy" />
      ))}
    </div>
  )
}
