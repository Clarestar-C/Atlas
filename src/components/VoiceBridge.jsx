import { useEffect, useRef, useState } from 'react'
import { Volume2, Square, Mic, Sparkles, KeyRound, Cloud, Monitor } from 'lucide-react'
import { CLASSROOM_PHRASES } from '../data/content'

// ElevenLabs stock voices. A cloned voice (e.g. Alex's own banked voice)
// plugs in via the Custom Voice ID box below — it simply overrides these.
const ELEVENLABS_VOICES = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel — calm, clear (female)' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam — steady, authoritative (male)' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella — warm, friendly (female)' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni — warm, rounded (male)' },
  { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli — young, bright (female)' },
]
const ELEVENLABS_MODEL = 'eleven_flash_v2_5' // low-latency model — best for live classroom taps

export default function VoiceBridge() {
  const [custom, setCustom] = useState('')
  const [rate, setRate] = useState(0.95)
  const [pitch, setPitch] = useState(1)
  const [volume, setVolume] = useState(1)
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'speaking'
  const [lastPhrase, setLastPhrase] = useState('')
  const [lastEngine, setLastEngine] = useState('')
  const [supported, setSupported] = useState(true)
  const [notice, setNotice] = useState('')

  // Voice engine: 'elevenlabs' (natural, needs internet + key) or
  // 'device' (built-in speechSynthesis, free + offline). ElevenLabs is
  // the default when a key is available; any ElevenLabs failure falls
  // back to the device voice automatically so a phrase is never lost.
  const [engine, setEngine] = useState(() => (import.meta.env.VITE_ELEVENLABS_API_KEY ? 'elevenlabs' : 'device'))
  const [elKey, setElKey] = useState('')
  const [voiceId, setVoiceId] = useState(ELEVENLABS_VOICES[0].id)
  const [customVoiceId, setCustomVoiceId] = useState('')

  const audioRef = useRef(null)
  const cacheRef = useRef(new Map()) // `${voiceId}|${text}` -> object URL

  const effectiveKey = elKey.trim() || import.meta.env.VITE_ELEVENLABS_API_KEY || ''
  const activeVoiceId = customVoiceId.trim() || voiceId
  const speaking = status !== 'idle'

  useEffect(() => {
    setSupported('speechSynthesis' in window)
    const cache = cacheRef.current
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
      cache.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  function speakWithDevice(text) {
    if (!('speechSynthesis' in window)) {
      setStatus('idle')
      setNotice('No voice available: ElevenLabs failed and this browser has no built-in speech synthesis. Try Chrome, Edge, or Safari.')
      return
    }
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.rate = rate; u.pitch = pitch; u.volume = volume
    const voices = window.speechSynthesis.getVoices()
    const en = voices.find((v) => v.lang?.startsWith('en') && v.default) || voices.find((v) => v.lang?.startsWith('en'))
    if (en) u.voice = en
    u.onstart = () => setStatus('speaking')
    u.onend = () => setStatus('idle')
    u.onerror = () => setStatus('idle')
    setLastEngine('device voice')
    window.speechSynthesis.speak(u)
  }

  async function speakWithElevenLabs(text) {
    const cacheKey = `${activeVoiceId}|${text}`
    let url = cacheRef.current.get(cacheKey)

    if (!url) {
      setStatus('loading')
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${activeVoiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
          'xi-api-key': effectiveKey,
        },
        body: JSON.stringify({
          text,
          model_id: ELEVENLABS_MODEL,
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      })
      if (!res.ok) {
        let detail = `HTTP ${res.status}`
        try {
          const errBody = await res.json()
          const msg = errBody?.detail?.message || errBody?.detail || errBody?.message
          if (msg) detail += ` — ${msg}`
        } catch { /* keep the status-only message */ }
        throw new Error(detail)
      }
      const blob = await res.blob()
      url = URL.createObjectURL(blob)
      cacheRef.current.set(cacheKey, url)
    }

    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    const audio = new Audio(url)
    audio.volume = volume
    audio.playbackRate = rate
    audio.onplaying = () => setStatus('speaking')
    audio.onended = () => setStatus('idle')
    audio.onerror = () => { setStatus('idle') }
    audioRef.current = audio
    setLastEngine('ElevenLabs')
    await audio.play()
  }

  async function speak(text) {
    const clean = text.trim()
    if (!clean) return
    stopAll()
    setNotice('')
    setLastPhrase(clean)

    if (engine === 'device') { speakWithDevice(clean); return }

    // ElevenLabs selected:
    if (!effectiveKey) {
      setNotice('No ElevenLabs key found — add VITE_ELEVENLABS_API_KEY to .env.local (and restart npm run dev), or paste a key below. Used the device voice this time.')
      speakWithDevice(clean)
      return
    }
    try {
      await speakWithElevenLabs(clean)
    } catch (err) {
      setNotice(`ElevenLabs unavailable (${err.message}) — used the device voice instead, so nothing was lost.`)
      speakWithDevice(clean)
    }
  }

  function stopAll() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; audioRef.current = null }
    setStatus('idle')
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <section className="glass p-4 sm:p-5">
        <h2 className="font-bold text-lg flex items-center gap-2"><Mic className="w-5 h-5 text-emerald-300" /> Classroom Voice Bridge</h2>
        <p className="text-sm text-slate-400 mt-1">Built for late-afternoon bulbar fatigue: tap a phrase and Atlas speaks it clearly, at classroom volume — no vocal strain, no repetition.</p>

        <div className="flex bg-slate-800 rounded-xl p-1 mt-4 max-w-md">
          <button onClick={() => setEngine('elevenlabs')} className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 ${engine==='elevenlabs' ? 'bg-white text-slate-950' : 'text-slate-300'}`}><Cloud className="w-4 h-4" /> ElevenLabs (natural)</button>
          <button onClick={() => setEngine('device')} className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 ${engine==='device' ? 'bg-white text-slate-950' : 'text-slate-300'}`}><Monitor className="w-4 h-4" /> Device voice (offline)</button>
        </div>

        {engine === 'elevenlabs' && (
          <div className="mt-4 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block text-sm font-medium">Voice
                <select value={voiceId} onChange={(e) => setVoiceId(e.target.value)} className="mt-1.5 w-full bg-slate-950/70 border border-slate-700 rounded-xl p-3 text-[15px] outline-none focus:ring-2 focus:ring-emerald-500/40">
                  {ELEVENLABS_VOICES.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </label>
              <label className="block text-sm font-medium">Custom Voice ID <span className="text-slate-500 font-normal">(optional — e.g. a cloned voice)</span>
                <input value={customVoiceId} onChange={(e) => setCustomVoiceId(e.target.value)} placeholder="Overrides the voice list when filled" className="mt-1.5 w-full bg-slate-950/70 border border-slate-700 rounded-xl p-3 text-[15px] outline-none focus:ring-2 focus:ring-emerald-500/40" />
              </label>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium"><KeyRound className="w-4 h-4" /> ElevenLabs API key</label>
            <input type="password" value={elKey} onChange={(e) => setElKey(e.target.value)} placeholder="Paste key here — or leave blank to use .env.local" className="w-full bg-slate-950/70 border border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500/40" />
            <p className="text-xs text-slate-500">Preset phrases are cached after their first generation, so repeats play instantly and cost nothing. If ElevenLabs fails for any reason (no signal, quota, bad key), Atlas automatically falls back to the device voice — the phrase is still spoken.</p>
          </div>
        )}

        {!supported && engine === 'device' && <p className="mt-3 text-amber-300 text-sm bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">Speech synthesis is not available in this browser. Try Chrome, Edge, or Safari — or switch to ElevenLabs above.</p>}
        {notice && <p className="mt-3 text-amber-200 text-sm bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">{notice}</p>}
        {speaking && <div className="mt-3 flex items-center gap-2 text-emerald-300 text-sm font-semibold"><span className="flex gap-1">{[0,1,2].map(i=><span key={i} className="w-2 h-4 bg-emerald-400 rounded animate-pulse" style={{animationDelay:`${i*150}ms`}}/>)}</span> {status === 'loading' ? 'Generating voice…' : `Speaking via ${lastEngine}: `}“{lastPhrase}”</div>}
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CLASSROOM_PHRASES.map((phrase) => (
          <button key={phrase} onClick={() => speak(phrase)} className="glass p-4 sm:p-5 text-left min-h-[76px] hover:border-emerald-500/40 hover:bg-slate-800/80 active:scale-[0.99] transition-all group">
            <Volume2 className="w-5 h-5 text-slate-400 group-hover:text-emerald-300 mb-2" />
            <span className="text-lg sm:text-xl font-bold leading-snug block">{phrase}</span>
          </button>
        ))}
      </section>

      <section className="glass p-4 sm:p-5 space-y-4">
        <label className="block font-semibold" htmlFor="custom-text">Say something custom</label>
        <textarea id="custom-text" value={custom} onChange={(e) => setCustom(e.target.value)} rows={3} placeholder="Type what you need to say…" className="w-full bg-slate-950/70 border border-slate-700 rounded-xl p-3 text-lg outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none" />
        <div className="flex flex-wrap gap-3">
          <button onClick={() => speak(custom)} disabled={!custom.trim()} className="flex-1 min-w-[140px] bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold px-5 py-3.5 rounded-xl flex items-center justify-center gap-2 transition"><Sparkles className="w-5 h-5" /> Speak</button>
          <button onClick={stopAll} className="px-5 py-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 font-bold flex items-center gap-2 hover:bg-rose-500/25 transition"><Square className="w-4 h-4" /> Stop</button>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 pt-2">
          {[['Rate', rate, setRate, 0.5, 1.5, 0.05], ['Pitch', pitch, setPitch, 0.5, 1.5, 0.05], ['Volume', volume, setVolume, 0, 1, 0.05]].map(([label, val, setter, min, max, step]) => (
            <label key={label} className="text-sm text-slate-300 block">{label} <span className="text-slate-500">({Number(val).toFixed(2)})</span>
              <input type="range" min={min} max={max} step={step} value={val} onChange={(e) => setter(parseFloat(e.target.value))} className="w-full mt-2" />
            </label>
          ))}
        </div>
        <p className="text-xs text-slate-500">Tip: Slower rate (0.85–0.95) is often clearest in a classroom. Rate and Volume apply to both engines; Pitch only affects the device voice (ElevenLabs voices have their own natural pitch). Also raise device / speaker volume for a volume-boost effect.</p>
      </section>
    </div>
  )
}
