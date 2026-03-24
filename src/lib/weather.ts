export interface DayForecast {
  date: string;
  dayName: string;
  emoji: string;
  high: number;
  low: number;
}

export function mapWeatherCode(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 48) return "🌫️";
  if (code <= 57) return "🌦️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "🌨️";
  if (code <= 82) return "🌧️";
  if (code <= 86) return "🌨️";
  if (code <= 99) return "⛈️";
  return "🌡️";
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function formatForecast(data: {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
  };
}): DayForecast[] {
  return data.daily.time.map((date, i) => {
    const d = new Date(date + "T00:00:00");
    return {
      date,
      dayName: DAY_NAMES[d.getDay()],
      emoji: mapWeatherCode(data.daily.weathercode[i]),
      high: Math.round(data.daily.temperature_2m_max[i]),
      low: Math.round(data.daily.temperature_2m_min[i]),
    };
  });
}
