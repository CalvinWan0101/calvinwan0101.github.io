import { Outlet } from 'react-router-dom'
import { AnalyticsTracker } from './analytics'
import { BackgroundAudio } from './audio'
import { Footer } from './footer'
import { Navbar } from './navbar'

export const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <AnalyticsTracker />
      <BackgroundAudio />
    </>
  )
}