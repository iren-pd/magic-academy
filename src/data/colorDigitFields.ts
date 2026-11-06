import type { ColorDigits } from "@/types/game";

export const colorDigitFields = [
  { key: "red", label: "Красный", border: "#DC3545", ink: "#DC3545", wash: "#FFF6F6", accent: "#DC3545" },
  { key: "blue", label: "Синий", border: "#2563EB", ink: "#2563EB", wash: "#F5F8FF", accent: "#2563EB" },
  { key: "yellow", label: "Жёлтый", border: "#A16207", ink: "#854D0E", wash: "#FFFBEB", accent: "#FACC15" },
  { key: "green", label: "Зелёный", border: "#16A34A", ink: "#15803D", wash: "#F3FBF6", accent: "#16A34A" },
] as const satisfies readonly {
  key: keyof ColorDigits;
  label: string;
  border: string;
  ink: string;
  wash: string;
  accent: string;
}[];
