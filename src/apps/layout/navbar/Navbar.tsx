import { useState } from 'react'
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom'
import styled from 'styled-components'

const navigation = [
  { href: '/', label: '首頁' },
  { href: '/projects', label: '專案' },
  { href: '/portfolio', label: '投資' },
  { href: '/contact', label: '聯繫' },
]

export const Navbar = () => {
  const location = useLocation()

  return <NavbarContent key={location.pathname} />
}

const NavbarContent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <Header>
      <NavInner>
        <MenuButton
          type="button"
          aria-label={isMenuOpen ? '關閉導覽選單' : '開啟導覽選單'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <MenuIcon aria-hidden="true" $isOpen={isMenuOpen}>
            <span />
            <span />
            <span />
          </MenuIcon>
        </MenuButton>
        <Nav id="mobile-navigation" $isOpen={isMenuOpen}>
          {navigation.map((item) => (
            item.href.startsWith('/') ? (
              <NavRouteLink
                key={item.href}
                to={item.href}
                end={item.href === '/'}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavRouteLink>
            ) : (
              <NavAnchor key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
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
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  @media (max-width: 720px) {
    width: min(64rem, calc(100% - 2rem));
    justify-content: flex-end;
  }
`

const MenuButton = styled.button`
  display: none;
  border: 0;
  background: transparent;
  padding: 0;
  color: var(--ink);
  cursor: pointer;

  @media (max-width: 720px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    margin-left: auto;
    border-radius: 999px;
    background: rgba(23, 30, 28, 0.06);
  }
`

const MenuIcon = styled.span<{ $isOpen: boolean }>`
  position: relative;
  width: 1.25rem;
  height: 1rem;
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;

  span {
    display: block;
    width: 100%;
    height: 2px;
    border-radius: 999px;
    background: currentColor;
    transition: transform 0.2s ease, opacity 0.2s ease;
    transform-origin: center;
  }

  span:nth-child(1) {
    transform: ${({ $isOpen }) => ($isOpen ? 'translateY(0.4375rem) rotate(45deg)' : 'none')};
  }

  span:nth-child(2) {
    opacity: ${({ $isOpen }) => ($isOpen ? 0 : 1)};
  }

  span:nth-child(3) {
    transform: ${({ $isOpen }) => ($isOpen ? 'translateY(-0.4375rem) rotate(-45deg)' : 'none')};
  }
`

const Nav = styled.nav<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 720px) {
    position: absolute;
    top: calc(100% + 0.75rem);
    right: 0;
    width: max-content;
    max-width: calc(100vw - 2rem);
    padding: 0.65rem;
    gap: 0.25rem;
    flex-direction: column;
    align-items: flex-end;
    border: 1px solid rgba(23, 30, 28, 0.14);
    border-radius: 1.25rem;
    background: rgba(244, 241, 225, 0.98);
    box-shadow: 0 1rem 2.5rem rgba(23, 30, 28, 0.12);
    opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
    transform: ${({ $isOpen }) => ($isOpen ? 'translateY(0)' : 'translateY(-0.5rem)')};
    pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
`

const linkStyles = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: var(--accent);
  }

  &.active {
    color: var(--accent);
  }

  @media (min-width: 721px) {
    &.active {
      border-bottom: 2px solid var(--accent);
      padding-bottom: 2px;
    }
  }

  @media (max-width: 720px) {
    width: auto;
    justify-content: center;
    align-self: flex-end;
    white-space: nowrap;
    padding: 0.5rem 0.75rem;
    border-radius: 999px;

    &:hover,
    &.active {
      background: rgba(180, 99, 62, 0.12);
    }
  }
`

const NavRouteLink = styled(RouterNavLink)`
  ${linkStyles}
`

const NavAnchor = styled.a`
  ${linkStyles}
`