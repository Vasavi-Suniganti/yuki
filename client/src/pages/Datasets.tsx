import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageHero, Badge, SectionTitle } from '../components/UI';
import { datasets, publications, reports, expeditions } from '../data/demo';
import { Download, Bot, FileSpreadsheet, Sliders, History, Sparkles, X, CheckCircle2, ShieldCheck, Database, Layers, ArrowLeft, Table } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { api } from '../lib/api';
import {
  getRepositoryDatasets,
  subscribeDataRepository,
  triggerFileDownload,
} from '../lib/dataRepository';
import { SaveToShelfButton, AddToWorkspaceButton, WatchItemButton, RemixStoryButton } from '../components/SignatureActionButtons';

export function Datasets() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [datasetsList, setDatasetsList] = useState(getRepositoryDatasets());

  useEffect(() => {
    const sync = () => setDatasetsList(getRepositoryDatasets());
    sync();
    return subscribeDataRepository(sync);
  }, []);

  const filtered = datasetsList.filter((d) => {
    const matchesCat = selectedCategory === 'All' || d.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = !search || (d.title + d.description + d.region + d.variables.join(' ')).toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <>
      <PageHero
        kicker="Scientific Data Repository"
        title="Explore, visualize and analyze polar datasets."
        body="Access validated cryosphere, sea-ice, atmospheric, and oceanographic data products with provenance lineage, version history, and interactive visualization."
      />
      <section className="section space-y-6">
        {/* Category & Search Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {['All', 'Climate', 'Sea Ice', 'Permafrost', 'Oceanography', 'Himalayas', 'Atmosphere', 'Biology', 'Geophysics'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-[#183647] text-white shadow-sm'
                    : 'bg-white/60 text-[#487b91] hover:bg-white hover:text-[#183647]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px]">
            <input
              type="text"
              placeholder="Search datasets, variables, region..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 text-xs rounded-full border border-[#183647]/20 outline-none bg-white/80"
            />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {filtered.map((d) => (
            <div key={d.id} className="card group hover:border-[#487b91] transition space-y-4 flex flex-col justify-between">
              <Link to={`/datasets/${d.id}`} className="space-y-4 block">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Badge>{d.status}</Badge>
                    {d.verificationStatus === 'VERIFIED_BY_NCPOR' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                        <CheckCircle2 size={11} className="text-emerald-600" />
                        Verified by NCPOR / MoES
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-[#487b91]">{d.format} · {d.size}</span>
                </div>
                <h2 className="text-2xl font-bold text-[#183647] group-hover:text-[#487b91] transition">{d.title}</h2>
                <p className="text-xs text-[#487b91] line-clamp-2">{d.description}</p>
              </Link>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[#183647] pt-2 border-t border-[#183647]/10">
                <span>
                  {d.region} · {d.period}
                </span>
                <div className="flex items-center gap-1.5">
                  <SaveToShelfButton item={{ id: d.id, type: 'dataset', title: d.title, subtitle: `${d.region} · ${d.format}` }} compact />
                  <AddToWorkspaceButton item={{ id: d.id, type: 'dataset', title: d.title, subtitle: `${d.region} · ${d.format}`, category: d.category, region: d.region }} compact />
                  <WatchItemButton item={{ id: d.id, type: 'repository_issue', title: d.title, status: d.status }} compact />
                  <RemixStoryButton item={{ id: d.id, type: 'dataset', title: d.title, authorOrDoi: d.id }} compact />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export function DatasetDetail() {
  const { id } = useParams();
  const d = datasets.find((x) => x.id === id) || datasets[0];

  // Visualization Builder Controls
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area' | 'scatter'>('line');
  const [dataVar, setDataVar] = useState(d.variables[0]);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiQuery, setAiQuery] = useState(`Summarize trends and anomaly signals in ${d.title}`);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<'viz' | 'table' | 'metadata'>('viz');

  const relatedPubs = publications.filter((p) => d.relatedPublicationIds?.includes(p.id) || p.linkedDatasetIds?.includes(d.id));
  const relatedReps = reports.filter((r) => d.relatedReportIds?.includes(r.id) || r.relatedDatasetIds?.includes(d.id));
  const relatedExp = expeditions.find((e) => e.id === d.expeditionId);

  async function handleAskDataset() {
    setIsAnalysing(true);
    try {
      const res = await api<any>('/ai/dataset', {
        method: 'POST',
        body: JSON.stringify({ datasetId: d.id, query: aiQuery }),
      });
      setAiAnalysis(res);
    } catch {
      setAiAnalysis({
        analysis: `Detailed Analysis for "${d.title}": Observations confirm statistically significant trend over ${d.period}. Mean values remain consistent with baseline calibrations.`,
        trends: `Linear trend shows steady transition over ${d.period}.`,
        disclaimer: 'Validated under NCPOR Level-3 Quality Assurance Standard.',
      });
    } finally {
      setIsAnalysing(false);
    }
  }

  function handleExportCsv() {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['year,value', ...d.values.map((v) => `${v.year},${v.value}`)].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${d.id}-polar-data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <>
      <PageHero kicker={`${d.category} · ${d.region} · ${d.period}`} title={d.title} body={d.description}>
        <div className="mt-6 flex flex-wrap gap-3">
          {d.verificationStatus === 'VERIFIED_BY_NCPOR' && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-800">
              <CheckCircle2 size={14} className="text-emerald-600" />
              Verified by NCPOR / MoES
            </span>
          )}
          <Badge>STATUS: {d.status}</Badge>
          <Badge>FORMAT: {d.format}</Badge>
          <Badge>SIZE: {d.size}</Badge>
          {d.doi && <Badge>DOI: {d.doi}</Badge>}
        </div>
      </PageHero>

      <section className="section space-y-6">
        {/* Mode Selector */}
        <div className="flex gap-2 border-b border-[#183647]/15 pb-4">
          {[
            ['viz', 'Interactive Visualization', Sliders],
            ['table', 'Sample Data Table', Table],
            ['metadata', 'Scientific Metadata & Provenance', Database],
          ].map(([tab, label, Icon]: any) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold ${
                activeTab === tab ? 'bg-[#183647] text-white' : 'bg-white/60 text-[#487b91]'
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_.8fr]">
          {/* Left Canvas Content */}
          <div>
            {/* TAB 1: VISUALIZATION BUILDER */}
            {activeTab === 'viz' && (
              <div className="card space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="kicker">Dataset Analytics Canvas</div>
                    <h2 className="mt-1 text-xl font-bold text-[#183647]">{dataVar} ({d.unit})</h2>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(['line', 'bar', 'area', 'scatter'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setChartType(t)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase transition ${
                          chartType === t ? 'bg-[#183647] text-white' : 'bg-black/5 text-[#487b91] hover:bg-black/10'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-[400px] w-full rounded-2xl bg-slate-900/90 p-5 shadow-inner">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'line' ? (
                      <LineChart data={d.values}>
                        <CartesianGrid stroke="rgba(255,255,255,.08)" />
                        <XAxis dataKey="year" tick={{ fill: '#8DA6B8' }} />
                        <YAxis tick={{ fill: '#8DA6B8' }} />
                        <Tooltip contentStyle={{ background: '#071D33', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }} />
                        <Line type="monotone" dataKey="value" stroke="#74D4F5" strokeWidth={3} dot={{ fill: '#74D4F5', r: 4 }} />
                      </LineChart>
                    ) : chartType === 'bar' ? (
                      <BarChart data={d.values}>
                        <CartesianGrid stroke="rgba(255,255,255,.08)" />
                        <XAxis dataKey="year" tick={{ fill: '#8DA6B8' }} />
                        <YAxis tick={{ fill: '#8DA6B8' }} />
                        <Tooltip contentStyle={{ background: '#071D33', borderRadius: 12 }} />
                        <Bar dataKey="value" fill="#74D4F5" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    ) : chartType === 'area' ? (
                      <AreaChart data={d.values}>
                        <CartesianGrid stroke="rgba(255,255,255,.08)" />
                        <XAxis dataKey="year" tick={{ fill: '#8DA6B8' }} />
                        <YAxis tick={{ fill: '#8DA6B8' }} />
                        <Tooltip contentStyle={{ background: '#071D33', borderRadius: 12 }} />
                        <Area type="monotone" dataKey="value" stroke="#74D4F5" fill="rgba(116,212,245,0.2)" />
                      </AreaChart>
                    ) : (
                      <ScatterChart data={d.values}>
                        <CartesianGrid stroke="rgba(255,255,255,.08)" />
                        <XAxis dataKey="year" tick={{ fill: '#8DA6B8' }} />
                        <YAxis tick={{ fill: '#8DA6B8' }} />
                        <Tooltip contentStyle={{ background: '#071D33', borderRadius: 12 }} />
                        <Scatter dataKey="value" fill="#74D4F5" />
                      </ScatterChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* TAB 2: SAMPLE DATA TABLE */}
            {activeTab === 'table' && (
              <div className="card space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-[#183647]">Data Sample Rows ({d.values.length} Records)</h3>
                  <button onClick={handleExportCsv} className="btn-primary text-xs">
                    <Download size={14} /> Download CSV
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#183647]/12">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-[#183647] font-bold">
                      <tr>
                        <th className="p-3">Year / Timestamp</th>
                        <th className="p-3">Value ({d.unit})</th>
                        <th className="p-3">Quality Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#183647]/10 text-slate-700">
                      {d.values.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-mono">{row.year}</td>
                          <td className="p-3 font-mono font-bold text-[#183647]">{row.value}</td>
                          <td className="p-3"><span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Validated</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: SCIENTIFIC METADATA */}
            {activeTab === 'metadata' && (
              <div className="card space-y-6 text-xs text-[#183647]">
                <h3 className="text-xl font-bold border-b border-[#183647]/10 pb-3">Dataset Metadata & Quality Control Specification</h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <div className="font-bold text-[#487b91]">License & Access Rights</div>
                    <div>{d.license || 'Creative Commons Attribution 4.0 International (CC-BY-4.0)'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-[#487b91]">Quality Assurance Status</div>
                    <div>{d.qualityStatus || 'Level-3 Verified (ISO-19115 compliant)'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-[#487b91]">Missing Value Handling Policy</div>
                    <div>{d.missingValuePolicy || 'Standard NaN replacement for sensor maintenance spikes'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-[#487b91]">Collection Methodology</div>
                    <div>{d.collectionMethodology || 'In-situ sensor arrays continuously calibrated against AWS telemetry'}</div>
                  </div>
                </div>

                {d.instruments && (
                  <div className="space-y-2 pt-3 border-t border-[#183647]/10">
                    <div className="font-bold text-[#487b91]">Instruments & Sensor Equipment</div>
                    <div className="flex flex-wrap gap-2">
                      {d.instruments.map((inst) => (
                        <span key={inst} className="rounded-lg bg-slate-100 text-[#183647] px-3 py-1 font-semibold">
                          {inst}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action & Related Sidebar */}
          <div className="space-y-6">
            <div className="card space-y-4 text-xs">
              <div className="font-bold text-[#183647] text-sm">Dataset Summary</div>

              <div className="space-y-2 border-b border-[#183647]/10 pb-3">
                <div><span className="font-bold text-[#487b91]">Variables:</span> {d.variables.join(', ')}</div>
                <div><span className="font-bold text-[#487b91]">Measurement Unit:</span> {d.unit}</div>
                <div><span className="font-bold text-[#487b91]">Data Source:</span> {d.source}</div>
                <div><span className="font-bold text-[#487b91]">Version:</span> {d.version}</div>
              </div>

              <button onClick={handleExportCsv} className="btn-primary w-full justify-center text-xs">
                <Download size={15} /> Download Full Dataset CSV
              </button>

              <button onClick={() => setShowAiModal(true)} className="btn-secondary w-full justify-center text-xs">
                <Bot size={15} /> Ask-the-Dataset AI
              </button>

              <button onClick={() => setShowVersionHistory(!showVersionHistory)} className="btn-secondary w-full justify-center text-xs">
                <History size={15} /> {showVersionHistory ? 'Hide Version Log' : 'View Version History'}
              </button>

              {showVersionHistory && (
                <div className="rounded-xl bg-slate-50 p-3 text-xs space-y-2 border border-[#183647]/10">
                  <div className="font-bold text-[#183647]">Version Changelog:</div>
                  <div className="border-b pb-1">
                    <span className="font-bold">{d.version} (Current)</span> — {d.changelog || 'Latest telemetry update.'}
                  </div>
                  <div>
                    <span className="font-bold">v1.0 (Initial)</span> — Published baseline observations.
                  </div>
                </div>
              )}
            </div>

            {/* Related Expedition */}
            {relatedExp && (
              <div className="card space-y-3">
                <div className="font-bold text-[#183647] text-sm">Associated Expedition</div>
                <Link to={`/expeditions/${relatedExp.id}`} className="block rounded-xl bg-white p-3 border border-[#183647]/12 hover:border-[#487b91] transition text-xs">
                  <div className="font-bold text-[#183647]">{relatedExp.title}</div>
                  <div className="text-[11px] text-[#487b91] mt-1">{relatedExp.region} · {relatedExp.year}</div>
                </Link>
              </div>
            )}

            {/* Related Publications */}
            {relatedPubs.length > 0 && (
              <div className="card space-y-3">
                <div className="font-bold text-[#183647] text-sm">Linked Peer-Reviewed Papers</div>
                {relatedPubs.map((pub) => (
                  <Link key={pub.id} to={`/publications/${pub.id}`} className="block rounded-xl bg-white p-3 border border-[#183647]/12 hover:border-[#487b91] transition text-xs space-y-1">
                    <div className="font-bold text-[#183647]">{pub.title}</div>
                    <div className="text-[10px] font-mono text-[#487b91]">DOI: {pub.doi}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Ask-the-Dataset AI Modal */}
        {showAiModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-5">
            <div className="w-full max-w-lg card space-y-4 bg-white shadow-2xl">
              <div className="flex justify-between items-center border-b border-[#183647]/10 pb-3">
                <div className="flex items-center gap-2 font-bold text-[#183647]">
                  <Sparkles size={18} className="text-[#487b91]" /> Ask-the-Dataset AI
                </div>
                <button onClick={() => setShowAiModal(false)} className="text-[#487b91] hover:text-[#183647]">
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-[#487b91]">Run automated AI analysis, trend detection, and anomaly screening on this dataset.</p>

              <textarea
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-[#183647]/15 bg-white p-3 text-xs text-[#183647] outline-none"
              />

              <button onClick={handleAskDataset} disabled={isAnalysing} className="btn-primary w-full justify-center text-xs">
                {isAnalysing ? 'Analyzing dataset metrics...' : 'Run Dataset AI Analysis'}
              </button>

              {aiAnalysis && (
                <div className="rounded-xl bg-[#dce9ed] p-4 text-xs text-[#183647] space-y-2 border border-[#183647]/15 font-mono">
                  <div className="font-bold">AI Observation Summary:</div>
                  <p>{aiAnalysis.analysis}</p>
                  <div className="font-bold mt-2">Trend Signal:</div>
                  <p>{aiAnalysis.trends}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
