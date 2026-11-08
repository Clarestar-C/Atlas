import { useEffect, useState } from 'react'
import { Compass, Clock, Sun, Moon } from 'lucide-react'
import { formatTime } from '../utils/timeEngine'

export default function Header({ phase, override, setOverride, theme, onToggleTheme }) {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id) }, [])
  return (
    <header className="glass p-4 sm:p-5 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Compass className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight leading-tight">Atlas <span className="text-slate-500 font-normal">|</span> C1 Support &amp; Navigation System</h1>
            <p className="text-sm text-slate-400 mt-0.5">For Alex — load-bearing support, clear navigation, calmer days.</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end text-slate-300"><Clock className="w-4 h-4" /><span className="text-xl font-semibold tabular-nums">{formatTime(now)}</span></div>
          <p className="text-xs text-slate-500">{now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <button onClick={onToggleTheme} aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'} className="mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-all-soft">
            {theme === 'light' ? <><Moon className="w-4 h-4" /> Dark mode</> : <><Sun className="w-4 h-4" /> Light mode</>}
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold ${phase.accentClasses.badge}`}>
          <span className={`w-2 h-2 rounded-full animate-pulse-soft ${phase.accentClasses.dot}`} />
          {phase.label} — {phase.id === 'morning' ? 'Morning Peak' : phase.label}
        </span>
        <span className="text-sm text-slate-400 flex-1 min-w-[200px]">{phase.tagline}</span>
        <label className="flex items-center gap-2 text-xs text-slate-400">Simulate time
          <select value={override} onChange={(e) => setOverride(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/40">
            <option value="auto">Auto (real time)</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          </select>
        </label>
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-[11px] text-slate-500 mb-1"><span>Energy guide</span><span>{phase.energy}%</span></div>
        <div className="h-2 rounded-full bg-slate-800 overflow-hidden"><div className={`h-full rounded-full transition-all duration-700 ${phase.id==='morning'?'bg-emerald-400':phase.id==='afternoon'?'bg-amber-400':'bg-rose-400'}`} style={{ width: `${phase.energy}%` }} /></div>
      </div>
    </header>
  )
}
