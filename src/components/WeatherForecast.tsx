"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DayForecast, formatForecast } from "@/lib/weather";

interface WeatherForecastProps {
  lat: number;
  lng: number;
}

export default function WeatherForecast({ lat, lng }: WeatherForecastProps) {
  const [forecast, setForecast] = useState<DayForecast[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setForecast(null);
    setError(false);

    fetch(`/api/weather?lat=${lat}&lng=${lng}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setForecast(formatForecast(data)))
      .catch(() => setError(true));
  }, [lat, lng]);

  if (error) {
    return (
      <p className="text-gray-500 text-sm">Weather data unavailable</p>
    );
  }

  if (!forecast) {
    return (
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 14 }, (_, i) => (
          <div
            key={i}
            className="bg-neon/5 animate-pulse rounded-lg h-24 w-20 shrink-0"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-thin">
      {forecast.map((day, i) => (
        <motion.div
          key={day.date}
          className="bg-[#0a150a] border border-neon/10 rounded-lg p-3 min-w-[5rem] text-center shrink-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03, duration: 0.3 }}
        >
          <div className="text-gray-400 text-xs">{day.dayName}</div>
          <div className="text-2xl my-1">{day.emoji}</div>
          <div className="text-neon text-sm font-bold">{day.high}°</div>
          <div className="text-gray-500 text-xs">{day.low}°</div>
        </motion.div>
      ))}
    </div>
  );
}
