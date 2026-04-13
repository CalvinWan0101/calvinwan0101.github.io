import { memo, useEffect, useRef } from 'react'

export const TradingViewQuote = memo(() => {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) return
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      symbol: 'AMEX:VT',
      colorTheme: 'light',
      isTransparent: true,
      locale: 'en',
      width: '100%',
    })
    container.current.appendChild(script)

    return () => {
      script.remove()
    }
  }, [])

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <span className="trademark">即時報價由 </span>
        <a href="https://www.tradingview.com/symbols/AMEX-VT/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">TradingView</span>
        </a>
        <span className="trademark"> 提供</span>
      </div>
    </div>
  )
})
