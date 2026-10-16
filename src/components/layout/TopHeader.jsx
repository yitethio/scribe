import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PencilSimpleLine, BookOpen, Trophy, ArrowsClockwise, CaretDown } from "@phosphor-icons/react";

const sessionModes = [
  { path: "/write", icon: PencilSimpleLine, title: "Free writing", detail: "A blank page, with the coach if you want it" },
  { path: "/book-session", icon: BookOpen, title: "Book rewrite", detail: "Read on the left, rewrite on the right" },
  { path: "/challenges", icon: Trophy, title: "Weekly challenge", detail: "Use 8 of this week's 12 words" },
  { path: "/revision-mode", icon: ArrowsClockwise, title: "Revision lab", detail: "Repair one sentence at a time" }
];

export const todayLabel = () =>
  new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

// A split button: the main half starts free writing, the caret picks another kind of session.
export const StartSessionMenu = ({ compact = false }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const height = compact ? "h-10" : "h-12";

  return (
    <div className="relative flex" ref={ref}>
      <Link
        to="/write"
        className={`flex items-center gap-2.5 ${height} px-5 bg-ink text-sheet rounded-l-[10px] font-semibold hover:bg-black transition-colors`}
      >
        <PencilSimpleLine size={16} />
        Start a session
      </Link>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Choose session type"
        aria-expanded={open}
        aria-haspopup="menu"
        className={`${height} ${compact ? "w-10" : "w-12"} bg-ink text-sheet border-l border-[#45423b] rounded-r-[10px] flex items-center justify-center hover:bg-black transition-colors`}
      >
        <CaretDown size={16} weight="bold" className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="pop absolute right-0 top-full mt-2 w-72 bg-sheet border border-edge rounded-xl p-1.5 z-50 shadow-[0_12px_32px_-12px_rgb(27_26_23/0.3)]"
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
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-tint flex items-start gap-3 transition-colors"
              >
                <Icon size={18} className="text-ink-soft mt-0.5 shrink-0" />
                <span>
                  <span className="block text-[14px] font-semibold">{mode.title}</span>
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

export const TopHeader = ({ title, subtitle, eyebrow, compact = false }) => {
  if (compact) {
    return (
      <header className="h-16 px-4 sm:px-6 flex items-center justify-between gap-4 bg-paper shrink-0">
        <div className="min-w-0 flex items-baseline gap-3">
          <h1 className="font-serif text-[24px] tracking-[-0.015em] truncate">{title}</h1>
          {subtitle && <p className="hidden xl:block text-[14px] text-ink-3 truncate">{subtitle}</p>}
        </div>
        <div className="hidden md:flex shrink-0">
          <StartSessionMenu compact />
        </div>
      </header>
    );
  }

  return (
    <header className="w-full max-w-[1232px] mx-auto px-[clamp(16px,4vw,56px)] pt-8 lg:pt-11 pb-7">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <div className="flex-[1_1_480px] min-w-0 flex flex-col gap-2.5 rise">
          <p className="text-[13px] font-medium text-ink-3">{eyebrow || todayLabel()}</p>
          <h1 className="font-serif font-normal text-[clamp(36px,4.4vw,52px)] leading-[1.05] tracking-[-0.025em]">
            {title || "Scribe"}
          </h1>
          {subtitle && <p className="max-w-[600px] text-[16px] text-ink-2">{subtitle}</p>}
        </div>
        <div className="flex shrink-0 rise" style={{ "--i": 1 }}>
          <StartSessionMenu />
        </div>
      </div>
    </header>
  );
};
