import type { ReactNode } from 'react'
import Sidebar from './Sidebar'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  )
}
