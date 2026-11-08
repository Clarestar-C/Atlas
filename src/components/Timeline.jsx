import { Sun, Sunset, Moon, AlertTriangle } from 'lucide-react'

const SEGMENTS = [
  { label: '6a', name: 'Morning Peak', range: '6 AM – 12 PM', color: 'bg-emerald-500/80', text: 'text-emerald-300', flex: 6, icon: Sun },
  { label: '12p', name: 'Afternoon Pacing', range: '12 – 6 PM', color: 'bg-amber-500/80', text: 'text-amber-300', flex: 6, icon: Sunset },
  { label: '6p', name: 'Evening Fall Risk', range: '6 – 10 PM · Stairs + Dusk', color: 'bg-rose-500/80', text: 'text-rose-300', flex: 4, icon: Moon },
]

export default function Timeline({ phase }) {
  const hour = new Date().getHours() + new Date().getMinutes() / 60
  const effectiveHour = phase.id === 'morning' ? Math.min(Math.max(hour, 6), 11.5) : phase.id === 'afternoon' ? (hour >= 12 && hour < 18 ? hour : 15) : 19
  const pct = Math.min(100, Math.max(0, ((effectiveHour - 6) / 16) * 100))

  return (
    <section className="glass p-4 sm:p-5 animate-slide-up">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="font-bold flex items-center gap-2"><Sun className="w-5 h-5 text-amber-300" /> Cartographic Day Map <span className="text-slate-500 font-normal text-sm">— Anatomical pacing timeline</span></h2>
        <span className="text-xs text-slate-400">6 AM → 10 PM</span>
      </div>
      <p className="text-sm text-slate-400 mt-1">Like the C1 Atlas vertebra bearing load at the top of the spine, your day bears load unevenly. Atlas maps where to spend energy — and where to protect it.</p>

      <div className="mt-5 relative">
        <div className="flex rounded-xl overflow-hidden border border-slate-700 h-14">
          {SEGMENTS.map((s) => (
            <div key={s.name} style={{ flex: s.flex }} className={`${s.color} relative flex items-center justify-center`}>
              <span className="text-[11px] sm:text-xs font-bold text-white/95 text-center px-1 leading-tight">{s.name}</span>
            </div>
          ))}
        </div>
        <div className="absolute -top-2 transition-all duration-500" style={{ left: `calc(${pct}% - 10px)` }}>
          <div className="w-5 h-5 rounded-full bg-white border-4 border-slate-950 shadow-lg shadow-black/50" title="Current position" />
        </div>
        <div className="flex justify-between text-[11px] text-slate-500 mt-2"><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>10 PM</span></div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mt-4">
        {SEGMENTS.map((s) => {
          const Icon = s.icon
          const active = (s.name.includes('Morning') && phase.id==='morning') || (s.name.includes('Afternoon') && phase.id==='afternoon') || (s.name.includes('Evening') && phase.id==='evening')
          return (
            <div key={s.name} className={`glass-soft p-3 ${active ? 'ring-2 ring-white/20 border-white/20' : ''}`}>
              <div className={`flex items-center gap-2 font-semibold text-sm ${s.text}`}><Icon className="w-4 h-4" />{s.name}</div>
              <p className="text-xs text-slate-400 mt-1">{s.range}</p>
              {s.name.includes('Evening') && <p className="text-xs text-rose-300 mt-2 flex gap-1"><AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Hazard zone: stairs + dusk + fatigue converge.</p>}
            </div>
          )
        })}
      </div>
    </section>
  )
}
