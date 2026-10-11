import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PenTool,
  BookOpen,
  Trophy,
  Plus,
  Sparkles,
  ChevronDown,
  Flame,
  Search,
  BookMarked
} from "lucide-react";
import { useScribe } from "../../store";

export const TopHeader = ({ title, subtitle, onOpenCaptureModal }) => {
  const { state } = useScribe();
  const { user } = state;
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="h-16 border-b border-[#E8E2D8] bg-[#FAF8F5]/90 backdrop-blur-xs px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Title / Context */}
      <div>
        <h1 className="font-serif font-bold text-xl text-[#1A1A1E] tracking-tight leading-tight">
          {title || "Scribe"}
        </h1>
        {subtitle && (
          <p className="text-xs text-[#6B6F7B] mt-0.5 font-medium">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Quick Start Session Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#1F2E3D] hover:bg-[#15202B] text-[#FAF8F5] text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Start Session</span>
            <ChevronDown className="w-3 h-3 opacity-80" />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E4DDD1] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8A8D96]">
                  Select Writing Mode
                </div>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/write");
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-[#1A1A1E] hover:bg-[#F5F2EB] flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <PenTool className="w-3.5 h-3.5 text-[#1F2E3D]" />
                  <div>
                    <div className="font-semibold">Free Writing & Journal</div>
                    <div className="text-[10px] text-[#6B6F7B]">With optional AI Coach</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/book-session");
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-[#1A1A1E] hover:bg-[#F5F2EB] flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#B85D38]" />
                  <div>
                    <div className="font-semibold">Book Rewrite Session</div>
                    <div className="text-[10px] text-[#6B6F7B]">Split-screen PDF reader</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/challenges");
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-[#1A1A1E] hover:bg-[#F5F2EB] flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5 text-[#D97706]" />
                  <div>
                    <div className="font-semibold">Weekly Vocabulary Challenge</div>
                    <div className="text-[10px] text-[#6B6F7B]">Use 8 of 12 words naturally</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/revision-mode");
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-[#1A1A1E] hover:bg-[#F5F2EB] flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                  <div>
                    <div className="font-semibold">Revision Lab</div>
                    <div className="text-[10px] text-[#6B6F7B]">Sentence precision drills</div>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Quick Vocab Capture Button */}
        <button
          onClick={onOpenCaptureModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] hover:bg-white text-[#1A1A1E] border border-[#E0D9CD] text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
          title="Capture a new vocabulary word"
        >
          <BookMarked className="w-3.5 h-3.5 text-[#B85D38]" />
          <span>+ Add Word</span>
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-[#E2DCD2]" />

        {/* User Mini Profile */}
        <Link
          to="/profile"
          className="flex items-center gap-2.5 hover:opacity-85 transition-opacity"
        >
          <img
            src={user.avatar || "/avatar.jpg"}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border border-[#D5CDC0] shadow-2xs"
          />
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-[#1A1A1E] leading-tight">
              {user.name}
            </div>
            <div className="text-[10px] text-[#6B6F7B] leading-tight font-medium">
              Level IV Stylist
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
};
