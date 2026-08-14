import { ReactNode, useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { api } from '../../api/client'

interface Props {
  children?: ReactNode
}

interface Stats {
  newBookings: number
  newContacts: number
}

export default function AdminLayout({ children }: Props) {
  const [stats, setStats] = useState<Stats>({ newBookings: 0, newContacts: 0 })

  useEffect(() => {
    api.get<Stats>('/stats').then(setStats).catch(() => {})
  }, [])

  return (
    <div className="admin-layout">
      <Sidebar newBookings={stats.newBookings} newContacts={stats.newContacts} />
      <div className="admin-main">
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  )
}
