import { ExamPage } from "@/components/exams/ExamPage";
import { AcademyLayout } from "@/components/layout/AcademyLayout";
import { SceneTransition } from "@/components/layout/SceneTransition";
import { OrganizerPanel } from "@/components/organizer/OrganizerPanel";
import { GraduationPage } from "@/pages/GraduationPage";
import { SpecialActivityPage } from "@/pages/SpecialActivityPage";
import { WelcomePage } from "@/pages/WelcomePage";
import { useGameProgress } from "@/hooks/useGameProgress";
import { TooltipProvider } from "@/components/ui/tooltip";

function AcademyApp() {
  const { state } = useGameProgress();
  const sceneKey = state.screen === "exam" ? `exam-${state.currentExamIndex}` : state.screen;

  return (
    <AcademyLayout>
      <SceneTransition sceneKey={sceneKey} exam={state.screen === "exam"} welcome={state.screen === "welcome"}>
        {state.screen === "welcome" ? <WelcomePage /> : null}
        {state.screen === "exam" ? <ExamPage /> : null}
        {state.screen === "special" ? <SpecialActivityPage /> : null}
        {state.screen === "graduation" ? <GraduationPage /> : null}
      </SceneTransition>
    </AcademyLayout>
  );
}

export default function App() {
  return (
    <TooltipProvider>
      <AcademyApp />
      <OrganizerPanel />
    </TooltipProvider>
  );
}
