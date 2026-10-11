import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Clock,
  Sparkles,
  Plus,
  Upload,
  CheckCircle2,
  Bookmark,
  FileText,
  Search,
  X,
  RotateCcw,
  BookMarked,
  Layers,
  ArrowRight
} from "lucide-react";
import { useScribe } from "../store/scribeContext";
import { AppLayout } from "../components/layout/AppLayout";

export default function BookSession() {
  const { state, updateBookSession, addBookSessionWord, addVocabularyWord } = useScribe();
  const { bookSession, vocabulary } = state;

  const [sessionActive, setSessionActive] = useState(true);
  const [splitRatio, setSplitRatio] = useState(50); // 50% left, 50% right
  const [isDragging, setIsDragging] = useState(false);

  // PDF Viewer controls
  const [zoom, setZoom] = useState(100);
  const [pageInput, setPageInput] = useState(bookSession.currentPage);
  const [searchQuery, setSearchQuery] = useState("");

  // Vocabulary popup / popover state
  const [selectedWordChip, setSelectedWordChip] = useState(null);
  const [chipUserDef, setChipUserDef] = useState("");
  const [chipRevealed, setChipRevealed] = useState(false);

  // Floating text selection popover state
  const [selectionPopover, setSelectionPopover] = useState(null); // { word, contextSentence, x, y }

  // Drag-and-drop file upload state
  const [dragOver, setDragOver] = useState(false);

  // Running session timer
  const [elapsedSeconds, setElapsedSeconds] = useState(bookSession.sessionDuration || 2535);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Split-screen drag resizing handler
  const containerRef = useRef(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newRatio = ((e.clientX - rect.left) / rect.width) * 100;
      if (newRatio >= 25 && newRatio <= 75) {
        setSplitRatio(newRatio);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Handle Text Selection in My Writing area
  const handleTextSelect = (e) => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setSelectionPopover(null);
      return;
    }
    const selectedText = selection.toString().trim();
    // Only trigger if single word or small phrase (<= 3 words)
    if (selectedText && selectedText.split(/\s+/).length <= 2 && selectedText.length > 2) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      // Extract surrounding sentence as context
      const fullText = bookSession.draftText || "";
      const wordIndex = fullText.toLowerCase().indexOf(selectedText.toLowerCase());
      let contextSentence = "";
      if (wordIndex >= 0) {
        const start = Math.max(0, fullText.lastIndexOf(".", wordIndex) + 1);
        let end = fullText.indexOf(".", wordIndex + selectedText.length);
        if (end === -1) end = fullText.length;
        contextSentence = fullText.substring(start, end).trim();
      }

      setSelectionPopover({
        word: selectedText.replace(/[^a-zA-Z-]/g, ""),
        contextSentence: contextSentence || `Found in writing: "${selectedText}"`,
        top: rect.top - 46,
        left: rect.left + rect.width / 2 - 50
      });
    } else {
      setSelectionPopover(null);
    }
  };

  const handleAddWordFromPopover = () => {
    if (selectionPopover?.word) {
      addBookSessionWord(selectionPopover.word, selectionPopover.contextSentence);
      setSelectionPopover(null);
    }
  };

  // Turn page
  const handlePageChange = (newPage) => {
    const validPage = Math.max(1, Math.min(bookSession.totalPages, newPage));
    updateBookSession({ currentPage: validPage });
    setPageInput(validPage);
  };

  // Format Timer mm:ss
  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? "0" : ""}${s}s`;
  };

  // Real-time word count in rewrite canvas
  const wordsRewrittenCount = (bookSession.draftText || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const currentPageData = bookSession.bookPages?.[bookSession.currentPage] || {
    chapter: `Page ${bookSession.currentPage}`,
    subhead: "Original Reference Manuscript",
    paragraphs: [
      "The knight approached the precipice overlooking the valley, hesitating before the vast descent.",
      "The north wall stood before him—a formidable barrier of weathered basalt that defied both wind and siege.",
      "Below, the stone village lay in a peculiar quiet, with only faint plumes of hearthsmoke rising like gray ribbons against the frost."
    ]
  };

  // When clicking a session vocabulary chip
  const handleOpenChip = (word) => {
    setSelectedWordChip(word);
    setChipRevealed(false);
    // Retrieve existing user definition from vocabulary store if present
    const existing = vocabulary.find((v) => v.word.toLowerCase() === word.toLowerCase());
    setChipUserDef(existing?.personalDef || "");
  };

  const activeChipVocabItem = vocabulary.find(
    (v) => v.word.toLowerCase() === selectedWordChip?.toLowerCase()
  ) || {
    word: selectedWordChip,
    pos: "Noun",
    correctDef: `A very steep rock face or cliff; a point where great trouble or disaster may occur.`,
    example: `The knight approached the precipice overlooking the misty valley.`,
    collocations: ["rocky precipice", "on the precipice of"],
    personalDef: chipUserDef
  };

  const handleSaveChipDefinition = () => {
    addVocabularyWord({
      word: selectedWordChip,
      personalDef: chipUserDef.trim(),
      pos: activeChipVocabItem.pos,
      correctDef: activeChipVocabItem.correctDef,
      example: activeChipVocabItem.example,
      collocations: activeChipVocabItem.collocations,
      contextSentence: `The knight approached the ${selectedWordChip} overlooking the valley.`
    });
    setChipRevealed(true);
  };

  // PDF Upload Handler
  const handlePdfFileSelect = (file) => {
    if (file) {
      updateBookSession({
        bookTitle: file.name.replace(/\.[^/.]+$/, ""),
        filename: file.name,
        currentPage: 1,
        totalPages: 120
      });
      setSessionActive(true);
    }
  };

  return (
    <AppLayout
      title="Book Session Workspace"
      subtitle="Split-screen reference reading, deliberate manual rewriting & vocabulary acquisition"
      hideTopHeader={true}
    >
      <div className="flex flex-col h-screen overflow-hidden bg-[#FAF8F5]">
        {/* Session Top Bar */}
        <header className="h-14 border-b border-[#E8E2D8] bg-white px-6 flex items-center justify-between shrink-0 z-20">
          {/* Left Session Meta */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-xs font-semibold text-[#6B6F7B] hover:text-[#1A1A1E] flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            <div className="h-4 w-px bg-[#E8E2D8]" />

            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#B85D38]" />
              <span className="font-serif font-bold text-sm text-[#1A1A1E]">
                {bookSession.bookTitle}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#FAF0E6] text-[#B85D38] font-medium border border-[#F3E2D0]">
                Page {bookSession.currentPage} of {bookSession.totalPages}
              </span>
            </div>
          </div>

          {/* Right Session Metrics */}
          <div className="flex items-center gap-5 text-xs text-[#52555F]">
            <div className="flex items-center gap-1.5">
              <span className="text-[#8A8D96]">Words Rewritten:</span>
              <span className="font-mono font-bold text-[#1A1A1E]">
                {wordsRewrittenCount.toLocaleString()} w
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#8A8D96]">Session Vocab:</span>
              <span className="font-mono font-bold text-[#B85D38]">
                {bookSession.sessionVocabulary.length} words
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-mono bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#E5DFD4]">
              <Clock className="w-3.5 h-3.5 text-[#8A8D96]" />
              <span className="font-semibold text-[#1A1A1E]">
                {formatTimer(elapsedSeconds)}
              </span>
            </div>

            <button
              onClick={() => setSessionActive(!sessionActive)}
              className="px-3 py-1.5 bg-[#1F2E3D] hover:bg-[#15202B] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              {sessionActive ? "Change PDF" : "Resume Workspace"}
            </button>
          </div>
        </header>

        {/* View Switch: Setup vs Active Workspace */}
        {!sessionActive ? (
          /* Book Setup View */
          <div className="flex-1 overflow-y-auto p-12 max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="font-serif font-bold text-2xl text-[#1A1A1E]">
                Book Rewrite Setup
              </h2>
              <p className="text-xs text-[#6B6F7B] mt-1 leading-relaxed">
                Upload the manuscript or classic book you intend to rewrite. The text serves as your visual reference on the left—you rewrite by hand on the right to absorb syntax, pacing, and vocabulary.
              </p>
            </div>

            {/* Drag & Drop PDF upload */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files[0]) {
                  handlePdfFileSelect(e.dataTransfer.files[0]);
                }
              }}
              className={`p-8 border-2 border-dashed rounded-2xl text-center transition-all ${
                dragOver
                  ? "border-[#B85D38] bg-[#FAF0E6]/50"
                  : "border-[#D8CFBF] bg-white hover:border-[#B85D38]"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#FAF0E6] text-[#B85D38] flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#1A1A1E]">
                Upload Book PDF
              </h3>
              <p className="text-xs text-[#7A7E8B] mt-1 mb-4">
                Drag and drop your manuscript PDF here, or click to browse files
              </p>

              <label className="inline-block py-2 px-4 bg-[#1F2E3D] hover:bg-[#15202B] text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors shadow-2xs">
                <span>Select PDF from Computer</span>
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => handlePdfFileSelect(e.target.files[0])}
                />
              </label>

              <p className="text-[11px] text-[#9CA3AF] mt-3">
                Note: Scribe does not OCR or automatically paste the PDF. You do the thinking and rewriting.
              </p>
            </div>

            {/* Continue with Sample Book */}
            <div className="p-5 bg-white border border-[#E2DBD0] rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={bookSession.coverUrl || "/book-cover.jpg"}
                  alt="Book Cover"
                  className="w-12 h-16 object-cover rounded-md border border-[#DDD6C9]"
                />
                <div>
                  <div className="font-serif font-bold text-sm text-[#1A1A1E]">
                    The Craft of Prose: Guide to Elegant Writing
                  </div>
                  <div className="text-xs text-[#6B6F7B]">
                    Eleanor Vance • 312 pages • Edition IV
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSessionActive(true)}
                className="py-2 px-4 bg-[#FAF8F5] hover:bg-[#F2ECE1] border border-[#DDD6C9] text-xs font-semibold rounded-xl cursor-pointer transition-colors"
              >
                Use Sample Book
              </button>
            </div>

            <button
              onClick={() => setSessionActive(true)}
              className="w-full py-3 bg-[#FAF8F5] hover:bg-[#F0EAE0] text-[#1A1A1E] border border-[#DDD6C9] text-xs font-semibold rounded-xl cursor-pointer"
            >
              Continue without PDF
            </button>
          </div>
        ) : (
          /* Split Screen Active Workspace */
          <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
            {/* Left Panel: Book / PDF Viewer */}
            <div
              style={{ width: `${splitRatio}%` }}
              className="flex flex-col border-r border-[#E8E2D8] bg-[#F7F4EE] overflow-hidden select-text"
            >
              {/* PDF Toolbar */}
              <div className="h-11 border-b border-[#E8E2D8] bg-white px-4 flex items-center justify-between shrink-0 text-xs text-[#52555F]">
                {/* Page Navigation */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePageChange(bookSession.currentPage - 1)}
                    disabled={bookSession.currentPage <= 1}
                    className="p-1 rounded hover:bg-[#F2ECE1] disabled:opacity-40 transition-colors cursor-pointer"
                    title="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1 text-xs">
                    <span>Page</span>
                    <input
                      type="number"
                      value={pageInput}
                      onChange={(e) => setPageInput(Number(e.target.value))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handlePageChange(pageInput);
                      }}
                      className="w-12 text-center py-0.5 px-1 bg-[#FAF8F5] border border-[#DDD6C9] rounded font-mono text-xs font-bold text-[#1A1A1E]"
                    />
                    <span>of {bookSession.totalPages}</span>
                  </div>

                  <button
                    onClick={() => handlePageChange(bookSession.currentPage + 1)}
                    disabled={bookSession.currentPage >= bookSession.totalPages}
                    className="p-1 rounded hover:bg-[#F2ECE1] disabled:opacity-40 transition-colors cursor-pointer"
                    title="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Zoom & Fit Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setZoom((z) => Math.max(70, z - 10))}
                    className="p-1 rounded hover:bg-[#F2ECE1] cursor-pointer"
                    title="Zoom out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-[11px] w-9 text-center font-semibold">
                    {zoom}%
                  </span>
                  <button
                    onClick={() => setZoom((z) => Math.min(150, z + 10))}
                    className="p-1 rounded hover:bg-[#F2ECE1] cursor-pointer"
                    title="Zoom in"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoom(100)}
                    className="p-1 rounded hover:bg-[#F2ECE1] text-[11px] font-semibold cursor-pointer ml-1"
                    title="Fit to width"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Book Page Canvas with authentic book margins & typography */}
              <div className="flex-1 overflow-y-auto p-8 flex justify-center">
                <div
                  style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
                  className="w-full max-w-xl bg-white rounded-lg shadow-sm border border-[#E0D9CC] p-10 font-serif text-[#1F2228] transition-transform duration-100 flex flex-col justify-between min-h-[720px]"
                >
                  <div className="space-y-6">
                    {/* Chapter Header */}
                    <div className="border-b border-[#EAE3D6] pb-3 text-center">
                      <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#8A8D96]">
                        {currentPageData.chapter}
                      </div>
                      <h3 className="font-serif italic text-base text-[#1A1A1E] mt-0.5">
                        {currentPageData.subhead}
                      </h3>
                    </div>

                    {/* Book Paragraphs */}
                    <div className="space-y-5 text-sm font-serif-prose leading-[1.8] text-[#24272E]">
                      {currentPageData.paragraphs.map((para, idx) => (
                        <p key={idx} className="indent-6 first:indent-0">
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Book Page Footer */}
                  <div className="border-t border-[#EAE3D6] pt-3 text-center text-xs font-serif text-[#8A8D96]">
                    — {bookSession.currentPage} —
                  </div>
                </div>
              </div>
            </div>

            {/* Draggable Divider */}
            <div
              onMouseDown={handleMouseDown}
              className={`w-1.5 hover:w-2 bg-[#E2DBD0] hover:bg-[#B85D38] transition-all cursor-col-resize select-none shrink-0 relative z-10 flex items-center justify-center ${
                isDragging ? "bg-[#B85D38] w-2" : ""
              }`}
              title="Drag to resize split view"
            >
              <div className="w-0.5 h-6 bg-white/70 rounded-full" />
            </div>

            {/* Right Panel: My Writing / Manual Rewrite Canvas */}
            <div
              style={{ width: `${100 - splitRatio}%` }}
              className="flex flex-col bg-[#FAF8F5] overflow-hidden"
            >
              {/* Session Vocabulary Chips Bar */}
              <div className="p-3 border-b border-[#E8E2D8] bg-white flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2 overflow-x-auto py-0.5 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8D96] shrink-0">
                    Session Vocabulary:
                  </span>
                  {bookSession.sessionVocabulary.map((word, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOpenChip(word)}
                      className="px-2.5 py-1 rounded-md bg-[#FAF0E6] hover:bg-[#F5E2D0] text-[#B85D38] border border-[#F0DFD0] text-xs font-serif font-semibold cursor-pointer transition-colors shrink-0 flex items-center gap-1"
                    >
                      <span>{word}</span>
                    </button>
                  ))}
                </div>

                <div className="text-[11px] text-[#8C909B] shrink-0">
                  Select any word below to <strong className="text-[#1A1A1E]">+ Add</strong>
                </div>
              </div>

              {/* Writing Canvas */}
              <div className="flex-1 overflow-y-auto p-8 relative" onMouseUp={handleTextSelect}>
                <textarea
                  value={bookSession.draftText}
                  onChange={(e) => updateBookSession({ draftText: e.target.value })}
                  placeholder="Begin manually rewriting the text from the reference manuscript on the left..."
                  className="w-full h-full min-h-[500px] bg-transparent border-none outline-hidden resize-none font-serif-prose text-base leading-[1.85] text-[#1A1A1E] placeholder:text-[#AAA69D]"
                />

                {/* Floating Selection Popover */}
                {selectionPopover && (
                  <div
                    style={{
                      position: "fixed",
                      top: `${selectionPopover.top}px`,
                      left: `${selectionPopover.left}px`
                    }}
                    className="z-50 bg-[#1F2E3D] text-white px-3 py-1.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-100 cursor-pointer"
                    onClick={handleAddWordFromPopover}
                  >
                    <Plus className="w-3.5 h-3.5 text-[#B85D38]" />
                    <span>+ Add "{selectionPopover.word}"</span>
                  </div>
                )}
              </div>

              {/* Canvas Bottom Status */}
              <div className="h-9 border-t border-[#E8E2D8] bg-white px-6 flex items-center justify-between shrink-0 text-xs text-[#7A7E8B]">
                <div className="flex items-center gap-3">
                  <span>{wordsRewrittenCount} words rewritten</span>
                  <span>•</span>
                  <span>Active Book Mode</span>
                </div>
                <div className="text-[11px] text-[#059669] flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Session auto-saved</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vocabulary Detail Popover / Modal (When a chip is clicked) */}
        {selectedWordChip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-2xs animate-in fade-in duration-150">
            <div className="bg-[#FAF8F5] border border-[#E4DDD1] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-[#E8E2D8] flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF0E6] text-[#B85D38] flex items-center justify-center">
                    <Bookmark className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-lg text-[#1A1A1E]">
                        {selectedWordChip}
                      </h3>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EFE9DD] text-[#555861] font-medium">
                        {activeChipVocabItem.pos}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B6F7B]">
                      Captured during Book Rewriting Session
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedWordChip(null)}
                  className="p-1 rounded-lg text-[#848792] hover:text-[#1A1A1E] hover:bg-[#EAE4D9]/60 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                {/* Found in your writing */}
                <div className="p-3 bg-[#F4EFE6] border border-[#E5DDD0] rounded-xl space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A8D96]">
                    Found in your writing:
                  </div>
                  <p className="font-serif italic text-xs text-[#2A2D33] leading-relaxed">
                    "The knight approached the <strong className="text-[#B85D38]">{selectedWordChip}</strong> overlooking the valley."
                  </p>
                </div>

                {/* Prompt: User must define first */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6B6F7B]">
                    What do you think this word means?
                  </label>
                  <textarea
                    rows={3}
                    value={chipUserDef}
                    onChange={(e) => setChipUserDef(e.target.value)}
                    placeholder="Enter your working understanding before revealing the dictionary meaning..."
                    disabled={chipRevealed}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DDD6C9] rounded-xl text-xs font-serif text-[#1A1A1E] leading-relaxed focus:outline-hidden focus:border-[#1F2E3D] disabled:bg-[#F2ECE1]/50 resize-none"
                  />
                </div>

                {!chipRevealed ? (
                  <button
                    onClick={handleSaveChipDefinition}
                    disabled={!chipUserDef.trim()}
                    className="w-full py-2.5 bg-[#1F2E3D] hover:bg-[#15202B] disabled:bg-[#CCC5B8] text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors shadow-2xs"
                  >
                    Submit Definition & Reveal Answer
                  </button>
                ) : (
                  <div className="space-y-3 pt-2 border-t border-[#E8E2D8] animate-in fade-in duration-150">
                    <div className="p-4 bg-white border border-[#E0D9CD] rounded-xl space-y-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A8D96]">
                        Actual Meaning
                      </div>
                      <p className="font-serif text-xs text-[#1A1A1E] leading-relaxed">
                        {activeChipVocabItem.correctDef}
                      </p>

                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A8D96] pt-1">
                        Common Usage / Collocations
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {activeChipVocabItem.collocations?.map((c, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-[#FAF8F5] text-[#2C313C] rounded text-[11px] font-mono border border-[#E5DFD4]"
                          >
                            {c}
                          </span>
                        ))}
                      </div>

                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A8D96] pt-1">
                        Exemplary Usage
                      </div>
                      <p className="font-serif italic text-xs text-[#52555F]">
                        "{activeChipVocabItem.example}"
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Saved to your persistent Vocabulary Library.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 border-t border-[#E8E2D8] bg-[#F5F2EB] flex justify-end">
                <button
                  onClick={() => setSelectedWordChip(null)}
                  className="px-4 py-2 bg-white border border-[#DDD6C9] hover:bg-[#F2ECE1] text-[#1A1A1E] text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Return to Rewrite
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
