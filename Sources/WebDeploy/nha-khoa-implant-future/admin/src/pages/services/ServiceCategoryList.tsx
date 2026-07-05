// ServiceCategoryList — not used for spa-service type
// Redirects to ServiceList

import { Navigate } from 'react-router-dom'

export default function ServiceCategoryList() {
  return <Navigate to="/services" replace />
}
