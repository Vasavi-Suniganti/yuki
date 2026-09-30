import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHero, Badge, SectionTitle } from '../components/UI';
import { researchers, expeditions, publications, datasets, media } from '../data/demo';
import { User, BookOpen, Globe2, Compass, ArrowRight, ShieldCheck, CheckCircle2, CloudRain, Sun, Waves, Sparkles, Clock, MapPin } from 'lucide-react';
import { SaveToShelfButton, AddToWorkspaceButton, RemixStoryButton } from '../components/SignatureActionButtons';

export default function Discover() {
  const [activeTab, setActiveTab] = useState<'scientists' | 'stories' | 'india'>('scientists');
  const [selectedStory, setSelectedStory] = useState<any>(null);

  const stories = [
    {
      id: 'story-1',
      title: 'A Day in Antarctica: Life at Bharati Research Station',
      expedition: '45th Indian Antarctic Expedition',
      author: 'Dr. N. Das',
      region: 'Larsemann Hills, East Antarctica',
      cover: 'https://images.unsplash.com/photo-1508873696983-2df515122519?w=1200&auto=format&fit=crop&q=80',
      summary: 'Follow marine ecologist Dr. N. Das through a typical 24-hour summer field day at Bharati Station collecting phytoplankton and fast ice samples.',
      timeline: [
        { time: '05:30 AM', activity: 'Morning Met Check', desc: 'Check automated weather station telemetry and wind speed before clearing field safety protocols.' },
        { time: '07:00 AM', activity: 'Field Equipment Transport', desc: 'Load snowmobiles with ice augers, CTD sensors, and insulated sample containers.' },
        { time: '09:00 AM', activity: 'Fast Ice Core Sampling', desc: 'Drill 1.6-meter sea ice cores at Prydz Bay waypoint 3 and log water column salinity.' },
        { time: '12:30 PM', activity: 'Field Station Lunch & Protocol Check', desc: 'Return to Bharati shelter for warm soup and calibrate radio equipment.' },
        { time: '02:00 PM', activity: 'Plankton Net Casts', desc: 'Lower bongo nets off the ice edge to capture coastal Antarctic krill and copepods.' },
        { time: '06:00 PM', activity: 'Laboratory Infiltration & Sequencing', desc: 'Process water samples under fluorescence microscopes at Bharati cleanroom lab.' },
        { time: '08:30 PM', activity: 'Evening Team Debrief', desc: 'Log data into Yuki database and communicate status with NCPOR headquarters.' },
      ],
    },
    {
      id: 'story-2',
      title: 'Drilling 120 Meters into Antarctic Climate History',
      expedition: '46th Indian Antarctic Expedition',
      author: 'Dr. Kavya Rao',
      region: 'Princess Elizabeth Land, East Antarctica',
      cover: 'https://images.unsplash.com/photo-1517783999520-f068d7431a60?w=1200&auto=format&fit=crop&q=80',
      summary: 'An insider look into deep ice core drilling on the inland ice sheet plateau, uncovering past atmosphere layers trapped over thousands of years.',
      timeline: [
        { time: '06:00 AM', activity: 'Drill Rig Pre-Heat', desc: 'Warm up electromechanical core drill motors in -28°C ambient plateau conditions.' },
        { time: '08:30 AM', activity: 'Core Extraction', desc: 'Pull 1-meter ice core barrel from 120-meter depth containing ancient air bubbles.' },
        { time: '11:00 AM', activity: 'Stratigraphy Logging', desc: 'Photograph core density transitions and inspect melt-refreeze layers under polarized light.' },
        { time: '03:00 PM', activity: 'Isotope Sample Sectioning', desc: 'Slice core samples at 5-cm intervals for CAVS oxygen isotope mass spectrometry.' },
      ],
    },
    {
      id: 'story-3',
      title: 'Monitoring Himalayan Glaciers at 4,500 Meters: Himansh Base',
      expedition: 'Himansh Himalayan Expedition 2026',
      author: 'Dr. A. Kumar',
      region: 'Chandra-Bhaga Basin, Lahaul-Spiti',
      cover: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
      summary: 'High-altitude mountaineering meets glaciology as researchers measure Siti Glacier retreat rates and river discharge.',
      timeline: [
        { time: '05:00 AM', activity: 'High-Altitude Acclimatization Check', desc: 'Measure blood oxygen levels before ascending steep moraine paths to Siti Glacier tongue.' },
        { time: '08:00 AM', activity: 'Ablation Stake Survey', desc: 'Measure ice surface loss against 18 RTK-GPS tracked bamboo stakes inserted into glacier ice.' },
        { time: '01:00 PM', activity: 'River Discharge Profiling', desc: 'Deploy Doppler ADCP sensor across turbulent glacial meltwater stream.' },
      ],
    },
  ];

  return (
    <>
      <PageHero
        kicker="Discover Polar Science"
        title="Meet scientists, read expedition stories, and explore why polar regions matter to India."
        body="Bridge the gap between raw scientific research and human discovery. Connect with Indian polar researchers, explore field narratives, and understand teleconnections to global monsoons."
      />

      <section className="section space-y-8">
        {/* Module Tabs */}
        <div className="flex gap-2 border-b border-[#183647]/15 pb-4">
          {[
            ['scientists', 'Meet the Scientists', User],
            ['stories', 'Polar Field Stories', BookOpen],
            ['india', 'Why Polar Science Matters to India', Globe2],
          ].map(([tab, label, Icon]: any) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold ${
                activeTab === tab ? 'bg-[#183647] text-white shadow-md' : 'bg-white/60 text-[#487b91] hover:bg-white hover:text-[#183647]'
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* TAB 1: MEET THE SCIENTISTS */}
        {activeTab === 'scientists' && (
          <div className="space-y-6">
            <SectionTitle kicker="Pioneers of Indian Polar Research" title="Explore Researcher Profiles & Publications" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {researchers.map((res) => {
                const resExp = expeditions.filter((e) => res.expeditions.includes(e.id));
                const resPubs = publications.filter((p) => res.publications.includes(p.id));
                const resDs = datasets.filter((d) => res.datasets.includes(d.id));

                return (
                  <div key={res.id} className="card space-y-4 hover:border-[#487b91] transition flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <img src={res.avatar} alt={res.name} className="h-14 w-14 rounded-2xl object-cover border border-[#183647]/15 shadow-sm" />
                        <div>
                          <Badge>{res.region}</Badge>
                          <h3 className="text-lg font-bold text-[#183647] mt-1">{res.name}</h3>
                          <div className="text-xs text-[#487b91] font-semibold">{res.role}</div>
                        </div>
                      </div>

                      <div className="text-xs text-[#487b91] font-mono">{res.institution}</div>
                      <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">{res.bio}</p>

                      <div className="space-y-1.5 pt-2 border-t border-[#183647]/10 text-xs">
                        <div className="font-bold text-[#183647]">Specialization:</div>
                        <div className="text-[#487b91]">{res.specialization}</div>
                      </div>

                      {res.interests && (
                        <div className="flex flex-wrap gap-1 text-[11px] pt-1">
                          {res.interests.map((tag) => (
                            <span key={tag} className="rounded-md bg-slate-100 text-[#183647] px-2 py-0.5 font-medium">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#183647]/10 flex flex-wrap justify-between items-center gap-2 text-xs font-semibold text-[#183647]">
                      <span>{resPubs.length} Papers · {resDs.length} Datasets</span>
                      <div className="flex items-center gap-1.5">
                        <SaveToShelfButton item={{ id: res.id, type: 'scientist', title: res.name, subtitle: `${res.role} · ${res.institution}` }} compact />
                        <AddToWorkspaceButton item={{ id: res.id, type: 'researcher', title: res.name, subtitle: `${res.role} · ${res.institution}`, category: res.specialization, region: res.region }} compact />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: POLAR STORIES */}
        {activeTab === 'stories' && (
          <div className="space-y-6">
            <SectionTitle kicker="Human Side of Science" title="Field Logbooks & Expedition Narratives" />

            <div className="grid gap-6 md:grid-cols-3">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="card group hover:border-[#487b91] transition space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-4 cursor-pointer" onClick={() => setSelectedStory(story)}>
                    <div className="h-44 rounded-2xl overflow-hidden relative">
                      <img src={story.cover} alt={story.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071D33] via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <Badge>{story.expedition}</Badge>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-[#183647] group-hover:text-[#487b91] transition">{story.title}</h3>
                    <p className="text-xs text-[#487b91] line-clamp-2">{story.summary}</p>
                  </div>

                  <div className="flex flex-wrap justify-between items-center gap-2 text-xs text-[#183647] font-semibold pt-2 border-t border-[#183647]/10">
                    <span>By {story.author}</span>
                    <div className="flex items-center gap-1.5">
                      <SaveToShelfButton item={{ id: story.id, type: 'story', title: story.title, subtitle: `By ${story.author} · ${story.expedition}` }} compact />
                      <RemixStoryButton item={{ id: story.id, type: 'report', title: story.title, authorOrDoi: story.author }} compact />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Story Modal / Inspector */}
            {selectedStory && (
              <div className="card space-y-6 border-[#487b91] mt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge>{selectedStory.expedition}</Badge>
                    <h2 className="mt-2 text-2xl font-bold text-[#183647]">{selectedStory.title}</h2>
                    <p className="text-xs text-[#487b91] mt-1">Author: {selectedStory.author} · Location: {selectedStory.region}</p>
                  </div>
                  <button onClick={() => setSelectedStory(null)} className="btn-secondary text-xs">
                    Close Story
                  </button>
                </div>

                <div className="rounded-2xl overflow-hidden max-h-[350px]">
                  <img src={selectedStory.cover} alt={selectedStory.title} className="w-full object-cover" />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#183647] flex items-center gap-2">
                    <Clock size={18} className="text-[#487b91]" /> Daily Timeline & Field Operations
                  </h3>

                  <div className="space-y-3">
                    {selectedStory.timeline.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-4 rounded-xl bg-slate-50 p-4 border border-[#183647]/10">
                        <div className="font-mono text-xs font-bold text-[#487b91] whitespace-nowrap">{item.time}</div>
                        <div>
                          <h4 className="font-bold text-[#183647] text-xs">{item.activity}</h4>
                          <p className="text-xs text-slate-700 mt-1">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WHY POLAR SCIENCE MATTERS TO INDIA */}
        {activeTab === 'india' && (
          <div className="card space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <Badge>GLOBAL TELECONNECTIONS</Badge>
              <h2 className="text-3xl font-black text-[#183647]">Why Polar Science Matters to India</h2>
              <p className="text-xs text-[#487b91]">
                Events in Antarctica, the Arctic, and the Southern Ocean directly impact India’s climate, Indian Ocean sea levels, and the Indian Summer Monsoon.
              </p>
            </div>

            {/* Infographic Visual Flow */}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5 text-center">
              {[
                { step: '01', title: 'POLAR REGIONS', desc: 'Antarctica & Arctic Ice Sheets hold 70% of Earth’s freshwater.', icon: Globe2 },
                { step: '02', title: 'ICE + OCEANS', desc: 'Melting glaciers change ocean salinity & density gradients.', icon: Waves },
                { step: '03', title: 'GLOBAL CLIMATE', desc: 'Drives jet streams and global thermohaline circulation.', icon: Sun },
                { step: '04', title: 'WEATHER TELECONNECTIONS', desc: 'Alters Indian Ocean Dipole and summer monsoon rainfall predictability.', icon: CloudRain },
                { step: '05', title: 'IMPACT ON INDIA', desc: 'Affects 1.4 billion people through agriculture, coastal safety, & water security.', icon: CheckCircle2 },
              ].map((item) => (
                <div key={item.step} className="rounded-2xl bg-white p-5 border border-[#183647]/15 space-y-3 shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold text-[#487b91] bg-slate-100 px-2.5 py-1 rounded-full">{item.step}</span>
                    <item.icon size={28} className="mx-auto text-[#183647] mt-2" />
                    <h3 className="font-bold text-[#183647] text-xs mt-2">{item.title}</h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Key Teleconnection Areas */}
            <div className="grid gap-6 md:grid-cols-3 pt-4 border-t border-[#183647]/10">
              <div className="rounded-2xl bg-slate-50 p-5 space-y-2 text-xs border border-[#183647]/10">
                <h4 className="font-bold text-[#183647] text-sm">Monsoon Teleconnections</h4>
                <p className="text-slate-700">
                  Variations in Southern Ocean sea-ice extent alter atmospheric pressure cells in the Southern Hemisphere, influencing the onset date and intensity of the Indian Summer Monsoon.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 space-y-2 text-xs border border-[#183647]/10">
                <h4 className="font-bold text-[#183647] text-sm">Coastal Sea-Level Rise</h4>
                <p className="text-slate-700">
                  Melting of the Antarctic Ice Sheet contributes to global sea-level rise, directly impacting India’s 7,500 km coastline and major coastal cities like Mumbai, Chennai, and Kolkata.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 space-y-2 text-xs border border-[#183647]/10">
                <h4 className="font-bold text-[#183647] text-sm">The Third Pole (Himalayas)</h4>
                <p className="text-slate-700">
                  Himalayan glaciers act as the water tower of Asia. Studies at Himansh Base provide essential insights into glacier meltwater discharge feeding the Indus, Ganges, and Brahmaputra rivers.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
