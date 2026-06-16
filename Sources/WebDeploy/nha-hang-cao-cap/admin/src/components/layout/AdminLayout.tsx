import { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

interface Props {
  children?: ReactNode
}

export default function AdminLayout(_props: Props) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
