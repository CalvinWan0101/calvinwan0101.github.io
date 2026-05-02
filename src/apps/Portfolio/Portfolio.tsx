import { Fragment, useEffect, useRef, useState } from 'react'
import { FiArrowUpRight, FiChevronLeft, FiChevronRight, FiTrendingUp } from 'react-icons/fi'
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
  id: string
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
  id: string
  date: string
  shares: number
  price: number
  timestamp: number
  month: number
  monthKey: string
  monthLabel: string
  sharesLabel: string
  priceLabel: string
  investedLabel: string
}

type DropdownOption = {
  value: string
  label: string
}

type MonthDropdownProps = {
  id: string
  value: string
  options: DropdownOption[]
  allLabel: string
  onChange: (value: string) => void
}

const MonthDropdown = ({ id, value, options, allLabel, onChange }: MonthDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const allOptions: DropdownOption[] = [{ value: 'all', label: allLabel }, ...options]
  const selectedLabel = allOptions.find((o) => o.value === value)?.label ?? allLabel

  return (
    <DropdownWrap ref={wrapRef}>
      <DropdownButton
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {selectedLabel}
        <DropdownChevron $isOpen={isOpen} aria-hidden="true" />
      </DropdownButton>
      <DropdownPanel $isOpen={isOpen} role="listbox" aria-label="月份篩選">
        {allOptions.map((option) => (
          <DropdownOptionButton
            key={option.value}
            type="button"
            role="option"
            aria-selected={value === option.value}
            $active={value === option.value}
            onClick={() => {
              onChange(option.value)
              setIsOpen(false)
            }}
          >
            {option.label}
          </DropdownOptionButton>
        ))}
      </DropdownPanel>
    </DropdownWrap>
  )
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

const createMonthKey = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  return `${year}-${month}`
}

const createMonthLabel = (date: Date) => `${date.getFullYear()} 年 ${date.getMonth() + 1} 月`

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
      { date: '2026/04/27', shares: '1.32279', price: '$150.439605' },
      { date: '2026/04/15', shares: '1.33730', price: '$148.059644' },
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

const purchaseEntries: ParsedPurchaseEntry[] = purchaseHistory.flatMap(({ entries }, groupIndex) =>
  entries.map((entry, entryIndex) => {
    const date = parseDate(entry.date)
    const monthKey = createMonthKey(date)

    return {
      id: `${monthKey}-${entry.date}-${entry.shares}-${entry.price}-${groupIndex}-${entryIndex}`,
      date: entry.date,
      shares: Number(entry.shares),
      price: parseCurrency(entry.price),
      timestamp: date.getTime(),
      month: date.getMonth() + 1,
      monthKey,
      monthLabel: createMonthLabel(date),
      sharesLabel: entry.shares,
      priceLabel: entry.price,
      investedLabel: currencyFormatter.format(Number(entry.shares) * parseCurrency(entry.price)),
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
  id: entry.id,
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
const historyPageSize = 5

export const Portfolio = () => {
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null)
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [currentHistoryPage, setCurrentHistoryPage] = useState(1)

  const historyMonthOptions = Array.from(
    new Map(purchaseEntries.map((entry) => [entry.monthKey, entry.monthLabel])).entries(),
  ).map(([value, label]) => ({
    value,
    label,
  }))

  const filteredHistoryEntries = purchaseEntries.filter((entry) =>
    selectedMonth === 'all' ? true : entry.monthKey === selectedMonth,
  )

  const historyPageCount = Math.max(1, Math.ceil(filteredHistoryEntries.length / historyPageSize))
  const safeCurrentHistoryPage = Math.min(currentHistoryPage, historyPageCount)
  const historyPageStart = (safeCurrentHistoryPage - 1) * historyPageSize
  const paginatedHistoryEntries = filteredHistoryEntries.slice(
    historyPageStart,
    historyPageStart + historyPageSize,
  )
  const paddedHistoryEntries = Array.from({ length: historyPageSize }, (_, index) =>
    paginatedHistoryEntries[index] ?? null,
  )

  const selectedMonthLabel =
    selectedMonth === 'all'
      ? '全部月份'
      : historyMonthOptions.find((option) => option.value === selectedMonth)?.label ?? createMonthLabel(new Date())

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
              <g key={point.id}>
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
          <MonthDropdown
            id="portfolio-history-month"
            value={selectedMonth}
            options={historyMonthOptions}
            allLabel="全部月份"
            onChange={(value) => {
              setSelectedMonth(value)
              setCurrentHistoryPage(1)
            }}
          />
        </HistoryHeader>

        <TableScroll>
          <Table>
            <thead>
              <tr>
                <TableHeadCell>日期</TableHeadCell>
                <TableHeadCell>購入股數</TableHeadCell>
                <TableHeadCell>單價 (USD)</TableHeadCell>
                <TableHeadCell>投入金額</TableHeadCell>
              </tr>
            </thead>
            <tbody>
              {paddedHistoryEntries.map((entry, index) => (
                <TableRow key={entry ? entry.id : `empty-row-${index}`}>
                  <DateCell>{entry?.date ?? '\u00A0'}</DateCell>
                  <SharesCell>{entry?.sharesLabel ?? '\u00A0'}</SharesCell>
                  <TableCell>{entry?.priceLabel ?? '\u00A0'}</TableCell>
                  <TableCell>{entry?.investedLabel ?? '\u00A0'}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableScroll>

        <PaginationBar>
          <PaginationStatus>
            {filteredHistoryEntries.length === 0
              ? `${selectedMonthLabel} 目前沒有符合條件的購買紀錄`
              : historyPageCount > 1
                ? `共 ${filteredHistoryEntries.length} 筆・第 ${safeCurrentHistoryPage} / ${historyPageCount} 頁`
                : `共 ${filteredHistoryEntries.length} 筆`}
          </PaginationStatus>
          <PaginationControls>
            {historyPageCount > 1 && (
              <PaginationButton
                type="button"
                aria-label="上一頁"
                disabled={safeCurrentHistoryPage === 1}
                onClick={() => setCurrentHistoryPage((page) => Math.max(1, page - 1))}
              >
                <FiChevronLeft />
                上一頁
              </PaginationButton>
            )}
            {historyPageCount > 1 && (
              <PaginationButton
                type="button"
                aria-label="下一頁"
                disabled={safeCurrentHistoryPage === historyPageCount}
                onClick={() => setCurrentHistoryPage((page) => Math.min(historyPageCount, page + 1))}
              >
                下一頁
                <FiChevronRight />
              </PaginationButton>
            )}
          </PaginationControls>
        </PaginationBar>
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-soft);
`

const DropdownWrap = styled.div`
  position: relative;
  display: inline-flex;

  @media (max-width: 720px) {
    flex: 1;
    min-width: 0;
  }
`

const DropdownButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  min-height: 2.25rem;
  padding: 0.45rem 1rem;
  border: 1px solid rgba(23, 30, 28, 0.14);
  border-radius: 999px;
  background: rgba(244, 241, 225, 0.98);
  color: inherit;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  @media (max-width: 720px) {
    width: 100%;
    min-width: 0;
  }

  &:hover {
    background: rgba(180, 99, 62, 0.12);
    color: var(--accent);
  }
`

const DropdownChevron = styled.span<{ $isOpen: boolean }>`
  display: inline-block;
  flex-shrink: 0;
  width: 0.35rem;
  height: 0.35rem;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: ${({ $isOpen }) => ($isOpen ? 'translateY(15%) rotate(-135deg)' : 'translateY(-20%) rotate(45deg)')};
  transition: transform 0.2s ease;
`

const DropdownPanel = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 100%;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  border: 1px solid rgba(23, 30, 28, 0.14);
  border-radius: 1.25rem;
  background: rgba(244, 241, 225, 0.98);
  box-shadow: 0 1rem 2.5rem rgba(23, 30, 28, 0.12);
  z-index: 10;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transform: ${({ $isOpen }) => ($isOpen ? 'translateY(0)' : 'translateY(-0.5rem)')};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  transition: opacity 0.2s ease, transform 0.2s ease;
`

const DropdownOptionButton = styled.button<{ $active?: boolean }>`
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? 'rgba(180, 99, 62, 0.12)' : 'transparent')};
  color: ${({ $active }) => ($active ? 'var(--accent)' : 'inherit')};
  font: inherit;
  font-size: 0.875rem;
  font-weight: 700;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: rgba(180, 99, 62, 0.12);
    color: var(--accent);
  }
`

const TableScroll = styled.div`
  overflow-x: auto;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
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
  width: 25%;
`

const TableCell = styled.td`
  padding: 0.9rem 1.5rem;
  height: 3.5rem;
  border-bottom: 1px solid rgba(62, 50, 44, 0.07);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
  vertical-align: middle;
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

const PaginationBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.9rem;
  padding: 1rem 1.5rem 1.2rem;
  border-top: 1px solid var(--border-soft);

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: stretch;
    padding: 0.9rem 1rem 1rem;
  }
`

const PaginationStatus = styled.div`
  color: var(--text-muted);
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;

  @media (max-width: 720px) {
    text-align: center;
  }
`

const PaginationControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;

  @media (max-width: 720px) {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5rem;
  }
`

const PaginationButton = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.45rem 0.75rem;
  border: 1px solid ${({ $active }) => ($active ? 'var(--accent)' : 'rgba(140, 46, 46, 0.18)')};
  background: ${({ $active }) => ($active ? 'rgba(140, 46, 46, 0.12)' : 'rgba(253, 252, 248, 0.92)')};
  color: ${({ $active }) => ($active ? 'var(--accent)' : 'var(--text)')};
  font: inherit;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;

  &:hover:not(:disabled) {
    border-color: var(--accent);
    color: var(--accent);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  @media (max-width: 720px) {
    width: 100%;
    min-width: 0;
    padding-inline: 0.5rem;
    white-space: nowrap;
  }
`
