import { useMemo, useState } from 'react'
import { ChefHat, ChevronLeft, ChevronRight, Sparkles, Loader2, Users, Hand, Lightbulb, KeyRound, BookOpen, RotateCcw } from 'lucide-react'
import { RECIPE, GEMINI_MOCK_TIPS } from '../data/content'

const GEMINI_MODEL = 'gemini-3.8-flash'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

// Shown in Mock mode when a new dish is requested, so the generator
// flow can be demoed end-to-end without an API key.
const MOCK_GENERATED_RECIPE = {
  title: 'One-Pan Lemon Herb Salmon Traybake',
  subtitle: 'Salmon, baby potatoes & green beans on one light tray — minimal lifting, minimal washing up.',
  baseServings: 4,
  ingredients: [
    { name: 'Salmon fillets', amount: 4, unit: '' },
    { name: 'Baby potatoes, pre-halved', amount: 600, unit: 'g' },
    { name: 'Green beans, pre-trimmed', amount: 300, unit: 'g' },
    { name: 'Lemon, pre-sliced', amount: 1, unit: '' },
    { name: 'Olive oil', amount: 2, unit: 'tbsp' },
    { name: 'Mixed herbs', amount: 1, unit: 'tbsp' },
    { name: 'Garlic cloves, pre-peeled', amount: 3, unit: '' },
    { name: 'Salt & pepper', amount: 1, unit: 'tsp' },
  ],
  steps: [
    { title: 'Sit & set up', body: 'Sit at the table. Lay the tray on the table — not the counter — and arrange potatoes, beans, and salmon within left-hand reach.', tip: 'Pacing: All assembly happens seated. Standing is only for the oven trip.', grip: 'Grip 3/5 adaptation: Everything is pre-cut and pre-trimmed. No knife work in this recipe at all.' },
    { title: 'Heat the oven', body: 'Preheat oven to 200°C / 180°C fan / Gas 6. Rest seated with a drink while it heats.', tip: 'Pacing: Use the full heat-up time as a seated break — set a timer so you do not keep checking.', grip: 'Lightweight silicone-grip mitt on the left hand for every hot move.' },
    { title: 'Build the tray', body: 'Tip potatoes onto the tray, drizzle with oil and herbs, toss gently with a large spoon. Add beans around the potatoes.', tip: 'Energy checkpoint: Toss in two short bursts with a pause between, not one long effort.', grip: 'Toss left-handed with a wide cushioned spoon. The tray stays on the table — slide it, never lift it loaded.' },
    { title: 'Add the salmon', body: 'Lay salmon fillets skin-side down on top using a fish slice. Top each with lemon slices and crushed garlic.', tip: 'Safety: Raw fish last, then wash hands seated at the sink with everything within reach.', grip: 'Use the fish slice as a lifter — no pinching or squeezing the fillets with fingers.' },
    { title: 'Roast — long rest', body: 'Slide the tray into the oven and set a timer for 22 minutes. Leave the kitchen and rest with feet up.', tip: 'Pacing: This is a recovery block. Do not fill it with clearing up.', grip: 'Oven door fully open with the left hand; step aside from the heat before sliding the tray.' },
    { title: 'Serve seated', body: 'Bring the tray straight to a heatproof mat on the table and serve from it. No plating up at the counter, no carrying.', tip: 'Evening note: Lights on bright before you move the tray; clear path oven → table.', grip: 'Carry the tray with two hands and forearms under it, close to the body — or ask for a second pair of hands.' },
  ],
}

export default function DinnerCompanion() {
  const [recipe, setRecipe] = useState(RECIPE)
  const [isGenerated, setIsGenerated] = useState(false)
  const [dish, setDish] = useState('')
  const [genLoading, setGenLoading] = useState(false)
  const [genError, setGenError] = useState('')
  const [stepIdx, setStepIdx] = useState(0)
  const [servings, setServings] = useState(RECIPE.baseServings)
  const [mode, setMode] = useState('mock')
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiTips, setAiTips] = useState([])
  const [aiError, setAiError] = useState('')
  const step = recipe.steps[stepIdx]
  const scale = servings / recipe.baseServings
  const fmt = (n) => { const v = n * scale; return v % 1 === 0 ? v : v.toFixed(1) }

  const progress = useMemo(() => ((stepIdx + 1) / recipe.steps.length) * 100, [stepIdx, recipe])

  // Key can come from the box in the Real API panel, or from .env.local
  // (VITE_GEMINI_API_KEY) in the project root. The pasted box wins.
  const effectiveKey = apiKey.trim() || import.meta.env.VITE_GEMINI_API_KEY || ''

  // Shared Gemini call with automatic retry on 503 (model busy) / 429
  // (rate limit): up to 3 attempts, waiting 2s then 4s between them.
  // Returns the model's text. Throws an Error with a readable message.
  async function callGemini(promptText, { json = false } = {}) {
    if (!effectiveKey) {
      throw new Error('No API key found. Paste a key in the Gemini panel below, or add VITE_GEMINI_API_KEY=your-key to .env.local in the project root and restart npm run dev.')
    }
    let res
    for (let attempt = 1; attempt <= 3; attempt++) {
      res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': effectiveKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          ...(json ? { generationConfig: { responseMimeType: 'application/json' } } : {}),
        }),
      })
      if (res.status !== 503 && res.status !== 429) break
      if (attempt < 3) await new Promise((r) => setTimeout(r, 2000 * attempt))
    }
    if (!res.ok) {
      let detail = `HTTP ${res.status}`
      try {
        const errBody = await res.json()
        if (errBody?.error?.message) detail += ` — ${errBody.error.message}`
      } catch { /* keep the status-only message */ }
      throw new Error(detail)
    }
    const data = await res.json()
    return data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || ''
  }

  function loadRecipe(next, generated) {
    setRecipe(next)
    setIsGenerated(generated)
    setStepIdx(0)
    setServings(next.baseServings)
    setAiTips([])
    setAiError('')
  }

  async function generateRecipe() {
    const dishName = dish.trim()
    if (!dishName) { setGenError('Type a dish first — for example "beef stew" or "mushroom risotto".'); return }
    setGenLoading(true); setGenError('')

    if (mode === 'mock') {
      setTimeout(() => { loadRecipe(MOCK_GENERATED_RECIPE, true); setGenLoading(false) }, 1400)
      return
    }

    const prompt = `You are a recipe writer for a cooking companion app used by a cook with ALS (limb onset) and reduced right-hand grip strength of 3/5, cooking a traditional Sunday dinner in the evening when fatigue is higher.

Create a complete recipe for: "${dishName}"

Respond with ONLY a JSON object (no markdown, no code fences, no extra text) in exactly this shape:
{
  "title": "Dish name",
  "subtitle": "One short line describing the dish and its pacing style.",
  "baseServings": 4,
  "ingredients": [
    { "name": "Ingredient, pre-cut where possible", "amount": 500, "unit": "g" }
  ],
  "steps": [
    { "title": "Short step title", "body": "Clear instruction in 1-3 sentences.", "tip": "A pacing or energy tip for this step.", "grip": "A grip adaptation for this step for 3/5 right-hand grip." }
  ]
}

Rules:
- 8 to 12 ingredients. Every "amount" MUST be a plain number (decimals allowed, e.g. 0.5) — never a fraction or a word — so the app can rescale servings.
- 6 to 8 steps. Build in seated prep and at least one long seated rest during cooking.
- Prefer pre-cut / pre-peeled / pre-trimmed ingredients and lightweight equipment. Avoid steps that need strong grip, heavy lifting, or prolonged standing.
- Warm, plain, practical language.`

    try {
      const text = await callGemini(prompt, { json: true })
      const clean = text.replace(/```json/gi, '').replace(/```/g, '').trim()
      const parsed = JSON.parse(clean)

      if (!parsed?.title || !Array.isArray(parsed.ingredients) || !Array.isArray(parsed.steps) || parsed.steps.length === 0) {
        throw new Error('Gemini returned an unexpected format. Try again, or try a simpler dish name.')
      }

      const safeRecipe = {
        title: String(parsed.title),
        subtitle: String(parsed.subtitle || 'Generated by Gemini — paced for grip 3/5 and evening energy.'),
        baseServings: Number(parsed.baseServings) > 0 ? Number(parsed.baseServings) : 4,
        ingredients: parsed.ingredients.map((ing) => ({
          name: String(ing.name || 'Ingredient'),
          amount: Number(ing.amount) || 0,
          unit: String(ing.unit || ''),
        })),
        steps: parsed.steps.map((s, i) => ({
          title: String(s.title || `Step ${i + 1}`),
          body: String(s.body || ''),
          tip: String(s.tip || 'Take this step seated where you can, and pause whenever forearm fatigue rises.'),
          grip: String(s.grip || 'Stabilise with the left hand; let the right hand guide rather than grip.'),
        })),
      }
      loadRecipe(safeRecipe, true)
    } catch (err) {
      const msg = err instanceof SyntaxError
        ? 'Gemini did not return clean JSON that time. Try Generate again — it usually works on a second attempt.'
        : `Recipe generation failed (${err.message})`
      setGenError(msg)
    } finally {
      setGenLoading(false)
    }
  }

  async function generateGemini() {
    setLoading(true); setAiTips([]); setAiError('')

    if (mode === 'mock') {
      setTimeout(() => { setAiTips(GEMINI_MOCK_TIPS); setLoading(false) }, 1400)
      return
    }

    const ingredientList = recipe.ingredients
      .map((ing) => `${ing.name}: ${fmt(ing.amount)}${ing.unit ? ` ${ing.unit}` : ''}`)
      .join('; ')

    const prompt = `You are an adaptive pacing assistant inside a cooking companion app for a cook with ALS (limb onset) and reduced right-hand grip strength of 3/5. It is a traditional Sunday dinner, cooked in the evening when fatigue is higher.

Recipe: ${recipe.title} — ${recipe.subtitle}
Servings: ${servings} (base recipe serves ${recipe.baseServings})
Scaled ingredients: ${ingredientList}
Current step (${stepIdx + 1} of ${recipe.steps.length}): ${step.title} — ${step.body}

Return exactly 4 short, plain lines with NO markdown, NO bullet symbols, and NO numbering. One line each, in this order:
Line 1: a grip adaptation for this step, labelled "Grip: "
Line 2: a pacing / energy tip for this step, labelled "Pacing: "
Line 3: a safety checkpoint for this step, labelled "Safety: "
Line 4: a scaling note for ${servings} servings, labelled "Scaling: "
Keep each line under 30 words, warm and practical.`

    try {
      const text = await callGemini(prompt)
      const lines = text
        .split('\n')
        .map((s) => s.replace(/^[-•*]\s*/, '').replace(/^\d+[.)]\s*/, '').trim())
        .filter(Boolean)

      if (lines.length === 0) throw new Error('Gemini returned an empty response. Try again.')
      setAiTips(lines)
    } catch (err) {
      setAiError(`Gemini call failed (${err.message}). Mock mode still works offline.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <section className="glass p-4 sm:p-5">
        <h2 className="font-bold text-xl flex items-center gap-2"><BookOpen className="w-6 h-6 text-violet-300" /> Generate a Recipe with Gemini</h2>
        <p className="text-sm text-slate-400 mt-1">Type any dish and Gemini will write it as a full paced recipe — ingredients, large-print steps, pacing tips, and grip adaptations — in the same format as the Sunday Roast. Uses the {mode === 'real' ? 'Real API' : 'Mock (demo)'} mode set in the Gemini panel below.</p>
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <input value={dish} onChange={(e) => setDish(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') generateRecipe() }} placeholder='Try "beef stew", "mushroom risotto", "apple crumble"…' className="flex-1 bg-slate-950/70 border border-slate-700 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-violet-500/40 text-[15px]" aria-label="Dish to generate" />
          <button onClick={generateRecipe} disabled={genLoading} className="bg-violet-500 hover:bg-violet-400 disabled:opacity-60 text-white font-bold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition shrink-0">
            {genLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Writing recipe…</> : <><Sparkles className="w-5 h-5" /> Generate recipe</>}
          </button>
        </div>
        {genLoading && <p className="text-sm text-slate-400 mt-3 animate-pulse">{mode === 'real' ? 'Asking Gemini to write the recipe with grip 3/5 adaptations and seated pacing…' : 'Simulating a Gemini recipe call — loading the demo traybake…'}</p>}
        {genError && <p className="text-sm text-rose-200 bg-rose-500/10 border border-rose-500/25 rounded-xl p-3 mt-4">{genError}</p>}
      </section>

      <section className="glass p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 className="font-bold text-xl flex items-center gap-2"><ChefHat className="w-6 h-6 text-amber-300" /> C1 Sunday Dinner Companion</h2>
            <h3 className="text-lg font-semibold mt-2">{recipe.title}</h3>
            <p className="text-slate-400 text-sm mt-1">{recipe.subtitle}</p>
          </div>
          {isGenerated && (
            <div className="flex flex-col items-end gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-200">✦ Gemini-generated</span>
              <button onClick={() => loadRecipe(RECIPE, false)} className="text-sm font-bold flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 transition"><RotateCcw className="w-4 h-4" /> Back to Sunday Roast</button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 mt-4 flex-wrap">
          <span className="flex items-center gap-2 text-sm"><Users className="w-4 h-4" /> Servings</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setServings(Math.max(1, servings - 1))} className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 text-xl font-bold" aria-label="Fewer servings">−</button>
            <span className="w-10 text-center text-xl font-bold">{servings}</span>
            <button onClick={() => setServings(Math.min(12, servings + 1))} className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 text-xl font-bold" aria-label="More servings">+</button>
          </div>
          <span className="text-xs text-slate-500">Ingredients scale automatically.</span>
        </div>
      </section>

      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-4 items-start">
        <section className="glass p-4 sm:p-5">
          <h3 className="font-bold mb-3">Ingredients — for {servings}</h3>
          <ul className="space-y-2">
            {recipe.ingredients.map((ing) => (
              <li key={ing.name} className="flex justify-between gap-3 py-2 border-b border-slate-800 last:border-0 text-[15px]"><span className="text-slate-200">{ing.name}</span><span className="font-semibold tabular-nums">{fmt(ing.amount)}{ing.unit ? ` ${ing.unit}` : ''}</span></li>
            ))}
          </ul>
          <div className="mt-4 p-3 rounded-xl bg-slate-800/70 border border-slate-700 text-sm text-slate-300 flex gap-2"><Hand className="w-5 h-5 text-amber-300 shrink-0" /><span><strong>Grip-friendly shopping:</strong> Choose pre-cut, pre-peeled options wherever listed. They are not shortcuts — they are pacing strategy at 3/5 grip.</span></div>
        </section>

        <section className="glass p-5 sm:p-6">
          <div className="flex justify-between text-sm text-slate-400"><span>Step {stepIdx + 1} of {recipe.steps.length}</span><span>{Math.round(progress)}%</span></div>
          <div className="h-2 bg-slate-800 rounded-full mt-2 overflow-hidden"><div className="h-full bg-amber-400 transition-all duration-500" style={{ width: `${progress}%` }} /></div>
          <h3 className="text-2xl sm:text-3xl font-bold mt-5 leading-tight">{step.title}</h3>
          <p className="text-lg sm:text-xl leading-relaxed text-slate-100 mt-3">{step.body}</p>
          <div className="mt-5 space-y-3">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex gap-3"><Lightbulb className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" /><p className="text-[15px]"><strong className="text-emerald-200">Pacing tip:</strong> <span className="text-slate-200">{step.tip.replace(/^Pacing:\s*/,'')}</span></p></div>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex gap-3"><Hand className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" /><p className="text-[15px]"><strong className="text-amber-200">Grip adaptation:</strong> <span className="text-slate-200">{step.grip.replace(/^Grip 3\/5 adaptation:\s*/,'')}</span></p></div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStepIdx(Math.max(0, stepIdx - 1))} disabled={stepIdx===0} className="flex-1 py-3.5 rounded-xl border border-slate-700 bg-slate-800 font-bold disabled:opacity-40 flex items-center justify-center gap-1"><ChevronLeft className="w-5 h-5" /> Previous</button>
            <button onClick={() => setStepIdx(Math.min(recipe.steps.length - 1, stepIdx + 1))} disabled={stepIdx===recipe.steps.length-1} className="flex-1 py-3.5 rounded-xl bg-white text-slate-950 font-bold disabled:opacity-40 flex items-center justify-center gap-1">{stepIdx===recipe.steps.length-1 ? 'Finished' : 'Next Step'} <ChevronRight className="w-5 h-5" /></button>
          </div>
          <div className="flex gap-1.5 mt-4 justify-center">{recipe.steps.map((_, i) => <button key={i} onClick={() => setStepIdx(i)} aria-label={`Go to step ${i+1}`} className={`h-2.5 rounded-full transition-all ${i===stepIdx ? 'w-8 bg-amber-400' : 'w-2.5 bg-slate-700 hover:bg-slate-600'}`} />)}</div>
        </section>
      </div>

      <section className="glass p-4 sm:p-5">
        <h3 className="font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-violet-300" /> Gemini — Adaptive Pacing Assistant</h3>
        <p className="text-sm text-slate-400 mt-1">Generate pacing tips, scaling notes, and safety checkpoints tailored to today&apos;s energy and grip.</p>
        <div className="flex bg-slate-800 rounded-xl p-1 mt-4 max-w-sm">
          <button onClick={() => setMode('mock')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${mode==='mock' ? 'bg-white text-slate-950' : 'text-slate-300'}`}>Mock (demo)</button>
          <button onClick={() => setMode('real')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${mode==='real' ? 'bg-white text-slate-950' : 'text-slate-300'}`}>Real API</button>
        </div>

        {mode === 'real' && (
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium"><KeyRound className="w-4 h-4" /> Gemini API key</label>
            <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Paste key here — or leave blank to use .env.local" className="w-full bg-slate-950/70 border border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-violet-500/40" />
            <p className="text-sm text-slate-400">The key is used only for the Gemini calls from your own browser and is never stored. Leave the box empty if you put <code>VITE_GEMINI_API_KEY</code> in <code>.env.local</code> instead. For a public deploy, move the key behind a server proxy — a browser key is visible to anyone who opens the site.</p>
          </div>
        )}

        <div className="mt-4">
          <button onClick={generateGemini} disabled={loading} className="w-full sm:w-auto bg-violet-500 hover:bg-violet-400 disabled:opacity-60 text-white font-bold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating adaptive tips…</> : <><Sparkles className="w-5 h-5" /> {mode === 'real' ? 'Generate with Gemini (real API)' : 'Generate with Gemini (mock)'}</>}
          </button>
          {loading && <p className="text-sm text-slate-400 mt-3 animate-pulse">{mode === 'real' ? 'Calling Gemini — sending recipe, servings, current step, and grip 3/5 context…' : 'Simulating Gemini API call — analysing recipe, grip 3/5, evening timing, and pacing…'}</p>}
          {aiError && <p className="text-sm text-rose-200 bg-rose-500/10 border border-rose-500/25 rounded-xl p-3 mt-4">{aiError}</p>}
          {aiTips.length > 0 && <div className="mt-4 space-y-2 animate-slide-up">{aiTips.map((tip) => <div key={tip} className="p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/25 text-[15px] text-violet-100">{tip}</div>)}</div>}
        </div>
      </section>
    </div>
  )
}
