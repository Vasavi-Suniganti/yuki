import { useState, useEffect } from 'react';
import { PageHero, Badge, SectionTitle } from '../components/UI';
import {
  CloudOff,
  Smartphone,
  QrCode,
  Wrench,
  Gauge,
  ScanLine,
  FileSearch,
  Users,
  BookMarked,
  Megaphone,
  CalendarDays,
  Bell,
  Mic,
  Languages,
  KeyRound,
  Radio,
  MapPinned,
  ShieldCheck,
  Activity,
  SlidersHorizontal,
  CheckCircle2,
  Sparkles,
  Camera,
  Copy,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { api } from '../lib/api';

export default function PlatformLab() {
  const [activeModule, setActiveModule] = useState<string>('Offline Field Mode');

  // Field Scientist State
  const [fieldNotes, setFieldNotes] = useState('Observed fast-ice fracture line near Prydz Bay');
  const [fieldGps, setFieldGps] = useState<[number, number]>([-69.41, 76.19]);
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // QR Generator State
  const [sampleId, setSampleId] = useState('SMP-2026-ANT-089');
  const [qrGeneratedUrl, setQrGeneratedUrl] = useState('');

  // API Key State
  const [apiKeyLabel, setApiKeyLabel] = useState('Research Partner Key');
  const [createdKey, setCreatedKey] = useState('');
  const [keysList, setKeysList] = useState<any[]>([
    { id: 'key-1', label: 'NCPOR Portal Key', prefix: 'pol_live_9a', count: 1420, active: true },
  ]);

  // Instrument Registry State
  const [instruments, setInstruments] = useState([
    { id: 'inst-1', name: 'Automatic Weather Station (AWS)', model: 'Vaisala WXT530', serial: 'AWS-2025-99', status: 'active' },
    { id: 'inst-2', name: 'Ice Core Drill Rig', model: 'Hans Tausen 4-inch', serial: 'DRL-8812', status: 'maintenance' },
  ]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function handleAddOfflineItem() {
    const item = {
      id: `field-${Date.now()}`,
      notes: fieldNotes,
      gps: fieldGps,
      timestamp: new Date().toLocaleTimeString(),
      status: 'pending',
    };
    setOfflineQueue((prev) => [...prev, item]);
  }

  function handleSyncOfflineQueue() {
    setOfflineQueue((prev) => prev.map((x) => ({ ...x, status: 'synced' })));
  }

  function handleGenerateQr() {
    setQrGeneratedUrl(`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(sampleId)}`);
  }

  function handleCreateApiKey() {
    const newRawKey = `pol_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setCreatedKey(newRawKey);
    setKeysList((prev) => [
      ...prev,
      {
        id: `key-${Date.now()}`,
        label: apiKeyLabel,
        prefix: newRawKey.substring(0, 12),
        count: 0,
        active: true,
      },
    ]);
  }

  return (
    <>
      <PageHero
        kicker="Advanced Platform Operations"
        title="Field operations, governance, open API, and offline sync."
        body="Access field scientist logging tools, IndexedDB offline sync queues, QR sample tracking, instrument registries, data provenance graphs, and API key management."
      />

      <section className="section space-y-8">
        {/* Module Switcher Buttons */}
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[
            ['Offline Field Mode', CloudOff],
            ['QR Sample Tracking', QrCode],
            ['Instrument Registry', Wrench],
            ['Data Provenance Graph', Activity],
            ['API Key Management', KeyRound],
            ['Open Data API Docs', Radio],
          ].map(([label, Icon]: any) => (
            <button
              key={label}
              onClick={() => setActiveModule(label)}
              className={`card flex items-center gap-3 p-4 text-left transition ${
                activeModule === label ? 'border-[#487b91] bg-white shadow-md' : 'hover:bg-white/80'
              }`}
            >
              <Icon size={20} className="text-[#487b91]" />
              <span className="font-bold text-xs text-[#183647]">{label}</span>
            </button>
          ))}
        </div>

        {/* MODULE 1: OFFLINE FIELD MODE */}
        {activeModule === 'Offline Field Mode' && (
          <div className="card space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <Badge>Network Status: {isOnline ? 'ONLINE' : 'OFFLINE (IndexedDB Active)'}</Badge>
                <h3 className="mt-2 text-xl font-bold text-[#183647]">Field Scientist Mobile Capture & Offline Queue</h3>
              </div>
              <button onClick={handleSyncOfflineQueue} disabled={offlineQueue.length === 0} className="btn-primary text-xs">
                <RefreshCw size={14} /> Sync Pending Queue ({offlineQueue.filter((x) => x.status === 'pending').length})
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-[#487b91]">Field Scientist Observations Note</label>
                <textarea
                  value={fieldNotes}
                  onChange={(e) => setFieldNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-[#183647]/15 bg-white p-3 text-xs outline-none"
                />
                <button onClick={handleAddOfflineItem} className="btn-secondary text-xs w-full justify-center">
                  <Plus size={14} /> Queue Offline Observation
                </button>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-[#183647]">IndexedDB Pending Sync Queue:</div>
                {offlineQueue.length === 0 ? (
                  <p className="text-slate-400">No pending offline items queued.</p>
                ) : (
                  offlineQueue.map((item) => (
                    <div key={item.id} className="rounded-lg bg-white p-2.5 border border-slate-200 flex justify-between items-center">
                      <div>
                        <span className="font-bold">{item.notes}</span>
                        <p className="text-[10px] text-slate-400">GPS: {item.gps.join(', ')} · {item.timestamp}</p>
                      </div>
                      <Badge>{item.status}</Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODULE 2: QR SAMPLE TRACKING */}
        {activeModule === 'QR Sample Tracking' && (
          <div className="card space-y-6">
            <h3 className="text-xl font-bold text-[#183647]">QR Sample Tracking & Resolving Engine</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-[#487b91]">Sample Identification Code</label>
                <input
                  value={sampleId}
                  onChange={(e) => setSampleId(e.target.value)}
                  className="w-full rounded-xl border border-[#183647]/15 bg-white p-3 text-xs outline-none"
                />
                <button onClick={handleGenerateQr} className="btn-primary text-xs w-full justify-center">
                  <QrCode size={15} /> Generate Unique Sample QR Code
                </button>
              </div>

              {qrGeneratedUrl && (
                <div className="text-center card space-y-2 bg-white">
                  <img src={qrGeneratedUrl} alt="Sample QR Code" className="mx-auto h-40 w-40 rounded-xl" />
                  <div className="font-mono text-xs font-bold text-[#183647]">{sampleId}</div>
                  <p className="text-[10px] text-[#487b91]">Resolves to /samples/{sampleId} when scanned via camera</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODULE 3: INSTRUMENT REGISTRY */}
        {activeModule === 'Instrument Registry' && (
          <div className="card space-y-4">
            <h3 className="text-xl font-bold text-[#183647]">Scientific Instrument Registry</h3>
            <div className="space-y-2 text-xs">
              {instruments.map((inst) => (
                <div key={inst.id} className="rounded-xl bg-white p-4 border border-[#183647]/10 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-[#183647]">{inst.name}</div>
                    <div className="text-[#487b91]">Model: {inst.model} · Serial: {inst.serial}</div>
                  </div>
                  <Badge>{inst.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 4: DATA PROVENANCE GRAPH */}
        {activeModule === 'Data Provenance Graph' && (
          <div className="card space-y-4">
            <h3 className="text-xl font-bold text-[#183647]">Data Lineage & Provenance Flow</h3>
            <div className="grid gap-3 md:grid-cols-6">
              {['Instrument Log', 'Field Observation', 'Raw Telemetry', 'Processed Dataset', 'Publication DOI', 'Outreach Story'].map(
                (node, i) => (
                  <div key={node} className="card text-center bg-white">
                    <div className="text-xs font-mono text-[#487b91]">Step 0{i + 1}</div>
                    <div className="mt-2 font-bold text-xs text-[#183647]">{node}</div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* MODULE 5: API KEY MANAGEMENT */}
        {activeModule === 'API Key Management' && (
          <div className="card space-y-6">
            <h3 className="text-xl font-bold text-[#183647]">Researcher API Key Management</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-[#487b91]">API Key Label</label>
                <input
                  value={apiKeyLabel}
                  onChange={(e) => setApiKeyLabel(e.target.value)}
                  className="w-full rounded-xl border border-[#183647]/15 bg-white p-3 text-xs outline-none"
                />
                <button onClick={handleCreateApiKey} className="btn-primary text-xs w-full justify-center">
                  <KeyRound size={15} /> Create Scoped API Key
                </button>
              </div>

              {createdKey && (
                <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200 text-xs text-emerald-900 space-y-2">
                  <div className="font-bold flex items-center gap-1">
                    <CheckCircle2 size={15} /> API Key Generated (Copy Once):
                  </div>
                  <div className="font-mono bg-white p-2 rounded border border-emerald-300 select-all font-bold">{createdKey}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODULE 6: OPEN DATA API DOCS */}
        {activeModule === 'Open Data API Docs' && (
          <div className="card space-y-4">
            <h3 className="text-xl font-bold text-[#183647]">Yuki Open Data API v1 Reference</h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="rounded-xl bg-white p-3 border border-[#183647]/10">
                <span className="font-bold text-emerald-700">GET</span> /api/v1/expeditions?page=1&limit=10&region=Antarctica
              </div>
              <div className="rounded-xl bg-white p-3 border border-[#183647]/10">
                <span className="font-bold text-emerald-700">GET</span> /api/v1/datasets?category=Climate
              </div>
              <div className="rounded-xl bg-white p-3 border border-[#183647]/10">
                <span className="font-bold text-emerald-700">GET</span> /api/v1/publications
              </div>
              <div className="rounded-xl bg-white p-3 border border-[#183647]/10">
                <span className="font-bold text-emerald-700">GET</span> /api/v1/stations
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
