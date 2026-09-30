import { useState, useMemo, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageHero, Badge, SectionTitle } from '../components/UI';
import { expeditions, datasets, publications, reports, media, researchers } from '../data/demo';
import { Play, Pause, FastForward, Ship, Compass, MapPin, Sparkles, BookOpen, CheckCircle2, User, Layers, FileText, Database, ArrowLeft } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup } from 'react-leaflet';
import {
  SaveToShelfButton,
  AddToWorkspaceButton,
  WatchItemButton,
} from '../components/SignatureActionButtons';

import {
  getRepositoryExpeditions,
  subscribeDataRepository,
} from '../lib/dataRepository';
import { InteractivePolarMap } from '../components/InteractivePolarMap';

export function Expeditions() {
  const [regionFilter, setRegionFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [expList, setExpList] = useState(getRepositoryExpeditions());

  useEffect(() => {
    const sync = () => setExpList(getRepositoryExpeditions());
    sync();
    return subscribeDataRepository(sync);
  }, []);

  const filtered = expList.filter((e) => {
    const matchesRegion = regionFilter === 'All' || e.region.toLowerCase().includes(regionFilter.toLowerCase());
    const matchesSearch = !search || (e.title + e.objective + e.leader + e.stations.join(' ')).toLowerCase().includes(search.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <>
      <PageHero
        kicker="Expedition Intelligence Portal"
        title="Track active, historical, and planned polar missions."
        body="Explore expedition routes, station operations, digital twin telemetry playback, linked field observations, and story mode narratives."
      />

      <section className="section space-y-6">
        {/* Interactive Polar Map Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <SectionTitle kicker="Geospatial Intelligence" title="Interactive Polar Expedition Map" />
          </div>
          <InteractivePolarMap height={480} showSidebar={true} />
        </div>

        {/* Region & Search Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#183647]/10">
          <div className="flex flex-wrap gap-2">
            {['All', 'Antarctica', 'Arctic', 'Southern Ocean', 'Himalayas'].map((r) => (
              <button
                key={r}
                onClick={() => setRegionFilter(r)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  regionFilter === r ? 'bg-[#183647] text-white shadow-sm' : 'bg-white/60 text-[#487b91] hover:bg-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px]">
            <input
              type="text"
              placeholder="Search expeditions, leaders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 text-xs rounded-full border border-[#183647]/20 outline-none bg-white/80"
            />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {filtered.map((e) => (
            <div key={e.id} className="card group hover:border-[#487b91] transition space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Badge>{e.status}</Badge>
                  <span className="text-xs font-mono text-[#487b91]">{e.year}</span>
                </div>
                <div>
                  <Link to={`/expeditions/${e.id}`}>
                    <h2 className="text-2xl font-bold text-[#183647] group-hover:text-[#487b91] transition cursor-pointer">{e.title}</h2>
                  </Link>
                  {e.vesselOrBase && <p className="text-xs text-[#487b91] font-semibold mt-1">Base / Vessel: {e.vesselOrBase}</p>}
                </div>
                <p className="text-xs text-slate-700 line-clamp-2">{e.objective}</p>
              </div>

              <div className="pt-3 border-t border-[#183647]/10 flex flex-wrap justify-between items-center text-xs font-semibold text-[#183647] gap-2">
                <div>Leader: {e.leader}</div>

                <div className="flex items-center gap-1.5">
                  <SaveToShelfButton item={{ id: e.id, type: 'expedition', title: e.title, subtitle: `Leader: ${e.leader}`, url: `/expeditions/${e.id}` }} compact />
                  <AddToWorkspaceButton item={{ id: e.id, type: 'expedition', title: e.title, subtitle: `Leader: ${e.leader}`, region: e.region }} compact />
                  <WatchItemButton item={{ id: e.id, type: 'expedition', title: e.title, status: e.status }} compact />
                  <Link to={`/expeditions/${e.id}`} className="btn-secondary text-[11px] py-1 px-3 ml-1">
                    Inspect Mission
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export function ExpeditionDetail() {
  const { id } = useParams();
  const allExp = getRepositoryExpeditions();
  const e = allExp.find((x) => x.id === id) || expeditions[0];

  const [activeMode, setActiveMode] = useState<'twin' | 'story' | 'team'>('twin');

  const linkedDatasetsList = datasets.filter((d) => e.datasets?.includes(d.id) || d.expeditionId === e.id);
  const linkedPubsList = publications.filter((p) => e.publications?.includes(p.id) || p.expeditionId === e.id);
  const linkedReportsList = reports.filter((r) => r.expeditionId === e.id);
  const linkedMediaList = media.filter((m) => m.expeditionId === e.id);

  return (
    <>
      <PageHero kicker={`${e.region} · ${e.year}`} title={e.title} body={e.objective}>
        <div className="mt-6 flex flex-wrap gap-3">
          <Badge>STATUS: {e.status}</Badge>
          <Badge>LEADER: {e.leader}</Badge>
          {e.vesselOrBase && <Badge>BASE: {e.vesselOrBase}</Badge>}
          <Badge>STATIONS: {e.stations.join(', ')}</Badge>
        </div>
      </PageHero>

      <section className="section space-y-8">
        {/* Mode Selector */}
        <div className="flex gap-2 border-b border-[#183647]/15 pb-4">
          <button
            onClick={() => setActiveMode('twin')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold ${
              activeMode === 'twin' ? 'bg-[#183647] text-white' : 'bg-white/60 text-[#487b91]'
            }`}
          >
            <Compass size={15} /> Digital Twin Playback
          </button>
          <button
            onClick={() => setActiveMode('story')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold ${
              activeMode === 'story' ? 'bg-[#183647] text-white' : 'bg-white/60 text-[#487b91]'
            }`}
          >
            <BookOpen size={15} /> Story Mode Narrative
          </button>
          <button
            onClick={() => setActiveMode('team')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold ${
              activeMode === 'team' ? 'bg-[#183647] text-white' : 'bg-white/60 text-[#487b91]'
            }`}
          >
            <User size={15} /> Research Team & Operations
          </button>
        </div>

        {/* MODE 1: DIGITAL TWIN PLAYBACK */}
        {activeMode === 'twin' && (
          <div className="space-y-6">
            <InteractivePolarMap
              initialExpeditionId={e.id}
              height={560}
              showSidebar={false}
              enableDigitalTwin={true}
            />
          </div>
        )}

        {/* MODE 2: STORY MODE NARRATIVE */}
        {activeMode === 'story' && (
          <div className="card space-y-6">
            <h3 className="text-xl font-bold text-[#183647]">Expedition Field Narrative & Logbook</h3>
            <div className="space-y-4 text-xs text-[#183647]">
              <div className="rounded-xl bg-white p-4 border border-[#183647]/10 space-y-1">
                <Badge>CHAPTER 01: MOBILIZATION</Badge>
                <h4 className="font-bold text-sm">Port Departure & Transit Log</h4>
                <p className="text-slate-700">The expedition team mobilized with specialized sampling equipment, automatic weather stations, and continuous micro-lidar units.</p>
              </div>
              <div className="rounded-xl bg-white p-4 border border-[#183647]/10 space-y-1">
                <Badge>CHAPTER 02: STATION OPERATIONS</Badge>
                <h4 className="font-bold text-sm">Field Base Operations & Sampling</h4>
                <p className="text-slate-700">Scientific teams landed at field stations to establish long-term monitoring arrays and extract firn core samples.</p>
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: RESEARCH TEAM & OPERATIONS */}
        {activeMode === 'team' && (
          <div className="card space-y-6 text-xs text-[#183647]">
            <h3 className="text-xl font-bold border-b border-[#183647]/10 pb-3">Research Team & Scientific Operations</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="font-bold text-[#487b91] text-sm">Participating Scientists</div>
                <div className="space-y-1 text-slate-700">
                  {e.scientists.map((sc) => (
                    <div key={sc} className="flex items-center gap-2 rounded-lg bg-slate-50 p-2 font-semibold">
                      <User size={14} className="text-[#487b91]" /> {sc}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-bold text-[#487b91] text-sm">Affiliated Institutions</div>
                <div className="flex flex-wrap gap-1.5">
                  {(e.institutions || ['NCPOR', 'IISc Bangalore', 'CSIR-NIO']).map((inst) => (
                    <span key={inst} className="rounded-lg bg-slate-100 px-3 py-1 font-semibold">
                      {inst}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Linked Expedition Artifacts Section */}
        <div className="space-y-6 pt-4 border-t border-[#183647]/15">
          <SectionTitle kicker="Connected Mission Outputs" title="Linked Reports, Datasets, Publications & Media" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Reports */}
            <div className="card space-y-3">
              <div className="font-bold text-[#183647] text-sm flex items-center gap-2">
                <FileText size={16} className="text-[#487b91]" /> Field Reports ({linkedReportsList.length})
              </div>
              {linkedReportsList.map((r) => (
                <div key={r.id} className="rounded-xl bg-white p-3 border border-[#183647]/10 text-xs space-y-1">
                  <div className="font-bold text-[#183647]">{r.title}</div>
                  <div className="text-[10px] text-[#487b91]">Authors: {r.authors.join(', ')}</div>
                </div>
              ))}
            </div>

            {/* Datasets */}
            <div className="card space-y-3">
              <div className="font-bold text-[#183647] text-sm flex items-center gap-2">
                <Database size={16} className="text-[#487b91]" /> Linked Datasets ({linkedDatasetsList.length})
              </div>
              {linkedDatasetsList.map((d) => (
                <Link key={d.id} to={`/datasets/${d.id}`} className="block rounded-xl bg-white p-3 border border-[#183647]/10 hover:border-[#487b91] transition text-xs space-y-1">
                  <div className="font-bold text-[#183647]">{d.title}</div>
                  <div className="text-[10px] text-[#487b91]">{d.format} · {d.downloads} downloads</div>
                </Link>
              ))}
            </div>

            {/* Publications */}
            <div className="card space-y-3">
              <div className="font-bold text-[#183647] text-sm flex items-center gap-2">
                <BookOpen size={16} className="text-[#487b91]" /> Publications ({linkedPubsList.length})
              </div>
              {linkedPubsList.map((pub) => (
                <Link key={pub.id} to={`/publications/${pub.id}`} className="block rounded-xl bg-white p-3 border border-[#183647]/10 hover:border-[#487b91] transition text-xs space-y-1">
                  <div className="font-bold text-[#183647]">{pub.title}</div>
                  <div className="text-[10px] text-[#487b91]">DOI: {pub.doi}</div>
                </Link>
              ))}
            </div>

            {/* Media */}
            <div className="card space-y-3">
              <div className="font-bold text-[#183647] text-sm flex items-center gap-2">
                <Layers size={16} className="text-[#487b91]" /> Field Media ({linkedMediaList.length})
              </div>
              {linkedMediaList.map((m) => (
                <div key={m.id} className="rounded-xl overflow-hidden border border-[#183647]/10 text-xs">
                  <img src={m.url} alt={m.title} className="h-20 w-full object-cover" />
                  <div className="p-2 font-bold text-[#183647] truncate">{m.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
