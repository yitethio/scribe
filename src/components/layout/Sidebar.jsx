import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  SquaresFour,
  PenNib,
  BookOpenText,
  Books,
  Trophy,
  ArrowsClockwise,
  TrendUp,
  IdentificationCard,
  BookmarkSimple,
  ArrowCounterClockwise,
  X
} from "@phosphor-icons/react";
import { useScribe } from "../../store";

const MONTHLY_GOAL = 5000;

const navItems = [
  { path: "/", label: "Dashboard", icon: SquaresFour },
  { path: "/write", label: "Write", icon: PenNib },
  { path: "/book-session", label: "Book session", icon: BookOpenText },
  { path: "/vocabulary", label: "Vocabulary", icon: Books, countKey: "vocab" },
  { path: "/challenges", label: "Challenges", icon: Trophy },
  { path: "/revision-mode", label: "Revision lab", icon: ArrowsClockwise },
  { path: "/progress", label: "Progress", icon: TrendUp },
  { path: "/profile", label: "Writing profile", icon: IdentificationCard }
];

export const Wordmark = ({ className = "" }) => (
  <Link to="/" className={`inline-flex flex-col leading-none group ${className}`}>
    <span className="font-serif text-[26px] font-medium tracking-[-0.02em] text-ink">
      Scribe
    </span>
    <svg
      viewBox="0 0 80 8"
      className="w-[64px] h-[6px] -mt-0.5 text-pen transition-transform duration-300 group-hover:translate-x-0.5"
      aria-hidden="true"
    >
      <path
        d="M2 5.5c12-3 25-3.6 38-2 13 1.6 25 1.2 38-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  </Link>
);

export const Sidebar = ({ onOpenCaptureModal, onNavigate, onClose }) => {
  const { state, resetToDefaults } = useScribe();
  const { user, vocabulary } = state;
  const goalPercent = Math.min(100, Math.round((user.wordsWrittenThisMonth / MONTHLY_GOAL) * 100));

  return (
    <aside className="w-64 bg-rail flex flex-col h-full select-none">
      <div className="px-6 pt-6 pb-5 flex items-start justify-between">
        <Wordmark />
        {onClose && (
          <button onClick={onClose} className="btn btn-ghost btn-icon -mr-2 -mt-1" aria-label="Close menu">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={() => {
            onOpenCaptureModal();
            onNavigate?.();
          }}
          className="btn btn-quiet w-full justify-start bg-sheet hover:bg-tint"
        >
          <BookmarkSimple size={17} weight="bold" className="text-pen" />
          <span>Save a word</span>
        </button>
      </div>

      <nav className="flex-1 px-3 overflow-y-auto" aria-label="Main">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center gap-3 h-10 px-3 rounded-md text-[14px] transition-colors ${
                      isActive
                        ? "bg-sheet text-ink font-medium"
                        : "text-ink-2 hover:bg-tint hover:text-ink"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={18}
                        weight={isActive ? "fill" : "regular"}
                        className={isActive ? "text-pen" : "text-ink-3"}
                      />
                      <span className="flex-1">{item.label}</span>
                      {item.countKey === "vocab" && (
                        <span className="text-[13px] text-ink-3 tabular">{vocabulary.length}</span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-6 pt-5 pb-4 space-y-5">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-[34px] leading-none tracking-[-0.02em] tabular">
              {user.streakDays}
            </span>
            <span className="text-[14px] text-ink-2">day streak</span>
          </div>
          <div className="flex gap-1 mt-3" aria-label="Last seven days">
            {user.streakHistory.slice(0, 7).map((active, idx) => (
              <span
                key={idx}
                className={`h-1.5 flex-1 rounded-full ${active ? "bg-pen" : "bg-tint-2"}`}
                title={`Day ${idx + 1}: ${active ? "written" : "missed"}`}
              />
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-[13px] text-ink-2">
            <span>This month</span>
            <span className="tabular text-ink">
              {user.wordsWrittenThisMonth.toLocaleString()} of {MONTHLY_GOAL.toLocaleString()}
            </span>
          </div>
          <div className="mt-1.5 h-1 rounded-full bg-tint-2 overflow-hidden">
            <div className="h-full bg-ink rounded-full grow-x" style={{ width: `${goalPercent}%` }} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Link
            to="/profile"
            onClick={onNavigate}
            className="flex items-center gap-2.5 min-w-0 rounded-md -ml-1 p-1 hover:bg-tint transition-colors"
          >
            <img
              src={user.avatar || "/avatar.jpg"}
              alt=""
              className="w-8 h-8 rounded-md object-cover shrink-0"
            />
            <span className="min-w-0">
              <span className="block text-[13.5px] font-medium text-ink truncate">{user.name}</span>
              <span className="block text-[12.5px] text-ink-3 truncate">{user.role.split(" • ")[0]}</span>
            </span>
          </Link>
          <button
            onClick={resetToDefaults}
            title="Reset the sample data"
            aria-label="Reset the sample data"
            className="btn btn-ghost btn-icon shrink-0"
          >
            <ArrowCounterClockwise size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
