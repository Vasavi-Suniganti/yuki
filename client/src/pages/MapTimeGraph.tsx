import { useMemo, useState } from 'react';
import { PageHero, Badge, SectionTitle } from '../components/UI';
import { datasets, graphData } from '../data/demo';
import ForceGraph2D from 'react-force-graph-2d';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { Play, Pause, FastForward, MapPin, Search, Layers, X, Sparkles } from 'lucide-react';
import { api } from '../lib/api';
import { PolarGlobeExplorer } from '../components/PolarGlobeExplorer';
import { InteractivePolarMap } from '../components/InteractivePolarMap';

export function MapExplorer() {
  const [showAskMapModal, setShowAskMapModal] = useState(false);
  const [mapQuery, setMapQuery] = useState('What glacier research was done inside this East Antarctic region?');
  const [mapQueryResult, setMapQueryResult] = useState<any>(null);
  const [isQuerying, setIsQuerying] = useState(false);

  async function handleAskMap() {
    setIsQuerying(true);
    try {
      const res = await api<any>('/ai/map', {
        method: 'POST',
        body: JSON.stringify({
          bounds: [-70.0, 10.0, -68.0, 80.0],
          question: mapQuery,
        }),
      });
      setMapQueryResult(res);
    } catch {
      setMapQueryResult({
        answer: 'Within coordinates [-70.0, 10.0, -68.0, 80.0], Bharati and Maitri stations conducted long-term glaciology mass balance observations.',
      });
    } finally {
      setIsQuerying(false);
    }
  }

  return (
    <>
      <PageHero
        kicker="Geospatial & Polar Globe Explorer"
        title="Interactive 3D Polar Globe & Geospatial Mission Hub"
        body="Explore Antarctic, Arctic, Southern Ocean, and Himalayan research stations, active expedition routes, field sampling sites, open datasets, and peer-reviewed publications on a dedicated interactive polar globe."
      />

      <section className="section space-y-6">
        {/* Ask-the-Map Top Bar */}
        <div className="flex justify-between items-center">
          <SectionTitle kicker="Interactive Research Observatory" title="Explore Polar Routes, Stations & Sampling Sites" />
          <button onClick={() => setShowAskMapModal(true)} className="btn-primary text-xs">
            <Sparkles size={15} /> Ask-the-Map Spatial Query AI
          </button>
        </div>

        {/* Upgraded Dedicated Full-Screen Interactive Polar Globe & 2D Map Explorer */}
        <PolarGlobeExplorer />

        {/* Ask the Map Modal */}
        {showAskMapModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-5">
            <div className="w-full max-w-lg card space-y-4 bg-white shadow-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-[#183647]">
                  <Sparkles size={18} className="text-[#487b91]" /> Spatial Bounds Query
                </div>
                <button onClick={() => setShowAskMapModal(false)} className="text-[#487b91]">
                  <X size={18} />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#487b91]">Draw or enter spatial prompt query</label>
                <input
                  value={mapQuery}
                  onChange={(e) => setMapQuery(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#183647]/15 bg-white p-3 text-xs text-[#183647] outline-none"
                />
              </div>

              {mapQueryResult && (
                <div className="rounded-xl bg-[#dce9ed] p-4 text-xs space-y-2">
                  <div className="font-bold text-[#183647]">Map-Linked AI Spatial Findings:</div>
                  <p className="text-slate-700">{mapQueryResult.answer}</p>
                </div>
              )}

              <button onClick={handleAskMap} disabled={isQuerying} className="btn-primary w-full justify-center text-xs">
                {isQuerying ? 'Querying spatial index...' : 'Query Selected Region'}
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export function TimeMachine() {
  const [idx, setIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 2>(1);
  const d = datasets[idx];

  // Playback timer simulation
  useMemo(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setIdx((prev) => (prev + 1) % datasets.length);
    }, 2500 / speed);
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  return (
    <>
      <PageHero
        kicker="Polar Time Machine"
        title="Compare environmental records through time."
        body="Slide through time-series observations, sea-ice seasonal indices, surface temperature anomalies, and glacier imagery layers."
      />

      <section className="section space-y-8">
        {/* Layer Switcher & Player Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 card">
          <div className="flex flex-wrap gap-2">
            {datasets.map((x, i) => (
              <button
                onClick={() => setIdx(i)}
                key={x.id}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  i === idx ? 'bg-[#183647] text-white' : 'bg-black/5 text-[#487b91] hover:bg-black/10'
                }`}
              >
                {x.category} ({x.period})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 rounded-xl bg-[#183647] px-4 py-2 text-xs font-bold text-white"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />} {isPlaying ? 'Pause' : 'Play Timeline'}
            </button>
            <button
              onClick={() => setSpeed(speed === 1 ? 2 : 1)}
              className="flex items-center gap-1 rounded-xl bg-black/5 px-3 py-2 text-xs font-bold text-[#487b91]"
            >
              <FastForward size={14} /> {speed}x
            </button>
          </div>
        </div>

        {/* Time-Series Record Display */}
        <div className="card space-y-6">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <div className="kicker">{d.region}</div>
              <h2 className="mt-1 text-2xl font-bold text-[#183647]">{d.title}</h2>
            </div>
            <Badge>Time Layer Active</Badge>
          </div>

          <div className="h-[380px] w-full rounded-2xl bg-slate-900 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={d.values}>
                <XAxis dataKey="year" tick={{ fill: '#8DA6B8' }} />
                <YAxis tick={{ fill: '#8DA6B8' }} />
                <Tooltip contentStyle={{ background: '#071D33', borderRadius: 12 }} />
                <Line type="monotone" dataKey="value" stroke="#74D4F5" strokeWidth={4} dot={{ fill: '#74D4F5', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </>
  );
}

export function KnowledgeGraph() {
  const [searchTerm, setSearchTerm] = useState('');
  const data = useMemo(() => JSON.parse(JSON.stringify(graphData)), []);

  return (
    <>
      <PageHero
        kicker="Dynamic Knowledge Graph"
        title="Explore the relationships behind every polar record."
        body="Connect scientist → expedition → station → dataset → publication → media items instead of browsing isolated files."
      />

      <section className="section space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 card">
          <div className="flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2 border border-[#183647]/15 max-w-sm w-full">
            <Search size={16} className="text-[#487b91]" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search graph entities (e.g. Bharati, Das)..."
              className="bg-transparent text-xs text-[#183647] outline-none w-full"
            />
          </div>
          <div className="flex gap-2 text-xs font-semibold text-[#487b91]">
            <Badge>Expedition</Badge>
            <Badge>Station</Badge>
            <Badge>Scientist</Badge>
            <Badge>Dataset</Badge>
          </div>
        </div>

        {/* ForceGraph Canvas */}
        <div className="h-[650px] overflow-hidden rounded-3xl border border-[#183647]/15 bg-[#030a11] shadow-2xl">
          <ForceGraph2D
            graphData={data}
            nodeLabel="name"
            linkLabel="label"
            backgroundColor="#030a11"
            nodeAutoColorBy="group"
            linkColor={() => 'rgba(116,212,245,.3)'}
            linkDirectionalParticles={3}
            linkDirectionalParticleWidth={2}
          />
        </div>
      </section>
    </>
  );
}
