import { formatCountdown } from "@/lib/format";
import { useExamTimer } from "@/hooks/useExamTimer";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function ExamTimer({
  examId,
  durationMs,
  enabled,
  compact = false,
  ignoreWalkthrough = false,
}: {
  examId: string;
  durationMs: number;
  enabled: boolean;
  compact?: boolean;
  ignoreWalkthrough?: boolean;
}) {
  const timer = useExamTimer(examId, durationMs, enabled, ignoreWalkthrough);

  return (
    <div className={cn("glass-panel flex items-center gap-4 rounded-2xl px-4 py-2.5", compact && "flex-col items-stretch")} aria-live="polite">
      <p className={cn("shrink-0 font-display leading-none text-ink", compact ? "text-4xl" : "text-3xl")}>
        {timer.ready ? "Можно подтверждать" : formatCountdown(timer.remainingMs)}
      </p>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] tracking-[0.16em] text-festive uppercase">Время кафедры</p>
        <Progress value={timer.progress * 100} className="mt-1.5 h-1.5 bg-burgundy/10" />
        <p className="mt-1 hidden text-xs leading-snug text-ink/75 sm:block">
          {timer.ready
            ? "Три минуты прошли. Подтвердите выполнение, когда группа закончила."
            : "Отсчёт уже идёт и сохранится после обновления страницы."}
        </p>
      </div>
    </div>
  );
}
