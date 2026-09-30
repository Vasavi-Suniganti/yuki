import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { PageHero, Badge, SectionTitle } from '../components/UI';
import { publications, media, news, reports, researchers, expeditions, datasets } from '../data/demo';
import { 
  BookOpen, Search, Sparkles, Play, FileText, CheckCircle2, ShieldCheck, 
  ExternalLink, User, Calendar, MapPin, Database, Globe2, ChevronRight, 
  Tag, Compass, Layers, ArrowLeft, Download, Award, Clock, FileSpreadsheet
} from 'lucide-react';
import { api } from '../lib/api';
import { Publication, ResearchReport, ResearcherProfile, MediaItem } from '../../../shared/types';
import {
  SaveToShelfButton,
  AddToWorkspaceButton,
  WatchItemButton,
  RemixStoryButton,
} from '../components/SignatureActionButtons';

import {
  getRepositoryPublications,
  subscribeDataRepository,
  triggerFileDownload,
} from '../lib/dataRepository';

export function Publications() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [pubsList, setPubsList] = useState(getRepositoryPublications());

  useEffect(() => {
    const sync = () => setPubsList(getRepositoryPublications());
    sync();
    return subscribeDataRepository(sync);
  }, []);

  const filtered = pubsList.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = !search || (p.title + p.authors.join(' ') + p.abstract + p.journal).toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <>
      <PageHero
        kicker="Publications Repository"
        title="Peer-reviewed research linked to polar expeditions, data, and researchers."
        body="Every paper connects back to the field observations, datasets, instruments, field reports, and media items that support it."
      />
      
      <section className="section space-y-6">
        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {['All', 'Glaciology', 'Sea Ice', 'Permafrost', 'Oceanography', 'Himalayas'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  selectedCategory === cat ? 'bg-[#183647] text-white shadow-sm' : 'bg-white/60 text-[#487b91] hover:bg-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-white p-2.5 border border-[#183647]/15 max-w-xs w-full">
            <Search size={15} className="text-[#487b91]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search papers, authors, DOIs..."
              className="bg-transparent text-xs text-[#183647] outline-none w-full"
            />
          </div>
        </div>

        {/* Publications Grid */}
        <div className="space-y-4">
          {filtered.map((p) => (
            <article key={p.id} className="card group hover:border-[#487b91] transition space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge>{p.category}</Badge>
                  <Badge>{p.publicationType || 'Journal Article'}</Badge>
                  {p.verificationStatus === 'VERIFIED_BY_NCPOR' && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-300 px-3 py-0.5 text-[11px] font-bold text-emerald-800">
                      <CheckCircle2 size={12} className="text-emerald-600" />
                      Verified by NCPOR / MoES
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono text-[#487b91]">
                  {p.year} · {p.journal}
                </span>
              </div>

              <div>
                <Link to={`/publications/${p.id}`}>
                  <h2 className="text-2xl font-bold text-[#183647] group-hover:text-[#487b91] transition cursor-pointer">{p.title}</h2>
                </Link>
                <p className="mt-2 text-xs font-semibold text-[#487b91] flex items-center gap-1.5">
                  <User size={13} /> {p.authors.join(', ')}
                </p>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">{p.abstract}</p>

              {p.keywords && (
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {p.keywords.map((kw) => (
                    <span key={kw} className="rounded-md bg-slate-100 text-[#487b91] px-2 py-0.5 font-medium">
                      #{kw}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between pt-3 border-t border-[#183647]/10 text-xs font-semibold text-[#183647] gap-3">
                <div className="font-mono text-[11px] text-[#487b91]">
                  DOI: {p.doi} · {p.citations} citations
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <SaveToShelfButton item={{ id: p.id, type: 'publication', title: p.title, subtitle: `${p.authors[0]} et al. · ${p.journal}`, url: `/publications/${p.id}` }} />
                  <AddToWorkspaceButton item={{ id: p.id, type: 'publication', title: p.title, subtitle: p.authors[0], category: p.category }} />
                  <RemixStoryButton item={{ id: p.id, type: 'publication', title: p.title, authorOrDoi: p.doi }} />

                  <Link
                    to={`/publications/${p.id}`}
                    className="flex items-center gap-1 text-[#183647] font-bold hover:text-[#487b91] transition ml-2"
                  >
                    Read Paper <ChevronRight size={15} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export function PublicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const allPubs = getRepositoryPublications();
  const p = allPubs.find((x) => x.id === id) || publications[0];

  const relatedExpedition = expeditions.find((e) => e.id === p.expeditionId);
  const linkedDatasetsList = datasets.filter((d) => p.linkedDatasetIds?.includes(d.id));
  const relatedReportsList = reports.filter((r) => p.relatedReportIds?.includes(r.id));
  const relatedResearchersList = researchers.filter((res) => p.relatedResearcherIds?.includes(res.id));
  const relatedMediaList = media.filter((m) => m.publicationId === p.id);

  return (
    <>
      <PageHero
        kicker={`${p.category} · ${p.publicationType || 'Journal Article'} · ${p.year}`}
        title={p.title}
        body={p.abstract}
      >
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            {p.verificationStatus === 'VERIFIED_BY_NCPOR' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-800">
                <CheckCircle2 size={14} className="text-emerald-600" />
                Verified by NCPOR / MoES
              </span>
            )}
            <Badge>JOURNAL: {p.journal}</Badge>
            <Badge>DOI: {p.doi}</Badge>
            <Badge>{p.citations} CITATIONS</Badge>
          </div>

          <button
            onClick={() => triggerFileDownload(p.storagePath || p.publicationUrl || '#', `${p.title}.pdf`)}
            className="btn-primary text-xs flex items-center gap-1.5 shadow-md"
          >
            <Download size={14} /> Download PDF Paper
          </button>
        </div>
      </PageHero>

      <section className="section space-y-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold text-[#487b91] hover:text-[#183647] transition"
        >
          <ArrowLeft size={14} /> Back to Publications Repository
        </button>

        <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
          {/* Main Paper Content Body */}
          <div className="space-y-8">
            {/* Metadata & Authors Box */}
            <div className="card space-y-3">
              <div className="font-bold text-[#183647] text-sm flex items-center gap-2">
                <User size={16} className="text-[#487b91]" /> Authors & Affiliations
              </div>
              <div className="space-y-1.5 text-xs text-[#183647]">
                <div className="font-bold text-[#183647] text-sm">{p.authors.join(', ')}</div>
                {p.affiliations && (
                  <div className="text-[#487b91]">{p.affiliations.join(' · ')}</div>
                )}
                {p.researchRegion && (
                  <div className="text-slate-600 font-semibold mt-1">Study Region: {p.researchRegion}</div>
                )}
              </div>
            </div>

            {/* Abstract Section */}
            <div className="card space-y-3">
              <h3 className="text-lg font-bold text-[#183647] border-b border-[#183647]/10 pb-2">Abstract</h3>
              <p className="text-xs text-slate-700 leading-relaxed font-sans">{p.abstract}</p>
            </div>

            {/* Background & Objectives */}
            {p.background && (
              <div className="card space-y-3">
                <h3 className="text-lg font-bold text-[#183647] border-b border-[#183647]/10 pb-2">Scientific Background & Research Objectives</h3>
                <p className="text-xs text-slate-700 leading-relaxed">{p.background}</p>
                {p.objectives && (
                  <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
                    {p.objectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Study Area & Methodology */}
            {(p.studyArea || p.methodology) && (
              <div className="card space-y-4">
                <h3 className="text-lg font-bold text-[#183647] border-b border-[#183647]/10 pb-2">Study Area & Experimental Methodology</h3>
                {p.studyArea && (
                  <div>
                    <h4 className="text-xs font-bold text-[#183647] uppercase">Geographic Location</h4>
                    <p className="text-xs text-slate-700 mt-1">{p.studyArea}</p>
                  </div>
                )}
                {p.methodology && (
                  <div>
                    <h4 className="text-xs font-bold text-[#183647] uppercase">Experimental Procedures</h4>
                    <p className="text-xs text-slate-700 mt-1">{p.methodology}</p>
                  </div>
                )}
                {p.instruments && (
                  <div>
                    <h4 className="text-xs font-bold text-[#183647] uppercase">Instrumentation & Sensor Arrays</h4>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {p.instruments.map((inst) => (
                        <span key={inst} className="rounded-lg bg-slate-100 text-[#183647] px-2.5 py-1 text-xs font-semibold">
                          {inst}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Key Findings & Results */}
            {p.keyFindings && (
              <div className="card space-y-3">
                <h3 className="text-lg font-bold text-[#183647] border-b border-[#183647]/10 pb-2">Key Findings & Discoveries</h3>
                <div className="space-y-2">
                  {p.keyFindings.map((finding, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3 text-xs text-[#183647]">
                      <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>{finding}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scientific Significance & Limitations */}
            {(p.scientificSignificance || p.limitations) && (
              <div className="grid gap-4 sm:grid-cols-2">
                {p.scientificSignificance && (
                  <div className="card space-y-2">
                    <h4 className="font-bold text-[#183647] text-sm">Scientific Significance</h4>
                    <p className="text-xs text-slate-700">{p.scientificSignificance}</p>
                  </div>
                )}
                {p.limitations && (
                  <div className="card space-y-2">
                    <h4 className="font-bold text-[#183647] text-sm">Study Limitations</h4>
                    <p className="text-xs text-slate-700">{p.limitations}</p>
                  </div>
                )}
              </div>
            )}

            {/* References */}
            {p.references && (
              <div className="card space-y-3">
                <h3 className="text-lg font-bold text-[#183647] border-b border-[#183647]/10 pb-2">References & Citations</h3>
                <div className="space-y-1.5 text-xs text-slate-600 font-mono">
                  {p.references.map((ref, i) => (
                    <div key={i} className="pl-3 border-l-2 border-[#183647]/20">{ref}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Connected Sidebar Resources */}
          <div className="space-y-6">
            {/* Linked Expedition */}
            {relatedExpedition && (
              <div className="card space-y-3">
                <div className="font-bold text-[#183647] text-sm flex items-center gap-2">
                  <Compass size={16} className="text-[#487b91]" /> Linked Expedition
                </div>
                <Link to={`/expeditions/${relatedExpedition.id}`} className="block rounded-xl bg-white p-3.5 border border-[#183647]/12 hover:border-[#487b91] transition">
                  <Badge>{relatedExpedition.status}</Badge>
                  <h4 className="mt-2 font-bold text-[#183647] text-sm">{relatedExpedition.title}</h4>
                  <p className="mt-1 text-xs text-[#487b91]">{relatedExpedition.region} · {relatedExpedition.year}</p>
                </Link>
              </div>
            )}

            {/* Linked Datasets */}
            {linkedDatasetsList.length > 0 && (
              <div className="card space-y-3">
                <div className="font-bold text-[#183647] text-sm flex items-center gap-2">
                  <Database size={16} className="text-[#487b91]" /> Supporting Datasets
                </div>
                {linkedDatasetsList.map((ds) => (
                  <Link key={ds.id} to={`/datasets/${ds.id}`} className="block rounded-xl bg-white p-3 border border-[#183647]/12 hover:border-[#487b91] transition text-xs">
                    <span className="font-bold text-[#183647]">{ds.title}</span>
                    <div className="text-[11px] text-[#487b91] mt-1">{ds.format} · {ds.downloads} downloads</div>
                  </Link>
                ))}
              </div>
            )}

            {/* Linked Field Reports */}
            {relatedReportsList.length > 0 && (
              <div className="card space-y-3">
                <div className="font-bold text-[#183647] text-sm flex items-center gap-2">
                  <FileText size={16} className="text-[#487b91]" /> Expedition Reports
                </div>
                {relatedReportsList.map((rep) => (
                  <div key={rep.id} className="rounded-xl bg-white p-3 border border-[#183647]/12 text-xs space-y-1">
                    <span className="font-bold text-[#183647]">{rep.title}</span>
                    <div className="text-[11px] text-[#487b91]">Authors: {rep.authors.join(', ')}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Authors Profiles */}
            {relatedResearchersList.length > 0 && (
              <div className="card space-y-3">
                <div className="font-bold text-[#183647] text-sm flex items-center gap-2">
                  <User size={16} className="text-[#487b91]" /> Lead Researchers
                </div>
                {relatedResearchersList.map((res) => (
                  <div key={res.id} className="flex items-center gap-3 rounded-xl bg-white p-3 border border-[#183647]/12">
                    <img src={res.avatar} alt={res.name} className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <div className="font-bold text-[#183647] text-xs">{res.name}</div>
                      <div className="text-[11px] text-[#487b91]">{res.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Media Items */}
            {relatedMediaList.length > 0 && (
              <div className="card space-y-3">
                <div className="font-bold text-[#183647] text-sm flex items-center gap-2">
                  <Layers size={16} className="text-[#487b91]" /> Linked Media Evidence
                </div>
                {relatedMediaList.map((m) => (
                  <div key={m.id} className="rounded-xl overflow-hidden border border-[#183647]/12">
                    <img src={m.url} alt={m.title} className="h-24 w-full object-cover" />
                    <div className="p-2.5 text-xs">
                      <div className="font-bold text-[#183647]">{m.title}</div>
                      <div className="text-[10px] text-[#487b91]">{m.location}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export function Media() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [aiCaption, setAiCaption] = useState('');

  const filteredMedia = media.filter((m) => {
    const matchesType = typeFilter === 'All' || m.type === typeFilter;
    const matchesSearch = !search || (m.title + m.caption + m.tags.join(' ') + (m.location || '')).toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  async function handleSelectMedia(m: MediaItem) {
    setSelectedMedia(m);
    try {
      const res = await api<any>('/ai/media', {
        method: 'POST',
        body: JSON.stringify({ content: m.title }),
      });
      setAiCaption(res.outputs?.instagramCaption || `AI Verified Media Caption: High-resolution field observation captured during ${m.expeditionId || 'polar mission'} at ${m.location || 'Antarctica'}.`);
    } catch {
      setAiCaption(`AI Verified Media Caption: High-resolution field observation captured during polar campaign at ${m.location || 'Antarctica'}.`);
    }
  }

  return (
    <>
      <PageHero
        kicker="Media & Outreach Library"
        title="From scientific evidence to verified public polar media."
        body="Browse photo, video, audio, and infographic assets with smart search, transcripts, photographer credits, and AI-suggested media captions."
      />

      <section className="section space-y-8">
        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {['All', 'Photo', 'Video', 'Infographic'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  typeFilter === t ? 'bg-[#183647] text-white shadow-sm' : 'bg-white/60 text-[#487b91] hover:bg-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-white p-2.5 border border-[#183647]/15 max-w-sm w-full">
            <Search size={16} className="text-[#487b91]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search polar media (e.g. Glaciology, Bharati, Lidar)..."
              className="bg-transparent text-xs text-[#183647] outline-none w-full"
            />
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredMedia.map((m) => (
            <div
              key={m.id}
              onClick={() => handleSelectMedia(m)}
              className="relative min-h-[280px] overflow-hidden rounded-3xl border border-[#183647]/15 bg-slate-900 cursor-pointer group shadow-lg flex flex-col justify-end"
            >
              <img
                src={m.url}
                alt={m.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071D33] via-[#071D33]/40 to-transparent" />
              <div className="relative p-5 space-y-1.5 text-white z-10">
                <Badge>{m.type}</Badge>
                <h3 className="text-base font-bold group-hover:text-[#74D4F5] transition line-clamp-2">{m.title}</h3>
                <div className="text-[11px] text-slate-300">{m.location || 'Antarctica'}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Media Detail Inspector */}
        {selectedMedia && (
          <div className="card space-y-6 border-[#487b91]">
            <div className="flex justify-between items-start">
              <div>
                <Badge>{selectedMedia.type}</Badge>
                <h3 className="mt-2 text-2xl font-bold text-[#183647]">{selectedMedia.title}</h3>
                <p className="text-xs text-[#487b91] mt-1">{selectedMedia.location} · Date: {selectedMedia.date || '2026'}</p>
              </div>
              <button onClick={() => setSelectedMedia(null)} className="btn-secondary text-xs">
                Close Viewer
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-[#183647]/15 max-h-[500px]">
              <img src={selectedMedia.url} alt={selectedMedia.title} className="w-full object-cover" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div className="space-y-2">
                <div className="font-bold text-[#183647]">Scientific Caption</div>
                <p className="text-slate-700">{selectedMedia.caption}</p>
                {selectedMedia.photographer && (
                  <div className="text-[#487b91]"><strong className="text-[#183647]">Photographer/Lead:</strong> {selectedMedia.photographer}</div>
                )}
                {selectedMedia.researchActivity && (
                  <div className="text-[#487b91]"><strong className="text-[#183647]">Research Activity:</strong> {selectedMedia.researchActivity}</div>
                )}
              </div>

              <div className="space-y-2">
                {aiCaption && (
                  <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <Sparkles size={14} /> AI Suggested Media Caption:
                    </div>
                    <p>{aiCaption}</p>
                  </div>
                )}

                {selectedMedia.transcript && (
                  <div className="rounded-xl bg-slate-100 p-4 border border-slate-200 text-xs text-slate-700 space-y-1">
                    <div className="font-bold text-[#183647] flex items-center gap-1">
                      <FileText size={14} /> Video Audio Transcript:
                    </div>
                    <p>{selectedMedia.transcript}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export function News() {
  return (
    <>
      <PageHero
        kicker="Newsroom & Official Announcements"
        title="Expeditions, scientific discoveries, and institutional outreach."
        body="A publishing surface for reviewed expedition updates, science stories, outreach campaigns and platform announcements."
      />
      <section className="section">
        <div className="grid gap-6 lg:grid-cols-2">
          {news.map((n) => (
            <article className="card space-y-3" key={n.id}>
              <div className="flex justify-between items-center text-xs">
                <Badge>{n.category}</Badge>
                <span className="font-mono text-[#487b91]">{n.date}</span>
              </div>
              <h2 className="text-xl font-bold text-[#183647]">{n.title}</h2>
              <p className="text-xs text-slate-700 leading-relaxed">{n.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
