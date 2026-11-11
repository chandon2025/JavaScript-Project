import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, MessageCircle, Send } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { posts as seed } from "@/data/demo";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Farmer Network — TerraShift" },
      { name: "description", content: "Share tips, ask questions and discuss farming with farmers across Bangladesh." },
      { property: "og:title", content: "Farmer Network — TerraShift" },
      { property: "og:description", content: "Share tips, ask questions and discuss farming with farmers across Bangladesh." },
    ],
  }),
  component: Community,
});

export function Community() {
  const { tr, lang } = useLang();
  const [posts, setPosts] = useState(seed.map((p) => ({ ...p, liked: false })));
  const [text, setText] = useState("");

  const add = () => {
    if (!text.trim()) return;
    setPosts([
      {
        id: Date.now(),
        author: lang === "bn" ? "আপনি" : "You",
        region: lang === "bn" ? "আপনার এলাকা" : "Your area",
        time: lang === "bn" ? "এইমাত্র" : "just now",
        text,
        likes: 0,
        comments: 0,
        tag: lang === "bn" ? "কৃষক পোস্ট" : "Post",
        liked: false,
      },
      ...posts,
    ]);
    setText("");
  };

  return (
    <>
      <PageHeader
        eyebrow={tr("Farmer Network", "কৃষক নেটওয়ার্ক")}
        title={tr("Community Discussions", "কৃষক আলোচনা ও অভিজ্ঞতা বিনিময়")}
      >
        {tr(
          "Learn from farmers who work the same soil and climate as you across Bangladesh.",
          "আপনার মতো একই মাটিতে ও আবহাওয়ায় কাজ করা সারা দেশের কৃষকদের সাথে পরামর্শ ও সমাধান জানুন।"
        )}
      </PageHeader>

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder={tr(
              "Share a farming tip or ask an agronomy question…",
              "কোনো কৃষি পরামর্শ দিন বা ফসলের সমস্যা নিয়ে প্রশ্ন করুন…"
            )}
            className="w-full resize-none rounded-2xl bg-secondary/50 p-4 text-sm text-forest placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary dark:text-white"
          />
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {tr("Friendly community guideline: respectful sharing only", "নির্দেশনা: মার্জিত ও গঠনমূলক প্রশ্ন করুন")}
            </span>
            <button
              onClick={add}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#107548] px-6 py-2.5 text-sm font-bold text-white shadow-soft transition-all hover:bg-[#0c5c38]"
            >
              <Send className="h-4 w-4" />
              <span>{tr("Post", "পোস্ট করুন")}</span>
            </button>
          </div>
        </div>

        {posts.map((p) => (
          <article key={p.id} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-brand font-bold text-primary-foreground shadow-sm">
                {p.author[0]}
              </div>
              <div>
                <div className="font-bold text-forest dark:text-white">{p.author}</div>
                <div className="text-xs text-muted-foreground">{p.region} · {p.time}</div>
              </div>
              <span className="ml-auto rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-forest dark:text-white">
                {p.tag}
              </span>
            </div>
            <p className="mt-3.5 text-sm leading-relaxed text-forest/90 dark:text-white/90">{p.text}</p>
            <div className="mt-4 flex gap-6 text-sm text-muted-foreground pt-3 border-t border-border/60">
              <button
                onClick={() =>
                  setPosts(
                    posts.map((x) =>
                      x.id === p.id ? { ...x, liked: !x.liked, likes: x.likes + (x.liked ? -1 : 1) } : x
                    )
                  )
                }
                className={`flex items-center gap-1.5 transition-colors ${p.liked ? "text-destructive font-bold" : "hover:text-forest"}`}
              >
                <Heart className="h-4 w-4" fill={p.liked ? "currentColor" : "none"} />
                <span>{p.likes} {tr("likes", "পছন্দ")}</span>
              </button>
              <span className="flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4" />
                <span>{p.comments} {tr("comments", "মন্তব্য")}</span>
              </span>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
