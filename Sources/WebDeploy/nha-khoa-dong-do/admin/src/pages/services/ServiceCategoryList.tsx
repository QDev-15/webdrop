// ServiceCategory không dùng trong dự án này — redirect về /services
import { Navigate } from 'react-router-dom'

export default function ServiceCategoryList() {
  return <Navigate to="/services" replace />
}
