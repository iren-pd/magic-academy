import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DirectorScene } from "@/components/characters/DirectorScene";
import { AcademyHeader } from "@/components/layout/AcademyHeader";
import { specialActivity } from "@/data/specialActivity";
import { useGameProgress } from "@/hooks/useGameProgress";
import { matchesCode } from "@/lib/answerValidation";
import { WALKTHROUGH } from "@/lib/walkthrough";
import { rejectionLine } from "@/lib/format";
import { animateEntrance, shakeElement } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  answer: z.string().trim().min(1, "Введите код из конверта.").max(32, "Код слишком длинный."),
});

export function SpecialActivityPage() {
  const { state, completeSpecial, continueToElementsExam } = useGameProgress();
  const rootRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [showPrivate, setShowPrivate] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const lock = useRef(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { answer: "" },
  });

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;
    const context = animateEntrance(element);
    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} className="flex h-full min-h-0 flex-col">
      <AcademyHeader kicker="Перед последней кафедрой" />
      <main id="main" className="special-grid grid min-h-0 flex-1 grid-rows-[minmax(0,16%)_minmax(0,1fr)] gap-2 pb-2 lg:grid-rows-1 lg:grid-cols-[minmax(150px,26%)_minmax(0,1fr)] lg:gap-6">
        <DirectorScene />
        <section data-enter="right" className="flex min-h-0 flex-col gap-1.5 overflow-y-auto lg:gap-2">
          <div className="shrink-0">
            <p className="text-[11px] tracking-[0.18em] text-festive uppercase">Объявление академии · не экзамен</p>
            <h1 className="mt-1 font-display text-2xl leading-none text-ink lg:text-4xl">{specialActivity.title}</h1>
            <p className="mt-1 text-sm leading-snug text-ink/85">{specialActivity.announcement}</p>
          </div>
          <div className="grid min-h-0 gap-2 lg:grid-cols-2">
            <ol className="glass-panel space-y-1.5 rounded-2xl px-3 py-2.5">
              {specialActivity.steps.map((step, index) => (
                <li key={step} className="flex gap-2 text-sm leading-snug text-ink">
                  <span className="font-display text-lg leading-none text-festive">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <blockquote className="glass-panel rounded-2xl px-3 py-2.5">
              <p className="text-[11px] tracking-[0.16em] text-festive uppercase">Загадка</p>
              <p className="mt-1 font-display text-lg leading-snug text-ink">{specialActivity.riddle}</p>
            </blockquote>
          </div>
          <div className="grid min-h-0 gap-2 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="rounded-2xl border border-gold/20 px-3 py-2.5">
              <Button type="button" variant="outline" className="h-9 rounded-full border-gold/40 px-4 text-sm text-ink hover:bg-festive/5 hover:text-burgundy" onClick={() => setShowPrivate((value) => !value)} aria-expanded={showPrivate}>
                {showPrivate ? "Скрыть инструкцию" : "Инструкция оставшемуся"}
              </Button>
              <p className="mt-1.5 text-xs text-ink/60">Не открывать тем, кто идёт искать конверт.</p>
              {showPrivate ? <p className="mt-2 text-sm leading-snug text-ink">{specialActivity.privateNote}</p> : null}
            </div>
            {state.specialCompleted ? (
              <div className="glass-panel flex flex-col justify-center rounded-2xl px-4 py-3">
                <p className="font-display text-2xl text-ink">Допуск найден</p>
                <p className="mt-1 text-sm text-ink/75">Кафедра управления стихиями открыта.</p>
                <Button
                  type="button"
                  variant="gold"
                  size="academy"
                  className="mt-3 w-fit"
                  disabled={leaving}
                  onClick={() => {
                    if (leaving) return;
                    setLeaving(true);
                    continueToElementsExam();
                  }}
                >
                  На кафедру управления стихиями
                </Button>
              </div>
            ) : (
              <form
                ref={formRef}
                className="glass-panel space-y-2 rounded-2xl px-4 py-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (lock.current) return;
                  if (WALKTHROUGH) {
                    lock.current = true;
                    completeSpecial();
                    return;
                  }
                  void form.handleSubmit((values) => {
                    if (!matchesCode(values.answer, specialActivity.code)) {
                      setMessage(rejectionLine(attempt));
                      setAttempt((value) => value + 1);
                      shakeElement(formRef.current);
                      return;
                    }
                    lock.current = true;
                    completeSpecial();
                  })(event);
                }}
              >
                <div className="space-y-1.5">
                  <Label htmlFor="permit-code">Код из конверта</Label>
                  <Input
                    id="permit-code"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    inputMode="numeric"
                    className="h-10 text-base"
                    {...form.register("answer")}
                  />
                  {form.formState.errors.answer ? (
                    <p role="alert" className="text-sm text-burgundy">
                      {form.formState.errors.answer.message}
                    </p>
                  ) : null}
                </div>
                {message ? (
                  <p role="alert" className="text-sm leading-snug text-burgundy">
                    {message}
                  </p>
                ) : null}
                <Button type="submit" variant="gold" size="academy">
                  Сдать допуск
                </Button>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
