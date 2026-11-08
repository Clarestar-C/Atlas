export const SAFETY_CHECKLIST = [
  { id: 'no-carry', label: 'Do not carry items on stairs', detail: 'Use a backpack or ask for help — both hands stay free for the rail.' },
  { id: 'handrail', label: 'Use handrail both ways', detail: 'Up and down, every time — even for one or two steps.' },
  { id: 'lights', label: 'Turn on stair lights before dusk', detail: 'Set lights before 6 PM so the transition is never in low light.' },
  { id: 'rest', label: 'Sit to rest if fatigued', detail: 'Fatigue is a signal, not a challenge. Sit first, then decide.' },
  { id: 'phone', label: 'Keep phone in pocket, hands free', detail: 'No phone, cup, or laundry in hands on stairs or uneven ground.' },
  { id: 'footwear', label: 'Closed, low-heel footwear indoors', detail: 'No socks-only trips on hard floors after dark.' },
]

export const CLASSROOM_PHRASES = [
  'Please open your textbooks',
  "Let's review",
  'Quiet please, eyes on me',
  "Great question — let's explore that",
  'Five more minutes',
  'Please work in pairs',
  'Time to pack up',
  'Well done today',
]

export const RECIPE = {
  title: 'Traditional Sunday Roast',
  subtitle: 'Roast chicken, root vegetables & gravy — paced for one cook, seated breaks built in.',
  baseServings: 4,
  ingredients: [
    { name: 'Whole chicken', amount: 1.4, unit: 'kg' },
    { name: 'Potatoes, pre-cut chunks', amount: 800, unit: 'g' },
    { name: 'Carrots, pre-cut batons', amount: 400, unit: 'g' },
    { name: 'Onion, pre-sliced', amount: 1, unit: '' },
    { name: 'Garlic cloves, pre-peeled', amount: 4, unit: '' },
    { name: 'Olive oil', amount: 3, unit: 'tbsp' },
    { name: 'Fresh rosemary', amount: 2, unit: 'sprigs' },
    { name: 'Chicken stock', amount: 300, unit: 'ml' },
    { name: 'Plain flour (for gravy)', amount: 1, unit: 'tbsp' },
    { name: 'Salt & pepper', amount: 1, unit: 'tsp' },
  ],
  steps: [
    { title: 'Sit & set up', body: 'Sit at the table. Lay out pre-cut ingredients, a lightweight roasting tray, and utensils within left-hand reach. Everything on one level — no carrying across the kitchen.', tip: 'Pacing: Do all prep seated. Standing is saved for oven moments only.', grip: 'Grip 3/5 adaptation: Use pre-cut vegetables and pre-peeled garlic. Stabilise with your left hand; let the right hand guide, not grip.' },
    { title: 'Heat the oven', body: 'Preheat oven to 200°C / 180°C fan / Gas 6. Place a chair near the oven — you will sit while you wait, not stand and watch.', tip: 'Pacing: 10-minute seated rest while the oven heats. Hydrate now.', grip: 'Use a lightweight oven mitt with silicone grip on the left hand for all hot handling.' },
    { title: 'Oil & season', body: 'Tip potatoes and carrots onto the tray. Drizzle 2 tbsp olive oil, sprinkle salt and pepper, and toss with a large lightweight spoon.', tip: 'Energy checkpoint: If forearm fatigue rises, pause. Cold ingredients wait safely.', grip: 'Toss with the left hand. Use a wide, cushioned-handle spoon — avoid thin metal handles.' },
    { title: 'Prepare the chicken', body: 'Place the chicken on top of the vegetables using two large spoons as lifters. Rub with remaining oil, rosemary, and garlic placed around — not under — the bird.', tip: 'Safety: Never lift the full tray + chicken in one move. Slide, don\'t lift.', grip: 'Ask for help lifting the chicken if needed — this is the heaviest step. No grip heroics.' },
    { title: 'Roast — long rest', body: 'Slide the tray into the oven (middle shelf). Set a timer for 1 hour 15 minutes. Leave the kitchen and rest seated with feet up.', tip: 'Pacing: This is a built-in recovery block. Do not use it for chores.', grip: 'Oven door: open fully with left hand, step to the side of the heat, then slide the tray.' },
    { title: 'Check & rest the meat', body: 'Check juices run clear. Lift chicken to a board with help or spoon-lifters, cover loosely with foil, and rest 15 minutes. Keep vegetables warm in the turned-off oven.', tip: 'If fatigued at this point, sit for the full rest — carving can wait 5 extra minutes.', grip: 'Carving: Use an electric carving knife if available, or ask someone to carve. Stabilise with a fork in the left hand.' },
    { title: 'Make the gravy', body: 'Pour tray juices into a small lightweight jug. Stir flour into a little stock, add to a pan with remaining stock, simmer 3–4 minutes stirring slowly.', tip: 'Use a small pan — a full large pan is heavy when full of liquid.', grip: 'Whisk with left hand in short bursts. Rest the pan on the hob between stirs, don\'t hold it.' },
    { title: 'Serve seated', body: 'Serve at the table from dishes placed in the centre — no carrying full plates across the room. Sit, eat warm, and let clearing wait at least 20 minutes.', tip: 'Evening note: If serving after 6 PM, lights on bright, clear path chair-to-table, no plate-carrying on any step.', grip: 'Use two hands with a wide grip for dishes, or serve directly from the tray at the table.' },
  ],
}

export const GEMINI_MOCK_TIPS = [
  '✦ Gemini pacing: Split Step 3 into two 4-minute blocks with a seated pause between — forearm fatigue accumulates fastest during repetitive tossing.',
  '✦ Gemini safety checkpoint: Before the oven step, clear and light the exact path chair → oven → table. No items on the floor, lights on before dusk.',
  '✦ Gemini grip adaptation: Swap any round-handled utensil for a built-up foam handle today; at 3/5 grip, diameter matters more than weight.',
  '✦ Gemini scaling note: For extra servings, add vegetables to a second small tray rather than overloading one heavy tray.',
]
