import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Bar, BarChart,
} from 'recharts'
import { formatTime } from '../../utils/weatherCodes'
import './PrecipitationChart.css'

export default function PrecipitationChart({ hourly = [] }) {
  const now = new Date()
  const data = hourly
    .filter(h => new Date(h.time) >= now)
    .slice(0, 24)
    .map(h => ({
      time: formatTime(h.time, { hour: '2-digit', hour12: true }),
      probability: h.precipProbability ?? 0,
      amount: parseFloat((h.precipitation ?? 0).toFixed(2)),
    }))

  const hasAnyRain = data.some(d => d.probability > 0 || d.amount > 0)

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="precip__tooltip">
        <p className="precip__tooltip-time">{label}</p>
        {payload.map(p => (
          <p key={p.dataKey} className="precip__tooltip-row" style={{ color: p.color }}>
            <span>{p.name}:</span>
            <strong>{p.value}{p.dataKey === 'probability' ? '%' : ' mm'}</strong>
          </p>
        ))}
      </div>
    )
  }

  return (
    <section className="precip card" aria-label="Precipitation forecast chart">
      <div className="precip__header">
        <h2 className="section-title">
          <RainIcon />
          Precipitation
        </h2>
        {!hasAnyRain && (
          <span className="badge badge-blue">No rain expected</span>
        )}
      </div>

      <div className="precip__chart-wrap" aria-hidden={!hasAnyRain}>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}
            barCategoryGap="30%">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: 'var(--text-muted)', fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              interval={3}
            />
            <YAxis
              yAxisId="prob"
              orientation="left"
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={v => `${v}%`}
              width={36}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(14,165,233,0.06)' }} />
            <Bar
              yAxisId="prob"
              dataKey="probability"
              name="Rain chance"
              fill="url(#precipGrad)"
              radius={[4, 4, 0, 0]}
            />
            <defs>
              <linearGradient id="precipGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#38bdf8" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.5}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Probability area chart */}
      <div className="precip__area-wrap" aria-hidden="true">
        <ResponsiveContainer width="100%" height={80}>
          <AreaChart data={data} margin={{ top: 0, right: 5, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#0ea5e9" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis domain={[0, Math.max(5, ...data.map(d => d.amount))]} hide />
            <Tooltip
              content={({ active, payload, label }) => active && payload?.length ? (
                <div className="precip__tooltip">
                  <p className="precip__tooltip-time">{label}</p>
                  <p className="precip__tooltip-row" style={{ color: '#60a5fa' }}>
                    <span>Amount:</span><strong>{payload[0]?.value} mm</strong>
                  </p>
                </div>
              ) : null}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#60a5fa"
              strokeWidth={2}
              fill="url(#areaGrad)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
        <p className="precip__area-label">Precipitation amount (mm)</p>
      </div>
    </section>
  )
}

function RainIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="16" y1="13" x2="16" y2="21"/><line x1="8" y1="13" x2="8" y2="21"/><line x1="12" y1="15" x2="12" y2="23"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg> }
