import React, { useState, useEffect } from "react";
import { ScribeContext } from "./context";
import { initialScribeData } from "./initialData";

const STORAGE_KEY = "scribe_mastery_lab_state_v1";

export const ScribeProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure critical structures exist in case old state is stored
        return {
          ...initialScribeData,
          ...parsed,
          user: { ...initialScribeData.user, ...(parsed.user || {}) },
          bookSession: { ...initialScribeData.bookSession, ...(parsed.bookSession || {}) },
          writingWorkspace: { ...initialScribeData.writingWorkspace, ...(parsed.writingWorkspace || {}) }
        };
      }
    } catch (e) {
      console.warn("Failed to load state from localStorage:", e);
    }
    return initialScribeData;
  });

  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to persist state to localStorage:", e);
    }
  }, [state]);

  const showToast = (message, type = "info") => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  // Vocabulary Actions
  const addVocabularyWord = ({ word, personalDef, pos = "Noun", correctDef, example, collocations = [], contextSentence = "", synonyms = [] }) => {
    if (!word) return;
    const cleanWord = word.trim().toLowerCase();
    
    // Check if word already exists
    const existingIndex = state.vocabulary.findIndex(v => v.word.toLowerCase() === cleanWord);
    
    const newWordItem = {
      id: `v-${Date.now()}`,
      word: cleanWord,
      pos: pos || "Noun",
      personalDef: personalDef || "My working understanding.",
      correctDef: correctDef || `To understand and use "${cleanWord}" with deliberate precision in prose.`,
      example: example || `The author placed "${cleanWord}" at the heart of the passage to evoke subtle texture.`,
      collocations: collocations.length ? collocations : [`natural ${cleanWord}`, `${cleanWord} in context`],
      synonyms: synonyms.length ? synonyms : [],
      status: "learning",
      confidence: "medium",
      lastReviewed: "Just now",
      timesUsed: 1,
      timesUsedCorrectly: 1,
      dateLearned: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      contextSentence: contextSentence || `Found in writing: "...${cleanWord}..."`
    };

    setState(prev => {
      let updatedVocab;
      if (existingIndex >= 0) {
        updatedVocab = [...prev.vocabulary];
        updatedVocab[existingIndex] = {
          ...updatedVocab[existingIndex],
          personalDef: personalDef || updatedVocab[existingIndex].personalDef,
          timesUsed: updatedVocab[existingIndex].timesUsed + 1,
          lastReviewed: "Just now",
          contextSentence: contextSentence || updatedVocab[existingIndex].contextSentence
        };
      } else {
        updatedVocab = [newWordItem, ...prev.vocabulary];
      }

      return {
        ...prev,
        vocabulary: updatedVocab,
        user: {
          ...prev.user,
          vocabularyLearnedCount: updatedVocab.length
        }
      };
    });

    showToast(`Added "${cleanWord}" to your Vocabulary Library`, "success");
    return newWordItem;
  };

  const updateVocabularyWord = (id, updates) => {
    setState(prev => ({
      ...prev,
      vocabulary: prev.vocabulary.map(v => (v.id === id ? { ...v, ...updates } : v))
    }));
    showToast("Vocabulary entry updated", "info");
  };

  // Book Session Actions
  const updateBookSession = (updates) => {
    setState(prev => ({
      ...prev,
      bookSession: {
        ...prev.bookSession,
        ...updates
      }
    }));
  };

  const addBookSessionWord = (word, contextSentence = "") => {
    if (!word) return;
    const cleanWord = word.trim().toLowerCase();

    setState(prev => {
      const currentList = prev.bookSession.sessionVocabulary || [];
      if (!currentList.includes(cleanWord)) {
        return {
          ...prev,
          bookSession: {
            ...prev.bookSession,
            sessionVocabulary: [...currentList, cleanWord]
          }
        };
      }
      return prev;
    });

    // Also register into global vocabulary dictionary if not present
    const exists = state.vocabulary.find(v => v.word.toLowerCase() === cleanWord);
    if (!exists) {
      addVocabularyWord({
        word: cleanWord,
        personalDef: "",
        pos: "Noun",
        contextSentence: contextSentence || `Encountered during book rewriting.`
      });
    } else {
      showToast(`Added "${cleanWord}" to Book Session Vocabulary`, "info");
    }
  };

  // Writing Workspace Actions
  const updateWritingDraft = (text) => {
    setState(prev => ({
      ...prev,
      writingWorkspace: {
        ...prev.writingWorkspace,
        text
      }
    }));
  };

  const updateCoachSettings = (settings) => {
    setState(prev => ({
      ...prev,
      writingWorkspace: {
        ...prev.writingWorkspace,
        ...settings
      }
    }));
  };

  const resolveCoachIssue = (issueId) => {
    setState(prev => ({
      ...prev,
      writingWorkspace: {
        ...prev.writingWorkspace,
        issues: prev.writingWorkspace.issues.map(iss => iss.id === issueId ? { ...iss, resolved: true } : iss)
      }
    }));
    showToast("Sentence revision verified!", "success");
  };

  // Challenge Actions
  const submitChallenge = (passage) => {
    setState(prev => ({
      ...prev,
      challenges: {
        ...prev.challenges,
        passage,
        submitted: true
      },
      user: {
        ...prev.user,
        wordsWrittenThisMonth: prev.user.wordsWrittenThisMonth + (passage.split(/\s+/).filter(Boolean).length || 0),
        sessionsCompletedCount: prev.user.sessionsCompletedCount + 1
      }
    }));
    showToast("Challenge submitted & analyzed by AI Writing Coach!", "success");
  };

  // Revision Lab Actions
  const submitRevisionAnswer = (revisionId, userText, isCorrect) => {
    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        wordsWrittenThisMonth: prev.user.wordsWrittenThisMonth + 15
      }
    }));
    if (isCorrect) {
      showToast("Correct revision! Rule mastered.", "success");
    }
  };

  // Reset to default sample
  const resetToDefaults = () => {
    setState(initialScribeData);
    localStorage.removeItem(STORAGE_KEY);
    showToast("Reset to pristine sample data", "info");
  };

  return (
    <ScribeContext.Provider
      value={{
        state,
        addVocabularyWord,
        updateVocabularyWord,
        updateBookSession,
        addBookSessionWord,
        updateWritingDraft,
        updateCoachSettings,
        resolveCoachIssue,
        submitChallenge,
        submitRevisionAnswer,
        resetToDefaults,
        showToast
      }}
    >
      {children}

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 left-5 sm:left-auto z-[100] pop" role="status" aria-live="polite">
          <div className="flex items-center gap-3 pl-4 pr-2 py-2 bg-ink text-paper rounded-lg text-[14px] shadow-[0_12px_32px_-12px_rgb(22_24_28/0.45)]">
            <span className={`w-2 h-2 rounded-full shrink-0 ${toast.type === "success" ? "bg-[#7fc49b]" : "bg-[#e3b35c]"}`} />
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              aria-label="Dismiss"
              className="w-8 h-8 rounded-md text-paper/60 hover:text-paper hover:bg-white/10 transition-colors"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </ScribeContext.Provider>
  );
};

export { useScribe } from "./useScribe";
