import { useState, useEffect } from 'react';
import { PageHero, Badge, SectionTitle } from '../components/UI';
import {
  BookOpen,
  GraduationCap,
  Award,
  ChevronRight,
  CheckCircle2,
  Search,
  Clock,
  Database,
  Sliders,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Flame,
  Zap,
  Download,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SaveToShelfButton } from '../components/SignatureActionButtons';
import { learningModules, learningTopics, LearningModule } from '../data/learningContent';
import { InteractiveLearningModule } from '../components/InteractiveLearningModule';
import { InteractiveSimulations } from '../components/InteractiveSimulations';
import { StudentDataExplorer } from '../components/StudentDataExplorer';
import { AdvancedQuizEngine } from '../components/AdvancedQuizEngine';
import { getStudentProgress, subscribeStudentProgress, UserProgress } from '../lib/studentLearning';
import { useAuth } from '../lib/auth';

export function VirtualExpedition() {
  return <Education />;
}

export function Education() {
  const { profile } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'modules' | 'simulations' | 'explorer' | 'quiz' | 'progress' | 'glossary'>('modules');
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');

  const [studentProgress, setStudentProgress] = useState<UserProgress>(() => getStudentProgress(profile?.uid));

  useEffect(() => {
    const sync = () => setStudentProgress(getStudentProgress(profile?.uid));
    sync();
    return subscribeStudentProgress(sync);
  }, [profile?.uid]);

  // Glossary State
  const [glossaryQuery, setGlossaryQuery] = useState('');
  const glossaryTerms = [
    { term: 'Albedo Effect', def: 'The fraction of solar radiation reflected by snow and ice back into space.' },
    { term: 'Active-Layer', def: 'The top layer of ground in permafrost regions that thaws during summer and freezes in winter.' },
    { term: 'Antarctic Bottom Water (AABW)', def: 'Cold, dense seawater formed around Antarctica that sinks to ocean abyssal basins worldwide.' },
    { term: 'Brine Rejection', def: 'The process where freezing sea ice expels concentrated salt into underlying ocean water.' },
    { term: 'Cryosphere', def: 'The frozen water part of the Earth system, including sea ice, glaciers, ice sheets, and permafrost.' },
    { term: 'Fast-Ice', def: 'Sea ice attached to coastlines, islands, or ice shelves.' },
    { term: 'Firn', def: 'Snow that has survived at least one summer season and is in the process of compacting into glacial ice.' },
    { term: 'Ice Core', def: 'A cylinder of ice removed from an ice sheet or glacier to reconstruct past climate atmospheric history.' },
    { term: 'Polynya', def: 'An area of open water surrounded by sea ice, often created by offshore katabatic winds.' },
    { term: 'Southern Annular Mode (SAM)', def: 'A climate driver describing the north-south movement of the westerly wind belt circling Antarctica.' },
    { term: 'Thermohaline Circulation', def: 'Global ocean conveyor belt circulation driven by temperature (thermo) and salinity (haline) density gradients.' },
  ];

  const filteredGlossary = glossaryTerms.filter((t) => t.term.toLowerCase().includes(glossaryQuery.toLowerCase()));

  const filteredModules = selectedTopicFilter === 'all'
    ? learningModules
    : learningModules.filter((m) => m.topicId === selectedTopicFilter);

  return (
    <>
      <PageHero
        kicker="Advanced Student & Public Learning Platform"
        title="Discover, Learn, Experiment and Master Polar Science."
        body="Explore multi-chapter interactive modules, experiment in virtual labs, analyze real expedition data, and complete accredited quizzes."
      >
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-bold text-white">
          <span className="flex items-center gap-1 bg-[#74D4F5]/20 text-[#74D4F5] border border-[#74D4F5]/30 px-3 py-1 rounded-full">
            <Zap size={14} /> LEVEL {studentProgress.level} ({studentProgress.xp} XP)
          </span>
          <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full">
            <Flame size={14} /> {studentProgress.streak} DAY STREAK
          </span>
          <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full">
            <CheckCircle2 size={14} /> {studentProgress.completedModules.length} MODULES COMPLETED
          </span>
        </div>
      </PageHero>

      <section className="section space-y-8">
        {/* Navigation Tabs */}
        {!selectedModule && (
          <div className="flex flex-wrap gap-2 border-b border-[#183647]/15 pb-4">
            {[
              ['modules', '1. Learning Modules', BookOpen],
              ['simulations', '2. Interactive Virtual Labs', Sliders],
              ['explorer', '3. Polar Data Explorer', Database],
              ['quiz', '4. Interactive Quiz Engine', Award],
              ['progress', '5. Gamification & Progress', ShieldCheck],
              ['glossary', '6. Polar Glossary', Search],
            ].map(([id, label, Icon]: any) => (
              <button
                key={id}
                onClick={() => setActiveSubTab(id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                  activeSubTab === id ? 'bg-[#183647] text-white shadow-md' : 'bg-white/60 text-[#487b91] hover:bg-white hover:text-[#183647]'
                }`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
        )}

        {/* TAB 1: INTERACTIVE LEARNING MODULES */}
        {activeSubTab === 'modules' && (
          <div>
            {selectedModule ? (
              <InteractiveLearningModule
                module={selectedModule}
                onBack={() => setSelectedModule(null)}
                onModuleCompleted={() => setStudentProgress(getStudentProgress(profile?.uid))}
              />
            ) : (
              <div className="space-y-8">
                {/* Topic Selector Filter */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-white/80 p-4 rounded-2xl border border-[#183647]/15">
                  <span className="text-xs font-bold text-[#183647]">Filter by Topic Area:</span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <button
                      onClick={() => setSelectedTopicFilter('all')}
                      className={`px-3 py-1.5 rounded-full font-semibold transition ${
                        selectedTopicFilter === 'all' ? 'bg-[#183647] text-white' : 'bg-slate-100 text-[#487b91]'
                      }`}
                    >
                      All Topics ({learningModules.length})
                    </button>
                    {learningTopics.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTopicFilter(t.id)}
                        className={`px-3 py-1.5 rounded-full font-semibold transition ${
                          selectedTopicFilter === t.id ? 'bg-[#183647] text-white' : 'bg-slate-100 text-[#487b91]'
                        }`}
                      >
                        {t.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Modules Grid */}
                <div className="grid gap-6 md:grid-cols-3">
                  {filteredModules.map((m) => {
                    const isCompleted = studentProgress.completedModules.includes(m.id);
                    return (
                      <div
                        key={m.id}
                        className="card space-y-4 flex flex-col justify-between group hover:border-[#487b91] transition bg-white border border-[#183647]/15"
                      >
                        <div className="space-y-3 cursor-pointer" onClick={() => setSelectedModule(m)}>
                          <div className="h-40 rounded-2xl overflow-hidden relative">
                            <img src={m.coverImage} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#071D33] via-transparent to-transparent" />
                            <div className="absolute top-3 left-3 right-3 flex justify-between items-center text-white text-xs">
                              <Badge>{m.category}</Badge>
                              {isCompleted && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 text-white font-bold px-2.5 py-0.5 text-[10px] shadow-sm">
                                  <CheckCircle2 size={11} /> COMPLETED
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-xs text-[#487b91]">
                            <span className="font-mono font-bold uppercase">{m.level}</span>
                            <span className="flex items-center gap-1 font-semibold"><Clock size={12} /> {m.timeToComplete}</span>
                          </div>

                          <h3 className="text-lg font-bold text-[#183647] group-hover:text-[#487b91] transition leading-snug">
                            {m.title}
                          </h3>
                          <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">{m.subtitle}</p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-[#183647]/10 text-xs">
                          <SaveToShelfButton
                            item={{
                              id: m.id,
                              type: 'lesson',
                              title: m.title,
                              subtitle: `${m.category} · ${m.level}`,
                            }}
                            compact
                          />
                          <button
                            onClick={() => setSelectedModule(m)}
                            className="btn-primary text-xs flex items-center gap-1 font-bold"
                          >
                            {isCompleted ? 'Review Lesson' : 'Start Lesson'} <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INTERACTIVE SIMULATIONS */}
        {activeSubTab === 'simulations' && <InteractiveSimulations />}

        {/* TAB 3: POLAR DATA EXPLORER */}
        {activeSubTab === 'explorer' && <StudentDataExplorer />}

        {/* TAB 4: ADVANCED QUIZ ENGINE */}
        {activeSubTab === 'quiz' && <AdvancedQuizEngine />}

        {/* TAB 5: GAMIFICATION & PROGRESS DASHBOARD */}
        {activeSubTab === 'progress' && (
          <div className="space-y-8">
            {/* Gamification Stats Overview Cards */}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 text-center">
              <div className="card space-y-1 bg-white border border-[#183647]/15">
                <div className="text-[#487b91] text-xs font-bold uppercase">Learning Level</div>
                <div className="text-3xl font-black text-[#183647]">Level {studentProgress.level}</div>
                <div className="text-[11px] text-[#487b91]">{studentProgress.xp} Total XP</div>
              </div>

              <div className="card space-y-1 bg-white border border-[#183647]/15">
                <div className="text-[#487b91] text-xs font-bold uppercase">Learning Streak</div>
                <div className="text-3xl font-black text-amber-600 flex items-center justify-center gap-1">
                  <Flame size={28} /> {studentProgress.streak} Days
                </div>
                <div className="text-[11px] text-[#487b91]">Active Study Streak</div>
              </div>

              <div className="card space-y-1 bg-white border border-[#183647]/15">
                <div className="text-[#487b91] text-xs font-bold uppercase">Completed Modules</div>
                <div className="text-3xl font-black text-[#183647]">{studentProgress.completedModules.length}</div>
                <div className="text-[11px] text-emerald-700 font-semibold">+150 XP per module</div>
              </div>

              <div className="card space-y-1 bg-white border border-[#183647]/15">
                <div className="text-[#487b91] text-xs font-bold uppercase">Earned Certificates</div>
                <div className="text-3xl font-black text-[#183647]">{studentProgress.certificates.length}</div>
                <div className="text-[11px] text-[#487b91]">Official Topic Credentials</div>
              </div>
            </div>

            {/* Issued Certificates Section */}
            <div className="card space-y-4 bg-white border border-[#183647]/15">
              <h3 className="text-xl font-bold text-[#183647]">Issued Student Certificates</h3>
              {studentProgress.certificates.length === 0 ? (
                <p className="text-xs text-[#487b91]">No certificates issued yet. Complete topic quizzes with 80%+ score to earn official credentials!</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {studentProgress.certificates.map((cert) => (
                    <div key={cert.id} className="rounded-2xl bg-gradient-to-r from-[#183647] to-[#254b61] text-white p-5 space-y-2 border border-[#183647]/20 shadow-md">
                      <div className="flex justify-between items-center text-xs">
                        <Badge>OFFICIAL ACCREDITATION</Badge>
                        <span className="font-mono text-[#74D4F5] font-bold">{cert.scorePercentage}% Score</span>
                      </div>
                      <h4 className="font-bold text-base">{cert.topicTitle}</h4>
                      <div className="text-xs text-slate-300">Code: <span className="font-mono text-white font-bold">{cert.certificateCode}</span> · Issued: {cert.issueDate}</div>
                      <button onClick={() => alert(`Certificate ${cert.certificateCode} generated and ready for PDF download.`)} className="btn-primary text-xs inline-flex items-center gap-1 mt-2">
                        <Download size={13} /> Download Certificate
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: POLAR GLOSSARY */}
        {activeSubTab === 'glossary' && (
          <div className="card space-y-6 bg-white border border-[#183647]/15">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#183647]">Polar Science Glossary</h3>
                <p className="text-xs text-[#487b91]">Essential glaciological, atmospheric, and oceanographic terminology.</p>
              </div>

              <div className="relative min-w-[260px]">
                <input
                  type="text"
                  placeholder="Search terms..."
                  value={glossaryQuery}
                  onChange={(e) => setGlossaryQuery(e.target.value)}
                  className="w-full px-4 py-2 text-xs rounded-full border border-[#183647]/20 outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {filteredGlossary.map((t) => (
                <div key={t.term} className="p-4 rounded-xl bg-slate-50 border border-[#183647]/10 space-y-1 text-xs">
                  <h4 className="font-bold text-[#183647] text-sm">{t.term}</h4>
                  <p className="text-slate-700 leading-relaxed">{t.def}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
