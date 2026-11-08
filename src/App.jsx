import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import Timeline from './components/Timeline'
import SafetyMonitor from './components/SafetyMonitor'
import VoiceBridge from './components/VoiceBridge'
import DinnerCompanion from './components/DinnerCompanion'
import TabNav from './components/TabNav'
import { phaseForOverride } from './utils/timeEngine'

export default function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [override, setOverride] = useState('auto')
  // Theme: 'dark' is the original Calm Clinical design and the default.
  // 'light' adds the `light` class to <html>; the remapping lives in
  // index.css. The choice persists in localStorage.
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('atlas-theme') || 'dark' } catch { return 'dark' }
  })
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    try { localStorage.setItem('atlas-theme', theme) } catch { /* private mode — theme just won't persist */ }
  }, [theme])

  const phase = useMemo(() => phaseForOverride(override === 'auto' ? null : override), [override])

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_55%)]">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-24 sm:pb-10 space-y-4">
        <Header phase={phase} override={override} setOverride={setOverride} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
        <TabNav active={activeTab} setActive={setActiveTab} />
        <main key={activeTab + phase.id} className="animate-fade-in">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <Timeline phase={phase} />
              <SafetyMonitor phase={phase} />
            </div>
          )}
          {activeTab === 'voice' && <VoiceBridge />}
          {activeTab === 'dinner' && <DinnerCompanion />}
        </main>
        <footer className="text-center text-xs text-slate-600 pt-4 pb-2">
          Atlas — named for the C1 vertebra that bears the head, and the maps that help us navigate safely. Supportive technology, not a medical device. Always follow your clinical team&apos;s guidance.
        </footer>
      </div>
    </div>
  )
}
