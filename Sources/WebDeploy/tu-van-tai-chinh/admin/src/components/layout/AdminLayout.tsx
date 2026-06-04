import React from 'react'
import Sidebar from './Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-area">
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  )
}
