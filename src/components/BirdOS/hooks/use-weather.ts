'use client';

import { useEffect, useState } from 'react';

interface WeatherState {
  label: string;
  emoji: string;
  temp: string;
}

const WMO_CODES: Record<number, { label: string; emoji: string }> = {
  0: { label: 'Sunny', emoji: '☀️' },
  1: { label: 'Mainly Clear', emoji: '🌤️' },
  2: { label: 'Partly Cloudy', emoji: '⛅' },
  3: { label: 'Cloudy', emoji: '☁️' },
  45: { label: 'Foggy', emoji: '🌫️' },
  48: { label: 'Icy Fog', emoji: '🌫️' },
  51: { label: 'Light Drizzle', emoji: '🌦️' },
  53: { label: 'Drizzle', emoji: '🌦️' },
  55: { label: 'Heavy Drizzle', emoji: '🌦️' },
  61: { label: 'Light Rain', emoji: '🌧️' },
  63: { label: 'Rainy', emoji: '🌧️' },
  65: { label: 'Heavy Rain', emoji: '🌧️' },
  71: { label: 'Light Snow', emoji: '🌨️' },
  73: { label: 'Snowy', emoji: '🌨️' },
  75: { label: 'Heavy Snow', emoji: '❄️' },
  77: { label: 'Snow Grains', emoji: '🌨️' },
  80: { label: 'Showers', emoji: '🌦️' },
  81: { label: 'Showers', emoji: '🌦️' },
  82: { label: 'Heavy Showers', emoji: '🌧️' },
  85: { label: 'Snow Showers', emoji: '🌨️' },
  86: { label: 'Heavy Snow Showers', emoji: '❄️' },
  95: { label: 'Thunderstorm', emoji: '⛈️' },
  96: { label: 'Thunderstorm', emoji: '⛈️' },
  99: { label: 'Thunderstorm', emoji: '⛈️' }
};

function decode(code: number) {
  return WMO_CODES[code] ?? { label: 'Clear', emoji: '🌤️' };
}

export function useWeather(): WeatherState {
  const [state, setState] = useState<WeatherState>({ label: '...', emoji: '🌤️', temp: '' });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ label: 'Unavailable', emoji: '🌤️', temp: '' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=weather_code,temperature_2m&timezone=auto`
          );
          const data = (await res.json()) as {
            current: { weather_code: number; temperature_2m: number };
            current_units: { temperature_2m: string };
          };
          const { label, emoji } = decode(data.current.weather_code);
          const temp = `${Math.round(data.current.temperature_2m)}${data.current_units.temperature_2m}`;
          setState({ label, emoji, temp });
        } catch {
          setState({ label: 'Unavailable', emoji: '🌤️', temp: '' });
        }
      },
      () => setState({ label: 'Unavailable', emoji: '🌤️', temp: '' })
    );
  }, []);

  return state;
}
