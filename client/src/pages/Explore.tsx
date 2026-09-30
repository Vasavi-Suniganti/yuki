import { useMemo, useState } from 'react';
import { Search, Database, BookOpen, Ship, Image as ImageIcon, ArrowRight, Filter, X, Sparkles, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHero, Badge } from '../components/UI';
import { datasets, expeditions, publications, media, news } from '../data/demo';

const TYPE_ICONS: Record<string, any> = {
  Expedition: Ship,
  Dataset: Database,
  Publication: BookOpen,
  Media: ImageIcon,
  News: TrendingUp,
};

export default function Explore() {
  const [q, setQ] = useState('');
  const [activeType, setActiveType] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');

  const allItems = useMemo(() => [
    ...expeditions.map(x => ({ type: 'Expedition', title: x.title, body: x.objective, to: `/expeditions/${x.id}`, meta: x.year, badge: x.status, category: x.region, id: x.id })),
    ...datasets.map(x => ({ type: 'Dataset', title: x.title, body: x.description, to: `/datasets/${x.id}`, meta: x.region, badge: x.status, category: x.category, id: x.id })),
    ...publications.map(x => ({ type: 'Publication', title: x.title, body: x.abstract, to: `/publications/${x.id}`, meta: String(x.year), badge: x.category, category: x.category, id: x.id })),
    ...media.map(x => ({ type: 'Media', title: x.title, body: `${x.type} · ${x.expedition}`, to: '/media', meta: x.tag, badge: x.type, category: 'Media', id: x.id })),
    ...news.map(x => ({ type: 'News', title: x.title, body: x.date, to: '/news', meta: x.category, badge: x.category, category: 'News', id: x.id })),
  ], []);

  const types = ['All', 'Expedition', 'Dataset', 'Publication', 'Media', 'News'];
  const categories = useMemo(() => ['All', ...Array.from(new Set(allItems.map(x => x.category)))], [allItems]);

  const filtered = useMemo(() =>
    allItems.filter(x => {
      const matchQ = !q || (x.title + ' ' + x.body + ' ' + x.type + ' ' + x.category).toLowerCase().includes(q.toLowerCase());
      const matchType = activeType === 'All' || x.type === activeType;
      const matchCat = activeCategory === 'All' || x.category === activeCategory;
      return matchQ && matchType && matchCat;
    }),
    [q, activeType, activeCategory, allItems]
  );

  const counts = useMemo(() => ({
    Expedition: expeditions.length,
    Dataset: datasets.length,
    Publication: publications.length,
    Media: media.length,
    News: news.length,
    Total: allItems.length,
  }), [allItems]);

  return (
    <>
      <PageHero
        kicker="Unified Discovery"
        title="Search the entire polar knowledge ecosystem."
        body="Find expeditions, datasets, publications, media, stations and connected research from one place — powered by cross-collection full-text search."
      >
        <div className="mt-8 max-w-3xl glass flex items-center gap-3 rounded-2xl p-3 shadow-lg border border-[#183647]/15">
          <Search className="text-[#487b91] ml-1" size={20} />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Try 'glacier', 'Southern Ocean', 'temperature', 'Arctic'..."
            className="w-full bg-transparent p-2 outline-none text-[#183647] text-sm placeholder:text-[#487b91]"
          />
          {q && (
            <button onClick={() => setQ('')} className="text-[#487b91] hover:text-[#183647] transition">
              <X size={16} />
            </button>
          )}
          <div className="text-xs text-[#487b91] whitespace-nowrap pr-1">{filtered.length} results</div>
        </div>
      </PageHero>

      <section className="section space-y-8">
        {/* Stats Overview */}
        <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-6">
          {[
            ['Expeditions', Ship, counts.Expedition, '/expeditions'],
            ['Datasets', Database, counts.Dataset, '/datasets'],
            ['Publications', BookOpen, counts.Publication, '/publications'],
            ['Media', ImageIcon, counts.Media, '/media'],
            ['News', TrendingUp, counts.News, '/news'],
            ['Total Records', Sparkles, counts.Total, '/explore'],
          ].map(([t, I, n, to]: any) => (
            <Link to={to} key={t} className="card text-center hover:border-[#487b91] transition group">
              <I size={20} className="mx-auto text-[#487b91]" />
              <div className="mt-3 text-2xl font-bold text-[#183647]">{n}</div>
              <div className="text-xs text-[#487b91] mt-1">{t}</div>
            </Link>
          ))}
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={14} className="text-[#487b91]" />
            <span className="text-xs font-semibold text-[#487b91]">Type:</span>
            {types.map(t => (
              <button key={t} onClick={() => setActiveType(t)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  activeType === t ? 'bg-[#183647] text-white' : 'bg-white/60 text-[#487b91] hover:bg-white'
                }`}>
                {t}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={14} className="text-[#487b91]" />
            <span className="text-xs font-semibold text-[#487b91]">Category:</span>
            {categories.slice(0, 8).map(c => (
              <button key={c} onClick={() => setActiveCategory(c)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  activeCategory === c ? 'bg-[#487b91] text-white' : 'bg-white/60 text-[#487b91] hover:bg-white'
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Active filters display */}
        {(activeType !== 'All' || activeCategory !== 'All' || q) && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#487b91]">Active filters:</span>
            {q && <span className="inline-flex items-center gap-1 rounded-full bg-[#183647]/10 px-3 py-1 text-xs font-semibold text-[#183647]">
              "{q}" <button onClick={() => setQ('')}><X size={11} /></button>
            </span>}
            {activeType !== 'All' && <span className="inline-flex items-center gap-1 rounded-full bg-[#183647]/10 px-3 py-1 text-xs font-semibold text-[#183647]">
              {activeType} <button onClick={() => setActiveType('All')}><X size={11} /></button>
            </span>}
            {activeCategory !== 'All' && <span className="inline-flex items-center gap-1 rounded-full bg-[#183647]/10 px-3 py-1 text-xs font-semibold text-[#183647]">
              {activeCategory} <button onClick={() => setActiveCategory('All')}><X size={11} /></button>
            </span>}
          </div>
        )}

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="card text-center py-16">
            <Search size={40} className="mx-auto text-[#487b91] mb-4" />
            <h3 className="text-xl font-bold text-[#183647]">No results found</h3>
            <p className="mt-2 text-sm text-[#487b91]">Try a different search term or remove active filters.</p>
            <button onClick={() => { setQ(''); setActiveType('All'); setActiveCategory('All'); }} className="btn-secondary mt-4 text-xs">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {filtered.map((x, i) => {
              const Icon = TYPE_ICONS[x.type] || Search;
              return (
                <Link key={`${x.id}-${i}`} to={x.to} className="card group hover:border-[#487b91] transition space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon size={15} className="text-[#487b91]" />
                      <Badge>{x.type}</Badge>
                    </div>
                    <span className="text-xs text-[#487b91] font-mono">{x.meta}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#183647] group-hover:text-[#487b91] transition line-clamp-2">{x.title}</h3>
                  <p className="text-xs text-[#487b91] line-clamp-2">{x.body}</p>
                  <div className="flex items-center justify-between pt-1">
                    <Badge>{x.badge}</Badge>
                    <span className="flex items-center gap-1 text-xs text-[#487b91] group-hover:text-[#183647] transition">
                      Open <ArrowRight size={13} className="transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
