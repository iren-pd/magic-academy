export function formatExamCounter(number: number, total: number): string {
  return `ЭКЗАМЕН ${String(number).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
}

export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export const rejectionLines = [
  "Учёный совет сдержанно кашляет и предлагает попробовать снова.",
  "Печать академии отказалась поставить оттиск.",
  "Ответ занесён в протокол как «творческий, но неверный».",
  "Кафедра делает вид, что ничего не слышала. Ещё одна попытка.",
  "Мантия преподавателя выразительно вздыхает.",
  "Почти магия. В зачётную ведомость это пока не записывают.",
] as const;

export function rejectionLine(attempt: number): string {
  return rejectionLines[attempt % rejectionLines.length] ?? rejectionLines[0];
}
