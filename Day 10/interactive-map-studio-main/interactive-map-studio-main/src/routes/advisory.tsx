import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { crops } from "@/data/demo";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/advisory")({
  head: () => ({
    meta: [
      { title: "Smart Crop Advisory — TerraShift" },
      { name: "description", content: "AI crop suitability scores, confidence and climate risk for your field." },
      { property: "og:title", content: "Smart Crop Advisory — TerraShift" },
      { property: "og:description", content: "AI crop suitability scores, confidence and climate risk for your field." },
    ],
  }),
  component: Advisory,
});

export function Advisory() {
  const { lang, tr } = useLang();
  const [season, setSeason] = useState("All");
  const [compare, setCompare] = useState<string[]>([]);
  const list = crops.filter((c) => season === "All" || c.season === season);
  const toggle = (n: string) => setCompare((c) => (c.includes(n) ? c.filter((x) => x !== n) : c.length < 3 ? [...c, n] : c));
  const cmp = crops.filter((c) => compare.includes(c.name));

  const seasonOptions = [
    { id: "All", en: "All Seasons", bn: "সব মৌসুম" },
    { id: "Rabi", en: "Rabi (Winter)", bn: "রবি (শীতকালীন)" },
    { id: "Kharif", en: "Kharif (Monsoon)", bn: "খরিপ (বর্ষাকালীন)" },
  ];

  return (
    <>
      <PageHeader
        eyebrow={tr("AI Crop Advisory", "এআই ফসল পরামর্শ")}
        title={tr("Smart Crop Recommendations", "স্মার্ট ফসলের সুপারিশমালা")}
      >
        {tr(
          "Ranked by soil moisture, climate risk and market value. Select up to 3 crops to compare.",
          "মাটির আর্দ্রতা, আবহাওয়া ঝুঁকি ও বাজার মূল্যের ভিত্তিতে ক্রমানুযায়ী। তুলনা করতে সর্বোচ্চ ৩টি ফসল নির্বাচন করুন।"
        )}
      </PageHeader>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex flex-wrap gap-2">
          {seasonOptions.map((s) => (
            <button
              key={s.id}
              onClick={() => setSeason(s.id)}
              className={`rounded-full px-5 py-2 text-sm font-bold transition-all ${
                season === s.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card text-forest border border-border hover:bg-secondary dark:text-white"
              }`}
            >
              {lang === "bn" ? s.bn : s.en}
            </button>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => {
            const on = compare.includes(c.name);
            return (
              <div
                key={c.name}
                className={`card-lift rounded-3xl border bg-card p-6 shadow-soft transition-all ${
                  on ? "border-primary ring-2 ring-primary/30" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-5xl">{c.emoji}</span>
                  <span className="rounded-full bg-gold/30 px-3 py-1 text-xs font-bold text-forest dark:text-amber-300">
                    {c.score}% {tr("match", "উপযুক্ত")}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-forest dark:text-white">{c.name}</h3>
                <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-xl bg-muted p-2.5">
                    <dt className="text-xs text-muted-foreground">{tr("Confidence", "নির্ভরযোগ্যতা")}</dt>
                    <dd className="font-bold text-forest dark:text-white">{c.confidence}%</dd>
                  </div>
                  <div className="rounded-xl bg-muted p-2.5">
                    <dt className="text-xs text-muted-foreground">{tr("Climate risk", "জলবায়ু ঝুঁকি")}</dt>
                    <dd className="font-bold text-forest dark:text-white">
                      {lang === "bn" ? (c.risk === "Low" ? "কম" : c.risk === "Medium" ? "মাঝারি" : "উচ্চ") : c.risk}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-muted p-2.5">
                    <dt className="text-xs text-muted-foreground">{tr("Duration", "সময়কাল")}</dt>
                    <dd className="font-bold text-forest dark:text-white">
                      {c.days} {tr("days", "দিন")}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-muted p-2.5">
                    <dt className="text-xs text-muted-foreground">{tr("Est. Profit", "সম্ভাব্য লাভ")}</dt>
                    <dd className="font-bold text-emerald-600 dark:text-emerald-400">{c.profit}</dd>
                  </div>
                </dl>
                <button
                  onClick={() => toggle(c.name)}
                  className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-bold transition-all ${
                    on
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary text-forest hover:bg-secondary/80 dark:text-white"
                  }`}
                >
                  {on && <Check className="h-4 w-4" />}{" "}
                  {on ? tr("Added to compare", "তুলনায় যোগ করা হয়েছে") : tr("Compare", "তুলনা করুন")}
                </button>
              </div>
            );
          })}
        </div>

        {cmp.length > 1 && (
          <div className="mt-10 overflow-x-auto rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h2 className="mb-4 text-2xl font-bold text-forest dark:text-white">
              {tr("Crop Comparison", "ফসলের তুলনামূলক বিশ্লেষণ")}
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="py-2.5">{tr("Metric", "মানদণ্ড")}</th>
                  {cmp.map((c) => (
                    <th key={c.name} className="py-2.5 font-bold text-forest dark:text-white">
                      {c.emoji} {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-secondary/20">
                  <td className="py-2.5 font-semibold">{tr("Suitability Score", "উপযোগিতা স্কোর")}</td>
                  {cmp.map((c) => (
                    <td key={c.name} className="py-2.5 font-bold text-primary">{c.score}%</td>
                  ))}
                </tr>
                <tr className="hover:bg-secondary/20">
                  <td className="py-2.5 font-semibold">{tr("Confidence", "নির্ভরযোগ্যতা")}</td>
                  {cmp.map((c) => (
                    <td key={c.name} className="py-2.5">{c.confidence}%</td>
                  ))}
                </tr>
                <tr className="hover:bg-secondary/20">
                  <td className="py-2.5 font-semibold">{tr("Climate Risk", "জলবায়ু ঝুঁকি")}</td>
                  {cmp.map((c) => (
                    <td key={c.name} className="py-2.5">
                      {lang === "bn" ? (c.risk === "Low" ? "কম" : c.risk === "Medium" ? "মাঝারি" : "উচ্চ") : c.risk}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-secondary/20">
                  <td className="py-2.5 font-semibold">{tr("Water Requirement", "পানির চাহিদা")}</td>
                  {cmp.map((c) => (
                    <td key={c.name} className="py-2.5">
                      {lang === "bn" ? (c.water === "Low" ? "কম" : c.water === "Medium" ? "মাঝারি" : "বেশি") : c.water}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-secondary/20">
                  <td className="py-2.5 font-semibold">{tr("Crop Duration", "মেয়াদকাল")}</td>
                  {cmp.map((c) => (
                    <td key={c.name} className="py-2.5">{c.days} {tr("days", "দিন")}</td>
                  ))}
                </tr>
                <tr className="hover:bg-secondary/20">
                  <td className="py-2.5 font-semibold">{tr("Projected Profit", "প্রত্যাশিত লাভ")}</td>
                  {cmp.map((c) => (
                    <td key={c.name} className="py-2.5 font-bold text-emerald-600 dark:text-emerald-400">{c.profit}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
