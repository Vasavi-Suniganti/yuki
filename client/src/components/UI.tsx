import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PageHero({
  kicker, title, body, children
}: {
  kicker: string; title: string; body: string; children?: React.ReactNode;
}) {
  return (
    <section className="page-hero relative overflow-hidden border-b pb-16" style={{ borderColor: 'var(--c-border)' }}>
      <div className="grid-bg absolute inset-0 opacity-50" />
      <div className="section relative !pt-12 !pb-10">
        <div className="kicker">{kicker}</div>
        <h1 className="mt-5 max-w-5xl text-4xl font-bold tracking-[-.05em] md:text-6xl">{title}</h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed" style={{ color: 'var(--c-muted)' }}>{body}</p>
        {children}
      </div>
    </section>
  );
}

export function SectionTitle({
  kicker, title, body
}: {
  kicker: string; title: string; body?: string;
}) {
  return (
    <div className="mb-10">
      <div className="kicker">{kicker}</div>
      <h2 className="subhead mt-4">{title}</h2>
      {body && <p className="mt-4 max-w-2xl text-base leading-relaxed" style={{ color: 'var(--c-muted)' }}>{body}</p>}
    </div>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold" style={{ borderColor: 'rgba(90,190,216,.22)', background: 'rgba(90,190,216,.08)', color: 'var(--c-accent)' }}>
      {children}
    </span>
  );
}

export function EmptyCTA({ title, body, to = '/' }: { title: string; body: string; to?: string }) {
  return (
    <div className="card text-center">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm" style={{ color: 'var(--c-muted)' }}>{body}</p>
      <Link to={to} className="btn-secondary mt-5">Continue <ArrowRight size={16} /></Link>
    </div>
  );
}
