import NavBar from '@/components/site/NavBar'
import AnalyticsTracker from '@/components/site/AnalyticsTracker'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <AnalyticsTracker />
      {children}
    </>
  )
}
