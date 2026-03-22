import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import App from '../App'
import { Contact } from '../apps/Contact'
import { Home } from '../apps/Home'
import { Portfolio } from '../apps/Portfolio'
import { Projects } from '../apps/Projects'
import { NotFound } from '../apps/layout/errorPage'

export const PageRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="contact" element={<Contact />} />
      <Route path="projects" element={<Projects />} />
      <Route path="portfolio" element={<Portfolio />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
)