export function getPhase(hour) {
  if (typeof hour !== 'number' || Number.isNaN(hour)) hour = new Date().getHours()
  if (hour >= 5 && hour < 12) {
    return {
      id: 'morning',
      label: 'Morning Peak',
      short: 'Morning',
      tagline: 'Highest strength & clarity — schedule demanding tasks now.',
      accent: 'emerald',
      accentClasses: { badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400', text: 'text-emerald-300', ring: 'ring-emerald-500/30' },
      energy: 90, pacingLimit: 'Full activity with planned breaks every 45 min',
    }
  }
  if (hour >= 12 && hour < 18) {
    return {
      id: 'afternoon',
      label: 'Afternoon Pacing',
      short: 'Afternoon',
      tagline: 'Energy tapering — bulbar fatigue may rise. Pace, hydrate, use Voice Bridge.',
      accent: 'amber',
      accentClasses: { badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30', dot: 'bg-amber-400', text: 'text-amber-300', ring: 'ring-amber-500/30' },
      energy: 55, pacingLimit: 'Lighter tasks, breaks every 25–30 min, conserve voice',
    }
  }
  return {
    id: 'evening',
    label: 'Evening Fall Risk',
    short: 'Evening',
    tagline: 'Post-6 PM: dusk + stairs hazard window. Hands free, lights on, no carrying on stairs.',
    accent: 'rose',
    accentClasses: { badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30', dot: 'bg-rose-400', text: 'text-rose-300', ring: 'ring-rose-500/30' },
    energy: 30, pacingLimit: 'Essential movement only — seated rest, assisted stairs if fatigued',
  }
}

export function phaseForOverride(override) {
  if (override === 'morning') return getPhase(9)
  if (override === 'afternoon') return getPhase(15)
  if (override === 'evening') return getPhase(19)
  return getPhase(new Date().getHours())
}

export function formatTime(date) {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}
