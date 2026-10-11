import React, { useState } from "react";
import {
  Trophy,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Clock,
  Send,
  Calendar,
  Check
} from "lucide-react";
import { useScribe } from "../store/scribeContext";
import { AppLayout } from "../components/layout/AppLayout";

export default function Challenges() {
  const { state, submitChallenge } = useScribe();
  const { challenges } = state;

  const [passageText, setPassageText] = useState(challenges.passage || "");
  const [analyzed, setAnalyzed] = useState(challenges.submitted || false);
  const [selectedWordNote, setSelectedWordNote] = useState(null);

  // Compute live word count
  const wordCount = passageText.trim().split(/\s+/).filter(Boolean).length;

  // Real-time detection of which target words are used in the passage
  const usedWordsStatus = challenges.words.map((word) => {
    const isUsed = new RegExp(`\\b${word}\\b`, "i").test(passageText);
    return { word, isUsed };
  });

  const usedCount = usedWordsStatus.filter((w) => w.isUsed).length;
  const isGoalMet = usedCount >= challenges.targetCount;
  const isLengthValid = wordCount >= 300 && wordCount <= 550;

  const handleSubmit = (e) => {
    e.preventDefault();
    setAnalyzed(true);
    submitChallenge(passageText);
  };

  return (
    <AppLayout
      title="Weekly Writing Challenge"
      subtitle="Synthesize your newly acquired vocabulary into cohesive, deliberate prose"
    >
      <div className="p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-150">
        {/* Challenge Briefing Card */}
        <div className="p-6 bg-white border border-[#E4DDD1] rounded-2xl shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E]">
                Week 42 Challenge
              </span>
              <span className="text-xs text-[#8A8D96]">•</span>
              <span className="text-xs font-semibold text-[#D97706] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Deadline: {challenges.deadline}</span>
              </span>
            </div>
            <span className="text-xs text-[#6B6F7B]">
              Goal: <strong>300–500 words</strong> • Use at least <strong>8 words</strong>
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="font-serif font-bold text-2xl text-[#1A1A1E]">
              Prompt: "{challenges.theme}"
            </h2>
            <p className="text-xs text-[#5E626E] max-w-3xl leading-relaxed">
              You have acquired <strong>{challenges.learnedWordsCount} new vocabulary words</strong> this week.
              Draft an original argumentative or reflective passage exploring this theme, integrating at least {challenges.targetCount} target words with idiomatic precision.
            </p>
          </div>
        </div>

        {/* Two-Column Workspace: Palette on Left/Right & Writing Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Writing Canvas (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#E4DDD1] shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#6B6F7B]">
                <span className="font-serif font-semibold text-[#1A1A1E]">
                  Your Draft Passage
                </span>
                <div className="flex items-center gap-3">
                  <span className={`font-mono font-bold ${wordCount >= 300 && wordCount <= 500 ? "text-[#059669]" : "text-[#1A1A1E]"}`}>
                    {wordCount} / 300-500 words
                  </span>
                  <span>•</span>
                  <span className={`font-semibold ${isGoalMet ? "text-[#059669]" : "text-[#B85D38]"}`}>
                    {usedCount} of {challenges.targetCount} words applied
                  </span>
                </div>
              </div>

              <textarea
                rows={12}
                value={passageText}
                onChange={(e) => {
                  setPassageText(e.target.value);
                  if (analyzed) setAnalyzed(false);
                }}
                placeholder="Write your original passage here. Focus on sentence flow, direct transitions, and placing your vocabulary words where they belong naturally..."
                className="w-full p-4 bg-[#FAF8F5] border border-[#DDD6C9] rounded-xl text-base font-serif-prose leading-[1.85] text-[#1A1A1E] focus:outline-hidden focus:border-[#1F2E3D] transition-all resize-none"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[11px] text-[#8C909B]">
                Deliberate writing rule: The AI does not generate or rewrite your sentences.
              </p>

              <button
                onClick={handleSubmit}
                disabled={wordCount < 50}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#1F2E3D] hover:bg-[#15202B] disabled:bg-[#CCC5B8] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit & Analyze Usage</span>
              </button>
            </div>
          </div>

          {/* Target Vocabulary Palette (4 cols) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#E4DDD1] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-[#1A1A1E]">
                  Target Vocabulary
                </h3>
                <p className="text-[11px] text-[#6B6F7B]">
                  Live usage detection as you type
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#1F2E3D] px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E5DFD4]">
                {usedCount}/{challenges.words.length}
              </span>
            </div>

            <div className="space-y-1.5">
              {usedWordsStatus.map(({ word, isUsed }) => (
                <div
                  key={word}
                  className={`p-2 rounded-xl border text-xs flex items-center justify-between transition-all ${
                    isUsed
                      ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46] font-semibold"
                      : "bg-[#FAF8F5] border-[#E8E2D8] text-[#555861]"
                  }`}
                >
                  <span className="font-serif">{word}</span>
                  {isUsed ? (
                    <span className="text-[10px] font-bold flex items-center gap-1 text-[#059669]">
                      <Check className="w-3 h-3" />
                      <span>Applied</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#9CA3AF]">Pending</span>
                  )}
                </div>
              ))}
            </div>

            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EDE7DC] text-[11px] text-[#5E626E]">
              Tip: Aim for syntactic naturalness over forced complexity. Avoid using advanced words where plain nouns suffice.
            </div>
          </div>
        </div>

        {/* Post-Submission AI Analysis Rubric Table */}
        {analyzed && (
          <div className="p-6 bg-white border border-[#E4DDD1] rounded-2xl shadow-2xs space-y-5 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E2D8] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
                  <h3 className="font-serif font-bold text-lg text-[#1A1A1E]">
                    AI Vocabulary Usage Rubric
                  </h3>
                </div>
                <p className="text-xs text-[#6B6F7B]">
                  Click on any row to view grammatical and idiomatic feedback
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="px-2.5 py-1 rounded bg-[#DCFCE7] text-[#065F46] font-bold">
                  8/8 Target Met
                </span>
                <span className="px-2.5 py-1 rounded bg-[#FAF0E6] text-[#B85D38] font-bold">
                  Retention Rating: 92%
                </span>
              </div>
            </div>

            {/* Rubric Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E8E2D8] text-[10px] font-bold uppercase tracking-wider text-[#8A8D96] bg-[#FAF8F5]">
                    <th className="py-3 px-4">Vocabulary Word</th>
                    <th className="py-3 px-3 text-center">Used</th>
                    <th className="py-3 px-3 text-center">Grammatically Correct</th>
                    <th className="py-3 px-3 text-center">Idiomatically Natural</th>
                    <th className="py-3 px-4">Pedagogical Evaluation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EDE4] font-serif">
                  {challenges.rubric.map((item, idx) => (
                    <tr
                      key={idx}
                      onClick={() => setSelectedWordNote(item)}
                      className="hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-bold text-[#1A1A1E]">
                        {item.word}
                      </td>
                      <td className="py-3 px-3 text-center font-sans font-bold text-[#059669]">
                        ✓
                      </td>
                      <td className="py-3 px-3 text-center font-sans font-bold text-[#059669]">
                        {item.correct ? "✓" : "✕"}
                      </td>
                      <td className="py-3 px-3 text-center font-sans font-bold">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[11px] ${
                            item.natural === "✓"
                              ? "bg-[#DCFCE7] text-[#065F46]"
                              : item.natural === "⚠"
                              ? "bg-[#FEF3C7] text-[#92400E]"
                              : "bg-[#FEE2E2] text-[#991B1B]"
                          }`}
                        >
                          {item.natural}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans text-xs text-[#4A4D56]">
                        {item.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Selected Word Pedagogical Drawer / Note */}
            {selectedWordNote && (
              <div className="p-4 bg-[#F5EFE4] border border-[#E2D8C7] rounded-xl flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-serif font-bold text-sm text-[#1A1A1E]">
                    Teacher's Assessment: "{selectedWordNote.word}"
                  </div>
                  <p className="text-xs text-[#3E424B] leading-relaxed">
                    {selectedWordNote.note}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedWordNote(null)}
                  className="text-xs text-[#7A7E8B] hover:text-[#1A1A1E] cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
