import { ReactNode } from 'react'
import TopNavbar from './TopNavbar'

interface Props {
  children?: ReactNode
}

export default function AdminLayout({ children }: Props) {
  return (
    <div className="admin-layout">
      <TopNavbar />
      <main className="admin-content">
        {children}
      </main>
    </div>
  )
}
