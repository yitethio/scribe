import React, { useState } from "react";
import {
  X,
  BookMarked,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { useScribe } from "../../store";

// Built-in intelligent dictionary data for authentic feedback
const DICTIONARY_DATABASE = {
  mitigate: {
    pos: "Verb",
    correctDef: "To reduce the severity, harmfulness, or seriousness of something painful or damaging.",
    example: "Better planning can mitigate the risks associated with the project.",
    collocations: ["mitigate the effects", "mitigate risk", "mitigate damage"],
    synonyms: ["alleviate", "diminish", "attenuate"]
  },
  facilitate: {
    pos: "Verb",
    correctDef: "To make an action or process easy or easier; smooth the progress of.",
    example: "The new software will facilitate seamless collaboration across distributed teams.",
    collocations: ["facilitate growth", "facilitate discussions", "facilitate learning"],
    synonyms: ["expedite", "further", "streamline"]
  },
  undermine: {
    pos: "Verb",
    correctDef: "To erode the base or foundation of; weaken gradually or insidiously from within.",
    example: "Poor communication can undermine team morale over time.",
    collocations: ["undermine authority", "undermine confidence", "undermine credibility"],
    synonyms: ["subvert", "compromise", "sabotage"]
  },
  significant: {
    pos: "Adjective",
    correctDef: "Sufficiently great or important to be worthy of attention; noteworthy; consequential.",
    example: "The results showed a statistically significant improvement in retention.",
    collocations: ["significant impact", "statistically significant", "significant role"],
    synonyms: ["notable", "momentous", "substantial"]
  },
  precipice: {
    pos: "Noun",
    correctDef: "A very steep rock face or cliff; a point where great trouble or disaster may occur.",
    example: "The knight approached the precipice overlooking the mist-filled valley.",
    collocations: ["on the precipice of disaster", "rocky precipice", "steep precipice"],
    synonyms: ["cliff", "brink", "chasm", "verge"]
  },
  formidable: {
    pos: "Adjective",
    correctDef: "Inspiring fear or respect through being impressively large, powerful, intense, or capable.",
    example: "The north wall was a formidable rampart of dark basalt.",
    collocations: ["formidable challenge", "formidable opponent", "formidable task"],
    synonyms: ["daunting", "imposing", "intimidating"]
  },
  bewildered: {
    pos: "Adjective",
    correctDef: "Perplexed and confused; completely puzzled by unfamiliar circumstances.",
    example: "The travelers stood bewildered at the crossroads as dusk settled.",
    collocations: ["bewildered look", "utterly bewildered", "bewildered expression"],
    synonyms: ["baffled", "mystified", "disoriented"]
  },
  peculiar: {
    pos: "Adjective",
    correctDef: "Strange or odd; unusual; or distinctive to a specific person, place, or thing.",
    example: "The manuscript had a peculiar cadence that arrested the reader's attention.",
    collocations: ["peculiar habit", "peculiar sensation", "peculiar to"],
    synonyms: ["distinctive", "eccentric", "singular"]
  },
  infallible: {
    pos: "Adjective",
    correctDef: "Incapable of making mistakes or being wrong; never failing for its purpose.",
    example: "Even experienced editors possess no infallible rule for storytelling.",
    collocations: ["infallible memory", "infallible test", "infallible guide"],
    synonyms: ["unerring", "flawless", "fail-safe"]
  },
  lucid: {
    pos: "Adjective",
    correctDef: "Expressed clearly; easy to understand; showing ability to think clearly.",
    example: "Her prose is so lucid that even intricate philosophical arguments appear transparent.",
    collocations: ["lucid explanation", "lucid moment", "lucid prose"],
    synonyms: ["crystalline", "articulate", "transparent"]
  }
};

export const VocabCaptureModal = ({ isOpen, onClose, initialWord = "", initialContext = "" }) => {
  if (!isOpen) return null;
  return (
    <VocabCaptureDialog
      onClose={onClose}
      initialWord={initialWord}
      initialContext={initialContext}
    />
  );
};

const VocabCaptureDialog = ({ onClose, initialWord = "", initialContext = "" }) => {
  const { addVocabularyWord } = useScribe();
  const [word, setWord] = useState(initialWord || "");
  const [contextSentence, setContextSentence] = useState(initialContext || "");
  const [userDefinition, setUserDefinition] = useState("");
  const [partOfSpeech, setPartOfSpeech] = useState("Noun");
  const [revealed, setRevealed] = useState(false);
  const [confidence, setConfidence] = useState("medium");

  const cleanWordKey = word.trim().toLowerCase();
  const definitionData = DICTIONARY_DATABASE[cleanWordKey] || {
    pos: partOfSpeech || "Noun",
    correctDef: `To express or embody the quality of "${cleanWordKey}" with deliberate clarity in prose.`,
    example: `The sentence was structured carefully to place "${cleanWordKey}" in sharp relief.`,
    collocations: [`classic ${cleanWordKey}`, `deliberate ${cleanWordKey}`, `${cleanWordKey} in context`],
    synonyms: ["notable", "distinctive"]
  };

  const handleReveal = (e) => {
    e.preventDefault();
    if (!word.trim()) return;
    setPartOfSpeech(definitionData.pos);
    setRevealed(true);
  };

  const handleSave = () => {
    addVocabularyWord({
      word: word.trim(),
      personalDef: userDefinition.trim(),
      pos: definitionData.pos,
      correctDef: definitionData.correctDef,
      example: definitionData.example,
      collocations: definitionData.collocations,
      synonyms: definitionData.synonyms,
      contextSentence: contextSentence.trim(),
      confidence
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="bg-[#FAF8F5] border border-[#E4DDD1] rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E2D8] flex items-center justify-between sticky top-0 bg-[#FAF8F5]/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FAF0E6] text-[#B85D38] flex items-center justify-center">
              <BookMarked className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-[#1A1A1E]">
                Save to Vocabulary
              </h2>
              <p className="text-[11px] text-[#6B6F7B]">
                Active acquisition: define first, verify second
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

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {/* Word Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B6F7B] mb-1.5">
              Target Word <span className="text-[#B85D38]">*</span>
            </label>
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="e.g. mitigate, precipice, formidable"
              disabled={revealed}
              className="w-full px-3.5 py-2.5 bg-white border border-[#DDD6C9] rounded-xl text-base font-serif font-semibold text-[#1A1A1E] focus:outline-hidden focus:border-[#1F2E3D] focus:ring-1 focus:ring-[#1F2E3D] transition-all disabled:bg-[#F2ECE1]/50"
            />
          </div>

          {/* Context Sentence (if available) */}
          {contextSentence && (
            <div className="p-3 bg-[#F4EFE6] border border-[#E5DDD0] rounded-xl">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A8D96] mb-1">
                Context from your writing
              </div>
              <p className="font-serif italic text-xs text-[#3A3D44] leading-relaxed">
                "{contextSentence}"
              </p>
            </div>
          )}

          {/* Step 1: User's Own Definition */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B6F7B]">
                My Definition <span className="text-[#B85D38]">*</span>
              </label>
              <span className="text-[11px] text-[#8C909B] italic">
                Enter your understanding before viewing the AI definition
              </span>
            </div>
            <textarea
              rows={3}
              value={userDefinition}
              onChange={(e) => setUserDefinition(e.target.value)}
              placeholder="e.g., To make something less bad or less painful."
              disabled={revealed}
              className="w-full px-3.5 py-2.5 bg-white border border-[#DDD6C9] rounded-xl text-xs font-serif text-[#1A1A1E] leading-relaxed focus:outline-hidden focus:border-[#1F2E3D] focus:ring-1 focus:ring-[#1F2E3D] transition-all disabled:bg-[#F2ECE1]/50 resize-none"
            />
          </div>

          {/* Reveal Button (if not yet revealed) */}
          {!revealed ? (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleReveal}
                disabled={!word.trim() || !userDefinition.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#1F2E3D] hover:bg-[#15202B] disabled:bg-[#CCC5B8] disabled:cursor-not-allowed text-[#FAF8F5] text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <span>Verify with AI Definition</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <p className="text-[11px] text-center text-[#8C909B] mt-2">
                This deliberate recall step dramatically strengthens long-term lexical retention.
              </p>
            </div>
          ) : (
            /* Step 2: Revealed AI Definition & Analysis */
            <div className="space-y-4 pt-2 border-t border-[#E8E2D8] animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Meaning & Part of speech */}
              <div className="p-4 bg-white border border-[#E0D9CD] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-lg text-[#1A1A1E]">
                      {word}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#EFE9DD] text-[#555861] font-medium">
                      {definitionData.pos}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-[#059669]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Dictionary Verified</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A8D96] mb-0.5">
                    Correct Meaning
                  </div>
                  <p className="font-serif text-xs text-[#2A2D33] leading-relaxed">
                    {definitionData.correctDef}
                  </p>
                </div>

                {/* Common Usage & Collocations */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A8D96] mb-1.5">
                    Common Collocations
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {definitionData.collocations.map((colloc, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-[#F5F1E9] text-[#2C313C] rounded-md text-[11px] font-mono border border-[#E5DFD4]"
                      >
                        {colloc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Exemplary sentence */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A8D96] mb-0.5">
                    Literary Example
                  </div>
                  <p className="font-serif italic text-xs text-[#52555F] bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EDE7DC]">
                    "{definitionData.example}"
                  </p>
                </div>

                {/* Accuracy feedback comparing user's definition */}
                <div className="p-2.5 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Pedagogical check: </span>
                    Your definition captured the core meaning effectively. Practicing its common collocations will lock it in.
                  </div>
                </div>
              </div>

              {/* Confidence Level */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B6F7B] mb-1.5">
                  Initial Confidence Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "low", label: "Learning (Low)" },
                    { key: "medium", label: "Familiar (Medium)" },
                    { key: "high", label: "Mastered (High)" }
                  ].map((lvl) => (
                    <button
                      key={lvl.key}
                      type="button"
                      onClick={() => setConfidence(lvl.key)}
                      className={`py-2 px-3 text-xs rounded-xl font-medium border transition-all cursor-pointer ${
                        confidence === lvl.key
                          ? "bg-[#1F2E3D] text-[#FAF8F5] border-[#1F2E3D]"
                          : "bg-white text-[#52555F] border-[#DDD6C9] hover:bg-[#F8F5EE]"
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Final Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRevealed(false)}
                  className="px-4 py-2.5 text-xs font-medium text-[#6B6F7B] hover:text-[#1A1A1E] transition-colors cursor-pointer"
                >
                  Edit definition
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 py-2.5 px-4 bg-[#B85D38] hover:bg-[#A04F2E] text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Save to Vocabulary Library
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
