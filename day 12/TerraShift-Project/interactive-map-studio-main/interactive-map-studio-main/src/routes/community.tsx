import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  Camera,
  CheckCircle2,
  Heart,
  ImagePlus,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { posts as seed } from "@/data/demo";
import { useLang } from "@/lib/lang";

interface AnswerItem {
  id: number;
  author: string;
  region: string;
  time: string;
  text: string;
  photo?: string;
}

interface CommunityPost {
  id: number;
  author: string;
  region: string;
  time: string;
  text: string;
  photo?: string;
  likes: number;
  comments: number;
  tag: string;
  liked: boolean;
  answers: AnswerItem[];
}

const STORAGE_KEY = "terrashift_community_posts_v1";

function buildInitialPosts(): CommunityPost[] {
  return seed.map((p) => {
    const initialAnswers: AnswerItem[] =
      p.id === 2
        ? [
            {
              id: 201,
              author: "Rafiqul Islam",
              region: "Bogura",
              time: "3h ago",
              text: "Yes! 60cm × 20cm spacing works best right after potato harvest. Residual fertilizer from potato also reduces your basal urea need.",
            },
          ]
        : p.id === 1
          ? [
              {
                id: 101,
                author: "Nasir Uddin",
                region: "Mymensingh",
                time: "1h ago",
                text: "Did you use Trichoderma compost as well? Our BARI Mung-6 yield also jumped when we followed NASA soil moisture alerts.",
              },
            ]
          : [];

    return {
      ...p,
      liked: false,
      answers: initialAnswers,
    };
  });
}

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Farmer Network — TerraShift" },
      {
        name: "description",
        content:
          "Ask with a photo, answer each other and message farmers directly across Bangladesh.",
      },
      { property: "og:title", content: "Farmer Network — TerraShift" },
      {
        property: "og:description",
        content:
          "Ask with a photo, answer each other and message farmers directly across Bangladesh.",
      },
    ],
  }),
  component: Community,
});

export function Community() {
  const { tr, lang } = useLang();
  const [posts, setPosts] = useState<CommunityPost[]>(() => buildInitialPosts());
  const [hydrated, setHydrated] = useState(false);

  const [text, setText] = useState("");
  const [tag, setTag] = useState("Question");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Per-post answer drafts & expanded state
  const [openAnswers, setOpenAnswers] = useState<Record<number, boolean>>({
    1: true,
    2: true,
  });
  const [answerDrafts, setAnswerDrafts] = useState<Record<number, string>>({});
  const [answerNames, setAnswerNames] = useState<Record<number, string>>({});
  const [answerPhotos, setAnswerPhotos] = useState<Record<number, string | null>>({});

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CommunityPost[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPosts(parsed);
        }
      }
    } catch {
      // Ignore storage errors
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch {
      // Ignore quota errors
    }
  }, [posts, hydrated]);

  const handleImageSelect = (
    e: ChangeEvent<HTMLInputElement>,
    onLoad: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onLoad(reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const addPost = () => {
    if (!text.trim() && !photoPreview) return;
    const newPost: CommunityPost = {
      id: Date.now(),
      author: lang === "bn" ? "আপনি" : "You",
      region: lang === "bn" ? "আপনার এলাকা" : "Your area",
      time: lang === "bn" ? "এইমাত্র" : "just now",
      text: text.trim() || (lang === "bn" ? "ফসলের ছবি যুক্ত প্রশ্ন" : "Photo question"),
      photo: photoPreview ?? undefined,
      likes: 0,
      comments: 0,
      tag,
      liked: false,
      answers: [],
    };
    setPosts([newPost, ...posts]);
    setOpenAnswers((prev) => ({ ...prev, [newPost.id]: true }));
    setText("");
    setPhotoPreview(null);
  };

  const addAnswer = (postId: number) => {
    const draft = (answerDrafts[postId] ?? "").trim();
    const photo = answerPhotos[postId] ?? undefined;
    if (!draft && !photo) return;

    const customName = (answerNames[postId] ?? "").trim();
    const newAnswer: AnswerItem = {
      id: Date.now(),
      author: customName || (lang === "bn" ? "কৃষক সদস্য" : "Community Farmer"),
      region: lang === "bn" ? "বাংলাদেশ" : "Bangladesh",
      time: lang === "bn" ? "এইমাত্র" : "just now",
      text: draft || (lang === "bn" ? "ছবিসহ উত্তর" : "Photo reply"),
      photo,
    };

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: p.comments + 1,
              answers: [...p.answers, newAnswer],
            }
          : p
      )
    );

    setAnswerDrafts((prev) => ({ ...prev, [postId]: "" }));
    setAnswerPhotos((prev) => ({ ...prev, [postId]: null }));
    setOpenAnswers((prev) => ({ ...prev, [postId]: true }));
  };

  const tagOptions = [
    { value: "Question", labelEn: "Question", labelBn: "প্রশ্ন" },
    { value: "Tip", labelEn: "Tip / Advice", labelBn: "পরামর্শ" },
    { value: "Pest / Disease", labelEn: "Pest / Disease", labelBn: "পোকা / রোগ" },
    { value: "Alert", labelEn: "Weather Alert", labelBn: "সতর্কতা" },
  ];

  return (
    <>
      <PageHeader
        eyebrow={tr("Farmer Network", "কৃষক নেটওয়ার্ক")}
        title={tr("Community Discussions", "কৃষক আলোচনা ও প্রশ্নোত্তর")}
      >
        {tr(
          "Ask with a photo, answer each other and message farmers directly.",
          "ছবি দিয়ে প্রশ্ন করুন, একে অপরের উত্তর দিন এবং সরাসরি কৃষকদের সাথে পরামর্শ করুন।"
        )}
      </PageHeader>

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 pb-24 lg:pb-12">
        {/* Hidden File Inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleImageSelect(e, setPhotoPreview)}
        />
        <input
          ref={uploadInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageSelect(e, setPhotoPreview)}
        />

        {/* Post / Question Composer */}
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-soft">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder={tr(
              "Describe the problem or share a tip... e.g. 'Yellow spots on my rice leaves — what is it?'",
              "সমস্যার বিবরণ লিখুন বা পরামর্শ দিন... যেমন: 'ধানের পাতায় হলুদ দাগ কেন হচ্ছে?'"
            )}
            className="w-full resize-none rounded-2xl bg-[#EDF3EF] p-4 text-sm text-forest placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#107548] dark:bg-white/10 dark:text-white"
          />

          {/* Photo Preview */}
          {photoPreview && (
            <div className="relative mt-3 overflow-hidden rounded-2xl border border-border bg-secondary/40">
              <img
                src={photoPreview}
                alt="Selected crop preview"
                className="max-h-64 w-full object-cover"
              />
              <button
                type="button"
                aria-label="Remove photo"
                onClick={() => setPhotoPreview(null)}
                className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-black/65 text-white transition hover:bg-black"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Take Photo & Upload Pill Buttons */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full bg-[#DFF0E5] px-4 py-2 text-sm font-semibold text-[#143323] transition hover:bg-[#cde6d6] active:scale-[0.98] dark:bg-[#107548]/25 dark:text-emerald-200"
            >
              <Camera className="h-4 w-4 text-[#107548] dark:text-[#34D399]" />
              <span>{tr("Take photo", "ছবি তুলুন")}</span>
            </button>
            <button
              type="button"
              onClick={() => uploadInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full bg-[#DFF0E5] px-4 py-2 text-sm font-semibold text-[#143323] transition hover:bg-[#cde6d6] active:scale-[0.98] dark:bg-[#107548]/25 dark:text-emerald-200"
            >
              <ImagePlus className="h-4 w-4 text-[#107548] dark:text-[#34D399]" />
              <span>{tr("Upload", "আপলোড")}</span>
            </button>
          </div>

          {/* Category Dropdown & Post Button */}
          <div className="mt-3.5 flex items-center justify-between gap-3">
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              aria-label="Post Category"
              className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-forest outline-none focus:ring-2 focus:ring-[#107548] dark:border-white/15 dark:bg-[#0F2419] dark:text-white"
            >
              {tagOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {lang === "bn" ? opt.labelBn : opt.labelEn}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={addPost}
              disabled={!text.trim() && !photoPreview}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#2B8A5B] to-[#107548] px-6 py-2.5 text-sm font-bold text-white shadow-soft transition-all hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>{tr("Post", "পোস্ট করুন")}</span>
            </button>
          </div>
        </div>

        {/* Community Feed */}
        {posts.map((p) => {
          const isOpen = !!openAnswers[p.id];
          const answerPhoto = answerPhotos[p.id] ?? null;

          return (
            <article
              key={p.id}
              className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand font-bold text-primary-foreground shadow-sm">
                  {p.author[0]}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-bold text-forest dark:text-white">
                    {p.author}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {p.region} · {p.time}
                  </div>
                </div>
                <span className="ml-auto shrink-0 rounded-full bg-[#107548]/10 px-3 py-1 text-xs font-bold text-[#107548] dark:bg-[#34D399]/15 dark:text-[#34D399]">
                  {p.tag}
                </span>
              </div>

              <p className="mt-3.5 text-sm leading-relaxed text-forest/90 dark:text-white/90">
                {p.text}
              </p>

              {/* Attached Question Photo */}
              {p.photo && (
                <div className="mt-3.5 overflow-hidden rounded-2xl border border-border/80 bg-secondary/30">
                  <img
                    src={p.photo}
                    alt="Farmer question attachment"
                    className="max-h-80 w-full object-cover"
                  />
                </div>
              )}

              {/* Like & Answer Toggle Bar */}
              <div className="mt-4 flex items-center gap-6 border-t border-border/60 pt-3 text-sm text-muted-foreground">
                <button
                  type="button"
                  onClick={() =>
                    setPosts(
                      posts.map((x) =>
                        x.id === p.id
                          ? { ...x, liked: !x.liked, likes: x.likes + (x.liked ? -1 : 1) }
                          : x
                      )
                    )
                  }
                  className={`flex items-center gap-1.5 transition-colors ${
                    p.liked ? "font-bold text-destructive" : "hover:text-forest dark:hover:text-white"
                  }`}
                >
                  <Heart className="h-4 w-4" fill={p.liked ? "currentColor" : "none"} />
                  <span>
                    {p.likes} {tr("likes", "পছন্দ")}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setOpenAnswers((prev) => ({ ...prev, [p.id]: !prev[p.id] }))
                  }
                  className="flex items-center gap-1.5 font-semibold text-[#107548] transition-colors hover:underline dark:text-[#34D399]"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>
                    {p.answers.length > 0 ? p.answers.length : p.comments}{" "}
                    {tr("Answers", "উত্তর")}
                  </span>
                </button>
              </div>

              {/* Answers & Reply Section */}
              {isOpen && (
                <div className="mt-4 space-y-3 border-t border-border/50 pt-4">
                  {p.answers.length > 0 && (
                    <div className="space-y-2.5">
                      {p.answers.map((ans) => (
                        <div
                          key={ans.id}
                          className="rounded-2xl bg-[#F4F8F5] p-3.5 dark:bg-white/5"
                        >
                          <div className="flex items-center gap-2">
                            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#107548] text-xs font-bold text-white">
                              {ans.author[0]}
                            </div>
                            <span className="text-xs font-bold text-forest dark:text-white">
                              {ans.author}
                            </span>
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#107548] dark:text-[#34D399]" />
                            <span className="text-[11px] text-muted-foreground">
                              {ans.region} · {ans.time}
                            </span>
                          </div>
                          <p className="mt-1.5 text-sm leading-relaxed text-forest/90 dark:text-white/90">
                            {ans.text}
                          </p>
                          {ans.photo && (
                            <img
                              src={ans.photo}
                              alt="Answer attachment"
                              className="mt-2 max-h-48 rounded-xl border border-border object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Write an Answer Box */}
                  <div className="rounded-2xl border border-border/80 bg-background/70 p-3 dark:border-white/10">
                    <div className="mb-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={answerNames[p.id] ?? ""}
                        onChange={(e) =>
                          setAnswerNames((prev) => ({
                            ...prev,
                            [p.id]: e.target.value,
                          }))
                        }
                        placeholder={tr("Your name (optional)", "আপনার নাম (ঐচ্ছিক)")}
                        className="w-full max-w-[200px] rounded-xl border border-border/70 bg-white px-3 py-1.5 text-xs text-forest outline-none focus:ring-1 focus:ring-[#107548] dark:border-white/15 dark:bg-white/5 dark:text-white"
                      />
                      <label className="ml-auto inline-flex cursor-pointer items-center gap-1 rounded-full bg-[#DFF0E5] px-3 py-1.5 text-xs font-semibold text-[#143323] hover:bg-[#cde6d6] dark:bg-[#107548]/25 dark:text-emerald-200">
                        <ImagePlus className="h-3.5 w-3.5 text-[#107548] dark:text-[#34D399]" />
                        <span>{tr("Photo", "ছবি")}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageSelect(e, (url) =>
                              setAnswerPhotos((prev) => ({ ...prev, [p.id]: url }))
                            )
                          }
                        />
                      </label>
                    </div>

                    {answerPhoto && (
                      <div className="relative mb-2 inline-block">
                        <img
                          src={answerPhoto}
                          alt="Answer preview"
                          className="h-20 w-28 rounded-xl border border-border object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setAnswerPhotos((prev) => ({ ...prev, [p.id]: null }))
                          }
                          className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-black/75 text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={answerDrafts[p.id] ?? ""}
                        onChange={(e) =>
                          setAnswerDrafts((prev) => ({
                            ...prev,
                            [p.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addAnswer(p.id);
                          }
                        }}
                        placeholder={tr(
                          "Write your answer or solution…",
                          "আপনার উত্তর বা সমাধান লিখুন…"
                        )}
                        className="flex-1 rounded-full bg-[#EDF3EF] px-4 py-2 text-sm text-forest placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#107548] dark:bg-white/10 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => addAnswer(p.id)}
                        disabled={
                          !(answerDrafts[p.id] ?? "").trim() && !answerPhotos[p.id]
                        }
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#107548] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0c5c38] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>{tr("Answer", "উত্তর দিন")}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}
