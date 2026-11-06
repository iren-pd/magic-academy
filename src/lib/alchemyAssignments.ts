import { alchemyIngredients } from "@/data/alchemyIngredients";

export const ALCHEMY_STORAGE_KEY = "magic-academy-alchemy-ingredients-v1";

export type AlchemySlots = [string | null, string | null, string | null];

const knownIds = new Set(alchemyIngredients.map((item) => item.id));
const listeners = new Set<(slots: AlchemySlots) => void>();

function emptySlots(): AlchemySlots {
  return [null, null, null];
}

function sanitize(value: unknown): AlchemySlots {
  if (!value || typeof value !== "object") return emptySlots();
  const slots = (value as { slots?: unknown }).slots;
  if (!Array.isArray(slots)) return emptySlots();
  const seen = new Set<string>();
  const next = emptySlots();
  for (let index = 0; index < 3; index += 1) {
    const id = slots[index];
    if (typeof id !== "string" || !knownIds.has(id) || seen.has(id)) continue;
    seen.add(id);
    next[index] = id;
  }
  return next;
}

function readRaw(): AlchemySlots {
  if (typeof localStorage === "undefined") return emptySlots();
  try {
    const raw = localStorage.getItem(ALCHEMY_STORAGE_KEY);
    if (!raw) return emptySlots();
    return sanitize(JSON.parse(raw));
  } catch {
    return emptySlots();
  }
}

function writeSlots(slots: AlchemySlots): void {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(ALCHEMY_STORAGE_KEY, JSON.stringify({ slots }));
  }
  for (const listener of listeners) listener(slots);
}

export function readAlchemySlots(): AlchemySlots {
  const slots = readRaw();
  return slots;
}

export function subscribeAlchemy(listener: (slots: AlchemySlots) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function chooseAlchemyIngredient(slots: AlchemySlots, index: number, random = Math.random): string | null {
  if (slots[index]) return slots[index];
  const taken = new Set(slots.filter((id): id is string => id !== null));
  const available = alchemyIngredients.filter((item) => !taken.has(item.id));
  if (available.length === 0) return null;
  const pick = available[Math.floor(random() * available.length)];
  return pick?.id ?? null;
}

export function assignAlchemyIngredient(index: number): string | null {
  const slots = readRaw();
  const id = chooseAlchemyIngredient(slots, index);
  if (!id || slots[index] === id) return slots[index];
  const next = [...slots] as AlchemySlots;
  next[index] = id;
  writeSlots(next);
  return id;
}

export function resetAlchemyAssignments(): void {
  writeSlots(emptySlots());
}
