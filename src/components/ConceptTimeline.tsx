import React, { useState, useMemo } from 'react';
import {
  Clock,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  MessageSquareQuote,
  Languages,
  RotateCcw,
} from 'lucide-react';
import { TNPSCConceptItem, TNPSCUnitFilter } from '../types';

interface ConceptTimelineProps {
  concepts: TNPSCConceptItem[];
  currentTime: number;
  onSeekToScene: (sec: number) => void;
  showTamilTerms: boolean;
  onOpenDeepDive: (concept: TNPSCConceptItem) => void;
}

function matchesFilter(item: TNPSCConceptItem, filter: TNPSCUnitFilter): boolean {
  if (filter === 'ALL') return true;

  const combined = `${item.unit} ${item.subject} ${item.concept} ${item.explanation}`.toLowerCase();

  if (filter === 'பொதுத்தமிழ்: தமிழ் இலக்கணம் (Tamil Grammar)') {
    return (
      !!item.tamilGrammar ||
      item.unit.includes('பொதுத்தமிழ்') ||
      item.subject.includes('பொதுத்தமிழ்') ||
      combined.includes('தமிழ்') ||
      combined.includes('இலக்கணம்')
    );
  }
  if (filter === 'Unit 1: Science') {
    return (
      combined.includes('science') ||
      combined.includes('physics') ||
      combined.includes('botany') ||
      combined.includes('zoology') ||
      combined.includes('chemistry') ||
      combined.includes('optics') ||
      combined.includes('physiology') ||
      combined.includes('nerve')
    );
  }
  if (filter === 'Unit 3: Geography') {
    return (
      combined.includes('geography') ||
      combined.includes('cauvery') ||
      combined.includes('river') ||
      combined.includes('soil') ||
      combined.includes('agriculture')
    );
  }
  if (filter === 'Unit 4 & 8: History & Culture') {
    return (
      combined.includes('history') ||
      combined.includes('culture') ||
      combined.includes('unit 8') ||
      combined.includes('unit 4') ||
      combined.includes('chola') ||
      combined.includes('heritage') ||
      combined.includes('temple')
    );
  }
  if (filter === 'Unit 5: Polity') {
    return (
      combined.includes('polity') ||
      combined.includes('constitution') ||
      combined.includes('article') ||
      combined.includes('writ') ||
      combined.includes('habeas') ||
      combined.includes('armed forces') ||
      combined.includes('government')
    );
  }
  if (filter === 'Unit 6: Economy') {
    return (
      combined.includes('economy') ||
      combined.includes('economic') ||
      combined.includes('market') ||
      combined.includes('trade')
    );
  }
  if (filter === 'Unit 9: TN Administration') {
    return (
      combined.includes('administration') ||
      combined.includes('unit 9') ||
      combined.includes('governance') ||
      combined.includes('welfare') ||
      combined.includes('renewable')
    );
  }

  return true;
}

export const ConceptTimeline: React.FC<ConceptTimelineProps> = ({
  concepts,
  currentTime,
  onSeekToScene,
  showTamilTerms,
  onOpenDeepDive,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<TNPSCUnitFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  const handleSelectOption = (conceptId: string, optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [conceptId]: optionIdx,
    }));
  };

  const allAvailableFilters: TNPSCUnitFilter[] = [
    'ALL',
    'பொதுத்தமிழ்: தமிழ் இலக்கணம் (Tamil Grammar)',
    'Unit 1: Science',
    'Unit 3: Geography',
    'Unit 4 & 8: History & Culture',
    'Unit 5: Polity',
    'Unit 6: Economy',
    'Unit 9: TN Administration',
  ];

  // Dynamic counts for each filter
  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allAvailableFilters.forEach((f) => {
      counts[f] = concepts.filter((item) => matchesFilter(item, f)).length;
    });
    return counts;
  }, [concepts]);

  // Only show filters that have items in the current video (or 'ALL')
  const visibleFilters = useMemo(() => {
    return allAvailableFilters.filter((f) => f === 'ALL' || (filterCounts[f] && filterCounts[f] > 0));
  }, [filterCounts]);

  const filteredConcepts = useMemo(() => {
    return concepts.filter((item) => {
      // Unit filter
      if (!matchesFilter(item, selectedFilter)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          item.concept.toLowerCase().includes(q) ||
          item.detectedObjectOrEvent.toLowerCase().includes(q) ||
          item.subject.toLowerCase().includes(q) ||
          item.explanation.toLowerCase().includes(q) ||
          (item.keyTamilTerms && item.keyTamilTerms.toLowerCase().includes(q)) ||
          (item.tamilGrammar &&
            (item.tamilGrammar.spokenPhrase.toLowerCase().includes(q) ||
              item.tamilGrammar.grammarTopic.toLowerCase().includes(q) ||
              item.tamilGrammar.grammarRule.toLowerCase().includes(q) ||
              (item.tamilGrammar.pureTamilEquivalent &&
                item.tamilGrammar.pureTamilEquivalent.toLowerCase().includes(q))));
        if (!match) return false;
      }

      return true;
    });
  }, [concepts, selectedFilter, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-3.5 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search concepts, Tamil grammar, objects, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="text-xs text-stone-400 flex items-center justify-between sm:justify-end gap-2 shrink-0">
            <span className="font-semibold text-amber-300">
              {filteredConcepts.length} of {concepts.length} concepts
            </span>
            {(selectedFilter !== 'ALL' || searchQuery.trim()) && (
              <button
                onClick={() => {
                  setSelectedFilter('ALL');
                  setSearchQuery('');
                }}
                className="text-[11px] text-stone-400 hover:text-stone-200 underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Category Filter Tabs (With Counts) */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {visibleFilters.map((filter) => {
            const count = filterCounts[filter] || 0;
            const isSelected = selectedFilter === filter;
            const isTamil = filter.includes('பொதுத்தமிழ்');

            return (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? isTamil
                      ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 shadow-sm'
                      : 'bg-amber-500/15 border border-amber-500/40 text-amber-300 shadow-sm'
                    : 'bg-stone-950/70 border border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <span>{filter === 'பொதுத்தமிழ்: தமிழ் இலக்கணம் (Tamil Grammar)' ? '📜 பொதுத்தமிழ் இலக்கணம்' : filter}</span>
                <span className={`text-[10px] font-mono px-1 rounded ${isSelected ? 'bg-black/40 text-white' : 'text-stone-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty State when Filter/Search yields 0 */}
      {filteredConcepts.length === 0 && (
        <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-8 text-center space-y-3 animate-in fade-in duration-200">
          <HelpCircle className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-sm font-bold text-stone-100 font-serif">
            {searchQuery ? `No concepts match "${searchQuery}"` : `No concepts in ${selectedFilter}`}
          </h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            This video contains {concepts.length} mapped TNPSC syllabus concepts. Click below to view all concepts.
          </p>
          <button
            onClick={() => {
              setSelectedFilter('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all inline-flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Show All {concepts.length} Concepts</span>
          </button>
        </div>
      )}

      {/* Concept Items List */}
      <div className="space-y-4">
        {filteredConcepts.map((item, index) => {
          const isActive = Math.abs(currentTime - item.timestampSec) < 2.0;
          const userAnswer = selectedAnswers[item.id];
          const hasAnswered = userAnswer !== undefined;
          const isCorrect = userAnswer === item.mcq.correctAnswer;
          const isTamilGrammar = !!item.tamilGrammar || item.unit.includes('பொதுத்தமிழ்');

          return (
            <article
              key={item.id}
              className={`bg-stone-950 rounded-xl border transition-all duration-300 overflow-hidden ${
                isActive
                  ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-lg shadow-amber-500/5'
                  : 'border-stone-800/90 hover:border-stone-700'
              }`}
            >
              {/* Card Header with Timestamp & Subject Hierarchy */}
              <div className="px-4 py-3 bg-stone-900/70 border-b border-stone-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSeekToScene(item.timestampSec)}
                    className="flex items-center gap-1 text-xs font-mono font-semibold px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors"
                    title="Jump video to this exact moment"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.timestamp}</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-xs text-stone-400">
                    <span className="font-semibold text-stone-200">{item.subject}</span>
                    <span aria-hidden="true" className="text-stone-600">·</span>
                    <span className="text-stone-400">{item.unit}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isTamilGrammar && (
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                      <Languages className="w-3 h-3" />
                      <span>TNPSC பொதுத்தமிழ்</span>
                    </span>
                  )}
                  {isActive && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-amber-400">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      <span>Active in Video</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-4">
                {/* Visual / Dialogue Blueprint */}
                <div className="bg-stone-900/50 border border-stone-800 rounded-lg p-3 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 text-stone-400 shrink-0">
                      {isTamilGrammar ? (
                        <MessageSquareQuote className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Search className="w-4 h-4 text-amber-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                        {isTamilGrammar ? 'Spoken Tamil Dialogue / Scene' : 'Detected Visual Scene (Object / Event)'}
                      </div>
                      <div className="text-sm font-medium text-stone-100 font-serif">
                        {item.detectedObjectOrEvent}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-stone-500 text-xs pl-6">
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-stone-400">TNPSC Concept / Grammar:</span>
                    <span className="font-semibold text-amber-300 font-serif">
                      {item.concept}
                    </span>
                  </div>
                </div>

                {/* SPECIAL TNPSC TAMIL GRAMMAR SECTION (if Tamil spoken) */}
                {item.tamilGrammar && (
                  <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3.5 space-y-2.5 text-xs text-stone-200">
                    <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                        <Languages className="w-4 h-4 text-emerald-400" />
                        <span>TNPSC பொதுத்தமிழ் இலக்கண விளக்கம்: {item.tamilGrammar.grammarTopic}</span>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-mono">100 மதிப்பெண் பகுதி</span>
                    </div>

                    <div className="space-y-1.5 text-stone-300">
                      <p><strong className="text-emerald-300">இலக்கண விதி:</strong> {item.tamilGrammar.grammarRule}</p>
                      {item.tamilGrammar.pureTamilEquivalent && (
                        <div className="p-2 rounded bg-stone-900/80 border border-emerald-500/20 text-emerald-200 font-medium">
                          <span className="text-stone-400">பிறமொழிச் சொல் நீக்கிய தூய தமிழ்ச் சொல்: </span>
                          <span className="text-amber-300 font-semibold">{item.tamilGrammar.pureTamilEquivalent}</span>
                        </div>
                      )}
                      {item.tamilGrammar.sandhiSplit && (
                        <p><strong className="text-emerald-300">புணர்ச்சிப் பிரித்தல்:</strong> {item.tamilGrammar.sandhiSplit}</p>
                      )}
                      {item.tamilGrammar.caseSuffix && (
                        <p><strong className="text-emerald-300">வேற்றுமை உருபு:</strong> {item.tamilGrammar.caseSuffix}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Bilingual Tamil Keywords */}
                {showTamilTerms && item.keyTamilTerms && !item.tamilGrammar && (
                  <div className="flex items-center gap-2 text-xs text-amber-300/90 bg-amber-950/20 border border-amber-900/40 rounded-md px-3 py-1.5">
                    <span className="font-semibold text-amber-400">தமிழ் கலைச்சொல்:</span>
                    <span>{item.keyTamilTerms}</span>
                  </div>
                )}

                {/* Conceptual Explanation */}
                <div className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  <p>{item.explanation}</p>
                  {item.samacheerReference && (
                    <div className="mt-2 text-xs text-stone-400 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-stone-500" />
                      <span>Samacheer Kalvi: {item.samacheerReference}</span>
                    </div>
                  )}
                </div>

                {/* Embedded High-Quality TNPSC MCQ */}
                <div className="pt-2 border-t border-stone-800/80">
                  <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-3.5 sm:p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>TNPSC Exam MCQ #{index + 1} {isTamilGrammar ? '(பொதுத்தமிழ்)' : '(General Studies)'}</span>
                      </span>
                      <span className="text-stone-500">Test Your Understanding</span>
                    </div>

                    <p className="text-xs sm:text-sm font-medium text-stone-100 leading-snug">
                      {item.mcq.question}
                    </p>

                    {/* 4 Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {item.mcq.options.map((option, optIdx) => {
                        const optLetter = ['A', 'B', 'C', 'D'][optIdx];
                        const isSelected = userAnswer === optIdx;
                        const isCorrectOption = optIdx === item.mcq.correctAnswer;

                        let btnStyle =
                          'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700 hover:bg-stone-900';

                        if (hasAnswered) {
                          if (isCorrectOption) {
                            btnStyle =
                              'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-medium ring-1 ring-emerald-500/30';
                          } else if (isSelected && !isCorrectOption) {
                            btnStyle =
                              'bg-rose-950/40 border-rose-500 text-rose-200 line-through ring-1 ring-rose-500/30';
                          } else {
                            btnStyle = 'bg-stone-950/50 border-stone-900 text-stone-500 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(item.id, optIdx)}
                            className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-start gap-2.5 ${btnStyle}`}
                          >
                            <span className="w-5 h-5 rounded font-mono font-bold text-[11px] flex items-center justify-center shrink-0 bg-stone-900 border border-stone-700">
                              {optLetter}
                            </span>
                            <span className="leading-snug pt-0.5">{option}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback Explanation */}
                    {hasAnswered && (
                      <div
                        className={`rounded-lg p-3 text-xs leading-relaxed border ${
                          isCorrect
                            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                            : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-semibold mb-1">
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>Correct Answer! (Option {['A', 'B', 'C', 'D'][item.mcq.correctAnswer]})</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-rose-400" />
                              <span>Incorrect. Correct Option is {['A', 'B', 'C', 'D'][item.mcq.correctAnswer]}</span>
                            </>
                          )}
                        </div>
                        <p className="text-stone-300 mt-1">{item.mcq.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Controls: Deep Dive Button */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-stone-500">
                    Syllabus Standard: TNPSC Group 1, 2, 2A, 4 & VAO
                  </span>

                  <button
                    onClick={() => onOpenDeepDive(item)}
                    className="text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>TNPSC Deep-Dive & PYQ Notes</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
