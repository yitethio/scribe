import React from "react";

// A drawn cloth cover: navy boards, gold lettering, a shadow where the spine folds.
export const BookCover = ({ title, size = "md" }) => {
  const short = title.split(":")[0];
  const dims = size === "lg" ? "w-[120px] h-[172px] text-[17px]" : "w-[82px] h-[120px] text-[12.5px]";
  return (
    <div
      aria-hidden="true"
      className={`${dims} shrink-0 rounded-[3px_6px_6px_3px] bg-[#1f2b45] text-[#d8c9a0] font-serif uppercase tracking-[0.04em] leading-[1.05] flex flex-col items-center justify-center text-center px-2 gap-1.5 shadow-[inset_6px_0_0_-2px_rgb(0_0_0/0.35),0_6px_16px_-8px_rgb(27_26_23/0.5)]`}
    >
      <span className="w-[60%] h-px bg-[#d8c9a0]/50" />
      <span className="max-w-[7ch]">{short}</span>
      <span className="w-[60%] h-px bg-[#d8c9a0]/50" />
    </div>
  );
};
