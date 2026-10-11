import React, { useState, useRef } from "react";
import {
  Sparkles,
  Maximize2,
  Minimize2,
  BookMarked,
  Eye,
  Sliders,
  CheckCircle2,
  HelpCircle,
  Clock,
  FileText,
  Type,
  Plus
} from "lucide-react";
import { useScribe } from "../store/scribeContext";
import { AppLayout } from "../components/layout/AppLayout";
import { CoachPanel } from "../components/coach/CoachPanel";

export default function Write() {
  const { state, updateWritingDraft, updateCoachSettings, addBookSessionWord } = useScribe();
  const { writingWorkspace } = state;
  const { text, coachEnabled, issues, coachLevel } = writingWorkspace;

  const [activeIssue, setActiveIssue] = useState(issues[0] || null);
  const [zenMode, setZenMode] = useState(false);
  const [selectionAction, setSelectionAction] = useState(null); // { word, context, top, left }

  // Font family selector
  const [fontFamily, setFontFamily] = useState("serif"); // 'serif' | 'sans'
  const [fontSize, setFontSize] = useState("base"); // 'base' | 'lg' | 'xl'

  // Word & reading stats
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
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectionAction({
        word: selectedText.replace(/[^a-zA-Z-]/g, ""),
        top: rect.top - 46,
        left: rect.left + rect.width / 2 - 60
      });
    } else {
      setSelectionAction(null);
    }
  };

  return (
    <AppLayout
      title="Writing Workspace"
      subtitle="Distraction-free composing with guided pedagogical coaching"
      hideTopHeader={zenMode}
    >
      {({ openCaptureModal }) => (
        <div className="flex h-full min-h-[calc(100vh-4rem)] overflow-hidden bg-[#FAF8F5]">
          {/* Main Writing Canvas */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* Editor Toolbar */}
            <div className="h-12 border-b border-[#E8E2D8] bg-white px-8 flex items-center justify-between shrink-0 text-xs text-[#52555F]">
              {/* Left Style Controls */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-[#F5F2EB] p-1 rounded-lg border border-[#E5DFD4]">
                  <button
                    onClick={() => setFontFamily("serif")}
                    className={`px-2.5 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                      fontFamily === "serif"
                        ? "bg-[#1F2E3D] text-white font-bold"
                        : "text-[#6B6F7B] hover:text-[#1A1A1E]"
                    }`}
                  >
                    Serif Editorial
                  </button>
                  <button
                    onClick={() => setFontFamily("sans")}
                    className={`px-2.5 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                      fontFamily === "sans"
                        ? "bg-[#1F2E3D] text-white font-bold"
                        : "text-[#6B6F7B] hover:text-[#1A1A1E]"
                    }`}
                  >
                    Sans Modern
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-[#7A7E8B]">
                  <span>Size:</span>
                  <button
                    onClick={() => setFontSize(fontSize === "base" ? "lg" : fontSize === "lg" ? "xl" : "base")}
                    className="font-mono px-2 py-0.5 bg-[#FAF8F5] border border-[#DDD6C9] rounded font-semibold text-[#1A1A1E] cursor-pointer"
                  >
                    {fontSize.toUpperCase()}
                  </button>
                </div>
              </div>

              {/* Right Stats & Coach Toggle */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 text-xs text-[#6B6F7B]">
                  <span>{wordCount} words</span>
                  <span>•</span>
                  <span>~{readingTime} min read</span>
                </div>

                {/* Zen mode toggle */}
                <button
                  onClick={() => setZenMode(!zenMode)}
                  className="p-1.5 rounded-lg text-[#7C808E] hover:text-[#1A1A1E] hover:bg-[#F2ECE1] transition-colors cursor-pointer"
                  title={zenMode ? "Exit Zen Mode" : "Focus / Zen Mode"}
                >
                  {zenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Coach Switch */}
                <button
                  onClick={() =>
                    updateCoachSettings({ coachEnabled: !coachEnabled })
                  }
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    coachEnabled
                      ? "bg-[#FAF0E6] text-[#B85D38] border border-[#F0DDCB]"
                      : "bg-[#F2ECE1] text-[#6B6F7B] hover:text-[#1A1A1E]"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Coach {coachEnabled ? "Active" : "Off"}</span>
                </button>
              </div>
            </div>

            {/* Document Title & Writing Surface */}
            <div
              className="flex-1 overflow-y-auto p-12 lg:p-16 flex justify-center"
              onMouseUp={handleTextSelect}
            >
              <div className="w-full max-w-2xl space-y-6">
                {/* Title */}
                <input
                  type="text"
                  defaultValue="On Deliberate Practice & Prose Architecture"
                  placeholder="Untitled Document..."
                  className={`w-full bg-transparent border-none outline-hidden font-bold text-2xl text-[#1A1A1E] placeholder:text-[#A8A49C] tracking-tight ${
                    fontFamily === "serif" ? "font-serif" : "font-sans"
                  }`}
                />

                {/* Body Textarea */}
                <textarea
                  value={text}
                  onChange={(e) => updateWritingDraft(e.target.value)}
                  placeholder="Sit down. Think. Write. Improve...
                  
Start typing your essay, journal entry, or chapter here..."
                  className={`w-full min-h-[600px] bg-transparent border-none outline-hidden resize-none leading-[1.9] text-[#1A1A1E] placeholder:text-[#AAA69D] ${
                    fontFamily === "serif" ? "font-serif-prose" : "font-sans"
                  } ${
                    fontSize === "base"
                      ? "text-base"
                      : fontSize === "lg"
                      ? "text-lg"
                      : "text-xl"
                  }`}
                />
              </div>

              {/* Floating Contextual Pill for Selection */}
              {selectionAction && (
                <div
                  style={{
                    position: "fixed",
                    top: `${selectionAction.top}px`,
                    left: `${selectionAction.left}px`
                  }}
                  className="z-50 bg-[#1F2E3D] text-white px-3 py-1.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in zoom-in-95 duration-100"
                >
                  <button
                    onClick={() => {
                      openCaptureModal(selectionAction.word, `Found in writing: "${selectionAction.word}"`);
                      setSelectionAction(null);
                    }}
                    className="hover:text-[#B85D38] flex items-center gap-1 cursor-pointer"
                  >
                    <BookMarked className="w-3.5 h-3.5 text-[#B85D38]" />
                    <span>+ Save Word</span>
                  </button>
                </div>
              )}
            </div>

            {/* Subtle Progress Bar */}
            <div className="h-8 border-t border-[#E8E2D8] bg-white px-8 flex items-center justify-between text-[11px] text-[#7A7E8B]">
              <div className="flex items-center gap-4">
                <span>Natural writing rhythm: uninhibited drafting</span>
                <span>•</span>
                <span>3 vocabulary words applied</span>
              </div>
              <div className="text-[#059669] font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Changes saved to local store</span>
              </div>
            </div>
          </div>

          {/* Right AI Writing Coach Panel */}
          {coachEnabled && (
            <CoachPanel
              activeIssueId={activeIssue?.id}
              onSelectIssue={(issue) => setActiveIssue(issue)}
            />
          )}
        </div>
      )}
    </AppLayout>
  );
}
