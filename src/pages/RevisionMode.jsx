import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Lightbulb,
  Check,
  ChevronRight,
  Layers
} from "lucide-react";
import { useScribe } from "../store/scribeContext";
import { AppLayout } from "../components/layout/AppLayout";

export default function RevisionMode() {
  const { state, submitRevisionAnswer } = useScribe();
  const { revisionQueue } = state;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userRevision, setUserRevision] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [hintOpen, setHintOpen] = useState(false);

  const currentItem = revisionQueue[currentIndex] || revisionQueue[0];

  const handleSubmitRevision = (e) => {
    e.preventDefault();
    if (!userRevision.trim()) return;

    // Check if the expected keyword/collocation was fixed in revision
    const normalized = userRevision.toLowerCase();
    const isCorrect = normalized.includes(currentItem.expectedKeyword.toLowerCase());

    const result = {
      isCorrect,
      feedback: isCorrect ? "✓ Mastery Verified" : "✗ Needs Further Refinement",
      explanation: isCorrect
        ? currentItem.explanation
        : `Take another look at "${currentItem.focusSegment}". Hint: ${currentItem.hint}`,
      original: currentItem.original,
      revised: userRevision
    };

    setEvaluation(result);
    submitRevisionAnswer(currentItem.id, userRevision, isCorrect);
  };

  const handleNext = () => {
    setEvaluation(null);
    setUserRevision("");
    setHintOpen(false);
    setCurrentIndex((prev) => (prev + 1) % revisionQueue.length);
  };

  return (
    <AppLayout
      title="Revision Lab"
      subtitle="Deliberate sentence repair: isolate linguistic defects and rewrite with precision"
    >
      <div className="p-8 max-w-3xl mx-auto space-y-6 animate-in fade-in duration-150">
        {/* Progress & Header */}
        <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B85D38]">
              Exercise {currentIndex + 1} of {revisionQueue.length}
            </span>
            <h2 className="font-serif font-bold text-2xl text-[#1A1A1E]">
              Sentence Precision Workshop
            </h2>
          </div>

          <span className="text-xs px-2.5 py-1 rounded-full bg-[#FAF0E6] text-[#B85D38] font-bold">
            {currentItem.category}
          </span>
        </div>

        {/* Exercise Card */}
        <div className="bg-white p-8 rounded-2xl border border-[#E4DDD1] shadow-2xs space-y-6">
          {/* Original Sentence with defect highlighted */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A8D96]">
              Original Sentence (Containing Defect)
            </div>
            <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl font-serif text-base text-[#1A1A1E] leading-relaxed">
              {currentItem.original.split(currentItem.focusSegment).map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="bg-[#FEF3C7] text-[#92400E] px-1.5 py-0.5 rounded font-semibold underline decoration-[#D97706]">
                      {currentItem.focusSegment}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Teacher Prompt */}
          <div className="p-4 bg-[#F5EFE4] border border-[#E2D8C7] rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-[#B85D38] font-bold">
              <Lightbulb className="w-4 h-4" />
              <span>Teacher's Guidance</span>
            </div>
            <p className="font-serif text-[#2F323A] font-medium leading-relaxed">
              "{currentItem.prompt}"
            </p>

            {!hintOpen ? (
              <button
                onClick={() => setHintOpen(true)}
                className="text-[11px] text-[#7A7E8B] hover:text-[#1A1A1E] underline cursor-pointer pt-1"
              >
                Need a hint?
              </button>
            ) : (
              <p className="text-[11px] text-[#065F46] bg-[#ECFDF5] p-2 rounded border border-[#A7F3D0]">
                <strong>Hint:</strong> {currentItem.hint}
              </p>
            )}
          </div>

          {/* Revision Input or Evaluation Result */}
          {!evaluation ? (
            <form onSubmit={handleSubmitRevision} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B6F7B]">
                  Your Revised Sentence
                </label>
                <textarea
                  rows={3}
                  value={userRevision}
                  onChange={(e) => setUserRevision(e.target.value)}
                  placeholder="Type the corrected sentence here..."
                  className="w-full p-3.5 bg-white border border-[#DDD6C9] rounded-xl text-base font-serif text-[#1A1A1E] focus:outline-hidden focus:border-[#1F2E3D] leading-relaxed resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={!userRevision.trim()}
                className="w-full py-3 bg-[#1F2E3D] hover:bg-[#15202B] disabled:bg-[#CCC5B8] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Submit & Evaluate Revision
              </button>
            </form>
          ) : (
            <div className="space-y-5 pt-2 border-t border-[#E8E2D8] animate-in fade-in duration-150">
              {/* Result Badge */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  evaluation.isCorrect
                    ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]"
                    : "bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]"
                }`}
              >
                {evaluation.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-sm">{evaluation.feedback}</div>
                  <p className="leading-relaxed">{evaluation.explanation}</p>
                </div>
              </div>

              {/* Revision Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E2D8] space-y-1">
                  <div className="text-[10px] font-bold uppercase text-[#8A8D96]">Original</div>
                  <div className="font-serif italic text-[#555862]">"{evaluation.original}"</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#D5CDC0] space-y-1">
                  <div className="text-[10px] font-bold uppercase text-[#059669]">Your Revision</div>
                  <div className="font-serif font-bold text-[#1A1A1E]">"{evaluation.revised}"</div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                {!evaluation.isCorrect && (
                  <button
                    onClick={() => setEvaluation(null)}
                    className="px-4 py-2.5 bg-white border border-[#DDD6C9] hover:bg-[#F2ECE1] text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Try Again
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="flex-1 py-2.5 px-4 bg-[#1F2E3D] hover:bg-[#15202B] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Next Sentence Exercise</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
