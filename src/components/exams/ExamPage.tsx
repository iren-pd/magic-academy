import { useEffect, useRef, useState } from "react";
import { ProfessorScene } from "@/components/characters/ProfessorScene";
import { AbsurdWordsGenerator, useCongratulationSlots } from "@/components/exams/AbsurdWordsGenerator";
import { AlchemyIngredientGenerator, useAlchemySlots } from "@/components/exams/AlchemyIngredientGenerator";
import { ExamInstructions } from "@/components/exams/ExamInstructions";
import { ExamSubmissionDialog } from "@/components/exams/ExamSubmissionDialog";
import { ExamTimer } from "@/components/exams/ExamTimer";
import { ExamFloatingHeader } from "@/components/exams/ExamFloatingHeader";
import { getCharacter } from "@/data/characters";
import { exams, getExam } from "@/data/exams";
import { useGameProgress } from "@/hooks/useGameProgress";
import { useExamTimer } from "@/hooks/useExamTimer";
import { formatExamCounter } from "@/lib/format";
import { animateEntrance } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function nextLabel(examNumber: number): string {
  if (examNumber < 7) return "Следующая кафедра";
  if (examNumber === 7) return "К поиску допуска";
  return "На выпускную церемонию";
}

export function ExamPage() {
  const { state, advanceAfterExam } = useGameProgress();
  const exam = getExam(state.currentExamIndex);
  if (!exam) return null;
  return <ExamExperience key={exam.id} examId={exam.id} onAdvance={() => advanceAfterExam(exam.number - 1)} />;
}

function ExamExperience({ examId, onAdvance }: { examId: string; onAdvance: () => void }) {
  const { state } = useGameProgress();
  const exam = exams.find((item) => item.id === examId);
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const alchemySlots = useAlchemySlots();
  const congratulationSlots = useCongratulationSlots();
  const physiognomyTimer = useExamTimer("physiognomy", 3 * 60 * 1000, exam?.id === "physiognomy", true);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;
    const context = animateEntrance(element);
    return () => context.revert();
  }, [examId]);

  if (!exam) return null;
  const professor = getCharacter(exam.professorId);
  const passed = state.completedExamIds.includes(exam.id);
  const timed = exam.validation.type === "TIMED_COMPLETION" ? exam.validation : null;
  const alchemyReady = exam.id !== "alchemy" || alchemySlots.every((id) => id !== null);
  const wordsReady = exam.id !== "literature" || congratulationSlots.every((slot) => slot !== null);
  const faceLocked = exam.id === "physiognomy" && !physiognomyTimer.ready;
  const canSubmit = alchemyReady && wordsReady && !faceLocked;

  return (
    <div ref={rootRef} className="relative min-h-svh">
      <ExamFloatingHeader examId={exam.id} kicker={formatExamCounter(exam.number, exams.length)} />
      <main
        id="main"
        className={cn(
          "exam-scene relative grid min-h-svh w-full content-start grid-cols-1 items-start gap-4 overflow-clip py-6 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:items-center lg:gap-[clamp(24px,3vw,56px)] lg:py-8 lg:[align-content:safe_center]",
        )}
      >
        <div aria-hidden="true" className="hidden lg:block" />
        <ProfessorScene professorId={exam.professorId} />
        <section
          className={cn(
            "exam-panel flex h-auto max-h-none w-full min-w-0 flex-col overflow-visible rounded-[1.75rem] border border-[#D7AD62] bg-[rgba(255,248,236,0.96)] text-[#493B35] shadow-[0_18px_40px_rgba(73,59,53,0.14)] lg:w-[min(100%,720px)] lg:justify-self-end",
            exam.id === "alchemy"
              ? "exam-panel-alchemy"
              : exam.id === "literature"
                ? "exam-panel-literature"
                : "gap-3 px-6 py-6 lg:gap-4 lg:p-7",
          )}
        >
          <div data-enter="right" className="exam-copy shrink-0">
            <h1 className="font-display text-[clamp(2rem,2.5vw,2.5rem)] leading-[0.98] text-[#7D263C]">{exam.department}</h1>
            <p className="mt-2 text-[clamp(0.94rem,1.05vw,1.06rem)] leading-snug text-[#31745A]">
              {professor.name}, {professor.title}
            </p>
            <blockquote className="mt-2 font-display text-[clamp(1.06rem,1.25vw,1.2rem)] leading-relaxed text-[#3A241C]">
              «{professor.speech}»
            </blockquote>
          </div>
          <div data-enter="fade" className="min-h-0 shrink-0">
            <ExamInstructions exam={exam} />
          </div>
          {timed ? (
            <div data-enter="fade" className="shrink-0">
              <ExamTimer
                examId={exam.id}
                durationMs={timed.durationMs}
                enabled={!passed}
                ignoreWalkthrough={exam.id === "physiognomy"}
              />
            </div>
          ) : null}
          {exam.id === "alchemy" ? (
            <div data-enter="fade" className="shrink-0">
              <AlchemyIngredientGenerator />
            </div>
          ) : null}
          {exam.id === "literature" ? (
            <div data-enter="fade" className="min-h-0 shrink-0">
              <AbsurdWordsGenerator />
            </div>
          ) : null}
          {exam.safetyNote ? (
            <p data-enter="fade" className="shrink-0 rounded-2xl border border-[#B52E43]/25 bg-white/70 px-4 py-3 text-sm leading-relaxed text-[#7D263C]">
              {exam.safetyNote}
            </p>
          ) : null}
          <div data-enter="up" className="exam-submit flex shrink-0 flex-col gap-3 border-t border-[#D7AD62]/55 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="min-w-0 text-[15px] leading-snug text-[#493B35]">
              {passed
                ? "Зачёт уже в ведомости."
                : exam.id === "alchemy" && !alchemyReady
                  ? "Сначала призовите ингредиент каждому студенту."
                  : exam.id === "literature" && !wordsReady
                    ? "Сначала получите слова каждому студенту."
                    : faceLocked
                      ? "Сдать экзамен можно, когда пройдут три минуты."
                      : "Когда задание выполнено, сдайте экзамен."}
            </p>
            {passed ? (
              <Button
                type="button"
                variant="gold"
                size="academy"
                className="w-full sm:w-auto"
                disabled={leaving}
                onClick={() => {
                  if (leaving) return;
                  setLeaving(true);
                  onAdvance();
                }}
              >
                {nextLabel(exam.number)}
              </Button>
            ) : (
              <Button
                type="button"
                variant="gold"
                size="academy"
                className="w-full sm:w-auto"
                disabled={!canSubmit}
                onClick={() => setOpen(true)}
              >
                Сдать экзамен
              </Button>
            )}
          </div>
        </section>
      </main>
      <ExamSubmissionDialog exam={exam} open={open} onOpenChange={setOpen} />
    </div>
  );
}
