import React, { useState } from "react";
import { MagnifyingGlass, Plus, Books, ArrowRight } from "@phosphor-icons/react";
import { useScribe } from "../store/scribeContext";
import { AppLayout, pageClass } from "../components/layout/AppLayout";
import { VocabDetailDrawer } from "../components/vocabulary/VocabDetailDrawer";
import { SpacedPracticeModal } from "../components/vocabulary/SpacedPracticeModal";

const filters = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "learning", label: "Learning" },
  { id: "practicing", label: "Practicing" },
  { id: "mastered", label: "Mastered" },
  { id: "frequently misused", label: "Often misused" }
];

const isMisused = (w) => w.timesUsed > 1 && w.timesUsedCorrectly / w.timesUsed < 0.6;

const statusTone = { mastered: "tag-good", practicing: "tag-warn", learning: "tag-info", new: "tag-pen" };

const StatusTag = ({ status }) => <span className={`tag tag-dot ${statusTone[status] || ""} capitalize`}>{status}</span>;

export default function VocabularyLibrary() {
  const { state } = useScribe();
  const { vocabulary } = state;

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("entries");
  const [inspectingWord, setInspectingWord] = useState(null);
  const [practiceWord, setPracticeWord] = useState(null);

  const query = searchQuery.toLowerCase();
  const filteredWords = vocabulary.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(query) ||
      item.personalDef?.toLowerCase().includes(query) ||
      item.correctDef?.toLowerCase().includes(query);
    if (!matchesSearch) return false;
    if (activeFilter === "all") return true;
    if (activeFilter === "frequently misused") return isMisused(item);
    return item.status.toLowerCase() === activeFilter;
  });

  const filterCounts = {
    all: vocabulary.length,
    new: vocabulary.filter((w) => w.status === "new").length,
    learning: vocabulary.filter((w) => w.status === "learning").length,
    practicing: vocabulary.filter((w) => w.status === "practicing").length,
    mastered: vocabulary.filter((w) => w.status === "mastered").length,
    "frequently misused": vocabulary.filter(isMisused).length
  };

  return (
    <AppLayout
      title="Vocabulary"
      subtitle="Every word you have saved, in your own definition first and the dictionary's second."
    >
      {({ openCaptureModal }) => (
        <div className={`${pageClass} space-y-6`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rise">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlass size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search words and definitions"
                aria-label="Search vocabulary"
                className="field pl-10 h-11"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="seg" role="group" aria-label="View">
                <button
                  onClick={() => setViewMode("entries")}
                  aria-pressed={viewMode === "entries"}
                  className="seg-item"
                >
                  Entries
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  aria-pressed={viewMode === "table"}
                  className="seg-item"
                >
                  Table
                </button>
              </div>
              <button onClick={() => openCaptureModal()} className="btn btn-primary">
                <Plus size={15} weight="bold" />
                <span>Save a word</span>
              </button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1 rise" style={{ "--i": 1 }} role="group" aria-label="Filter">
            {filters.map((f) => {
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  aria-pressed={isActive}
                  className={`h-9 px-3.5 rounded-full border text-[14px] font-medium flex items-center gap-2 shrink-0 transition-colors ${
                    isActive ? "bg-ink border-ink text-sheet" : "bg-sheet border-edge text-ink-2 hover:border-line hover:text-ink"
                  }`}
                >
                  <span>{f.label}</span>
                  <span className={`tabular text-[12px] font-semibold ${isActive ? "text-sheet/60" : "text-ink-3"}`}>
                    {filterCounts[f.id] || 0}
                  </span>
                </button>
              );
            })}
          </div>

          {filteredWords.length === 0 ? (
            <div className="card px-6 py-16 text-center rise" style={{ "--i": 2 }}>
              <span className="icon-tile w-12 h-12 mx-auto text-pen">
                <Books size={22} />
              </span>
              <h2 className="mt-4 font-serif text-[26px]">No words match</h2>
              <p className="mt-1 text-[15px] text-ink-2">
                Save words from your reading, your drafts or a book session, and they will appear here.
              </p>
              <button onClick={() => openCaptureModal()} className="btn btn-outline mt-6">
                Save a word
              </button>
            </div>
          ) : viewMode === "entries" ? (
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-4 sm:gap-5">
              {filteredWords.map((item, idx) => {
                const accuracy = item.timesUsed ? Math.round((item.timesUsedCorrectly / item.timesUsed) * 100) : 0;
                return (
                  <li key={item.id} className="rise" style={{ "--i": Math.min(idx + 2, 8) }}>
                    <button
                      onClick={() => setInspectingWord(item)}
                      className="card w-full h-full text-left p-5 sm:p-6 flex flex-col gap-3 hover:border-line transition-colors group"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="eyebrow">{item.pos}</span>
                        <StatusTag status={item.status} />
                      </div>
                      <span className="font-serif text-[30px] leading-none tracking-[-0.015em] truncate">{item.word}</span>
                      <p className="font-serif text-[16.5px] leading-[1.5] text-ink-soft line-clamp-2">{item.correctDef}</p>
                      {item.personalDef && (
                        <p className="inset px-3.5 py-2.5 text-[13.5px] text-ink-2 line-clamp-2">
                          <span className="font-semibold text-ink">Mine: </span>
                          {item.personalDef}
                        </p>
                      )}
                      <div className="mt-auto pt-3 border-t border-rule flex flex-col gap-2">
                        <div className="flex items-center justify-between text-[13px] text-ink-3 tabular">
                          <span>
                            Used {item.timesUsed} {item.timesUsed === 1 ? "time" : "times"} · {accuracy}% right
                          </span>
                          <ArrowRight
                            size={15}
                            className="transition-transform group-hover:translate-x-0.5 group-hover:text-ink"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="track h-1.5">
                          <span className={accuracy >= 80 ? "bg-good" : accuracy >= 60 ? "" : "bg-pen"} style={{ width: `${accuracy}%` }} />
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="card overflow-x-auto rise" style={{ "--i": 2 }}>
              <table className="w-full text-left text-[14px] min-w-[720px]">
                <thead>
                  <tr className="eyebrow text-[11px]">
                    <th className="font-semibold py-4 px-6">Word</th>
                    <th className="font-semibold py-4 px-4">Part of speech</th>
                    <th className="font-semibold py-4 px-4">Meaning</th>
                    <th className="font-semibold py-4 px-4">Status</th>
                    <th className="font-semibold py-4 px-4 text-right">Used</th>
                    <th className="py-4 px-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWords.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setInspectingWord(item)}
                      className="border-t border-rule hover:bg-[#f6f3ec] transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-6 font-serif text-[19px]">{item.word}</td>
                      <td className="py-4 px-4 text-ink-2">{item.pos}</td>
                      <td className="py-4 px-4 font-serif text-[15.5px] text-ink-2 max-w-xs truncate">{item.correctDef}</td>
                      <td className="py-4 px-4">
                        <StatusTag status={item.status} />
                      </td>
                      <td className="py-4 px-4 text-right tabular">{item.timesUsed}</td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPracticeWord(item);
                          }}
                          className="btn btn-quiet btn-sm"
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

          <VocabDetailDrawer
            wordItem={inspectingWord}
            isOpen={!!inspectingWord}
            onClose={() => setInspectingWord(null)}
            onStartPractice={(item) => setPracticeWord(item)}
          />
          <SpacedPracticeModal wordItem={practiceWord} isOpen={!!practiceWord} onClose={() => setPracticeWord(null)} />
        </div>
      )}
    </AppLayout>
  );
}
