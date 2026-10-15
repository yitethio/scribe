import React, { useState } from "react";
import { ArrowsOut, ArrowsIn, BookmarkSimple, CheckCircle, ChatCircleText } from "@phosphor-icons/react";
import { useScribe } from "../store/scribeContext";
import { AppLayout } from "../components/layout/AppLayout";
import { CoachPanel } from "../components/coach/CoachPanel";

const sizes = { base: "text-[18px]", lg: "text-[20px]", xl: "text-[23px]" };
const sizeLabels = { base: "Normal", lg: "Large", xl: "Larger" };
const nextSize = { base: "lg", lg: "xl", xl: "base" };

export default function Write() {
  const { state, updateWritingDraft, updateCoachSettings } = useScribe();
  const { writingWorkspace } = state;
  const { text, coachEnabled, issues } = writingWorkspace;

  const [activeIssue, setActiveIssue] = useState(issues[0] || null);
  const [zenMode, setZenMode] = useState(false);
  const [selectionAction, setSelectionAction] = useState(null);
  const [fontFamily, setFontFamily] = useState("serif");
  const [fontSize, setFontSize] = useState("base");

  const wordCount = (text || "").trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleTextSelect = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setSelectionAction(null);
      return;
    }
    const selectedText = selection.toString().trim();
    if (selectedText && selectedText.split(/\s+/).length <= 2 && selectedText.length > 2) {
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      setSelectionAction({
        word: selectedText.replace(/[^a-zA-Z-]/g, ""),
        top: rect.top - 48,
        left: rect.left + rect.width / 2 - 64
      });
    } else {
      setSelectionAction(null);
    }
  };

  const face = fontFamily === "serif" ? "font-serif" : "font-sans";

  return (
    <AppLayout
      title="Write"
      subtitle="A quiet page, with a coach that asks instead of rewriting"
      hideTopHeader={zenMode}
      compactHeader
    >
      {({ openCaptureModal }) => (
        <div
          className={`flex flex-col lg:flex-row bg-paper ${
            zenMode ? "h-[100dvh]" : "lg:h-[calc(100dvh-4rem)]"
          } overflow-hidden`}
        >
          <div className="flex-1 flex flex-col min-w-0 bg-sheet lg:rounded-tr-[10px]">
            {/* Toolbar */}
            <div className="h-14 px-4 sm:px-8 flex items-center justify-between gap-3 shrink-0 text-[13px] text-ink-3">
              <div className="flex items-center gap-3">
                <div className="seg" role="group" aria-label="Typeface">
                  <button
                    onClick={() => setFontFamily("serif")}
                    aria-pressed={fontFamily === "serif"}
                    className="seg-item font-serif text-[14px]"
                  >
                    Serif
                  </button>
                  <button
                    onClick={() => setFontFamily("sans")}
                    aria-pressed={fontFamily === "sans"}
                    className="seg-item"
                  >
                    Sans
                  </button>
                </div>
                <button
                  onClick={() => setFontSize(nextSize[fontSize])}
                  className="btn btn-ghost btn-sm"
                  title="Change text size"
                >
                  {sizeLabels[fontSize]}
                </button>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <span className="hidden sm:inline tabular mr-2">
                  {wordCount} words · {readingTime} min read
                </span>
                <button
                  onClick={() => setZenMode(!zenMode)}
                  className="btn btn-ghost btn-icon"
                  aria-label={zenMode ? "Leave focus mode" : "Focus mode"}
                  title={zenMode ? "Leave focus mode" : "Focus mode"}
                >
                  {zenMode ? <ArrowsIn size={18} /> : <ArrowsOut size={18} />}
                </button>
                <button
                  onClick={() => updateCoachSettings({ coachEnabled: !coachEnabled })}
                  aria-pressed={coachEnabled}
                  className={`btn btn-sm ${coachEnabled ? "btn-quiet" : "btn-ghost"}`}
                >
                  <ChatCircleText size={16} weight={coachEnabled ? "fill" : "regular"} className={coachEnabled ? "text-pen" : ""} />
                  <span>{coachEnabled ? "Coach on" : "Coach off"}</span>
                </button>
              </div>
            </div>

            {/* Page */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-12 py-10 lg:py-16 flex justify-center" onMouseUp={handleTextSelect}>
              <div className="w-full max-w-[680px]">
                <input
                  type="text"
                  defaultValue="On Deliberate Practice & Prose Architecture"
                  placeholder="Untitled"
                  aria-label="Title"
                  className={`w-full bg-transparent border-none outline-none text-[30px] sm:text-[36px] leading-[1.1] font-medium tracking-[-0.02em] placeholder:text-ink-3/60 ${face}`}
                />
                <textarea
                  value={text}
                  onChange={(e) => updateWritingDraft(e.target.value)}
                  aria-label="Your writing"
                  placeholder="Sit down. Think. Write. Then make it better."
                  className={`mt-6 w-full min-h-[60vh] bg-transparent border-none outline-none resize-none leading-[1.75] text-ink placeholder:text-ink-3/60 ${face} ${sizes[fontSize]}`}
                />
              </div>

              {selectionAction && (
                <div
                  style={{ position: "fixed", top: `${selectionAction.top}px`, left: `${selectionAction.left}px` }}
                  className="z-50 pop"
                >
                  <button
                    onClick={() => {
                      openCaptureModal(selectionAction.word, `Found in writing: "${selectionAction.word}"`);
                      setSelectionAction(null);
                    }}
                    className="btn btn-primary btn-sm shadow-[0_8px_24px_-8px_rgb(22_24_28/0.4)]"
                  >
                    <BookmarkSimple size={15} weight="fill" className="text-pen" />
                    <span>Save "{selectionAction.word}"</span>
                  </button>
                </div>
              )}
            </div>

            <div className="h-10 px-4 sm:px-8 flex items-center justify-between gap-4 text-[13px] text-ink-3 shrink-0">
              <span className="truncate">3 saved words used in this draft</span>
              <span className="flex items-center gap-1.5 text-good shrink-0">
                <CheckCircle size={14} weight="fill" />
                <span>Saved</span>
              </span>
            </div>
          </div>

          {coachEnabled && (
            <CoachPanel activeIssueId={activeIssue?.id} onSelectIssue={(issue) => setActiveIssue(issue)} />
          )}
        </div>
      )}
    </AppLayout>
  );
}
