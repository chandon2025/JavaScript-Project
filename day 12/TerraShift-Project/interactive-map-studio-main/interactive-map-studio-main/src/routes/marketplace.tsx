import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Phone, Search, X } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { products } from "@/data/demo";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Crop Marketplace — TerraShift" },
      { name: "description", content: "Buy and sell fresh crops directly from farmers across Bangladesh." },
      { property: "og:title", content: "Crop Marketplace — TerraShift" },
      { property: "og:description", content: "Buy and sell fresh crops directly from farmers across Bangladesh." },
    ],
  }),
  component: Market,
});

export function Market() {
  const { tr, lang } = useLang();
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [contact, setContact] = useState<(typeof products)[number] | null>(null);

  const categories = [
    { id: "All", en: "All Products", bn: "সব পণ্য" },
    { id: "Grains", en: "Grains & Cereals", bn: "দানাদার শস্য" },
    { id: "Vegetables", en: "Vegetables", bn: "শাকসবজি" },
    { id: "Fruits", en: "Fruits", bn: "ফলমূল" },
    { id: "Cash Crops", en: "Cash Crops", bn: "অর্থকরী ফসল" },
  ];

  const list = products.filter(
    (p) => (cat === "All" || p.cat === cat) && p.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <PageHeader
        eyebrow={tr("Marketplace", "কৃষি মার্কেটপ্লেস")}
        title={tr("Buy direct from farmers", "কৃষকের কাছ থেকে সরাসরি ক্রয়")}
      >
        {tr(
          "Fair prices, fresh certified produce, no middlemen exploitation.",
          "ন্যায্য মূল্য, মাঠের তাজা ফসল, মধ্যস্বত্বভোগী ছাড়া সরাসরি কৃষকের লাভ।"
        )}
      </PageHeader>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={tr("Search agricultural products…", "পণ্য অনুসন্ধান করুন…")}
              className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-forest placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary dark:text-white"
            />
          </div>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                cat === c.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-forest hover:bg-secondary dark:text-white"
              }`}
            >
              {lang === "bn" ? c.bn : c.en}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">
            {tr("No products match your search.", "আপনার অনুসন্ধানের সাথে কোনো পণ্য মেলেনি।")}
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((p) => (
              <div
                key={p.id}
                className="card-lift overflow-hidden rounded-3xl border border-border bg-card shadow-soft"
              >
                <div className="grid h-36 place-items-center bg-secondary/60 text-6xl">{p.emoji}</div>
                <div className="p-5">
                  <span className="text-xs font-bold text-primary">{p.cat}</span>
                  <h3 className="font-bold text-forest dark:text-white text-base mt-0.5">{p.name}</h3>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {p.farmer}, {p.loc}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-extrabold text-forest dark:text-white">
                      ৳{p.price}
                      <span className="text-xs font-normal text-muted-foreground">/{p.unit}</span>
                    </span>
                    <button
                      onClick={() => setContact(p)}
                      className="rounded-full bg-gold px-4 py-1.5 text-xs font-bold text-accent-foreground shadow-sm hover:scale-105 transition-transform"
                    >
                      {tr("Contact", "যোগাযোগ")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {contact && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-4xl">{contact.emoji}</span>
                <h3 className="mt-2 text-xl font-bold text-forest dark:text-white">{contact.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {contact.farmer} · {contact.loc}
                </p>
              </div>
              <button
                onClick={() => setContact(null)}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 rounded-2xl bg-secondary/60 p-4 text-center">
              <div className="text-xs text-muted-foreground">{tr("Farmer direct phone:", "কৃষকের সরাসরি ফোন নম্বর:")}</div>
              <div className="mt-1 font-display text-xl font-bold text-forest dark:text-white">
                {contact.phone}
              </div>
            </div>
            <a
              href={`tel:${contact.phone}`}
              className="mt-4 flex items-center justify-center gap-2 rounded-full bg-primary py-3 font-bold text-primary-foreground shadow-lift"
            >
              <Phone className="h-4 w-4" /> {tr("Call Farmer", "সরাসরি কল দিন")}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
