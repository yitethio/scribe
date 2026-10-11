import { useContext } from "react";
import { ScribeContext } from "./context";

export const useScribe = () => {
  const context = useContext(ScribeContext);
  if (!context) {
    throw new Error("useScribe must be used within a ScribeProvider");
  }
  return context;
};
