import { useEffect, useState } from 'react'
import type { IconType } from 'react-icons'
import { FiArrowRight, FiExternalLink, FiFolder, FiGithub, FiImage, FiMonitor } from 'react-icons/fi'
import styled, { keyframes } from 'styled-components'
import calvinSpaceCoverDesktop from '../../assets/Projects/calvin-space-11.jpg'
import calvinSpaceCoverMobile from '../../assets/Projects/calvin-space-21.png'
import ezspecCsharpCoverDesktop from '../../assets/Projects/ezspec-csharp-cover-11.png'
import ezspecCsharpCoverMobile from '../../assets/Projects/ezspec-csharp-cover-21.png'
import soulKnightCoverDesktop from '../../assets/Projects/soul-knight-11.png'
import soulKnightCoverMobile from '../../assets/Projects/soul-knight-21.png'
import taiwanExaminationAssignmentCoverDesktop from '../../assets/Projects/taiwan-examination-assignment-11.png'
import taiwanExaminationAssignmentCoverMobile from '../../assets/Projects/taiwan-examination-assignment-21.png'

type ProjectSource = {
  owner: string
  repo: string
}

type ProjectItem = {
  name: string
  host: 'GitHub'
  hostIcon: IconType
  href: string
  description: string
  tags: string[]
  source: ProjectSource
  desktopImageUrl?: string
  mobileImageUrl?: string
  imageAlt?: string
}

type LanguageShare = {
  name: string
  percentage: number
}

type ProjectLanguageState = {
  status: 'loading' | 'success' | 'error'
  languages: LanguageShare[]
}

const LANGUAGE_COLORS: Record<string, string> = {
  'C#': '#178600',
  'C++': '#f34b7d',
  CSS: '#663399',
  Go: '#00add8',
  HTML: '#e34c26',
  Java: '#b07219',
  JavaScript: '#f1e05a',
  Kotlin: '#a97bff',
  PHP: '#4f5d95',
  Python: '#3572a5',
  Rust: '#dea584',
  SCSS: '#c6538c',
  Shell: '#89e051',
  Swift: '#f05138',
  TypeScript: '#3178c6',
}

const LANGUAGE_FALLBACK_COLORS = ['#b07219', '#3178c6', '#178600', '#f34b7d', '#663399', '#e34c26']

const projects: ProjectItem[] = [
  {
    name: 'Calvin Space',
    host: 'GitHub',
    hostIcon: FiGithub,
    href: 'https://github.com/CalvinWan0101/calvinwan0101.github.io',
    description:
      '以 React、TypeScript 與 Vite 打造的個人作品網站，整合自我介紹、精選專案、投資紀錄與聯絡方式，並以 styled-components 建立一致的視覺體驗。',
    tags: ['React', 'TypeScript', 'Vite', 'styled-components'],
    source: {
      owner: 'CalvinWan0101',
      repo: 'calvinwan0101.github.io',
    },
    desktopImageUrl: calvinSpaceCoverDesktop,
    mobileImageUrl: calvinSpaceCoverMobile,
    imageAlt: 'Calvin Space 封面',
  },
  {
    name: 'ezSpec-CSharp',
    host: 'GitHub',
    hostIcon: FiGithub,
    href: 'https://github.com/CalvinWan0101/ezspec-csharp',
    description:
      '以 C# 實作的 BDD（行為驅動開發）測試框架，靈感來源於 Gherkin 語法。支援以接近自然語言的方式撰寫測試規格，讓業務邏輯與測試行為的描述更貼近真實需求。',
    tags: ['C#', '.NET', 'BDD', 'Testing'],
    source: {
      owner: 'CalvinWan0101',
      repo: 'ezspec-csharp',
    },
    desktopImageUrl: ezspecCsharpCoverDesktop,
    mobileImageUrl: ezspecCsharpCoverMobile,
    imageAlt: 'ezSpec-CSharp 封面',
  },
  {
    name: 'Soul Knight',
    host: 'GitHub',
    hostIcon: FiGithub,
    href: 'https://github.com/calvinwan0101/soul-knight',
    description:
      '以 C++ 復刻的 Soul Knight 地下城射擊遊戲。實作角色移動、敵人 AI、武器系統與地圖生成等核心機制，探索物件導向設計在遊戲開發中的應用。',
    tags: ['C++', 'Game Dev', 'OOP'],
    source: {
      owner: 'calvinwan0101',
      repo: 'soul-knight',
    },
    desktopImageUrl: soulKnightCoverDesktop,
    mobileImageUrl: soulKnightCoverMobile,
    imageAlt: 'Soul Knight 封面',
  },
  {
    name: 'Taiwan Examination Assignment',
    host: 'GitHub',
    hostIcon: FiGithub,
    href: 'https://github.com/calvinwan0101/taiwan-examination-assignment',
    description:
      '模擬台灣大學入學考試個人申請統一分發流程的演算法實作。以程式化方式處理志願序比對、分發優先級與錄取結果，重現真實分發機制的核心邏輯。',
    tags: ['演算法', '模擬', '資料結構'],
    source: {
      owner: 'calvinwan0101',
      repo: 'taiwan-examination-assignment',
    },
    desktopImageUrl: taiwanExaminationAssignmentCoverDesktop,
    mobileImageUrl: taiwanExaminationAssignmentCoverMobile,
    imageAlt: 'Taiwan Examination Assignment 封面',
  },
]

const normalizeLanguageBytes = (payload: Record<string, number>) => {
  const totalBytes = Object.values(payload).reduce((sum, value) => sum + value, 0)

  if (totalBytes === 0) {
    return []
  }

  return Object.entries(payload)
    .map(([name, bytes]) => ({
      name,
      percentage: (bytes / totalBytes) * 100,
    }))
    .sort((left, right) => right.percentage - left.percentage)
}

const fetchProjectLanguages = async (source: ProjectSource) => {
  const response = await fetch(`https://api.github.com/repos/${source.owner}/${source.repo}/languages`, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub languages request failed with ${response.status}`)
  }

  const payload = (await response.json()) as Record<string, number>
  return normalizeLanguageBytes(payload)
}

const createFallbackColor = (language: string) => {
  const hash = Array.from(language).reduce((sum, character) => sum + character.charCodeAt(0), 0)
  return LANGUAGE_FALLBACK_COLORS[hash % LANGUAGE_FALLBACK_COLORS.length]
}

const getLanguageColor = (language: string) => LANGUAGE_COLORS[language] ?? createFallbackColor(language)

const formatLanguagePercentage = (percentage: number) => `${percentage.toFixed(1)}%`

export const Projects = () => {
  const [projectLanguages, setProjectLanguages] = useState<Record<string, ProjectLanguageState>>(() =>
    Object.fromEntries(
      projects.map((project) => [
        project.name,
        {
          status: 'loading',
          languages: [],
        },
      ]),
    ),
  )

  useEffect(() => {
    let isCancelled = false

    const loadProjectLanguages = async () => {
      const entries = await Promise.all(
        projects.map(async (project) => {
          try {
            const languages = await fetchProjectLanguages(project.source)

            return [
              project.name,
              {
                status: 'success' as const,
                languages,
              },
            ]
          } catch {
            return [
              project.name,
              {
                status: 'error' as const,
                languages: [],
              },
            ]
          }
        }),
      )

      if (!isCancelled) {
        setProjectLanguages(Object.fromEntries(entries))
      }
    }

    void loadProjectLanguages()

    return () => {
      isCancelled = true
    }
  }, [])

  return (
    <Main>
      <HeroSection>
        <Badge>
          <FiMonitor />
          開源專案
        </Badge>
        <PageTitle>我的專案</PageTitle>
        <PageDescription>
          業餘時間累積的開發作品，涵蓋測試框架、遊戲開發與演算法實作。
        </PageDescription>
      </HeroSection>

      <ProjectsList>
        {projects.map((project) => {
          const HostIcon = project.hostIcon
          const languageState = projectLanguages[project.name]

          return (
            <ProjectCard
              key={project.name}
              href={project.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`前往 ${project.name}`}
            >
              <ProjectMedia>
                {project.desktopImageUrl ? (
                  <ProjectPicture>
                    {project.mobileImageUrl ? <source media="(max-width: 720px)" srcSet={project.mobileImageUrl} /> : null}
                    <ProjectImage src={project.desktopImageUrl} alt={project.imageAlt ?? project.name} />
                  </ProjectPicture>
                ) : (
                  <ProjectPlaceholder>
                    <PlaceholderIcon>
                      <FiImage />
                    </PlaceholderIcon>
                    <PlaceholderLabel>
                      <FiFolder />
                      {project.name}
                    </PlaceholderLabel>
                  </ProjectPlaceholder>
                )}

                <ProjectArrow>
                  <FiArrowRight />
                </ProjectArrow>
              </ProjectMedia>

              <ProjectBody>
                <ProjectTop>
                  <ProjectName>{project.name}</ProjectName>
                  <ProjectHost>
                    <HostIcon />
                    {project.host}
                  </ProjectHost>
                </ProjectTop>

                <ProjectDescription>{project.description}</ProjectDescription>

                <ProjectFooter>
                  <ProjectTags>
                    {project.tags.map((tag) => (
                      <ProjectTag key={tag}>{tag}</ProjectTag>
                    ))}
                  </ProjectTags>

                  <ProjectLinkHint>
                    <FiExternalLink />
                    檢視原始碼
                  </ProjectLinkHint>
                </ProjectFooter>

                <LanguageStats>
                  <LanguageHeader>
                    <LanguageLabel>語言組成</LanguageLabel>
                    <LanguageSummary>
                      {languageState?.status === 'loading' ? '載入中' : null}
                      {languageState?.status === 'error' ? '暫時無法取得統計' : null}
                    </LanguageSummary>
                  </LanguageHeader>

                  <LanguageBar aria-hidden="true">
                    {languageState?.status === 'success' && languageState.languages.length > 0 ? (
                      languageState.languages.map((language) => (
                        <LanguageSegment
                          key={language.name}
                          $color={getLanguageColor(language.name)}
                          $width={language.percentage}
                        />
                      ))
                    ) : (
                      <LanguageBarPlaceholder />
                    )}
                  </LanguageBar>

                  {languageState?.status === 'success' && languageState.languages.length > 0 ? (
                    <LanguageLegend>
                      {languageState.languages.map((language) => (
                        <LanguageLegendItem key={language.name}>
                          <LanguageDot $color={getLanguageColor(language.name)} />
                          <LanguageLegendName>{language.name}</LanguageLegendName>
                          <LanguageLegendValue>{formatLanguagePercentage(language.percentage)}</LanguageLegendValue>
                        </LanguageLegendItem>
                      ))}
                    </LanguageLegend>
                  ) : null}
                </LanguageStats>
              </ProjectBody>
            </ProjectCard>
          )
        })}
      </ProjectsList>
    </Main>
  )
}

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
  gap: 3rem;

  @media (max-width: 720px) {
    width: min(64rem, calc(100% - 2rem));
  }
`

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0 0.5rem;
  animation: ${fadeUp} 0.7s ease both;
`

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  width: fit-content;
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--accent);
  border-radius: 2px;
  color: var(--accent);
  background: rgba(253, 252, 248, 0.72);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;

  svg {
    font-size: 0.95rem;
  }
`

const PageTitle = styled.h1`
  margin: 0;
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  font-weight: 900;
  letter-spacing: 0.08em;
  color: var(--accent);
`

const PageDescription = styled.p`
  margin: 0;
  max-width: 36rem;
  color: var(--text-muted);
  font-size: 0.98rem;
  line-height: 1.9;
`

const ProjectsList = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const ProjectCard = styled.a`
  position: relative;
  display: flex;
  overflow: hidden;
  border: 2px solid var(--border-soft);
  border-radius: 2px;
  background: linear-gradient(180deg, rgba(253, 252, 248, 0.96), rgba(250, 246, 236, 0.96));
  box-shadow: 0 20px 40px rgba(62, 50, 44, 0.08);
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
  animation: ${fadeUp} 0.7s ease both;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 4px;
    background: var(--accent);
    transform: scaleY(0);
    transform-origin: bottom;
    transition: transform 0.25s ease;
  }

  &:hover {
    border-color: rgba(140, 46, 46, 0.45);
    box-shadow: 0 26px 50px rgba(62, 50, 44, 0.12);
    transform: translateY(-4px);
  }

  &:hover::before {
    transform: scaleY(1);
  }

  @media (max-width: 720px) {
    flex-direction: column;
  }
`

const ProjectMedia = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 280px;
  aspect-ratio: 1 / 1;
  border-right: 1px solid var(--border-soft);
  background:
    radial-gradient(circle at top, rgba(140, 46, 46, 0.12), transparent 45%),
    linear-gradient(180deg, #f3eddd 0%, #ebe0cb 100%);

  @media (max-width: 720px) {
    width: 100%;
    aspect-ratio: 2 / 1;
    border-right: 0;
    border-bottom: 1px solid var(--border-soft);
  }
`

const ProjectPicture = styled.picture`
  display: block;
  width: 100%;
  height: 100%;
`

const ProjectImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.92;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;

  ${ProjectCard}:hover & {
    opacity: 1;
    transform: scale(1.03);
  }
`

const ProjectPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  width: 100%;
  height: 100%;
  padding: 2rem;
`

const PlaceholderIcon = styled.div`
  color: rgba(140, 46, 46, 0.45);
  font-size: 2rem;
`

const PlaceholderLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(62, 50, 44, 0.7);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`

const ProjectArrow = styled.div`
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid rgba(140, 46, 46, 0.18);
  border-radius: 999px;
  background: rgba(253, 252, 248, 0.88);
  color: var(--accent);
  opacity: 0;
  transform: translateX(-4px);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;

  ${ProjectCard}:hover & {
    opacity: 1;
    transform: translateX(0);
  }
`

const ProjectBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.75rem;
`

const ProjectTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`

const ProjectName = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 900;
  letter-spacing: 0.03em;
`

const ProjectHost = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.25rem 0.6rem;
  border: 1px solid var(--border-soft);
  border-radius: 2px;
  color: var(--accent);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;

  svg {
    font-size: 0.85rem;
  }
`

const ProjectDescription = styled.p`
  margin: 0;
  color: var(--text-muted);
  font-size: 0.92rem;
  line-height: 1.85;
`

const ProjectFooter = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-top: auto;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const ProjectTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

const ProjectTag = styled.span`
  padding: 0.24rem 0.65rem;
  border: 1px solid var(--border-soft);
  border-radius: 2px;
  color: rgba(62, 50, 44, 0.74);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
`

const ProjectLinkHint = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  white-space: nowrap;
`

const LanguageStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin-top: 0.35rem;
`

const LanguageHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;

  @media (max-width: 560px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.2rem;
  }
`

const LanguageLabel = styled.span`
  color: rgba(62, 50, 44, 0.6);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`

const LanguageSummary = styled.span`
  color: rgba(62, 50, 44, 0.62);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
`

const LanguageBar = styled.div`
  overflow: hidden;
  display: flex;
  width: 100%;
  height: 0.48rem;
  border: 1px solid rgba(62, 50, 44, 0.1);
  border-radius: 999px;
  background: rgba(62, 50, 44, 0.06);
`

const LanguageSegment = styled.span<{ $color: string; $width: number }>`
  display: block;
  height: 100%;
  width: ${({ $width }) => `${$width}%`};
  background: ${({ $color }) => $color};

  &:first-child {
    box-shadow: inset 1px 0 0 rgba(255, 255, 255, 0.14);
  }
`

const LanguageBarPlaceholder = styled.span`
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(62, 50, 44, 0.08) 0%,
    rgba(140, 46, 46, 0.16) 50%,
    rgba(62, 50, 44, 0.08) 100%
  );
  background-size: 200% 100%;
  animation: ${fadeUp} 1.2s ease infinite alternate;
`

const LanguageLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem 1rem;
  margin-top: 0.15rem;
`

const LanguageLegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: rgba(62, 50, 44, 0.72);
  font-size: 0.78rem;
  font-weight: 700;
`

const LanguageDot = styled.span<{ $color: string }>`
  display: inline-block;
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 999px;
  background: ${({ $color }) => $color};
`

const LanguageLegendName = styled.span`
  color: rgba(62, 50, 44, 0.88);
`

const LanguageLegendValue = styled.span`
  color: rgba(62, 50, 44, 0.58);
  font-weight: 600;
`