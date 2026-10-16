import React, { useState } from "react";
import { CheckCircle, WarningCircle, ArrowRight, Question } from "@phosphor-icons/react";
import { useScribe } from "../store/scribeContext";
import { AppLayout, pageClass } from "../components/layout/AppLayout";

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

    const isCorrect = userRevision.toLowerCase().includes(currentItem.expectedKeyword.toLowerCase());

    setEvaluation({
      isCorrect,
      feedback: isCorrect ? "Fixed" : "Not quite yet",
      explanation: isCorrect
        ? currentItem.explanation
        : `Look again at “${currentItem.focusSegment}”. ${currentItem.hint}`,
      original: currentItem.original,
      revised: userRevision
    });
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
      title="Revision lab"
      subtitle="One sentence at a time: find what is wrong with it, then rewrite it yourself."
    >
      <div className={`${pageClass} flex flex-wrap items-start gap-6`}>
        <div className="flex-[7_1_520px] min-w-0">
        <div className="flex items-center justify-between gap-4 rise">
          <div className="flex items-center gap-1.5" aria-label={`Sentence ${currentIndex + 1} of ${revisionQueue.length}`}>
            {revisionQueue.map((item, idx) => (
              <span
                key={item.id}
                className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                  idx === currentIndex ? "w-8 bg-pen" : idx < currentIndex ? "w-4 bg-ink" : "w-4 bg-tint-2"
                }`}
              />
            ))}
            <span className="ml-3 text-[14px] text-ink-2 tabular whitespace-nowrap">
              Sentence {currentIndex + 1} of {revisionQueue.length}
            </span>
          </div>
          <span className="tag tag-pen tag-caps">{currentItem.category}</span>
        </div>

        <section key={currentItem.id} className="mt-5 card p-6 sm:p-9 rise" style={{ "--i": 1 }}>
          <p className="eyebrow">The sentence</p>
          <p className="mt-3 font-serif text-[24px] sm:text-[28px] leading-[1.35] tracking-[-0.01em]">
            {currentItem.original.split(currentItem.focusSegment).map((part, i, arr) => (
              <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 && <span className="pen-mark text-pen-deep">{currentItem.focusSegment}</span>}
              </React.Fragment>
            ))}
          </p>

          <div className="mt-8 panel-dark p-5 sm:p-6">
            <div className="eyebrow text-night-mute flex items-center gap-2">
              <Question size={14} />
              <span>Your teacher asks</span>
            </div>
            <p className="mt-2 font-serif italic text-[19px] leading-[1.45]">&ldquo;{currentItem.prompt}&rdquo;</p>
            {hintOpen ? (
              <p className="mt-4 panel-dark-inner px-4 py-3 text-[14.5px] text-night-soft fade">
                <span className="font-semibold text-night-text">Hint. </span>
                {currentItem.hint}
              </p>
            ) : (
              <button onClick={() => setHintOpen(true)} className="link text-[14px] mt-2 min-h-9 text-night-text hover:text-white">
                I need a hint
              </button>
            )}
          </div>

          {!evaluation ? (
            <form onSubmit={handleSubmitRevision} className="mt-8 space-y-4">
              <label htmlFor="revision" className="block eyebrow">
                Your rewrite
              </label>
              <textarea
                id="revision"
                rows={3}
                value={userRevision}
                onChange={(e) => setUserRevision(e.target.value)}
                placeholder="Write the corrected sentence"
                className="field font-serif text-[19px] leading-relaxed resize-none"
              />
              <button type="submit" disabled={!userRevision.trim()} className="btn btn-primary w-full sm:w-auto px-6">
                Check my rewrite
              </button>
            </form>
          ) : (
            <div className="mt-8 space-y-6 fade">
              <div
                className={`rounded-xl p-5 flex items-start gap-3 ${
                  evaluation.isCorrect ? "bg-good-soft text-good" : "bg-pen-soft text-pen-deep"
                }`}
              >
                {evaluation.isCorrect ? (
                  <CheckCircle size={22} weight="fill" className="shrink-0" />
                ) : (
                  <WarningCircle size={22} weight="fill" className="shrink-0" />
                )}
                <div>
                  <div className="font-serif text-[20px] leading-tight">{evaluation.feedback}</div>
                  <p className="mt-1 text-[14.5px] leading-relaxed">{evaluation.explanation}</p>
                </div>
              </div>

              <div className="fact-strip">
                <div>
                  <div className="eyebrow">Before</div>
                  <p className="mt-1.5 font-serif text-[17px] leading-relaxed text-ink-3 line-through decoration-pen/60">
                    {evaluation.original}
                  </p>
                </div>
                <div>
                  <div className="eyebrow">Your rewrite</div>
                  <p className="mt-1.5 font-serif text-[17px] leading-relaxed">{evaluation.revised}</p>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3">
                {!evaluation.isCorrect && (
                  <button onClick={() => setEvaluation(null)} className="btn btn-outline">
                    Try again
                  </button>
                )}
                <button onClick={handleNext} className="btn btn-primary px-6">
                  <span>Next sentence</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </section>
        </div>

        <aside className="card flex-[4_1_300px] min-w-0 px-3 pt-5 pb-2 rise" style={{ "--i": 2 }} aria-label="Today's queue">
          <div className="px-3 pb-4 flex items-center justify-between gap-3">
            <span className="eyebrow">Today's queue</span>
            <span className="text-[13px] text-ink-3 tabular">{revisionQueue.length} sentences</span>
          </div>
          <ol className="rows border-t border-rule">
            {revisionQueue.map((item, idx) => {
              const current = idx === currentIndex;
              const done = idx < currentIndex;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setCurrentIndex(idx);
                      setEvaluation(null);
                      setUserRevision("");
                      setHintOpen(false);
                    }}
                    aria-current={current ? "step" : undefined}
                    className="row-link w-full text-left flex items-center gap-3 px-3 py-3.5"
                  >
                    <span className={`icon-tile w-9 h-9 text-[13px] font-semibold tabular ${current ? "bg-ink text-sheet" : ""}`}>
                      {idx + 1}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-serif text-[16px] leading-snug truncate">{item.original}</span>
                      <span className="block text-[12.5px] text-ink-3">{item.category}</span>
                    </span>
                    <span className={`tag tag-dot shrink-0 ${current ? "tag-pen" : done ? "tag-good" : ""}`}>
                      {current ? "Now" : done ? "Done" : "Next"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>
      </div>
    </AppLayout>
  );
}
