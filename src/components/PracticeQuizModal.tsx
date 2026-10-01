import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, XCircle, Award, RotateCcw, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { TNPSCConceptItem } from '../types';

interface PracticeQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  concepts: TNPSCConceptItem[];
}

export const PracticeQuizModal: React.FC<PracticeQuizModalProps> = ({
  isOpen,
  onClose,
  concepts,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [elapsedSec, setElapsedSec] = useState<number>(0);

  // Timer while taking test
  useEffect(() => {
    if (!isOpen || isSubmitted) return;
    const interval = setInterval(() => {
      setElapsedSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isSubmitted]);

  if (!isOpen || concepts.length === 0) return null;

  const currentConcept = concepts[currentIdx];
  const totalQuestions = concepts.length;

  const handleSelect = (optionIdx: number) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [currentIdx]: optionIdx,
    }));
  };

  const handleReset = () => {
    setAnswers({});
    setIsSubmitted(false);
    setCurrentIdx(0);
    setElapsedSec(0);
  };

  // Calculate results
  const correctCount = concepts.reduce((acc, c, idx) => {
    return answers[idx] === c.mcq.correctAnswer ? acc + 1 : acc;
  }, 0);

  const percentage = Math.round((correctCount / totalQuestions) * 100);

  // Subject-wise breakdown
  const subjectScores: Record<string, { correct: number; total: number }> = {};
  concepts.forEach((c, idx) => {
    if (!subjectScores[c.subject]) {
      subjectScores[c.subject] = { correct: 0, total: 0 };
    }
    subjectScores[c.subject].total += 1;
    if (answers[idx] === c.mcq.correctAnswer) {
      subjectScores[c.subject].correct += 1;
    }
  });

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-stone-950 border border-stone-800 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-900/60 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-100 font-serif">
                TNPSC Video Concept Mock Exam
              </h2>
              <p className="text-xs text-stone-400">
                {totalQuestions} MCQs synthesized from your uploaded video scenes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-mono text-xs text-amber-400 bg-stone-900 border border-stone-800 px-2.5 py-1 rounded-md">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimer(elapsedSec)}</span>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 flex-1">
          {!isSubmitted ? (
            // Active Test View
            <div className="space-y-5">
              {/* Progress Tracker */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-stone-400">
                  <span>
                    Question <strong className="text-stone-200">{currentIdx + 1}</strong> of{' '}
                    {totalQuestions}
                  </span>
                  <span>
                    {Object.keys(answers).length} of {totalQuestions} answered
                  </span>
                </div>
                <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-300 rounded-full"
                    style={{
                      width: `${((currentIdx + 1) / totalQuestions) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Syllabus Context banner */}
              <div className="p-2.5 rounded-lg bg-stone-900/70 border border-stone-800 flex items-center justify-between text-xs text-stone-400">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-amber-400">
                    {currentConcept.subject}
                  </span>
                  <span>·</span>
                  <span>{currentConcept.unit}</span>
                </div>
                <div className="font-mono text-stone-500">
                  Scene at {currentConcept.timestamp}
                </div>
              </div>

              {/* Question Statement */}
              <div className="space-y-2">
                <h3 className="text-sm sm:text-base font-medium text-stone-100 leading-relaxed">
                  {currentConcept.mcq.question}
                </h3>
                <p className="text-xs text-stone-400 italic">
                  Visual trigger: "{currentConcept.detectedObjectOrEvent}"
                </p>
              </div>

              {/* 4 Options */}
              <div className="space-y-2 pt-2">
                {currentConcept.mcq.options.map((option, optIdx) => {
                  const optLetter = ['A', 'B', 'C', 'D'][optIdx];
                  const isSelected = answers[currentIdx] === optIdx;

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(optIdx)}
                      className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500/60 text-amber-200 font-medium ring-1 ring-amber-500/30'
                          : 'bg-stone-900/80 border-stone-800 text-stone-300 hover:border-stone-700 hover:bg-stone-900'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-md font-mono font-bold text-xs flex items-center justify-center shrink-0 border ${
                          isSelected
                            ? 'bg-amber-500 text-stone-950 border-amber-400'
                            : 'bg-stone-950 text-stone-400 border-stone-800'
                        }`}
                      >
                        {optLetter}
                      </span>
                      <span className="pt-0.5 leading-snug">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-800">
                <button
                  onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
                  disabled={currentIdx === 0}
                  className="px-3 py-1.5 text-xs rounded-md bg-stone-900 border border-stone-800 text-stone-300 hover:bg-stone-800 disabled:opacity-40 transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-2">
                  {currentIdx < totalQuestions - 1 ? (
                    <button
                      onClick={() => setCurrentIdx((p) => Math.min(totalQuestions - 1, p + 1))}
                      className="px-4 py-1.5 text-xs font-semibold rounded-md bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors flex items-center gap-1.5"
                    >
                      <span>Next Question</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsSubmitted(true)}
                      className="px-4 py-1.5 text-xs font-semibold rounded-md bg-emerald-500 hover:bg-emerald-400 text-stone-950 transition-colors"
                    >
                      Submit Exam
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Results & Score Report View
            <div className="space-y-6">
              {/* Scorecard Hero */}
              <div className="bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-800 rounded-2xl p-6 text-center space-y-3">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto shadow-inner">
                  <Award className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-stone-100 font-serif">
                  Examination Result
                </h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-extrabold text-amber-400 font-mono">
                    {correctCount}
                  </span>
                  <span className="text-lg text-stone-500">/ {totalQuestions}</span>
                  <span className="text-sm font-semibold text-stone-400 ml-2">
                    ({percentage}%)
                  </span>
                </div>
                <p className="text-xs text-stone-400 max-w-md mx-auto">
                  {percentage >= 70
                    ? 'Outstanding! You demonstrated strong mastery of the TNPSC syllabus concepts identified in this video.'
                    : 'Good attempt! Review the detailed explanations below to reinforce your TNPSC Samacheer Kalvi fundamentals.'}
                </p>
                <div className="text-xs text-stone-500">
                  Time taken: {formatTimer(elapsedSec)}
                </div>
              </div>

              {/* Subject Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                  Performance by TNPSC Subject
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(subjectScores).map(([sub, stat]) => {
                    const subPct = Math.round((stat.correct / stat.total) * 100);
                    return (
                      <div
                        key={sub}
                        className="p-3 bg-stone-900/60 border border-stone-800 rounded-lg flex items-center justify-between text-xs"
                      >
                        <span className="font-medium text-stone-200 truncate">{sub}</span>
                        <span className="font-mono text-amber-400 shrink-0 ml-2">
                          {stat.correct}/{stat.total} ({subPct}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Full Answers Review */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                  Detailed Question Review & Explanations
                </h4>
                {concepts.map((c, idx) => {
                  const userAns = answers[idx];
                  const isCorrect = userAns === c.mcq.correctAnswer;

                  return (
                    <div
                      key={c.id}
                      className={`p-4 rounded-xl border space-y-2.5 text-xs ${
                        isCorrect
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-stone-300'
                          : 'bg-rose-950/20 border-rose-500/30 text-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-stone-200">
                          Q{idx + 1}. {c.subject} · {c.concept}
                        </span>
                        <span className="flex items-center gap-1 font-semibold shrink-0">
                          {isCorrect ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                            </span>
                          ) : (
                            <span className="text-rose-400 flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" /> Incorrect
                            </span>
                          )}
                        </span>
                      </div>

                      <p className="text-stone-200 font-medium">{c.mcq.question}</p>

                      <div className="space-y-1 pl-2 border-l border-stone-700">
                        <div>
                          <span className="text-stone-400">Your Answer: </span>
                          <span className={isCorrect ? 'text-emerald-300 font-semibold' : 'text-rose-300 font-semibold'}>
                            {userAns !== undefined
                              ? `${['A', 'B', 'C', 'D'][userAns]}. ${c.mcq.options[userAns]}`
                              : 'Not Answered'}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div>
                            <span className="text-stone-400">Correct Answer: </span>
                            <span className="text-emerald-300 font-semibold">
                              {['A', 'B', 'C', 'D'][c.mcq.correctAnswer]}.{' '}
                              {c.mcq.options[c.mcq.correctAnswer]}
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-stone-400 text-[11px] pt-1 leading-relaxed">
                        {c.mcq.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-stone-800">
                <button
                  onClick={handleReset}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Test</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 text-xs font-semibold rounded-md bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
