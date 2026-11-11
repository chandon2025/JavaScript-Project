import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CloudRain, Droplets, Thermometer, Wind } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/common/PageHeader";
import { forecast } from "@/data/demo";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/weather")({
  head: () => ({
    meta: [
      { title: "Weather & Climate — TerraShift" },
      { name: "description", content: "7-day farm forecast, rainfall, humidity and climate risk alerts." },
      { property: "og:title", content: "Weather & Climate — TerraShift" },
      { property: "og:description", content: "7-day farm forecast, rainfall, humidity and climate risk alerts." },
    ],
  }),
  component: Weather,
});

export function Weather() {
  const { tr } = useLang();

  const cards = [
    { icon: Thermometer, l: tr("Temperature", "তাপমাত্রা"), v: "28°C", tone: "bg-gold" },
    { icon: CloudRain, l: tr("Rainfall (7d)", "বৃষ্টিপাত (৭ দিন)"), v: "0 mm", tone: "bg-sky" },
    { icon: Droplets, l: tr("Humidity", "আর্দ্রতা"), v: "68%", tone: "bg-primary" },
    { icon: Wind, l: tr("Wind Speed", "বাতাসের গতি"), v: "10 km/h", tone: "bg-forest" },
  ];

  return (
    <>
      <PageHeader
        eyebrow={tr("Weather & Climate", "আবহাওয়া ও জলবায়ু")}
        title={tr("Bogura · 7-day farm outlook", "বগুড়া · ৭ দিনের কৃষি আবহাওয়া পূর্বাভাস")}
      >
        {tr(
          "Forecast blended from NASA POWER agroclimatology and local BMD weather stations.",
          "নাসা POWER কৃষি-আবহাওয়াবিদ্যা ও স্থানীয় বিএমডি আবহাওয়া কেন্দ্রের তথ্যের সমন্বয়ে তৈরি।"
        )}
      </PageHeader>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.l} className="flex items-center gap-4 rounded-3xl border border-border bg-card p-5 shadow-soft">
              <div className={`grid h-12 w-12 place-items-center rounded-2xl ${c.tone} text-primary-foreground`}>
                <c.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{c.l}</div>
                <div className="text-2xl font-bold text-forest dark:text-white">{c.v}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-3 rounded-3xl border border-gold bg-gold/15 p-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-forest dark:text-amber-300" />
          <div>
            <b className="text-forest dark:text-white">
              {tr("Optimal farming weather — Sunny & Clear.", "অনুকূল কৃষি আবহাওয়া — রোদযুক্ত ও শুষ্ক।")}
            </b>{" "}
            <span className="text-muted-foreground">
              {tr(
                "Ideal conditions for field preparation and certified seed sowing. Safe for fertilizer top-dressing.",
                "জমি তৈরি ও প্রত্যয়িত বীজ বপনের জন্য উপযুক্ত পরিস্থিতি। জমিতে ইউরিয়া সার প্রয়োগের জন্য নিরাপদ।"
              )}
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h3 className="mb-4 font-bold text-forest dark:text-white">{tr("Temperature (°C)", "তাপমাত্রা (°সে.)")}</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={forecast}>
                <defs>
                  <linearGradient id="t" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" />
                <YAxis domain={[20, 35]} />
                <Tooltip />
                <Area dataKey="temp" stroke="var(--gold)" strokeWidth={3} fill="url(#t)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h3 className="mb-4 font-bold text-forest dark:text-white">{tr("Rainfall (mm)", "বৃষ্টিপাত (মিমি)")}</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="rain" fill="var(--sky)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
