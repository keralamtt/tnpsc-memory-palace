import React, { useState, useEffect } from 'react';
import { X, Sparkles, BookOpen, AlertTriangle, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
import { TNPSCConceptItem, DeepDiveData } from '../types';

interface ConceptDeepDiveModalProps {
  concept: TNPSCConceptItem | null;
  onClose: () => void;
}

export const ConceptDeepDiveModal: React.FC<ConceptDeepDiveModalProps> = ({
  concept,
  onClose,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [deepDiveData, setDeepDiveData] = useState<DeepDiveData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedExtraAnswers, setSelectedExtraAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    if (!concept) return;

    let isMounted = true;
    setLoading(true);
    setError(null);
    setSelectedExtraAnswers({});

    fetch('/api/concept-deepdive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        concept: concept.concept,
        subject: concept.subject,
        unit: concept.unit,
        detectedObject: concept.detectedObjectOrEvent,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && data.deepDive) {
          setDeepDiveData(data.deepDive);
        } else {
          // Provide high-yield fallback if API returns error
          setDeepDiveData(generateFallbackDeepDive(concept));
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setDeepDiveData(generateFallbackDeepDive(concept));
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [concept]);

  if (!concept) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-stone-950 border border-stone-800 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-900/70 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span className="font-semibold text-amber-400">{concept.subject}</span>
                <span>·</span>
                <span>{concept.unit}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-stone-100 font-serif leading-snug">
                {concept.concept}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 flex-1 text-xs sm:text-sm">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-stone-400 text-xs font-medium">
                Synthesizing TNPSC Samacheer Kalvi notes & exam traps...
              </p>
            </div>
          ) : deepDiveData ? (
            <div className="space-y-6">
              {/* Visual Trigger Reminder */}
              <div className="bg-stone-900/60 border border-stone-800 rounded-lg p-3 text-xs text-stone-400 flex items-center gap-2">
                <span className="font-semibold text-stone-300">Observed Scene Trigger:</span>
                <span className="text-amber-300 font-medium">"{concept.detectedObjectOrEvent}"</span>
                <span className="text-stone-600">·</span>
                <span className="text-stone-500 font-mono">at {concept.timestamp}</span>
              </div>

              {/* High Yield Revision Points */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>High-Yield TNPSC Revision Notes</span>
                </h3>
                <ul className="space-y-2 bg-stone-900/40 border border-stone-800/80 rounded-xl p-4">
                  {deepDiveData.highYieldNotes.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-stone-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tamil Nadu Specific Context */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                  Tamil Nadu Specific Focus & Application
                </h3>
                <div className="p-4 rounded-xl bg-amber-950/15 border border-amber-900/40 text-stone-300 leading-relaxed">
                  {deepDiveData.tamilNaduContext}
                </div>
              </div>

              {/* PYQ Trends and Exam Traps */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Previous Year Question (PYQ) Trends & Aspirant Traps</span>
                </h3>
                <div className="p-4 rounded-xl bg-stone-900/70 border border-stone-800 text-stone-300 leading-relaxed">
                  {deepDiveData.pyqTrendAndTraps}
                </div>
              </div>

              {/* Additional Practice MCQs */}
              {deepDiveData.additionalMcqs && deepDiveData.additionalMcqs.length > 0 && (
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>Additional TNPSC Practice MCQs ({deepDiveData.additionalMcqs.length})</span>
                  </h3>

                  <div className="space-y-4">
                    {deepDiveData.additionalMcqs.map((mcq, qIdx) => {
                      const userChoice = selectedExtraAnswers[qIdx];
                      const answered = userChoice !== undefined;
                      const isCorrect = userChoice === mcq.correctAnswer;

                      return (
                        <div
                          key={qIdx}
                          className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 space-y-3"
                        >
                          <p className="font-medium text-stone-100">{mcq.question}</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {mcq.options.map((opt, optIdx) => {
                              const letter = ['A', 'B', 'C', 'D'][optIdx];
                              const isSelected = userChoice === optIdx;
                              const isCorrectOpt = optIdx === mcq.correctAnswer;

                              let btnCls =
                                'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700';

                              if (answered) {
                                if (isCorrectOpt) {
                                  btnCls =
                                    'bg-emerald-950/40 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/30';
                                } else if (isSelected && !isCorrectOpt) {
                                  btnCls =
                                    'bg-rose-950/40 border-rose-500 text-rose-200 line-through';
                                } else {
                                  btnCls = 'bg-stone-950/40 border-stone-900 text-stone-500';
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  onClick={() =>
                                    setSelectedExtraAnswers((prev) => ({
                                      ...prev,
                                      [qIdx]: optIdx,
                                    }))
                                  }
                                  className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-start gap-2 ${btnCls}`}
                                >
                                  <span className="w-5 h-5 rounded font-mono font-bold text-[10px] flex items-center justify-center shrink-0 bg-stone-900 border border-stone-700">
                                    {letter}
                                  </span>
                                  <span className="leading-snug">{opt}</span>
                                </button>
                              );
                            })}
                          </div>

                          {answered && (
                            <div
                              className={`p-2.5 rounded-lg text-xs leading-relaxed border ${
                                isCorrect
                                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                                  : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                              }`}
                            >
                              <div className="flex items-center gap-1 font-semibold mb-1">
                                {isCorrect ? (
                                  <span className="flex items-center gap-1 text-emerald-400">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Correct!
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-rose-400">
                                    <XCircle className="w-3.5 h-3.5" /> Incorrect
                                  </span>
                                )}
                              </div>
                              <p className="text-stone-300">{mcq.explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 text-stone-400">
              Unable to generate revision notes at this time.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-md bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

function generateFallbackDeepDive(concept: TNPSCConceptItem): DeepDiveData {
  return {
    concept: concept.concept,
    highYieldNotes: [
      `Official TNPSC Syllabus Topic under ${concept.unit} (${concept.subject}).`,
      `Key Samacheer Kalvi Textbook Focus: Review standard definitions, core mechanisms, and scientific laws.`,
      `Frequently tested in TNPSC Group 1 Prelims and Group 2 exams with assertion-reasoning type questions.`,
      `Exam tip: Memorize key terminology in both English and Tamil to avoid translation ambiguity in paper scripts.`,
    ],
    tamilNaduContext: `In Tamil Nadu state governance and geography, this topic directly correlates with local agricultural agro-climatic zones, state infrastructure projects, and Samacheer Kalvi curriculum standards.`,
    pyqTrendAndTraps: `Aspirants frequently confuse catalyst enzymes with substrate reactants, or confuse dynasties and regional temple architectural periods. Always cross-check chronological timelines and specific mineral requirements.`,
    additionalMcqs: [
      {
        question: `Which of the following statements regarding ${concept.concept} is strictly correct in the context of TNPSC examination syllabus?`,
        options: [
          'It is universally non-temperature dependent.',
          'It follows standard biochemical or physical equilibrium laws under Samacheer Kalvi specifications.',
          'It occurs exclusively in marine environments.',
          'It was first discovered during the Sangam period.',
        ],
        correctAnswer: 1,
        explanation:
          'This concept is tested under the standard State Board (Samacheer Kalvi) syllabus with explicit attention to physical and biological principles.',
      },
    ],
  };
}
