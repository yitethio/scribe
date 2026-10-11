import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ScribeProvider } from "./store";
import Dashboard from "./pages/Dashboard";
import Write from "./pages/Write";
import VocabularyLibrary from "./pages/VocabularyLibrary";
import Challenges from "./pages/Challenges";
import Progress from "./pages/Progress";
import WritingProfile from "./pages/WritingProfile";
import BookSession from "./pages/BookSession";
import RevisionMode from "./pages/RevisionMode";

function App() {
  return (
    <ScribeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/write" element={<Write />} />
          <Route path="/book-session" element={<BookSession />} />
          <Route path="/vocabulary" element={<VocabularyLibrary />} />
          <Route path="/vocabulary-library" element={<VocabularyLibrary />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/revision-mode" element={<RevisionMode />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/profile" element={<WritingProfile />} />
          {/* Fallback to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ScribeProvider>
  );
}

export default App;
