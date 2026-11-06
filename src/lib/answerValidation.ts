import { exams } from "@/data/exams";
import { specialActivity } from "@/data/specialActivity";
import type { ColorDigits, ExamValidation } from "@/types/game";

export function normalizePhrase(value: string): string {
  return value.trim().toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ");
}

export function normalizeAnswer(value: string): string {
  return value
    .toLocaleLowerCase("ru-RU")
    .replace(/ё/g, "е")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeCode(value: string): string {
  return value.replace(/\s+/g, "").replace(/ё/g, "е").toLowerCase();
}

export function matchesPhrase(value: string, answers: readonly string[]): boolean {
  const normalized = normalizePhrase(value);
  const loose = normalizeAnswer(value);
  return answers.some((answer) => {
    if (normalizePhrase(answer) === normalized) return true;
    if (!/[^\p{L}\p{N}\s]/u.test(answer)) return false;
    return normalizeAnswer(answer) === loose;
  });
}

export function matchesCode(value: string, expected: string): boolean {
  return normalizeCode(value) === normalizeCode(expected);
}

export function isSingleDigit(value: string): boolean {
  return /^[0-9]$/.test(value);
}

export function matchesColorDigits(values: ColorDigits, expected: ColorDigits): boolean {
  return (
    values.red === expected.red &&
    values.blue === expected.blue &&
    values.yellow === expected.yellow &&
    values.green === expected.green
  );
}

export function matchesThree(
  values: readonly [string, string, string],
  expected: readonly [string, string, string],
  orderMatters: boolean,
): boolean {
  const received = values.map(normalizePhrase);
  const answers = expected.map(normalizePhrase);
  if (received.some((value) => value.length === 0)) return false;
  if (orderMatters) {
    return received.every((value, index) => value === answers[index]);
  }

  const remaining = [...answers];
  for (const value of received) {
    const index = remaining.indexOf(value);
    if (index === -1) return false;
    remaining.splice(index, 1);
  }
  return remaining.length === 0;
}

export function describeValidation(validation: ExamValidation): string {
  switch (validation.type) {
    case "NUMERIC_CODE":
      return validation.code;
    case "COLOR_DIGITS":
      return `красный ${validation.digits.red} · синий ${validation.digits.blue} · жёлтый ${validation.digits.yellow} · зелёный ${validation.digits.green}`;
    case "SECRET_WORD":
    case "SECRET_PHRASE":
      return validation.answers.join(" · ");
    case "THREE_TEXT_ANSWERS":
      return `${validation.answers.join(" · ")} (${validation.orderMatters ? "порядок важен" : "порядок не важен"})`;
    case "TIMED_COMPLETION":
      return `подтверждение после ${Math.round(validation.durationMs / 60000)} мин.`;
  }
}

export function describeAllAnswers(): string {
  const examLines = exams.map(
    (exam) => `${exam.number}. ${exam.department}: ${describeValidation(exam.validation)}`,
  );
  return [...examLines, `Допуск: ${specialActivity.code}`, `Загадка допуска: ${specialActivity.riddle}`].join("\n");
}

