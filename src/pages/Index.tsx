import { Navigation } from "@/components/Navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const WEDDING_DATE = new Date("2026-07-11T11:00:00");

// Coordonnées de Calcatoggio
const LAT = 42.05;
const LON = 8.82;

const WMO_CODES: Record<number, { label: string; emoji: string }> = {
  0:  { label: "Ciel dégagé",     emoji: "☀️" },
  1:  { label: "Peu nuageux",     emoji: "🌤️" },
  2:  { label: "Partiellement nuageux", emoji: "⛅" },
  3:  { label: "Couvert",         emoji: "☁️" },
  45: { label: "Brouillard",      emoji: "🌫️" },
  48: { label: "Brouillard givrant", emoji: "🌫️" },
  51: { label: "Bruine légère",   emoji: "🌦️" },
  53: { label: "Bruine",          emoji: "🌦️" },
  55: { label: "Bruine dense",    emoji: "🌧️" },
  61: { label: "Pluie légère",    emoji: "🌧️" },
  63: { label: "Pluie",           emoji: "🌧️" },
  65: { label: "Forte pluie",     emoji: "🌧️" },
  80: { label: "Averses légères", emoji: "🌦️" },
  81: { label: "Averses",         emoji: "🌦️" },
  82: { label: "Fortes averses",  emoji: "⛈️" },
  95: { label: "Orage",           emoji: "⛈️" },
  96: { label: "Orage avec grêle", emoji: "⛈️" },
};

const DAYS_FR = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

interface WeatherDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  code: number;
}

function useCountdown() {
  const [diff, setDiff] = useState(() => WEDDING_DATE.getTime() - Date.now());

  useEffect(() => {
    const id = setInterval(() => setDiff(WEDDING_DATE.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (diff <= 0) return null;

  const days    = Math.floor(diff / 86400000);
  const hours   = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return { days, hours, minutes, seconds };
}

function Countdown() {
  const t = useCountdown();
  if (!t) return (
    <p className="font-dancing text-3xl text-savethedate-brown">C'est aujourd'hui</p>
  );

  return (
    <div className="space-y-1">
      <p className="text-xs tracking-widest text-stone-400 uppercase">Plus que</p>
      <p className="font-dancing text-4xl sm:text-5xl text-stone-800 leading-none">
        J&thinsp;-&thinsp;{t.days}
      </p>
      <p className="text-xs text-stone-400 font-light tracking-wider">
        {String(t.hours).padStart(2, "0")}h {String(t.minutes).padStart(2, "0")}min
      </p>
    </div>
  );
}

function WeatherFooterLine() {
  const { data, isLoading, isError } = useQuery<WeatherDay[]>({
    queryKey: ["weather"],
    queryFn: async () => {
      const url = new URL("https://api.open-meteo.com/v1/forecast");
      url.searchParams.set("latitude",  String(LAT));
      url.searchParams.set("longitude", String(LON));
      url.searchParams.set("daily",     "temperature_2m_max,temperature_2m_min,weathercode");
      url.searchParams.set("timezone",  "Europe/Paris");
      url.searchParams.set("forecast_days", "7");
      const res = await fetch(url.toString());
      const json = await res.json();
      return json.daily.time.map((date: string, i: number) => ({
        date,
        maxTemp: Math.round(json.daily.temperature_2m_max[i]),
        minTemp: Math.round(json.daily.temperature_2m_min[i]),
        code:    json.daily.weathercode[i],
      }));
    },
    staleTime: 1000 * 60 * 60,
  });

  if (isLoading || isError || !data) return null;

  return (
    <p className="text-center text-[11px] font-light text-stone-400 tracking-wide pb-6">
      Météo · Calcatoggio
      <span className="mx-2 text-stone-300">·</span>
      {data.map((day, i) => {
        const d = new Date(day.date + "T12:00:00");
        const isWeddingDay = day.date === "2026-07-11";
        const weather = WMO_CODES[day.code] ?? { emoji: "–", label: "–" };
        return (
          <span key={day.date}>
            {i > 0 && <span className="mx-1.5 text-stone-200">·</span>}
            <span className={isWeddingDay ? "text-savethedate-brown" : ""}>
              {isWeddingDay ? "Sam J" : DAYS_FR[d.getDay()]} {weather.emoji} {day.maxTemp}°
            </span>
          </span>
        );
      })}
    </p>
  );
}

export default function Index() {
  return (
    <div className="bg-cream min-h-screen w-full font-sans overflow-x-hidden flex flex-col">
      <div className="container mx-auto px-6 sm:px-8 flex flex-col flex-grow">
        {/* Header */}
        <header className="py-8 sm:py-12">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-1 hover:opacity-80 transition-opacity">
              <span className="font-dancing text-2xl font-medium text-stone-800">L</span>
              <span className="font-sans text-sm font-thin text-stone-800">&</span>
              <span className="font-dancing text-2xl font-medium text-stone-800">C</span>
            </a>
            <Navigation />
          </div>
        </header>

        {/* Hero Section */}
        <main className="py-12 lg:py-16 flex-grow">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Photo */}
            <div className="order-2 lg:order-1 flex justify-center items-center">
              <div className="relative">
                <img
                  src="/corsica2.svg"
                  alt=""
                  aria-hidden
                  className="absolute -top-16 -right-16 z-0 w-[70%] opacity-50 pointer-events-none select-none"
                />
                <div className="relative overflow-hidden rounded shadow-xl group z-10">
                  <img
                    src="/lovable-uploads/2.png"
                    alt="Couple"
                    className="w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
              </div>
            </div>

            {/* Texte */}
            <div className="text-center lg:text-left flex flex-col items-center lg:items-start order-1 lg:order-2 gap-6 sm:gap-8">
              <div className="font-dancing text-5xl sm:text-6xl lg:text-7xl">
                <h2>Wedding</h2>
                <h2 className="-mt-2 sm:-mt-4">Day</h2>
              </div>

              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <p className="font-sans text-[#6E6E6E] tracking-[0.2em] text-base sm:text-lg">
                  11 . 07 . 2026
                </p>
                <span className="text-stone-400 pb-1">•</span>
                <p className="font-sans text-stone-500 text-sm tracking-wider">
                  Calcatoggio
                </p>
              </div>

              <p className="text-gray-600 max-w-md leading-relaxed font-light text-sm sm:text-base text-justify">
                On est très heureux de vous embarquer dans cette belle aventure :
                notre mariage ! Cap sur la Corse, entre mer et maquis, une île
                qu'on aime profondément. On a hâte de vivre ce moment unique
                avec vous, entourés de soleil, d'amour, de notre famille et de
                nos amis.
              </p>

              {/* Compte à rebours */}
              <Countdown />

            </div>
          </div>
        </main>

        <WeatherFooterLine />
        <SiteFooter />
      </div>
    </div>
  );
}
