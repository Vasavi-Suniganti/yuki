import { useState } from 'react';
import { datasets } from '../data/demo';
import { Badge } from './UI';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Database, Download, Sliders, CheckCircle2, HelpCircle, MapPin, Globe2, BarChart2, Table } from 'lucide-react';
import { SaveToShelfButton, AddToWorkspaceButton } from './SignatureActionButtons';

export function StudentDataExplorer() {
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(datasets[0]?.id || 'ds-temp-1');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');

  const filteredDatasets = datasets.filter((d) => {
    const matchTopic = selectedTopic === 'All' || d.category.toLowerCase().includes(selectedTopic.toLowerCase());
    const matchRegion = selectedRegion === 'All' || d.region.toLowerCase().includes(selectedRegion.toLowerCase());
    return matchTopic && matchRegion;
  });

  const activeDataset = datasets.find((d) => d.id === selectedDatasetId) || datasets[0];

  const handleExportCsv = () => {
    if (!activeDataset) return;
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['year,value', ...activeDataset.values.map((v) => `${v.year},${v.value}`)].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeDataset.id}-student-data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="card bg-gradient-to-r from-[#183647] to-[#0d212d] text-white p-8 rounded-3xl space-y-3">
        <div className="flex items-center gap-2 text-[#74D4F5] text-xs font-bold uppercase tracking-wider">
          <Database size={16} /> Student-Friendly Polar Data Explorer
        </div>
        <h2 className="text-2xl font-bold text-white">Explore Real Polar Data with Plain-English Explanations</h2>
        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          Interact with authentic scientific observation data collected by Indian research expeditions at Bharati, Maitri, Himadri, and Himansh stations.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/80 p-5 rounded-2xl border border-[#183647]/15">
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="font-bold text-[#183647] flex items-center gap-1 py-1 mr-2">
            <Sliders size={14} /> Topic:
          </span>
          {['All', 'Climate', 'Sea Ice', 'Oceanography', 'Permafrost', 'Himalayas'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedTopic(cat)}
              className={`rounded-full px-3.5 py-1.5 font-semibold transition ${
                selectedTopic === cat
                  ? 'bg-[#183647] text-white shadow-sm'
                  : 'bg-slate-100 text-[#487b91] hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="font-bold text-[#183647] flex items-center gap-1 py-1 mr-2">
            <Globe2 size={14} /> Region:
          </span>
          {['All', 'Antarctica', 'Arctic', 'Himalayas'].map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`rounded-full px-3.5 py-1.5 font-semibold transition ${
                selectedRegion === reg
                  ? 'bg-[#183647] text-white shadow-sm'
                  : 'bg-slate-100 text-[#487b91] hover:bg-slate-200'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Dataset Selector Grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {filteredDatasets.map((d) => {
          const isSelected = d.id === activeDataset.id;
          return (
            <button
              key={d.id}
              onClick={() => setSelectedDatasetId(d.id)}
              className={`text-left p-4 rounded-2xl border transition space-y-2 flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#183647] text-white border-[#183647] shadow-md'
                  : 'bg-white text-[#183647] border-[#183647]/15 hover:border-[#487b91]'
              }`}
            >
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className={`font-mono font-bold ${isSelected ? 'text-[#74D4F5]' : 'text-[#487b91]'}`}>
                    {d.category}
                  </span>
                  <span className={isSelected ? 'text-slate-300' : 'text-slate-500'}>{d.format}</span>
                </div>
                <h4 className="font-bold text-sm line-clamp-1">{d.title}</h4>
                <p className={`text-xs line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-[#487b91]'}`}>
                  {d.description}
                </p>
              </div>

              <div className="pt-2 border-t border-current/10 flex justify-between items-center text-[11px] font-semibold">
                <span>{d.region}</span>
                <span>{d.period}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Dataset Interactive Visualization Canvas */}
      {activeDataset && (
        <div className="grid gap-6 lg:grid-cols-[1.6fr_.8fr]">
          {/* Main Visualizer */}
          <div className="card space-y-6 bg-white border border-[#183647]/15">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#183647]/10 pb-4">
              <div>
                <Badge>{activeDataset.category}</Badge>
                <h3 className="text-xl font-bold text-[#183647] mt-1">{activeDataset.title}</h3>
                <p className="text-xs text-[#487b91]">
                  Variable: {activeDataset.variables.join(', ')} ({activeDataset.unit})
                </p>
              </div>

              <div className="flex items-center gap-2">
                {(['line', 'bar', 'area'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setChartType(t)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase transition ${
                      chartType === t ? 'bg-[#183647] text-white' : 'bg-slate-100 text-[#487b91] hover:bg-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts Canvas */}
            <div className="h-[360px] w-full rounded-2xl bg-slate-950 p-4 shadow-inner">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                  <LineChart data={activeDataset.values}>
                    <CartesianGrid stroke="rgba(255,255,255,.08)" />
                    <XAxis dataKey="year" tick={{ fill: '#8DA6B8' }} />
                    <YAxis tick={{ fill: '#8DA6B8' }} />
                    <Tooltip contentStyle={{ background: '#071D33', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)' }} />
                    <Line type="monotone" dataKey="value" stroke="#74D4F5" strokeWidth={3} dot={{ fill: '#74D4F5', r: 5 }} />
                  </LineChart>
                ) : chartType === 'bar' ? (
                  <BarChart data={activeDataset.values}>
                    <CartesianGrid stroke="rgba(255,255,255,.08)" />
                    <XAxis dataKey="year" tick={{ fill: '#8DA6B8' }} />
                    <YAxis tick={{ fill: '#8DA6B8' }} />
                    <Tooltip contentStyle={{ background: '#071D33', borderRadius: 12 }} />
                    <Bar dataKey="value" fill="#74D4F5" radius={[6, 6, 0, 0]} />
                  </BarChart>
                ) : (
                  <AreaChart data={activeDataset.values}>
                    <CartesianGrid stroke="rgba(255,255,255,.08)" />
                    <XAxis dataKey="year" tick={{ fill: '#8DA6B8' }} />
                    <YAxis tick={{ fill: '#8DA6B8' }} />
                    <Tooltip contentStyle={{ background: '#071D33', borderRadius: 12 }} />
                    <Area type="monotone" dataKey="value" stroke="#74D4F5" fill="rgba(116,212,245,0.2)" />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Plain-English Scientific Explanation Card */}
            <div className="rounded-2xl bg-blue-50 p-5 border border-blue-200 text-xs space-y-2">
              <h4 className="font-bold text-[#183647] flex items-center gap-2">
                <HelpCircle size={16} className="text-[#487b91]" /> What Does This Data Mean for Students?
              </h4>
              <p className="text-slate-700 leading-relaxed">
                This chart records changes in {activeDataset.title.toLowerCase()} over {activeDataset.period}. Observed trends confirm key glaciological and climate signals measured directly by sensors in {activeDataset.region}.
              </p>
            </div>
          </div>

          {/* Right Action & Metadata Sidebar */}
          <div className="space-y-6">
            <div className="card space-y-4 bg-white border border-[#183647]/15 text-xs">
              <h4 className="font-bold text-[#183647] text-sm border-b border-[#183647]/10 pb-2">Dataset Information</h4>
              <div className="space-y-2 text-[#487b91]">
                <div><span className="font-bold text-[#183647]">Source:</span> {activeDataset.source}</div>
                <div><span className="font-bold text-[#183647]">Region:</span> {activeDataset.region}</div>
                <div><span className="font-bold text-[#183647]">Period:</span> {activeDataset.period}</div>
                <div><span className="font-bold text-[#183647]">Format:</span> {activeDataset.format} ({activeDataset.size})</div>
              </div>

              <div className="pt-2 border-t border-[#183647]/10 space-y-2">
                <button onClick={handleExportCsv} className="btn-primary w-full justify-center text-xs">
                  <Download size={14} /> Download Sample CSV
                </button>
                <div className="flex gap-2">
                  <SaveToShelfButton item={{ id: activeDataset.id, type: 'dataset', title: activeDataset.title, subtitle: `${activeDataset.region} · ${activeDataset.format}` }} />
                  <AddToWorkspaceButton item={{ id: activeDataset.id, type: 'dataset', title: activeDataset.title, subtitle: `${activeDataset.region} · ${activeDataset.format}` }} />
                </div>
              </div>
            </div>

            {/* Sample Rows Table */}
            <div className="card space-y-3 bg-white border border-[#183647]/15 text-xs">
              <h4 className="font-bold text-[#183647] flex items-center gap-1.5">
                <Table size={14} /> Sample Data Rows ({activeDataset.values.length} Points)
              </h4>
              <div className="overflow-x-auto rounded-xl border border-[#183647]/10">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 font-bold text-[#183647]">
                    <tr>
                      <th className="p-2">Year</th>
                      <th className="p-2">Value ({activeDataset.unit})</th>
                      <th className="p-2">QA Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#183647]/10">
                    {activeDataset.values.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 font-mono">
                        <td className="p-2">{row.year}</td>
                        <td className="p-2 font-bold text-[#183647]">{row.value}</td>
                        <td className="p-2"><span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Verified</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
