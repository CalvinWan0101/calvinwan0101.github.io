import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import { AnalyticsTracker } from './analytics'
import { BackgroundAudio } from './audio'
import { Footer } from './footer'
import { Navbar } from './navbar'

export const Layout = () => {
  return (
    <LayoutShell>
      <Navbar />
      <Outlet />
      <Footer />
      <AnalyticsTracker />
      <BackgroundAudio />
    </LayoutShell>
  )
}

const LayoutShell = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`
