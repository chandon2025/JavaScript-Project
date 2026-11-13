import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  CloudSun,
  History,
  Home,
  Info,
  Languages,
  Map,
  Menu,
  Moon,
  RotateCcw,
  Search,
  ShoppingBasket,
  Sparkles,
  Sun,
  Users,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import logo from "@/assets/logo.jpg";
import { useLang, type Key } from "@/lib/lang";
import { useTheme } from "@/lib/theme";

interface NavItemConfig {
  to: "/" | "/map" | "/advisory" | "/rotation" | "/weather" | "/community" | "/marketplace" | "/about";
  k: Key;
  icon: any;
  descEn: string;
  descBn: string;
  isMore?: boolean;
}

const links: NavItemConfig[] = [
  { to: "/", k: "home", icon: Home, descEn: "Overview & Bogura weather", descBn: "সারসংক্ষেপ ও বগুড়ার আবহাওয়া" },
  { to: "/map", k: "map", icon: Map, descEn: "6-step field analysis & soil matrix", descBn: "৬ ধাপে জমির বিশ্লেষণ ও মাটির মানদণ্ড" },
  { to: "/advisory", k: "advisory", icon: Sparkles, descEn: "AI crop suggestions & radar compare", descBn: "এআই ফসলের পরামর্শ ও তুলনা", isMore: true },
  { to: "/rotation", k: "rotation", icon: RotateCcw, descEn: "Multi-year crop trajectory engine", descBn: "বহুবর্ষীয় ফসল আবর্তন ও ঘূর্ণন ইঞ্জিন", isMore: true },
  { to: "/weather", k: "weather", icon: CloudSun, descEn: "7-day forecast & NASA SMAP telemetry", descBn: "৭ দিনের পূর্বাভাস ও নাসা টেলিমেট্রি", isMore: true },
  { to: "/community", k: "community", icon: Users, descEn: "Connect with local farmers & experts", descBn: "কৃষকদের অভিজ্ঞতা ও আলোচনা" },
  { to: "/marketplace", k: "market", icon: ShoppingBasket, descEn: "Buy seeds, equipment & direct trade", descBn: "বীজ, সার ও সরাসরি কৃষি বাজার" },
  { to: "/about", k: "about", icon: Info, descEn: "NASA satellite data & our mission", descBn: "নাসা উপগ্রহ তথ্য ও আমাদের লক্ষ্য", isMore: true },
];

export function Navbar() {
  const { t, toggle: toggleLang, lang } = useLang();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-[1000] border-b border-border/80 bg-white/95 text-forest backdrop-blur-xl transition-colors shadow-sm dark:border-white/10 dark:bg-[#08150E]/95 dark:text-white">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6">
        {/* Brand Logo & Title */}
        <Link to="/" onClick={() => setOpen(false)} className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <img
            src={logo}
            alt="TerraShift logo"
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-contain bg-white p-0.5 shadow-soft ring-1 ring-border dark:ring-white/20"
          />
          <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-forest dark:text-white">
            Terra<span className="text-[#107548] dark:text-[#34D399]">Shift</span>
          </span>
        </Link>

        {/* Desktop Navigation Links — Larger, Clearer & Legible */}
        <nav className="ml-3 hidden items-center gap-1.5 lg:flex xl:gap-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-forest dark:text-white/80 dark:hover:bg-white/15 dark:hover:text-white xl:px-3.5 xl:text-[15px]"
              activeProps={{
                className: "bg-[#107548]/15 text-[#107548] font-bold dark:bg-white/20 dark:text-white shadow-sm",
              }}
            >
              {t(l.k)}
            </Link>
          ))}
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search Toggle */}
          <button
            aria-label="Search"
            onClick={() => setSearch((s) => !s)}
            className="rounded-full p-1.5 sm:p-2 text-forest/80 hover:bg-secondary hover:text-forest dark:text-white/80 dark:hover:bg-white/15 dark:hover:text-white transition-colors"
          >
            <Search className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            aria-label="Toggle Theme"
            onClick={toggleTheme}
            className="rounded-full p-1.5 sm:p-2 text-forest/80 hover:bg-secondary hover:text-forest dark:text-white/80 dark:hover:bg-white/15 dark:hover:text-white transition-colors"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-slate-700 dark:text-slate-200" />
            )}
          </button>

          {/* History / Clock Icon (Desktop Only) */}
          <Link
            to="/weather"
            aria-label="History & Timeline"
            className="hidden lg:inline-flex rounded-full p-1.5 sm:p-2 text-forest/80 hover:bg-secondary hover:text-forest dark:text-white/80 dark:hover:bg-white/15 dark:hover:text-white transition-colors"
            title={lang === "bn" ? "ইতিহাস ও সময়রেখা" : "Activity & Timeline"}
          >
            <History className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          </Link>

          {/* Language Switcher Pill */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 rounded-full border border-border bg-secondary/80 px-2.5 py-1 text-xs font-bold text-forest transition-colors hover:bg-secondary dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 sm:gap-1.5 sm:px-3 sm:py-1.5"
          >
            <Languages className="h-3.5 w-3.5 text-forest/70 dark:text-white/80" />
            <span>{lang === "en" ? "বাংলা" : "EN"}</span>
          </button>

          {/* Call to Action Button (Desktop Only) */}
          <Link
            to="/advisory"
            className="hidden items-center gap-1.5 rounded-full bg-[#107548] hover:bg-[#0c5c38] px-4 py-2 text-xs md:text-sm font-bold text-white shadow-soft transition-all hover:scale-[1.02] whitespace-nowrap lg:flex"
          >
            <Sparkles className="h-4 w-4" />
            <span>{t("advice")}</span>
          </Link>
        </div>
      </div>

      {/* Expandable Search Bar */}
      {search && (
        <div className="border-t border-border bg-card/95 px-4 py-3 dark:border-white/10 dark:bg-[#0B1711]/95">
          <input
            autoFocus
            placeholder={lang === "bn" ? "ফসল, জেলা, আবহাওয়া তথ্য বা নির্দেশিকা খুঁজুন..." : "Search crops, districts, weather data, articles…"}
            className="mx-auto block w-full max-w-3xl rounded-full border border-border bg-secondary/60 px-5 py-2 text-sm text-forest placeholder-muted-foreground outline-none focus:ring-2 focus:ring-[#107548] dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder-white/50"
          />
        </div>
      )}

      {/* Mobile Navigation Drawer / Modal (Opens on Hamburger click) */}
      {open && (
        <div className="fixed inset-0 top-[56px] z-[999] lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
          />

          {/* Sliding Content Panel */}
          <div className="relative flex h-[calc(100vh-56px-64px)] w-full flex-col overflow-y-auto border-b border-border bg-background p-4 shadow-2xl animate-in slide-in-from-top-4 duration-200">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {lang === "bn" ? "সকল নেভিগেশন ও ফিচার" : "All Navigation & Tools"}
                </span>
                <h3 className="text-base font-extrabold text-forest dark:text-white">
                  {lang === "bn" ? "টেরাশিফট ফিচারসমূহ" : "TerraShift Features"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-muted-foreground hover:text-forest dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Featured Tools (Items not already primary in bottom 4 tabs highlighted first) */}
            <div className="mt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#107548] dark:text-emerald-400">
                {lang === "bn" ? "স্মার্ট টুলস ও বিশ্লেষণ" : "Smart Tools & Advisory"}
              </span>

              <div className="mt-2 grid gap-2">
                {links
                  .filter((l) => l.isMore)
                  .map((l) => {
                    const Icon = l.icon;
                    return (
                      <Link
                        key={l.to}
                        to={l.to}
                        onClick={() => setOpen(false)}
                        className="group flex items-center justify-between rounded-2xl border border-border bg-card p-3.5 shadow-sm transition-all hover:border-[#107548]/40 hover:bg-[#107548]/5 active:scale-[0.99]"
                        activeProps={{
                          className: "border-2 border-[#107548] bg-[#107548]/10 text-[#107548] dark:text-emerald-300 font-bold",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#107548]/10 text-[#107548] dark:bg-[#34D399]/15 dark:text-[#34D399]">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-forest dark:text-white group-hover:text-[#107548] dark:group-hover:text-emerald-300">
                              {t(l.k)}
                            </div>
                            <div className="text-[11px] text-muted-foreground line-clamp-1">
                              {lang === "bn" ? l.descBn : l.descEn}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-[#107548]" />
                      </Link>
                    );
                  })}
              </div>
            </div>

            {/* Other Platform Pages */}
            <div className="mt-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {lang === "bn" ? "মূল প্ল্যাটফর্ম পেজ" : "Main Platform Pages"}
              </span>

              <div className="mt-2 grid grid-cols-2 gap-2">
                {links
                  .filter((l) => !l.isMore)
                  .map((l) => {
                    const Icon = l.icon;
                    return (
                      <Link
                        key={l.to}
                        to={l.to}
                        activeOptions={{ exact: l.to === "/" }}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl border border-border bg-secondary/50 p-2.5 text-xs font-bold text-forest transition-all hover:bg-secondary dark:text-white"
                        activeProps={{
                          className: "border-[#107548] bg-[#107548]/10 text-[#107548] font-black dark:text-emerald-300",
                        }}
                      >
                        <Icon className="h-4 w-4 shrink-0 text-[#107548] dark:text-emerald-400" />
                        <span className="truncate">{t(l.k)}</span>
                      </Link>
                    );
                  })}
              </div>
            </div>

            {/* Big CTA inside drawer */}
            <div className="mt-6 pt-4 border-t border-border">
              <Link
                to="/advisory"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#107548] py-3 text-sm font-bold text-white shadow-lift transition-all hover:bg-[#0c5c38] active:scale-[0.99]"
              >
                <Sparkles className="h-4 w-4" />
                <span>{lang === "bn" ? "স্মার্ট ফসলের পরামর্শ নিন" : "Get Smart Crop Advice"}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
