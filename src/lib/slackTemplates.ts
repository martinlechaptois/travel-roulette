import { Country } from "./countries";

const templates = [
  (c: Country) =>
    `🚀 Houston, we have a destination! The dart has locked onto ${c.flag} *${c.name}*! Capital: ${c.capital}. One small step for man, one giant leap for my passport. T-minus NOW! 🌍`,
  (c: Country) =>
    `🛸 Mission Control here — Travel Roulette has selected ${c.flag} *${c.name}* for orbital insertion! Population: ${c.population}. Fun fact: ${c.funFact} This is one mission I won't abort! 🧑‍🚀`,
  (c: Country) =>
    `🌕 "That's one small throw, one giant trip!" The dart has landed in ${c.flag} *${c.name}*, ${c.region}! Capital: ${c.capital}. Commencing launch sequence... godspeed, travelers! 🚀`,
  (c: Country) =>
    `📡 BREAKING from Mission Control: trajectory locked on ${c.flag} *${c.name}*! ${c.funFact} — Failure is not an option. See you in ${c.capital}! Ad astra! ✨`,
];

export function generateSlackMessage(country: Country): string {
  const idx = Math.floor(Math.random() * templates.length);
  return templates[idx](country);
}

export function regenerateSlackMessage(
  country: Country,
  currentMessage: string
): string {
  let msg = currentMessage;
  let attempts = 0;
  while (msg === currentMessage && attempts < 10) {
    msg = generateSlackMessage(country);
    attempts++;
  }
  return msg;
}
