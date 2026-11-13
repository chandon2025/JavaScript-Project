import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <section className="bg-brand text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <span className="rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">{eyebrow}</span>
        <h1 className="mt-4 text-3xl font-bold md:text-5xl">{title}</h1>
        {children && <p className="mt-3 max-w-2xl opacity-85">{children}</p>}
      </div>
    </section>
  );
}

export function SectionTitle({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</span>
      <h2 className="mt-2 text-3xl font-bold text-forest md:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-muted-foreground">{sub}</p>}
    </div>
  );
}
