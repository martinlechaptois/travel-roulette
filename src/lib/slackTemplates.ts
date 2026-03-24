import { Country } from "./countries";

const templates = [
  (c: Country) =>
    `🎯 The dart has spoken! I'm heading to ${c.flag} *${c.name}*! Did you know the capital is ${c.capital}? Pack your bags (or just your envy) 😎`,
  (c: Country) =>
    `🌍 Travel Roulette chose *${c.name}* ${c.flag} for me! Capital: ${c.capital}. Population: ${c.population}. Fun fact: ${c.funFact} See you never! ✈️`,
  (c: Country) =>
    `🎲 Plot twist: my next destination is ${c.flag} *${c.name}*! Located in ${c.region}, with ${c.capital} as its capital. Who's jealous? 🧳`,
  (c: Country) =>
    `✈️ Breaking news: Travel Roulette just sent me to ${c.flag} *${c.name}*! ${c.funFact} — Can't wait to see ${c.capital}! 🗺️`,
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
