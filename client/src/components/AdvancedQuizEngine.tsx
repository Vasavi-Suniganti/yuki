import { useState } from 'react';
import { questionBank, learningTopics, QuestionBankItem } from '../data/learningContent';
import { recordQuizAttempt, issueCertificate } from '../lib/studentLearning';
import { useAuth } from '../lib/auth';
import { Award, HelpCircle, CheckCircle2, RotateCcw, ChevronRight, Sparkles, AlertCircle, ShieldCheck, Download } from 'lucide-react';
import { Badge } from './UI';

export function AdvancedQuizEngine() {
  const { profile } = useAuth();
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [numQuestions, setNumQuestions] = useState<number>(10);
  const [quizActive, setQuizActive] = useState(false);

  // Active Quiz State
  const [activeQuestions, setActiveQuestions] = useState<QuestionBankItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number[]>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<number, boolean>>({});
  const [showHint, setShowHint] = useState<Record<number, boolean>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [earnedCert, setEarnedCert] = useState<any>(null);

  const startQuiz = () => {
    let pool = questionBank;
    if (selectedTopicId !== 'all') {
      pool = questionBank.filter((q) => q.topicId === selectedTopicId);
    }
    // Shuffle pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(numQuestions, shuffled.length));

    setActiveQuestions(selected);
    setCurrentIdx(0);
    setUserAnswers({});
    setSubmittedQuestions({});
    setShowHint({});
    setQuizFinished(false);
    setEarnedCert(null);
    setQuizActive(true);
  };

  const handleSelectOption = (optIdx: number) => {
    if (submittedQuestions[currentIdx]) return;
    const currentQ = activeQuestions[currentIdx];

    if (currentQ.type === 'multi_select') {
      const prev = userAnswers[currentIdx] || [];
      if (prev.includes(optIdx)) {
        setUserAnswers({ ...userAnswers, [currentIdx]: prev.filter((i) => i !== optIdx) });
      } else {
        setUserAnswers({ ...userAnswers, [currentIdx]: [...prev, optIdx] });
      }
    } else {
      setUserAnswers({ ...userAnswers, [currentIdx]: [optIdx] });
    }
  };

  const handleSubmitAnswer = () => {
    setSubmittedQuestions({ ...submittedQuestions, [currentIdx]: true });
  };

  const handleNextQuestion = () => {
    if (currentIdx < activeQuestions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Calculate final score
      let correctCount = 0;
      activeQuestions.forEach((q, idx) => {
        const given = (userAnswers[idx] || []).sort();
        const expected = [...q.correctAnswers].sort();
        if (given.length === expected.length && given.every((val, i) => val === expected[i])) {
          correctCount += 1;
        }
      });

      const topicId = selectedTopicId === 'all' ? 'climate-environment' : selectedTopicId;
      recordQuizAttempt(profile?.uid, `quiz-${Date.now()}`, topicId, correctCount, activeQuestions.length);

      const pct = Math.round((correctCount / activeQuestions.length) * 100);
      if (pct >= 80) {
        const topicObj = learningTopics.find((t) => t.id === topicId) || learningTopics[0];
        const cert = issueCertificate(profile?.uid, topicId, topicObj.title, pct);
        setEarnedCert(cert);
      }

      setQuizFinished(true);
    }
  };

  const currentQ = activeQuestions[currentIdx];

  return (
    <div className="space-y-8">
      {/* Quiz Engine Header */}
      {!quizActive && (
        <div className="card bg-gradient-to-r from-[#183647] to-[#0a2738] text-white p-8 rounded-3xl space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#74D4F5] text-xs font-bold uppercase tracking-wider">
              <Award size={16} /> Yuki Multi-Topic Interactive Quiz Engine
            </div>
            <h2 className="text-2xl font-bold text-white">Test Your Polar Knowledge & Earn Certificates</h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Answer single-choice, multi-select, scenario reasoning, and true/false questions grounded in real Antarctic, Arctic, and Himalayan science.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 pt-4 border-t border-white/10">
            {/* Topic Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#74D4F5] block">Select Subject Topic:</label>
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="w-full rounded-xl bg-white/10 border border-white/20 p-3 text-xs text-white outline-none focus:border-[#74D4F5]"
              >
                <option value="all" className="bg-[#183647] text-white">★ Comprehensive Mix (All Topics)</option>
                {learningTopics.map((t) => (
                  <option key={t.id} value={t.id} className="bg-[#183647] text-white">
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Question Count Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#74D4F5] block">Quiz Length:</label>
              <div className="flex gap-3">
                {[10, 20].map((count) => (
                  <button
                    key={count}
                    onClick={() => setNumQuestions(count)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${
                      numQuestions === count ? 'bg-[#74D4F5] text-slate-950 shadow-md' : 'bg-white/10 text-white border border-white/20'
                    }`}
                  >
                    {count} Questions
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={startQuiz} className="btn-primary text-xs w-full sm:w-auto px-8 py-3 font-bold justify-center">
            <Sparkles size={16} /> Start Interactive Quiz
          </button>
        </div>
      )}

      {/* ACTIVE QUIZ SCREEN */}
      {quizActive && !quizFinished && currentQ && (
        <div className="card bg-white border border-[#183647]/15 space-y-6">
          {/* Question Header & Progress Bar */}
          <div className="space-y-3 border-b border-[#183647]/10 pb-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono font-bold text-[#487b91]">
                Question {currentIdx + 1} of {activeQuestions.length}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-[#183647]">
                  {currentQ.difficulty} Difficulty
                </span>
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">
                  {currentQ.type.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#183647] h-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / activeQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#183647] leading-snug">{currentQ.question}</h3>

            {/* Options List */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, optIdx) => {
                const selectedList = userAnswers[currentIdx] || [];
                const isSelected = selectedList.includes(optIdx);
                const isSubmitted = submittedQuestions[currentIdx];
                const isCorrectOption = currentQ.correctAnswers.includes(optIdx);

                let btnStyle = 'bg-slate-50 text-[#183647] border-[#183647]/15 hover:bg-slate-100';
                if (isSelected) {
                  btnStyle = 'bg-[#183647] text-white border-[#183647] shadow-sm';
                }
                if (isSubmitted) {
                  if (isCorrectOption) {
                    btnStyle = 'bg-emerald-600 text-white border-emerald-600 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-red-600 text-white border-red-600';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs transition flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isSelected && !isSubmitted && <span className="text-[10px] font-bold uppercase text-[#74D4F5]">Selected</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hint Toggle */}
          <div>
            <button
              onClick={() => setShowHint({ ...showHint, [currentIdx]: !showHint[currentIdx] })}
              className="text-xs text-[#487b91] hover:underline flex items-center gap-1 font-semibold"
            >
              <HelpCircle size={14} /> {showHint[currentIdx] ? 'Hide Hint' : 'Need a Hint?'}
            </button>
            {showHint[currentIdx] && (
              <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                💡 <strong>Hint:</strong> {currentQ.hint}
              </div>
            )}
          </div>

          {/* Post-Answer Explanation Box */}
          {submittedQuestions[currentIdx] && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs space-y-1">
              <div className="font-bold text-[#183647]">Scientific Rationale & Explanation:</div>
              <p className="text-slate-700 leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex justify-between items-center pt-4 border-t border-[#183647]/10">
            {!submittedQuestions[currentIdx] ? (
              <button
                disabled={!(userAnswers[currentIdx] && userAnswers[currentIdx].length > 0)}
                onClick={handleSubmitAnswer}
                className="btn-primary text-xs disabled:opacity-40"
              >
                Submit Answer
              </button>
            ) : (
              <button onClick={handleNextQuestion} className="btn-primary text-xs flex items-center gap-1.5">
                {currentIdx < activeQuestions.length - 1 ? 'Next Question →' : 'View Final Results'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* FINAL QUIZ RESULTS SCREEN */}
      {quizFinished && (
        <div className="card bg-white border border-[#183647]/15 space-y-6 text-center p-8">
          <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-md">
            <Award size={32} />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-[#183647]">Quiz Complete!</h3>
            <p className="text-xs text-[#487b91]">
              Your performance has been recorded in your student profile and learning streak.
            </p>
          </div>

          {/* Certificate Generation Banner if score >= 80% */}
          {earnedCert && (
            <div className="rounded-2xl bg-gradient-to-r from-[#183647] to-[#2b5870] text-white p-6 space-y-3 text-left">
              <div className="flex items-center gap-2 text-[#74D4F5] text-xs font-bold">
                <ShieldCheck size={18} /> Official Yuki Topic Certificate Earned!
              </div>
              <h4 className="text-lg font-bold">{earnedCert.topicTitle}</h4>
              <p className="text-xs text-slate-300">
                Certificate Code: <span className="font-mono text-white font-bold">{earnedCert.certificateCode}</span> · Issue Date: {earnedCert.issueDate}
              </p>
              <button
                onClick={() => alert(`Certificate ${earnedCert.certificateCode} ready for download!`)}
                className="btn-primary text-xs inline-flex items-center gap-1.5"
              >
                <Download size={14} /> Download Certificate PDF
              </button>
            </div>
          )}

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => {
                setQuizActive(false);
                setQuizFinished(false);
              }}
              className="btn-primary text-xs"
            >
              Take Another Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
