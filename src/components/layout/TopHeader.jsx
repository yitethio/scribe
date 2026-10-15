import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PenNib,
  BookOpenText,
  Trophy,
  ArrowsClockwise,
  CaretDown,
  BookmarkSimple
} from "@phosphor-icons/react";

const sessionModes = [
  {
    path: "/write",
    icon: PenNib,
    title: "Free writing",
    detail: "A blank page, with the coach if you want it"
  },
  {
    path: "/book-session",
    icon: BookOpenText,
    title: "Book rewrite",
    detail: "Read on the left, rewrite on the right"
  },
  {
    path: "/challenges",
    icon: Trophy,
    title: "Weekly challenge",
    detail: "Use 8 of this week's 12 words"
  },
  {
    path: "/revision-mode",
    icon: ArrowsClockwise,
    title: "Revision lab",
    detail: "Repair one sentence at a time"
  }
];

export const StartSessionMenu = ({ align = "right" }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="btn btn-primary"
      >
        <span>Start a session</span>
        <CaretDown size={14} weight="bold" className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className={`pop absolute ${align === "right" ? "right-0" : "left-0"} mt-2 w-72 bg-sheet rounded-lg p-1.5 z-50 shadow-[0_12px_32px_-12px_rgb(22_24_28/0.28),0_2px_6px_rgb(22_24_28/0.06)]`}
        >
          {sessionModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.path}
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  navigate(mode.path);
                }}
                className="w-full text-left px-3 py-2.5 rounded-md hover:bg-paper flex items-start gap-3 transition-colors"
              >
                <Icon size={18} className="text-ink-2 mt-0.5 shrink-0" />
                <span>
                  <span className="block text-[14px] font-medium text-ink">{mode.title}</span>
                  <span className="block text-[13px] text-ink-3">{mode.detail}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const TopHeader = ({ title, subtitle, onOpenCaptureModal, compact = false }) => {
  if (compact) {
    return (
      <header className="h-16 px-6 lg:px-8 flex items-center justify-between gap-4 bg-paper shrink-0">
        <div className="min-w-0 flex items-baseline gap-3">
          <h1 className="font-serif text-[22px] font-medium tracking-[-0.01em] truncate">{title}</h1>
          {subtitle && <p className="hidden xl:block text-[14px] text-ink-3 truncate">{subtitle}</p>}
        </div>
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <button onClick={onOpenCaptureModal} className="btn btn-ghost">
            <BookmarkSimple size={17} className="text-pen" />
            <span>Save a word</span>
          </button>
          <StartSessionMenu />
        </div>
      </header>
    );
  }

  return (
    <header className="px-5 sm:px-8 lg:px-12 pt-8 lg:pt-14 pb-8 lg:pb-10 max-w-[1240px] mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl rise">
          <h1 className="font-serif text-[34px] sm:text-[44px] leading-[1.02] font-medium tracking-[-0.025em]">
            {title || "Scribe"}
          </h1>
          {subtitle && <p className="mt-3 text-[16px] text-ink-2 max-w-[60ch]">{subtitle}</p>}
        </div>
        <div className="hidden md:flex items-center gap-2 shrink-0 rise" style={{ "--i": 1 }}>
          <button onClick={onOpenCaptureModal} className="btn btn-ghost">
            <BookmarkSimple size={17} className="text-pen" />
            <span>Save a word</span>
          </button>
          <StartSessionMenu />
        </div>
      </div>
    </header>
  );
};
