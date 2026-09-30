import { useState } from 'react';
import { LearningModule } from '../data/learningContent';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Sparkles,
  ArrowRight,
  FileText,
  User,
  Database,
  Compass,
  Award,
  RotateCcw,
  HelpCircle,
  Layers,
  Activity,
  Sliders,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SaveToShelfButton } from './SignatureActionButtons';
import { recordModuleCompletion } from '../lib/studentLearning';
import { useAuth } from '../lib/auth';

interface InteractiveLearningModuleProps {
  module: LearningModule;
  onBack: () => void;
  onModuleCompleted?: () => void;
}

export function InteractiveLearningModule({ module, onBack, onModuleCompleted }: InteractiveLearningModuleProps) {
  const { profile } = useAuth();
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [showSimplifiedPaper, setShowSimplifiedPaper] = useState(false);
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [checkpointAnswers, setCheckpointAnswers] = useState<Record<string, number>>({});
  const [checkpointSubmitted, setCheckpointSubmitted] = useState<Record<string, boolean>>({});
  const [moduleFinished, setModuleFinished] = useState(false);

  const currentChapter = module.chapters[activeChapterIndex] || module.chapters[0];

  const handleCheckpointSelect = (chkIdx: number, optIdx: number) => {
    const key = `${activeChapterIndex}_${chkIdx}`;
    if (checkpointSubmitted[key]) return;
    setCheckpointAnswers((prev) => ({ ...prev, [key]: optIdx }));
  };

  const handleCheckpointSubmit = (chkIdx: number) => {
    const key = `${activeChapterIndex}_${chkIdx}`;
    setCheckpointSubmitted((prev) => ({ ...prev, [key]: true }));
  };

  const handleNextChapter = () => {
    if (!completedChapters.includes(activeChapterIndex)) {
      setCompletedChapters((prev) => [...prev, activeChapterIndex]);
    }

    if (activeChapterIndex < module.chapters.length - 1) {
      setActiveChapterIndex((prev) => prev + 1);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } else {
      // Finished all chapters
      setModuleFinished(true);
      recordModuleCompletion(profile?.uid, module.id, module.topicId);
      if (onModuleCompleted) onModuleCompleted();
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header Bar */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-[#183647]/15 shadow-sm">
        <button
          onClick={onBack}
          className="btn-secondary text-xs flex items-center gap-1.5"
        >
          ← Back to Modules
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#487b91] flex items-center gap-1">
            <Clock size={14} /> {module.timeToComplete}
          </span>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#183647]/10 text-[#183647]">
            {module.level}
          </span>
          <SaveToShelfButton
            item={{
              id: module.id,
              type: 'lesson',
              title: module.title,
              subtitle: `${module.category} · ${module.level}`,
            }}
          />
        </div>
      </div>

      {/* Module Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-[#183647]/15 shadow-lg bg-[#071D33] text-white p-8 md:p-10 space-y-4">
        <div className="absolute inset-0 opacity-25">
          <img src={module.coverImage} alt={module.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071D33] via-[#071D33]/80 to-transparent" />
        </div>

        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#74D4F5]/20 text-[#74D4F5] text-xs font-bold uppercase tracking-wider">
            <Sparkles size={13} /> {module.kicker}
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">{module.title}</h1>
          <p className="text-sm md:text-base text-slate-300">{module.subtitle}</p>

          {/* Connected Yuki Entities Badge */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Real Research Links:</span>
            {module.relatedResearch.expeditionId && (
              <Link to={`/expeditions/${module.relatedResearch.expeditionId}`} className="badge-item hover:scale-105 transition">
                <Compass size={12} className="text-[#5abed8]" /> Expedition {module.relatedResearch.expeditionId.toUpperCase()}
              </Link>
            )}
            {module.relatedResearch.scientistId && (
              <Link to="/discover" className="badge-item hover:scale-105 transition">
                <User size={12} className="text-[#5abed8]" /> Lead Scientist Profile
              </Link>
            )}
            {module.relatedResearch.datasetId && (
              <Link to={`/datasets/${module.relatedResearch.datasetId}`} className="badge-item hover:scale-105 transition">
                <Database size={12} className="text-[#5abed8]" /> Dataset {module.relatedResearch.datasetId}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Chapter Navigation & Reading Canvas */}
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Left Sidebar: Chapter List */}
        <div className="space-y-6">
          <div className="card space-y-3 bg-white border border-[#183647]/15">
            <h3 className="text-xs font-mono font-bold text-[#487b91] uppercase tracking-wider border-b border-[#183647]/10 pb-2">
              Course Outline ({module.chapters.length} Chapters)
            </h3>
            <div className="space-y-2">
              {module.chapters.map((ch, idx) => {
                const isActive = idx === activeChapterIndex;
                const isDone = completedChapters.includes(idx);
                return (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChapterIndex(idx)}
                    className={`w-full text-left p-3 rounded-xl transition flex items-start gap-3 ${
                      isActive
                        ? 'bg-[#183647] text-white shadow-md'
                        : isDone
                        ? 'bg-emerald-50 text-[#183647] border border-emerald-200'
                        : 'bg-slate-50 text-[#183647] hover:bg-slate-100'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isDone ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : (
                        <span className={`text-xs font-mono font-bold ${isActive ? 'text-[#74D4F5]' : 'text-[#487b91]'}`}>
                          0{idx + 1}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold line-clamp-1">{ch.title.split(':')[1] || ch.title}</div>
                      <div className={`text-[10px] ${isActive ? 'text-slate-300' : 'text-[#487b91]'}`}>{ch.readTime}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Animated Process Highlight Box */}
          <div className="card bg-gradient-to-br from-[#183647] to-[#0d212d] text-white space-y-3">
            <div className="flex items-center gap-2 text-[#74D4F5] text-xs font-bold">
              <Activity size={15} /> Process Focus
            </div>
            <h4 className="text-sm font-bold">{module.animatedProcess.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{module.animatedProcess.description}</p>
          </div>
        </div>

        {/* Right Canvas: Chapter Content & Interactive Features */}
        <div className="space-y-8">
          {/* Chapter Content Card */}
          <div className="card space-y-6 bg-white border border-[#183647]/15">
            <div>
              <span className="text-xs font-mono font-bold text-[#487b91] uppercase">
                Chapter {activeChapterIndex + 1} of {module.chapters.length}
              </span>
              <h2 className="text-2xl font-bold text-[#183647] mt-1">{currentChapter.title}</h2>
              <p className="text-xs text-[#487b91] font-semibold">{currentChapter.subtitle}</p>
            </div>

            {/* Main Text Content */}
            <div className="prose prose-slate max-w-none text-xs leading-relaxed space-y-3 text-slate-800">
              {currentChapter.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="bg-slate-50/60 p-4 rounded-xl border border-[#183647]/10">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Key Concepts Callout */}
            {currentChapter.keyConcepts && currentChapter.keyConcepts.length > 0 && (
              <div className="rounded-2xl bg-[#487b91]/10 p-5 border border-[#487b91]/20 space-y-2">
                <h4 className="text-xs font-bold text-[#183647] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={14} className="text-[#487b91]" /> Key Concepts to Remember
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {currentChapter.keyConcepts.map((kc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#183647] font-bold">•</span>
                      <span>{kc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Interactive Process Flow Simulation Widget */}
            <div className="rounded-2xl bg-slate-900 text-white p-6 space-y-4 shadow-inner">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h4 className="text-xs font-bold text-[#74D4F5] uppercase tracking-wider flex items-center gap-2">
                  <Sliders size={15} /> Animated Process: {module.animatedProcess.title}
                </h4>
                <span className="text-[10px] font-mono text-slate-400">Step-by-Step Visualization</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                {module.animatedProcess.steps.map((st) => (
                  <div
                    key={st.step}
                    className="rounded-xl bg-white/5 p-4 border border-white/10 hover:border-[#74D4F5] transition space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="h-6 w-6 rounded-full bg-[#74D4F5] text-slate-950 font-black text-xs flex items-center justify-center">
                        {st.step}
                      </span>
                      <span className="text-[10px] font-mono text-[#74D4F5] bg-[#74D4F5]/10 px-2 py-0.5 rounded-md">
                        {st.visualTag}
                      </span>
                    </div>
                    <h5 className="font-bold text-xs text-white">{st.label}</h5>
                    <p className="text-[11px] text-slate-300 leading-normal">{st.details}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Knowledge Checkpoint */}
            {currentChapter.checkpoints && currentChapter.checkpoints.length > 0 && (
              <div className="card bg-slate-50 border border-[#183647]/15 space-y-4">
                <h4 className="text-sm font-bold text-[#183647] flex items-center gap-2">
                  <HelpCircle size={16} className="text-[#487b91]" /> Chapter Knowledge Checkpoint
                </h4>

                {currentChapter.checkpoints.map((chk, chkIdx) => {
                  const key = `${activeChapterIndex}_${chkIdx}`;
                  const selected = checkpointAnswers[key];
                  const isSubmitted = checkpointSubmitted[key];
                  const isCorrect = selected === chk.answerIndex;

                  return (
                    <div key={chkIdx} className="space-y-3 border-t border-[#183647]/10 pt-3 text-xs">
                      <p className="font-semibold text-[#183647]">{chk.question}</p>

                      <div className="space-y-2">
                        {chk.options.map((opt, optIdx) => {
                          let style = 'bg-white text-slate-700 border-[#183647]/20 hover:bg-slate-100';
                          if (selected === optIdx) {
                            style = 'bg-[#183647] text-white border-[#183647]';
                          }
                          if (isSubmitted) {
                            if (optIdx === chk.answerIndex) {
                              style = 'bg-emerald-600 text-white border-emerald-600 font-bold';
                            } else if (selected === optIdx) {
                              style = 'bg-red-600 text-white border-red-600';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleCheckpointSelect(chkIdx, optIdx)}
                              className={`w-full text-left p-3 rounded-xl border text-xs transition ${style}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {selected !== undefined && !isSubmitted && (
                        <button
                          onClick={() => handleCheckpointSubmit(chkIdx)}
                          className="btn-primary text-xs mt-2"
                        >
                          Check Answer
                        </button>
                      )}

                      {isSubmitted && (
                        <div
                          className={`p-3 rounded-xl border text-xs space-y-1 ${
                            isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-red-50 border-red-300 text-red-900'
                          }`}
                        >
                          <div className="font-bold">{isCorrect ? '✓ Correct!' : '✕ Incorrect'}</div>
                          <div>{chk.explanation}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Chapter Navigation Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-[#183647]/10">
              <button
                disabled={activeChapterIndex === 0}
                onClick={() => setActiveChapterIndex((prev) => prev - 1)}
                className="btn-secondary text-xs disabled:opacity-40"
              >
                Previous Chapter
              </button>

              <button onClick={handleNextChapter} className="btn-primary text-xs flex items-center gap-1.5">
                {activeChapterIndex < module.chapters.length - 1 ? (
                  <>
                    Next Chapter <ChevronRight size={14} />
                  </>
                ) : (
                  <>
                    Complete Module & Earn +150 XP <Award size={14} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Simplified Research Paper Accordion */}
          <div className="card space-y-4 bg-white border border-[#183647]/15">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#487b91] bg-slate-100 px-2 py-0.5 rounded-full">
                  SIMPLIFIED RESEARCH PAPER
                </span>
                <h3 className="text-base font-bold text-[#183647] mt-1">{module.simplifiedPaper.title}</h3>
              </div>
              <button
                onClick={() => setShowSimplifiedPaper(!showSimplifiedPaper)}
                className="btn-secondary text-xs"
              >
                {showSimplifiedPaper ? 'Hide Paper Summary' : 'Read Simplified Paper'}
              </button>
            </div>

            {showSimplifiedPaper && (
              <div className="space-y-4 pt-4 border-t border-[#183647]/10 text-xs">
                <div className="flex flex-wrap gap-3 text-[#487b91] font-semibold">
                  <span>Journal: {module.simplifiedPaper.publishedJournal} ({module.simplifiedPaper.year})</span>
                  <span>DOI: {module.simplifiedPaper.originalDoi}</span>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 border border-[#183647]/10 space-y-2">
                  <div className="font-bold text-[#183647]">Plain-English Takeaway:</div>
                  <p className="text-slate-700 leading-relaxed">{module.simplifiedPaper.takeawaySummary}</p>
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-[#183647]">Key Scientific Findings:</div>
                  <ul className="space-y-1 text-slate-700">
                    {module.simplifiedPaper.keyFindings.map((kf, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#487b91] font-bold">✓</span>
                        <span>{kf}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl bg-blue-50 p-3 border border-blue-200 text-[#183647]">
                  <span className="font-bold">Simplified Methods: </span>
                  <span>{module.simplifiedPaper.simplifiedMethods}</span>
                </div>
              </div>
            )}
          </div>

          {/* Module Finished Banner */}
          {moduleFinished && (
            <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-8 space-y-4 text-center shadow-xl">
              <div className="h-16 w-16 rounded-full bg-white/20 text-white font-black text-2xl flex items-center justify-center mx-auto">
                <Award size={32} />
              </div>
              <h3 className="text-2xl font-black">Module Complete! +150 XP Earned</h3>
              <p className="text-xs text-emerald-100 max-w-xl mx-auto">
                Congratulations! You’ve mastered "{module.title}". Your progress has been saved to your student learning profile and Polar Shelf.
              </p>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button onClick={onBack} className="bg-white text-emerald-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-md hover:bg-slate-100">
                  Explore Next Topic
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
