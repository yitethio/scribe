import React, { useState } from "react";
import { CaretDown, CheckCircle, Check, Question } from "@phosphor-icons/react";
import { useScribe } from "../../store/scribeContext";

const levels = ["minimal", "guided", "teacher", "review"];

const tabs = [
  { id: "issues", label: "Issues" },
  { id: "cohesion", label: "Cohesion" },
  { id: "clarity", label: "Clarity" }
];

const sentenceCase = (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

export const CoachPanel = ({ onSelectIssue, activeIssueId, onSendToRevision }) => {
  const { state, updateCoachSettings, resolveCoachIssue } = useScribe();
  const { writingWorkspace } = state;
  const { coachLevel, issues } = writingWorkspace;

  const [expandedIssueId, setExpandedIssueId] = useState(activeIssueId || issues[0]?.id);
  const [hintRevealed, setHintRevealed] = useState({});
  const [explanationRevealed, setExplanationRevealed] = useState({});
  const [activeTab, setActiveTab] = useState("issues");

  const openIssues = issues.filter((i) => !i.resolved);

  const toggle = (setter, id) => setter((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <aside className="w-full lg:w-[380px] xl:w-[400px] bg-rail flex flex-col lg:h-full shrink-0" aria-label="Writing coach">
      <div className="px-5 pt-5 pb-4 space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-serif text-[22px] font-medium tracking-[-0.01em]">Your coach</h2>
          <span className="text-[13px] text-ink-3">It asks. You revise.</span>
        </div>
        <div className="seg w-full" role="group" aria-label="How much the coach says">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => updateCoachSettings({ coachLevel: lvl })}
              aria-pressed={coachLevel === lvl}
              className="seg-item flex-1 capitalize"
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 flex gap-5 text-[14px]" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-ink text-ink font-medium"
                : "border-transparent text-ink-3 hover:text-ink"
            }`}
          >
            {tab.label}
            {tab.id === "issues" && <span className="ml-1.5 tabular text-ink-3">{openIssues.length}</span>}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {activeTab === "issues" &&
          (openIssues.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <CheckCircle size={32} className="mx-auto text-good" />
              <p className="mt-3 font-serif text-[19px]">Nothing left to fix</p>
              <p className="mt-1 text-[14px] text-ink-2">Keep writing. New passages get read as you go.</p>
            </div>
          ) : (
            openIssues.map((issue) => {
              const isExpanded = expandedIssueId === issue.id;
              return (
                <article
                  key={issue.id}
                  className={`rounded-lg transition-colors ${isExpanded ? "bg-sheet" : "bg-paper hover:bg-sheet"}`}
                >
                  <button
                    onClick={() => {
                      setExpandedIssueId(isExpanded ? null : issue.id);
                      onSelectIssue?.(issue);
                    }}
                    aria-expanded={isExpanded}
                    className="w-full text-left p-4 flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0 space-y-1.5">
                      <div className="text-[13px] text-ink-3">{sentenceCase(issue.category)}</div>
                      <div className="font-serif text-[17px] leading-snug">
                        <span className="pen-mark">{issue.phrase}</span>
                      </div>
                      <p className={`text-[13.5px] text-ink-2 ${isExpanded ? "" : "line-clamp-2"}`}>{issue.summary}</p>
                    </div>
                    <CaretDown
                      size={16}
                      className={`text-ink-3 shrink-0 mt-1 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3 fade">
                      <div className="rounded-md bg-paper p-3.5">
                        <div className="flex items-center gap-1.5 text-[13px] text-ink-3">
                          <Question size={15} />
                          <span>Your teacher asks</span>
                        </div>
                        <p className="mt-1 font-serif italic text-[16px] leading-[1.45]">&ldquo;{issue.question}&rdquo;</p>
                      </div>

                      {hintRevealed[issue.id] ? (
                        <p className="text-[14px] text-ink-2 fade">
                          <span className="font-medium text-ink">Hint. </span>
                          {issue.hint}
                        </p>
                      ) : (
                        <button onClick={() => toggle(setHintRevealed, issue.id)} className="link text-[14px]">
                          Show a hint
                        </button>
                      )}

                      {coachLevel !== "minimal" &&
                        (explanationRevealed[issue.id] ? (
                          <p className="text-[14px] text-ink-2 leading-relaxed fade">
                            <span className="font-medium text-ink">Why. </span>
                            {issue.explanation}
                          </p>
                        ) : (
                          <div>
                            <button onClick={() => toggle(setExplanationRevealed, issue.id)} className="link text-[14px]">
                              Explain the rule
                            </button>
                          </div>
                        ))}

                      <div className="pt-1 flex items-center gap-2">
                        <button onClick={() => resolveCoachIssue(issue.id)} className="btn btn-primary btn-sm flex-1">
                          <Check size={14} weight="bold" />
                          <span>I've fixed it</span>
                        </button>
                        {onSendToRevision && (
                          <button onClick={() => onSendToRevision(issue)} className="btn btn-quiet btn-sm">
                            Revise in the lab
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          ))}

        {activeTab === "cohesion" && (
          <div className="space-y-2.5">
            <div className="rounded-lg bg-sheet p-4">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-serif text-[18px]">Flow between paragraphs</h3>
                <span className="tabular text-[14px] font-medium">61</span>
              </div>
              <p className="mt-1.5 text-[14px] text-ink-2">
                Linking words should show a real relationship between ideas, not just stack sentences.
              </p>
            </div>
            <div className="rounded-lg bg-paper p-4">
              <div className="text-[13px] text-warn font-medium">Weak transition</div>
              <p className="mt-1.5 font-serif text-[16px]">
                <span className="pen-mark">Furthermore</span>, the quick pace facilitates shallower interactions...
              </p>
              <p className="mt-2 text-[14px] text-ink-2">
                What relationship do you mean here: contrast, cause and effect, or continuation?
              </p>
            </div>
          </div>
        )}

        {activeTab === "clarity" && (
          <div className="space-y-2.5">
            <div className="rounded-lg bg-sheet p-4">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-serif text-[18px]">Clarity and length</h3>
                <span className="tabular text-[14px] font-medium">74</span>
              </div>
              <p className="mt-1.5 text-[14px] text-ink-2">Cut the padding without losing the meaning.</p>
            </div>
            <div className="rounded-lg bg-paper p-4">
              <div className="text-[13px] text-warn font-medium">Wordy phrase</div>
              <p className="mt-1.5 font-serif text-[16px]">
                <span className="pen-mark">Due to the fact that</span>...
              </p>
              <p className="mt-2 text-[14px] text-ink-2">Can you say the same thing in one word? Try "because".</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
