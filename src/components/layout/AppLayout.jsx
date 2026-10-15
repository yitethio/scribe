import React, { useEffect, useState } from "react";
import { List, BookmarkSimple } from "@phosphor-icons/react";
import { Sidebar, Wordmark } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { VocabCaptureModal } from "../vocabulary/VocabCaptureModal";

export const AppLayout = ({ children, title, subtitle, hideTopHeader = false, compactHeader = false }) => {
  const [captureModalOpen, setCaptureModalOpen] = useState(false);
  const [captureInitialWord, setCaptureInitialWord] = useState("");
  const [captureInitialContext, setCaptureInitialContext] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleOpenCapture = (word = "", context = "") => {
    setCaptureInitialWord(word);
    setCaptureInitialContext(context);
    setCaptureModalOpen(true);
  };

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div className="flex min-h-[100dvh] bg-paper text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] btn btn-primary"
      >
        Skip to content
      </a>

      {/* Desktop rail */}
      <div className="hidden lg:block sticky top-0 h-[100dvh] shrink-0">
        <Sidebar onOpenCaptureModal={() => handleOpenCapture()} />
      </div>

      {/* Phone and tablet drawer */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <button
            className="fade absolute inset-0 bg-ink/40"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="slide-in-left absolute inset-y-0 left-0 h-full">
            <Sidebar
              onOpenCaptureModal={() => handleOpenCapture()}
              onNavigate={() => setMenuOpen(false)}
              onClose={() => setMenuOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {!hideTopHeader && (
          <div className="lg:hidden h-14 px-3 flex items-center justify-between bg-paper sticky top-0 z-30">
            <button
              onClick={() => setMenuOpen(true)}
              className="btn btn-ghost btn-icon"
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <List size={20} />
            </button>
            <Wordmark className="scale-[0.85]" />
            <button
              onClick={() => handleOpenCapture()}
              className="btn btn-ghost btn-icon"
              aria-label="Save a word"
            >
              <BookmarkSimple size={19} className="text-pen" />
            </button>
          </div>
        )}

        {!hideTopHeader && (
          <TopHeader
            title={title}
            subtitle={subtitle}
            compact={compactHeader}
            onOpenCaptureModal={() => handleOpenCapture()}
          />
        )}

        <main id="main" className="flex-1 min-w-0">
          {typeof children === "function" ? children({ openCaptureModal: handleOpenCapture }) : children}
        </main>
      </div>

      <VocabCaptureModal
        isOpen={captureModalOpen}
        onClose={() => setCaptureModalOpen(false)}
        initialWord={captureInitialWord}
        initialContext={captureInitialContext}
      />
    </div>
  );
};
