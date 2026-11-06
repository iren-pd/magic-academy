import { exams } from "@/data/exams";
import { SCHEMA_VERSION, type GameState, type ScreenId, type WordSets } from "@/types/game";

export const STORAGE_KEY = "magic-academy.progress";

const knownExamIds = new Set<string>(exams.map((exam) => exam.id));

export function createInitialState(now = Date.now()): GameState {
  return {
    schemaVersion: SCHEMA_VERSION,
    screen: "welcome",
    currentExamIndex: 0,
    completedExamIds: [],
    examStartedAt: {},
    wordSets: null,
    specialCompleted: false,
    graduated: false,
    timerBypass: false,
    updatedAt: now,
  };
}

function isScreen(value: unknown): value is ScreenId {
  return value === "welcome" || value === "exam" || value === "special" || value === "graduation";
}

function sanitizeWordSets(value: unknown): WordSets | null {
  if (!value || typeof value !== "object") return null;
  const students = (value as { students?: unknown }).students;
  if (!Array.isArray(students) || students.length !== 3) return null;
  const sets = students.map((set) => {
    if (!Array.isArray(set) || set.length !== 5) return null;
    if (!set.every((word) => typeof word === "string" && word.trim().length > 0)) return null;
    return set;
  });
  if (sets.some((set) => set === null)) return null;
  return { students: [sets[0]!, sets[1]!, sets[2]!] };
}

export function sanitizeState(value: unknown): GameState {
  const initial = createInitialState();
  if (!value || typeof value !== "object") return initial;
  const data = value as Partial<GameState>;
  if (data.schemaVersion !== SCHEMA_VERSION) return initial;

  const completedExamIds = Array.isArray(data.completedExamIds)
    ? data.completedExamIds.filter((id): id is string => typeof id === "string" && knownExamIds.has(id))
    : [];

  const examStartedAt: Record<string, number> = {};
  if (data.examStartedAt && typeof data.examStartedAt === "object") {
    for (const [id, stamp] of Object.entries(data.examStartedAt)) {
      if (knownExamIds.has(id) && typeof stamp === "number" && Number.isFinite(stamp) && stamp > 0) {
        examStartedAt[id] = stamp;
      }
    }
  }

  const currentExamIndex =
    typeof data.currentExamIndex === "number" && data.currentExamIndex >= 0 && data.currentExamIndex < exams.length
      ? Math.floor(data.currentExamIndex)
      : 0;

  return {
    schemaVersion: SCHEMA_VERSION,
    screen: isScreen(data.screen) ? data.screen : "welcome",
    currentExamIndex,
    completedExamIds,
    examStartedAt,
    wordSets: sanitizeWordSets(data.wordSets),
    specialCompleted: data.specialCompleted === true,
    graduated: data.graduated === true,
    timerBypass: data.timerBypass === true,
    updatedAt: typeof data.updatedAt === "number" ? data.updatedAt : Date.now(),
  };
}

function readRaw(): unknown {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

let state = sanitizeState(readRaw());
const listeners = new Set<() => void>();

function persist(next: GameState) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // The session keeps the in-memory state if the browser refuses the write.
  }
}

export function getGameState(): GameState {
  return state;
}

export function subscribeGameState(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function replaceGameState(next: GameState): void {
  state = next;
  persist(state);
  listeners.forEach((listener) => listener());
}

export function updateGameState(recipe: (current: GameState) => GameState): void {
  const next = recipe(state);
  if (next === state) return;
  replaceGameState({ ...next, updatedAt: Date.now() });
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    try {
      state = sanitizeState(event.newValue ? (JSON.parse(event.newValue) as unknown) : null);
    } catch {
      state = createInitialState();
    }
    listeners.forEach((listener) => listener());
  });
}
