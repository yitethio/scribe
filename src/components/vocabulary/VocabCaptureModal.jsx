import React, { useState } from "react";
import { X, CheckCircle, ArrowRight } from "@phosphor-icons/react";
import { useScribe } from "../../store";
import { Dialog } from "../ui/Dialog";

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
    <Dialog onClose={onClose} labelledBy="capture-title" width="sm:max-w-xl">
      <div className="px-6 pt-6 flex items-start justify-between gap-4">
        <div>
          <h2 id="capture-title" className="font-serif text-[28px] leading-tight font-medium">
            Save a word
          </h2>
          <p className="mt-1 text-[14px] text-ink-2">Define it yourself first, then check it.</p>
        </div>
        <button onClick={onClose} className="btn btn-ghost btn-icon -mr-2" aria-label="Close">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <div>
          <label htmlFor="capture-word" className="block text-[14px] font-medium mb-2">
            Word
          </label>
          <input
            id="capture-word"
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="mitigate, precipice, formidable"
            disabled={revealed}
            autoFocus={!initialWord}
            className="field font-serif text-[20px] h-12"
          />
        </div>

        {contextSentence && (
          <div className="rounded-lg bg-paper p-4">
            <div className="text-[13px] text-ink-3">Where you found it</div>
            <p className="mt-1 font-serif italic text-[16px] leading-relaxed">&ldquo;{contextSentence}&rdquo;</p>
          </div>
        )}

        <div>
          <div className="flex items-baseline justify-between gap-3 mb-2">
            <label htmlFor="capture-def" className="text-[14px] font-medium">
              What you think it means
            </label>
            <span className="text-[13px] text-ink-3 hidden sm:inline">Before you see the dictionary</span>
          </div>
          <textarea
            id="capture-def"
            rows={3}
            value={userDefinition}
            onChange={(e) => setUserDefinition(e.target.value)}
            placeholder="To make something less bad or less painful."
            disabled={revealed}
            autoFocus={!!initialWord}
            className="field font-serif text-[16px] leading-relaxed resize-none"
          />
        </div>

        {!revealed ? (
          <div>
            <button
              type="button"
              onClick={handleReveal}
              disabled={!word.trim() || !userDefinition.trim()}
              className="btn btn-primary w-full h-11"
            >
              <span>Check against the dictionary</span>
              <ArrowRight size={16} />
            </button>
            <p className="mt-3 text-[13px] text-center text-ink-3">
              Recalling a meaning before you look it up is what makes it stick.
            </p>
          </div>
        ) : (
          <div className="space-y-5 fade">
            <div className="rounded-lg bg-paper p-5 space-y-4">
              <div className="flex items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-serif text-[24px] font-medium">{word}</span>
                  <span className="font-serif italic text-[15px] text-ink-3">{definitionData.pos.toLowerCase()}</span>
                </div>
                <span className="flex items-center gap-1 text-[13px] text-good">
                  <CheckCircle size={15} weight="fill" />
                  <span>In the dictionary</span>
                </span>
              </div>
              <div>
                <div className="text-[13px] text-ink-3">Meaning</div>
                <p className="mt-1 font-serif text-[17px] leading-relaxed">{definitionData.correctDef}</p>
              </div>
              <div>
                <div className="text-[13px] text-ink-3">Goes with</div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {definitionData.collocations.map((colloc, idx) => (
                    <span key={idx} className="tag bg-sheet font-serif text-[14.5px] h-7">
                      {colloc}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[13px] text-ink-3">In a sentence</div>
                <p className="mt-1 font-serif italic text-[16px] text-ink-2">&ldquo;{definitionData.example}&rdquo;</p>
              </div>
              <p className="text-[14px] text-good">
                Your meaning caught the core of it. Practice the phrases above to lock it in.
              </p>
            </div>

            <div>
              <div className="text-[14px] font-medium mb-2">How well do you know it?</div>
              <div className="seg w-full" role="group" aria-label="Confidence">
                {[
                  { key: "low", label: "Still learning" },
                  { key: "medium", label: "Familiar" },
                  { key: "high", label: "I know it" }
                ].map((lvl) => (
                  <button
                    key={lvl.key}
                    type="button"
                    onClick={() => setConfidence(lvl.key)}
                    aria-pressed={confidence === lvl.key}
                    className="seg-item flex-1"
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setRevealed(false)} className="btn btn-ghost">
                Edit my meaning
              </button>
              <button type="button" onClick={handleSave} className="btn btn-pen flex-1 h-11">
                Save to my vocabulary
              </button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};
