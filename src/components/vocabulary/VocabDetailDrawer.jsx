import React, { useState } from "react";
import {
  X,
  Sparkles,
  Edit3,
  Bookmark
} from "lucide-react";
import { useScribe } from "../../store";

export const VocabDetailDrawer = ({ wordItem, isOpen, onClose, onStartPractice }) => {
  const { updateVocabularyWord } = useScribe();
  const [editingDef, setEditingDef] = useState(false);
  const [tempDef, setTempDef] = useState("");

  if (!isOpen || !wordItem) return null;

  const handleSaveDef = () => {
    if (tempDef.trim()) {
      updateVocabularyWord(wordItem.id, { personalDef: tempDef.trim() });
    }
    setEditingDef(false);
  };

  const accuracy = wordItem.timesUsed > 0
    ? Math.round((wordItem.timesUsedCorrectly / wordItem.timesUsed) * 100)
    : 100;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/35 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl border-l border-[#E2DBD0] flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#E8E2D8] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FAF0E6] text-[#B85D38] flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-xl text-[#1A1A1E]">
                  {wordItem.word}
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EFE9DD] text-[#555861] font-medium">
                  {wordItem.pos}
                </span>
              </div>
              <p className="text-[11px] text-[#7C808D]">
                Added on {wordItem.dateLearned}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#848792] hover:text-[#1A1A1E] hover:bg-[#F0EBE0] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Master definition */}
          <div className="p-4 bg-white border border-[#E4DDD1] rounded-xl shadow-2xs space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A8D96]">
              Master Definition
            </div>
            <p className="font-serif text-xs text-[#22252B] leading-relaxed">
              {wordItem.correctDef}
            </p>
          </div>

          {/* User's Own Definition */}
          <div className="p-4 bg-white border border-[#E4DDD1] rounded-xl shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A8D96]">
                My Personal Definition
              </div>
              {!editingDef && (
                <button
                  onClick={() => {
                    setTempDef(wordItem.personalDef);
                    setEditingDef(true);
                  }}
                  className="text-[11px] text-[#B85D38] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {editingDef ? (
              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={tempDef}
                  onChange={(e) => setTempDef(e.target.value)}
                  className="w-full p-2 bg-[#FAF8F5] border border-[#DDD6C9] rounded-lg text-xs font-serif text-[#1A1A1E] focus:outline-hidden focus:border-[#1F2E3D]"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingDef(false)}
                    className="px-2.5 py-1 text-xs text-[#6B6F7B] hover:text-[#1A1A1E]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveDef}
                    className="px-3 py-1 bg-[#1F2E3D] text-white text-xs font-semibold rounded-md"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="font-serif italic text-xs text-[#3E424B] leading-relaxed">
                "{wordItem.personalDef || "No personal definition recorded."}"
              </p>
            )}
          </div>

          {/* Context where encountered */}
          {wordItem.contextSentence && (
            <div className="p-4 bg-[#F5EFE4] border border-[#E2D8C7] rounded-xl space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#7A756C]">
                Encountered in Your Writing / Reading
              </div>
              <p className="font-serif italic text-xs text-[#2A2E35] leading-relaxed">
                "{wordItem.contextSentence}"
              </p>
            </div>
          )}

          {/* Common Collocations */}
          {wordItem.collocations && wordItem.collocations.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A8D96]">
                Natural Collocations
              </div>
              <div className="flex flex-wrap gap-1.5">
                {wordItem.collocations.map((colloc, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-white text-[#2C313C] rounded-lg text-xs font-mono border border-[#E5DFD4] shadow-2xs"
                  >
                    {colloc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Literary Example */}
          {wordItem.example && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A8D96]">
                Literary Example
              </div>
              <p className="font-serif italic text-xs text-[#52555F] bg-white p-3 rounded-xl border border-[#E5DFD4] shadow-2xs leading-relaxed">
                "{wordItem.example}"
              </p>
            </div>
          )}

          {/* Learning Metrics & Spaced Repetition stats */}
          <div className="p-4 bg-white border border-[#E4DDD1] rounded-xl shadow-2xs space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A8D96]">
              Retention & Mastery Metrics
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-[#FAF8F5] rounded-lg border border-[#EDE7DC]">
                <div className="text-xs text-[#7A7E8B]">Times Used</div>
                <div className="font-serif font-bold text-base text-[#1A1A1E]">
                  {wordItem.timesUsed}
                </div>
              </div>
              <div className="p-2 bg-[#FAF8F5] rounded-lg border border-[#EDE7DC]">
                <div className="text-xs text-[#7A7E8B]">Correct</div>
                <div className="font-serif font-bold text-base text-[#059669]">
                  {wordItem.timesUsedCorrectly}
                </div>
              </div>
              <div className="p-2 bg-[#FAF8F5] rounded-lg border border-[#EDE7DC]">
                <div className="text-xs text-[#7A7E8B]">Accuracy</div>
                <div className="font-serif font-bold text-base text-[#1F2E3D]">
                  {accuracy}%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs text-[#6B6F7B]">
              <span>Current Status:</span>
              <span className="font-bold capitalize text-[#1A1A1E] px-2 py-0.5 rounded bg-[#FAF0E6] text-[#B85D38]">
                {wordItem.status}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8E2D8] bg-white flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-[#FAF8F5] hover:bg-[#F2ECE1] text-[#1A1A1E] text-xs font-semibold rounded-xl border border-[#DDD6C9] transition-colors cursor-pointer"
          >
            Close
          </button>
          {onStartPractice && (
            <button
              onClick={() => {
                onClose();
                onStartPractice(wordItem);
              }}
              className="flex-1 py-2.5 px-4 bg-[#1F2E3D] hover:bg-[#15202B] text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Practice Word</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
