import { ReactNode } from 'react'
import Sidebar from './Sidebar'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Sidebar />
      <main className="admin-main">
        <div className="admin-content">
          {children}
        </div>
      </main>
    </>
  )
}
