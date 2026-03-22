import { NavLink as RouterNavLink } from 'react-router-dom'
import styled from 'styled-components'

const navigation = [
  { href: '/', label: '首頁' },
  { href: '/projects', label: '專案' },
  { href: '/portfolio', label: '投資' },
  { href: '/contact', label: '聯繫' },
]

export const Navbar = () => {
  return (
    <Header>
      <NavInner>
        <Nav>
          {navigation.map((item) => (
            item.href.startsWith('/') ? (
              <NavRouteLink key={item.href} to={item.href} end={item.href === '/'}>
                {item.label}
              </NavRouteLink>
            ) : (
              <NavAnchor key={item.href} href={item.href}>
                {item.label}
              </NavAnchor>
            )
          ))}
        </Nav>
      </NavInner>
    </Header>
  )
}

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 2px solid var(--accent);
  background: rgba(244, 241, 225, 0.9);
  backdrop-filter: blur(12px);
`

const NavInner = styled.div`
  width: min(64rem, calc(100% - 3rem));
  height: 4rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  @media (max-width: 720px) {
    width: min(64rem, calc(100% - 2rem));
    justify-content: center;
  }
`

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 720px) {
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }
`

const linkStyles = `
  font-size: 0.875rem;
  font-weight: 700;
  transition: color 0.2s ease;

  &:hover {
    color: var(--accent);
  }

  &.active {
    color: var(--accent);
    border-bottom: 2px solid var(--accent);
    padding-bottom: 2px;
  }
`

const NavRouteLink = styled(RouterNavLink)`
  ${linkStyles}
`

const NavAnchor = styled.a`
  ${linkStyles}
`