import {
  FiArrowRight,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiMessageSquare,
} from 'react-icons/fi'
import { FaDiscord } from 'react-icons/fa6'
import type { IconType } from 'react-icons'
import styled, { keyframes } from 'styled-components'

type ContactMethod = {
  label: string
  value: string
  subtext: string
  href: string
  icon: IconType
}

const contactMethods: ContactMethod[] = [
  {
    label: 'Discord',
    value: '傳送訊息',
    subtext: '即時訊息',
    href: 'https://discord.com/users/593315109095473153',
    icon: FaDiscord,
  },
  {
    label: 'GitHub',
    value: '查看個人頁',
    subtext: '開源專案與程式碼',
    href: 'https://github.com/CalvinWan0101',
    icon: FiGithub,
  },
  {
    label: 'LinkedIn',
    value: '查看個人頁',
    subtext: '職涯經歷與專業網絡',
    href: 'https://www.linkedin.com/in/calvinwan0101',
    icon: FiLinkedin,
  },
  {
    label: 'Email',
    value: '發送郵件',
    subtext: '最直接的聯繫方式',
    href: 'mailto:calvinwan0101@gmail.com',
    icon: FiMail,
  },
]

export const Contact = () => {
  return (
    <Main>
      <HeroSection>
        <Badge>
          <BadgeIcon />
          聯絡我
        </Badge>
        <PageTitle>保持聯繫</PageTitle>
        <PageDescription>
          歡迎透過以下方式與我聯繫，無論是工作機會、技術交流，或只是打個招呼。
        </PageDescription>
      </HeroSection>

      <ContactGrid>
        {contactMethods.map((method) => {
          const Icon = method.icon

          return (
            <ContactCard
              key={method.label}
              href={method.href}
              target={method.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={method.href.startsWith('mailto:') ? undefined : 'noreferrer'}
            >
              <CardIcon>
                <Icon />
              </CardIcon>
              <CardBody>
                <CardLabel>{method.label}</CardLabel>
                <CardValue>{method.value}</CardValue>
                <CardSubtext>{method.subtext}</CardSubtext>
              </CardBody>
              <CardArrow>
                <FiArrowRight />
              </CardArrow>
            </ContactCard>
          )
        })}
      </ContactGrid>

      <LocationCard>
        <LocationInfo>
          <LocationIcon>
            <FiMapPin />
          </LocationIcon>
          <div>
            <LocationLabel>目前據點</LocationLabel>
            <LocationValue>台北，台灣</LocationValue>
            <LocationSubtext>UTC+8 · 台灣標準時間</LocationSubtext>
          </div>
        </LocationInfo>

        <MapFrame
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d231756.53481937056!2d121.36166!3d25.0443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442ac8b01f9b7b3%3A0xbde20f9cd0d87c7f!2sTaipei%2C%20Taiwan!5e0!3m2!1sen!2s!4v1"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="台北，台灣"
        />
      </LocationCard>
    </Main>
  )
}

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const Main = styled.main`
  width: min(64rem, calc(100% - 3rem));
  margin: 0 auto;
  padding: 2rem 0 5rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;

  @media (max-width: 720px) {
    width: min(64rem, calc(100% - 2rem));
  }
`

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;
  animation: ${fadeUp} 0.7s ease both;
`

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  width: fit-content;
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--accent);
  color: var(--accent);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  border-radius: 2px;
  background: rgba(253, 252, 248, 0.72);
`

const BadgeIcon = styled(FiMessageSquare)`
  font-size: 0.9rem;
`

const PageTitle = styled.h1`
  margin: 0;
  font-size: clamp(2.4rem, 6vw, 4rem);
  font-weight: 900;
  letter-spacing: 0.05em;
`

const PageDescription = styled.p`
  margin: 0;
  max-width: 36rem;
  font-size: 0.95rem;
  line-height: 1.9;
  color: var(--text-muted);
`

const ContactGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.5rem;
  animation: ${fadeUp} 0.7s ease 0.08s both;

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`

const ContactCard = styled.a`
  position: relative;
  overflow: hidden;
  min-height: 15rem;
  padding: 1.75rem;
  border: 2px solid var(--border-soft);
  border-radius: 2px;
  background:
    linear-gradient(180deg, rgba(253, 252, 248, 0.98) 0%, rgba(247, 243, 231, 0.96) 100%),
    var(--bg-card);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition:
    transform 0.18s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 2px;
    background: var(--accent);
    transition: width 0.25s ease;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: var(--accent);
    box-shadow: var(--shadow);
  }

  &:hover::after {
    width: 100%;
  }
`

const CardIcon = styled.div`
  width: 2.75rem;
  height: 2.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid var(--border-soft);
  border-radius: 2px;
  font-size: 1.1rem;
  color: var(--accent);
  transition:
    border-color 0.2s ease,
    background 0.2s ease;

  ${ContactCard}:hover & {
    border-color: var(--accent);
    background: rgba(140, 46, 46, 0.06);
  }
`

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const CardLabel = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
`

const CardValue = styled.div`
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.02em;
`

const CardSubtext = styled.div`
  font-size: 0.8rem;
  color: var(--text-muted);
`

const CardArrow = styled.div`
  margin-top: auto;
  align-self: flex-end;
  color: var(--accent);
  font-size: 1rem;
  opacity: 0;
  transform: translateX(-4px);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;

  ${ContactCard}:hover & {
    opacity: 1;
    transform: translateX(0);
  }
`

const LocationCard = styled.section`
  overflow: hidden;
  border: 2px solid var(--border-soft);
  border-radius: 2px;
  background: var(--bg-card);
  animation: ${fadeUp} 0.7s ease 0.16s both;
`

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-soft);

  @media (max-width: 560px) {
    align-items: flex-start;
  }
`

const LocationIcon = styled.div`
  width: 2.75rem;
  height: 2.75rem;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid var(--border-soft);
  border-radius: 2px;
  color: var(--accent);
  font-size: 1.1rem;
`

const LocationLabel = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
`

const LocationValue = styled.div`
  margin-top: 0.15rem;
  font-size: 1rem;
  font-weight: 900;
`

const LocationSubtext = styled.div`
  margin-top: 0.1rem;
  font-size: 0.8rem;
  color: var(--text-muted);
`

const MapFrame = styled.iframe`
  display: block;
  width: 100%;
  height: 320px;
  border: 0;
  filter: sepia(20%) contrast(0.95);
`