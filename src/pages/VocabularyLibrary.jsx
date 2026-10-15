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

const statusTag = (status) =>
  status === "mastered" ? "tag-good" : status === "practicing" ? "tag-warn" : "tag-pen";

const StatusTag = ({ status }) => (
  <span className={`tag ${statusTag(status)} capitalize`}>{status}</span>
);

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

          <div className="flex gap-1 overflow-x-auto -mx-1 px-1 pb-1 rise" style={{ "--i": 1 }} role="group" aria-label="Filter">
            {filters.map((f) => {
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  aria-pressed={isActive}
                  className={`h-9 px-3.5 rounded-md text-[14px] flex items-center gap-2 shrink-0 transition-colors ${
                    isActive ? "bg-ink text-paper" : "text-ink-2 hover:bg-tint hover:text-ink"
                  }`}
                >
                  <span>{f.label}</span>
                  <span className={`tabular text-[13px] ${isActive ? "text-paper/60" : "text-ink-3"}`}>
                    {filterCounts[f.id] || 0}
                  </span>
                </button>
              );
            })}
          </div>

          {filteredWords.length === 0 ? (
            <div className="sheet px-6 py-16 text-center rise" style={{ "--i": 2 }}>
              <Books size={34} className="mx-auto text-pen" />
              <h2 className="mt-4 font-serif text-[24px] font-medium">No words match</h2>
              <p className="mt-1 text-[15px] text-ink-2">
                Save words from your reading, your drafts or a book session, and they will appear here.
              </p>
              <button onClick={() => openCaptureModal()} className="btn btn-quiet mt-6">
                Save a word
              </button>
            </div>
          ) : viewMode === "entries" ? (
            <div className="sheet px-2 sm:px-4 py-3 rise" style={{ "--i": 2 }}>
              <ul className="grid md:grid-cols-2 gap-x-4">
                {filteredWords.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setInspectingWord(item)}
                      className="w-full text-left rounded-lg px-4 sm:px-5 py-5 hover:bg-paper transition-colors group h-full"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-baseline gap-2.5 min-w-0">
                          <span className="font-serif text-[26px] leading-tight font-medium tracking-[-0.01em] truncate">
                            {item.word}
                          </span>
                          <span className="font-serif italic text-[15px] text-ink-3">{item.pos?.toLowerCase()}</span>
                        </div>
                        <StatusTag status={item.status} />
                      </div>
                      <p className="mt-2 font-serif text-[16.5px] leading-[1.5] text-ink line-clamp-2">{item.correctDef}</p>
                      {item.personalDef && (
                        <p className="mt-2 text-[14px] text-ink-2 line-clamp-1">
                          <span className="text-ink-3">Mine: </span>
                          {item.personalDef}
                        </p>
                      )}
                      <div className="mt-3 flex items-center justify-between text-[13px] text-ink-3">
                        <span className="tabular">
                          Used {item.timesUsed} {item.timesUsed === 1 ? "time" : "times"} · {item.confidence} confidence
                        </span>
                        <ArrowRight
                          size={15}
                          className="transition-transform group-hover:translate-x-0.5 group-hover:text-ink"
                          aria-hidden="true"
                        />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="sheet overflow-x-auto rise" style={{ "--i": 2 }}>
              <table className="w-full text-left text-[14px] min-w-[720px]">
                <thead>
                  <tr className="text-[13px] text-ink-3">
                    <th className="font-normal py-4 px-6">Word</th>
                    <th className="font-normal py-4 px-4">Part of speech</th>
                    <th className="font-normal py-4 px-4">Meaning</th>
                    <th className="font-normal py-4 px-4">Status</th>
                    <th className="font-normal py-4 px-4 text-right">Used</th>
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
                      className="border-t border-tint hover:bg-paper transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-6 font-serif text-[18px]">{item.word}</td>
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
