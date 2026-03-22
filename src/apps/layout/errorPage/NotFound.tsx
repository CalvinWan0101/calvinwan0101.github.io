import { FiArrowLeft } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'

export const NotFound = () => {
  return (
    <Shell>
      <GridDecoration aria-hidden="true" />
      <Main>
        <ContentCard>
          <ErrorCode>
            <Number>404</Number>
          </ErrorCode>

          <Divider />

          <CopyBlock>
            <Title>此頁面不存在</Title>
            <Description>
              你所尋找的頁面可能已移除、更名，
              <br />
              或從未存在於此。
            </Description>
          </CopyBlock>

          <Actions>
            <PrimaryAction to="/">
              <FiArrowLeft />
              返回主頁
            </PrimaryAction>
          </Actions>
        </ContentCard>
      </Main>
    </Shell>
  )
}

const reveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const Shell = styled.div`
  position: relative;
  isolation: isolate;
`

const GridDecoration = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.06;
  background-image:
    linear-gradient(to right, rgba(140, 46, 46, 0.22) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(140, 46, 46, 0.22) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(circle at center, black 38%, transparent 100%);
`

const Main = styled.main`
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 12rem);
  display: grid;
  place-items: center;
  padding: 4rem 1.5rem 5rem;

  @media (max-width: 720px) {
    min-height: calc(100vh - 10rem);
    padding-inline: 1rem;
  }
`

const ContentCard = styled.section`
  width: min(100%, 42rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 3rem clamp(1.5rem, 3vw, 2.75rem);
  text-align: center;
  animation: ${reveal} 0.6s ease both;

  @media (max-width: 720px) {
    gap: 1.5rem;
    padding-block: 2.5rem;
  }
`

const ErrorCode = styled.div`
  position: relative;
  line-height: 1;
  user-select: none;
`

const Number = styled.span`
  display: block;
  font-size: clamp(7rem, 22vw, 12rem);
  font-weight: 900;
  letter-spacing: 0.05em;
  color: transparent;
  -webkit-text-stroke: 2px var(--accent);
`

const Divider = styled.div`
  width: 3rem;
  height: 2px;
  background: var(--accent);
  opacity: 0.4;
`

const CopyBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.9rem;
`

const Title = styled.h1`
  margin: 0;
  font-size: clamp(1.5rem, 2vw, 2rem);
  font-weight: 900;
  letter-spacing: 0.1em;
`

const Description = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.9;
  color: var(--text-muted);
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.9rem;
`

const actionStyles = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  min-width: 10.5rem;
  padding: 0.8rem 1.4rem;
  border: 2px solid var(--accent);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`

const PrimaryAction = styled(Link)`
  ${actionStyles}
  background: var(--accent);
  color: var(--bg);

  &:hover {
    background: #702424;
    border-color: #702424;
  }
`
