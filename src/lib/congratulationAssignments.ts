import { congratulationWords, type CongratulationWord } from "@/data/congratulationWords";

export const CONGRATULATION_STORAGE_KEY = "magic-academy-congratulation-words-v1";

export type CongratulationSet = readonly [
  CongratulationWord,
  CongratulationWord,
  CongratulationWord,
  CongratulationWord,
  CongratulationWord,
];

export type CongratulationSlots = [CongratulationSet | null, CongratulationSet | null, CongratulationSet | null];

const pool = new Set<string>(congratulationWords);
const listeners = new Set<(slots: CongratulationSlots) => void>();

function emptySlots(): CongratulationSlots {
  return [null, null, null];
}

function isWord(value: unknown): value is CongratulationWord {
  return typeof value === "string" && pool.has(value);
}

function asSet(value: unknown, seen: Set<string>): CongratulationSet | null {
  if (!Array.isArray(value) || value.length !== 5) return null;
  if (!value.every(isWord)) return null;
  if (new Set(value).size !== 5) return null;
  if (value.some((word) => seen.has(word))) return null;
  for (const word of value) seen.add(word);
  return value as unknown as CongratulationSet;
}

function sanitize(value: unknown): CongratulationSlots {
  if (!value || typeof value !== "object") return emptySlots();
  const slots = (value as { slots?: unknown }).slots;
  if (!Array.isArray(slots)) return emptySlots();
  const seen = new Set<string>();
  return [asSet(slots[0], seen), asSet(slots[1], seen), asSet(slots[2], seen)];
}

function readRaw(): CongratulationSlots {
  if (typeof localStorage === "undefined") return emptySlots();
  try {
    const raw = localStorage.getItem(CONGRATULATION_STORAGE_KEY);
    if (!raw) return emptySlots();
    return sanitize(JSON.parse(raw));
  } catch {
    return emptySlots();
  }
}

function writeSlots(slots: CongratulationSlots): void {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(CONGRATULATION_STORAGE_KEY, JSON.stringify({ slots }));
  }
  for (const listener of listeners) listener(slots);
}

export function shuffleWords<T>(items: readonly T[], random = Math.random): T[] {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    const current = next[index]!;
    next[index] = next[swap]!;
    next[swap] = current;
  }
  return next;
}

export function readCongratulationSlots(): CongratulationSlots {
  return readRaw();
}

export function subscribeCongratulation(listener: (slots: CongratulationSlots) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function assignCongratulationWords(index: number, random = Math.random): CongratulationSet | null {
  const slots = readRaw();
  const existing = slots[index];
  if (existing) return existing;
  const used = new Set(slots.flatMap((slot) => slot ?? []));
  const available = congratulationWords.filter((word) => !used.has(word));
  if (available.length < 5) return null;
  const picked = shuffleWords(available, random).slice(0, 5);
  const next = [...slots] as CongratulationSlots;
  next[index] = picked as unknown as CongratulationSet;
  writeSlots(next);
  return next[index];
}

export function resetCongratulationWords(): void {
  writeSlots(emptySlots());
}
