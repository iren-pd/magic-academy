import type { ReactNode } from "react";
import { SceneBackdrop } from "@/components/layout/SceneBackdrop";
import { exams, resolveExamBackground } from "@/data/exams";
import { useGameProgress } from "@/hooks/useGameProgress";

export function AcademyLayout({ children }: { children: ReactNode }) {
  const { state } = useGameProgress();
  const scene =
    state.screen === "welcome" ? "welcome" : state.screen === "graduation" ? "graduation" : state.screen === "exam" ? "exam" : "classroom";
  const exam = state.screen === "exam" ? exams[state.currentExamIndex] : undefined;

  return (
    <SceneBackdrop scene={scene} examBackgroundUrl={exam ? resolveExamBackground(exam) : undefined}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-gold-bright focus:px-4 focus:py-2 focus:text-ink"
      >
        К содержанию
      </a>
      {children}
    </SceneBackdrop>
  );
}
