import React, { useState } from 'react';
import { X, Copy, Check, Printer, FileText } from 'lucide-react';
import { TNPSCConceptItem } from '../types';

interface NotesExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
  concepts: TNPSCConceptItem[];
}

export const NotesExportModal: React.FC<NotesExportModalProps> = ({
  isOpen,
  onClose,
  videoTitle,
  concepts,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const markdownContent = `# TNPSC VidyaLens - Video Syllabus Notes
**Video Title:** ${videoTitle}
**Total Concepts Identified:** ${concepts.length}
**Generated Date:** ${new Date().toLocaleDateString()}

---

${concepts
  .map(
    (c, i) => `## ${i + 1}. [${c.timestamp}] ${c.concept}
- **Detected Scene / Dialogue:** ${c.detectedObjectOrEvent}
- **TNPSC Subject:** ${c.subject}
- **TNPSC Unit:** ${c.unit}
${c.keyTamilTerms ? `- **Key Tamil Terms:** ${c.keyTamilTerms}` : ''}
${c.samacheerReference ? `- **Samacheer Reference:** ${c.samacheerReference}` : ''}
${
  c.tamilGrammar
    ? `\n### 📜 TNPSC பொதுத்தமிழ் இலக்கணம்
- **பேசப்பட்ட தொடர்:** "${c.tamilGrammar.spokenPhrase}"
- **இலக்கணக் குறிப்பு/விதி:** ${c.tamilGrammar.grammarRule}
${c.tamilGrammar.pureTamilEquivalent ? `- **தூய தமிழ்ச் சொல்:** ${c.tamilGrammar.pureTamilEquivalent}` : ''}
${c.tamilGrammar.sandhiSplit ? `- **புணர்ச்சிப் பிரித்தல்:** ${c.tamilGrammar.sandhiSplit}` : ''}
${c.tamilGrammar.caseSuffix ? `- **வேற்றுமை உருபு:** ${c.tamilGrammar.caseSuffix}` : ''}`
    : ''
}

### Syllabus Concept Explanation
${c.explanation}

### TNPSC Exam Question
**Q:** ${c.mcq.question}
${c.mcq.options.map((opt, optIdx) => `  ${['A', 'B', 'C', 'D'][optIdx]}. ${opt}`).join('\n')}
**Correct Answer:** Option ${['A', 'B', 'C', 'D'][c.mcq.correctAnswer]}
**Exam Explanation:** ${c.mcq.explanation}

---`
  )
  .join('\n\n')}
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-stone-950 border border-stone-800 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-900/70 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-100 font-serif">
                Export TNPSC Revision Notes
              </h2>
              <p className="text-xs text-stone-400">
                Formatted markdown & printable revision summary for {videoTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold rounded-md bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold rounded-md bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Notes</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-900 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="p-5 sm:p-6 space-y-4 flex-1">
          <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-4 font-mono text-xs text-stone-300 whitespace-pre-wrap leading-relaxed max-h-[60vh] overflow-y-auto selection:bg-amber-500/30">
            {markdownContent}
          </div>
        </div>
      </div>
    </div>
  );
};
