import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { VocabCaptureModal } from "../vocabulary/VocabCaptureModal";

export const AppLayout = ({ children, title, subtitle, hideTopHeader = false }) => {
  const [captureModalOpen, setCaptureModalOpen] = useState(false);
  const [captureInitialWord, setCaptureInitialWord] = useState("");
  const [captureInitialContext, setCaptureInitialContext] = useState("");

  const handleOpenCapture = (word = "", context = "") => {
    setCaptureInitialWord(word);
    setCaptureInitialContext(context);
    setCaptureModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-[#FAF8F5] text-[#1A1A1E]">
      {/* Sidebar */}
      <Sidebar onOpenCaptureModal={() => handleOpenCapture()} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {!hideTopHeader && (
          <TopHeader
            title={title}
            subtitle={subtitle}
            onOpenCaptureModal={() => handleOpenCapture()}
          />
        )}

        <main className="flex-1">
          {typeof children === "function" ? children({ openCaptureModal: handleOpenCapture }) : children}
        </main>
      </div>

      {/* Global Vocabulary Capture Modal */}
      <VocabCaptureModal
        isOpen={captureModalOpen}
        onClose={() => setCaptureModalOpen(false)}
        initialWord={captureInitialWord}
        initialContext={captureInitialContext}
      />
    </div>
  );
};
