import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent, type RefObject } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ExamSuccess } from "@/components/exams/ExamSuccess";
import { ExamTimer } from "@/components/exams/ExamTimer";
import { useExamTimer } from "@/hooks/useExamTimer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGameProgress } from "@/hooks/useGameProgress";
import { isSingleDigit, matchesCode, matchesColorDigits, matchesPhrase, matchesThree } from "@/lib/answerValidation";
import { colorDigitFields } from "@/data/colorDigitFields";
import type { ColorDigits } from "@/types/game";
import { WALKTHROUGH } from "@/lib/walkthrough";
import { rejectionLine } from "@/lib/format";
import { shakeElement } from "@/lib/motion";
import type { ExamDefinition } from "@/types/game";

const textSchema = z.object({
  answer: z.string().trim().min(1, "Пустой ответ кафедра не протоколирует.").max(80, "Ответ слишком длинный."),
});

const threeSchema = z.object({
  first: z.string().trim().min(1, "Назовите первое зелье.").max(80, "Слишком длинное название."),
  second: z.string().trim().min(1, "Назовите второе зелье.").max(80, "Слишком длинное название."),
  third: z.string().trim().min(1, "Назовите третье зелье.").max(80, "Слишком длинное название."),
});

const timedSchema = z.object({
  confirmed: z.boolean().refine((value) => value, { message: "Подтверждение ещё закрыто." }),
});

function nextLabel(examNumber: number): string {
  if (examNumber < 7) return "Следующая кафедра";
  if (examNumber === 7) return "К поиску допуска";
  return "На выпускную церемонию";
}

function hint(exam: ExamDefinition): string {
  switch (exam.validation.type) {
    case "NUMERIC_CODE":
      return "Введите цифровой код. Пробелы кафедра не считает.";
    case "COLOR_DIGITS":
      return "Введите четыре цифры в соответствии с цветами найденных бумажек.";
    case "SECRET_WORD":
      return "Введите секретное слово. Регистр и буква ё не имеют значения.";
    case "SECRET_PHRASE":
      return "Введите секретную фразу. Регистр, лишние пробелы и буква ё не имеют значения.";
    case "THREE_TEXT_ANSWERS":
      return exam.validation.orderMatters
        ? "Впишите три названия в порядке полей."
        : "Впишите три названия в любом порядке.";
    case "TIMED_COMPLETION":
      return "Кнопка откроется, когда кафедра отпустит три минуты.";
  }
}

export function ExamSubmissionDialog({
  exam,
  open,
  onOpenChange,
}: {
  exam: ExamDefinition;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { state, completeExam, advanceAfterExam } = useGameProgress();
  const passed = state.completedExamIds.includes(exam.id);
  const [leaving, setLeaving] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const lock = useRef(false);

  function goNext() {
    if (leaving) return;
    setLeaving(true);
    advanceAfterExam(exam.number - 1);
  }

  function reject() {
    setMessage(rejectionLine(attempt));
    setAttempt((value) => value + 1);
    shakeElement(formRef.current);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={
          exam.validation.type === "COLOR_DIGITS"
            ? "bg-popover text-ink sm:max-w-2xl"
            : "bg-popover text-ink sm:max-w-lg"
        }
      >
        <DialogHeader>
          <DialogTitle className="font-display text-3xl text-ink">
            {passed ? "Зачёт поставлен" : "Сдача экзамена"}
          </DialogTitle>
          <DialogDescription className="text-ink/70">
            {passed ? "Ведомость уже обновлена." : hint(exam)}
          </DialogDescription>
        </DialogHeader>
        {passed ? (
          <ExamSuccess nextLabel={nextLabel(exam.number)} onNext={goNext} pending={leaving} />
        ) : (
          <AnswerForm
            exam={exam}
            formRef={formRef}
            message={message}
            lock={lock}
            onReject={reject}
            onAccept={() => {
              if (lock.current) return;
              lock.current = true;
              completeExam(exam.id);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function AnswerForm({
  exam,
  formRef,
  message,
  lock,
  onReject,
  onAccept,
}: {
  exam: ExamDefinition;
  formRef: RefObject<HTMLFormElement | null>;
  message: string | null;
  lock: RefObject<boolean>;
  onReject: () => void;
  onAccept: () => void;
}) {
  const validation = exam.validation;
  if (validation.type === "COLOR_DIGITS") {
    return (
      <ColorDigitsForm
        formRef={formRef}
        digits={validation.digits}
        lock={lock}
        onAccept={onAccept}
      />
    );
  }
  if (validation.type === "THREE_TEXT_ANSWERS") {
    return (
      <ThreeAnswersForm
        formRef={formRef}
        message={message}
        labels={validation.labels}
        answers={validation.answers}
        orderMatters={validation.orderMatters}
        lock={lock}
        onReject={onReject}
        onAccept={onAccept}
      />
    );
  }
  if (validation.type === "TIMED_COMPLETION") {
    return (
      <TimedForm
        examId={exam.id}
        durationMs={validation.durationMs}
        formRef={formRef}
        lock={lock}
        onAccept={onAccept}
      />
    );
  }
  return (
    <TextAnswerForm
      formRef={formRef}
      message={message}
      numeric={validation.type === "NUMERIC_CODE"}
      lock={lock}
      onReject={onReject}
      onAccept={onAccept}
      isMatch={(value) =>
        validation.type === "NUMERIC_CODE" ? matchesCode(value, validation.code) : matchesPhrase(value, validation.answers)
      }
    />
  );
}

const emptyDigits: ColorDigits = { red: "", blue: "", yellow: "", green: "" };

function ColorDigitsForm({
  formRef,
  digits,
  lock,
  onAccept,
}: {
  formRef: RefObject<HTMLFormElement | null>;
  digits: ColorDigits;
  lock: RefObject<boolean>;
  onAccept: () => void;
}) {
  const [values, setValues] = useState<ColorDigits>(emptyDigits);
  const [message, setMessage] = useState<string | null>(null);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  function focusAt(index: number) {
    inputs.current[index]?.focus();
  }

  function writeDigit(index: number, raw: string) {
    const key = colorDigitFields[index]?.key;
    if (!key) return;
    const digit = raw.replace(/\D/g, "").slice(-1);
    setValues((current) => ({ ...current, [key]: digit }));
    setMessage(null);
    if (digit && index < colorDigitFields.length - 1) focusAt(index + 1);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>, index: number) {
    const key = colorDigitFields[index]?.key;
    if (!key) return;
    if (event.key === "Backspace" && values[key] === "" && index > 0) {
      event.preventDefault();
      focusAt(index - 1);
    }
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusAt(index - 1);
    }
    if (event.key === "ArrowRight" && index < colorDigitFields.length - 1) {
      event.preventDefault();
      focusAt(index + 1);
    }
  }

  function onPaste(event: ClipboardEvent<HTMLInputElement>, index: number) {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "");
    if (pasted.length <= 1) return;
    event.preventDefault();
    setValues((current) => {
      const next = { ...current };
      colorDigitFields.forEach((field, fieldIndex) => {
        const digit = pasted[fieldIndex - index];
        if (fieldIndex >= index && digit) next[field.key] = digit;
      });
      return next;
    });
    setMessage(null);
    focusAt(Math.min(colorDigitFields.length - 1, index + pasted.length));
  }

  return (
    <form
      ref={formRef}
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (lock.current) return;
        if (WALKTHROUGH) {
          onAccept();
          return;
        }
        const incomplete = colorDigitFields.some((field) => !isSingleDigit(values[field.key]));
        if (incomplete) {
          setMessage("Профессор Прицелов насчитал только часть шифра. Где остальные цифры?");
          return;
        }
        if (!matchesColorDigits(values, digits)) {
          setMessage("Мимо цели! Профессор рекомендует ещё раз проверить цвета и цифры.");
          shakeElement(formRef.current);
          return;
        }
        onAccept();
      }}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {colorDigitFields.map((field, index) => (
          <div key={field.key} className="space-y-2">
            <label htmlFor={`digit-${field.key}`} className="block text-center text-sm font-medium" style={{ color: field.ink }}>
              {field.label}
            </label>
            <input
              ref={(node) => {
                inputs.current[index] = node;
              }}
              id={`digit-${field.key}`}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              maxLength={1}
              pattern="[0-9]"
              enterKeyHint={index === colorDigitFields.length - 1 ? "done" : "next"}
              aria-label={field.label}
              value={values[field.key]}
              autoFocus={index === 0}
              onChange={(event) => writeDigit(index, event.target.value)}
              onKeyDown={(event) => onKeyDown(event, index)}
              onPaste={(event) => onPaste(event, index)}
              className="h-16 w-full rounded-xl border-2 text-center font-display text-3xl text-[#3A241C] transition outline-offset-2 focus-visible:outline-2"
              style={{
                borderColor: field.border,
                backgroundColor: field.wash,
                boxShadow: `inset 0 4px 0 ${field.accent}`,
                outlineColor: field.border,
              }}
            />
          </div>
        ))}
      </div>
      {message ? (
        <p role="alert" className="text-sm leading-relaxed text-burgundy">
          {message}
        </p>
      ) : null}
      <Button type="submit" variant="gold" size="academy" className="w-full">
        Проверить шифр
      </Button>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-sm text-burgundy">
      {message}
    </p>
  );
}

function TextAnswerForm({
  formRef,
  message,
  numeric,
  lock,
  onReject,
  onAccept,
  isMatch,
}: {
  formRef: RefObject<HTMLFormElement | null>;
  message: string | null;
  numeric: boolean;
  lock: RefObject<boolean>;
  onReject: () => void;
  onAccept: () => void;
  isMatch: (value: string) => boolean;
}) {
  const form = useForm<z.infer<typeof textSchema>>({
    resolver: zodResolver(textSchema),
    defaultValues: { answer: "" },
  });

  return (
    <form
      ref={formRef}
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (lock.current) return;
        if (WALKTHROUGH) {
          onAccept();
          return;
        }
        void form.handleSubmit((values) => {
          if (!isMatch(values.answer)) {
            onReject();
            return;
          }
          onAccept();
        })(event);
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="exam-answer">{numeric ? "Код" : "Ответ"}</Label>
        <Input
          id="exam-answer"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          inputMode={numeric ? "numeric" : "text"}
          className="h-11 text-base"
          aria-invalid={Boolean(form.formState.errors.answer) || undefined}
          {...form.register("answer")}
        />
        <FieldError message={form.formState.errors.answer?.message} />
      </div>
      {message ? (
        <p role="alert" className="text-sm leading-relaxed text-burgundy">
          {message}
        </p>
      ) : null}
      <Button type="submit" variant="gold" size="academy" className="w-full">
        Проверить ответ
      </Button>
    </form>
  );
}

function ThreeAnswersForm({
  formRef,
  message,
  labels,
  answers,
  orderMatters,
  lock,
  onReject,
  onAccept,
}: {
  formRef: RefObject<HTMLFormElement | null>;
  message: string | null;
  labels: readonly [string, string, string];
  answers: readonly [string, string, string];
  orderMatters: boolean;
  lock: RefObject<boolean>;
  onReject: () => void;
  onAccept: () => void;
}) {
  const form = useForm<z.infer<typeof threeSchema>>({
    resolver: zodResolver(threeSchema),
    defaultValues: { first: "", second: "", third: "" },
  });
  const fields = [
    ["first", labels[0]],
    ["second", labels[1]],
    ["third", labels[2]],
  ] as const;

  return (
    <form
      ref={formRef}
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (lock.current) return;
        if (WALKTHROUGH) {
          onAccept();
          return;
        }
        void form.handleSubmit((values) => {
          const ok = matchesThree([values.first, values.second, values.third], answers, orderMatters);
          if (!ok) {
            onReject();
            return;
          }
          onAccept();
        })(event);
      }}
    >
      {fields.map(([name, label]) => (
        <div key={name} className="space-y-2">
          <Label htmlFor={name}>{label}</Label>
          <Input
            id={name}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Введите название"
            className="h-12 border-2 border-[#D7AD62] bg-white px-3 text-base text-[#3A241C] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] placeholder:text-[#493B35]/45"
            {...form.register(name)}
          />
          <FieldError message={form.formState.errors[name]?.message} />
        </div>
      ))}
      {message ? (
        <p role="alert" className="text-sm leading-relaxed text-burgundy">
          {message}
        </p>
      ) : null}
      <Button type="submit" variant="gold" size="academy" className="w-full">
        Проверить зелья
      </Button>
    </form>
  );
}

function TimedForm({
  examId,
  durationMs,
  formRef,
  lock,
  onAccept,
}: {
  examId: string;
  durationMs: number;
  formRef: RefObject<HTMLFormElement | null>;
  lock: RefObject<boolean>;
  onAccept: () => void;
}) {
  const timer = useExamTimer(examId, durationMs, true);
  const form = useForm<z.infer<typeof timedSchema>>({
    resolver: zodResolver(timedSchema),
    defaultValues: { confirmed: false },
  });

  useEffect(() => {
    form.setValue("confirmed", timer.ready, { shouldValidate: false });
  }, [form, timer.ready]);

  return (
    <form
      ref={formRef}
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (lock.current) return;
        if (WALKTHROUGH || timer.ready) onAccept();
      }}
    >
      <ExamTimer examId={examId} durationMs={durationMs} enabled compact />
      <FieldError message={form.formState.errors.confirmed?.message} />
      <Button type="submit" variant="gold" size="academy" className="w-full" disabled={!WALKTHROUGH && !timer.ready}>
        Подтвердить выполнение
      </Button>
    </form>
  );
}
