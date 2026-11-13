import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Lang = "en" | "bn";

const dict = {
  home: { en: "Home", bn: "হোম" },
  map: { en: "Field Analysis", bn: "মাঠ বিশ্লেষণ" },
  advisory: { en: "Crop Advisory", bn: "ফসল পরামর্শ" },
  rotation: { en: "Crop Rotation", bn: "ফসল আবর্তন" },
  weather: { en: "Weather", bn: "আবহাওয়া" },
  community: { en: "Farmer Network", bn: "কৃষক নেটওয়ার্ক" },
  market: { en: "Marketplace", bn: "বাজার" },
  about: { en: "About", bn: "আমাদের সম্পর্কে" },
  advice: { en: "Get Smart Advice", bn: "স্মার্ট পরামর্শ" },
  tagline: { en: "Smarter Farming. Stronger Future.", bn: "স্মার্ট কৃষি। শক্তিশালী ভবিষ্যৎ।" },
  platform: { en: "Platform", bn: "প্ল্যাটফর্ম" },
  contact: { en: "Contact", bn: "যোগাযোগ" },
  dhaka_bd: { en: "Dhaka, Bangladesh", bn: "ঢাকা, বাংলাদেশ" },
  copyright: {
    en: "© 2026 TerraShift. Powered by NASA Earth observation data.",
    bn: "© ২০২৬ টেরাশিফট। নাসা উপগ্রহ পর্যবেক্ষণ তথ্য দ্বারা পরিচালিত।",
  },
  searchPlaceholder: {
    en: "Search crops, districts, weather data, articles…",
    bn: "ফসল, জেলা, আবহাওয়া তথ্য বা নিবন্ধ খুঁজুন…",
  },
} as const;

export type Key = keyof typeof dict;

interface LangContextType {
  lang: Lang;
  toggle: () => void;
  setLang: (lang: Lang) => void;
  t: (k: Key) => string;
  tr: (en: string, bn: string) => string;
  isBn: boolean;
}

const Ctx = createContext<LangContextType>({
  lang: "en",
  toggle: () => {},
  setLang: () => {},
  t: (k: Key) => dict[k]?.en || k,
  tr: (en: string, bn: string) => en,
  isBn: false,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("terrashift_lang") as Lang | null;
      if (saved === "en" || saved === "bn") return saved;
    }
    return "en";
  });

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("terrashift_lang", newLang);
      document.documentElement.lang = newLang;
    }
  };

  const toggle = () => {
    setLang(lang === "en" ? "bn" : "en");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const t = (k: Key) => dict[k]?.[lang] || dict[k]?.en || k;
  const tr = (en: string, bn: string) => (lang === "bn" ? bn : en);

  return (
    <Ctx.Provider value={{ lang, toggle, setLang, t, tr, isBn: lang === "bn" }}>
      {children}
    </Ctx.Provider>
  );
}

export const useLang = () => useContext(Ctx);
