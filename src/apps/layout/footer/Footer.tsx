import { FiGithub, FiLinkedin } from 'react-icons/fi'
import styled from 'styled-components'

const footerLinks = [
  { href: 'https://github.com/CalvinWan0101', label: 'GitHub', icon: FiGithub },
  { href: 'https://linkedin.com/in/calvinwan0101', label: 'LinkedIn', icon: FiLinkedin },
]

export const Footer = () => {
  return (
    <FooterShell>
      <FooterInner>
        <FooterText>© 2026 萬祥瑞。保留所有權利。</FooterText>
        <FooterLinks>
          {footerLinks.map((link) => {
            const LinkIcon = link.icon

            return (
              <FooterLink
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
              >
                <LinkIcon />
              </FooterLink>
            )
          })}
        </FooterLinks>
      </FooterInner>
    </FooterShell>
  )
}

const FooterShell = styled.footer`
  margin-top: auto;
  padding: 2rem 0;
  border-top: 4px solid var(--accent);
`

const FooterInner = styled.div`
  width: min(64rem, calc(100% - 3rem));
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }

  @media (max-width: 720px) {
    width: min(64rem, calc(100% - 2rem));
  }
`

const FooterText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 700;
  opacity: 0.7;
`

const FooterLinks = styled.div`
  display: flex;
  gap: 1rem;
`

const FooterLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text);
  font-size: 1.25rem;
  transition:
    color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    color: var(--accent);
    transform: translateY(-2px);
  }
`