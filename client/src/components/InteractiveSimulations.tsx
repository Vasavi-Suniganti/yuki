import { useState } from 'react';
import { Sliders, Activity, Sparkles, RefreshCw, Layers, Wind, Droplets, Sun, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Badge } from './UI';

export function InteractiveSimulations() {
  const [activeLab, setActiveLab] = useState<'iceCore' | 'seaIce' | 'oceanDensity'>('iceCore');

  // --- Ice Core Lab State ---
  const [iceCoreDepth, setIceCoreDepth] = useState(75); // 0 to 120 meters
  const [gasTarget, setGasTarget] = useState<'co2' | 'ch4' | 'o18'>('co2');

  const iceCoreAgeYears = Math.round(iceCoreDepth * 18.5); // ~18.5 years per meter
  const iceCoreCO2 = Math.round(280 + (iceCoreDepth / 120) * 140); // 280 to 420 ppm
  const iceCoreCH4 = Math.round(650 + (iceCoreDepth / 120) * 1150); // 650 to 1800 ppb
  const deltaO18 = (-56 + (iceCoreDepth / 120) * 8.4).toFixed(1); // -56 to -47.6 per mil
  const estimatedTempC = (-28.5 + (iceCoreDepth / 120) * 3.8).toFixed(1);

  // --- Sea Ice Lab State ---
  const [seaIceAirTemp, setSeaIceAirTemp] = useState(-18); // -30 to +5 C
  const [seaIceOceanSalinity, setSeaIceOceanSalinity] = useState(34.5); // 25 to 40 PSU
  const [hasWindTurbulence, setHasWindTurbulence] = useState(true);

  const seaIceFreezingPoint = (-0.054 * seaIceOceanSalinity).toFixed(2);
  const isFreezing = seaIceAirTemp <= parseFloat(seaIceFreezingPoint);
  const iceThicknessMeters = isFreezing
    ? ((Math.abs(seaIceAirTemp - parseFloat(seaIceFreezingPoint)) * 0.14) + (seaIceOceanSalinity * 0.02)).toFixed(2)
    : '0.00';
  const brineExpelledPSU = isFreezing ? (parseFloat(seaIceFreezingPoint) * -1.8 + seaIceOceanSalinity).toFixed(1) : '0.0';

  // --- Ocean Density Lab State ---
  const [oceanTemp, setOceanTemp] = useState(1.5); // 0 to 15 C
  const [oceanSalinity, setOceanSalinity] = useState(35.2); // 30 to 38 PSU
  const [freshMeltwaterInflux, setFreshMeltwaterInflux] = useState(false);

  const effectiveSalinity = freshMeltwaterInflux ? oceanSalinity - 2.5 : oceanSalinity;
  const oceanDensityKg = (1025 + (35 - oceanTemp) * 0.22 + (effectiveSalinity - 35) * 0.82).toFixed(2);
  const isAABWSinking = parseFloat(oceanDensityKg) >= 1027.8;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="card bg-gradient-to-r from-[#183647] to-[#0a2738] text-white p-8 rounded-3xl space-y-3">
        <div className="flex items-center gap-2 text-[#74D4F5] text-xs font-bold uppercase tracking-wider">
          <Sliders size={16} /> Interactive Virtual Polar Laboratories
        </div>
        <h2 className="text-2xl font-bold text-white">Experiment with Thermodynamics, Glaciology & Density</h2>
        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          Adjust temperature, salinity, ice core depth, and atmospheric gas filters to observe real-time scientific feedback in simulated polar environments.
        </p>
      </div>

      {/* Lab Selector Tabs */}
      <div className="flex gap-2 border-b border-[#183647]/15 pb-4">
        {[
          ['iceCore', '1. Ice Core Paleoclimate Lab', Layers],
          ['seaIce', '2. Sea Ice Formation & Brine Lab', Activity],
          ['oceanDensity', '3. Ocean Density & Conveyor Lab', Droplets],
        ].map(([id, label, Icon]: any) => (
          <button
            key={id}
            onClick={() => setActiveLab(id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
              activeLab === id
                ? 'bg-[#183647] text-white shadow-md'
                : 'bg-white/70 text-[#487b91] hover:bg-white hover:text-[#183647]'
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* LAB 1: ICE CORE LAB */}
      {activeLab === 'iceCore' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Left Controls */}
          <div className="card space-y-6 bg-white border border-[#183647]/15">
            <div className="border-b border-[#183647]/10 pb-3">
              <Badge>GLACIOLOGY SIMULATION</Badge>
              <h3 className="text-xl font-bold text-[#183647] mt-1">Antarctic Plateau Ice Core Drill Simulator</h3>
              <p className="text-xs text-[#487b91]">Slide depth to extract trapped atmospheric gas bubbles and paleotemperature proxies.</p>
            </div>

            {/* Depth Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-[#183647]">
                <span>Ice Core Drill Depth:</span>
                <span className="text-lg font-mono text-[#487b91]">{iceCoreDepth} meters</span>
              </div>
              <input
                type="range"
                min="0"
                max="120"
                value={iceCoreDepth}
                onChange={(e) => setIceCoreDepth(Number(e.target.value))}
                className="w-full accent-[#183647] h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Surface (2026 AD)</span>
                <span>60m (Bubble Closure)</span>
                <span>120m (~2,220 BP)</span>
              </div>
            </div>

            {/* Gas Target Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#183647] block">Spectrometer Gas Filter:</label>
              <div className="flex gap-2">
                {[
                  ['co2', 'Carbon Dioxide (CO2)'],
                  ['ch4', 'Methane (CH4)'],
                  ['o18', 'Oxygen Isotope (δ18O)'],
                ].map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setGasTarget(val as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      gasTarget === val ? 'bg-[#183647] text-white' : 'bg-slate-100 text-[#487b91]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Computed Values Readout */}
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="rounded-xl bg-slate-50 p-3 border border-[#183647]/10">
                <div className="text-[#487b91] font-bold">Estimated Layer Age:</div>
                <div className="text-lg font-mono font-black text-[#183647]">{iceCoreAgeYears} Years BP</div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border border-[#183647]/10">
                <div className="text-[#487b91] font-bold">Reconstructed Temp:</div>
                <div className="text-lg font-mono font-black text-[#183647]">{estimatedTempC} °C</div>
              </div>
            </div>
          </div>

          {/* Right Visual Output */}
          <div className="card bg-slate-950 text-white p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-white/10 pb-3">
                <span className="font-mono text-[#74D4F5] uppercase font-bold">Ice Slice Stratigraphy</span>
                <span className="text-slate-400 font-mono">Depth: {iceCoreDepth}m</span>
              </div>

              {/* Animated Core Column Visualizer */}
              <div className="h-44 w-full rounded-2xl bg-gradient-to-b from-blue-100 via-cyan-200 to-indigo-400 p-4 relative overflow-hidden flex flex-col justify-end">
                <div className="absolute inset-0 bg-[radial-gradient(#071D33_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />

                {/* Simulated Air Bubbles */}
                <div className="relative z-10 flex flex-wrap gap-3 items-center justify-center p-4 bg-slate-900/60 rounded-xl backdrop-blur-sm border border-white/20">
                  {Array.from({ length: Math.min(12, Math.floor(iceCoreDepth / 10) + 2) }).map((_, idx) => (
                    <span
                      key={idx}
                      className="h-4 w-4 rounded-full bg-cyan-300/80 animate-pulse border border-white/40 flex items-center justify-center text-[8px] text-slate-900 font-bold shadow-md"
                    >
                      {gasTarget === 'co2' ? 'CO₂' : gasTarget === 'ch4' ? 'CH₄' : '18O'}
                    </span>
                  ))}
                </div>
              </div>

              {/* Climate Interpretation Card */}
              <div className="rounded-xl bg-white/5 p-4 border border-white/10 text-xs space-y-2">
                <div className="font-bold text-[#74D4F5]">Spectrometer Output & Climate Insight:</div>
                {gasTarget === 'co2' && (
                  <p className="text-slate-300 leading-relaxed">
                    Reconstructed atmospheric $CO_2$ concentration at {iceCoreDepth}m depth is <strong className="text-white">{iceCoreCO2} ppm</strong>.
                    {iceCoreDepth > 80 ? ' Pre-industrial baseline level.' : ' Modern industrial increase.'}
                  </p>
                )}
                {gasTarget === 'ch4' && (
                  <p className="text-slate-300 leading-relaxed">
                    Reconstructed atmospheric Methane ($CH_4$) concentration is <strong className="text-white">{iceCoreCH4} ppb</strong>.
                  </p>
                )}
                {gasTarget === 'o18' && (
                  <p className="text-slate-300 leading-relaxed">
                    Oxygen isotope ratio $\\delta^{18}O$ is <strong className="text-white">{deltaO18} ‰</strong>, indicating polar air temperatures around {estimatedTempC}°C.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LAB 2: SEA ICE LAB */}
      {activeLab === 'seaIce' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="card space-y-6 bg-white border border-[#183647]/15">
            <div className="border-b border-[#183647]/10 pb-3">
              <Badge>CRYOSPHERE THERMODYNAMICS</Badge>
              <h3 className="text-xl font-bold text-[#183647] mt-1">Sea Ice Formation & Brine Rejection Lab</h3>
              <p className="text-xs text-[#487b91]">Adjust ambient air temperature and ocean salinity to trigger freezing.</p>
            </div>

            {/* Sliders */}
            <div className="space-y-4 text-xs font-bold text-[#183647]">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Air Temperature:</span>
                  <span className="font-mono text-[#487b91]">{seaIceAirTemp} °C</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="5"
                  value={seaIceAirTemp}
                  onChange={(e) => setSeaIceAirTemp(Number(e.target.value))}
                  className="w-full accent-[#183647] h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Ocean Salinity:</span>
                  <span className="font-mono text-[#487b91]">{seaIceOceanSalinity} PSU</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="40"
                  step="0.5"
                  value={seaIceOceanSalinity}
                  onChange={(e) => setSeaIceOceanSalinity(Number(e.target.value))}
                  className="w-full accent-[#183647] h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="rounded-xl bg-slate-50 p-3 border border-[#183647]/10">
                <div className="text-[#487b91] font-bold">Freezing Point:</div>
                <div className="text-lg font-mono font-black text-[#183647]">{seaIceFreezingPoint} °C</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-[#183647]/10">
                <div className="text-[#487b91] font-bold">Est. Ice Thickness:</div>
                <div className="text-lg font-mono font-black text-[#183647]">{iceThicknessMeters} m</div>
              </div>
            </div>
          </div>

          <div className="card bg-slate-950 text-white p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-white/10 pb-3">
                <span className="font-mono text-[#74D4F5] uppercase font-bold">Thermodynamic Status</span>
                <span className={isFreezing ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {isFreezing ? '✓ FREEZING ACTIVE' : '⚠ NO ICE FORMATION'}
                </span>
              </div>

              <div className="rounded-xl bg-white/5 p-4 border border-white/10 text-xs space-y-2">
                <div className="font-bold text-[#74D4F5]">Brine Rejection & Ocean Impact:</div>
                <p className="text-slate-300 leading-relaxed">
                  {isFreezing
                    ? `Ice crystals reject salt into underlying seawater, expelling dense brine at ${brineExpelledPSU} PSU. This heavy water sinks to drive deep ocean currents.`
                    : `Ambient temperature (${seaIceAirTemp}°C) is above the freezing threshold (${seaIceFreezingPoint}°C). Sea ice cannot form.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LAB 3: OCEAN DENSITY LAB */}
      {activeLab === 'oceanDensity' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="card space-y-6 bg-white border border-[#183647]/15">
            <div className="border-b border-[#183647]/10 pb-3">
              <Badge>PHYSICAL OCEANOGRAPHY</Badge>
              <h3 className="text-xl font-bold text-[#183647] mt-1">Ocean Density & Thermohaline Sinking Lab</h3>
              <p className="text-xs text-[#487b91]">Calculate seawater density ($kg/m^3$) and simulate Antarctic Bottom Water sinking.</p>
            </div>

            <div className="space-y-4 text-xs font-bold text-[#183647]">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Water Temperature:</span>
                  <span className="font-mono text-[#487b91]">{oceanTemp} °C</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={oceanTemp}
                  onChange={(e) => setOceanTemp(Number(e.target.value))}
                  className="w-full accent-[#183647] h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Ocean Salinity:</span>
                  <span className="font-mono text-[#487b91]">{oceanSalinity} PSU</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="38"
                  step="0.2"
                  value={oceanSalinity}
                  onChange={(e) => setOceanSalinity(Number(e.target.value))}
                  className="w-full accent-[#183647] h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="meltwaterCheck"
                  checked={freshMeltwaterInflux}
                  onChange={(e) => setFreshMeltwaterInflux(e.target.checked)}
                  className="h-4 w-4 accent-[#183647] rounded cursor-pointer"
                />
                <label htmlFor="meltwaterCheck" className="text-xs font-bold text-[#183647] cursor-pointer">
                  Simulate Fresh Glacial Meltwater Influx (-2.5 PSU)
                </label>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-[#183647]/10 text-xs">
              <div className="text-[#487b91] font-bold">Calculated Water Density:</div>
              <div className="text-2xl font-mono font-black text-[#183647]">{oceanDensityKg} kg/m³</div>
            </div>
          </div>

          <div className="card bg-slate-950 text-white p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-white/10 pb-3">
                <span className="font-mono text-[#74D4F5] uppercase font-bold">Abyssal Circulation Status</span>
                <span className={isAABWSinking ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {isAABWSinking ? '✓ AABW SINKING ACTIVE' : '⚠ SURFACE STRATIFIED'}
                </span>
              </div>

              <div className="rounded-xl bg-white/5 p-4 border border-white/10 text-xs space-y-2">
                <div className="font-bold text-[#74D4F5]">Circulation Teleconnection Analysis:</div>
                <p className="text-slate-300 leading-relaxed">
                  {isAABWSinking
                    ? `Water density (${oceanDensityKg} kg/m³) exceeds the abyssal threshold (1027.8 kg/m³). This super-dense water plunges down Antarctic continental slopes, powering global thermohaline circulation.`
                    : `Water density (${oceanDensityKg} kg/m³) is too light to sink. Meltwater influx stratifies the surface ocean, slowing global deep ocean ventilation.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
