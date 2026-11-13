import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Satellite, Sprout, Users } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { PageHeader } from "@/components/common/PageHeader";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About TerraShift — Smart Agriculture" },
      { name: "description", content: "Our mission: bring NASA Earth data to every farmer in Bangladesh." },
      { property: "og:title", content: "About TerraShift — Smart Agriculture" },
      { property: "og:description", content: "Our mission: bring NASA Earth data to every farmer in Bangladesh." },
    ],
  }),
  component: About,
});

export function About() {
  const { tr } = useLang();
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  const pillars = [
    {
      icon: Satellite,
      title: tr("NASA Earth Observation", "নাসা উপগ্রহ পর্যবেক্ষণ তথ্য"),
      desc: tr(
        "Soil moisture (SMAP), vegetation health (MODIS) and climate (POWER) directly from orbit.",
        "মাটির গভীর আর্দ্রতা (SMAP), উদ্ভিদের সুস্থতা (MODIS) এবং কৃষি-আবহাওয়া (POWER) সরাসরি মহাকাশ থেকে।"
      ),
    },
    {
      icon: Sprout,
      title: tr("Farmer-First Intelligence", "কৃষকবান্ধব সরল নির্দেশনা"),
      desc: tr(
        "Complex satellite algorithms translated into simple, actionable steps in Bangla and English.",
        "জটিল স্যাটেলাইট প্রযুক্তি সহজ বাংলায় সরাসরি মাঠে প্রয়োগযোগ্য পরামর্শে রূপান্তরিত।"
      ),
    },
    {
      icon: Users,
      title: tr("Community & Peer Learning", "কৃষক কমিউনিটি ও পারষ্পরিক সহযোগিতা"),
      desc: tr(
        "Empowering 50,000+ farmers across 64 districts with peer advice, seed sharing, and collective bargaining.",
        "৬৪টি জেলার ৫০,০০০+ কৃষকের পারস্পরিক অভিজ্ঞতা বিনিময় ও ন্যায্য বাজার নিশ্চিতে একতাবদ্ধ মঞ্চ।"
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow={tr("About TerraShift", "আমাদের সম্পর্কে")}
        title={tr("Space science for every field in Bangladesh", "মহাকাশ বিজ্ঞান সরাসরি বাংলার প্রতিটি ফসলের মাঠে")}
      >
        {tr(
          "We turn NASA SMAP, MODIS and POWER satellite data into actionable advice farmers can use today to save costs and boost harvest.",
          "আমরা নাসার সর্বাধুনিক উপগ্রহের ডেটা বিশ্লেষণ করে কৃষকদের জন্য সাশ্রয়ী, লাভজনক ও জলবায়ু-সহনশীল স্মার্ট পরামর্শ তৈরি করি।"
        )}
      </PageHeader>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-2">
        <div>
          <div className="flex items-center gap-4">
            <img src={logo} alt="TerraShift logo" className="w-28 h-28 rounded-3xl shadow-lift object-contain bg-white p-2" />
            <div>
              <h2 className="text-3xl font-black text-forest dark:text-white">TerraShift</h2>
              <p className="text-sm text-primary font-semibold">
                {tr("Adapting Farms with NASA & Local Intelligence", "নাসা ও স্থানীয় তথ্যের সমন্বয়ে কৃষি রূপান্তর")}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4">
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex gap-4 rounded-3xl border border-border bg-card p-5 shadow-soft">
                  <Icon className="h-6 w-6 shrink-0 text-primary mt-1" />
                  <div>
                    <div className="font-bold text-forest dark:text-white text-base">{item.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <form
          className="h-fit rounded-3xl border border-border bg-card p-8 shadow-soft"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            const email = String(f.get("email") || "");
            if (!String(f.get("name")).trim() || !/^\S+@\S+\.\S+$/.test(email) || String(f.get("msg")).trim().length < 5) {
              return setErr(
                tr(
                  "Please fill in your name, a valid email and a message.",
                  "অনুগ্রহ করে আপনার নাম, সঠিক ইমেইল এবং বার্তা লিখুন।"
                )
              );
            }
            setErr("");
            setSent(true);
            e.currentTarget.reset();
          }}
        >
          <h2 className="text-2xl font-bold text-forest dark:text-white">{tr("Contact us", "যোগাযোগ করুন")}</h2>
          <p className="text-xs text-muted-foreground mt-1">
            {tr("Have questions or want to partner with us? Drop us a message.", "কোনো প্রশ্ন বা অংশীদারিত্বের জন্য বার্তা পাঠান।")}
          </p>

          <div className="mt-6 grid gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">{tr("Your Name", "আপনার নাম")}</label>
              <input
                name="name"
                placeholder={tr("e.g. Rafiqul Islam", "যেমন: রফিকুল ইসলাম")}
                className="mt-1 w-full rounded-2xl border border-border bg-secondary/50 px-4 py-3 text-sm text-forest placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">{tr("Email Address", "ইমেইল ঠিকানা")}</label>
              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                className="mt-1 w-full rounded-2xl border border-border bg-secondary/50 px-4 py-3 text-sm text-forest placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">{tr("Your Message", "আপনার বার্তা")}</label>
              <textarea
                name="msg"
                rows={4}
                placeholder={tr("How can we help your farm?", "কীভাবে আমরা আপনাকে সাহায্য করতে পারি?")}
                className="mt-1 w-full rounded-2xl border border-border bg-secondary/50 px-4 py-3 text-sm text-forest placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary dark:text-white resize-none"
              />
            </div>
          </div>

          {err && <p className="mt-3 text-sm font-semibold text-destructive">{err}</p>}
          {sent && (
            <p className="mt-3 text-sm font-semibold text-primary">
              {tr("Thanks! We'll get back to you soon.", "ধন্যবাদ! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।")}
            </p>
          )}

          <button className="mt-6 w-full rounded-full bg-brand py-3.5 font-bold text-primary-foreground shadow-lift hover:opacity-95 transition-opacity">
            {tr("Send message", "বার্তা পাঠান")}
          </button>
        </form>
      </div>
    </>
  );
}
