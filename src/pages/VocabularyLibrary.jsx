import React, { useState } from "react";
import {
  Library,
  Search,
  Filter,
  Plus,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Table,
  LayoutGrid,
  ChevronRight,
  TrendingUp,
  Bookmark
} from "lucide-react";
import { useScribe } from "../store/scribeContext";
import { AppLayout } from "../components/layout/AppLayout";
import { VocabDetailDrawer } from "../components/vocabulary/VocabDetailDrawer";
import { SpacedPracticeModal } from "../components/vocabulary/SpacedPracticeModal";

export default function VocabularyLibrary() {
  const { state } = useScribe();
  const { vocabulary } = state;

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'

  // Modal / Drawer state
  const [inspectingWord, setInspectingWord] = useState(null);
  const [practiceWord, setPracticeWord] = useState(null);

  // Filter logic
  const filteredWords = vocabulary.filter((item) => {
    // Search query filter
    const matchesSearch =
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.personalDef?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.correctDef?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Status filter
    if (activeFilter === "all") return true;
    if (activeFilter === "frequently misused") {
      return item.timesUsed > 1 && item.timesUsedCorrectly / item.timesUsed < 0.6;
    }
    return item.status.toLowerCase() === activeFilter.toLowerCase();
  });

  const filterCounts = {
    all: vocabulary.length,
    new: vocabulary.filter((w) => w.status === "new").length,
    learning: vocabulary.filter((w) => w.status === "learning").length,
    practicing: vocabulary.filter((w) => w.status === "practicing").length,
    mastered: vocabulary.filter((w) => w.status === "mastered").length,
    "frequently misused": vocabulary.filter(
      (w) => w.timesUsed > 1 && w.timesUsedCorrectly / w.timesUsed < 0.6
    ).length
  };

  return (
    <AppLayout
      title="Vocabulary Library"
      subtitle="Your deliberate repository of acquired words, personal definitions & retention tracking"
    >
      {({ openCaptureModal }) => (
        <div className="p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-150">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8D96]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search words, definitions, or collocations..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-[#DDD6C9] rounded-xl text-xs font-serif text-[#1A1A1E] placeholder:text-[#8C909B] focus:outline-hidden focus:border-[#1F2E3D]"
              />
            </div>

            {/* Right Controls: View Toggle & Add Word */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-[#F5F2EB] p-1 rounded-lg border border-[#E5DFD4]">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    viewMode === "grid" ? "bg-white text-[#1A1A1E] shadow-2xs" : "text-[#7A7E8B]"
                  }`}
                  title="Card Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    viewMode === "table" ? "bg-white text-[#1A1A1E] shadow-2xs" : "text-[#7A7E8B]"
                  }`}
                  title="Table View"
                >
                  <Table className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => openCaptureModal()}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#1F2E3D] hover:bg-[#15202B] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Capture Word</span>
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 border-b border-[#E8E2D8] pb-4">
            {[
              { id: "all", label: "All Words" },
              { id: "new", label: "New" },
              { id: "learning", label: "Learning" },
              { id: "practicing", label: "Practicing" },
              { id: "mastered", label: "Mastered" },
              { id: "frequently misused", label: "Frequently Misused" }
            ].map((f) => {
              const count = filterCounts[f.id] || 0;
              const isActive = activeFilter === f.id;

              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#1F2E3D] text-[#FAF8F5] font-semibold shadow-2xs"
                      : "bg-white text-[#52555F] hover:bg-[#F2ECE1] border border-[#DDD6C9]"
                  }`}
                >
                  <span>{f.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-[#F0EAE0] text-[#6B6F7B]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Words Display: Grid vs Table */}
          {filteredWords.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-[#E4DDD1] space-y-3">
              <Library className="w-8 h-8 mx-auto text-[#B85D38]" />
              <h3 className="font-serif font-bold text-base text-[#1A1A1E]">
                No vocabulary words match this filter
              </h3>
              <p className="text-xs text-[#6B6F7B]">
                Capture words from your reading, writing workspace, or book rewriting sessions.
              </p>
            </div>
          ) : viewMode === "grid" ? (
            /* Card Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWords.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setInspectingWord(item)}
                  className="bg-white p-5 rounded-2xl border border-[#E4DDD1] shadow-2xs hover:border-[#C5BCAD] hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-lg text-[#1A1A1E] group-hover:text-[#B85D38] transition-colors">
                          {item.word}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EFE9DD] text-[#555861] font-medium">
                          {item.pos}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          item.status === "mastered"
                            ? "bg-[#DCFCE7] text-[#065F46]"
                            : item.status === "practicing"
                            ? "bg-[#FEF3C7] text-[#92400E]"
                            : "bg-[#FAF0E6] text-[#B85D38]"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="text-xs text-[#4A4D55] font-serif leading-relaxed line-clamp-2">
                      {item.correctDef}
                    </p>

                    {item.personalDef && (
                      <div className="pt-1 text-[11px] text-[#6B6F7B] italic">
                        My definition: "{item.personalDef}"
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#F2EDE4] flex items-center justify-between text-[11px] text-[#7A7E8B]">
                    <div className="flex items-center gap-2">
                      <span>Used {item.timesUsed}x</span>
                      <span>•</span>
                      <span>{item.confidence} confidence</span>
                    </div>
                    <span className="text-[#1F2E3D] font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                      Details <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Clean Editorial Table View */
            <div className="bg-white rounded-2xl border border-[#E4DDD1] shadow-2xs overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E8E2D8] bg-[#FAF8F5] text-[10px] font-bold uppercase tracking-wider text-[#8A8D96]">
                    <th className="py-3 px-5">Word</th>
                    <th className="py-3 px-4">Part of Speech</th>
                    <th className="py-3 px-4">Master Meaning</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Usage</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EDE4] font-serif">
                  {filteredWords.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setInspectingWord(item)}
                      className="hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-5 font-bold text-[#1A1A1E]">
                        {item.word}
                      </td>
                      <td className="py-3.5 px-4 font-sans text-[#6B6F7B]">
                        {item.pos}
                      </td>
                      <td className="py-3.5 px-4 text-[#3E414A] max-w-xs truncate">
                        {item.correctDef}
                      </td>
                      <td className="py-3.5 px-4 font-sans">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            item.status === "mastered"
                              ? "bg-[#DCFCE7] text-[#065F46]"
                              : item.status === "practicing"
                              ? "bg-[#FEF3C7] text-[#92400E]"
                              : "bg-[#FAF0E6] text-[#B85D38]"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-[#1A1A1E]">
                        {item.timesUsed}x
                      </td>
                      <td className="py-3.5 px-4 text-right font-sans">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPracticeWord(item);
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-[#1F2E3D] hover:bg-[#F2ECE1] rounded border border-[#DDD6C9] cursor-pointer"
                        >
                          Practice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Word Detail Drawer */}
          <VocabDetailDrawer
            wordItem={inspectingWord}
            isOpen={!!inspectingWord}
            onClose={() => setInspectingWord(null)}
            onStartPractice={(item) => setPracticeWord(item)}
          />

          {/* Spaced Practice Drill Modal */}
          <SpacedPracticeModal
            wordItem={practiceWord}
            isOpen={!!practiceWord}
            onClose={() => setPracticeWord(null)}
          />
        </div>
      )}
    </AppLayout>
  );
}
