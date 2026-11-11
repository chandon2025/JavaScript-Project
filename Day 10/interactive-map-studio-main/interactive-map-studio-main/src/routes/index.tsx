import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, CloudSun, Droplets, Map as MapIcon, MousePointerClick, RefreshCcw, Satellite, Sprout, TrendingUp } from "lucide-react";
import hero from "@/assets/hero-fields.jpg";
import { MapClient } from "@/components/map/MapClient";
import { SectionTitle } from "@/components/common/PageHeader";
import { crops } from "@/data/demo";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TerraShift — Grow Smarter, Farm Better" },
      { name: "description", content: "NASA-powered crop advice, soil moisture maps and weather insights for farmers." },
      { property: "og:title", content: "TerraShift — Grow Smarter, Farm Better" },
      { property: "og:description", content: "NASA-powered crop advice, soil moisture maps and weather insights for farmers." },
    ],
  }),
  component: Home,
});

export function Home() {
  const { lang, tr } = useLang();

  const features = [
    {
      icon: BrainCircuit,
      title: tr("AI Crop Intelligence", "এআই ফসল বুদ্ধিমত্তা"),
      text: tr("Best crop for your field, scored by soil, climate and market.", "মাটি, আবহাওয়া ও বাজার যাচাই করে ফসলের নিখুঁত স্কোর।"),
      tone: "bg-primary",
    },
    {
      icon: CloudSun,
      title: tr("Climate Monitoring", "জলবায়ু পর্যবেক্ষণ"),
      text: tr("7-day forecasts and early heat, flood and drought alerts.", "৭ দিনের আবহাওয়া পূর্বাভাস এবং তাপপ্রবাহ, বন্যা ও খরার আগাম সতর্কতা।"),
      tone: "bg-sky",
    },
    {
      icon: Droplets,
      title: tr("Soil Moisture Analysis", "মাটির আর্দ্রতা বিশ্লেষণ"),
      text: tr("NASA SMAP satellite readings down to district level.", "নাসা SMAP উপগ্রহের জেলাভিত্তিক মাটির গভীর আর্দ্রতা পরিমাপ।"),
      tone: "bg-forest",
    },
    {
      icon: RefreshCcw,
      title: tr("Smart Crop Rotation", "স্মার্ট ফসল আবর্তন"),
      text: tr("Season-by-season plans that keep your soil healthy.", "মৌসুমভিত্তিক সুষম ঘূর্ণন যা মাটির উর্বরতা রক্ষা করে।"),
      tone: "bg-gold",
    },
  ];

  const steps = [
    { icon: MousePointerClick, t: tr("Select your field", "আপনার জমি চিহ্নিত করুন") },
    { icon: Satellite, t: tr("Satellite data analysis", "স্যাটেলাইট তথ্য বিশ্লেষণ") },
    { icon: BrainCircuit, t: tr("Smart recommendations", "স্মার্ট ফসল পরামর্শ") },
    { icon: TrendingUp, t: tr("Better harvests", "উচ্চ ফলন ও অধিক লাভ") },
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img src={hero} alt="Green rice fields at sunrise" width={1920} height={1088} className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-hero-overlay" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-24 text-primary-foreground md:py-32 lg:grid-cols-[1.3fr_1fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-1.5 text-xs font-semibold backdrop-blur">
              <Satellite className="h-4 w-4" /> {tr("Powered by NASA Earth Data", "নাসা আর্থ ডেটা দ্বারা পরিচালিত")}
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-6xl">
              {lang === "bn" ? (
                <>
                  স্মার্ট উপায়ে চাষাবাদ। <span className="text-brand">টেকসই সমৃদ্ধ ভবিষ্যৎ।</span>
                </>
              ) : (
                <>
                  Grow Smarter. Farm Better. <span className="text-brand">Build a Sustainable Future.</span>
                </>
              )}
            </h1>
            <p className="mt-5 max-w-xl text-lg opacity-90">
              {tr(
                "Satellite soil moisture, climate and vegetation data turned into simple advice for every field in Bangladesh.",
                "উপগ্রহের মাটির আর্দ্রতা, আবহাওয়া ও উদ্ভিদের তথ্যের সমন্বয়ে বাংলাদেশের প্রতিটি মাঠের জন্য সহজ ও কার্যকর পরামর্শ।"
              )}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-sm sm:max-w-none">
              <Link to="/advisory" className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 font-bold text-accent-foreground shadow-lift transition-transform hover:scale-105 text-sm sm:text-base text-center">
                {tr("Get Smart Crop Advice", "স্মার্ট ফসল পরামর্শ পান")} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/map" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 bg-black/25 px-6 py-3.5 font-bold text-white backdrop-blur hover:bg-white/20 text-sm sm:text-base text-center">
                <MapIcon className="h-4 w-4" /> {tr("Analyse My Field", "আমার মাঠ বিশ্লেষণ করুন")}
              </Link>
            </div>
          </motion.div>
          <div className="relative hidden lg:block">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute right-0 top-4 w-64 rounded-3xl border border-white/10 bg-[#091B13]/90 p-5 text-white shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between text-sm text-white/80">
                <span>{tr("Bogura", "বগুড়া")}</span>
                <CloudSun className="h-6 w-6 text-gold" />
              </div>
              <div className="mt-2 text-4xl font-bold text-white">28°C</div>
              <div className="mt-2 flex gap-4 text-xs text-white/80">
                <span>💧 {tr("68% Humidity", "৬৮% আর্দ্রতা")}</span>
                <span>🌧 {tr("0mm Rain", "০ মিমি বৃষ্টি")}</span>
              </div>
            </motion.div>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 6 }} className="absolute bottom-0 left-4 w-72 rounded-3xl border border-white/10 bg-[#091B13]/90 p-5 text-white shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#34D399]">
                <Sprout className="h-4 w-4" /> {tr("Top recommendation", "সেরা সুপারিশকৃত ফসল")}
              </div>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-4xl">🌾</span>
                <div>
                  <div className="font-bold text-white">{tr("Boro Rice", "বোরো ধান")}</div>
                  <div className="text-xs text-white/80">{tr("92% suitability · Low risk", "৯২% উপযোগিতা · কম ঝুঁকি")}</div>
                </div>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/20">
                <div className="h-2 w-[92%] rounded-full bg-[#34D399]" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionTitle
          eyebrow={tr("Smart agriculture", "স্মার্ট কৃষি প্রযুক্তি")}
          title={tr("Everything your field needs", "আপনার ফসলের মাঠের পূর্ণাঙ্গ সমাধান")}
          sub={tr("Four tools, one simple platform.", "৪টি শক্তিশালী টুল, একটি সহজ প্ল্যাটফর্মে।")}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-lift rounded-3xl border border-border bg-card p-6 shadow-soft">
              <div className={`grid h-12 w-12 place-items-center rounded-2xl ${f.tone} text-primary-foreground`}><f.icon className="h-6 w-6" /></div>
              <h3 className="mt-5 text-lg font-bold text-forest dark:text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-secondary/60 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle
            eyebrow={tr("How it works", "কীভাবে কাজ করে")}
            title={tr("From field to forecast in four steps", "৪টি সহজ ধাপে মাঠ থেকে পূর্বাভাস")}
          />
          <div className="grid gap-4 md:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.t} className="relative rounded-3xl bg-card p-6 text-center shadow-soft">
                <span className="absolute left-4 top-4 font-display text-3xl font-extrabold text-secondary">0{i + 1}</span>
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand text-primary-foreground"><s.icon className="h-6 w-6" /></div>
                <p className="mt-4 font-semibold text-forest dark:text-white">{s.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionTitle
          eyebrow={tr("Interactive map", "ইন্টারেক্টিভ মানচিত্র")}
          title={tr("See your land from space", "মহাকাশ থেকে আপনার জমি দেখুন")}
          sub={tr("Switch layers, search a district or drop a pin on your field.", "স্যাটেলাইট লেয়ার পরিবর্তন করুন বা আপনার জমিতে পিন দিন।")}
        />
        <MapClient height={560} />
        <div className="mt-6 text-center">
          <Link to="/map" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">
            {tr("Open full map studio", "সম্পূর্ণ মানচিত্র স্টুডিও খুলুন")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8">
        <SectionTitle
          eyebrow={tr("AI recommendations", "এআই ফসলের সুপারিশ")}
          title={tr("Crops that fit your field", "আপনার জমির জন্য সবচেয়ে উপযোগী ফসল")}
        />
        <div className="grid gap-5 md:grid-cols-3">
          {crops.slice(0, 3).map((c) => (
            <div key={c.name} className="card-lift rounded-3xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="text-5xl">{c.emoji}</span>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-forest dark:text-white">
                  {lang === "bn" ? (c.season === "Rabi" ? "রবি মৌসুম" : "খরিপ মৌসুম") : c.season}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-bold text-forest dark:text-white">{c.name}</h3>
              <div className="mt-3 h-2 rounded-full bg-muted">
                <div className="h-2 rounded-full bg-brand" style={{ width: `${c.score}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                <span>{tr("Suitability", "উপযোগিতা")} {c.score}%</span>
                <span>{tr("Risk:", "ঝুঁকি:")} {lang === "bn" ? (c.risk === "Low" ? "কম" : "মাঝারি") : c.risk}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4">
        <div className="grid gap-6 rounded-[2rem] bg-brand p-10 text-primary-foreground md:grid-cols-4">
          {[
            ["৫০,০০০+", tr("Farmers Empowered", "উপকৃত কৃষক")],
            ["৬৪", tr("Districts Covered", "জেলায় কভারেজ")],
            ["১২ লাখ+", tr("Acres Mapped", "একর জমি ম্যাপিং")],
            ["৩২%", tr("Avg. Yield Gain", "গড় ফলন বৃদ্ধি")],
          ].map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="font-display text-4xl font-extrabold">{n}</div>
              <div className="mt-1 text-sm opacity-90">{l}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
