import { useEffect, useRef, useState } from "react";
import { alchemyStudentLabels, findAlchemyIngredient } from "@/data/alchemyIngredients";
import { colorDigitFields } from "@/data/colorDigitFields";
import { congratulationStudentLabels } from "@/data/congratulationWords";
import { resetAlchemyAssignments } from "@/lib/alchemyAssignments";
import { resetCongratulationWords } from "@/lib/congratulationAssignments";
import { useAlchemySlots } from "@/components/exams/AlchemyIngredientGenerator";
import { useCongratulationSlots } from "@/components/exams/AbsurdWordsGenerator";
import { exams } from "@/data/exams";
import { specialActivity } from "@/data/specialActivity";
import { useGameProgress } from "@/hooks/useGameProgress";
import { describeAllAnswers, describeValidation } from "@/lib/answerValidation";
import { WALKTHROUGH } from "@/lib/walkthrough";
import { formatCountdown } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type PendingReset = "exam" | "all" | null;

const screenLabels = {
  welcome: "Приветствие",
  exam: "Экзамен",
  special: "Поиск допуска",
  graduation: "Выпуск",
} as const;

export function OrganizerPanel() {
  const progress = useGameProgress();
  const { state } = progress;
  const alchemySlots = useAlchemySlots();
  const congratulationSlots = useCongratulationSlots();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<PendingReset>(null);
  const [copyNote, setCopyNote] = useState<string | null>(null);
  const pendingRef = useRef(pending);
  pendingRef.current = pending;
  const closeRef = useRef<HTMLButtonElement>(null);
  const currentExam = state.screen === "exam" ? exams[state.currentExamIndex] : undefined;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "d") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape" && !pendingRef.current) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  async function copyAnswers() {
    try {
      await navigator.clipboard.writeText(describeAllAnswers());
      setCopyNote("Ответы скопированы.");
    } catch {
      setCopyNote("Не удалось скопировать. Ответы можно прочитать ниже.");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end p-3 sm:p-4" role="presentation">
      <button type="button" className="absolute inset-0 bg-black/35" aria-label="Закрыть панель организатора" onClick={() => setOpen(false)} />
      <aside
        role="dialog"
        aria-modal="false"
        aria-labelledby="organizer-title"
        className="glass-panel relative z-10 flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-3xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-gold/20 px-5 py-4">
          <div>
            <p className="text-xs tracking-[0.16em] text-festive uppercase">Только для подготовки</p>
            <h2 id="organizer-title" className="font-display text-3xl text-ink">
              Панель организатора
            </h2>
          </div>
          <Button ref={closeRef} type="button" variant="outline" className="border-gold/40 text-ink" onClick={() => setOpen(false)}>
            Закрыть
          </Button>
        </div>
        <div className="space-y-5 overflow-y-auto px-5 py-4">
          {WALKTHROUGH ? (
            <p className="rounded-2xl border border-festive/30 bg-festive/8 px-3 py-2 text-sm text-burgundy">
              Просмотр включён: любая сдача пропускает дальше, таймер не ждёт. Перед вечеринкой поставьте WALKTHROUGH в false.
            </p>
          ) : null}
          {state.timerBypass ? (
            <p className="rounded-2xl border border-gold/50 bg-gold/15 px-3 py-2 text-sm text-burgundy">
              Таймеры выключены для проверки.
            </p>
          ) : null}
          <section className="space-y-1 text-sm text-ink/80">
            <p>Экран: {screenLabels[state.screen]}</p>
            <p>Текущая кафедра: {currentExam ? currentExam.department : "нет"}</p>
            <p>Сдано: {state.completedExamIds.length} из {exams.length}</p>
            <p>Допуск: {state.specialCompleted ? "найден" : "ещё нет"}</p>
            {currentExam && currentExam.validation.type === "TIMED_COMPLETION" && state.examStartedAt[currentExam.id] ? (
              <p>
                Таймер с{" "}
                {new Date(state.examStartedAt[currentExam.id]!).toLocaleTimeString("ru-RU", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
                , осталось{" "}
                {formatCountdown(
                  Math.max(0, currentExam.validation.durationMs - (Date.now() - state.examStartedAt[currentExam.id]!)),
                )}
              </p>
            ) : null}
          </section>
          <Button
            type="button"
            variant={state.timerBypass ? "gold" : "outline"}
            className={state.timerBypass ? undefined : "h-11 border-gold/40 text-ink hover:bg-festive/5 hover:text-burgundy"}
            aria-pressed={state.timerBypass}
            onClick={() => progress.setTimerBypass(!state.timerBypass)}
          >
            {state.timerBypass ? "Таймеры выключены" : "Выключить таймеры для проверки"}
          </Button>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" className="border-gold/40 text-ink" onClick={() => progress.jumpToScreen("welcome")}>
              На приветствие
            </Button>
            <Button type="button" variant="outline" className="border-gold/40 text-ink" onClick={() => progress.jumpToScreen("special")}>
              К допуску
            </Button>
            <Button type="button" variant="outline" className="border-gold/40 text-ink" onClick={() => progress.jumpToScreen("graduation")}>
              На выпуск
            </Button>
            <Button type="button" variant="outline" className="border-gold/40 text-ink" onClick={() => void copyAnswers()}>
              Скопировать ответы
            </Button>
          </div>
          {copyNote ? <p className="text-sm text-burgundy">{copyNote}</p> : null}
          <section className="space-y-2">
            <h3 className="font-display text-2xl text-ink">Ингредиенты алхимии</h3>
            <ul className="space-y-1 text-sm text-ink">
              {alchemyStudentLabels.map((label, index) => {
                const ingredient = findAlchemyIngredient(alchemySlots[index] ?? null);
                return (
                  <li key={label}>
                    {label}: {ingredient ? `${ingredient.title} — ${ingredient.answer}` : "не призван"}
                  </li>
                );
              })}
            </ul>
            <Button type="button" variant="outline" className="border-gold/40 text-ink" onClick={() => resetAlchemyAssignments()}>
              Сбросить ингредиенты
            </Button>
          </section>
          <section className="space-y-2">
            <h3 className="font-display text-2xl text-ink">Слова поздравлений</h3>
            <ul className="space-y-1 text-sm text-ink">
              {congratulationStudentLabels.map((label, index) => {
                const words = congratulationSlots[index];
                return (
                  <li key={label}>
                    {label}: {words ? words.join(", ") : "не выданы"}
                  </li>
                );
              })}
            </ul>
            <Button type="button" variant="outline" className="border-gold/40 text-ink" onClick={() => resetCongratulationWords()}>
              Сбросить слова
            </Button>
          </section>
          <section className="space-y-3">
            <h3 className="font-display text-2xl text-ink">Ответы и переходы</h3>
            <p className="text-sm text-ink/60">Допуск: {specialActivity.code}</p>
            {exams.map((exam, index) => {
              const done = state.completedExamIds.includes(exam.id);
              const validation = exam.validation;
              return (
                <article key={exam.id} className="rounded-2xl border border-gold/20 p-3">
                  <p className="text-sm text-festive">
                    {String(exam.number).padStart(2, "0")} {done ? "· сдано" : ""}
                  </p>
                  <p className="mt-1 text-ink">{exam.department}</p>
                  {validation.type === "COLOR_DIGITS" ? (
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {colorDigitFields.map((field) => (
                        <li
                          key={field.key}
                          className="flex items-center gap-2 rounded-full border bg-white/70 px-2.5 py-1 text-sm"
                          style={{ borderColor: field.border, color: field.ink }}
                        >
                          <span className="size-2.5 rounded-full" style={{ backgroundColor: field.accent }} aria-hidden="true" />
                          <span>
                            {field.label} {validation.digits[field.key]}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-sm text-burgundy">{describeValidation(validation)}</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button type="button" size="sm" variant="outline" className="border-gold/40 text-ink" onClick={() => progress.jumpToExam(index)}>
                      Перейти
                    </Button>
                    <Button type="button" size="sm" variant="outline" className="border-gold/40 text-ink" onClick={() => progress.markExamCompleted(exam.id)} disabled={done}>
                      Отметить сданным
                    </Button>
                  </div>
                </article>
              );
            })}
          </section>
          <section className="space-y-2 border-t border-gold/20 pt-4">
            <h3 className="font-display text-2xl text-ink">Сброс</h3>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="destructive" onClick={() => setPending("exam")} disabled={state.screen !== "exam"}>
                Сбросить этот экзамен
              </Button>
              <Button type="button" variant="destructive" onClick={() => setPending("all")}>
                Сбросить всю игру
              </Button>
            </div>
          </section>
        </div>
      </aside>
      <AlertDialog open={pending !== null} onOpenChange={(value) => !value && setPending(null)}>
        <AlertDialogContent className="bg-popover text-ink">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-ink">
              {pending === "all" ? "Сбросить всю игру?" : "Сбросить текущий экзамен?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-ink/70">
              {pending === "all"
                ? "Прогресс группы, таймеры и наборы слов будут удалены с этого ноутбука."
                : "Зачёт и таймер этого экзамена будут сняты. Остальная игра сохранится."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gold/40 text-ink">Оставить как есть</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (pending === "all") progress.resetAllProgress();
                if (pending === "exam") progress.resetCurrentExam();
                setPending(null);
              }}
            >
              Сбросить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
