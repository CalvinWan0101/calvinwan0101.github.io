import type { IconType } from 'react-icons'
import avatar from '../../assets/avatar.png'
import seal from '../../assets/seal.png'
import {
  FiBookOpen,
  FiBriefcase,
  FiCode,
  FiDatabase,
  FiGlobe,
  FiGrid,
  FiMapPin,
  FiServer,
  FiUser,
} from 'react-icons/fi'
import styled, { keyframes } from 'styled-components'

type Skill = {
  corner: string
  title: string
  icon: IconType
  items: string[]
}

type TimelineEntry = {
  company?: string
  title: string
  period: string
  items?: string[]
  active?: boolean
  compact?: boolean
}

type EducationEntry = {
  company?: string
  title: string
  period: string
  active?: boolean
  compact?: boolean
}

const profile = {
  avatar,
  name: '萬祥瑞',
  badge: '軟體工程師 @ 叡揚資訊',
  location: '台北，台灣',
  birthYear: '生於 2003 年',
}

const tags = ['C#', '.NET', 'DDD', 'React']

const skills: Skill[] = [
  {
    corner: '壹',
    title: '後端開發',
    icon: FiServer,
    items: ['C#', 'ASP.NET Core', 'ABP Framework', 'Java / Spring Boot'],
  },
  {
    corner: '貳',
    title: '前端開發',
    icon: FiGlobe,
    items: ['React', 'TypeScript', 'HTML / CSS / JavaScript'],
  },
  {
    corner: '參',
    title: '資料與雲端',
    icon: FiDatabase,
    items: ['MySQL', 'Microsoft SQL Server', 'Microsoft Azure'],
  },
  {
    corner: '肆',
    title: '系統架構',
    icon: FiGrid,
    items: ['Domain-Driven Design', 'Test-Driven Design', 'Agile Development'],
  },
]

const experiences: TimelineEntry[] = [
  {
    company: '叡揚資訊 (Galaxy Software Services)',
    title: '程式設計師 (Full-time)',
    period: '2025/06 - 至今',
    items: [
      '使用 C#、.NET 與 ABP Framework 構建強健的後端服務。',
      '前端採用 React 與 TypeScript 進行開發。',
      '實踐 Domain-Driven Design (DDD) 進行系統架構設計，確保業務邏輯的清晰與可維護性。',
      '在 Agile 開發流程下運作，持續交付高價值的軟體功能。',
    ],
    active: true,
  },
  {
    company: '叡揚資訊 (Galaxy Software Services)',
    title: '助理程式設計師 (Internship)',
    period: '2024/07 - 2025/06',
    items: ['協助開發企業級系統，熟悉現有程式與架構。', '參與前後端開發。'],
  },
  {
    company: '國立臺北科技大學',
    title: '物件導向程式設計課程助教',
    period: '2024/02 - 2024/06',
    items: [
      '協助教授準備與批改作業及考試，支援課程教學運作。',
      '回應學生在課程內容與作業實作上的問題，協助排除學習障礙。',
    ],
  },
  {
    company: '國立臺北科技大學 軟體工程實驗室',
    title: 'ezKanban Team',
    period: '2023/07 - 2024/06',
    items: [
      '與 ezKanban 團隊進行 mob programming，參與實際專案開發與協作。',
      '在專案實作中學習並應用 Domain-Driven Design (DDD)、Test-Driven Design (TDD) 以及 Clean Architecture。',
    ],
  },
]

const education: EducationEntry[] = [
  {
    company: '國立臺北科技大學',
    title: '電資學士班（主修資訊工程）',
    period: '2021/09 - 2025/07',
    active: true,
  },
  {
    title: '嘉義縣協同中學高中部',
    period: '2017/09 - 2020/07',
    compact: true,
  },
  {
    title: '嘉義縣協同中學國中部',
    period: '2015/02 - 2017/07',
    compact: true,
  },
  {
    title: '廣州中山大學附屬外國語實驗中學',
    period: '2014/09 - 2015/01',
    compact: true,
  },
  {
    title: '廣州中山大學附屬黃埔實驗小學',
    period: '2008/09 - 2014/07',
    compact: true,
  },
]

const sectionIcons = {
  skills: FiCode,
  experience: FiBriefcase,
  education: FiBookOpen,
  location: FiMapPin,
  user: FiUser,
}

export const Home = () => {
  const SkillsIcon = sectionIcons.skills
  const ExperienceIcon = sectionIcons.experience
  const EducationIcon = sectionIcons.education
  const LocationIcon = sectionIcons.location
  const UserIcon = sectionIcons.user

  return (
    <Main>
      <HeroSection id="home">
        <HeroText>
          <Badge>
            <PingDot />
            {profile.badge}
          </Badge>
          <Name>{profile.name}</Name>
          <Meta>
            <MetaItem>
              <MetaIcon>
                <LocationIcon />
              </MetaIcon>
              {profile.location}
            </MetaItem>
            <MetaItem>
              <MetaIcon>
                <UserIcon />
              </MetaIcon>
              {profile.birthYear}
            </MetaItem>
          </Meta>
          <Tags>
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Tags>
        </HeroText>

        <AvatarCluster>
          <AvatarFrame>
            <Avatar src={profile.avatar} alt="Calvin Wan" />
          </AvatarFrame>
          <AvatarSeal aria-hidden="true">
            <AvatarSealImage src={seal} alt="" />
          </AvatarSeal>
        </AvatarCluster>
      </HeroSection>

      <Section id="skills">
        <SectionHeader>
          <SectionIcon>
            <SkillsIcon />
          </SectionIcon>
          <SectionTitle>技藝專長</SectionTitle>
        </SectionHeader>

        <SkillsGrid>
          {skills.map((skill) => {
            const SkillIcon = skill.icon

            return (
              <SkillCard key={skill.title}>
                <Corner>{skill.corner}</Corner>
                <SkillIconWrap>
                  <SkillIcon />
                </SkillIconWrap>
                <CardTitle>{skill.title}</CardTitle>
                <PlainList>
                  {skill.items.map((item) => (
                    <ListItem key={item}>{item}</ListItem>
                  ))}
                </PlainList>
              </SkillCard>
            )
          })}
        </SkillsGrid>
      </Section>

      <Section id="experience">
        <SectionHeader>
          <SectionIcon>
            <ExperienceIcon />
          </SectionIcon>
          <SectionTitle>過往經歷</SectionTitle>
        </SectionHeader>

        <Timeline>
          {experiences.map((entry) => (
            <TimelineItem key={`${entry.title}-${entry.period}`} $active={entry.active}>
              <TimelineDot $active={entry.active}>
                <TimelineInner $active={entry.active} />
              </TimelineDot>
              <TimelineCard $active={entry.active} $hasItems={Boolean(entry.items?.length)}>
                {entry.company ? <Company $active={entry.active}>{entry.company}</Company> : null}
                <TimelineTitle>{entry.title}</TimelineTitle>
                <Period $hasItems={Boolean(entry.items?.length)}>{entry.period}</Period>
                {entry.items ? (
                  <TimelineList>
                    {entry.items.map((item) => (
                      <TimelineListItem key={item} $active={entry.active}>
                        {item}
                      </TimelineListItem>
                    ))}
                  </TimelineList>
                ) : null}
              </TimelineCard>
            </TimelineItem>
          ))}
        </Timeline>
      </Section>

      <Section id="education">
        <SectionHeader>
          <SectionIcon>
            <EducationIcon />
          </SectionIcon>
          <SectionTitle>教育背景</SectionTitle>
        </SectionHeader>

        <Timeline>
          {education.map((entry) => (
            <TimelineItem
              key={`${entry.title}-${entry.period}`}
              $active={entry.active}
              $compact={entry.compact}
            >
              <TimelineDot $active={entry.active} $compact={entry.compact}>
                <TimelineInner $active={entry.active} $compact={entry.compact} />
              </TimelineDot>
              <TimelineCard
                $active={entry.active}
                $compact={entry.compact}
              >
                {entry.company ? <Company $active={entry.active}>{entry.company}</Company> : null}
                <TimelineTitle $compact={entry.compact}>{entry.title}</TimelineTitle>
                <Period $compact={entry.compact}>{entry.period}</Period>
              </TimelineCard>
            </TimelineItem>
          ))}
        </Timeline>
      </Section>
    </Main>
  )
}

const ping = keyframes`
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
`

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
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
  gap: 6rem;

  @media (max-width: 720px) {
    width: min(64rem, calc(100% - 2rem));
    gap: 4.5rem;
  }
`

const Section = styled.section`
  scroll-margin-top: 5.5rem;
  animation: ${fadeUp} 0.7s ease both;
`

const HeroSection = styled(Section)`
  min-height: calc(100vh - 6rem);
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  padding-top: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`

const HeroText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;

  @media (min-width: 768px) {
    align-items: flex-start;
    text-align: left;
  }
`

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--accent);
  color: var(--accent);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  border-radius: 2px;
  background: rgba(253, 252, 248, 0.72);
`

const PingDot = styled.span`
  position: relative;
  display: inline-flex;
  width: 0.5rem;
  height: 0.5rem;

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 999px;
    background: var(--accent);
  }

  &::before {
    animation: ${ping} 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
    opacity: 0.75;
  }
`

const Name = styled.h1`
  margin: 0.5rem 0;
  font-size: clamp(3rem, 8vw, 4.5rem);
  font-weight: 900;
  letter-spacing: 0.2em;
  color: var(--accent);
`

const Meta = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  padding-top: 1.5rem;
  margin-top: 0.5rem;
  border-top: 1px solid var(--border-soft);
  font-size: 0.875rem;
  font-weight: 700;

  @media (min-width: 768px) {
    justify-content: flex-start;
  }
`

const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`

const MetaIcon = styled.span`
  color: var(--accent);
  font-size: 1.2rem;
`

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.5rem;

  @media (min-width: 768px) {
    justify-content: flex-start;
  }
`

const Tag = styled.span`
  padding: 0.375rem 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid rgba(62, 50, 44, 0.3);
  border-radius: 2px;
  letter-spacing: 0.1em;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--bg);
    transform: translateY(-2px);
  }
`

const AvatarCluster = styled.div`
  position: relative;
  display: grid;
  place-items: center;
`

const AvatarFrame = styled.div`
  position: relative;
  z-index: 1;
  width: 11rem;
  height: 11rem;
  padding: 0.55rem;
  border: 4px solid var(--accent);
  border-radius: 50%;
  box-shadow: var(--shadow);
  background:
    radial-gradient(circle at 30% 30%, rgba(140, 46, 46, 0.18), transparent 45%),
    var(--bg-card);

  @media (min-width: 768px) {
    width: 15rem;
    height: 15rem;
  }
`

const AvatarSeal = styled.div`
  position: absolute;
  right: -0.15rem;
  bottom: -0.1rem;
  z-index: 2;
  width: 3.2rem;
  height: 3.2rem;
  padding: 0.2rem;
  border: 2px solid var(--accent);
  background: var(--bg-card);
  box-shadow: 0 10px 18px rgba(140, 46, 46, 0.12);

  @media (min-width: 768px) {
    right: -0.2rem;
    bottom: -0.15rem;
    width: 4rem;
    height: 4rem;
    padding: 0.24rem;
  }
`

const AvatarSealImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  opacity: 0.94;

  @media (min-width: 768px) {
    opacity: 0.96;
  }
`

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-soft);
`

const SectionIcon = styled.span`
  color: var(--accent);
  font-size: 1.5rem;
  display: inline-flex;
`

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: 0.15em;
`

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`

const SkillCard = styled.article`
  position: relative;
  padding: 1.5rem;
  background: rgba(253, 252, 248, 0.92);
  border: 2px solid var(--border-soft);
  border-radius: 2px;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    border-color: var(--accent);
    transform: translateY(-4px);
    box-shadow: var(--shadow);
  }
`

const Corner = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent);
  border-left: 1px solid var(--border-soft);
  border-bottom: 1px solid var(--border-soft);
  background: var(--bg);
`

const SkillIconWrap = styled.span`
  display: inline-flex;
  margin-bottom: 1rem;
  color: var(--accent);
  font-size: 2rem;
`

const CardTitle = styled.h3`
  margin: 0 0 1rem;
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: 0.05em;
`

const PlainList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
`

const ListItem = styled.li`
  font-size: 0.875rem;
  font-weight: 500;
`

const Timeline = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 1.25rem;
    width: 2px;
    background: var(--border-soft);
    transform: translateX(-50%);
  }
`

const TimelineItem = styled.article<{ $active?: boolean; $compact?: boolean }>`
  position: relative;
  display: flex;
  align-items: flex-start;
`

const TimelineDot = styled.div<{ $active?: boolean; $compact?: boolean }>`
  position: absolute;
  left: ${props => (props.$compact ? '0.5rem' : '0')};
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => (props.$compact ? '1.5rem' : '2.5rem')};
  height: ${props => (props.$compact ? '1.5rem' : '2.5rem')};
  margin-top: ${props => (props.$compact ? '0.35rem' : '0.25rem')};
  border: 2px solid ${props => (props.$active ? 'var(--accent)' : 'var(--text-muted)')};
  border-radius: 2px;
  background: var(--bg);
`

const TimelineInner = styled.div<{ $active?: boolean; $compact?: boolean }>`
  width: ${props => (props.$compact ? '0.5rem' : '0.75rem')};
  height: ${props => (props.$compact ? '0.5rem' : '0.75rem')};
  background: ${props => (props.$active ? 'var(--accent)' : 'var(--text-muted)')};
`

const TimelineCard = styled.div<{ $active?: boolean; $compact?: boolean; $hasItems?: boolean }>`
  width: ${props => (props.$compact ? 'calc(100% - 2.5rem)' : 'calc(100% - 3.5rem)')};
  margin-left: ${props => (props.$compact ? '2.5rem' : '3.5rem')};
  padding: ${props => {
    if (props.$compact) return '0.55rem 1rem'
    return props.$hasItems ? '1.5rem' : '1.25rem 1.5rem'
  }};
  display: flex;
  flex-direction: ${props => (props.$compact ? 'row' : 'column')};
  align-items: ${props => (props.$compact ? 'baseline' : 'flex-start')};
  justify-content: ${props => (props.$compact ? 'space-between' : 'flex-start')};
  gap: ${props => (props.$compact ? '1rem' : '0')};
  background: ${props => (props.$compact ? 'transparent' : 'rgba(253, 252, 248, 0.92)')};
  border: ${props => {
    if (props.$compact) return 'none'
    return props.$active ? '2px solid var(--accent)' : '1px solid rgba(62, 50, 44, 0.15)'
  }};
  border-radius: 2px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${props => (props.$compact ? '0.35rem' : '0')};
  }
`

const Company = styled.div<{ $active?: boolean }>`
  color: ${props => (props.$active ? 'var(--accent)' : 'var(--text-muted)')};
  font-weight: 700;
  letter-spacing: 0.1em;
`

const TimelineTitle = styled.h3<{ $compact?: boolean }>`
  margin: ${props => (props.$compact ? '0' : '0.25rem 0 0')};
  font-size: ${props => (props.$compact ? '0.875rem' : '1.125rem')};
  font-weight: ${props => (props.$compact ? 700 : 900)};
  opacity: ${props => (props.$compact ? 0.7 : 1)};
`

const Period = styled.div<{ $compact?: boolean; $hasItems?: boolean }>`
  display: inline-block;
  margin: ${props => {
    if (props.$compact) return '0'
    return props.$hasItems ? '0.75rem 0 1rem' : '0.75rem 0 0'
  }};
  padding-bottom: ${props => {
    if (props.$compact) return '0'
    return props.$hasItems ? '0.5rem' : '0'
  }};
  border-bottom: ${props => {
    if (props.$compact || !props.$hasItems) return 'none'
    return '1px solid var(--border-soft)'
  }};
  font-size: ${props => (props.$compact ? '0.75rem' : '0.875rem')};
  font-weight: 700;
  opacity: ${props => (props.$compact ? 0.45 : 0.8)};
  white-space: ${props => (props.$compact ? 'nowrap' : 'normal')};
`

const TimelineList = styled(PlainList)`
  gap: 0.5rem;
`

const TimelineListItem = styled.li<{ $active?: boolean }>`
  position: relative;
  padding-left: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.75;

  &::before {
    content: '';
    position: absolute;
    top: 0.72rem;
    left: 0;
    width: 6px;
    height: 6px;
    background: ${props => (props.$active ? 'var(--accent)' : 'var(--text-muted)')};
  }
`