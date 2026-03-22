import { Layout } from './apps/layout/Layout'
import styled, { createGlobalStyle } from 'styled-components'

function App() {
  return (
    <>
      <GlobalStyle />
      <Page>
        <Layout />
      </Page>
    </>
  )
}

export default App

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;700;900&display=swap');

  :root {
    --bg: #f4f1e1;
    --bg-card: #fdfcf8;
    --text: #3e322c;
    --accent: #8c2e2e;
    --border-soft: rgba(140, 46, 46, 0.2);
    --text-muted: rgba(62, 50, 44, 0.6);
    --shadow: 0 24px 60px rgba(62, 50, 44, 0.12);
    --paper-fiber-light: rgba(255, 255, 255, 0.18);
    --paper-fiber-dark: rgba(110, 94, 78, 0.06);
    --paper-wash: rgba(140, 46, 46, 0.05);
  }

  * {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    min-height: 100vh;
    position: relative;
    font-family: 'Noto Serif TC', serif;
    background:
      radial-gradient(circle at top, rgba(140, 46, 46, 0.08), transparent 30%),
      radial-gradient(circle at 15% 18%, rgba(255, 255, 255, 0.5), transparent 24%),
      radial-gradient(circle at 82% 12%, rgba(140, 46, 46, 0.04), transparent 22%),
      linear-gradient(180deg, #f7f3e7 0%, var(--bg) 22%, #efe8d2 100%);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  body::before,
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
  }

  body::before {
    z-index: 0;
    opacity: 0.8;
    background:
      repeating-linear-gradient(
        96deg,
        transparent 0 10px,
        var(--paper-fiber-light) 10px 11px,
        transparent 11px 23px
      ),
      repeating-linear-gradient(
        6deg,
        transparent 0 14px,
        var(--paper-fiber-dark) 14px 15px,
        transparent 15px 29px
      ),
      linear-gradient(115deg, rgba(255, 255, 255, 0.18), transparent 34%, rgba(62, 50, 44, 0.04) 62%, transparent 100%);
    mix-blend-mode: multiply;
  }

  body::after {
    z-index: 0;
    opacity: 0.55;
    background:
      radial-gradient(circle at 22% 14%, rgba(255, 255, 255, 0.22), transparent 0 18%),
      radial-gradient(circle at 74% 24%, var(--paper-wash), transparent 0 16%),
      radial-gradient(circle at 50% 100%, rgba(110, 94, 78, 0.08), transparent 0 28%);
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img {
    display: block;
    max-width: 100%;
  }

  #root {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: none;
    min-height: 100vh;
    margin: 0;
    border: 0;
    text-align: left;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: #d5cbbd;
    border-radius: 0;
  }
`

const Page = styled.div`
  min-height: 100vh;
`
