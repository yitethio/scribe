import React, { useState } from "react";
import { X, CheckCircle, XCircle, ArrowCounterClockwise } from "@phosphor-icons/react";
import { useScribe } from "../../store/scribeContext";
import { Dialog } from "../ui/Dialog";

const drills = [
  { id: "selection", label: "Pick the sentence" },
  { id: "usage", label: "Write a sentence" },
  { id: "recall", label: "Recall the meaning" }
];

export const SpacedPracticeModal = ({ wordItem, isOpen, onClose }) => {
  const { updateVocabularyWord, showToast } = useScribe();
  const [activeTab, setActiveTab] = useState("selection");
  const [selectedOption, setSelectedOption] = useState(null);
  const [userSentence, setUserSentence] = useState("");
  const [revealed, setRevealed] = useState(false);

  if (!isOpen || !wordItem) return null;

  const currentWord = wordItem.word;

  const selectionDrill = {
    question: `Which sentence uses “${currentWord}” naturally?`,
    options: [
      {
        id: "a",
        text: `The committee took immediate steps to ${currentWord} the negative consequences of the policy shift.`,
        correct: true,
        feedback: `Right. Here “${currentWord}” does exactly the job it is meant for.`
      },
      {
        id: "b",
        text: `He tried to ${currentWord} quickly toward the finish line before the rain began.`,
        correct: false,
        feedback: `Not this one. “${currentWord}” is not a verb of movement.`
      },
      {
        id: "c",
        text: `She wore a very ${currentWord} dress that sparkled brightly under the chandeliers.`,
        correct: false,
        feedback: `Not this one. It treats the word as a decorative adjective.`
      }
    ]
  };

  const handleSelectOption = (opt) => {
    if (revealed) return;
    setSelectedOption(opt.id);
    setRevealed(true);
    if (opt.correct) {
      updateVocabularyWord(wordItem.id, {
        timesUsed: wordItem.timesUsed + 1,
        timesUsedCorrectly: wordItem.timesUsedCorrectly + 1,
        lastReviewed: "Just now"
      });
      showToast(`Mastery increased for “${currentWord}”`, "success");
    }
  };

  const handleSentenceSubmit = (e) => {
    e.preventDefault();
    if (!userSentence.trim()) return;
    const hasWord = userSentence.toLowerCase().includes(currentWord.toLowerCase());
    setRevealed(true);
    if (hasWord) {
      updateVocabularyWord(wordItem.id, {
        timesUsed: wordItem.timesUsed + 1,
        timesUsedCorrectly: wordItem.timesUsedCorrectly + 1,
        contextSentence: userSentence.trim()
      });
      showToast(`Logged your use of “${currentWord}”`, "success");
    }
  };

  const resetDrill = () => {
    setSelectedOption(null);
    setUserSentence("");
    setRevealed(false);
  };

  const sentenceUsesWord = userSentence.toLowerCase().includes(currentWord.toLowerCase());

  return (
    <Dialog onClose={onClose} labelledBy="practice-title">
      <div className="px-6 pt-6 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Spaced practice</p>
          <h2 id="practice-title" className="mt-2 font-serif text-[36px] leading-none tracking-[-0.02em]">
            {currentWord}
          </h2>
        </div>
        <button onClick={onClose} className="btn btn-ghost btn-icon -mr-2" aria-label="Close">
          <X size={18} />
        </button>
      </div>

      <div className="px-6 pt-5">
        <div className="seg w-full" role="tablist">
          {drills.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                resetDrill();
              }}
              className="seg-item flex-1 px-2"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "selection" && (
          <div className="space-y-4">
            <p className="font-serif text-[19px]">{selectionDrill.question}</p>
            <ol className="space-y-2">
              {selectionDrill.options.map((opt) => {
                const picked = selectedOption === opt.id;
                let tone = "bg-sheet border-edge hover:border-line";
                if (revealed) {
                  if (opt.correct) tone = "bg-good-soft border-good/30 text-good";
                  else if (picked) tone = "bg-pen-soft border-pen/30 text-pen-deep";
                  else tone = "bg-sheet border-edge opacity-50";
                }
                return (
                  <li key={opt.id}>
                    <button
                      onClick={() => handleSelectOption(opt)}
                      disabled={revealed}
                      className={`w-full text-left p-4 rounded-xl border transition-colors ${tone}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-tint text-[12px] font-semibold uppercase flex items-center justify-center shrink-0">{opt.id}</span>
                        <span className="font-serif text-[16px] leading-relaxed">{opt.text}</span>
                      </div>
                      {revealed && (picked || opt.correct) && (
                        <p className="mt-2 pl-9 text-[14px] font-medium">{opt.feedback}</p>
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        {activeTab === "usage" && (
          <form onSubmit={handleSentenceSubmit} className="space-y-4">
            <label htmlFor="usage-sentence" className="block font-serif text-[19px]">
              Write a sentence of your own that uses “{currentWord}”.
            </label>
            <textarea
              id="usage-sentence"
              rows={3}
              value={userSentence}
              onChange={(e) => setUserSentence(e.target.value)}
              placeholder={`A sentence with “${currentWord}” in it`}
              disabled={revealed}
              className="field font-serif text-[16px] resize-none"
            />
            {!revealed ? (
              <button type="submit" disabled={!userSentence.trim()} className="btn btn-primary w-full h-11">
                Check my sentence
              </button>
            ) : sentenceUsesWord ? (
              <p className="flex items-start gap-2 rounded-xl bg-good-soft text-good p-4 text-[14.5px]">
                <CheckCircle size={18} weight="fill" className="shrink-0 mt-0.5" />
                <span>Saved. This use of “{currentWord}” is now part of your writing history.</span>
              </p>
            ) : (
              <p className="flex items-start gap-2 rounded-xl bg-pen-soft text-pen-deep p-4 text-[14.5px]">
                <XCircle size={18} weight="fill" className="shrink-0 mt-0.5" />
                <span>The sentence does not use “{currentWord}” yet. Try again.</span>
              </p>
            )}
          </form>
        )}

        {activeTab === "recall" && (
          <div className="space-y-4">
            <p className="font-serif text-[19px]">
              Before you look, say what “{currentWord}” means and a phrase it often appears in.
            </p>
            {!revealed ? (
              <button onClick={() => setRevealed(true)} className="btn btn-primary w-full h-11">
                Show the meaning
              </button>
            ) : (
              <div className="inset border border-edge p-5 space-y-4 fade">
                <div>
                  <div className="eyebrow">Dictionary meaning</div>
                  <p className="mt-1 font-serif text-[17px] leading-relaxed">{wordItem.correctDef}</p>
                </div>
                <div>
                  <div className="eyebrow">What you wrote when you saved it</div>
                  <p className="mt-1 font-serif italic text-[16px] text-ink-2">
                    {wordItem.personalDef ? `“${wordItem.personalDef}”` : "Nothing recorded"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-6 py-4 flex items-center justify-between border-t border-rule">
        {revealed ? (
          <button onClick={resetDrill} className="btn btn-ghost btn-sm -ml-2">
            <ArrowCounterClockwise size={15} />
            <span>Try again</span>
          </button>
        ) : (
          <span className="tag tag-info">Next review in 3 days</span>
        )}
        <button onClick={onClose} className="btn btn-quiet btn-sm">
          Done
        </button>
      </div>
    </Dialog>
  );
};
