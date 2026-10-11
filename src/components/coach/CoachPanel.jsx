import React, { useState } from "react";
import {
  Sparkles,
  HelpCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Eye,
  ArrowRight,
  Sliders,
  AlertTriangle,
  Lightbulb,
  Check
} from "lucide-react";
import { useScribe } from "../../store/scribeContext";

export const CoachPanel = ({ onSelectIssue, activeIssueId, onSendToRevision }) => {
  const { state, updateCoachSettings, resolveCoachIssue } = useScribe();
  const { writingWorkspace } = state;
  const { coachLevel, issues } = writingWorkspace;

  const [expandedIssueId, setExpandedIssueId] = useState(activeIssueId || issues[0]?.id);
  const [hintRevealed, setHintRevealed] = useState({});
  const [explanationRevealed, setExplanationRevealed] = useState({});
  const [fixRevealed, setFixRevealed] = useState({});
  const [activeTab, setActiveTab] = useState("issues"); // 'issues' | 'cohesion' | 'clarity'

  const openIssues = issues.filter((i) => !i.resolved);

  const toggleHint = (id) => {
    setHintRevealed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExplanation = (id) => {
    setExplanationRevealed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFix = (id) => {
    setFixRevealed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-80 lg:w-96 bg-[#FAF8F5] border-l border-[#E2DBD0] flex flex-col h-full shadow-2xs">
      {/* Coach Header */}
      <div className="p-4 border-b border-[#E8E2D8] bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FAF0E6] text-[#B85D38] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm text-[#1A1A1E]">
              Writing Coach
            </h3>
            <span className="text-[10px] text-[#6B6F7B]">
              Pedagogical feedback mode
            </span>
          </div>
        </div>

        {/* Level Selector */}
        <div className="flex items-center gap-1 bg-[#F4EFE6] p-1 rounded-lg border border-[#E5DFD4]">
          {["minimal", "guided", "teacher", "review"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => updateCoachSettings({ coachLevel: lvl })}
              className={`px-2 py-0.5 text-[10px] capitalize font-medium rounded transition-all cursor-pointer ${
                coachLevel === lvl
                  ? "bg-[#1F2E3D] text-[#FAF8F5] font-bold shadow-2xs"
                  : "text-[#6B6F7B] hover:text-[#1A1A1E]"
              }`}
              title={`Coaching Level: ${lvl}`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E8E2D8] bg-[#F5F1E9] text-[11px] font-semibold text-[#6B6F7B]">
        <button
          onClick={() => setActiveTab("issues")}
          className={`flex-1 py-2.5 text-center border-b-2 transition-all cursor-pointer ${
            activeTab === "issues"
              ? "border-[#1F2E3D] text-[#1F2E3D] font-bold bg-[#FAF8F5]"
              : "border-transparent hover:text-[#1A1A1E]"
          }`}
        >
          Issues ({openIssues.length})
        </button>
        <button
          onClick={() => setActiveTab("cohesion")}
          className={`flex-1 py-2.5 text-center border-b-2 transition-all cursor-pointer ${
            activeTab === "cohesion"
              ? "border-[#1F2E3D] text-[#1F2E3D] font-bold bg-[#FAF8F5]"
              : "border-transparent hover:text-[#1A1A1E]"
          }`}
        >
          Cohesion
        </button>
        <button
          onClick={() => setActiveTab("clarity")}
          className={`flex-1 py-2.5 text-center border-b-2 transition-all cursor-pointer ${
            activeTab === "clarity"
              ? "border-[#1F2E3D] text-[#1F2E3D] font-bold bg-[#FAF8F5]"
              : "border-transparent hover:text-[#1A1A1E]"
          }`}
        >
          Clarity
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {activeTab === "issues" && (
          <>
            {openIssues.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#7A7E8B] space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-[#059669]" />
                <div className="font-serif font-bold text-sm text-[#1A1A1E]">
                  All current issues addressed
                </div>
                <p>Keep writing. The coach will analyze new passages as you compose.</p>
              </div>
            ) : (
              openIssues.map((issue) => {
                const isExpanded = expandedIssueId === issue.id;

                return (
                  <div
                    key={issue.id}
                    className={`rounded-xl border transition-all ${
                      isExpanded
                        ? "bg-white border-[#1F2E3D] shadow-xs ring-1 ring-[#1F2E3D]/10"
                        : "bg-white border-[#E4DDD1] hover:border-[#D5CDC0]"
                    }`}
                  >
                    {/* Collapsible header */}
                    <button
                      onClick={() => {
                        setExpandedIssueId(isExpanded ? null : issue.id);
                        if (onSelectIssue) onSelectIssue(issue);
                      }}
                      className="w-full text-left p-3.5 flex items-start justify-between gap-2 cursor-pointer"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: issue.categoryColor }}
                          />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B6F7B]">
                            {issue.category}
                          </span>
                        </div>
                        <div className="font-serif font-semibold text-xs text-[#1A1A1E]">
                          "{issue.phrase}"
                        </div>
                        <p className="text-[11px] text-[#555862] leading-tight line-clamp-2">
                          {issue.summary}
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-[#8C909B] shrink-0 mt-1" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#8C909B] shrink-0 mt-1" />
                      )}
                    </button>

                    {/* Expanded interactive teacher card */}
                    {isExpanded && (
                      <div className="px-3.5 pb-3.5 pt-1 border-t border-[#F0EBE0] space-y-3 text-xs">
                        {/* Pedagogical question */}
                        <div className="p-3 bg-[#FAF7F0] rounded-lg border border-[#EBE4D8] space-y-1">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A8D96] flex items-center gap-1">
                            <Lightbulb className="w-3 h-3 text-[#D97706]" />
                            <span>Teacher's Question</span>
                          </div>
                          <p className="font-serif italic text-xs text-[#1F2228] font-medium leading-relaxed">
                            "{issue.question}"
                          </p>
                        </div>

                        {/* Hint Button */}
                        <div>
                          {!hintRevealed[issue.id] ? (
                            <button
                              onClick={() => toggleHint(issue.id)}
                              className="text-[11px] font-semibold text-[#B85D38] hover:underline cursor-pointer flex items-center gap-1"
                            >
                              <span>+ Show Hint</span>
                            </button>
                          ) : (
                            <div className="p-2.5 bg-[#FAF8F5] rounded-lg border border-[#E5DFD4] text-[11px] text-[#4A4D56] animate-in fade-in duration-100">
                              <span className="font-bold text-[#1A1A1E]">Hint: </span>
                              {issue.hint}
                            </div>
                          )}
                        </div>

                        {/* Explanation Button (guided/teacher level) */}
                        {coachLevel !== "minimal" && (
                          <div>
                            {!explanationRevealed[issue.id] ? (
                              <button
                                onClick={() => toggleExplanation(issue.id)}
                                className="text-[11px] font-semibold text-[#1F2E3D] hover:underline cursor-pointer flex items-center gap-1"
                              >
                                <span>+ Show Linguistic Explanation</span>
                              </button>
                            ) : (
                              <div className="p-2.5 bg-[#F5F2EC] rounded-lg border border-[#E5DFD4] text-[11px] text-[#3E414A] leading-relaxed animate-in fade-in duration-100">
                                <span className="font-bold text-[#1A1A1E]">Why: </span>
                                {issue.explanation}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Revision Mode / Reveal Fix */}
                        <div className="pt-1 flex items-center gap-2">
                          <button
                            onClick={() => resolveCoachIssue(issue.id)}
                            className="flex-1 py-2 px-3 bg-[#1F2E3D] hover:bg-[#15202B] text-white text-[11px] font-semibold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            <span>Mark Corrected</span>
                          </button>

                          {onSendToRevision && (
                            <button
                              onClick={() => onSendToRevision(issue)}
                              className="py-2 px-3 bg-[#FAF8F5] hover:bg-[#F2ECE1] border border-[#DDD6C9] text-[#1A1A1E] text-[11px] font-semibold rounded-lg cursor-pointer"
                              title="Open in Revision Mode"
                            >
                              Revise in Lab
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}

        {/* Cohesion Tab */}
        {activeTab === "cohesion" && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-white border border-[#E4DDD1] rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-xs text-[#1A1A1E]">
                  Paragraph Flow & Transitions
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#DCFCE7] text-[#065F46] font-bold">
                  Cohesion 61%
                </span>
              </div>
              <p className="text-[11px] text-[#6B6F7B] leading-relaxed">
                Connective words should reflect true logical relationships, not merely stack sentences.
              </p>
            </div>

            <div className="p-3 bg-white border border-[#E4DDD1] rounded-xl space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">
                🟡 Weak Transition Detected
              </div>
              <p className="font-serif text-xs text-[#1A1A1E]">
                "Furthermore, the quick pace facilitates shallower interactions..."
              </p>
              <div className="text-[11px] text-[#555862]">
                <strong className="text-[#1A1A1E]">Question:</strong> What relationship are you establishing? Contrast? Cause & effect? Continuation?
              </div>
            </div>
          </div>
        )}

        {/* Clarity Tab */}
        {activeTab === "clarity" && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-white border border-[#E4DDD1] rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-xs text-[#1A1A1E]">
                  Clarity & Conciseness Audit
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#EDE9FE] text-[#6D28D9] font-bold">
                  Clarity 74%
                </span>
              </div>
              <p className="text-[11px] text-[#6B6F7B]">
                Trim clutter and deadwood phrases without sacrificing meaning.
              </p>
            </div>

            <div className="p-3 bg-white border border-[#E4DDD1] rounded-xl space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#7C3AED]">
                🟣 Verbose Expression
              </div>
              <p className="font-serif text-xs text-[#1A1A1E]">
                "Due to the fact that..."
              </p>
              <p className="text-[11px] text-[#555862]">
                Can you express the same idea in one word? (Try: "Because...")
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Rule Reminder */}
      <div className="p-3 border-t border-[#E8E2D8] bg-[#F5F2EB] text-[10px] text-[#8C909B] text-center">
        The coach asks & explains — you revise and master.
      </div>
    </div>
  );
};
