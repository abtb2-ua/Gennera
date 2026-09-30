// Layout is along the X axis. Adjust positions / target / size to match your /model.glb.
export const MODEL_LENGTH = 28 // total model length in units, used to fit the overview
export const HOME_TARGET = [0, 1, 0]
export const OVERVIEW_DIR = [0, 0.35, 0.94] // direction from target to camera (polar ≈ 70°)

export const TONES = {
  amber: {
    dot: 'bg-amber-400', text: 'text-amber-400', bar: 'bg-amber-400',
    box: 'border-amber-400/40 bg-amber-400/10', pill: 'bg-amber-400/15 text-amber-300',
  },
  green: {
    dot: 'bg-emerald-500', text: 'text-emerald-400', bar: 'bg-emerald-400',
    box: 'border-emerald-400/30 bg-emerald-950/40', pill: 'bg-emerald-400/15 text-emerald-300',
  },
}

// Metric helper: label, value, optional trend note + its tone
const m = (label, value, note, noteTone) => ({ label, value, note, noteTone })

const make = (x, z, size, rest) => ({
  position: [x, size[1] + 0.9, z], // hotspot floats above the machine
  target: [x, size[1] / 2, z], // camera looks at the machine's centre
  view: [0.2, 0.35, 0.9],
  distance: 10,
  size, // only used by the placeholder scene
  alertTone: 'green',
  ...rest,
})

// All figures are illustrative mock data for the pitch.
// Each machine: health, 4 metrics, a predictive alert and a maintenance forecast.
export const HOTSPOTS = [
  make(-11, -5, [3, 4.5, 3], {
    id: 'silos', title: 'Silos', subtitle: 'Almacenamiento de materia prima',
    health: 98, tone: 'green',
    metrics: [
      m('Nivel de Llenado', '72%', '● Estable', 'green'),
      m('Temperatura Interna', '18.4 °C', '● En rango', 'green'),
      m('Humedad Relativa', '54%', '● En rango', 'green'),
      m('Vibración Estructural', '0.8 mm/s', '● Estable', 'green'),
    ],
    alertTitle: 'Alerta Predictiva',
    alert: 'Consumo estable. Nivel suficiente para 3 días de producción. Reposición programada.',
    forecast: { label: 'Próx. reposición', value: '3 días' },
  }),
  make(-11, -1, [2.6, 0, 2], {
    id: 'pumps', title: 'Bombas de Glicol', subtitle: 'Sistema de refrigeración',
    health: 78, tone: 'amber', alertTone: 'amber',
    metrics: [
      m('Amplitud de Vibración', '4.2 mm/s', '▲ Al alza', 'amber'),
      m('Presión de Glicol', '2.1 bar', '● Estable', 'green'),
      m('Temp. Rodamiento', '68 °C', '▲ Al alza', 'amber'),
      m('Corriente Motor', '18.6 A', '▲ +6% vs. base', 'amber'),
    ],
    alertTitle: 'Alerta Predictiva',
    alert: 'Desgaste de rodamiento detectado. Fallo estimado en 14 días. Acción: Programar revisión.',
    forecast: { label: 'Fallo estimado', value: '14 días' },
  }),
  make(-6, -3.5, [2.8, 1, 2], {
    id: 'exchanger', title: 'Intercambiador de Calor', subtitle: 'Enfriamiento de mosto',
    health: 91, tone: 'green',
    metrics: [
      m('Diferencial de Temp. (ΔT)', '8.6 °C', '● Estable', 'green'),
      m('Pérdida de Carga', '0.4 bar', '▲ Ligera subida', 'amber'),
      m('Caudal de Mosto', '42 m³/h', '● Estable', 'green'),
      m('Eficiencia Térmica', '89%', '▼ -2% en 30 días', 'amber'),
    ],
    alertTitle: 'Alerta Predictiva',
    alert: 'Ensuciamiento leve en placas. Limpieza CIP recomendada antes de perder eficiencia.',
    forecast: { label: 'Próx. limpieza CIP', value: '21 días' },
  }),
  make(2, 0, [4, 0.15, 1], {
    id: 'conveyor', title: 'Cinta Transportadora', subtitle: 'Tren de envasado',
    health: 96, tone: 'green',
    metrics: [
      m('Corriente Motor Cinta', '12.4 A', '● Estable', 'green'),
      m('Vibración Motor', '1.9 mm/s', '● Estable', 'green'),
      m('Temp. Motor', '54 °C', '● En rango', 'green'),
      m('Vida Útil Correa', '88% de uso', '▲ Desgaste normal', 'green'),
    ],
    alertTitle: 'Vida Útil Restante (RUL)',
    alert: 'Correa de transmisión al 88% de uso máximo. Funcionamiento óptimo garantizado.',
    forecast: { label: 'Cambio de correa', value: '≈ 40 días' },
  }),
  make(8, 0, [3, 1.5, 2.4], {
    id: 'filler', title: 'Llenadora', subtitle: 'Estación de llenado',
    health: 93, tone: 'green',
    metrics: [
      m('Velocidad de Línea', '36.000 bot/h', '● Estable', 'green'),
      m('Precisión de Llenado', '±0.3 ml', '● En rango', 'green'),
      m('Vibración Carrusel', '2.4 mm/s', '● Estable', 'green'),
      m('Contrapresión CO₂', '2.8 bar', '● Estable', 'green'),
    ],
    alertTitle: 'Alerta Predictiva',
    alert: 'Válvulas de llenado en rango. Programar cambio de juntas en la próxima parada.',
    forecast: { label: 'Cambio de juntas', value: '45 días' },
  }),
  make(15.2, 0, [2.6, 1.5, 2.4], {
    id: 'capper', title: 'Taponadora Rotativa', subtitle: 'Cierre de envases',
    health: 95, tone: 'green',
    metrics: [
      m('Varianza de Torque (Tapón)', '0.05 Nm', '● Estable', 'green'),
      m('Tapones Rechazados', '0.02%', '● En rango', 'green'),
      m('Vibración Cabezal', '1.6 mm/s', '● Estable', 'green'),
      m('Temp. Embrague', '47 °C', '● En rango', 'green'),
    ],
    alertTitle: 'Estado Predictivo',
    alert: 'Torque dentro de tolerancia. Sin desviaciones detectadas en los 12 cabezales.',
    forecast: { label: 'Próx. calibración', value: '30 días' },
  }),
]

export const VIBRATION = [
  { d: 'L', v: 2.9 }, { d: 'M', v: 3.1 }, { d: 'X', v: 3.4 },
  { d: 'J', v: 3.6 }, { d: 'V', v: 3.9 }, { d: 'S', v: 4.0 }, { d: 'D', v: 4.2 },
]

export const OUTPUT = [
  { d: 'L', v: 118 }, { d: 'M', v: 124 }, { d: 'X', v: 121 },
  { d: 'J', v: 130 }, { d: 'V', v: 127 }, { d: 'S', v: 96 }, { d: 'D', v: 88 },
]

export const KPIS = [
  { label: 'OEE', value: '87%' },
  { label: 'Paradas evitadas', value: '12' },
  { label: 'Energía', value: '-6.4%' },
]

// Glycol pump vibration (mm/s): 30 days of history + 14-day forecast (failure threshold 6.0 mm/s)
const hist = [2.6, 2.7, 2.6, 2.8, 2.7, 2.9, 2.8, 2.9, 3.0, 2.9, 3.1, 3.0, 3.2, 3.1, 3.3, 3.4, 3.3, 3.5, 3.6, 3.6, 3.7, 3.8, 3.9, 3.9, 4.0, 4.0, 4.1, 4.1, 4.2, 4.2]
const fc = [4.3, 4.4, 4.5, 4.65, 4.8, 4.95, 5.1, 5.25, 5.4, 5.55, 5.7, 5.85, 5.95, 6.0]
export const TREND = [
  ...hist.map((v, i) => ({ d: i + 1, ok: i <= 19 ? v : null, warn: i >= 19 ? v : null, fc: i === 29 ? v : null })),
  ...fc.map((v, i) => ({ d: 31 + i, ok: null, warn: null, fc: v })),
]
export const TREND_LIMIT = 6.0
