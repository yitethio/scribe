import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PenLine,
  BookOpen,
  Library,
  Trophy,
  RefreshCw,
  TrendingUp,
  UserCheck,
  Flame,
  PlusCircle,
  Sparkles,
  RotateCcw
} from "lucide-react";
import { useScribe } from "../../store";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/write", label: "Write", icon: PenLine, badge: "Coach" },
  { path: "/book-session", label: "Book Session", icon: BookOpen, badge: "PDF Split" },
  { path: "/vocabulary", label: "Vocabulary", icon: Library, countKey: "vocab" },
  { path: "/challenges", label: "Challenges", icon: Trophy, badge: "Active" },
  { path: "/revision-mode", label: "Revision Mode", icon: RefreshCw },
  { path: "/progress", label: "Progress", icon: TrendingUp },
  { path: "/profile", label: "Writing Profile", icon: UserCheck },
];

export const Sidebar = ({ onOpenCaptureModal }) => {
  const { state, resetToDefaults } = useScribe();
  const { user, vocabulary } = state;

  return (
    <aside className="w-64 bg-[#F5F2EB] border-r border-[#E8E2D8] flex flex-col h-screen select-none shrink-0 sticky top-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#E8E2D8]/80 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#1F2E3D] text-[#FAF8F5] flex items-center justify-center shadow-xs group-hover:bg-[#15202B] transition-colors">
            <span className="font-serif font-bold text-lg leading-none italic">S</span>
          </div>
          <div>
            <span className="font-serif font-bold text-lg text-[#1A1A1E] tracking-tight block leading-tight">
              Scribe
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#80838E] block">
              Mastery Lab
            </span>
          </div>
        </NavLink>
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#EAE3D6] text-[#555861]">
          v2.4
        </span>
      </div>

      {/* Quick Add Word Action */}
      <div className="p-3">
        <button
          onClick={onOpenCaptureModal}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#FAF8F5] hover:bg-white text-[#1A1A1E] text-xs font-semibold rounded-lg border border-[#E0D9CD] shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <PlusCircle className="w-4 h-4 text-[#B85D38] group-hover:scale-105 transition-transform" />
          <span>Save New Vocabulary</span>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto">
        <div className="px-2 pb-1.5 pt-1 text-[11px] font-bold uppercase tracking-wider text-[#8A8D96]">
          Deliberate Practice
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? "bg-[#1F2E3D] text-[#FAF8F5] font-semibold shadow-2xs"
                    : "text-[#4A4D55] hover:bg-[#EAE4D9]/70 hover:text-[#1A1A1E]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? "text-[#FAF8F5]"
                          : "text-[#7C7F8A] group-hover:text-[#1A1A1E]"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                        isActive
                          ? "bg-white/20 text-[#FAF8F5]"
                          : "bg-[#EAE4D9] text-[#555861]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {item.countKey === "vocab" && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                        isActive
                          ? "bg-white/20 text-[#FAF8F5]"
                          : "bg-[#EAE4D9] text-[#555861]"
                      }`}
                    >
                      {vocabulary.length}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Streak & Learning Status Card */}
      <div className="p-3 border-t border-[#E8E2D8]">
        <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E4DDD1] shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1A1A1E]">
              <Flame className="w-4 h-4 text-[#EA580C] fill-[#EA580C]" />
              <span>{user.streakDays} Day Streak</span>
            </div>
            <span className="text-[10px] font-medium text-[#059669] bg-[#DCFCE7] px-1.5 py-0.2 rounded">
              Active
            </span>
          </div>

          <div className="flex items-center gap-1 justify-between mb-2">
            {user.streakHistory.slice(0, 7).map((active, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full ${
                  active ? "bg-[#EA580C]" : "bg-[#E5DFD4]"
                }`}
                title={`Day ${idx + 1}: ${active ? "Written" : "Missed"}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#6B6F7B]">
            <span>Monthly Goal</span>
            <span className="font-semibold text-[#1A1A1E]">
              {user.wordsWrittenThisMonth.toLocaleString()} / 5,000 w
            </span>
          </div>
          <div className="w-full bg-[#EAE4D9] h-1 rounded-full mt-1 overflow-hidden">
            <div
              className="bg-[#1F2E3D] h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.round((user.wordsWrittenThisMonth / 5000) * 100))}%`
              }}
            />
          </div>
        </div>

        {/* Demo reset trigger */}
        <div className="mt-2 flex items-center justify-between px-1">
          <span className="text-[10px] text-[#8C909B]">No AI generation • Human writer</span>
          <button
            onClick={resetToDefaults}
            title="Reset sample data"
            className="text-[10px] text-[#8C909B] hover:text-[#1A1A1E] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
