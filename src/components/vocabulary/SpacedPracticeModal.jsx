import React, { useState } from "react";
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw
} from "lucide-react";
import { useScribe } from "../../store/scribeContext";

export const SpacedPracticeModal = ({ wordItem, isOpen, onClose }) => {
  const { updateVocabularyWord, showToast } = useScribe();
  const [activeTab, setActiveTab] = useState("selection"); // 'recall' | 'usage' | 'selection' | 'transformation'
  const [selectedOption, setSelectedOption] = useState(null);
  const [userSentence, setUserSentence] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  if (!isOpen || !wordItem) return null;

  const currentWord = wordItem.word;

  // Options for selection drill
  const selectionDrill = {
    question: `Which sentence uses "${currentWord}" naturally and accurately?`,
    options: [
      {
        id: "opt-1",
        text: `The committee took immediate steps to ${currentWord} the negative consequences of the policy shift.`,
        correct: true,
        feedback: `Correct! In this context, "${currentWord}" serves its exact idiomatic purpose.`
      },
      {
        id: "opt-2",
        text: `He tried to ${currentWord} quickly toward the finish line before the rain began.`,
        correct: false,
        feedback: `Incorrect. "${currentWord}" is not a verb of physical movement or locomotion.`
      },
      {
        id: "opt-3",
        text: `She wore a very ${currentWord} dress that sparkled brightly under the chandeliers.`,
        correct: false,
        feedback: `Incorrect. This confuses the term with a sensory or decorative adjective.`
      }
    ]
  };

  const handleSelectOption = (opt) => {
    if (revealed) return;
    setSelectedOption(opt.id);
    setIsCorrect(opt.correct);
    setRevealed(true);
    if (opt.correct) {
      updateVocabularyWord(wordItem.id, {
        timesUsed: wordItem.timesUsed + 1,
        timesUsedCorrectly: wordItem.timesUsedCorrectly + 1,
        lastReviewed: "Just now"
      });
      showToast(`Mastery increased for "${currentWord}"!`, "success");
    }
  };

  const handleSentenceSubmit = (e) => {
    e.preventDefault();
    if (!userSentence.trim()) return;
    const hasWord = userSentence.toLowerCase().includes(currentWord.toLowerCase());
    setIsCorrect(hasWord);
    setRevealed(true);
    if (hasWord) {
      updateVocabularyWord(wordItem.id, {
        timesUsed: wordItem.timesUsed + 1,
        timesUsedCorrectly: wordItem.timesUsedCorrectly + 1,
        contextSentence: userSentence.trim()
      });
      showToast(`Logged usage for "${currentWord}" in your profile`, "success");
    }
  };

  const resetDrill = () => {
    setSelectedOption(null);
    setUserSentence("");
    setRevealed(false);
    setIsCorrect(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="bg-[#FAF8F5] border border-[#E4DDD1] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E2D8] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FAF0E6] text-[#B85D38] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-[#1A1A1E]">
                Spaced Practice: {currentWord}
              </h2>
              <p className="text-[11px] text-[#6B6F7B]">
                Contextual reinforcement & deliberate recall
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#848792] hover:text-[#1A1A1E] hover:bg-[#EAE4D9]/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-[#E8E2D8] bg-[#F5F1E9] px-6 text-xs font-semibold">
          {[
            { id: "selection", label: "Selection" },
            { id: "usage", label: "Write Usage" },
            { id: "recall", label: "Recall Meaning" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                resetDrill();
              }}
              className={`py-3 px-4 border-b-2 font-medium transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "border-[#1F2E3D] text-[#1F2E3D] font-bold bg-[#FAF8F5]"
                  : "border-transparent text-[#6B6F7B] hover:text-[#1A1A1E]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Drill content */}
        <div className="p-6 space-y-4">
          {activeTab === "selection" && (
            <div className="space-y-3">
              <div className="font-serif font-medium text-sm text-[#1A1A1E]">
                {selectionDrill.question}
              </div>

              <div className="space-y-2">
                {selectionDrill.options.map((opt) => {
                  const isThisSelected = selectedOption === opt.id;
                  let cardStyle = "bg-white border-[#DDD6C9] hover:border-[#1F2E3D]";

                  if (revealed) {
                    if (opt.correct) {
                      cardStyle = "bg-[#ECFDF5] border-[#10B981] text-[#065F46]";
                    } else if (isThisSelected && !opt.correct) {
                      cardStyle = "bg-[#FEF2F2] border-[#EF4444] text-[#991B1B]";
                    } else {
                      cardStyle = "bg-white/60 border-[#E5DFD4] opacity-50";
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt)}
                      disabled={revealed}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs font-serif leading-relaxed transition-all cursor-pointer ${cardStyle}`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 text-[11px] font-sans font-bold">
                          {opt.id.slice(-1)}
                        </span>
                        <div className="flex-1">{opt.text}</div>
                      </div>
                      {revealed && (isThisSelected || opt.correct) && (
                        <p className="mt-2 text-[11px] font-sans font-medium pl-7">
                          {opt.feedback}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "usage" && (
            <form onSubmit={handleSentenceSubmit} className="space-y-3">
              <div className="font-serif font-medium text-sm text-[#1A1A1E]">
                Write an authentic sentence using "{currentWord}" naturally.
              </div>

              <textarea
                rows={3}
                value={userSentence}
                onChange={(e) => setUserSentence(e.target.value)}
                placeholder={`Write your sentence here containing "${currentWord}"...`}
                disabled={revealed}
                className="w-full p-3 bg-white border border-[#DDD6C9] rounded-xl text-xs font-serif text-[#1A1A1E] focus:outline-hidden focus:border-[#1F2E3D]"
              />

              {!revealed ? (
                <button
                  type="submit"
                  disabled={!userSentence.trim()}
                  className="w-full py-2.5 bg-[#1F2E3D] hover:bg-[#15202B] disabled:bg-[#CCC5B8] text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Submit & Evaluate Sentence
                </button>
              ) : (
                <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-xs text-[#065F46] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sentence Saved!</span>
                  </div>
                  <p>
                    Great practice. Your usage of "{currentWord}" has been logged into your active writing history.
                  </p>
                </div>
              )}
            </form>
          )}

          {activeTab === "recall" && (
            <div className="space-y-3">
              <div className="font-serif font-medium text-sm text-[#1A1A1E]">
                Active Recall Drill
              </div>
              <p className="text-xs text-[#6B6F7B]">
                Before peeking, mentally recite or jot down what "{currentWord}" means and its most common collocation.
              </p>

              {!revealed ? (
                <button
                  onClick={() => setRevealed(true)}
                  className="w-full py-2.5 bg-[#B85D38] hover:bg-[#A04F2E] text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Reveal Master Definition
                </button>
              ) : (
                <div className="p-4 bg-white border border-[#E0D9CD] rounded-xl space-y-2 animate-in fade-in duration-150">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A8D96]">
                    Definition
                  </div>
                  <p className="font-serif text-xs text-[#1A1A1E]">
                    {wordItem.correctDef}
                  </p>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A8D96] pt-1">
                    Your Personal Definition Was:
                  </div>
                  <p className="font-serif italic text-xs text-[#52555F]">
                    "{wordItem.personalDef || "Not recorded"}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#E8E2D8] bg-[#F5F2EB] flex items-center justify-between">
          {revealed ? (
            <button
              onClick={resetDrill}
              className="text-xs text-[#6B6F7B] hover:text-[#1A1A1E] flex items-center gap-1 cursor-pointer font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          ) : (
            <span className="text-[11px] text-[#8C909B]">
              Spaced repetition interval: 3 days
            </span>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[#DDD6C9] hover:bg-[#F2ECE1] text-[#1A1A1E] text-xs font-semibold rounded-xl cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
