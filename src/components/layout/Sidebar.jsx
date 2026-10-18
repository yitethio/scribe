import React, { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  SquaresFour,
  PencilSimpleLine,
  BookOpen,
  Trophy,
  ArrowsClockwise,
  BookmarkSimple,
  TrendUp,
  IdentificationCard,
  Plus,
  CaretUpDown,
  ArrowCounterClockwise,
  X
} from "@phosphor-icons/react";
import { useScribe } from "../../store";

const navGroups = [
  {
    items: [{ path: "/", label: "Dashboard", icon: SquaresFour }]
  },
  {
    label: "Practice",
    items: [
      { path: "/write", label: "Write", icon: PencilSimpleLine },
      { path: "/book-session", label: "Book session", icon: BookOpen },
      { path: "/challenges", label: "Challenges", icon: Trophy },
      { path: "/revision-mode", label: "Revision lab", icon: ArrowsClockwise }
    ]
  },
  {
    label: "You",
    items: [
      { path: "/vocabulary", label: "Vocabulary", icon: BookmarkSimple, countKey: "vocab" },
      { path: "/progress", label: "Progress", icon: TrendUp },
      { path: "/profile", label: "Writing profile", icon: IdentificationCard }
    ]
  }
];

export const Wordmark = ({ className = "" }) => (
  <Link to="/" className={`inline-flex items-center gap-2.5 ${className}`}>
    <PencilSimpleLine size={26} className="text-pen" />
    <span className="font-serif text-[28px] leading-none tracking-[-0.02em] text-ink">Scribe</span>
  </Link>
);

const initials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const AccountMenu = ({ onNavigate }) => {
  const { resetToDefaults } = useScribe();
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

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        className="btn btn-ghost btn-icon"
      >
        <CaretUpDown size={18} />
      </button>
      {open && (
        <div
          role="menu"
          className="pop absolute bottom-full right-0 mb-2 w-56 bg-sheet border border-edge rounded-xl p-1.5 z-50 shadow-[0_12px_32px_-12px_rgb(27_26_23/0.3)]"
        >
          <Link
            to="/profile"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onNavigate?.();
            }}
            className="flex items-center gap-3 px-3 h-10 rounded-lg hover:bg-tint text-[14px]"
          >
            <IdentificationCard size={17} className="text-ink-3" />
            Writing profile
          </Link>
          <button
            role="menuitem"
            onClick={() => {
              resetToDefaults();
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 h-10 rounded-lg hover:bg-tint text-[14px] text-left"
          >
            <ArrowCounterClockwise size={17} className="text-ink-3" />
            Reset the sample data
          </button>
        </div>
      )}
    </div>
  );
};

export const Sidebar = ({ onOpenCaptureModal, onNavigate, onClose }) => {
  const { state } = useScribe();
  const { user, vocabulary } = state;
  const [draftWord, setDraftWord] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    onOpenCaptureModal(draftWord.trim());
    setDraftWord("");
    onNavigate?.();
  };

  const roleWords = user.role.split(" • ")[0].split(" ");
  const title = roleWords.pop();
  const level = roleWords.join(" ");

  return (
    <aside className="w-[288px] h-full bg-rail border-r border-rail-line flex flex-col gap-7 px-5 pt-7 pb-6 overflow-y-auto">
      <div className="flex items-center justify-between px-2">
        <Wordmark />
        {onClose && (
          <button onClick={onClose} className="btn btn-ghost btn-icon -mr-3" aria-label="Close menu">
            <X size={18} />
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-1.5">
        <label htmlFor="save-word" className="text-[12px] font-medium text-ink-3 px-1">
          Save a word
        </label>
        <div className="flex items-center gap-2 h-11 pl-3 pr-1.5 bg-sheet border border-line rounded-[10px] focus-within:border-ink transition-colors">
          <BookmarkSimple size={16} className="text-ink-3 shrink-0" />
          <input
            id="save-word"
            type="text"
            value={draftWord}
            onChange={(e) => setDraftWord(e.target.value)}
            placeholder="Type a word you met…"
            className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[14px] placeholder:text-ink-3"
          />
          <button
            type="submit"
            aria-label="Save word"
            className="w-8 h-8 rounded-[7px] bg-ink text-sheet flex items-center justify-center hover:bg-black transition-colors shrink-0"
          >
            <Plus size={14} weight="bold" />
          </button>
        </div>
      </form>

      <nav aria-label="Main" className="flex-1 flex flex-col gap-5">
        {navGroups.map((group, gi) => (
          <div key={gi} className="flex flex-col gap-0.5">
            {group.label && <div className="eyebrow text-[11px] px-3 pb-1.5">{group.label}</div>}
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center gap-3 h-10 px-3 rounded-[9px] text-[15px] transition-colors ${
                      isActive
                        ? "bg-sheet font-semibold text-ink shadow-[0_0_0_1px_var(--color-rail-line)]"
                        : "text-ink-soft hover:bg-[#e8e3d8]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={18} className={isActive ? "text-pen" : ""} />
                      <span className="flex-1">{item.label}</span>
                      {item.countKey === "vocab" && <span className="count">{vocabulary.length}</span>}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-3 p-3 border-t border-rail-line">
        <div
          aria-hidden="true"
          className="w-[38px] h-[38px] rounded-full bg-ink text-paper flex items-center justify-center font-serif text-[16px] shrink-0"
        >
          {initials(user.name)}
        </div>
        <div className="flex-1 min-w-0 flex flex-col leading-tight">
          <span className="font-semibold text-[14px] truncate">{user.name}</span>
          <span className="text-[12px] text-ink-3 truncate">
            {level} · {title}
          </span>
        </div>
        <AccountMenu onNavigate={onNavigate} />
      </div>
    </aside>
  );
};
