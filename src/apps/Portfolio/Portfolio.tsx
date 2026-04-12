import { Fragment, useState } from 'react'
import { FiArrowUpRight, FiTrendingUp } from 'react-icons/fi'
import styled, { keyframes } from 'styled-components'
import { TradingViewOverview } from './TradingViewOverview'
import { TradingViewQuote } from './TradingViewQuote'

type SummaryCardItem = {
  label: string
  value: string
  unit: string
  active?: boolean
}

type ChartPoint = {
  x: number
  y: number
  date: string
  sharesLabel: string
  priceLabel: string
  deltaFromAverage: number
}

type AxisLabel = {
  label: string
  y: number
  strong?: boolean
}

type MonthLabel = {
  x: number
  label: string
}

type PurchaseEntry = {
  date: string
  shares: string
  price: string
}

type PurchaseGroup = {
  month: string
  entries: PurchaseEntry[]
}

type ParsedPurchaseEntry = {
  date: string
  shares: number
  price: number
  timestamp: number
  month: number
  sharesLabel: string
  priceLabel: string
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const sharesFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 5,
  maximumFractionDigits: 5,
  useGrouping: false,
})

const axisValueFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

const percentFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const parseCurrency = (value: string) => Number(value.replace('$', ''))

const describeDeltaFromAverage = (delta: number) => {
  if (Math.abs(delta) < 0.005) {
    return '與平均成本幾乎持平'
  }

  const formattedDelta = `${percentFormatter.format(Math.abs(delta))}%`

  return delta > 0 ? `比平均成本高 ${formattedDelta}` : `比平均成本低 ${formattedDelta}`
}

const parseDate = (value: string) => {
  const [year, month, day] = value.split('/').map(Number)
  return new Date(year, month - 1, day)
}

const createMonthName = (month: number) =>
  ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'][
  month - 1
  ]

const getNiceStep = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) {
    return 1
  }

  const magnitude = 10 ** Math.floor(Math.log10(value))
  const normalized = value / magnitude

  if (normalized <= 1) {
    return magnitude
  }

  if (normalized <= 2) {
    return 2 * magnitude
  }

  if (normalized <= 5) {
    return 5 * magnitude
  }

  return 10 * magnitude
}

const chartLeft = 55
const chartRight = 585
const chartTop = 15
const chartBottom = 135
const chartWidth = chartRight - chartLeft
const chartHeight = chartBottom - chartTop
const desiredYAxisTickCount = 8

const purchaseHistory: PurchaseGroup[] = [
  {
    month: '2026 年 4 月',
    entries: [
      { date: '2026/04/06', shares: '1.40090', price: '$139.910013' },
    ],
  },
  {
    month: '2026 年 3 月',
    entries: [
      { date: '2026/03/27', shares: '1.00000', price: '$135.36' },
      { date: '2026/03/25', shares: '1.40247', price: '$139.753241' },
      { date: '2026/03/20', shares: '1.00000', price: '$137.41' },
      { date: '2026/03/16', shares: '1.38741', price: '$141.270487' },
      { date: '2026/03/09', shares: '1.00000', price: '$139.75' },
      { date: '2026/03/06', shares: '1.00000', price: '$142.43' },
      { date: '2026/03/05', shares: '1.37359', price: '$144.147559' },
      { date: '2026/03/03', shares: '1.00000', price: '$142.91' },
    ],
  },
  {
    month: '2026 年 2 月',
    entries: [
      { date: '2026/02/25', shares: '1.21921', price: '$148.457253' },
      { date: '2026/02/17', shares: '1.24151', price: '$145.79' },
      { date: '2026/02/09', shares: '1.22803', price: '$146.575899' },
    ],
  },
  {
    month: '2026 年 1 月',
    entries: [
      { date: '2026/01/30', shares: '1.00000', price: '$146.13' },
      { date: '2026/01/14', shares: '1.00000', price: '$144.57' },
      { date: '2026/01/08', shares: '1.00000', price: '$143.42' },
      { date: '2026/01/05', shares: '1.00000', price: '$142.835' },
    ],
  },
]

const purchaseEntries: ParsedPurchaseEntry[] = purchaseHistory.flatMap(({ entries }) =>
  entries.map((entry) => {
    const date = parseDate(entry.date)

    return {
      date: entry.date,
      shares: Number(entry.shares),
      price: parseCurrency(entry.price),
      timestamp: date.getTime(),
      month: date.getMonth() + 1,
      sharesLabel: entry.shares,
      priceLabel: entry.price,
    }
  }),
)

const chartEntries = [...purchaseEntries].sort((left, right) => left.timestamp - right.timestamp)

const totalShares = purchaseEntries.reduce((sum, entry) => sum + entry.shares, 0)
const totalInvested = purchaseEntries.reduce(
  (sum, entry) => sum + entry.shares * entry.price,
  0,
)
const averagePurchasePrice = totalShares === 0 ? 0 : totalInvested / totalShares

const firstChartEntry = chartEntries[0]
const lastChartEntry = chartEntries[chartEntries.length - 1]
const chartStartDate = firstChartEntry
  ? new Date(new Date(firstChartEntry.timestamp).getFullYear(), new Date(firstChartEntry.timestamp).getMonth(), 1)
  : new Date()
const chartEndDate = lastChartEntry
  ? new Date(new Date(lastChartEntry.timestamp).getFullYear(), new Date(lastChartEntry.timestamp).getMonth() + 1, 0)
  : new Date(chartStartDate)
const minTimestamp = chartStartDate.getTime()
const maxTimestamp = chartEndDate.getTime()
const timestampRange = maxTimestamp - minTimestamp
const minPrice = Math.min(...chartEntries.map((entry) => entry.price))
const maxPrice = Math.max(...chartEntries.map((entry) => entry.price))
const rawYAxisStep =
  chartEntries.length > 1
    ? (maxPrice - minPrice) / Math.max(desiredYAxisTickCount - 1, 1)
    : maxPrice || 1
const yAxisStep = getNiceStep(rawYAxisStep)
const yAxisMin = Math.floor(minPrice / yAxisStep) * yAxisStep
const yAxisMax = Math.ceil(maxPrice / yAxisStep) * yAxisStep || yAxisStep
const yAxisRange = yAxisMax - yAxisMin || yAxisStep

const toChartX = (timestamp: number) => {
  if (timestampRange === 0) {
    return chartLeft + chartWidth / 2
  }

  return chartLeft + ((timestamp - minTimestamp) / timestampRange) * chartWidth
}

const toChartY = (price: number) => chartTop + ((yAxisMax - price) / yAxisRange) * chartHeight

const chartPoints: ChartPoint[] = chartEntries.map((entry) => ({
  x: toChartX(entry.timestamp),
  y: toChartY(entry.price),
  date: entry.date,
  sharesLabel: entry.sharesLabel,
  priceLabel: entry.priceLabel,
  deltaFromAverage: averagePurchasePrice === 0 ? 0 : ((entry.price - averagePurchasePrice) / averagePurchasePrice) * 100,
}))

const yAxisValues: number[] = []
for (let value = yAxisMax; value >= yAxisMin - yAxisStep / 2; value -= yAxisStep) {
  yAxisValues.push(Number(value.toFixed(4)))
}

const yAxisLabels: AxisLabel[] = yAxisValues.map((value, index) => ({
  label: axisValueFormatter.format(value),
  y: toChartY(value),
  strong: index === yAxisValues.length - 1,
}))

const monthStarts: Date[] = []
if (firstChartEntry && lastChartEntry) {
  const cursor = new Date(chartStartDate)
  const endMonth = new Date(chartEndDate.getFullYear(), chartEndDate.getMonth(), 1)

  while (cursor <= endMonth) {
    monthStarts.push(new Date(cursor))
    cursor.setMonth(cursor.getMonth() + 1)
  }
}

const monthMarkers: number[] = monthStarts
  .slice(1)
  .map((monthStart) => monthStart.getTime())
  .filter((timestamp) => timestamp >= minTimestamp && timestamp <= maxTimestamp)
  .map(toChartX)

const monthLabels: MonthLabel[] = monthStarts.map((monthStart) => {
  const monthStartTimestamp = Math.max(monthStart.getTime(), minTimestamp)
  const nextMonthStart = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1).getTime()
  const monthEndTimestamp = Math.min(nextMonthStart, maxTimestamp)
  const midpoint = monthStartTimestamp + (monthEndTimestamp - monthStartTimestamp) / 2

  return {
    x: toChartX(midpoint),
    label: createMonthName(monthStart.getMonth() + 1),
  }
})

const averageLineY = toChartY(averagePurchasePrice)
const tooltipWidth = 168
const tooltipHeight = 72
const tooltipMargin = 10
const tooltipArrowHalfWidth = 6

const summaryCards: SummaryCardItem[] = [
  {
    label: '持有股數',
    value: sharesFormatter.format(totalShares),
    unit: 'VT',
  },
  {
    label: '平均購入價格',
    value: currencyFormatter.format(averagePurchasePrice),
    unit: 'USD',
  },
  {
    label: '總投入金額',
    value: currencyFormatter.format(totalInvested),
    unit: '進行中',
    active: true,
  },
]

const linePoints = chartPoints.map(({ x, y }) => `${x},${y}`).join(' ')

export const Portfolio = () => {
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null)

  const tooltipPosition = hoveredPoint
    ? (() => {
      const left = Math.min(
        Math.max(hoveredPoint.x - tooltipWidth / 2, 8),
        chartRight - tooltipWidth + 8,
      )
      const top = hoveredPoint.y - tooltipHeight - tooltipMargin

      return {
        left,
        top,
        arrowOffset: hoveredPoint.x - left,
      }
    })()
    : null

  return (
    <Main>
      <HeroSection>
        <HeroCopy>
          <Badge>
            <BadgeIcon>
              <FiTrendingUp />
            </BadgeIcon>
            投資紀錄
          </Badge>
          <Title>投資旅程：VT</Title>
          <TitleMeta>Vanguard Total World Stock Index ETF</TitleMeta>
          <Description>
            長期被動投資策略的記錄，專注於全球分散配置與持續成長。
          </Description>
        </HeroCopy>
      </HeroSection>
      <QuoteStrip>
        <TradingViewQuote />
      </QuoteStrip>
      <CardsGrid>
        {summaryCards.map((card) => (
          <SummaryCard key={card.label}>
            <SummaryLabel>{card.label}</SummaryLabel>
            <SummaryValue>
              {card.value}
              <SummaryUnit $active={card.active}>
                {card.active ? <FiArrowUpRight /> : null}
                {card.unit}
              </SummaryUnit>
            </SummaryValue>
          </SummaryCard>
        ))}
      </CardsGrid>
      <WidgetCard>
        <CardTitleRow>
          <SectionTitle>即時走勢</SectionTitle>
        </CardTitleRow>
        <TradingViewOverview />
      </WidgetCard>
      <ChartCard>
        <CardTitleRow>
          <SectionTitle>購入單價走勢</SectionTitle>
          <Legend>
            <LegendItem>
              <LegendLine />
              購入單價
            </LegendItem>
            <LegendItem>
              <LegendDashed />
              平均 {currencyFormatter.format(averagePurchasePrice)}
            </LegendItem>
          </Legend>
        </CardTitleRow>

        <ChartWrap>
          <Chart viewBox="0 0 640 195" aria-label="VT 購入單價走勢圖" role="img">
            {yAxisLabels.map((item) => (
              <Fragment key={item.label}>
                <line
                  x1={chartLeft}
                  y1={item.y}
                  x2={chartRight}
                  y2={item.y}
                  stroke={item.strong ? 'rgba(140,46,46,0.2)' : 'rgba(140,46,46,0.1)'}
                  strokeWidth={item.strong ? '1.5' : '1'}
                />
                <text
                  x="48"
                  y={item.y + 4}
                  fontSize="9"
                  fontFamily="inherit"
                  textAnchor="end"
                  fill="rgba(62,50,44,0.5)"
                >
                  {item.label}
                </text>
              </Fragment>
            ))}

            <line
              x1={chartLeft}
              y1={chartTop}
              x2={chartLeft}
              y2={chartBottom}
              stroke="rgba(140,46,46,0.25)"
              strokeWidth="1.5"
            />
            <line
              x1={chartLeft}
              y1={averageLineY}
              x2={chartRight}
              y2={averageLineY}
              stroke="rgba(62,50,44,0.35)"
              strokeWidth="1.5"
              strokeDasharray="5,4"
            />
            <polyline
              points={linePoints}
              fill="none"
              stroke="#8c2e2e"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {chartPoints.map((point) => (
              <g key={`${point.date}-${point.x}`}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="3.5"
                  fill="#8c2e2e"
                  tabIndex={0}
                  role="button"
                  aria-label={`${point.date}，當次買入價 ${point.priceLabel}，${describeDeltaFromAverage(point.deltaFromAverage)}`}
                  onMouseEnter={() => setHoveredPoint(point)}
                  onMouseLeave={() => setHoveredPoint((current) => (current?.date === point.date ? null : current))}
                  onFocus={() => setHoveredPoint(point)}
                  onBlur={() => setHoveredPoint((current) => (current?.date === point.date ? null : current))}
                >
                  <title>{`${point.date}\n購入股數 ${point.sharesLabel}\n單價 ${point.priceLabel}`}</title>
                </circle>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="10"
                  fill="transparent"
                  onMouseEnter={() => setHoveredPoint(point)}
                  onMouseLeave={() => setHoveredPoint((current) => (current?.date === point.date ? null : current))}
                />
              </g>
            ))}

            {hoveredPoint && tooltipPosition ? (
              <g aria-hidden="true">
                <rect
                  x={tooltipPosition.left}
                  y={tooltipPosition.top}
                  width={tooltipWidth}
                  height={tooltipHeight}
                  rx="2"
                  fill="rgba(253, 252, 248, 0.97)"
                  stroke="rgba(140, 46, 46, 0.18)"
                />
                <path
                  d={`M ${hoveredPoint.x} ${hoveredPoint.y} L ${tooltipPosition.left + tooltipPosition.arrowOffset - tooltipArrowHalfWidth} ${tooltipPosition.top + tooltipHeight} L ${tooltipPosition.left + tooltipPosition.arrowOffset + tooltipArrowHalfWidth} ${tooltipPosition.top + tooltipHeight} Z`}
                  fill="rgba(253, 252, 248, 0.97)"
                  stroke="rgba(140, 46, 46, 0.18)"
                  strokeLinejoin="round"
                />
                <text
                  x={tooltipPosition.left + 12}
                  y={tooltipPosition.top + 15}
                  fontSize="8"
                  fontWeight="700"
                  letterSpacing="0.3"
                  fill="rgba(62,50,44,0.62)"
                >
                  {hoveredPoint.date}
                </text>
                <text
                  x={tooltipPosition.left + 12}
                  y={tooltipPosition.top + 30}
                  fontSize="11"
                  fontWeight="900"
                  letterSpacing="-0.1"
                  fill="rgba(24,19,16,0.92)"
                >
                  {`當次買入價 ${hoveredPoint.priceLabel}`}
                </text>
                <text
                  x={tooltipPosition.left + 12}
                  y={tooltipPosition.top + 44}
                  fontSize="8"
                  fontWeight="600"
                  letterSpacing="0.15"
                  fill="rgba(62,50,44,0.66)"
                >
                  {`買入 ${hoveredPoint.sharesLabel} 股`}
                </text>
                <text
                  x={tooltipPosition.left + 12}
                  y={tooltipPosition.top + 59}
                  fontSize="8"
                  fontWeight="700"
                  letterSpacing="0.15"
                  fill={hoveredPoint.deltaFromAverage >= 0 ? 'var(--accent)' : '#2b6d44'}
                >
                  {describeDeltaFromAverage(hoveredPoint.deltaFromAverage)}
                </text>
              </g>
            ) : null}

            <line
              x1={chartLeft}
              y1={chartBottom}
              x2={chartRight}
              y2={chartBottom}
              stroke="rgba(140,46,46,0.25)"
              strokeWidth="1.5"
            />

            {monthMarkers.map((marker) => (
              <line
                key={marker}
                x1={marker}
                y1={chartBottom}
                x2={marker}
                y2={chartBottom + 8}
                stroke="rgba(140,46,46,0.3)"
                strokeWidth="1"
                strokeDasharray="3,2"
              />
            ))}

            {monthLabels.map((month) => (
              <text
                key={month.label}
                x={month.x}
                y="168"
                fontSize="8"
                fontFamily="inherit"
                textAnchor="middle"
                fill="rgba(140,46,46,0.6)"
                fontWeight="700"
                letterSpacing="1"
              >
                {month.label}
              </text>
            ))}
          </Chart>

        </ChartWrap>
      </ChartCard>

      <HistoryCard>
        <HistoryHeader>
          <SectionTitle>購入紀錄</SectionTitle>
        </HistoryHeader>

        <TableScroll>
          <Table>
            <thead>
              <tr>
                <TableHeadCell>日期</TableHeadCell>
                <TableHeadCell>購入股數</TableHeadCell>
                <TableHeadCell>單價 (USD)</TableHeadCell>
              </tr>
            </thead>
            <tbody>
              {purchaseHistory.map((group) => (
                <Fragment key={group.month}>
                  <MonthSeparator>
                    <MonthCell colSpan={3}>{group.month}</MonthCell>
                  </MonthSeparator>
                  {group.entries.map((entry) => (
                    <TableRow key={entry.date}>
                      <DateCell>{entry.date}</DateCell>
                      <SharesCell>{entry.shares}</SharesCell>
                      <TableCell>{entry.price}</TableCell>
                    </TableRow>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </Table>
        </TableScroll>
      </HistoryCard>
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
  gap: 2rem;

  @media (max-width: 720px) {
    width: min(64rem, calc(100% - 2rem));
    padding-top: 1.5rem;
  }
`

const HeroSection = styled.section`
  padding-top: 1rem;
  animation: ${fadeUp} 0.7s ease both;
`

const HeroCopy = styled.div`
  max-width: 38rem;
`

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid var(--accent);
  border-radius: 2px;
  color: var(--accent);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  background: rgba(253, 252, 248, 0.72);
`

const BadgeIcon = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  font-size: 0.875rem;
`

const Title = styled.h1`
  margin: 0 0 0.75rem;
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 900;
  letter-spacing: 0.05em;
`

const TitleMeta = styled.div`
  margin: -0.2rem 0 0.75rem;
  color: rgba(62, 50, 44, 0.58);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
`

const Description = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.8;
  color: var(--text-muted);
`

const CardsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  animation: ${fadeUp} 0.7s ease 0.08s both;
`

const SummaryCard = styled.article`
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

const SummaryLabel = styled.div`
  margin-bottom: 0.6rem;
  color: var(--text-muted);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`

const SummaryValue = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.4rem;
  font-size: 1.75rem;
  font-weight: 900;
  letter-spacing: -0.02em;
`

const SummaryUnit = styled.span<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  color: ${({ $active }) => ($active ? 'var(--accent)' : 'var(--text-muted)')};
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`

const SurfaceCard = styled.section`
  background: rgba(253, 252, 248, 0.92);
  border: 2px solid var(--border-soft);
  border-radius: 2px;
  animation: ${fadeUp} 0.7s ease 0.16s both;
`

const ChartCard = styled(SurfaceCard)`
  padding: 1.5rem;
`

const CardTitleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
`

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 900;
  letter-spacing: 0.05em;
`

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem;
  color: var(--text-muted);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
`

const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
`

const LegendLine = styled.span`
  display: inline-block;
  width: 18px;
  height: 2px;
  background: var(--accent);
`

const LegendDashed = styled.span`
  display: inline-block;
  width: 18px;
  height: 0;
  border-top: 2px dashed var(--text-muted);
`

const ChartWrap = styled.div`
  position: relative;
  width: 100%;
`

const Chart = styled.svg`
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
`

const HistoryCard = styled(SurfaceCard)`
  overflow: hidden;
  animation-delay: 0.24s;
`

const WidgetCard = styled(SurfaceCard)`
  padding: 1.5rem;
  animation-delay: 0.3s;
  height: 400px;
`

const QuoteStrip = styled(SurfaceCard)`
  padding: 0;
  animation: ${fadeUp} 0.7s ease 0.1s both;
  overflow: hidden;
  line-height: 0;

  iframe {
    display: block;
  }
`

const HistoryHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-soft);
`

const TableScroll = styled.div`
  overflow-x: auto;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`

const TableHeadCell = styled.th`
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 0.75rem 1.5rem;
  background: var(--bg);
  border-bottom: 1px solid var(--border-soft);
  color: var(--text-muted);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;
`

const TableCell = styled.td`
  padding: 0.9rem 1.5rem;
  border-bottom: 1px solid rgba(62, 50, 44, 0.07);
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
`

const DateCell = styled(TableCell)`
  color: var(--text-muted);
  font-weight: 700;
`

const SharesCell = styled(TableCell)`
  font-weight: 900;
`

const TableRow = styled.tr`
  &:last-child td {
    border-bottom: none;
  }

  &:hover {
    background: rgba(140, 46, 46, 0.04);
  }
`

const MonthSeparator = styled.tr`
  background: rgba(140, 46, 46, 0.06);
`

const MonthCell = styled.td`
  padding: 0.5rem 1.5rem;
  border-bottom: 1px solid var(--border-soft);
  color: var(--accent);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`