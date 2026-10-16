import React, { useState } from "react";
import { Check, Clock, PaperPlaneTilt, Warning, X } from "@phosphor-icons/react";
import { useScribe } from "../store/scribeContext";
import { AppLayout, pageClass } from "../components/layout/AppLayout";

const naturalness = {
  "✓": { label: "Natural", tone: "tag-good" },
  "⚠": { label: "A little stiff", tone: "tag-warn" }
};

export default function Challenges() {
  const { state, submitChallenge } = useScribe();
  const { challenges } = state;

  const [passageText, setPassageText] = useState(challenges.passage || "");
  const [analyzed, setAnalyzed] = useState(challenges.submitted || false);
  const [selectedWordNote, setSelectedWordNote] = useState(null);

  const wordCount = passageText.trim().split(/\s+/).filter(Boolean).length;

  const usedWordsStatus = challenges.words.map((word) => ({
    word,
    isUsed: new RegExp(`\\b${word}\\b`, "i").test(passageText)
  }));

  const usedCount = usedWordsStatus.filter((w) => w.isUsed).length;
  const isGoalMet = usedCount >= challenges.targetCount;
  const lengthOk = wordCount >= 300 && wordCount <= 500;

  const handleSubmit = (e) => {
    e.preventDefault();
    setAnalyzed(true);
    submitChallenge(passageText);
  };

  return (
    <AppLayout
      eyebrow="Weekly challenge"
      title={`“${challenges.theme}”`}
      subtitle={`This week's challenge: an original passage on this theme that uses at least ${challenges.targetCount} of the ${challenges.learnedWordsCount} words you saved this week.`}
    >
      <div className={`${pageClass} space-y-6 lg:space-y-8`}>
        <div className="flex flex-wrap items-center gap-2 rise">
          <span className="tag tag-warn">
            <Clock size={13} weight="bold" />
            Due {challenges.deadline}
          </span>
          <span className="chip">300 to 500 words</span>
          <span className="chip">At least {challenges.targetCount} target words</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form onSubmit={handleSubmit} className="lg:col-span-8 card p-6 sm:p-8 flex flex-col rise" style={{ "--i": 1 }}>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <span className="eyebrow">Draft</span>
                <label htmlFor="challenge-passage" className="block mt-1 font-serif text-[28px] leading-tight tracking-[-0.015em]">
                  Your passage
                </label>
              </div>
              <div className="flex items-center gap-2 tabular">
                <span className={`tag tag-dot ${lengthOk ? "tag-good" : ""}`}>{wordCount} words</span>
                <span className={`tag tag-dot ${isGoalMet ? "tag-good" : "tag-pen"}`}>
                  {usedCount} of {challenges.targetCount} words used
                </span>
              </div>
            </div>

            <textarea
              id="challenge-passage"
              rows={14}
              value={passageText}
              onChange={(e) => {
                setPassageText(e.target.value);
                if (analyzed) setAnalyzed(false);
              }}
              placeholder="Write your passage here. Think about how the sentences flow, and put each word where it belongs."
              className="mt-5 w-full p-5 bg-inset border border-edge rounded-xl font-serif text-[18px] leading-[1.75] text-ink placeholder:text-ink-3/70 outline-none focus:border-ink focus:bg-sheet transition-colors resize-y"
            />

            <div className="mt-5 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-[13px] text-ink-3">Scribe never writes or rewrites your sentences.</p>
              <button type="submit" disabled={wordCount < 50} className="btn btn-primary">
                <PaperPlaneTilt size={16} />
                <span>Submit for feedback</span>
              </button>
            </div>
          </form>

          <aside className="lg:col-span-4 card p-6 flex flex-col gap-5 rise" style={{ "--i": 2 }} aria-label="Target words">
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="eyebrow">This week's words</span>
                <span className="text-[13px] tabular text-ink-3">
                  <span className="font-semibold text-ink">
                    {usedCount} of {challenges.words.length}
                  </span>{" "}
                  · {challenges.targetCount} needed
                </span>
              </div>
              <div className="mt-3 flex gap-1" aria-hidden="true">
                {usedWordsStatus.map(({ word, isUsed }) => (
                  <span key={word} className={`h-[5px] flex-1 rounded-full transition-colors ${isUsed ? "bg-good" : "bg-tint-2"}`} />
                ))}
              </div>
            </div>

            <ul className="flex flex-wrap gap-2">
              {usedWordsStatus.map(({ word, isUsed }) => (
                <li
                  key={word}
                  className={`h-8 px-3 rounded-full border flex items-center gap-1.5 font-serif text-[15.5px] transition-colors ${
                    isUsed ? "bg-good-soft border-transparent text-good" : "border-line text-ink-2"
                  }`}
                >
                  {isUsed && <Check size={12} weight="bold" />}
                  {word}
                  <span className="sr-only">{isUsed ? "(used)" : "(not used yet)"}</span>
                </li>
              ))}
            </ul>

            <p className="mt-auto pt-4 border-t border-rule text-[14px] text-ink-2 leading-relaxed">
              Aim for sentences that sound natural, not clever. A plain word is better than a grand one in the wrong
              place.
            </p>
          </aside>
        </div>

        {analyzed && (
          <section className="card p-6 sm:p-8 pop" aria-labelledby="rubric-title">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="eyebrow">Teacher's feedback</span>
                <h2 id="rubric-title" className="mt-1 font-serif text-[28px] leading-tight tracking-[-0.015em]">
                  How you used each word
                </h2>
                <p className="mt-1 text-[14px] text-ink-3">Choose a word to read the teacher's note.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="tag tag-dot tag-good">8 of 8 target met</span>
                <span className="tag tag-dot tag-info">92% retention</span>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto -mx-2">
              <table className="w-full text-left text-[14px] min-w-[640px]">
                <thead>
                  <tr className="eyebrow text-[11px]">
                    <th className="font-semibold py-3 px-2">Word</th>
                    <th className="font-semibold py-3 px-2">Grammar</th>
                    <th className="font-semibold py-3 px-2">Sounds</th>
                    <th className="font-semibold py-3 px-2">Teacher's note</th>
                  </tr>
                </thead>
                <tbody>
                  {challenges.rubric.map((item, idx) => {
                    const nat = naturalness[item.natural] || { label: "Unnatural", tone: "tag-pen" };
                    return (
                      <tr
                        key={idx}
                        onClick={() => setSelectedWordNote(item)}
                        className={`border-t border-rule cursor-pointer transition-colors ${
                          selectedWordNote?.word === item.word ? "bg-inset" : "hover:bg-[#f6f3ec]"
                        }`}
                      >
                        <td className="py-3.5 px-2 font-serif text-[17px]">{item.word}</td>
                        <td className="py-3.5 px-2">
                          {item.correct ? (
                            <span className="tag tag-good">
                              <Check size={12} weight="bold" />
                              Correct
                            </span>
                          ) : (
                            <span className="tag tag-pen">
                              <X size={12} weight="bold" />
                              Incorrect
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-2">
                          <span className={`tag ${nat.tone}`}>
                            {item.natural === "⚠" && <Warning size={13} />}
                            {nat.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-ink-2">{item.note}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {selectedWordNote && (
              <div className="mt-6 panel-dark p-5 sm:p-6 flex items-start justify-between gap-4 fade">
                <div>
                  <div className="eyebrow text-night-mute">Teacher's note</div>
                  <div className="mt-2 font-serif text-[22px]">&ldquo;{selectedWordNote.word}&rdquo;</div>
                  <p className="mt-1 text-[15px] text-night-soft leading-relaxed">{selectedWordNote.note}</p>
                </div>
                <button
                  onClick={() => setSelectedWordNote(null)}
                  className="btn btn-icon text-night-mute hover:text-night-text hover:bg-white/10 shrink-0"
                  aria-label="Close note"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </AppLayout>
  );
}
