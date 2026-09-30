import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Database, Globe2, Orbit, Play, Search, Sparkles, Telescope, Waves, Workflow, Compass, CheckCircle2, User, BookOpen, Clock, Layers, Award, CloudRain, Sun, ShieldCheck } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { datasets, expeditions, publications, media, researchers, stats } from '../data/demo';

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex rounded-full border border-[#487b91]/25 bg-[#487b91]/10 px-2.5 py-1 text-xs font-semibold text-[#487b91]">
    {children}
  </span>
);

const SectionTitle = ({ kicker, title, body }: { kicker: string; title: string; body?: string }) => (
  <div className="mb-10">
    <div className="home-kicker">{kicker}</div>
    <h2 className="home-subhead mt-4">{title}</h2>
    {body && <p className="mt-4 max-w-2xl home-muted text-base leading-relaxed">{body}</p>}
  </div>
);

export function HomeContent() {
  const [aiQuery, setAiQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  const stations = [
    { n: 'Maitri Station (Antarctica)', p: [-70.77, 11.73] as [number, number] },
    { n: 'Bharati Station (Antarctica)', p: [-69.41, 76.19] as [number, number] },
    { n: 'Himadri Station (Arctic)', p: [78.91, 11.93] as [number, number] },
    { n: 'Himansh Base (Himalayas)', p: [32.4, 77.38] as [number, number] },
  ];

  const handleAskAi = (preset?: string) => {
    const q = preset || aiQuery;
    if (!q) return;
    setAiQuery(q);
    setAiAnswer(`[Polar Intelligence Answer]: ${q}\n\nAntarctica and the Arctic act as Earth's climate engine. Ice cores extracted by Indian glaciologists at Bharati and Maitri stations contain ancient air bubbles preserving atmosphere data from thousands of years ago.`);
  };

  return (
    <div className="home-sections">
      {/* ── 01 Hero Section ─────────────────────────────────── */}
      <section id="discovery" className="scroll-mt-20 relative overflow-hidden border-b border-[#183647]/10 bg-transparent">
        <div className="chapter-grid absolute inset-0 opacity-20" />
        <div className="section relative !py-20 lg:!py-28">
          <div className="max-w-4xl space-y-6">
            <div className="home-kicker">01 / Polar Science & Discovery</div>
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-[-.04em] text-[#183647] md:text-6xl lg:text-7xl drop-shadow-sm">
              Discover the World of Polar Science
            </h1>
            <p className="max-w-2xl text-base md:text-lg home-muted leading-relaxed font-medium">
              Explore India's polar expeditions, scientific discoveries, researchers, wildlife, climate and the changing polar environment.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/map" className="inline-flex items-center gap-2 rounded-full bg-[#183647] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#254d63] shadow-lg">
                <Globe2 size={18} /> EXPLORE 3D MAP
              </Link>
              <Link to="/education" className="inline-flex items-center gap-2 rounded-full border border-[#183647]/30 bg-white/80 px-6 py-3.5 text-sm font-bold text-[#183647] backdrop-blur-md transition hover:bg-white shadow-md">
                <BookOpen size={18} /> START LEARNING
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-14 grid gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="home-stat bg-white/80 backdrop-blur-md">
                <span>{s.value.toLocaleString()}+</span>
                <small>{s.label}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 02 Interactive Polar Explorer Preview ────────────── */}
      <section id="explorer" className="scroll-mt-20 border-y border-[#183647]/10 bg-transparent">
        <div className="section grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionTitle
              kicker="02 / Interactive Polar Explorer"
              title="Explore research stations & expedition routes."
              body="Click any location to discover connected expeditions, research activities, lead scientists, datasets, and field media."
            />
            <div className="flex gap-3">
              <Link to="/map" className="inline-flex items-center gap-2 rounded-full bg-[#183647] px-6 py-3 text-xs font-bold text-white transition hover:bg-[#254d63] shadow-lg">
                <Globe2 size={16} /> Open Full 3D Map Explorer
              </Link>
            </div>
          </div>

          <div className="h-[380px] rounded-3xl overflow-hidden border border-[#183647]/20 shadow-2xl">
            <MapContainer center={[-20, 40]} zoom={2} className="h-full w-full">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {stations.map(st => (
                <CircleMarker key={st.n} center={st.p} radius={8} pathOptions={{ color: '#183647', fillColor: '#487b91', fillOpacity: 0.9 }}>
                  <Popup><span className="text-xs font-bold text-[#183647]">{st.n}</span></Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>
      </section>

      {/* ── 03 Featured Expeditions ─────────────────────────── */}
      <section id="expeditions" className="scroll-mt-20 section bg-transparent">
        <SectionTitle
          kicker="03 / Story-Driven Missions"
          title="Featured National Polar Expeditions"
          body="Track real missions across Antarctica, the Arctic, Southern Ocean, and Himalayas."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {expeditions.slice(0, 3).map((e) => (
            <Link to={`/expeditions/${e.id}`} key={e.id} className="card group hover:border-[#487b91] transition space-y-4 bg-white/90">
              <div className="flex justify-between items-center">
                <Badge>{e.status}</Badge>
                <span className="text-xs font-mono text-[#487b91]">{e.year}</span>
              </div>
              <h3 className="text-xl font-bold text-[#183647] group-hover:text-[#487b91] transition">{e.title}</h3>
              <p className="text-xs text-slate-700 line-clamp-3">{e.objective}</p>
              <div className="flex justify-between items-center text-xs font-semibold text-[#183647] pt-2 border-t border-[#183647]/10">
                <span>Leader: {e.leader}</span>
                <span className="text-[#487b91] flex items-center gap-1">Explore Mission <ArrowRight size={13} /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 04 Learn Polar Science Categories ───────────────── */}
      <section id="learning" className="scroll-mt-20 section bg-transparent">
        <SectionTitle
          kicker="04 / Interactive Learning"
          title="Explore Polar Science Topics"
          body="Structured educational modules designed for students, teachers, and public science enthusiasts."
        />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {[
            ['Climate & Environment', 'Global warming, ice melting & sea level'],
            ['Cryosphere Physics', 'Glaciers, sea ice & deep ice cores'],
            ['Ocean Science', 'Southern Ocean currents & carbon sinks'],
            ['Polar Life', 'Penguins, seals & microbial ecosystems'],
            ['Polar Technology', 'Research stations, lidar & satellites'],
          ].map(([t, d]) => (
            <Link to="/education" key={t} className="card text-center hover:border-[#487b91] transition space-y-2 group bg-white/90">
              <BookOpen size={24} className="mx-auto text-[#487b91] group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-[#183647] text-sm">{t}</h4>
              <p className="text-[11px] text-[#487b91]">{d}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 05 Meet the Scientists ──────────────────────────── */}
      <section id="scientists" className="scroll-mt-20 section bg-transparent">
        <SectionTitle
          kicker="05 / Researchers & Leaders"
          title="Meet Indian Polar Scientists"
          body="Learn about the glaciologists, oceanographers, and atmospheric physicists leading field campaigns."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {researchers.slice(0, 3).map((res) => (
            <div key={res.id} className="card space-y-3 hover:border-[#487b91] transition bg-white/90">
              <div className="flex items-center gap-3">
                <img src={res.avatar} alt={res.name} className="h-12 w-12 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-[#183647] text-base">{res.name}</h4>
                  <div className="text-xs text-[#487b91] font-semibold">{res.role}</div>
                </div>
              </div>
              <p className="text-xs text-slate-700 line-clamp-2">{res.bio}</p>
              <div className="text-[11px] text-[#487b91] font-mono">{res.institution}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 06 Why Polar Science Matters to India ───────────── */}
      <section id="impact" className="scroll-mt-20 section bg-transparent">
        <div className="card space-y-6 bg-white/90">
          <SectionTitle
            kicker="06 / Global Teleconnections"
            title="Why Polar Science Matters to India"
            body="Discover how Antarctic sea ice and Southern Ocean currents directly impact the Indian Summer Monsoon and coastal sea levels."
          />
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5 text-center">
            {[
              ['01', 'POLAR REGIONS', 'Antarctica & Arctic Ice Sheets hold 70% of freshwater.'],
              ['02', 'ICE & OCEANS', 'Meltwater alters global ocean salinity & density gradients.'],
              ['03', 'GLOBAL CLIMATE', 'Drives global thermohaline ocean conveyor belt.'],
              ['04', 'MONSOON LINK', 'Alters Indian Ocean pressure & summer monsoon onset.'],
              ['05', 'INDIA IMPACT', 'Affects 1.4 billion people through water security.'],
            ].map(([num, t, d]) => (
              <div key={num} className="rounded-xl bg-white p-4 border border-[#183647]/10 space-y-2 shadow-sm">
                <span className="text-[10px] font-bold text-[#487b91] bg-slate-100 px-2 py-0.5 rounded-full">{num}</span>
                <h4 className="font-bold text-[#183647] text-xs mt-1">{t}</h4>
                <p className="text-[11px] text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 07 Polar AI Assistant ───────────────────────────── */}
      <section id="polar-ai" className="scroll-mt-20 section bg-transparent">
        <div className="card space-y-4 bg-white/90">
          <SectionTitle
            kicker="07 / AI Assistant"
            title="Ask Yuki AI"
            body="Ask student-friendly questions about polar regions, ice cores, wildlife, and climate science."
          />

          <div className="flex flex-wrap gap-2 text-xs">
            {[
              'Why is Antarctica so cold?',
              'What is an ice core?',
              'How do scientists work in Antarctica?',
              'Why are polar regions important to India?',
            ].map((q) => (
              <button key={q} onClick={() => handleAskAi(q)} className="rounded-lg bg-white text-[#183647] px-3 py-1.5 font-semibold text-xs border border-[#183647]/15 hover:bg-slate-50">
                {q}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="Ask polar science question..."
              className="flex-1 rounded-xl border border-[#183647]/15 bg-white p-3 text-xs text-[#183647] outline-none"
            />
            <button onClick={() => handleAskAi()} className="btn-primary text-xs">Ask AI</button>
          </div>

          {aiAnswer && (
            <div className="rounded-xl bg-[#dce9ed] p-4 text-xs font-mono text-[#183647] whitespace-pre-wrap border border-[#183647]/15">
              {aiAnswer}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
