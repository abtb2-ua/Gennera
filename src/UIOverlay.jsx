import { useRef } from 'react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { HOTSPOTS, KPIS, OUTPUT, TONES, TREND, TREND_LIMIT } from './data'

const glass = 'bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl'
// Estrella Levante branded glass for the machine health cards
const brandGlass =
  'bg-emerald-900/70 bg-gradient-to-br from-emerald-700/25 to-transparent backdrop-blur-xl backdrop-saturate-150 ' +
  'border border-emerald-500/40 ring-1 ring-inset ring-white/5 shadow-[0_8px_32px_rgba(0,122,77,0.35)]'

export function TopBar() {
  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 flex items-center justify-between gap-3 px-4 py-3 ${glass} rounded-none border-x-0 border-t-0`}
    >
      {/* Replace with <img src="/logo.svg" /> */}
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-emerald-700 to-emerald-500 text-sm font-bold text-amber-400">
          ☆
        </div>
        <span className="text-sm font-semibold tracking-tight text-white">Estrella Levante</span>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-700/20 px-3 py-1">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        <span className="text-[11px] font-medium leading-tight text-emerald-300">
          Estado Global de Planta: ÓPTIMO
        </span>
      </div>
    </header>
  )
}

export function DataCard({ h, onClose }) {
  if (!h) return null
  const tone = TONES[h.tone]
  const alertTone = TONES[h.alertTone]
  return (
    <section
      key={h.id}
      className={`fixed inset-x-3 bottom-20 z-20 max-h-[62vh] overflow-y-auto rounded-2xl p-4 md:inset-x-auto md:right-6 md:top-20 md:bottom-auto md:w-96 ${brandGlass}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">{h.title}</h2>
          <p className="text-xs text-emerald-100/70">{h.subtitle}</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-950/50 text-emerald-50 active:bg-emerald-950/80"
        >
          ✕
        </button>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-emerald-100/80">Salud Actual</span>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${tone.pill}`}>
              {h.tone === 'amber' ? 'Atención' : 'Óptimo'}
            </span>
            <span className={`text-2xl font-bold ${tone.text}`}>{h.health}%</span>
          </div>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-emerald-950/60">
          <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${h.health}%` }} />
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2">
        {h.metrics.map((x) => (
          <div key={x.label} className="rounded-xl border border-emerald-500/15 bg-emerald-950/40 p-2.5">
            <dt className="text-[11px] leading-tight text-emerald-100/70">{x.label}</dt>
            <dd className="mt-1 text-base font-semibold leading-tight text-white">{x.value}</dd>
            {x.note && <span className={`text-[11px] ${TONES[x.noteTone].text}`}>{x.note}</span>}
          </div>
        ))}
      </dl>

      <div className={`mt-3 rounded-xl border p-3 ${alertTone.box}`}>
        <div className="flex items-baseline justify-between gap-2">
          <p className={`text-xs font-semibold ${alertTone.text}`}>{h.alertTitle}</p>
          <p className="text-[11px] text-emerald-100/80">
            {h.forecast.label}: <span className={`font-semibold ${alertTone.text}`}>{h.forecast.value}</span>
          </p>
        </div>
        <p className="mt-1 text-sm leading-snug text-emerald-50">{h.alert}</p>
      </div>
    </section>
  )
}

const tipStyle = { background: '#0f172a', border: '1px solid #10b98155', borderRadius: 8, fontSize: 12 }
const dayTick = (d) => (d === 30 ? 'Hoy' : d < 30 ? `-${30 - d}d` : `+${d - 30}d`)
const dayLabel = (d) => (d === 30 ? 'Hoy' : d < 30 ? `Hace ${30 - d} días` : `En ${d - 30} días`)
const daysOf = (h) => Number(h.forecast.value.match(/\d+/)[0])

function Ring({ h, open, onSelect }) {
  const r = 26
  const C = 2 * Math.PI * r
  const tone = TONES[h.tone]
  return (
    <button
      onClick={() => onSelect(h.id)}
      className="flex flex-col items-center gap-1 rounded-xl border border-emerald-500/15 bg-emerald-950/40 p-2 active:bg-emerald-900/60"
    >
      <div className={`relative h-16 w-16 ${tone.text}`}>
        <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" className="stroke-emerald-950" />
          <circle
            cx="32" cy="32" r={r} fill="none" strokeWidth="6" strokeLinecap="round" stroke="currentColor"
            strokeDasharray={C}
            strokeDashoffset={open ? C * (1 - h.health / 100) : C}
            style={{ transition: 'stroke-dashoffset 1.1s ease-out' }}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-sm font-bold text-white">{h.health}%</span>
      </div>
      <span className="text-center text-[11px] leading-tight text-emerald-50">{h.title}</span>
      <span className={`text-[10px] font-medium ${tone.text}`}>{h.tone === 'amber' ? 'Atención' : 'Óptimo'}</span>
    </button>
  )
}

const Panel = ({ className = '', children }) => (
  <div className={`rounded-2xl border border-emerald-500/20 bg-emerald-950/30 p-3 ${className}`}>{children}</div>
)

export function Drawer({ open, setOpen, onSelect }) {
  const startY = useRef(null)
  const onTouchStart = (e) => (startY.current = e.touches[0].clientY)
  const onTouchEnd = (e) => {
    if (startY.current == null) return
    const dy = e.changedTouches[0].clientY - startY.current
    if (dy < -40) setOpen(true)
    if (dy > 40) setOpen(false)
    startY.current = null
  }
  const upcoming = [...HOTSPOTS].sort((a, b) => daysOf(a) - daysOf(b))

  return (
    <aside
      className={`fixed inset-x-0 bottom-0 z-30 h-[90dvh] rounded-t-3xl border border-white/10 bg-slate-900/90 shadow-2xl backdrop-blur-xl transition-transform duration-500 ease-out ${open ? 'translate-y-0' : 'translate-y-[calc(100%-3.5rem)]'
        }`}
    >
      <button
        onClick={() => setOpen(!open)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="flex h-14 w-full flex-col items-center justify-center gap-1"
        aria-expanded={open}
      >
        <span className="h-1 w-10 rounded-full bg-white/30" />
        <span className="text-sm font-medium text-white">Histórico y Telemetría</span>
      </button>

      <div className="h-[calc(90dvh-3.5rem)] space-y-4 overflow-y-auto px-4 pb-10">
        {/* 1. Health rings */}
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Estado de Salud por Máquina</h3>
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> En vivo
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
            {HOTSPOTS.map((h) => (
              <Ring key={h.id} h={h} open={open} onSelect={onSelect} />
            ))}
          </div>
        </section>

        {/* 2. Predictive trend */}
        <Panel>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-white">Bombas de Glicol: Tendencia de Vibración</h3>
              <p className="text-[11px] text-emerald-100/70">Últimos 30 días y previsión a 14 días (mm/s)</p>
            </div>
            <span className="rounded-full bg-amber-400/15 px-2.5 py-1 text-[11px] font-medium text-amber-300">
              Fallo estimado en 14 días
            </span>
          </div>

          <div className="mt-3 h-56 md:h-64">
            <ResponsiveContainer>
              <LineChart data={TREND} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#ffffff12" vertical={false} />
                <XAxis
                  dataKey="d" type="number" domain={[1, 44]} ticks={[1, 10, 20, 30, 37, 44]}
                  tickFormatter={dayTick} stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false}
                />
                <YAxis domain={[2, 6.5]} tickCount={5} stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <ReferenceLine
                  y={TREND_LIMIT} stroke="#FDB913" strokeDasharray="4 4"
                  label={{ value: 'Umbral crítico 6.0', fill: '#FDB913', fontSize: 10, position: 'insideTopLeft' }}
                />
                <ReferenceLine x={30} stroke="#ffffff55" />
                <Tooltip
                  contentStyle={tipStyle}
                  labelFormatter={dayLabel}
                  formatter={(v, name) => [`${v} mm/s`, name]}
                />
                <Line dataKey="ok" name="Real" stroke="#10b981" strokeWidth={2.5} dot={false} />
                <Line dataKey="warn" name="Tendencia al alza" stroke="#FDB913" strokeWidth={2.5} dot={false} />
                <Line dataKey="fc" name="Previsión IA" stroke="#FDB913" strokeWidth={2} strokeDasharray="6 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-emerald-100/80">
            <span><i className="mr-1 inline-block h-0.5 w-4 bg-emerald-500 align-middle" />Real</span>
            <span><i className="mr-1 inline-block h-0.5 w-4 bg-amber-400 align-middle" />Tendencia al alza</span>
            <span><i className="mr-1 inline-block h-0.5 w-4 border-t-2 border-dashed border-amber-400 align-middle" />Previsión IA</span>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            {[['Actual', '4.2 mm/s'], ['Variación 30 d', '+62%'], ['Acción', 'Programar revisión']].map(([l, v]) => (
              <div key={l} className="rounded-xl bg-emerald-950/50 p-2">
                <div className="text-[10px] text-emerald-100/70">{l}</div>
                <div className="text-sm font-semibold text-amber-300">{v}</div>
              </div>
            ))}
          </div>
        </Panel>

        {/* 3. KPIs, production, upcoming maintenance */}
        <div className="grid grid-cols-3 gap-2">
          {KPIS.map((k) => (
            <div key={k.label} className="rounded-xl border border-emerald-500/15 bg-emerald-950/40 p-3 text-center">
              <div className="text-lg font-bold text-amber-400">{k.value}</div>
              <div className="text-[11px] text-emerald-100/70">{k.label}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Panel>
            <p className="mb-1 text-xs text-emerald-50">Producción envasado (miles de uds., 7 días)</p>
            <div className="h-36">
              <ResponsiveContainer>
                <BarChart data={OUTPUT}>
                  <XAxis dataKey="d" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip cursor={false} contentStyle={tipStyle} />
                  <Bar dataKey="v" fill="#007A4D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel>
            <p className="mb-2 text-xs text-emerald-50">Próximas intervenciones previstas</p>
            <ul className="space-y-1.5">
              {upcoming.map((h) => {
                const t = TONES[h.alertTone]
                return (
                  <li key={h.id} className="flex items-center justify-between gap-2 text-xs">
                    <span className="flex items-center gap-2 text-emerald-50">
                      <span className={`h-2 w-2 rounded-full ${t.dot}`} />
                      {h.title}
                    </span>
                    <span className="text-right text-emerald-100/70">
                      {h.forecast.label} <b className={t.text}>{h.forecast.value}</b>
                    </span>
                  </li>
                )
              })}
            </ul>
          </Panel>
        </div>
      </div>
    </aside>
  )
}
