import React, { useState } from "react";
import { X, PencilSimple } from "@phosphor-icons/react";
import { useScribe } from "../../store";
import { Dialog } from "../ui/Dialog";

const statusTone = { mastered: "tag-good", practicing: "tag-warn", learning: "tag-info", new: "tag-pen" };

const Label = ({ children }) => <div className="eyebrow">{children}</div>;

export const VocabDetailDrawer = ({ wordItem, isOpen, onClose, onStartPractice }) => {
  const { updateVocabularyWord } = useScribe();
  const [editingDef, setEditingDef] = useState(false);
  const [tempDef, setTempDef] = useState("");

  if (!isOpen || !wordItem) return null;

  const handleSaveDef = () => {
    if (tempDef.trim()) updateVocabularyWord(wordItem.id, { personalDef: tempDef.trim() });
    setEditingDef(false);
  };

  const accuracy =
    wordItem.timesUsed > 0 ? Math.round((wordItem.timesUsedCorrectly / wordItem.timesUsed) * 100) : 100;

  return (
    <Dialog variant="drawer" onClose={onClose} labelledBy="vocab-drawer-title">
      <div className="px-6 pt-6 pb-5 flex items-start justify-between gap-4 border-b border-rule">
        <div>
          <div className="flex items-baseline gap-3">
            <h2 id="vocab-drawer-title" className="font-serif text-[40px] leading-none tracking-[-0.02em]">
              {wordItem.word}
            </h2>
            <span className="font-serif italic text-[16px] text-ink-3">{wordItem.pos?.toLowerCase()}</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[13px] text-ink-3">
            <span className={`tag tag-dot ${statusTone[wordItem.status] || ""} capitalize`}>{wordItem.status}</span>
            <span>Saved {wordItem.dateLearned}</span>
          </div>
        </div>
        <button onClick={onClose} className="btn btn-ghost btn-icon -mr-2" aria-label="Close">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">
        <div>
          <Label>Dictionary meaning</Label>
          <p className="mt-1.5 font-serif text-[19px] leading-[1.45]">{wordItem.correctDef}</p>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label>Your meaning</Label>
            {!editingDef && (
              <button
                onClick={() => {
                  setTempDef(wordItem.personalDef);
                  setEditingDef(true);
                }}
                className="btn btn-ghost btn-sm -mr-2"
              >
                <PencilSimple size={14} />
                <span>Edit</span>
              </button>
            )}
          </div>
          {editingDef ? (
            <div className="mt-2 space-y-2">
              <textarea
                rows={3}
                value={tempDef}
                onChange={(e) => setTempDef(e.target.value)}
                aria-label="Your meaning"
                className="field font-serif text-[16px] resize-none"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setEditingDef(false)} className="btn btn-ghost btn-sm">
                  Cancel
                </button>
                <button onClick={handleSaveDef} className="btn btn-primary btn-sm">
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1.5 font-serif italic text-[17px] leading-relaxed text-ink-2">
              {wordItem.personalDef ? `“${wordItem.personalDef}”` : "You have not written one yet."}
            </p>
          )}
        </div>

        {wordItem.contextSentence && (
          <div className="inset border border-edge p-4">
            <Label>Where you met it</Label>
            <p className="mt-1.5 font-serif italic text-[16px] leading-relaxed">&ldquo;{wordItem.contextSentence}&rdquo;</p>
          </div>
        )}

        {wordItem.collocations?.length > 0 && (
          <div>
            <Label>Goes with</Label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {wordItem.collocations.map((colloc, idx) => (
                <span key={idx} className="chip font-serif text-[14.5px] text-ink">
                  {colloc}
                </span>
              ))}
            </div>
          </div>
        )}

        {wordItem.example && (
          <div>
            <Label>In a sentence</Label>
            <p className="mt-1.5 font-serif italic text-[16px] leading-relaxed text-ink-2">&ldquo;{wordItem.example}&rdquo;</p>
          </div>
        )}

        <div className="fact-strip [&>*]:basis-[100px]">
          <div>
            <div className="font-serif text-[28px] leading-none tabular">{wordItem.timesUsed}</div>
            <div className="mt-1 text-[12.5px] text-ink-3">times used</div>
          </div>
          <div>
            <div className="font-serif text-[28px] leading-none tabular text-good">{wordItem.timesUsedCorrectly}</div>
            <div className="mt-1 text-[12.5px] text-ink-3">used well</div>
          </div>
          <div>
            <div className="font-serif text-[28px] leading-none tabular">{accuracy}%</div>
            <div className="mt-1 text-[12.5px] text-ink-3">accuracy</div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:px-6 flex items-center gap-3 border-t border-rule">
        <button onClick={onClose} className="btn btn-quiet flex-1">
          Close
        </button>
        {onStartPractice && (
          <button
            onClick={() => {
              onClose();
              onStartPractice(wordItem);
            }}
            className="btn btn-primary flex-1"
          >
            Practice this word
          </button>
        )}
      </div>
    </Dialog>
  );
};
