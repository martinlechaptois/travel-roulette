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
  (c: Country) =>
    `🧳 ALERT: my suitcase just gained sentience and it's demanding to go to ${c.flag} *${c.name}*. Who am I to argue? ${c.capital}, here I come! 🫡`,
  (c: Country) =>
    `🎰 Travel Roulette says... ${c.flag} *${c.name}*! Population: ${c.population}. I don't make the rules, I just pack the bags. See you in ${c.capital}! ✈️`,
  (c: Country) =>
    `🗺️ The universe has spoken and it whispers... *${c.name}* ${c.flag}. Located in ${c.region}, capital ${c.capital}. My out-of-office is already drafted. Don't @ me. 😎`,
  (c: Country) =>
    `🎯 *${c.name}* ${c.flag} just got picked and honestly? It picked me right back. ${c.funFact} I'm emotionally committed already. Booking flights to ${c.capital} as we speak 🛫`,
  (c: Country) =>
    `⚡ PLOT TWIST: my next vacation is in ${c.flag} *${c.name}*! Capital: ${c.capital}, region: ${c.region}. The dart has spoken and I shall obey. Resistance is futile. 🖖`,
  (c: Country) =>
    `🌍 Spinning the globe... and it stops on ${c.flag} *${c.name}*! ${c.funFact} If anyone needs me, I'll be in ${c.capital}. Don't need me. 🧘`,
  (c: Country) =>
    `🔮 The Travel Oracle has decreed: ${c.flag} *${c.name}*! A land of ${c.population} people and endless possibilities. ${c.capital} awaits. My desk chair just filed for divorce. 💼➡️🏖️`,
  (c: Country) =>
    `📮 Dear colleagues, this is my formal notice that I'm relocating to ${c.flag} *${c.name}*. Capital: ${c.capital}. ${c.funFact} Please forward my mail. Sincerely, gone. ✉️`,
  (c: Country) =>
    `🎪 AND THE WINNER IS... ${c.flag} *${c.name}*! Located in ${c.region} with the beautiful capital of ${c.capital}. Pack your envy, I'm packing my sunscreen! 🧴`,
  (c: Country) =>
    `🛰️ Satellite imagery confirms: the dart has landed in ${c.flag} *${c.name}*. Population: ${c.population}. ${c.funFact} Commencing vacation protocol. Over and out. 📻`,
  (c: Country) =>
    `🎲 Roll the dice, spin the map — the result? ${c.flag} *${c.name}*! ${c.capital} is calling and I must go. ${c.funFact} BRB, becoming a world traveler. 🌎`,
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
