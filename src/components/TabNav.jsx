import { ShieldCheck, Megaphone, ChefHat } from 'lucide-react'

const TABS = [
  { id: 'overview', label: 'Overview', icon: ShieldCheck },
  { id: 'voice', label: 'Voice', icon: Megaphone },
  { id: 'dinner', label: 'Dinner', icon: ChefHat },
]

export default function TabNav({ active, setActive }) {
  return (
    <>
      <nav className="hidden sm:flex gap-2 glass p-1.5" aria-label="Primary">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActive(id)} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${active===id ? 'bg-white text-slate-950 shadow' : 'text-slate-300 hover:bg-slate-800'}`}>
            <Icon className="w-4 h-4" /> {label}{id==='overview' ? ' / Safety' : ''}
          </button>
        ))}
      </nav>
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-slate-900/95 backdrop-blur border-t border-slate-800 px-2 py-2 flex" aria-label="Mobile">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActive(id)} className={`flex-1 flex flex-col items-center gap-1 py-1 rounded-lg text-xs font-semibold ${active===id ? 'text-emerald-300' : 'text-slate-400'}`}>
            <Icon className="w-5 h-5" /> {label}
          </button>
        ))}
      </nav>
    </>
  )
}
