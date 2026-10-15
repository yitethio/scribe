import React, { useEffect } from "react";

// A modal surface: centred on desktop, rising from the bottom on phones,
// or sliding in from the right as a drawer.
export const Dialog = ({ onClose, labelledBy, variant = "center", width = "sm:max-w-lg", children }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  const floating = "shadow-[0_24px_64px_-24px_rgb(22_24_28/0.5)]";

  return (
    <div
      className={`fixed inset-0 z-50 flex ${
        variant === "drawer" ? "justify-end" : "items-end sm:items-center justify-center sm:p-4"
      }`}
    >
      <button className="fade absolute inset-0 bg-ink/40 cursor-default" aria-label="Close" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={
          variant === "drawer"
            ? `slide-in relative w-full max-w-md h-full bg-sheet flex flex-col ${floating}`
            : `pop relative bg-sheet w-full ${width} rounded-t-[14px] sm:rounded-[12px] max-h-[92dvh] flex flex-col ${floating}`
        }
      >
        {children}
      </div>
    </div>
  );
};
