import { useState } from 'react'
import { AlertTriangle, CheckCircle2, Battery, Footprints, Hand } from 'lucide-react'
import { SAFETY_CHECKLIST } from '../data/content'

export default function SafetyMonitor({ phase }) {
  const [checked, setChecked] = useState({})
  const toggle = (id) => setChecked((p) => ({ ...p, [id]: !p[id] }))
  const done = SAFETY_CHECKLIST.filter((i) => checked[i.id]).length
  const allDone = done === SAFETY_CHECKLIST.length

  return (
    <div className="space-y-4 animate-fade-in">
      {phase.id === 'evening' && (
        <div role="alert" className="rounded-2xl border-2 border-rose-500/60 bg-rose-950/80 backdrop-blur p-4 sm:p-5 flex gap-3 animate-pulse-soft">
          <AlertTriangle className="w-8 h-8 text-rose-300 shrink-0" />
          <div>
            <h2 className="font-bold text-rose-100 text-lg leading-tight">⚠ Evening Fall Risk — Active Now</h2>
            <p className="text-rose-200/90 text-sm mt-1">Post-6 PM hazard window: dusk light, end-of-day fatigue, and stairs combine. Do not carry items on stairs. Lights on, handrail both ways, hands free. If fatigued, sit and rest before moving.</p>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-3">
        <div className="glass p-4"><Battery className="w-5 h-5 text-emerald-300 mb-2" /><p className="text-xs text-slate-400 uppercase tracking-wide">Pacing limit</p><p className="font-semibold text-sm mt-1">{phase.pacingLimit}</p></div>
        <div className="glass p-4"><Footprints className="w-5 h-5 text-amber-300 mb-2" /><p className="text-xs text-slate-400 uppercase tracking-wide">Movement</p><p className="font-semibold text-sm mt-1">{phase.id==='evening' ? 'Essential trips only, planned route, lights first' : phase.id==='afternoon' ? 'Short trips, sit between tasks' : 'Normal movement with breaks'}</p></div>
        <div className="glass p-4"><Hand className="w-5 h-5 text-rose-300 mb-2" /><p className="text-xs text-slate-400 uppercase tracking-wide">Right-hand grip</p><p className="font-semibold text-sm mt-1">3/5 — guide, don&apos;t carry. Left hand stabilises.</p></div>
      </div>

      <section className="glass p-4 sm:p-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-bold text-lg">Safety Checklist {phase.id==='evening' ? '— Evening Edition' : ''}</h2>
          <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${allDone ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>{done}/{SAFETY_CHECKLIST.length} confirmed</span>
        </div>
        <p className="text-sm text-slate-400 mt-1">Tap each item to confirm. Large touch targets — designed for one-handed use.</p>
        <div className="mt-4 space-y-2">
          {SAFETY_CHECKLIST.map((item) => {
            const isDone = !!checked[item.id]
            return (
              <button key={item.id} onClick={() => toggle(item.id)} aria-pressed={isDone} className={`w-full text-left flex gap-3 p-3.5 rounded-xl border transition-all min-h-[56px] ${isDone ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'}`}>
                <span className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${isDone ? 'bg-emerald-400 text-slate-950 border-emerald-400' : 'border-slate-500'}`}>{isDone && <CheckCircle2 className="w-5 h-5" />}</span>
                <span><span className={`font-semibold block ${isDone ? 'text-emerald-200 line-through decoration-emerald-500/50' : ''}`}>{item.label}</span><span className="text-sm text-slate-400 block mt-0.5">{item.detail}</span></span>
              </button>
            )
          })}
        </div>
        {allDone && <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-200 text-sm font-medium">✓ All safety checks confirmed for this window. Atlas is holding the load with you.</div>}
        <div className="h-2 bg-slate-800 rounded-full mt-4 overflow-hidden"><div className="h-full bg-emerald-400 transition-all duration-500" style={{ width: `${(done / SAFETY_CHECKLIST.length) * 100}%` }} /></div>
      </section>
    </div>
  )
}
