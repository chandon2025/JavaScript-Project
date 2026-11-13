import { Link, useRouterState } from "@tanstack/react-router";
import {
  ChevronRight,
  CloudSun,
  Home,
  Info,
  LayoutGrid,
  Map,
  RotateCcw,
  ShoppingBasket,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/lang";

const MORE_ROUTES = ["/advisory", "/rotation", "/weather", "/about"] as const;

export function BottomNav() {
  const { lang } = useLang();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [moreOpen, setMoreOpen] = useState(false);
  const [explicitHome, setExplicitHome] = useState(false);

  useEffect(() => {
    setMoreOpen(false);
    if (pathname !== "/") {
      setExplicitHome(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (moreOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [moreOpen]);

  const navItems = [
    {
      to: "/" as const,
      exact: true,
      labelEn: "Home",
      labelBn: "হোম",
      icon: Home,
    },
    {
      to: "/community" as const,
      exact: false,
      labelEn: "Farmer Network",
      labelBn: "কৃষক নেটওয়ার্ক",
      icon: Users,
    },
    {
      to: "/map" as const,
      exact: false,
      labelEn: "Field Analysis",
      labelBn: "মাঠ বিশ্লেষণ",
      icon: Map,
    },
    {
      to: "/marketplace" as const,
      exact: false,
      labelEn: "Marketplace",
      labelBn: "মার্কেটপ্লেস",
      icon: ShoppingBasket,
    },
  ];

  const moreLinks = [
    {
      to: "/advisory" as const,
      icon: Sparkles,
      labelEn: "Crop Advisory",
      labelBn: "ফসলের পরামর্শ",
      descEn: "AI crop suggestions & radar compare",
      descBn: "এআই ফসলের পরামর্শ ও তুলনা",
    },
    {
      to: "/rotation" as const,
      icon: RotateCcw,
      labelEn: "Crop Rotation",
      labelBn: "ফসল আবর্তন",
      descEn: "Multi-year crop trajectory engine",
      descBn: "বহুবর্ষীয় ফসল আবর্তন ইঞ্জিন",
    },
    {
      to: "/weather" as const,
      icon: CloudSun,
      labelEn: "Satellite Weather",
      labelBn: "উপগ্রহ আবহাওয়া",
      descEn: "7-day forecast & NASA SMAP telemetry",
      descBn: "৭ দিনের পূর্বাভাস ও নাসা টেলিমেট্রি",
    },
    {
      to: "/about" as const,
      icon: Info,
      labelEn: "About TerraShift",
      labelBn: "আমাদের সম্পর্কে",
      descEn: "NASA satellite data & our mission",
      descBn: "নাসা উপগ্রহ তথ্য ও আমাদের লক্ষ্য",
    },
  ];

  const isMoreRoute = MORE_ROUTES.some((r) => pathname.startsWith(r));
  const isMoreActive = moreOpen || isMoreRoute;

  return (
    <>
      {/* More Bottom Sheet Drawer */}
      {moreOpen && (
        <div className="fixed inset-0 z-[999] lg:hidden">
          <div
            onClick={() => setMoreOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px] animate-fade-in"
          />
          <div className="absolute bottom-16 left-0 right-0 mx-auto max-w-md rounded-t-3xl border-t border-border bg-white p-4 pb-6 shadow-[0_-12px_36px_rgba(0,0,0,0.16)] dark:border-white/10 dark:bg-[#0B1912]">
            <div className="mb-3 flex items-center justify-between border-b border-border/80 pb-2.5 dark:border-white/10">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#107548] dark:text-[#34D399]">
                  {lang === "bn" ? "আরও ফিচার ও টুলস" : "More Tools & Pages"}
                </p>
                <h3 className="text-base font-extrabold text-forest dark:text-white">
                  {lang === "bn" ? "টেরাশিফট মেনু" : "TerraShift Menu"}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close More Menu"
                onClick={() => setMoreOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-muted-foreground hover:text-forest dark:bg-white/10 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-2">
              {moreLinks.map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMoreOpen(false)}
                    className={`group flex items-center justify-between rounded-2xl border p-3 transition-all active:scale-[0.99] ${
                      active
                        ? "border-[#107548] bg-[#107548]/10 dark:border-[#34D399]/60 dark:bg-[#34D399]/15"
                        : "border-border bg-card hover:border-[#107548]/40 hover:bg-[#107548]/5 dark:border-white/10 dark:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`grid h-10 w-10 place-items-center rounded-xl transition-colors ${
                          active
                            ? "bg-[#107548] text-white dark:bg-[#34D399] dark:text-[#08150E]"
                            : "bg-[#107548]/10 text-[#107548] dark:bg-[#34D399]/15 dark:text-[#34D399]"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div
                          className={`text-sm font-bold ${
                            active
                              ? "text-[#107548] dark:text-[#34D399]"
                              : "text-forest dark:text-white"
                          }`}
                        >
                          {lang === "bn" ? item.labelBn : item.labelEn}
                        </div>
                        <div className="text-[11px] text-muted-foreground line-clamp-1">
                          {lang === "bn" ? item.descBn : item.descEn}
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 ${
                        active ? "text-[#107548] dark:text-[#34D399]" : "text-muted-foreground"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Fixed 5-item Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-[1000] border-t border-border/80 bg-white/95 pb-safe backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-[#08150E]/95 lg:hidden"
      >
        <div className="mx-auto grid h-16 max-w-md grid-cols-5 items-center px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const label = lang === "bn" ? item.labelBn : item.labelEn;
            const isDefaultFieldAnalysis =
              pathname === "/" && !explicitHome && item.to === "/map";
            const isHomeExplicit = item.to === "/" && pathname === "/" && explicitHome;
            const isOtherRoute =
              item.to !== "/" && pathname.startsWith(item.to);
            const isActive =
              !moreOpen && (isDefaultFieldAnalysis || isHomeExplicit || isOtherRoute);

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => {
                  setMoreOpen(false);
                  setExplicitHome(item.to === "/");
                }}
                className="group relative flex h-full flex-col items-center justify-center px-1 pt-1 transition-all duration-200"
              >
                <div
                  className={`flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? "-mt-6 h-12 w-12 rounded-full bg-gradient-to-br from-[#2B8A5B] to-[#107548] text-white shadow-[0_6px_18px_rgba(16,117,72,0.4)] ring-[3.5px] ring-white dark:ring-[#08150E]"
                      : "h-7 w-7 rounded-full bg-[#107548]/12 text-[#107548] group-hover:bg-[#107548]/20 dark:bg-[#34D399]/15 dark:text-[#34D399] dark:group-hover:bg-[#34D399]/25"
                  }`}
                >
                  <Icon className={isActive ? "h-5 w-5 stroke-[2.2]" : "h-4 w-4 stroke-[2]"} />
                </div>
                <span
                  className={`w-full truncate text-center tracking-tight transition-all duration-200 ${
                    isActive
                      ? "mt-1 text-[11px] font-bold text-[#143323] dark:text-[#34D399]"
                      : "mt-0.5 text-[10.5px] font-medium text-[#107548]/85 dark:text-[#34D399]/80"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}

          {/* 5th Item: More */}
          <button
            type="button"
            onClick={() => setMoreOpen((prev) => !prev)}
            className="group relative flex h-full flex-col items-center justify-center px-1 pt-1 transition-all duration-200"
          >
            <div
              className={`flex items-center justify-center transition-all duration-200 ${
                isMoreActive
                  ? "-mt-6 h-12 w-12 rounded-full bg-gradient-to-br from-[#2B8A5B] to-[#107548] text-white shadow-[0_6px_18px_rgba(16,117,72,0.4)] ring-[3.5px] ring-white dark:ring-[#08150E]"
                  : "h-7 w-7 rounded-full bg-[#107548]/12 text-[#107548] group-hover:bg-[#107548]/20 dark:bg-[#34D399]/15 dark:text-[#34D399] dark:group-hover:bg-[#34D399]/25"
              }`}
            >
              <LayoutGrid
                className={isMoreActive ? "h-5 w-5 stroke-[2.2]" : "h-4 w-4 stroke-[2]"}
              />
            </div>
            <span
              className={`w-full truncate text-center tracking-tight transition-all duration-200 ${
                isMoreActive
                  ? "mt-1 text-[11px] font-bold text-[#143323] dark:text-[#34D399]"
                  : "mt-0.5 text-[10.5px] font-medium text-[#107548]/85 dark:text-[#34D399]/80"
              }`}
            >
              {lang === "bn" ? "আরও" : "More"}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
