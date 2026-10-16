import React from "react";

const toneFor = (status) => {
  if (/active|progress/i.test(status)) return { tone: "tag-pen", label: "In progress" };
  if (/passed|mastered/i.test(status)) return { tone: "tag-good", label: status };
  if (/review/i.test(status)) return { tone: "tag-info", label: status };
  return { tone: "", label: status };
};

// A pill with a dot, coloured by what the status means.
export const StatusTag = ({ status, className = "" }) => {
  const { tone, label } = toneFor(status);
  return <span className={`tag tag-dot ${tone} ${className}`}>{label}</span>;
};
