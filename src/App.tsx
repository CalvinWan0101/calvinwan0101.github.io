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
    font-family: 'Noto Serif TC', serif;
    background:
      radial-gradient(circle at top, rgba(140, 46, 46, 0.08), transparent 30%),
      linear-gradient(180deg, #f7f3e7 0%, var(--bg) 22%, #efe8d2 100%);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
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
