import { Link } from "@tanstack/react-router";
import { Home, Map, ShoppingBasket, Users } from "lucide-react";
import { useLang } from "@/lib/lang";

export function BottomNav() {
  const { lang } = useLang();

  const navItems = [
    {
      to: "/" as const,
      exact: true,
      labelEn: "Home",
      labelBn: "হোম",
      icon: Home,
    },
    {
      to: "/map" as const,
      exact: false,
      labelEn: "Field Analysis",
      labelBn: "মাঠ বিশ্লেষণ",
      icon: Map,
    },
    {
      to: "/community" as const,
      exact: false,
      labelEn: "Farmer Network",
      labelBn: "কৃষক নেটওয়ার্ক",
      icon: Users,
    },
    {
      to: "/marketplace" as const,
      exact: false,
      labelEn: "Marketplace",
      labelBn: "মার্কেটপ্লেস",
      icon: ShoppingBasket,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-[1000] border-t border-border/80 bg-white/95 pb-safe backdrop-blur-xl dark:border-white/10 dark:bg-[#08150E]/95 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="mx-auto grid h-16 max-w-md grid-cols-4 items-center px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const label = lang === "bn" ? item.labelBn : item.labelEn;

          return (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              className="group flex flex-col items-center justify-center py-1 text-muted-foreground transition-all duration-200 hover:text-forest dark:hover:text-emerald-300"
              activeProps={{
                className: "text-[#107548] font-bold dark:text-[#34D399]",
              }}
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`grid h-8 w-8 place-items-center rounded-xl transition-all ${
                      isActive
                        ? "bg-[#107548]/10 text-[#107548] dark:bg-[#34D399]/15 dark:text-[#34D399]"
                        : "text-muted-foreground/90 group-hover:text-forest dark:group-hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`mt-0.5 text-[10px] tracking-tight transition-all sm:text-[11px] ${
                      isActive
                        ? "font-bold text-[#107548] dark:text-[#34D399]"
                        : "font-medium text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
