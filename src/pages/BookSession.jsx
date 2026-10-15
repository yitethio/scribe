import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CaretLeft,
  CaretRight,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
  Plus,
  UploadSimple,
  CheckCircle,
  X
} from "@phosphor-icons/react";
import { useScribe } from "../store/scribeContext";
import { AppLayout } from "../components/layout/AppLayout";
import { Dialog } from "../components/ui/Dialog";

export default function BookSession() {
  const { state, updateBookSession, addBookSessionWord, addVocabularyWord } = useScribe();
  const { bookSession, vocabulary } = state;

  const [sessionActive, setSessionActive] = useState(true);
  const [splitRatio, setSplitRatio] = useState(50); // 50% left, 50% right
  const [isDragging, setIsDragging] = useState(false);

  // PDF Viewer controls
  const [zoom, setZoom] = useState(100);
  const [pageInput, setPageInput] = useState(bookSession.currentPage);

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
  const handleTextSelect = () => {
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
    <AppLayout title="Book session" hideTopHeader={true}>
      <div className="flex flex-col lg:h-[100dvh] lg:overflow-hidden bg-paper">
        {/* Session bar */}
        <header className="min-h-16 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <Link to="/" className="btn btn-ghost btn-sm -ml-2">
              <CaretLeft size={15} />
              <span>Dashboard</span>
            </Link>
            <div className="min-w-0">
              <h1 className="font-serif text-[20px] leading-tight font-medium truncate">{bookSession.bookTitle}</h1>
              <p className="text-[13px] text-ink-3 tabular">
                Page {bookSession.currentPage} of {bookSession.totalPages}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 sm:gap-7 text-[13px] text-ink-3">
            <div>
              <div className="font-serif text-[22px] leading-none text-ink tabular">{wordsRewrittenCount.toLocaleString()}</div>
              <div className="mt-1">words rewritten</div>
            </div>
            <div>
              <div className="font-serif text-[22px] leading-none text-pen tabular">{bookSession.sessionVocabulary.length}</div>
              <div className="mt-1">new words</div>
            </div>
            <div>
              <div className="font-serif text-[22px] leading-none text-ink tabular">{formatTimer(elapsedSeconds)}</div>
              <div className="mt-1">this session</div>
            </div>
            <button onClick={() => setSessionActive(!sessionActive)} className="btn btn-quiet btn-sm">
              {sessionActive ? "Change book" : "Back to the book"}
            </button>
          </div>
        </header>

        {!sessionActive ? (
          /* Setup */
          <div className="flex-1 overflow-y-auto px-5 py-10 sm:py-16">
            <div className="max-w-2xl mx-auto">
              <h2 className="font-serif text-[34px] sm:text-[40px] leading-[1.05] font-medium tracking-[-0.02em]">
                Choose a book to rewrite
              </h2>
              <p className="mt-3 text-[16px] text-ink-2 max-w-[56ch]">
                The book stays on the left as your reference. You rewrite it by hand on the right, and its syntax, pacing
                and vocabulary sink in as you go.
              </p>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  if (e.dataTransfer.files[0]) handlePdfFileSelect(e.dataTransfer.files[0]);
                }}
                className={`mt-8 rounded-[10px] px-6 py-12 text-center transition-colors ${
                  dragOver ? "bg-pen-soft" : "bg-sheet"
                }`}
              >
                <UploadSimple size={30} className="mx-auto text-pen" />
                <h3 className="mt-4 font-serif text-[22px] font-medium">Drop a PDF here</h3>
                <p className="mt-1 text-[14px] text-ink-2">or pick one from your computer</p>
                <label className="btn btn-primary mt-6">
                  <span>Choose a PDF</span>
                  <input
                    type="file"
                    accept=".pdf"
                    className="sr-only"
                    onChange={(e) => handlePdfFileSelect(e.target.files[0])}
                  />
                </label>
                <p className="mt-5 text-[13px] text-ink-3">
                  Scribe never pastes the text for you. The thinking and the rewriting are yours.
                </p>
              </div>

              <div className="mt-4 rounded-[10px] bg-sheet p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={bookSession.coverUrl || "/book-cover.jpg"}
                    alt=""
                    className="w-12 h-[72px] object-cover rounded-[3px]"
                  />
                  <div>
                    <div className="font-serif text-[18px] leading-snug">The Craft of Prose: Guide to Elegant Writing</div>
                    <div className="text-[13px] text-ink-3">Eleanor Vance · 312 pages · fourth edition</div>
                  </div>
                </div>
                <button onClick={() => setSessionActive(true)} className="btn btn-quiet shrink-0">
                  Use the sample book
                </button>
              </div>

              <button onClick={() => setSessionActive(true)} className="link text-[14px] mt-6">
                Continue without a PDF
              </button>
            </div>
          </div>
        ) : (
          /* Split workspace */
          <div ref={containerRef} className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden min-h-0">
            {/* Book */}
            <section
              style={{ "--w": `${splitRatio}%` }}
              className="w-full lg:w-[var(--w)] flex flex-col bg-rail lg:overflow-hidden select-text"
              aria-label="Reference book"
            >
              <div className="h-12 px-3 flex items-center justify-between shrink-0 text-[13px] text-ink-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(bookSession.currentPage - 1)}
                    disabled={bookSession.currentPage <= 1}
                    className="btn btn-ghost btn-icon"
                    aria-label="Previous page"
                  >
                    <CaretLeft size={16} />
                  </button>
                  <label className="flex items-center gap-1.5">
                    <span>Page</span>
                    <input
                      type="number"
                      value={pageInput}
                      onChange={(e) => setPageInput(Number(e.target.value))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handlePageChange(pageInput);
                      }}
                      className="field w-14 h-8 px-1.5 py-0 text-center text-[13px] tabular"
                    />
                    <span className="tabular">of {bookSession.totalPages}</span>
                  </label>
                  <button
                    onClick={() => handlePageChange(bookSession.currentPage + 1)}
                    disabled={bookSession.currentPage >= bookSession.totalPages}
                    className="btn btn-ghost btn-icon"
                    aria-label="Next page"
                  >
                    <CaretRight size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => setZoom((z) => Math.max(70, z - 10))}
                    className="btn btn-ghost btn-icon"
                    aria-label="Zoom out"
                  >
                    <MagnifyingGlassMinus size={16} />
                  </button>
                  <button onClick={() => setZoom(100)} className="btn btn-ghost btn-sm w-14 tabular px-0" title="Reset zoom">
                    {zoom}%
                  </button>
                  <button
                    onClick={() => setZoom((z) => Math.min(150, z + 10))}
                    className="btn btn-ghost btn-icon"
                    aria-label="Zoom in"
                  >
                    <MagnifyingGlassPlus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 sm:px-8 pb-10 pt-2 flex justify-center">
                <article
                  style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
                  className="w-full max-w-[560px] bg-sheet rounded-[4px] px-8 sm:px-12 pt-12 pb-8 font-serif text-ink flex flex-col justify-between min-h-[720px] transition-transform duration-150"
                >
                  <div>
                    <header className="text-center">
                      <div className="text-[13px] font-sans text-ink-3">{currentPageData.chapter}</div>
                      <h2 className="mt-1 italic text-[20px]">{currentPageData.subhead}</h2>
                    </header>
                    <div className="mt-8 space-y-4 text-[16.5px] leading-[1.75]">
                      {currentPageData.paragraphs.map((para, idx) => (
                        <p key={idx} className="indent-6 first:indent-0">
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>
                  <footer className="pt-8 text-center text-[14px] text-ink-3 tabular">{bookSession.currentPage}</footer>
                </article>
              </div>
            </section>

            {/* Resize handle */}
            <div
              onMouseDown={handleMouseDown}
              role="separator"
              aria-orientation="vertical"
              aria-label="Drag to resize"
              className="hidden lg:flex w-3 -mx-1.5 z-10 cursor-col-resize items-center justify-center group shrink-0"
            >
              <span
                className={`w-1 h-12 rounded-full transition-colors ${
                  isDragging ? "bg-pen" : "bg-tint-2 group-hover:bg-ink-3"
                }`}
              />
            </div>

            {/* Rewrite */}
            <section
              style={{ "--w": `${100 - splitRatio}%` }}
              className="w-full lg:w-[var(--w)] flex flex-col bg-sheet lg:overflow-hidden min-h-[70vh] lg:min-h-0"
              aria-label="Your rewrite"
            >
              <div className="px-5 sm:px-8 py-3 flex items-center gap-3 shrink-0 overflow-x-auto">
                <span className="text-[13px] text-ink-3 shrink-0">New words</span>
                {bookSession.sessionVocabulary.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOpenChip(word)}
                    className="tag tag-pen font-serif text-[14px] h-7 px-2.5 hover:bg-[#f1d3cb] transition-colors shrink-0"
                  >
                    {word}
                  </button>
                ))}
                <span className="ml-auto text-[13px] text-ink-3 shrink-0 hidden 2xl:inline">
                  Select a word in your text to save it
                </span>
              </div>

              <div className="flex-1 overflow-y-auto px-5 sm:px-10 py-8" onMouseUp={handleTextSelect}>
                <textarea
                  value={bookSession.draftText}
                  onChange={(e) => updateBookSession({ draftText: e.target.value })}
                  aria-label="Your rewrite"
                  placeholder="Rewrite the page on the left, in your own hand..."
                  className="w-full h-full min-h-[500px] bg-transparent border-none outline-none resize-none font-serif text-[18px] leading-[1.75] text-ink placeholder:text-ink-3/60"
                />

                {selectionPopover && (
                  <div
                    style={{ position: "fixed", top: `${selectionPopover.top}px`, left: `${selectionPopover.left}px` }}
                    className="z-50 pop"
                  >
                    <button
                      onClick={handleAddWordFromPopover}
                      className="btn btn-primary btn-sm shadow-[0_8px_24px_-8px_rgb(22_24_28/0.4)]"
                    >
                      <Plus size={14} weight="bold" className="text-pen" />
                      <span>Save "{selectionPopover.word}"</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="h-10 px-5 sm:px-8 flex items-center justify-between text-[13px] text-ink-3 shrink-0">
                <span className="tabular">{wordsRewrittenCount} words rewritten</span>
                <span className="flex items-center gap-1.5 text-good">
                  <CheckCircle size={14} weight="fill" />
                  <span>Saved</span>
                </span>
              </div>
            </section>
          </div>
        )}

        {/* Word card, opened from a new-word tag */}
        {selectedWordChip && (
          <Dialog onClose={() => setSelectedWordChip(null)} labelledBy="word-card-title">
            <div className="overflow-y-auto">
              <div className="px-6 pt-6 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-3">
                    <h3 id="word-card-title" className="font-serif text-[30px] leading-none font-medium">
                      {selectedWordChip}
                    </h3>
                    <span className="text-[14px] italic font-serif text-ink-3">{activeChipVocabItem.pos?.toLowerCase()}</span>
                  </div>
                  <p className="mt-2 text-[13px] text-ink-3">Found while rewriting</p>
                </div>
                <button onClick={() => setSelectedWordChip(null)} className="btn btn-ghost btn-icon -mr-2" aria-label="Close">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <p className="font-serif italic text-[17px] leading-relaxed text-ink-2">
                  &ldquo;The knight approached the <span className="pen-mark not-italic text-ink">{selectedWordChip}</span>{" "}
                  overlooking the valley.&rdquo;
                </p>

                <div>
                  <label htmlFor="chip-def" className="block text-[14px] font-medium mb-2">
                    What do you think it means?
                  </label>
                  <textarea
                    id="chip-def"
                    rows={3}
                    value={chipUserDef}
                    onChange={(e) => setChipUserDef(e.target.value)}
                    placeholder="Write your own meaning before you see the dictionary's."
                    disabled={chipRevealed}
                    className="field font-serif text-[16px] leading-relaxed resize-none"
                  />
                </div>

                {!chipRevealed ? (
                  <button onClick={handleSaveChipDefinition} disabled={!chipUserDef.trim()} className="btn btn-primary w-full h-11">
                    Check my meaning
                  </button>
                ) : (
                  <div className="space-y-4 fade">
                    <div className="rounded-lg bg-paper p-5 space-y-4">
                      <div>
                        <div className="text-[13px] text-ink-3">Dictionary meaning</div>
                        <p className="mt-1 font-serif text-[17px] leading-relaxed">{activeChipVocabItem.correctDef}</p>
                      </div>
                      <div>
                        <div className="text-[13px] text-ink-3">Goes with</div>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {activeChipVocabItem.collocations?.map((c, i) => (
                            <span key={i} className="tag bg-sheet font-serif text-[14px]">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-[13px] text-ink-3">Example</div>
                        <p className="mt-1 font-serif italic text-[16px] text-ink-2">&ldquo;{activeChipVocabItem.example}&rdquo;</p>
                      </div>
                    </div>
                    <p className="flex items-center gap-2 text-[14px] text-good">
                      <CheckCircle size={17} weight="fill" />
                      <span>Saved to your vocabulary</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="px-6 pb-6 flex justify-end">
                <button onClick={() => setSelectedWordChip(null)} className="btn btn-quiet">
                  Back to the rewrite
                </button>
              </div>
            </div>
          </Dialog>
        )}
      </div>
    </AppLayout>
  );
}
