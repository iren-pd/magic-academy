export const SCHEMA_VERSION = 1;

export type ScreenId = "welcome" | "exam" | "special" | "graduation";

export type CharacterId =
  | "director"
  | "professor-accuracy"
  | "professor-wrapping"
  | "professor-alchemy"
  | "professor-literature"
  | "professor-cartography"
  | "professor-physiognomy"
  | "professor-intuition"
  | "professor-elements";

export type ProfessorId = Exclude<CharacterId, "director">;

export type GlassesStyle = "half-moon" | "round" | "monocle" | "goggles" | "crooked" | "none";

export type PropStyle = "wand" | "orb" | "ribbon" | "flask" | "quill" | "map" | "masks" | "pendulum" | "flame";

export type HairStyle = "balding" | "swept" | "wild" | "bun" | "streak";

export type BeardStyle = "full" | "short" | "none";

export interface PortraitSpec {
  robe: string;
  robeShadow: string;
  lining: string;
  skin: string;
  beard: string;
  hair: string;
  hairStyle: HairStyle;
  beardStyle: BeardStyle;
  glasses: GlassesStyle;
  prop: PropStyle;
  furCollar: boolean;
  embroidery: boolean;
  glow: string;
  browLift: number;
  pupilShift: number;
  smile: number;
  narrowed: boolean;
}

export interface CharacterProfile {
  id: CharacterId;
  name: string;
  title: string;
  speech: string;
  portrait: PortraitSpec;
}

export interface ColorDigits {
  red: string;
  blue: string;
  yellow: string;
  green: string;
}

export type ExamValidation =
  | { type: "NUMERIC_CODE"; code: string }
  | { type: "COLOR_DIGITS"; digits: ColorDigits }
  | { type: "SECRET_WORD"; answers: readonly string[] }
  | { type: "SECRET_PHRASE"; answers: readonly string[] }
  | {
      type: "THREE_TEXT_ANSWERS";
      answers: readonly [string, string, string];
      labels: readonly [string, string, string];
      orderMatters: boolean;
    }
  | { type: "TIMED_COMPLETION"; durationMs: number };

export interface ExamDefinition {
  id: string;
  number: number;
  department: string;
  professorId: ProfessorId;
  instructions: readonly string[];
  validation: ExamValidation;
  /** Public-folder path, without the Vite base, for example `assets/backgrounds/academy-accuracy.png`. */
  backgroundImage?: string;
  safetyNote?: string;
}

export interface WordSets {
  students: readonly [readonly string[], readonly string[], readonly string[]];
}

export interface GameState {
  schemaVersion: number;
  screen: ScreenId;
  currentExamIndex: number;
  completedExamIds: string[];
  examStartedAt: Record<string, number>;
  wordSets: WordSets | null;
  specialCompleted: boolean;
  graduated: boolean;
  timerBypass: boolean;
  updatedAt: number;
}

export interface SpecialActivity {
  id: string;
  title: string;
  announcement: string;
  steps: readonly string[];
  riddle: string;
  privateNote: string;
  code: string;
}
